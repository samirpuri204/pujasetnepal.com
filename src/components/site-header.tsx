import Link from "next/link";
// lucide v1 dropped its brand glyphs, so the GitHub link uses a generic code
// mark rather than a logo it no longer ships.
import { Code } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { cn } from "@/lib/utils";
import { nav, site } from "@/lib/site";

/**
 * Header for the marketing and documentation surfaces.
 *
 * Shared by both pages, so the landing page and the documentation read as one
 * document rather than two templates. The active item is passed in rather than
 * read from `usePathname`, which keeps the header a Server Component —
 * navigation is four links and the active state is known at build time, so a
 * `"use client"` boundary here would ship hydration for nothing.
 *
 * The compact nav row below `sm` is a second row rather than a drawer: four
 * links do not justify a hamburger, and a text row is reachable in one tap.
 */
export function SiteHeader({ current }: { current?: string }) {
  return (
    <header className="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[72rem] items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 rounded-md"
          aria-label={`${site.name} — home`}
        >
          <BrandMark size={24} />
          <span className="truncate font-mono text-[14.5px] font-semibold tracking-tight">
            {site.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 sm:flex">
          {nav.map((item) => {
            const active = item.href === current;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-[13.5px] transition-colors duration-150",
                  active
                    ? "text-[var(--fg)]"
                    : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a
          href={site.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-1.5 rounded-md border border-[var(--border)]",
            "bg-[var(--surface)] px-2.5 py-1.5 text-[12.5px] text-[var(--muted)]",
            "transition-colors duration-150 hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
            "sm:ml-0 ml-auto",
          )}
        >
          <Code size={14} aria-hidden="true" />
          <span className="hidden sm:inline">Source</span>
          <span className="sr-only sm:hidden">Source on GitHub</span>
        </a>
      </div>

      {/* Mobile nav: a second row rather than a drawer. Four links do not
          justify a hamburger, and a text row is reachable with one tap. */}
      <nav
        aria-label="Primary, compact"
        className="flex gap-1 overflow-x-auto border-t border-[var(--border)] px-3 py-2 sm:hidden"
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.href === current ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-md px-2.5 py-1.5 text-[13px]",
              item.href === current
                ? "bg-[var(--surface-2)] text-[var(--fg)]"
                : "text-[var(--muted)]",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
