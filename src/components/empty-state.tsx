"use client";

import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";

/**
 * First-run state.
 *
 * Deliberately not a large centred logo or a glowing orb. A big decorative mark
 * tells a new user nothing and is the most copy-pasted part of a generated chat
 * app. Instead this is a short statement of what the thing is, plus four real
 * starting points — including two in Nepali, because that is the model's point.
 */

const STARTERS: { label: string; prompt: string; lang?: string }[] = [
  {
    label: "Identity, in Nepali",
    prompt: "तपाईंलाई कसले बनाउनुभयो?",
    lang: "ne",
  },
  {
    label: "Identity, in English",
    prompt: "Who made you, and where are you from?",
  },
  {
    label: "Explain a concept",
    prompt: "Explain how HTTPS works, in simple terms.",
  },
  {
    label: "Write some code",
    prompt: "Write a Python function that reverses a linked list.",
  },
];

export function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="mx-auto w-full max-w-[46rem] px-4 py-10 sm:px-6 sm:py-14">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--accent-text)]">
        {site.model.label}
      </p>
      <h1 className="mt-3 text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.9rem]">
        A Nepali language model,
        <br className="hidden sm:block" /> running on our own weights.
      </h1>
      <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[var(--muted)]">
        Ask in Nepali, Romanised Nepali, or English. Every reply is generated
        live by the hosted model — nothing here is scripted. Conversations are
        stored in this browser only, never on the server.
      </p>

      <ul className="mt-8 grid gap-2 sm:grid-cols-2">
        {STARTERS.map((s) => (
          <li key={s.prompt}>
            <button
              type="button"
              lang={s.lang}
              onClick={() => onPick(s.prompt)}
              className={
                "group flex h-full w-full cursor-pointer flex-col rounded-[var(--radius)] " +
                "border border-[var(--border)] bg-[var(--surface)] p-3.5 text-left " +
                "transition-colors duration-150 hover:border-[var(--border-strong)] " +
                "hover:bg-[var(--surface-2)] active:bg-[var(--surface-3)]"
              }
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--faint)]">
                  {s.label}
                </span>
                <ArrowUpRight
                  size={13}
                  aria-hidden="true"
                  className="shrink-0 text-[var(--faint)] transition-colors duration-150 group-hover:text-[var(--accent-text)]"
                />
              </span>
              <span className="mt-2 text-[13.5px] leading-snug text-[var(--fg)]">
                {s.prompt}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
