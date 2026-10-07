# Puja Set Nepal — Nepali AI, open source and hosted

An early-stage AI developer platform from Nepal. This repository is the
open-source chat client and the streaming proxy; a hosted inference cloud sits
behind it, and the same client runs against any OpenAI-compatible server you
point it at.

[![Licence: MIT](https://img.shields.io/badge/licence-MIT-3fb950)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-e8edf4)](https://nextjs.org)
[![Node 20+](https://img.shields.io/badge/node-%E2%89%A520-e8edf4)](https://nodejs.org)
[![Deploy with Vercel](https://img.shields.io/badge/deploy-Vercel-e8edf4)](https://vercel.com/new)

**Site:** https://pujasetnepal.com · **Chat:** https://pujasetnepal.com/chat ·
**Docs:** https://pujasetnepal.com/docs

---

## What this is, and what it is not

This repository is **the client**: a Next.js application that renders a chat
interface and proxies it to a model server. It is not the training code, and it
is not the weights.

The model itself does **not** run on Vercel. A 9B-parameter model cannot run in
a serverless function — there is no GPU, and the bundle limits are orders of
magnitude too small. The client is deployed to Vercel; the weights live on a GPU
box and Vercel proxies to them.

```
browser  ──►  pujasetnepal.com  ──►  /api/chat  ──►  model server
              (this repo)                           (GPU box, OpenAI-compatible)
```

A working chat therefore needs two things: this deployment, **and** a running
model server. The interface is honest about which of the two is missing — the
status pill in the header reports what it measured, and a send with no model
attached returns a clear message instead of a spinner that never ends.

### Positioning, stated plainly

Most Nepali AI projects stop at a notebook. This one is packaged as a product:

| | |
|---|---|
| **Open-source client** | The whole chat application is MIT-licensed and yours to fork. |
| **Hosted cloud** | We run the GPU. The client talks to a hosted OpenAI-compatible endpoint. |
| **Open weights** | The served model is a LoRA fine-tune on an openly licensed base, published and attributed. |
| **Documented API** | A three-event SSE protocol and a health route, both specified in [`/docs`](https://pujasetnepal.com/docs#api). |

### About the model's provenance

The served model — presented as **Puja Set Nepal 1.1**, model id `jaynepal-1.1`
— is a LoRA fine-tune on top of **Qwen/Qwen3.5-9B** (Apache-2.0). The adapter is
published at
[`sami5645678/Jaynepal1.1`](https://huggingface.co/sami5645678/Jaynepal1.1).

Worth stating plainly: the fine-tune, the identity tuning, the router and the
serving stack are this project's work; the base weights are not. Being precise
about that is what makes the ownership claim hold up — read the licence of any
base you build on and keep the attribution accurate. See
[Attribution](#attribution) for the full breakdown.

---

## Quickstart

Node 20 or newer (developed on 22+). No account, no API key and no cloud project
are needed to run the interface.

```bash
git clone https://github.com/samirpuri204/pujasetnepal.com.git
cd pujasetnepal.com
npm install

cp .env.example .env.local     # optional at this stage
npm run dev                    # http://localhost:3000
```

With an empty `PUJASET_API_URL` the app still runs fully: `/`, `/docs` and
`/chat` all work, and the header reads `Not configured`.

```bash
npm run build      # compile + typecheck + lint
npm run start      # serve the production build locally
npm run lint       # eslint only
```

---

## Connecting the model

### 1. Start an inference server

It must speak the OpenAI chat-completions API: `/v1/models` and
`/v1/chat/completions`. vLLM, llama.cpp, Ollama, the project notebook, or any
hosted equivalent. See
[self-hosting the model](https://pujasetnepal.com/docs#self-host).

### 2. Point this app at it

**Locally** — put the URL in `.env.local`:

```bash
PUJASET_API_URL=https://your-endpoint.example.com
```

**On Vercel:**

```bash
./scripts/connect-model.sh https://your-endpoint.example.com
```

Or set it by hand: Project → Settings → Environment Variables →
`PUJASET_API_URL` → redeploy.

Either form of the URL works — `https://host`, `https://host/v1`, or the full
`https://host/v1/chat/completions`. It is normalised server-side.

### 3. Confirm

Open the site — the header pill should change from `Not configured` to the model
id. Or check directly:

```bash
curl https://pujasetnepal.com/api/health
```

> **Ephemeral endpoints.** The project's own demo runs on a session-bound GPU
> notebook, so its tunnel URL changes when the session restarts and the demo is
> genuinely offline between sessions. When the URL changes, re-run
> `connect-model.sh` with the new one. For an endpoint that survives restarts you
> need a host that keeps the process alive — a rented GPU box, or a Space with a
> GPU.

---

## Environment variables

All are read **server-side only**. None are prefixed `NEXT_PUBLIC_`, so no
endpoint or setting reaches the browser bundle.

| Variable | Default | Purpose |
|---|---|---|
| `PUJASET_API_URL` | *(empty)* | Base URL of the inference server. Empty = UI runs with no model attached. |
| `PUJASET_MODEL` | `jaynepal-1.1` | Model id sent in the request body. |
| `PUJASET_TEMPERATURE` | `0.7` | Sampling temperature. |
| `PUJASET_MAX_TOKENS` | `1024` | Response ceiling. |
| `PUJASET_SYSTEM_PROMPT` | built-in persona | Override the system turn. Set to `""` to send none. |

### Legacy `JAYNEPAL_*` names

The same settings also respond to the older `JAYNEPAL_*` names, so existing
deployments keep working after the rename. A **non-empty** `PUJASET_*` value
wins; otherwise the `JAYNEPAL_*` value is used. Remove the old keys once you have
migrated — two names for one setting is a migration, not a design.

---

## API

### `POST /api/chat`

```bash
curl -N https://pujasetnepal.com/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"नमस्ते"}],"stream":true}'
```

```text
data: {"type":"delta","text":"नम"}

data: {"type":"delta","text":"स्ते"}

data: {"type":"done"}
```

Three events — `delta`, `done`, `error` — not raw OpenAI chunks. Re-emitting the
vendor shape would push `choices[0].delta.content` into the React component;
keeping the client ignorant of it means the upstream can be swapped without
touching the UI.

Errors are JSON: `{ error: { code, message, detail? } }` — `400 bad_request`,
`502 upstream_unreachable | upstream_timeout | upstream_error`, `503
not_configured`.

### `GET /api/health`

```json
{ "configured": true, "reachable": true, "model": "jaynepal-1.1", "detail": "gpu-box.example.com · 312ms" }
```

`detail` carries the upstream host only — never the full URL, so a tunnel URL
with credentials in a query string cannot leak through an error surface.

---

## Deploying

```bash
vercel link
vercel env add PUJASET_API_URL production
vercel deploy --prod
```

Build settings are auto-detected. Route handlers run on the Node.js runtime, and
`/api/chat` declares `maxDuration = 300` — raised from the default because a
CPU-only backend can legitimately take a minute or more for a long answer, and a
60-second cap cuts the reply mid-sentence. The real constraint is the other
direction: `PUJASET_MAX_TOKENS` must stay under (maxDuration × tokens-per-second)
for the backend in use, or the tail of every long answer is truncated.

---

## How it is built

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Styling | Tailwind CSS v4 with a CSS-variable token layer |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| Icons | `lucide-react` |
| Hosting | Vercel (client) · GPU box or notebook (model) |

### Layout of the source

```
src/
  app/
    layout.tsx            fonts, metadata, viewport
    page.tsx              landing page
    docs/page.tsx         documentation
    chat/page.tsx         chat route shell
    globals.css           design tokens + markdown/syntax styling
    icon.svg              brand mark
    robots.ts             robots.txt
    sitemap.ts            sitemap.xml
    api/chat/route.ts     streaming proxy (SSE)
    api/health/route.ts   is a model reachable right now?
  components/
    site-header.tsx  site-footer.tsx  brand-mark.tsx  live-status.tsx
    chat.tsx              shell, streaming, scroll, status
    sidebar.tsx           brand, thread list, mobile drawer
    turn.tsx  composer.tsx  empty-state.tsx  markdown.tsx
  lib/
    site.ts               brand, links, product facts
    types.ts  utils.ts  upstream.ts  system-prompt.ts
    use-threads.ts        conversation store (localStorage)
    use-media-query.ts    layout-mode detection for the drawer
```

### Four decisions worth knowing

**The proxy is server-side.** The browser calls `/api/chat`, not the model
server. That keeps the upstream URL out of the bundle, removes the runtime
dependency on the model server sending CORS headers, and gives one place to add
auth or rate limiting later.

**The wire format is a three-event SSE protocol** (`delta` / `done` / `error`),
not raw OpenAI chunks. The React component should not have to know that
`choices[0].delta.content` exists.

**Conversations live in `localStorage`.** No account, no server-side history.
The trade-off: history is per-browser and does not follow the user across
devices. If that matters later, it is the natural place to add a backend.

**Brand strings live in `src/lib/site.ts`.** This project was previously
published under a different name, and the rename touched metadata, the sidebar,
the empty state, the header and the system prompt. Names and domains are data.

### Things that are easy to get wrong and are handled here

- **Devanagari over a byte stream.** Chunk boundaries split multi-byte
  characters. Both the proxy and the client decode with `{stream: true}` and
  buffer partial lines; getting this wrong produces mojibake in exactly the
  language this app exists to serve.
- **IME composition.** Enter is ignored while a composition session is active,
  or typing Devanagari on some keyboards would send a half-formed word.
- **Stop → an aborted request is not an error.** A cancelled turn is marked
  `Stopped by you`, not shown as a failure.
- **Stale "connected" badges.** A request that fails re-runs the health check,
  so the header cannot claim the model is live after it has gone away.
- **Streaming while backgrounded.** Text is flushed on a timer rather than
  `requestAnimationFrame`, which is paused in hidden documents and would make a
  reply appear all at once on return.

---

## Design

Dark, technical, editorial — with the reasoning written down in
[`DESIGN.md`](DESIGN.md) rather than left implicit. The two decisions that matter
most:

- **No purple.** The generator default for anything labelled "AI chat" is
  `#7C3AED`, the clearest tell of a generated interface. The accent here is
  crimson, taken from the Nepali flag, and used in a graphic role only.
- **Two accent tokens.** `#E5484D` measures 3.9:1 against the page background —
  correct for a rail, ring or mark (needs 3:1), not for body text (needs 4.5:1).
  `#FF6369` is the readable variant at 6.6:1. One token would have forced a
  choice between a dull accent and unreadable links.

---

## Limits and roadmap

Stated plainly, because a reader deciding whether to build on this needs the gaps
as much as the features.

- **No authentication.** Anyone with the URL can use the model endpoint, at the
  endpoint's expense.
- **No server-side rate limiting.** A single caller can saturate the GPU.
- **History is per-browser.** Conversations do not follow a user across devices.
- **The demo endpoint is session-bound.** The hosted model is offline whenever
  the GPU session ends.
- **300-second function ceiling.** Very long answers from a slow CPU-only
  backend can still be cut off.

Roadmap: authentication and per-user quotas on `/api/chat`; a stable hosted
endpoint on a persistent GPU host; optional synced history behind that auth; a
published evaluation of Nepali answer quality against the base model; a
Docker/compose file for one-command self-hosting.

---

## Attribution

| Component | Status | Licence |
|---|---|---|
| This client (UI, streaming proxy, design system) | This project's work | MIT |
| Puja Set Nepal 1.1 — fine-tune, identity tuning, serving stack | This project's work | See the adapter card |
| `Qwen/Qwen3.5-9B` base weights | Not this project's work | Apache-2.0 |
| Next.js, React, Tailwind, `react-markdown`, `lucide-react` | Third-party dependencies | Their own licences |

The chat persona presents the served model as Puja Set Nepal 1.1, which it is — a
LoRA fine-tune carrying this project's identity and behaviour tuning on top of an
openly licensed base.

## Credits

Built by [Samir Puri](https://samirpuri.com.np) (DevSamirX) in Bharatpur, Chitwan,
Nepal. Issues and pull requests are welcome.

## Licence

[MIT](LICENSE) for this repository. Third-party components remain under their own
licences as listed above.
