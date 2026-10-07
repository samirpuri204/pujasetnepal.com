# pujasetnepal.com

The landing page and documentation site for **Jaynepal 1.1** — a Nepali
language model made in Nepal and served from a hosted, OpenAI-compatible
endpoint.

[![Licence: MIT](https://img.shields.io/badge/licence-MIT-3fb950)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-e8edf4)](https://nextjs.org)
[![Node 20+](https://img.shields.io/badge/node-%E2%89%A520-e8edf4)](https://nodejs.org)
[![Deploy with Vercel](https://img.shields.io/badge/deploy-Vercel-e8edf4)](https://vercel.com/new)

**Production:** https://pujasetnepal.com

---

## What this repository is

This is **the website**: a two-page Next.js app that presents the model and
documents its API. It contains no model weights, no inference code and no
server-side API proxy — the model is served from a separate GPU host, and the
documentation describes the contract you integrate against.

| Page | What it is |
|---|---|
| `/` | Landing page — what Jaynepal 1.1 is, how it is served, the model card, and the honest current status. |
| `/docs` | Documentation — model card, quickstart, full API reference, streaming format, error codes, limits and roadmap. |

Both pages are statically prerendered. There are no API routes and no
server-side state.

---

## The model

| | |
|---|---|
| **Name** | Jaynepal 1.1 |
| **Model id** | `jaynepal-1.1` |
| **Parameters** | 9B |
| **Languages** | Nepali (Devanagari) · Romanised Nepali · English |
| **Context** | 8,192 tokens |
| **Interface** | OpenAI-compatible HTTP API with SSE streaming |
| **Base URL** | `https://pujasetnepal.com/v1` |
| **Trained by** | [Samir Puri](https://samirpuri.com.np) (DevSamirX), Bharatpur, Chitwan, Nepal |

Jaynepal 1.1 answers in the language you wrote in — Devanagari, Romanised Nepali
or English — and holds that choice rather than drifting back to English. It
writes Markdown, so headings, lists, tables and fenced code come back structured
rather than as flat paragraphs.

Its limitations are documented rather than glossed: it is a 9B model and behaves
like one on hard reasoning, its formal and academic Nepali is uneven, it is not
a knowledge base, and it has no tool use or browsing. See the
[full model card](https://pujasetnepal.com/docs#model).

---

## The hosted API

```bash
curl -N "https://your-endpoint/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JAYNEPAL_API_KEY" \
  -d '{
        "model": "jaynepal-1.1",
        "messages": [
          { "role": "user", "content": "लमजुङ किन प्रसिद्ध छ?" }
        ],
        "stream": true
      }'
```

```text
data: {"choices":[{"delta":{"content":"लमजुङ"}}]}
data: {"choices":[{"delta":{"content":" जिल्ला"}}]}
data: {"choices":[{"delta":{"content":" हो"}}]}
data: [DONE]
```

Because the interface is the OpenAI chat-completions shape, any OpenAI client
library works — change the base URL and the model id, nothing else.

`GET /v1/models` lists what the endpoint serves, and doubles as a liveness check.

### Status of the endpoint

The canonical production base URL is `https://pujasetnepal.com/v1`. The public
evaluation endpoint currently runs behind a **session-bound GPU host**, so it is
offline between sessions and its address changes when it comes back. That is
documented on the site rather than hidden, because a developer deciding whether
to build on a model needs the gap as much as the feature.

Bringing up a compatible endpoint yourself is also supported — any server that
speaks OpenAI chat completions can front the model:

```bash
vllm serve <jaynepal-1.1> --port 8000 --max-model-len 8192
curl http://localhost:8000/v1/models
```

---

## Running the site locally

Node 20 or newer (developed on 22+). Nothing else is required — no API key, no
cloud project.

```bash
git clone https://github.com/samirpuri204/pujasetnepal.com.git
cd pujasetnepal.com
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # compile + typecheck
npm run start        # serve the production build
npm run lint         # eslint
```

---

## Layout of the source

```
public/
  logo.svg                the master logo mark
  logo-mark.svg           glyph-only, tintable via currentColor
  logo-512.png            raster exports
  logo-32.png
src/
  app/
    layout.tsx            fonts, metadata, viewport
    page.tsx              landing page
    docs/page.tsx         documentation
    globals.css           design tokens
    icon.svg              favicon (heavier variant of the mark)
    apple-icon.png        180px touch icon
    robots.ts             robots.txt
    sitemap.ts            sitemap.xml
  components/
    site-header.tsx       brand, navigation, source link
    site-footer.tsx       links, licence, attribution
    brand-mark.tsx        the inline logo mark
  lib/
    site.ts               brand, links and product facts
    utils.ts              cn()
```

Both pages are Server Components with no client JavaScript beyond what Next.js
ships by default. The navigation is four links and the active state is known at
build time, so a `"use client"` boundary would hydrate for nothing.

### Where the facts live

Every brand string, URL, model fact and parameter in the UI comes from
`src/lib/site.ts`. A rename or a version bump is one file, not a hunt through
metadata, headers, footers and documentation that leaves one string behind.

---

## Logo

A crimson rounded square holding a monogram built the way Devanagari is built —
a headstroke (*shirorekha*) with the letter body beneath it, the body being an
angular **J** for Jaynepal.

The headstroke carries the identity: every Devanagari letter hangs from the same
bar, so one stroke says "written in Devanagari" without drawing a specific
letter. It floats above the J rather than joining it, because at 16px the merged
version read as a T with a descender.

It is drawn as paths, not set as text. The mark it replaced was the letter `प` in
a font, which meant the logo depended on Noto Sans Devanagari being loaded —
where it was not, the browser substituted another face and the mark quietly
became a different glyph. Paths cannot fall back.

Source files: [`public/logo.svg`](public/logo.svg) is the master;
[`src/app/icon.svg`](src/app/icon.svg) is the optically heavier favicon variant;
[`src/components/brand-mark.tsx`](src/components/brand-mark.tsx) is the inline
component. The full reasoning is in [`DESIGN.md`](DESIGN.md#logo).

---

## Design

Dark, technical, editorial. Two decisions carry most of it:

- **No purple.** The generator default for anything labelled "AI" is `#7C3AED`,
  the clearest tell of a generated interface. The accent here is crimson, taken
  from the Nepali flag, and used in a graphic role rather than as a large fill.
- **Two accent tokens.** `#E5484D` measures 3.9:1 against the page background —
  correct for a rule, ring or mark (needs 3:1), not for body text (needs 4.5:1).
  `#FF6369` is the readable variant at 6.6:1. One token would have forced a
  choice between a dull accent and unreadable links.

Type is **IBM Plex Sans** for prose and **JetBrains Mono** for labels, endpoints
and parameters — a pairing for a page with identifiers all over it.
**Noto Sans Devanagari** is declared after the Latin face, because IBM Plex Sans
ships no Devanagari glyphs and without a declared face the same Nepali sentence
renders at different sizes on macOS, Windows and Android.

---

## Deploying

```bash
vercel link
vercel deploy --prod
```

Build settings are auto-detected; there is nothing to configure.

---

## Limits and roadmap

- The public evaluation endpoint is session-bound and offline between GPU sessions.
- No self-serve API keys; access is arranged directly.
- No published benchmark yet — quality claims are qualitative until it ships.
- No quantised release for people who want to run it on their own hardware.

Roadmap: a permanently hosted endpoint, self-serve keys with quotas, a published
Nepali evaluation against comparable models, a quantised release, and deeper
coverage of formal and academic Nepali.

---

## A note on the previous chat interface

This repository previously contained a full chat client — streaming UI, thread
store, Devanagari-safe byte handling and a server-side SSE proxy — deployed at
[`/chat`](https://pujasetnepal.com/chat). That work is preserved on the
[`chat-client` branch](https://github.com/samirpuri204/pujasetnepal.com/tree/chat-client)
and in the history of `main`, and can be restored with:

```bash
git checkout chat-client -- src/components src/app/chat src/app/api src/lib scripts
```

The site itself is now landing page and documentation only, as intended.

---

## Licence and credits

[MIT](LICENSE) for this repository's source — the site, not the model.

Jaynepal 1.1 is built by [Samir Puri](https://samirpuri.com.np) (DevSamirX) in
Bharatpur, Chitwan, Nepal, and published on
[Hugging Face](https://huggingface.co/sami5645678/Jaynepal1.1). Issues and pull
requests on this repository are welcome.
