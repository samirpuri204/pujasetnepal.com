"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

const MAX_HEIGHT = 200;

/**
 * Message composer.
 *
 * Three details that decide whether this feels right:
 *
 *  1. IME composition guard. Devanagari is typed through a composition session,
 *     and Enter frequently selects a candidate inside it. Sending on that Enter
 *     would fire a half-formed word — so the keydown is ignored while
 *     `isComposing` is set. For a Nepali-first model this is not an edge case.
 *  2. Auto-grow up to a ceiling, then scroll internally. An unbounded textarea
 *     eventually eats the whole viewport and pushes the conversation out.
 *  3. Send is disabled, not hidden, while a reply streams — the button keeps its
 *     position and becomes Stop, so the pointer does not have to re-aim.
 */
export function Composer({
  onSend,
  onStop,
  streaming,
  disabled,
  disabledReason,
}: {
  onSend: (text: string) => void;
  onStop: () => void;
  streaming: boolean;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const composing = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [value]);

  const submit = useCallback(() => {
    const text = value.trim();
    if (!text || streaming || disabled) return;
    onSend(text);
    setValue("");
    // Keep the caret in the composer: after sending, the next thing the user
    // does is type again.
    requestAnimationFrame(() => ref.current?.focus());
  }, [value, streaming, disabled, onSend]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;
    if (composing.current || e.nativeEvent.isComposing) return;
    if (e.shiftKey) return;
    e.preventDefault();
    submit();
  };

  const canSend = value.trim().length > 0 && !streaming && !disabled;

  return (
    <div className="px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="mx-auto w-full max-w-[46rem]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className={cn(
            "rounded-[var(--radius-lg)] border bg-[var(--surface)]",
            "transition-colors duration-150",
            "focus-within:border-[var(--border-strong)]",
            disabled ? "border-[var(--border)] opacity-70" : "border-[var(--border)]",
          )}
        >
          <label htmlFor="composer" className="sr-only">
            Message {site.model.label}
          </label>
          <textarea
            id="composer"
            ref={ref}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            onCompositionStart={() => (composing.current = true)}
            onCompositionEnd={() => (composing.current = false)}
            rows={1}
            disabled={disabled}
            placeholder={
              disabled
                ? "No model connected yet"
                : "Ask something in Nepali, Romanised Nepali, or English…"
            }
            // 16px: below this, iOS Safari zooms the page on focus.
            className={cn(
              "block w-full resize-none bg-transparent px-4 pt-3.5 text-base",
              "leading-relaxed text-[var(--fg)] outline-none",
              "placeholder:text-[var(--faint)]",
              "disabled:cursor-not-allowed",
            )}
            style={{ maxHeight: MAX_HEIGHT }}
          />

          <div className="flex items-center justify-between gap-3 px-3 pb-3">
            <p className="pl-1 text-[11px] leading-tight text-[var(--faint)]">
              {disabled && disabledReason ? (
                disabledReason
              ) : streaming ? (
                <span className="text-[var(--accent-text)]">Generating…</span>
              ) : (
                <>
                  <kbd className="font-mono">Enter</kbd> to send ·{" "}
                  <kbd className="font-mono">Shift</kbd>+
                  <kbd className="font-mono">Enter</kbd> for a new line
                </>
              )}
            </p>

            {streaming ? (
              <button
                type="button"
                onClick={onStop}
                aria-label="Stop generating"
                title="Stop generating"
                className={cn(
                  "grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full",
                  "border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--fg)]",
                  "transition-colors duration-150 hover:bg-[var(--surface-3)]",
                )}
              >
                <Square size={12} fill="currentColor" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canSend}
                aria-label="Send message"
                title="Send message"
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                  "transition-[background-color,opacity] duration-150",
                  canSend
                    ? "cursor-pointer bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)] hover:opacity-90"
                    : "cursor-not-allowed bg-[var(--surface-3)] text-[var(--faint)]",
                )}
              >
                <ArrowUp size={16} strokeWidth={2.5} aria-hidden="true" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
