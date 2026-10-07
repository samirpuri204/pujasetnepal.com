import { cn } from "@/lib/utils";

/**
 * The brand mark: a crimson squircle holding the Devanagari letter `प` (pa),
 * the first letter of *Puja*.
 *
 * Drawn in CSS rather than shipped as an image, for the same reason the previous
 * mark was: it stays crisp at every density, inherits the accent token so it can
 * never drift out of palette, and costs no network request. The glyph is set in
 * the declared Devanagari face (`--font-deva`), so it renders identically on
 * every platform instead of falling back to whatever the OS happens to ship.
 *
 * The accent is used here in its graphic role — a mark, not text — which is the
 * only role where 3.9:1 clears the non-text contrast threshold.
 */
export function BrandMark({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, borderRadius: size * 0.22 }}
      className={cn(
        "grid shrink-0 place-items-center bg-[var(--accent)]",
        className,
      )}
    >
      <span
        style={{ fontSize: size * 0.62, fontFamily: "var(--font-deva)" }}
        className="font-medium leading-none text-white"
      >
        प
      </span>
    </span>
  );
}
