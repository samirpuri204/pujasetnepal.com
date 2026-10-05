"use client";

import { useEffect, useRef } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { cn, relativeTime } from "@/lib/utils";
import { useMediaQuery } from "@/lib/use-media-query";
import type { Thread } from "@/lib/types";

const WEBSITE = "https://samirpuri.com.np";

export function Sidebar({
  open,
  onClose,
  threads,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  threads: Thread[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const newChatRef = useRef<HTMLButtonElement>(null);

  // Mobile drawer behaviour. On desktop the same element is a permanent column,
  // so none of this applies.
  useEffect(() => {
    if (isDesktop || !open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    newChatRef.current?.focus();

    // Lock background scroll so the page behind the drawer does not move under
    // the fingertip while scrolling the thread list.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isDesktop, open, onClose]);

  // Off-screen but still tabbable is a real accessibility defect, not a nitpick.
  const inert = !isDesktop && !open;

  return (
    <>
      {/* Scrim. Click to dismiss; hidden from assistive tech because the drawer
          has its own close control. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[40] bg-black/60 backdrop-blur-[2px] lg:hidden",
          "transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        inert={inert}
        aria-label="Conversations"
        className={cn(
          "z-[50] flex w-[272px] shrink-0 flex-col",
          "border-r border-[var(--border)] bg-[var(--surface)]",
          "fixed inset-y-0 left-0 lg:static lg:z-0",
          "transition-transform duration-200 ease-[var(--ease)]",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* ---- brand ---- */}
        <div className="flex items-center justify-between gap-2 px-4 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            {/* Wordmark glyph: a crimson square, the accent used in its graphic
                role. Drawn in CSS rather than shipped as an image so it stays
                crisp and inherits the token. */}
            <span
              aria-hidden="true"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-[5px] bg-[var(--accent)]"
            >
              <span className="font-mono text-[13px] font-bold leading-none text-white">
                J
              </span>
            </span>
            <span className="truncate font-mono text-[15px] font-semibold tracking-tight">
              Jaynepal
            </span>
            <span className="shrink-0 rounded border border-[var(--border-strong)] px-1.5 py-0.5 font-mono text-[10px] leading-none text-[var(--muted)]">
              1.1
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close conversation list"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-md text-[var(--muted)] transition-colors duration-150 hover:bg-[var(--surface-2)] hover:text-[var(--fg)] lg:hidden"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* ---- new chat ---- */}
        <div className="px-3 pb-3">
          <button
            ref={newChatRef}
            type="button"
            onClick={onNew}
            className={cn(
              "flex w-full cursor-pointer items-center justify-center gap-2",
              "rounded-[var(--radius)] border border-transparent",
              "bg-[var(--btn-primary-bg)] px-3 py-2 text-sm font-medium",
              "text-[var(--btn-primary-fg)]",
              "transition-opacity duration-150 hover:opacity-90 active:opacity-80",
            )}
          >
            <Plus size={15} strokeWidth={2.5} aria-hidden="true" />
            New chat
          </button>
        </div>

        {/* ---- threads ---- */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
          {threads.length === 0 ? (
            <p className="px-1 py-2 text-[13px] leading-relaxed text-[var(--faint)]">
              No conversations yet. They are saved in this browser only.
            </p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {threads.map((t) => {
                const isActive = t.id === activeId;
                const last = t.messages[t.messages.length - 1];
                const preview = last?.content.replace(/\s+/g, " ").slice(0, 60);
                return (
                  <li key={t.id} className="group/row relative">
                    <button
                      type="button"
                      onClick={() => onSelect(t.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "w-full cursor-pointer rounded-[var(--radius)] py-2 pl-3 pr-9 text-left",
                        "transition-colors duration-150",
                        isActive
                          ? "bg-[var(--surface-2)]"
                          : "hover:bg-[var(--surface-2)]",
                      )}
                    >
                      {/* Active marker: a second signal besides the background,
                          so the state is not carried by colour alone. */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-y-1.5 left-0 w-[2px] rounded-full transition-opacity",
                          isActive ? "bg-[var(--accent)] opacity-100" : "opacity-0",
                        )}
                      />
                      <span
                        className={cn(
                          "block truncate text-[13.5px] leading-snug",
                          isActive ? "text-[var(--fg)]" : "text-[var(--muted)]",
                        )}
                      >
                        {t.title}
                      </span>
                      <span className="mt-0.5 block truncate font-mono text-[10.5px] text-[var(--faint)]">
                        {relativeTime(t.updatedAt)}
                        {preview ? ` · ${preview}` : ""}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(t.id)}
                      aria-label={`Delete conversation: ${t.title}`}
                      title="Delete conversation"
                      className={cn(
                        "absolute right-1.5 top-1/2 grid h-7 w-7 -translate-y-1/2",
                        "cursor-pointer place-items-center rounded-md",
                        "text-[var(--faint)] transition-colors duration-150",
                        "opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100",
                        "hover:bg-[var(--surface-3)] hover:text-[var(--accent-text)]",
                      )}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>

        {/* ---- footer ---- */}
        <div className="border-t border-[var(--border)] px-4 py-3">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--faint)]">
            Made in Nepal
          </p>
          <a
            href={WEBSITE}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-[12.5px] text-[var(--accent-text)] underline decoration-1 underline-offset-2 transition-[text-decoration-thickness] hover:decoration-2"
          >
            samirpuri.com.np
          </a>
        </div>
      </aside>
    </>
  );
}
