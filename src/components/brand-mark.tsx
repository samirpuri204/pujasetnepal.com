import { cn } from "@/lib/utils";

/**
 * The brand mark: a crimson rounded square holding a monogram built the way
 * Devanagari is built — a *shirorekha* (headstroke) with the letter body beneath
 * it — and the body is an angular **J** for Jaynepal. The stroke floats above
 * the letter rather than joining it, because merging the two shapes read as a T
 * with a descender once the mark was scaled down to favicon size.
 *
 * Why it is drawn rather than set in a font: an earlier version of this mark was
 * the Devanagari letter `प` rendered as text, which meant the logo depended on
 * Noto Sans Devanagari being loaded. Where it was not — a favicon, an embed, a
 * social card, a machine with a thin font set — the browser substituted an
 * arbitrary face and the mark silently became a different glyph at a different
 * weight. Paths cannot fall back.
 *
 * The geometry matches `public/logo.svg` exactly so the header, the favicon and
 * any exported asset are the same mark. `src/app/icon.svg` carries the heavier
 * variant used at 16px.
 *
 * The accent appears in its graphic role — a mark, not text — which is the only
 * role where the 3.9:1 crimson clears the non-text contrast threshold.
 */
export function BrandMark({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role="img"
      aria-label="Puja Set Nepal"
      className={cn("shrink-0", className)}
    >
      <rect width="32" height="32" rx="7.2" fill="var(--accent)" />
      <rect x="9.5" y="7.4" width="14.8" height="2.4" rx="1.2" fill="#fff" />
      <path
        d="M17.9 12.4 V18.2 C17.9 21 16 22.8 13.4 22.8 C11.4 22.8 9.9 21.8 9.2 20.2"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
