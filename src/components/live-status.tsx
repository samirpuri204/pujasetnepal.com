"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { EndpointStatus } from "@/lib/types";

/**
 * A live indicator for the hosted endpoint, for the marketing page.
 *
 * It calls the same `/api/health` route the chat does rather than hard-coding
 * "online", because a marketing page that claims a service is up when it is not
 * is the fastest way to lose a developer's trust. The inference server runs on a
 * session-bound GPU box and genuinely does go away, so the honest signal is the
 * measured one.
 *
 * Deliberately small and cheap: one fetch on mount, no polling. The chat polls
 * because a conversation depends on the answer; a landing page does not.
 */
export function LiveStatus({ className }: { className?: string }) {
  const [status, setStatus] = useState<EndpointStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: EndpointStatus) => {
        if (!cancelled) setStatus(data);
      })
      .catch(() => {
        if (!cancelled)
          setStatus({
            configured: false,
            reachable: false,
            detail: "Health endpoint unreachable.",
          });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Colour is never the only signal — the word is always present, because a
  // bare coloured dot is invisible to a screen reader and ambiguous to everyone.
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
      : state === "checking"
        ? "bg-[var(--faint)]"
        : "bg-[var(--warn)]";

  const label =
    state === "live"
      ? `Hosted model live · ${status?.model ?? "ready"}`
      : state === "offline"
        ? "Hosted model offline — demo restarts often"
        : state === "unset"
          ? "Hosted model not attached yet"
          : "Checking the hosted model…";

  return (
    <span
      title={status?.detail ?? undefined}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[var(--border)]",
        "bg-[var(--surface)] px-3 py-1.5",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          dot,
          state === "checking" && "status-pulse",
        )}
      />
      <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--muted)]">
        {label}
      </span>
    </span>
  );
}
