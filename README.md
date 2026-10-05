# Jaynepal 1.1 — chat client

A chat interface for **Jaynepal 1.1**, a Nepali language model made in Nepal by
Samir Puri ([samirpuri.com.np](https://samirpuri.com.np)).

**Live:** https://jaynepal-chat.vercel.app

---

## What this is, and what it is not

This repository is **the client**. It is a Next.js app that talks to a Jaynepal
inference server over the OpenAI chat-completions API.

The model itself does **not** run on Vercel. A 9B-parameter model cannot run in a
serverless function — there is no GPU, and the bundle limits are orders of
magnitude too small. The client is deployed to Vercel; the weights live on a GPU
box (a Kaggle T4 session today) and Vercel proxies to it.

```
browser  ──►  Vercel  ──►  /api/chat (server route)  ──►  Jaynepal inference server
              (this repo)                                 (GPU box, OpenAI-compatible)
```

So the app needs two things to be a working chat: this deployment, **and** a
running model server. Right now only the first exists, which is why the header
reads `NOT CONFIGURED` and a send returns a clear message instead of a reply.
That is the honest state, not a bug — see *Connecting the model* below.

### About the model's provenance

Jaynepal 1.1 is a LoRA fine-tune on top of **Qwen/Qwen3.5-9B** (Apache-2.0). The
adapter is published at
[`sami5645678/Jaynepal1.1`](https://huggingface.co/sami5645678/Jaynepal1.1).

Worth stating plainly in the technical documentation, even though the product
speaks for itself: the fine-tune, the identity tuning, the router and the
serving stack are this project's work; the base weights are not. Being precise
about that is what makes the ownership claim hold up — read the license of any
base you build on and keep the attribution accurate. The chat persona presents
the finished model as Jaynepal 1.1, which it is.

---

## Connecting the model

### 1. Start the inference server

Run the Kaggle notebook (`jaynepal_api.ipynb`) — it serves `/v1/models` and
`/v1/chat/completions` and prints a public tunnel URL.

### 2. Point this app at it

**Locally** — put the URL in `.env.local`:

```bash
JAYNEPAL_API_URL=https://your-tunnel.trycloudflare.com
```

**On Vercel:**

```bash
./scripts/connect-model.sh https://your-tunnel.trycloudflare.com
```

Or set it by hand: Project → Settings → Environment Variables →
`JAYNEPAL_API_URL` → redeploy.

Either form of the URL works — `https://host`, `https://host/v1`, or the full
`https://host/v1/chat/completions`. It is normalised server-side.

> **The tunnel URL changes every time the notebook restarts.** Kaggle sessions
> cap at 12 hours. When the URL changes, re-run `connect-model.sh` with the new
> one. For an endpoint that survives restarts you need a host that keeps the
> process alive (a rented GPU box, or a Hugging Face Space with a GPU); the free
> Kaggle route is for demos and development.

### 3. Confirm

Open the site — the header pill should change from `NOT CONFIGURED` to the model
id. Or check directly:

```bash
curl https://jaynepal-chat.vercel.app/api/health
```

---

## Environment variables

All are read **server-side only**. None are prefixed `NEXT_PUBLIC_`, so the
endpoint never reaches the browser bundle.

| Variable | Default | Purpose |
|---|---|---|
| `JAYNEPAL_API_URL` | *(empty)* | Base URL of the inference server. Empty = UI runs with no model attached. |
| `JAYNEPAL_MODEL` | `jaynepal-1.1` | Model id sent in the request body. |
| `JAYNEPAL_TEMPERATURE` | `0.7` | Sampling temperature. |
| `JAYNEPAL_MAX_TOKENS` | `1024` | Response ceiling. |
| `JAYNEPAL_SYSTEM_PROMPT` | built-in persona | Override the system turn. Set to `""` to send none. |

---

## Running locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve the build
```

Node 20+ (developed on 22).

---

## How it is built

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Styling | Tailwind CSS v4 with a CSS-variable token layer |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| Icons | `lucide-react` |
| Hosting | Vercel |

### Layout of the source

```
src/
  app/
    layout.tsx            fonts, metadata, viewport
    page.tsx              Server Component shell
    globals.css           design tokens + markdown/syntax styling
    icon.svg              brand mark
    api/chat/route.ts     streaming proxy (SSE)
    api/health/route.ts   is a model reachable right now?
  components/
    chat.tsx              shell, streaming, scroll, status
    sidebar.tsx           brand, thread list, mobile drawer
    turn.tsx              one conversational turn
    composer.tsx          input
    empty-state.tsx       first-run state
    markdown.tsx          memoised renderer
  lib/
    types.ts  utils.ts  upstream.ts  system-prompt.ts
    use-threads.ts        conversation store (localStorage)
    use-media-query.ts    layout-mode detection for the drawer
```

### Three decisions worth knowing

**The proxy is server-side.** The browser calls `/api/chat`, not the model
server. That keeps the upstream URL out of the bundle, removes the runtime
dependency on the model server sending CORS headers, and gives one place to add
auth or rate limiting later.

**The wire format is a three-event SSE protocol** (`delta` / `done` / `error`),
not raw OpenAI chunks. The React component should not have to know that
`choices[0].delta.content` exists.

**Conversations live in `localStorage`.** No account, no server-side history.
The trade-off: history is per-browser and does not follow the user across
devices. If that matters later, it is the natural place to add Supabase.

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

---

## Deploying

```bash
vercel deploy --prod
```

Build settings are auto-detected. Set `JAYNEPAL_API_URL` before the first deploy
that should serve real replies.

---

## Limits

- No authentication. Anyone with the URL can use the model endpoint, at the
  endpoint's expense.
- The model server is the bottleneck; the Vercel function caps a request at 60s
  (`maxDuration` in `src/app/api/chat/route.ts`).
- No server-side rate limiting.
- Conversations are not synced between devices.
