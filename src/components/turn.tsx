"use client";

import { useCallback, useState } from "react";
import { AlertCircle, Check, Copy, RotateCcw } from "lucide-react";
import { Markdown } from "./markdown";
import { cn, formatTime } from "@/lib/utils";
import type { Message } from "@/lib/types";

/**
 * One conversational turn.
 *
 * Layout note: there are no avatars and no left/right bubbles. Every turn is
 * full-width in a single column, with a small monospaced role label and a
 * consistent header/footer rhythm:
 *
 *     ROLE ........................ 12:04
 *     <content>
 *     [actions] ..................... 
 *
 * Two reasons for the flat transcript over bubbles:
 *
 *  - Alternating bubbles waste horizontal width on a wide screen, so long
 *    answers end up squeezed into one side of the page.
 *  - Bubble-plus-avatar is the default shape of every generated chat clone, so
 *    it reads as unconsidered even when the code underneath is fine.
 *
 * The user turn gets a raised surface; the assistant turn sits flush with a
 * crimson rail. That alternation carries the same information a bubble would,
 * without spending the width.
 */
export function Turn({
  message,
  isLast,
  onRegenerate,
}: {
  message: Message;
  isLast: boolean;
  onRegenerate?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const isError = message.status === "error";
  const isStreaming = message.status === "streaming";

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard is blocked over plain http on some browsers. The button just
      // does not confirm rather than claiming a copy that did not happen.
    }
  }, [message.content]);

  const hasActions = !isStreaming && !isError && message.content.trim().length > 0;

  return (
    <article
      className="group turn-in px-4 py-5 sm:px-6"
      aria-label={isUser ? "Your message" : "Jaynepal reply"}
    >
      {/* header: role + time, identical for both roles so the rhythm is stable */}
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span
          className={cn(
            "font-mono text-[11px] font-medium uppercase tracking-[0.14em]",
            isUser ? "text-[var(--faint)]" : "text-[var(--accent-text)]",
          )}
        >
          {isUser ? "You" : "Jaynepal 1.1"}
        </span>
        <span className="font-mono text-[11px] tabular-nums text-[var(--faint)]">
          {formatTime(message.createdAt)}
        </span>
      </div>

      {isUser ? (
        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
          <p className="whitespace-pre-wrap break-words text-[0.9375rem] leading-relaxed">
            {message.content}
          </p>
        </div>
      ) : (
        <div
          className={cn(
            "border-l-2 pl-4",
            isError ? "border-[var(--warn)]" : "border-[var(--accent)]",
          )}
        >
          {isError ? (
            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-[var(--warn)]"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium">That turn did not complete</p>
                  <p className="mt-1 break-words text-sm text-[var(--muted)]">
                    {message.error || "No reason was reported."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[0.9375rem]">
              <Markdown text={message.content} />
              {isStreaming && (
                <>
                  <span className="caret" aria-hidden="true" />
                  <span className="sr-only" role="status">
                    Jaynepal is replying
                  </span>
                </>
              )}
            </div>
          )}

          {message.status === "stopped" && (
            <p className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[var(--faint)]">
              <span
                className="inline-block h-2 w-2 rounded-[1px] bg-[var(--faint)]"
                aria-hidden="true"
              />
              Stopped by you
            </p>
          )}
        </div>
      )}

      {/* footer: actions. Hidden until hover/focus so a long thread stays quiet,
          always visible on the newest turn so the affordance is discoverable. */}
      {hasActions && (
        <div
          className={cn(
            "mt-2.5 flex items-center gap-1 transition-opacity duration-150",
            "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
            isLast && "opacity-100",
          )}
        >
          <IconButton
            label={copied ? "Copied to clipboard" : "Copy message"}
            onClick={copy}
            icon={copied ? <Check size={14} /> : <Copy size={14} />}
          />
          {!isUser && onRegenerate && (
            <IconButton
              label="Regenerate this reply"
              onClick={onRegenerate}
              icon={<RotateCcw size={14} />}
            />
          )}
        </div>
      )}
    </article>
  );
}

function IconButton({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      // 28px box: above WCAG 2.2's 24px pointer-target floor, and the glyph
      // stays 14px so the row does not visually compete with the message.
      className={cn(
        "grid h-7 w-7 cursor-pointer place-items-center rounded-md",
        "text-[var(--muted)] transition-colors duration-150",
        "hover:bg-[var(--surface-2)] hover:text-[var(--fg)]",
        "active:bg-[var(--surface-3)]",
      )}
    >
      {icon}
    </button>
  );
}
