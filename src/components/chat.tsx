"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ExternalLink, Menu } from "lucide-react";
import { Composer } from "./composer";
import { EmptyState } from "./empty-state";
import { Sidebar } from "./sidebar";
import { Turn } from "./turn";
import { useThreads } from "@/lib/use-threads";
import { cn, uid } from "@/lib/utils";
import type { EndpointStatus, Message } from "@/lib/types";

const WEBSITE = "https://samirpuri.com.np";
/** Distance from the bottom (px) still treated as "following the reply". */
const STICK_THRESHOLD = 120;

export function ChatApp() {
  const {
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
    getHistory,
  } = useThreads();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [status, setStatus] = useState<EndpointStatus | null>(null);
  const [stuck, setStuck] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const followingRef = useRef(true);

  /* ---------------------------------------------------------------- health --
     Polled rather than assumed. The inference server runs behind a temporary
     tunnel and genuinely is not always up, so the UI reports what it finds
     instead of failing confusingly on the first message. */
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      setStatus((await res.json()) as EndpointStatus);
    } catch {
      setStatus({
        configured: true,
        reachable: false,
        detail: "This app's own API route did not respond.",
      });
    }
  }, []);

  useEffect(() => {
    void checkHealth();
    const id = window.setInterval(checkHealth, 30_000);
    return () => window.clearInterval(id);
  }, [checkHealth]);

  /* ---------------------------------------------------------------- scroll --
     Follow the reply only while the user is already at the bottom. If they
     scroll up to read something, yanking them back down on the next token is
     the single most irritating thing a streaming chat UI can do. */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !followingRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [active?.messages]);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distance < STICK_THRESHOLD;
    followingRef.current = atBottom;
    setStuck(!atBottom);
  }, []);

  const jumpToNewest = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    followingRef.current = true;
    setStuck(false);
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, []);

  /* ----------------------------------------------------------------- send -- */
  const run = useCallback(
    async (threadId: string, history: { role: string; content: string }[]) => {
      const replyId = uid();
      const reply: Message = {
        id: replyId,
        role: "assistant",
        content: "",
        status: "streaming",
        createdAt: Date.now(),
      };
      appendMessage(threadId, reply);

      followingRef.current = true;
      setStuck(false);
      setStreaming(true);

      const ctrl = new AbortController();
      abortRef.current = ctrl;

      let acc = "";
      let timer: number | null = null;
      let settled = false;

      // Throttled with setTimeout, deliberately NOT requestAnimationFrame.
      //
      // rAF is paused outright while a document is hidden. A reply that streams
      // while the user is on another tab would therefore accumulate in `acc`
      // with nothing ever flushed, and they would return to find the whole
      // answer already complete — the stream appearing as one atomic block.
      // A timer keeps firing when backgrounded (coarsened by the browser to
      // roughly once a second), so the text still lands progressively. Coarser
      // updates beat no updates.
      const FLUSH_MS = 40;

      const flush = () => {
        timer = null;
        updateMessage(threadId, replyId, { content: acc });
      };

      const push = (text: string) => {
        acc += text;
        if (settled || timer !== null) return;
        timer = window.setTimeout(flush, FLUSH_MS);
      };

      // Cancel any in-flight flush before the terminal write, so a queued timer
      // cannot land after it and re-open a message that is already finished.
      const settle = () => {
        settled = true;
        if (timer !== null) {
          window.clearTimeout(timer);
          timer = null;
        }
      };

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, stream: true }),
          signal: ctrl.signal,
        });

        if (!res.ok || !res.body) {
          const payload = await res.json().catch(() => null);
          throw new Error(
            payload?.error?.message ?? `Request failed with ${res.status}.`,
          );
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let finished = false;

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          // {stream:true} keeps multi-byte characters whole across chunk
          // boundaries. Devanagari hits those boundaries constantly.
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const raw of lines) {
            const line = raw.trim();
            if (!line.startsWith("data:")) continue;
            let evt: { type?: string; text?: string; message?: string };
            try {
              evt = JSON.parse(line.slice(5).trim());
            } catch {
              continue;
            }
            if (evt.type === "delta" && typeof evt.text === "string") {
              push(evt.text);
            } else if (evt.type === "error") {
              throw new Error(evt.message || "The model stream failed.");
            } else if (evt.type === "done") {
              finished = true;
            }
          }
          if (finished) break;
        }

        settle();
        updateMessage(threadId, replyId, {
          content: acc,
          status: acc.trim() ? "complete" : "error",
          ...(acc.trim() ? {} : { error: "The model returned an empty reply." }),
        });
        if (!acc.trim()) void checkHealth();
      } catch (err) {
        const aborted = ctrl.signal.aborted;
        settle();
        updateMessage(threadId, replyId, {
          content: acc,
          status: aborted ? "stopped" : "error",
          ...(aborted
            ? {}
            : {
                error:
                  err instanceof Error ? err.message : "Something went wrong.",
              }),
        });
        // A failure is often the endpoint going away mid-conversation, so
        // re-check rather than leaving a stale "connected" badge on screen.
        if (!aborted) void checkHealth();
      } finally {
        abortRef.current = null;
        setStreaming(false);
      }
    },
    [appendMessage, updateMessage, checkHealth],
  );

  const send = useCallback(
    (text: string) => {
      if (streaming) return;
      const threadId = ensureThread();
      // Read history before appending, so the new user turn is added exactly
      // once rather than twice.
      const history = getHistory(threadId);
      const userMsg: Message = {
        id: uid(),
        role: "user",
        content: text,
        status: "complete",
        createdAt: Date.now(),
      };
      appendMessage(threadId, userMsg);
      void run(threadId, [
        ...history,
        { role: "user", content: text },
      ]);
    },
    [streaming, ensureThread, getHistory, appendMessage, run],
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const regenerate = useCallback(
    (messageId: string) => {
      if (streaming || !activeId) return;
      const msgs = active?.messages ?? [];
      const idx = msgs.findIndex((m) => m.id === messageId);
      if (idx === -1) return;

      // Trim the failed/old reply and everything after it, then re-ask with the
      // user turn that preceded it.
      const history = msgs
        .slice(0, idx)
        .filter(
          (m) =>
            (m.role === "user" || m.role === "assistant") &&
            m.status !== "error" &&
            m.content.trim().length > 0,
        )
        .map((m) => ({ role: m.role, content: m.content }));

      if (history.length === 0) return;
      truncateFrom(activeId, messageId);
      void run(activeId, history);
    },
    [streaming, activeId, active, truncateFrom, run],
  );

  const newChat = useCallback(() => {
    createThread();
    setDrawerOpen(false);
  }, [createThread]);

  const disabled = status !== null && (!status.configured || !status.reachable);
  const messages = active?.messages ?? [];
  const lastAssistantId = [...messages]
    .reverse()
    .find((m) => m.role === "assistant")?.id;

  /* ---------------------------------------------------------------- render -- */
  if (!hydrated) {
    // Skeleton, not a spinner: the shape of the app appears immediately and
    // nothing shifts when the real content lands (CLS stays at 0).
    return (
      <div className="app-shell flex">
        <div className="hidden w-[272px] shrink-0 border-r border-[var(--border)] bg-[var(--surface)] lg:block" />
        <div className="flex flex-1 flex-col">
          <div className="h-14 border-b border-[var(--border)]" />
          <div className="flex-1" />
          <div className="mx-auto mb-6 h-[104px] w-full max-w-[46rem] px-4 sm:px-6">
            <div className="h-full w-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell flex">
      <a
        href="#thread"
        className={cn(
          "sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100]",
          "focus:rounded-md focus:bg-[var(--btn-primary-bg)] focus:px-3 focus:py-2",
          "focus:text-sm focus:font-medium focus:text-[var(--btn-primary-fg)]",
        )}
      >
        Skip to conversation
      </a>

      <Sidebar
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        threads={threads}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          setDrawerOpen(false);
        }}
        onNew={newChat}
        onDelete={removeThread}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* ------------------------------------------------------- header --- */}
        <header className="sticky top-0 z-[10] flex h-14 shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--bg)]/95 px-3 backdrop-blur-sm sm:px-4">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open conversation list"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-md text-[var(--muted)] transition-colors duration-150 hover:bg-[var(--surface-2)] hover:text-[var(--fg)] lg:hidden"
          >
            <Menu size={18} aria-hidden="true" />
          </button>

          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-mono text-[13px] font-medium tracking-tight">
              Jaynepal 1.1
            </span>
            <span className="hidden truncate font-mono text-[11px] text-[var(--faint)] sm:inline">
              {active?.title && active.title !== "New chat"
                ? `— ${active.title}`
                : ""}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <StatusPill status={status} />
            <a
              href={WEBSITE}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 text-[12.5px] text-[var(--muted)] transition-colors duration-150 hover:text-[var(--accent-text)] sm:flex"
            >
              samirpuri.com.np
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          </div>
        </header>

        {/* ------------------------------------------------------- thread --- */}
        <div
          id="thread"
          ref={scrollRef}
          onScroll={onScroll}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          {messages.length === 0 ? (
            <EmptyState onPick={send} />
          ) : (
            <div className="mx-auto w-full max-w-[46rem] py-2">
              {messages.map((m) => (
                <Turn
                  key={m.id}
                  message={m}
                  isLast={m.id === lastAssistantId}
                  onRegenerate={
                    m.role === "assistant"
                      ? () => regenerate(m.id)
                      : undefined
                  }
                />
              ))}
              {/* Reserve space so the last turn is never hidden behind the
                  composer, and so the scroll height is stable as it streams. */}
              <div className="h-4" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* ------------------------------------------------ jump to newest --- */}
        {stuck && (
          <div className="relative">
            <button
              type="button"
              onClick={jumpToNewest}
              className={cn(
                "absolute -top-12 left-1/2 z-[10] flex -translate-x-1/2 items-center gap-1.5",
                "cursor-pointer rounded-full border border-[var(--border-strong)]",
                "bg-[var(--surface-2)] px-3 py-1.5 text-[12px] text-[var(--fg)]",
                "shadow-lg transition-colors duration-150 hover:bg-[var(--surface-3)]",
              )}
            >
              <ArrowDown size={13} aria-hidden="true" />
              Jump to newest
            </button>
          </div>
        )}

        <Composer
          onSend={send}
          onStop={stop}
          streaming={streaming}
          disabled={disabled}
          disabledReason={
            status && !status.configured
              ? "No model endpoint is configured on the server yet."
              : "The model server is offline — this page will reconnect automatically."
          }
        />
      </main>
    </div>
  );
}

/** Connectivity indicator. Always pairs the dot with words: colour alone would
 *  fail WCAG's "not by colour alone" rule and is invisible to a screen reader. */
function StatusPill({ status }: { status: EndpointStatus | null }) {
  const state: "checking" | "live" | "offline" | "unset" = !status
    ? "checking"
    : !status.configured
      ? "unset"
      : status.reachable
        ? "live"
        : "offline";

  const dot =
    state === "live"
      ? "bg-[var(--ok)]"
      : state === "offline" || state === "unset"
        ? "bg-[var(--warn)]"
        : "bg-[var(--faint)]";

  const label =
    state === "live"
      ? (status?.model ?? "Model live")
      : state === "offline"
        ? "Model offline"
        : state === "unset"
          ? "Not configured"
          : "Checking…";

  return (
    <span
      title={status?.detail ?? undefined}
      className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1"
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          dot,
          state === "checking" && "status-pulse",
        )}
      />
      <span className="max-w-[10rem] truncate font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--muted)]">
        {label}
      </span>
    </span>
  );
}
