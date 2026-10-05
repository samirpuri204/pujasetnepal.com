"use client";

import { useEffect, useState } from "react";

/**
 * Subscribe to a media query.
 *
 * Used for one specific correctness problem: the sidebar is a static column on
 * desktop but a slide-in drawer on mobile. When the drawer is closed it is
 * moved off-screen with a transform — and off-screen content is still focusable
 * by keyboard, which produces invisible tab stops. `inert` fixes that, but it
 * must not be applied on desktop where the same element is permanently visible.
 * CSS cannot express that, so the layout mode has to be known in JS.
 */
export function useMediaQuery(query: string): boolean {
  // Default to false so server and first client render agree. The layout settles
  // on the first effect, before paint matters.
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
