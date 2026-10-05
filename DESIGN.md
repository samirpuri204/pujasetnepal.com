# Jaynepal 1.1 — design system

The decisions behind the interface, and the reasoning for each one. Written down
because a palette is easy to copy and the reasoning is not.

---

## Direction

**Dark, technical, editorial.**

Three constraints shaped it:

1. **No purple.** The ui-ux-pro-max design-system generator returns `#7C3AED` as
   the primary for anything matching "AI chat". It is the clearest tell of a
   generated interface, and it is specifically what "no AI slop" is asking to
   avoid. Rejected deliberately, not by accident.
2. **Not another SaaS blue.** `#2563EB` is the other default the generator
   offers for this product type. Also rejected — it reads as a template.
3. **The brand has a real colour available.** The accent is crimson, from the
   Nepali flag. It is honest to the "made in Nepal" identity instead of being a
   decorative choice, and it is a hue that no default generator will hand you.

Typography follows the same logic. The generator suggests Poppins/Open Sans
(generic SaaS) or Inter (the default for everything). Picked instead: **IBM Plex
Sans** for prose and **JetBrains Mono** for labels, status, and code — a pairing
for tools with identifiers and counters on screen, which this app has.

---

## Colour tokens

Every colour is a semantic token in `src/app/globals.css`. No component
hard-codes a hex value.

| Token | Value | Role |
|---|---|---|
| `--bg` | `#0B1017` | Page background |
| `--surface` | `#121A24` | Sidebar, cards, user turns |
| `--surface-2` | `#1A2331` | Hover, active thread |
| `--surface-3` | `#222E3E` | Pressed, inline code |
| `--border` | `#243040` | Dividers |
| `--border-strong` | `#33445B` | Emphasised borders, scrollbar |
| `--fg` | `#E8EDF4` | Body text |
| `--muted` | `#8A9AB0` | Secondary text |
| `--faint` | `#61708A` | Labels, timestamps |
| `--accent` | `#E5484D` | **Graphic role only** — rail, focus ring, mark |
| `--accent-text` | `#FF6369` | **Text role** — links, assistant label |
| `--ok` | `#3FB950` | Reachable |
| `--warn` | `#D29922` | Unreachable, errors |
| `--btn-primary-bg` | `#E8EDF4` | Primary button fill |
| `--btn-primary-fg` | `#0B1017` | Primary button label |

### The accent split is the important part

`--accent` and `--accent-text` exist as two tokens for one reason: contrast.

Measured against `--bg` (`#0B1017`, relative luminance ≈ 0.005):

| Token | Ratio | Requirement | Result |
|---|---|---|---|
| `--fg` | 15.4:1 | 4.5:1 (text) | pass |
| `--muted` | 6.7:1 | 4.5:1 (text) | pass |
| `--faint` | 3.7:1 | 4.5:1 body / 3:1 large | **large text and labels only** |
| `--accent` | 3.9:1 | 3:1 (non-text) | pass as a rail/ring/mark |
| `--accent-text` | 6.6:1 | 4.5:1 (text) | pass |

Crimson `#E5484D` at 3.9:1 clears the non-text threshold but would fail as body
text. Using it for a 2px rail, a focus ring, or a filled square is correct; using
it for a link would not be. `--accent-text` is the lightened variant that is
safe to read. One token would have forced a choice between a dull accent and
unreadable text.

`--faint` at 3.7:1 is used only for uppercase monospace labels at 11px that
duplicate information available elsewhere (role names, timestamps) — never for
content a user must read to proceed.

### Primary button is near-white, not coloured

White on near-black measures ~15:1. A crimson fill with white text would be
3.9:1 and fail. The neutral primary is both the modern tool convention and the
only way to keep the accent crimson without darkening it into brown.

---

## Layout

```
┌────────────┬──────────────────────────────────────────┐
│            │  header   brand ······ status · site     │  56px
│ sidebar    ├──────────────────────────────────────────┤
│            │                                          │
│  brand     │        thread (max-w 46rem, centred)     │  scrolls
│  new chat  │                                          │
│  threads   ├──────────────────────────────────────────┤
│            │        composer (max-w 46rem)            │
│  made in   │                                          │
│  Nepal     │                                          │
└────────────┴──────────────────────────────────────────┘
   272px                  flexible
```

**46rem (736px)** for the reading column. Above roughly 75 characters per line,
comprehension drops — this is the `line-length-control` rule, and the reason a
long answer does not stretch across a 1440px monitor.

**Spacing** is on a 4/8 rhythm: `4 · 8 · 12 · 16 · 24 · 32 · 48`. Density dial 6
of 10 — roomy enough to read, tight enough that a long thread still fits a
screen.

**Breakpoints**: 390 / 768 / 1024 / 1440. The sidebar is a permanent 272px column
at `lg` and above; below that it is a drawer.

---

## Type

| Role | Face | Size |
|---|---|---|
| Prose | IBM Plex Sans | 15px (`0.9375rem`), line-height 1.6 |
| Labels, status, metadata | JetBrains Mono | 10.5–11px, uppercase, `0.14em` tracking |
| Code | JetBrains Mono | 13px, line-height 1.65 |
| Composer input | IBM Plex Sans | 16px |

16px in the composer is not aesthetic — anything smaller makes iOS Safari zoom
the page on focus.

**Devanagari.** IBM Plex Sans has no Devanagari glyphs, so `--font-deva` (Noto
Sans Devanagari) is next in the stack. Without a declared face the browser
substitutes an arbitrary system font and the same Nepali sentence renders at
different sizes on macOS, Windows, and Android. For a Nepali-first model that is
a correctness issue.

---

## The turn: why there are no bubbles

A typical chat clone renders avatars and left/right bubbles. Rejected:

- Bubbles spend horizontal width on a wide screen, squeezing long answers into
  one side of the page.
- Avatar + bubble is the default shape of every generated chat app, so it reads
  as unconsidered even when the underlying code is solid.

Instead, a flat transcript with a stable header/footer rhythm:

```
YOU ................................... 12:04
┌──────────────────────────────┐
│ raised surface, 1px border   │
└──────────────────────────────┘
[copy]

JAYNEPAL 1.1 .......................... 12:04
▌ flush on the background, 2px crimson rail
▌ markdown, code, tables
[copy] [regenerate]
```

The alternation of raised surface vs. crimson rail carries the same
speaker information a bubble would, without spending the width. It also
screenshot-wells and reads as a document, which suits a model whose output is
often prose.

The empty state follows the same rule: no giant centred logo and no glowing orb.
A short statement of what the model is, plus four real starting points — two in
Nepali, because that is the point of the model.

---

## Motion

Three durations, assigned by intent rather than one value for everything:

| Token | Value | Used for |
|---|---|---|
| `--dur-press` | 90ms | Button press feedback |
| `--dur-exit` | 120ms | Dismissed UI |
| `--dur-enter` | 180ms | New turns, drawer |

- New turns fade up 6px. Nothing animates on removal — messages are never
  individually deleted, and delaying the next paint to animate one would be
  motion for its own sake.
- The streaming caret is a 1s blink, and the global `prefers-reduced-motion`
  rule disables it. Under reduced motion the reply simply appears.
- `prefers-reduced-motion` is honoured globally, not per-component.

---

## Accessibility

Checked against the WCAG 2.2 AA rules in `references/quick-reference.md` §1.

- **Contrast** — measured, tabulated above. Nothing below 4.5:1 carries body
  text.
- **Colour is never the only signal.** The status pill always shows the dot
  *and* the word (`Model live` / `Model offline`). The active thread has a
  crimson rail *and* a lighter background *and* `aria-current`. The stopped
  marker has a square glyph and the words "Stopped by you".
- **Focus is visible** — a 2px crimson ring at 2px offset, on `:focus-visible`
  so a mouse click does not leave one behind. 3.9:1 against every surface clears
  the 3:1 non-text threshold.
- **Targets** — 28px minimum for icon buttons (above WCAG 2.2's 24px floor),
  32px for send/stop, 36px for the mobile menu.
- **The off-screen drawer is `inert`.** A closed drawer is translated off-screen
  but would still be tabbable, creating invisible tab stops. It is set `inert`
  on mobile only — it is permanently visible on desktop, where `inert` would
  break it. That is why layout mode is read in JS (`use-media-query.ts`) rather
  than CSS.
- **Keyboard** — Enter sends, Shift+Enter newlines, Escape closes the drawer,
  focus moves to the drawer's first control on open, and per-message actions are
  reachable via `group-focus-within` rather than hover-only.
- **Skip link** to the conversation.
- **16px composer** prevents iOS zoom; `maximumScale: 5` keeps pinch-zoom
  available (never disable zoom).
- **No emoji as icons** — all glyphs are `lucide-react` vectors at a consistent
  1.5–2.5px stroke.
- **IME** — Enter is ignored during composition, so typing Devanagari does not
  send a half-formed word.

---

## Verified

Rendered and inspected in a real browser, not inferred from the build:

| | Result |
|---|---|
| Desktop 1440×900 | Sidebar 272px; column centred at 736px; no overflow |
| Tablet 768×1024 | No overflow |
| Mobile 390×844 | No horizontal scroll; composer reachable at the bottom |
| Mobile drawer | Overlays from the left with a scrim; Escape closes |
| Devanagari | Renders in Noto Sans Devanagari, no fallback artifacts |
| Console | No errors, no warnings |
| Failure path | Send with no model attached shows "That turn did not complete" + the reason — verified, not assumed |
| Production build | Passes TypeScript and lint |
