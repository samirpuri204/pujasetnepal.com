import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

export const metadata = {
  // The layout's title template appends the brand, so this stays a bare word.
  title: "Documentation",
  description:
    "Architecture, configuration, the SSE API, deployment and self-hosting notes for the Puja Set Nepal chat client.",
  alternates: { canonical: `${site.url}/docs` },
};

/* ------------------------------------------------------------------ pieces -- */

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "quickstart", label: "Quickstart" },
  { id: "configuration", label: "Configuration" },
  { id: "api", label: "API reference" },
  { id: "deploy", label: "Deploying" },
  { id: "self-host", label: "Self-hosting the model" },
  { id: "design", label: "Design notes" },
  { id: "limits", label: "Limits and roadmap" },
  { id: "attribution", label: "Attribution and licence" },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 border-t border-[var(--border)] pt-10 text-[1.35rem] font-semibold tracking-[-0.02em] first:border-t-0 first:pt-0 sm:text-[1.5rem]"
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-7 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-text)]">
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 max-w-[68ch] text-[14.5px] leading-relaxed text-[var(--muted)]">
      {children}
    </p>
  );
}

function Code({ children }: { children: string }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-[var(--radius)] border border-[var(--border)] bg-[#0a0e14] p-4">
      <pre className="font-mono text-[12.5px] leading-[1.8] text-[var(--fg)]">
        {children}
      </pre>
    </div>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded border border-[var(--border)] bg-[var(--surface-3)] px-1.5 py-0.5 font-mono text-[12.5px] text-[var(--fg)]">
      {children}
    </code>
  );
}

function Table({
  head,
  rows,
}: {
  head: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="mt-4 overflow-x-auto rounded-[var(--radius)] border border-[var(--border)]">
      <table className="w-full min-w-[36rem] border-collapse text-left">
        <thead>
          <tr className="bg-[var(--surface-2)]">
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="border-b border-[var(--border)] px-3.5 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--muted)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="even:bg-[var(--surface)]/40">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border-b border-[var(--border)] px-3.5 py-2.5 align-top text-[13px] leading-relaxed text-[var(--muted)] last:border-b-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 max-w-[68ch] border-l-2 border-[var(--warn)] bg-[var(--surface)] py-3 pl-4 pr-3 text-[13.5px] leading-relaxed text-[var(--muted)]">
      {children}
    </div>
  );
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[var(--accent-text)] underline decoration-1 underline-offset-2 hover:decoration-2"
    >
      {children}
      <ArrowUpRight size={12} aria-hidden />
    </a>
  );
}

/* -------------------------------------------------------------------- page -- */

export default function Page() {
  return (
    <>
      <SiteHeader current="/docs" />

      <div className="mx-auto flex w-full max-w-[72rem] gap-12 px-4 py-10 sm:px-6 sm:py-14">
        {/* ------------------------------------------------------------ TOC */}
        <nav
          aria-label="On this page"
          className="sticky top-24 hidden h-fit w-[13rem] shrink-0 lg:block"
        >
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--faint)]">
            On this page
          </p>
          <ul className="mt-3 flex flex-col gap-1.5 border-l border-[var(--border)]">
            {TOC.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="-ml-px block border-l border-transparent pl-3 text-[13px] text-[var(--muted)] transition-colors duration-150 hover:border-[var(--border-strong)] hover:text-[var(--fg)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ---------------------------------------------------------- body */}
        <main className="min-w-0 flex-1">
          <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-[var(--accent-text)]">
            Documentation
          </p>
          <h1 className="mt-3 text-[1.9rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[2.3rem]">
            Everything needed to run, rebrand or replace this.
          </h1>
          <P>
            {site.name} is the chat client, the hosted endpoint in front of it,
            and the documentation you are reading. This page covers how the
            pieces fit, how to configure them, and — importantly — what is
            genuinely finished and what is not.
          </P>

          <div className="mt-10 flex flex-col gap-10">
            {/* ------------------------------------------------- overview */}
            <section>
              <H2 id="overview">Overview</H2>
              <P>
                This repository is <strong className="text-[var(--fg)]">the
                client</strong>: a Next.js application that renders a chat
                interface and proxies it to a model server. The model weights do
                not run on Vercel — a 9B-parameter model cannot run in a
                serverless function, and the bundle limits are orders of
                magnitude too small. The client is deployed to Vercel; the
                weights live on a GPU box and Vercel proxies to them.
              </P>
              <P>
                So a working chat needs two things: this deployment, and a
                running model server. The interface is written to be honest about
                which of the two is missing — the status pill in the header
                reports what it measured, and a send with no model attached
                returns a clear message rather than a spinner that never ends.
              </P>

              <H3>Routes</H3>
              <Table
                head={["Route", "Kind", "What it does"]}
                rows={[
                  [
                    <Mono key="r">/</Mono>,
                    "Static",
                    "Marketing page: positioning, architecture, capabilities, status.",
                  ],
                  [
                    <Mono key="r">/docs</Mono>,
                    "Static",
                    "This page. Documentation, API reference, attribution.",
                  ],
                  [
                    <Mono key="r">/chat</Mono>,
                    "Client",
                    "The chat application. Streaming UI, thread store, composer.",
                  ],
                  [
                    <Mono key="r">/api/chat</Mono>,
                    "Server",
                    "POST. Streaming proxy to the upstream model server.",
                  ],
                  [
                    <Mono key="r">/api/health</Mono>,
                    "Server",
                    "GET. Is an upstream reachable right now, and what id is it serving?",
                  ],
                  [
                    <Mono key="r">/robots.txt</Mono>,
                    "Static",
                    "Generated from `src/app/robots.ts`.",
                  ],
                  [
                    <Mono key="r">/sitemap.xml</Mono>,
                    "Static",
                    "Generated from `src/app/sitemap.ts`.",
                  ],
                ]}
              />
            </section>

            {/* --------------------------------------------- architecture */}
            <section>
              <H2 id="architecture">Architecture</H2>
              <P>
                One indirection sits between the browser and the model: this
                app&apos;s own server route. The browser calls{" "}
                <Mono>/api/chat</Mono>, never the model server directly.
              </P>
              <Code>{`browser  ──►  ${site.domain} (Vercel)  ──►  /api/chat  ──►  model server
              client + proxy                      (GPU box, OpenAI-compatible)`}</Code>

              <H3>Why the proxy exists</H3>
              <Table
                head={["Reason", "What it buys"]}
                rows={[
                  [
                    "The upstream URL stays server-side",
                    "Changing the GPU box is an environment variable, not a redeploy of the client. The raw endpoint never reaches devtools.",
                  ],
                  [
                    "No CORS dependency",
                    "The upstream does not have to send permissive headers for the UI to work.",
                  ],
                  [
                    "One place for policy",
                    "Auth, quota and rate limiting attach to a single route instead of every fetch call.",
                  ],
                  [
                    "Byte-level buffering",
                    "Multi-byte decoding happens once, server-side, which is what keeps Devanagari readable across chunk boundaries.",
                  ],
                ]}
              />

              <H3>The content of the wire</H3>
              <P>
                In both directions the protocol is three events —{" "}
                <Mono>delta</Mono>, <Mono>done</Mono>, <Mono>error</Mono> — not
                raw OpenAI chunks. Re-emitting the vendor shape would push{" "}
                <Mono>choices[0].delta.content</Mono> into the React component;
                keeping the client ignorant of it means the upstream can be
                swapped for any compatible server without touching the UI.
              </P>

              <H3>Where state lives</H3>
              <P>
                Conversations are in <Mono>localStorage</Mono>, keyed per
                browser. There is no account, no cookie and no server-side
                history — not as a privacy promise layered on top, but because
                there is no database to write to. The trade-off is real: history
                does not follow a user across devices. Syncing it is the natural
                place to add a backend, and it is listed in the roadmap rather
                than implied to already work.
              </P>
            </section>

            {/* ---------------------------------------------- quickstart */}
            <section>
              <H2 id="quickstart">Quickstart</H2>
              <P>
                Node 20 or newer (developed on 22+). No account, no API key, no
                cloud project needed to see the interface.
              </P>
              <Code>{`git clone ${site.links.github}.git
cd pujasetnepal.com
npm install

cp .env.example .env.local     # optional at this stage
npm run dev                    # http://localhost:3000`}</Code>
              <P>
                With an empty <Mono>PUJASET_API_URL</Mono> the app runs fully:
                you can open <Mono>/</Mono>, <Mono>/docs</Mono> and{" "}
                <Mono>/chat</Mono>, and the header reads{" "}
                <Mono>Not configured</Mono>. Sending a message returns a clear
                explanation instead of hanging.
              </P>

              <H3>Production build</H3>
              <Code>{`npm run build      # compile + typecheck + lint
npm run start      # serve the production build locally
npm run lint       # eslint only`}</Code>
            </section>

            {/* ------------------------------------------ configuration */}
            <section>
              <H2 id="configuration">Configuration</H2>
              <P>
                Every variable is read server-side only. None is prefixed{" "}
                <Mono>NEXT_PUBLIC_</Mono>, so no endpoint or setting can leak
                into the browser bundle.
              </P>
              <Table
                head={["Variable", "Default", "Purpose"]}
                rows={[
                  [
                    <span key="v" className="font-mono text-[12.5px] text-[var(--fg)]">
                      PUJASET_API_URL
                    </span>,
                    "—",
                    "Base URL of the inference server. Accepted as https://host, https://host/v1, or the full /v1/chat/completions path — all are normalised. Empty means the UI runs with no model attached.",
                  ],
                  [
                    <span key="v" className="font-mono text-[12.5px] text-[var(--fg)]">
                      PUJASET_MODEL
                    </span>,
                    <Mono key="d">jaynepal-1.1</Mono>,
                    "Model id sent in the request body. Only matters if the server serves more than one.",
                  ],
                  [
                    <span key="v" className="font-mono text-[12.5px] text-[var(--fg)]">
                      PUJASET_TEMPERATURE
                    </span>,
                    "0.7",
                    "Sampling temperature. Non-numeric values fall back to the default.",
                  ],
                  [
                    <span key="v" className="font-mono text-[12.5px] text-[var(--fg)]">
                      PUJASET_MAX_TOKENS
                    </span>,
                    "1024",
                    "Response ceiling. Must stay under (maxDuration × tokens-per-second) for the backend, or long answers are truncated.",
                  ],
                  [
                    <span key="v" className="font-mono text-[12.5px] text-[var(--fg)]">
                      PUJASET_SYSTEM_PROMPT
                    </span>,
                    "built-in persona",
                    "Overrides the system turn. Set to an empty string to send none at all — useful if the backend already prepends its own and you do not want two.",
                  ],
                ]}
              />

              <H3>Legacy names</H3>
              <P>
                The same settings also respond to the older{" "}
                <Mono>JAYNEPAL_*</Mono> names, because the upstream serves the{" "}
                <Mono>jaynepal-1.1</Mono> adapter and existing deployments
                should not break on a rename. The rule is simple: a{" "}
                <strong className="text-[var(--fg)]">non-empty</strong>{" "}
                <Mono>PUJASET_*</Mono> value wins; otherwise the{" "}
                <Mono>JAYNEPAL_*</Mono> value is used. Remove the old keys once
                you have migrated — two names for one setting is a migration
                state, not a design.
              </P>
              <Note>
                The system prompt behaves slightly differently: an{" "}
                <em>empty string</em> is a meaningful value there (send no system
                turn), so it is honoured rather than treated as unset.
              </Note>
            </section>

            {/* ----------------------------------------------- API ref */}
            <section>
              <H2 id="api">API reference</H2>

              <H3>POST /api/chat</H3>
              <P>Streams a completion from the upstream model server.</P>
              <Code>{`POST /api/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "नमस्ते" }
  ],
  "stream": true
}`}</Code>
              <P>
                Valid roles are <Mono>user</Mono>, <Mono>assistant</Mono> and{" "}
                <Mono>system</Mono>. Content is truncated at 32,000 characters
                per message. The system prompt from configuration is prepended
                automatically, so you should not send one yourself.
              </P>

              <H3>Response — server-sent events</H3>
              <Code>{`data: {"type":"delta","text":"नम"}

data: {"type":"delta","text":"स्ते"}

data: {"type":"done"}`}</Code>
              <Table
                head={["Event", "Meaning"]}
                rows={[
                  [<Mono key="e">delta</Mono>, "A fragment of the reply. Concatenate in order; do not assume a fragment is a whole word or character."],
                  [<Mono key="e">done</Mono>, "The turn finished. May carry { reason: \"client_abort\" } when the caller disconnected."],
                  [<Mono key="e">error</Mono>, "The stream failed. Carries a human-readable message."],
                ]}
              />

              <H3>Error responses</H3>
              <Table
                head={["Status", "Code", "Cause"]}
                rows={[
                  ["400", <Mono key="c">bad_request</Mono>, "Body was not JSON, or `messages` was empty or had no valid role/content pair."],
                  ["502", <Mono key="c">upstream_unreachable</Mono>, "The model server could not be reached at all."],
                  ["502", <Mono key="c">upstream_timeout</Mono>, "No response within 30s — usually the backend still loading weights."],
                  ["502", <Mono key="c">upstream_error</Mono>, "The model server answered with a non-2xx status."],
                  ["503", <Mono key="c">not_configured</Mono>, "No endpoint is configured on the server. Set PUJASET_API_URL."],
                ]}
              />
              <P>
                Errors are JSON:{" "}
                <Mono>{`{ error: { code, message, detail? } }`}</Mono>.
              </P>

              <H3>GET /api/health</H3>
              <P>
                Reports whether an upstream is configured and reachable right
                now, with a 5-second ceiling — a health check that hangs is worse
                than one that reports unreachable.
              </P>
              <Code>{`{
  "configured": true,
  "reachable": true,
  "model": "jaynepal-1.1",
  "detail": "gpu-box.example.com · 312ms"
}`}</Code>
              <Note>
                <Mono>detail</Mono> contains the upstream host only, never the
                full URL, so a tunnel URL with credentials in a query string
                cannot leak through an error surface.
              </Note>
            </section>

            {/* ------------------------------------------------ deploying */}
            <section>
              <H2 id="deploy">Deploying</H2>
              <P>
                The client is a standard Next.js app and deploys to Vercel with
                no build configuration. Route handlers run on the Node.js
                runtime, and the chat route declares{" "}
                <Mono>maxDuration = 300</Mono> — raised from the default because
                a CPU-only backend can legitimately take a minute or more for a
                long answer, and a 60-second cap cuts the reply mid-sentence.
              </P>
              <Code>{`# once
vercel link

# set the endpoint before the first deploy that should serve real replies
vercel env add PUJASET_API_URL production

# ship it
vercel deploy --prod`}</Code>

              <H3>Custom domain</H3>
              <P>
                Add <Mono>{site.domain}</Mono> to the Vercel project, then point
                DNS at Vercel: an <Mono>A</Mono> record to{" "}
                <Mono>76.76.21.21</Mono> for the apex, or a{" "}
                <Mono>CNAME</Mono> to <Mono>cname.vercel-dns.com</Mono> for{" "}
                <Mono>www</Mono>. TLS is provisioned automatically once the
                records resolve.
              </P>
              <Note>
                Deploying the client does not start a model. Until{" "}
                <Mono>PUJASET_API_URL</Mono> points at a live server, the
                deployment serves the interface and reports{" "}
                <Mono>Not configured</Mono> — which is the correct behaviour, not
                a broken build.
              </Note>
            </section>

            {/* ---------------------------------------------- self-host */}
            <section>
              <H2 id="self-host">Self-hosting the model</H2>
              <P>
                The upstream is any server that speaks OpenAI chat completions.
                Three practical routes, in increasing order of reliability:
              </P>
              <Table
                head={["Route", "Good for", "Catch"]}
                rows={[
                  ["Free GPU notebook (T4)", "Demos, development, this project's own demo", "Sessions are time-capped and the public tunnel URL changes on every restart."],
                  ["Rented GPU box (vLLM, llama.cpp, Ollama)", "A stable endpoint you can point a domain at", "Costs money continuously, including while idle."],
                  ["Hugging Face Space with a GPU", "A URL that survives restarts", "Cold starts, and the same GPU-memory constraints as any shared host."],
                ]}
              />

              <H3>Steps</H3>
              <Code>{`# 1. serve the model, exposing /v1/models and /v1/chat/completions
#    (vLLM example, with the adapter merged or loaded as a LoRA)
vllm serve <base-or-merged-model> --port 8000 --max-model-len 8192

# 2. verify it answers
curl http://localhost:8000/v1/models

# 3. point the client at it
echo "PUJASET_API_URL=http://localhost:8000/v1" >> .env.local
npm run dev

# 4. confirm through the app's own health route
curl http://localhost:3000/api/health`}</Code>

              <H3>Loading the adapter</H3>
              <P>
                The adapter is published at{" "}
                <ExternalLink href={site.links.weights}>
                  {site.links.weights.replace("https://", "")}
                </ExternalLink>{" "}
                as a LoRA on top of <Mono>{site.model.base}</Mono>. Either merge
                it into the base weights for serving, or load it as a LoRA
                adapter if your server supports that. Keep the base model&apos;s
                own licence file with any redistributed merge.
              </P>
              <Note>
                The tunnel URL changes whenever the notebook restarts — Kaggle
                sessions cap at 12 hours. When it changes, update{" "}
                <Mono>PUJASET_API_URL</Mono> and redeploy. For an endpoint that
                survives restarts you need a host that keeps the process alive.
              </Note>
            </section>

            {/* ---------------------------------------------------- design */}
            <section>
              <H2 id="design">Design notes</H2>
              <P>
                The interface is dark, technical and editorial, and the reasoning
                behind it is written down rather than left implicit. The short
                version:
              </P>
              <Table
                head={["Decision", "Reasoning"]}
                rows={[
                  [
                    "Crimson accent (#E5484D), not purple",
                    "The generator default for anything labelled \"AI chat\" is #7C3AED — the clearest tell of a generated interface. The accent here is taken from the Nepali flag and used in a graphic role only, so it is honest to the brand instead of decorative.",
                  ],
                  [
                    "Two accent tokens",
                    "#E5484D measures 3.9:1 against the page background — fine for a rail, ring or mark (needs 3:1), not for body text (needs 4.5:1). #FF6369 is the readable variant at 6.6:1. One token would have forced a choice between a dull accent and unreadable links.",
                  ],
                  [
                    "Flat transcript, no bubbles",
                    "Avatar-and-bubble spends horizontal width on a wide screen and is the default shape of every generated chat app. A raised surface for the user and a crimson rail for the assistant carries the same meaning without the cost.",
                  ],
                  [
                    "Noto Sans Devanagari in the stack",
                    "IBM Plex Sans ships no Devanagari glyphs. Without a declared face the browser substitutes whatever the OS has, so the same Nepali sentence renders at different sizes per platform — a correctness bug for a Nepali-first model.",
                  ],
                  [
                    "IBM Plex Sans + JetBrains Mono",
                    "A tool with status, counters and identifiers on screen benefits from a mono voice for labels and metadata. Inter is the default for everything and Poppins/Open Sans read as generic SaaS.",
                  ],
                ]}
              />
              <P>
                Accessibility was measured, not assumed: contrast ratios are
                tabulated in the repository&apos;s design notes, status is never
                carried by colour alone, the closed mobile drawer is set{" "}
                <Mono>inert</Mono> so it cannot create invisible tab stops, and
                the 16px composer prevents iOS Safari from zooming on focus.
              </P>
            </section>

            {/* ---------------------------------------------------- limits */}
            <section>
              <H2 id="limits">Limits and roadmap</H2>
              <P>
                Stated plainly, because a reader deciding whether to build on
                this needs the gaps as much as the features.
              </P>
              <Table
                head={["Today", "Consequence"]}
                rows={[
                  ["No authentication", "Anyone with the URL can use the model endpoint, at the endpoint's expense."],
                  ["No server-side rate limiting", "A single caller can saturate the GPU."],
                  ["History is per-browser", "Conversations do not follow a user across devices."],
                  ["The demo endpoint is session-bound", "The hosted model is offline whenever the GPU session ends."],
                  ["300-second function ceiling", "Very long answers from a slow CPU-only backend can still be cut off."],
                ]}
              />
              <H3>Roadmap</H3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {[
                  "Authentication and per-user quotas on /api/chat.",
                  "A stable hosted endpoint on a persistent GPU host, replacing the notebook tunnel.",
                  "Optional synced history, behind the auth work.",
                  "A published evaluation of Nepali answer quality against the base model.",
                  "A Docker/compose file for one-command self-hosting of a compatible backend.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[13.5px] leading-relaxed text-[var(--muted)]"
                  >
                    <span
                      aria-hidden
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* ----------------------------------------------- attribution */}
            <section className="pb-6">
              <H2 id="attribution">Attribution and licence</H2>
              <P>
                Worth being precise about, because the ownership claim only holds
                if the provenance is accurate.
              </P>
              <Table
                head={["Component", "Status", "Licence"]}
                rows={[
                  [
                    "This client (UI, streaming proxy, design system)",
                    "This project's work",
                    <Mono key="l">{site.license}</Mono>,
                  ],
                  [
                    <span key="a">
                      {site.model.label} — the fine-tune, identity tuning, router
                      and serving stack
                    </span>,
                    "This project's work",
                    "See the adapter card",
                  ],
                  [
                    <span key="a">
                      <Mono>{site.model.base}</Mono> base weights
                    </span>,
                    "Not this project's work",
                    "Apache-2.0",
                  ],
                  [
                    <span key="a">
                      <Mono>react-markdown</Mono>, <Mono>remark-gfm</Mono>,{" "}
                      <Mono>rehype-highlight</Mono>, <Mono>lucide-react</Mono>,
                      Next.js, Tailwind
                    </span>,
                    "Third-party dependencies",
                    "Their own licences",
                  ],
                ]}
              />
              <P>
                In short: the fine-tune and the product are this project&apos;s
                work; the base weights are not. The chat persona presents the
                served model as {site.model.label}, which it is — a LoRA
                fine-tune carrying this project&apos;s identity and behaviour
                tuning on top of an openly licensed base.
              </P>

              <H3>Credits</H3>
              <P>
                Built by{" "}
                <ExternalLink href={site.links.creator}>
                  {site.creator.name}
                </ExternalLink>{" "}
                ({site.creator.handle}) in {site.creator.place}. Source on{" "}
                <ExternalLink href={site.links.github}>GitHub</ExternalLink>;
                issues and pull requests are welcome. The adapter is on{" "}
                <ExternalLink href={site.links.weights}>
                  Hugging Face
                </ExternalLink>
                .
              </P>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--btn-primary-bg)] px-4 py-2.5 text-sm font-medium text-[var(--btn-primary-fg)] transition-opacity duration-150 hover:opacity-90"
                >
                  Open the chat
                </Link>
                <a
                  href={site.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border-strong)] px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-[var(--surface-2)]"
                >
                  Read the source
                </a>
              </div>
            </section>
          </div>
        </main>
      </div>

      <SiteFooter />
    </>
  );
}
