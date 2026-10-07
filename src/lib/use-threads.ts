"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Message, Thread } from "./types";
import { titleFrom, uid } from "./utils";

// Storage keys keep the pre-rename prefix on purpose. They are invisible to the
// user, and changing them would silently drop the conversation history of
// anyone who used the app before the rebrand — a real cost for zero benefit.
const THREADS_KEY = "jaynepal.threads.v1";
const ACTIVE_KEY = "jaynepal.active.v1";

/**
 * Conversation store, backed by localStorage.
 *
 * Deliberately not a context provider or a state library: there is exactly one
 * consumer tree and no server state to reconcile, so a hook keeps the data flow
 * readable. Persistence is the only real requirement — losing a conversation on
 * refresh is the fastest way to make a chat tool feel like a toy.
 */
export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  // Mirror of `threads` readable synchronously. The send handler needs the
  // current history at the moment it fires, and React state is not available
  // synchronously once a new thread has been queued in the same tick.
  const threadsRef = useRef<Thread[]>([]);
  // Server render cannot know what is in localStorage. Gate the UI on this so
  // the first paint matches the server and React does not hydrate a mismatch.
  const [hydrated, setHydrated] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    try {
      const raw = localStorage.getItem(THREADS_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : null;
      const list = Array.isArray(parsed)
        ? (parsed as Thread[]).filter(
            (t) => t && typeof t.id === "string" && Array.isArray(t.messages),
          )
        : [];
      setThreads(list);

      const savedActive = localStorage.getItem(ACTIVE_KEY);
      setActiveId(
        savedActive && list.some((t) => t.id === savedActive)
          ? savedActive
          : (list[0]?.id ?? null),
      );
    } catch {
      // Corrupt or unreadable storage should degrade to "no history", not to a
      // crashed app. The old value is left in place so it can be recovered.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    threadsRef.current = threads;
  }, [threads]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
    } catch {
      // Quota exceeded. The session still works; it just will not survive a
      // refresh. Carrying on quietly is preferable to blocking the send button.
    }
  }, [threads, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (activeId) localStorage.setItem(ACTIVE_KEY, activeId);
      else localStorage.removeItem(ACTIVE_KEY);
    } catch {
      /* see above */
    }
  }, [activeId, hydrated]);

  const active = threads.find((t) => t.id === activeId) ?? null;

  const createThread = useCallback((): string => {
    const now = Date.now();
    const t: Thread = {
      id: uid(),
      title: "New chat",
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    setThreads((prev) => [t, ...prev]);
    setActiveId(t.id);
    return t.id;
  }, []);

  /** Returns the id of a usable thread, creating one if none exists. */
  const ensureThread = useCallback((): string => {
    if (activeId && threads.some((t) => t.id === activeId)) return activeId;
    return createThread();
  }, [activeId, threads, createThread]);

  const patchThread = useCallback(
    (id: string, fn: (t: Thread) => Thread) => {
      setThreads((prev) => prev.map((t) => (t.id === id ? fn(t) : t)));
    },
    [],
  );

  const appendMessage = useCallback(
    (threadId: string, msg: Message) => {
      patchThread(threadId, (t) => {
        // The first user message names the thread. Doing it here rather than in
        // the send handler means the title is correct even for a turn that
        // fails before it reaches the network.
        const title =
          t.messages.length === 0 && msg.role === "user"
            ? titleFrom(msg.content)
            : t.title;
        return {
          ...t,
          title,
          messages: [...t.messages, msg],
          updatedAt: Date.now(),
        };
      });
    },
    [patchThread],
  );

  const updateMessage = useCallback(
    (threadId: string, messageId: string, patch: Partial<Message>) => {
      patchThread(threadId, (t) => ({
        ...t,
        messages: t.messages.map((m) =>
          m.id === messageId ? { ...m, ...patch } : m,
        ),
        updatedAt: Date.now(),
      }));
    },
    [patchThread],
  );

  /** Drop everything from the last user turn onwards — used by regenerate. */
  const truncateFrom = useCallback(
    (threadId: string, messageId: string) => {
      patchThread(threadId, (t) => {
        const i = t.messages.findIndex((m) => m.id === messageId);
        if (i === -1) return t;
        return { ...t, messages: t.messages.slice(0, i), updatedAt: Date.now() };
      });
    },
    [patchThread],
  );

  const removeThread = useCallback((id: string) => {
    setThreads((prev) => {
      const next = prev.filter((t) => t.id !== id);
      setActiveId((cur) => (cur === id ? (next[0]?.id ?? null) : cur));
      return next;
    });
  }, []);

  /**
   * Synchronous read of a thread's messages. Returns [] for a thread that was
   * created in the same tick and has not rendered yet — which is exactly right
   * for a brand-new conversation.
   */
  const getMessages = useCallback(
    (threadId: string): Message[] =>
      threadsRef.current.find((t) => t.id === threadId)?.messages ?? [],
    [],
  );

  /** History for the model: text turns only, no failures, no empty replies. */
  const getHistory = useCallback(
    (threadId: string) =>
      getMessages(threadId)
        .filter(
          (m) =>
            (m.role === "user" || m.role === "assistant") &&
            m.status !== "error" &&
            m.content.trim().length > 0,
        )
        .map((m) => ({ role: m.role, content: m.content })),
    [getMessages],
  );

  const clearMessages = useCallback(
    (threadId: string) => {
      patchThread(threadId, (t) => ({
        ...t,
        messages: [],
        title: "New chat",
        updatedAt: Date.now(),
      }));
    },
    [patchThread],
  );

  return {
    threads,
    active,
    activeId,
    hydrated,
    createThread,
    ensureThread,
    setActiveId,
    appendMessage,
    updateMessage,
    truncateFrom,
    removeThread,
    clearMessages,
    getMessages,
    getHistory,
  };
}
