# pujasetnepal.com — design system

The decisions behind the interface, and the reasoning for each one. Written down
because a palette is easy to copy and the reasoning is not.

---

## Direction

**Dark, technical, editorial.**

Three constraints shaped it:

1. **No purple.** The ui-ux-pro-max design-system generator returns `#7C3AED` as
   the primary for anything matching "AI". It is the clearest tell of a
   generated interface, and it is specifically what "no AI slop" is asking to
   avoid. Rejected deliberately, not by accident.
2. **Not another SaaS blue.** `#2563EB` is the other default the generator
   offers for this product type. Also rejected — it reads as a template.
3. **The brand has a real colour available.** The accent is crimson, from the
   Nepali flag. It is honest to the "made in Nepal" identity instead of being a
   decorative choice, and it is a hue no default generator will hand you.

Typography follows the same logic. The generator suggests Poppins/Open Sans
(generic SaaS) or Inter (the default for everything). Picked instead: **IBM Plex
Sans** for prose and **JetBrains Mono** for labels, endpoints, parameters and
code — a pairing for a page with identifiers on it, which this page has in
quantity.

---

## Colour tokens

Every colour is a semantic token in `src/app/globals.css`. No component
hard-codes a hex value.

| Token | Value | Role |
|---|---|---|
| `--bg` | `#0B1017` | Page background |
| `--surface` | `#121A24` | Cards, footer, code blocks |
| `--surface-2` | `#1A2331` | Hover, table headers |
| `--surface-3` | `#222E3E` | Inline code background |
| `--border` | `#243040` | Dividers |
| `--border-strong` | `#33445B` | Emphasised borders, scrollbar |
| `--fg` | `#E8EDF4` | Body text |
| `--muted` | `#8A9AB0` | Secondary text |
| `--faint` | `#61708A` | Labels, timestamps |
| `--accent` | `#E5484D` | **Graphic role only** — rule, focus ring, mark |
| `--accent-text` | `#FF6369` | **Text role** — links, eyebrows |
| `--ok` | `#3FB950` | Working |
| `--warn` | `#D29922` | Degraded, caveats |
| `--btn-primary-bg` | `#E8EDF4` | Primary button fill |
| `--btn-primary-fg` | `#0B1017` | Primary button label |

### The accent split is the important part

`--accent` and `--accent-text` exist as two tokens for one reason: contrast.

Measured against `--bg` (`#0B1017`, relative luminance ≈ 0.005):

| Token | Ratio | Requirement | Result |
|---|---|---|---|
| `--fg` | 15.4:1 | 4.5:1 (text) | pass |
| `--muted` | 6.7:1 | 4.5:1 (text) | pass |
| `--faint` | 3.7:1 | 4.5:1 body / 3:1 large | **labels and metadata only** |
| `--accent` | 3.9:1 | 3:1 (non-text) | pass as a rule, ring or mark |
| `--accent-text` | 6.6:1 | 4.5:1 (text) | pass |

Crimson `#E5484D` at 3.9:1 clears the non-text threshold but would fail as body
text. Using it for a 2px rule, a focus ring, a status dot or the brand square is
correct; using it for a link would not be. `--accent-text` is the lightened
variant that is safe to read. One token would have forced a choice between a
dull accent and unreadable text.

`--faint` at 3.7:1 is used only for uppercase monospace labels at 10.5px that
duplicate information available elsewhere (field names, footer navigation) —
never for content a user must read to proceed.

### Primary button is near-white, not coloured

White on near-black measures ~15:1. A crimson fill with white text would be
3.9:1 and fail. The neutral primary is both the modern tool convention and the
only way to keep the accent crimson without darkening it into brown.

---

## Layout

```
┌────────────────────────────────────────────────────────────┐
│  header   brand ·············· nav · source        sticky  │  56px
├────────────────────────────────────────────────────────────┤
│                                                            │
│   content column, max-w 72rem (1152px), centred            │
│   sections separated by a 1px hairline, 4/8 spacing rhythm │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  footer   brand · prose · ····· site · project             │
└────────────────────────────────────────────────────────────┘
```

**72rem (1152px)** for the page column. Long-form passages inside it are further
capped at **68ch** — above roughly 75 characters per line, comprehension drops,
which is why a paragraph does not stretch across a 1440px monitor.

The documentation page is a two-column layout from `lg` up: a sticky table of
contents at 13rem and the article beside it. Below `lg` the table of contents is
not rendered at all — a collapsed accordion would cost a click to reach what the
page flow already provides.

**Spacing** is on a 4/8 rhythm: `4 · 8 · 12 · 16 · 24 · 32 · 48`. Density dial 6
of 10 — roomy enough to read, tight enough that a long page still fits a screen.

**Breakpoints**: 390 / 768 / 1024 / 1440. The header is a single row at `sm` and
above; below it, a second horizontally scrollable nav row rather than a
hamburger, because four links do not justify a drawer.

---

## Type

| Role | Face | Size |
|---|---|---|
| Prose | IBM Plex Sans | 15px (`0.9375rem`), line-height 1.6 |
| Lead paragraph | IBM Plex Sans | 15.5px |
| Section headings | IBM Plex Sans | 1.35–1.9rem, tracking −0.02em |
| Labels, endpoints, metadata | JetBrains Mono | 10.5–11px, uppercase, `0.14em` tracking |
| Code blocks | JetBrains Mono | 12.5px, line-height 1.8 |

**Devanagari.** IBM Plex Sans has no Devanagari glyphs, so `--font-deva` (Noto
Sans Devanagari) is next in the stack. Without a declared face the browser
substitutes an arbitrary system font and the same Nepali sentence renders at
different sizes on macOS, Windows, and Android. For a Nepali-first model that is
a correctness issue, not a taste one.

---

## Components

**Header.** Sticky, 95% opaque with a blur so content passing underneath stays
legible. The brand is a crimson squircle holding the Devanagari letter `प` —
drawn in CSS rather than shipped as an image, so it stays crisp at any density,
inherits the accent token, and costs no request.

**Sections.** Separated by hairlines rather than alternating background shades.
A full-bleed tinted band on every other section is the tell of a page assembled
from a template; a rule does the same job and keeps the page one continuous
document.

**The "endpoint, not a deployment" figure.** The request path is drawn as
monospaced ASCII inside a bordered, darker panel. It is honest about being a
diagram — no fake screenshot, no stock illustration — and it can be read by a
screen reader as text, which an exported image cannot.

**Tables.** Used for the model card, request parameters and error codes,
because these are genuinely tabular data. They scroll horizontally on narrow
screens rather than collapsing to a stacked form that loses the column
correspondence.

**Status cards.** Each carries a coloured dot *and* a word (`Working`,
`Demo-grade`, `Planned`). See accessibility below.

---

## Motion

Minimal by design. There is no scroll animation, no entrance choreography and
nothing that moves on its own. Transitions are limited to two intents:

| Token | Value | Used for |
|---|---|---|
| `--dur-press` | 90ms | Button and link feedback |
| `--dur-enter` | 180ms | — |
| `--dur-exit` | 120ms | — |

`prefers-reduced-motion` is honoured globally, not per-component, and also
disables the smooth anchor scrolling the documentation table of contents relies
on — a reader who asked for no motion should not get a page that glides.

---

## Accessibility

Checked against WCAG 2.2 AA.

- **Contrast** — measured, tabulated above. Nothing below 4.5:1 carries body
  text.
- **Colour is never the only signal.** Status is always a dot *and* a word. The
  active navigation item carries `aria-current="page"` as well as a colour
  change. Links are underlined, not distinguished by colour alone.
- **Focus is visible** — a 2px crimson ring at 2px offset, on `:focus-visible`
  so a mouse click does not leave one behind. 3.9:1 against every surface clears
  the 3:1 non-text threshold.
- **Targets** — every link and button clears WCAG 2.2's 24px minimum, and the
  navigation row is spaced for touch rather than for density.
- **Landmarks** — `header`, `nav`, `main`, `footer` are real elements with
  accessible names, so a screen reader can jump between them.
- **A skip link** is not present, because there is no repeated block of
  navigation to skip past on a two-page site.
- **No emoji as icons** — all glyphs are `lucide-react` vectors at a consistent
  1.5–2.5px stroke.
- **Zoom is never disabled** — `maximumScale: 5` keeps pinch-zoom available
  while preventing iOS Safari's focus zoom.
- **Diagrams are text.** The architecture figure is a `<pre>` element, readable
  by assistive technology, not an image with alt text standing in for it.

---

## Verified

Rendered and inspected in a real browser, not inferred from the build:

| | Result |
|---|---|
| Desktop 1440×900 | Page column centred at 1152px; documentation two-column; no overflow |
| Mobile 390×844 | No horizontal scroll; header collapses to a nav row |
| Devanagari | Renders in Noto Sans Devanagari, no fallback artifacts |
| Console | No errors, no warnings |
| Production build | Passes TypeScript; static prerender of `/` and `/docs` |
