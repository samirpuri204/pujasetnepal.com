import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Braces,
  Cloud,
  Cpu,
  GitFork,
  Languages,
  Lock,
  Plug,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LiveStatus } from "@/components/live-status";
import { site } from "@/lib/site";

export const metadata = {
  alternates: { canonical: site.url },
};

/* ------------------------------------------------------------------ pieces -- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-[var(--accent-text)]">
      {children}
    </p>
  );
}

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-[72rem] px-4 py-14 sm:px-6 sm:py-20 ${className}`}
    >
      {children}
    </section>
  );
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
      <Icon size={18} aria-hidden />
      <h3 className="mt-3 text-[15px] font-semibold tracking-[-0.01em]">
        {title}
      </h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">
        {children}
      </p>
    </div>
  );
}

/* --------------------------------------------------------------- positioning */

const PILLARS = [
  {
    icon: GitFork,
    title: "An open-source client",
    body: (
      <>
        The whole chat application — streaming, Devanagari handling, the design
        system — is {site.license}-licensed and on GitHub. Fork it, rebrand it,
        ship it against your own endpoint.
      </>
    ),
  },
  {
    icon: Cloud,
    title: "A hosted cloud behind it",
    body: (
      <>
        Running a 9B model is the hard part, so we run it. The client talks to a
        hosted, OpenAI-compatible endpoint — swap the URL and the same UI serves
        your own model instead.
      </>
    ),
  },
  {
    icon: Boxes,
    title: "Open weights, attributed",
    body: (
      <>
        The served model is a LoRA fine-tune on top of{" "}
        <span className="font-mono text-[12.5px]">{site.model.base}</span>{" "}
        (Apache-2.0). The adapter is published, and the base is credited rather
        than implied.
      </>
    ),
  },
];

const FEATURES = [
  {
    icon: Languages,
    title: "Nepali-first, not translated",
    body: "Ask in Devanagari, Romanised Nepali or English. The model mirrors whichever you used instead of drifting back to English.",
  },
  {
    icon: ShieldCheck,
    title: "Devanagari-safe streaming",
    body: "Both the proxy and the client decode byte streams with buffered partial lines, so a token landing mid-character cannot produce mojibake in the language this exists to serve.",
  },
  {
    icon: Plug,
    title: "OpenAI-compatible upstream",
    body: "The backend speaks /v1/chat/completions. Anything that does — vLLM, llama.cpp, Ollama, a rented GPU box — can back this UI.",
  },
  {
    icon: Lock,
    title: "No account, no server-side history",
    body: "Conversations live in this browser's localStorage. Nothing about your prompts is stored on the server, because there is nowhere to store it.",
  },
  {
    icon: Cpu,
    title: "Stop means stop",
    body: "A cancelled turn aborts the upstream request, so the GPU stops generating into a dead socket. It is marked Stopped by you, not shown as a failure.",
  },
  {
    icon: Braces,
    title: "A three-event protocol",
    body: "delta / done / error on the wire. The React component never parses choices[0].delta.content, so the vendor shape stays in one file.",
  },
];

const STACK = [
  ["Framework", "Next.js 16 (App Router, Turbopack), React 19"],
  ["Styling", "Tailwind CSS v4 with a CSS-variable token layer"],
  ["Type", "IBM Plex Sans, JetBrains Mono, Noto Sans Devanagari"],
  ["Streaming", "Server-side SSE proxy over OpenAI chat completions"],
  ["Hosting", "Vercel (client) · GPU box or Kaggle session (model)"],
  ["Licence", `${site.license} (this repository)`],
];

const STATUS = [
  {
    tone: "ok" as const,
    label: "Working now",
    body: "Streaming chat, Nepali and Romanised input, conversation history in the browser, deployment on Vercel, and a documented SSE API.",
  },
  {
    tone: "warn" as const,
    label: "Demo-grade",
    body: "The hosted model runs on a session-bound GPU box, so the tunnel URL changes when the session restarts. Expect the demo to be offline sometimes — the header tells you which.",
  },
  {
    tone: "faint" as const,
    label: "Not built yet",
    body: "Authentication, per-user rate limits, team workspaces, and synced history across devices. These are the roadmap, not silent gaps.",
  },
];

/* ------------------------------------------------------------------- page -- */

export default function Page() {
  return (
    <>
      <SiteHeader current="/" />

      <main>
        {/* ------------------------------------------------------------ hero */}
        <Section className="pb-6 sm:pb-10">
          <Eyebrow>Open source · Hosted cloud · Made in Nepal</Eyebrow>

          <h1 className="mt-4 max-w-[24ch] text-[2rem] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[3rem]">
            Nepali-first AI you can self-host — and a cloud that runs it for you.
          </h1>

          <p className="mt-5 max-w-[62ch] text-[15.5px] leading-relaxed text-[var(--muted)]">
            {site.name} is an early-stage AI developer platform from Nepal. The
            chat client is open source; the inference cloud behind it is ours to
            run. Point the client at our hosted endpoint, or at your own GPU —
            the wire between them is plain, documented{" "}
            <span className="font-mono text-[13.5px]">chat/completions</span>.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--btn-primary-bg)] px-4 py-2.5 text-sm font-medium text-[var(--btn-primary-fg)] transition-opacity duration-150 hover:opacity-90 active:opacity-80"
            >
              Open the chat
              <ArrowRight size={15} aria-hidden />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border-strong)] px-4 py-2.5 text-sm font-medium text-[var(--fg)] transition-colors duration-150 hover:bg-[var(--surface-2)]"
            >
              <Terminal size={15} aria-hidden />
              Read the documentation
            </Link>
            <LiveStatus className="ml-0 sm:ml-1" />
          </div>

          <dl className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Model", site.model.label],
              ["Base weights", `${site.model.base} · Apache-2.0`],
              ["Interface", "OpenAI-compatible · SSE"],
              ["Licence", `${site.license} · open source`],
            ].map(([label, value]) => (
              <div key={label} className="bg-[var(--surface)] p-4">
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--faint)]">
                  {label}
                </dt>
                <dd className="mt-1.5 text-[13.5px] leading-snug text-[var(--fg)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* ------------------------------------------------------- positioning */}
        <Section id="platform" className="border-t border-[var(--border)]">
          <Eyebrow>The platform</Eyebrow>
          <h2 className="mt-3 max-w-[30ch] text-[1.55rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.9rem]">
            A developer tool that happens to ship its own cloud.
          </h2>
          <p className="mt-4 max-w-[64ch] text-[0.9375rem] leading-relaxed text-[var(--muted)]">
            Most Nepali AI projects stop at a notebook. This one is packaged as a
            product: a client you can run, an API you can integrate, and a hosted
            endpoint you do not have to operate. Three parts, deliberately
            separable.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <Card key={p.title} icon={p.icon} title={p.title}>
                {p.body}
              </Card>
            ))}
          </div>
        </Section>

        {/* ------------------------------------------------------ architecture */}
        <Section id="architecture" className="border-t border-[var(--border)]">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div>
              <Eyebrow>Architecture</Eyebrow>
              <h2 className="mt-3 text-[1.55rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.9rem]">
                How a message travels
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-[var(--muted)]">
                The browser never talks to the model server. It calls this app&apos;s
                own route, which proxies to the upstream and re-emits a small
                event stream. That one indirection buys four things:
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {[
                  "The upstream URL stays out of the browser bundle, so changing the GPU box is an environment change, not a redeploy of the client.",
                  "No runtime dependency on the model server sending CORS headers.",
                  "One choke point for auth, quota and rate limiting — the roadmap items, already positioned.",
                  "Byte-level buffering in one place, which is what keeps Devanagari intact across chunk boundaries.",
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
            </div>

            <figure className="min-w-0">
              <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[#0a0e14] p-5">
                <pre className="font-mono text-[11.5px] leading-[1.9] text-[var(--muted)]">
{`browser
  │  POST /api/chat   { messages, stream: true }
  ▼
${site.domain}                          Vercel
  │  server route · system prompt · normalise URL
  │  SSE out:  delta · done · error
  ▼
/v1/chat/completions                     OpenAI-compatible
  │
  ▼
${site.model.label}  (${site.model.params} adapter)
  Qwen3.5-9B base · LoRA fine-tune
                                        GPU box / notebook`}
                </pre>
              </div>
              <figcaption className="mt-3 text-[12.5px] text-[var(--faint)]">
                One hop from the browser to the client, one from the client to
                the model. The proxy is where the product&apos;s control lives.
              </figcaption>
            </figure>
          </div>
        </Section>

        {/* -------------------------------------------------------- capabilities */}
        <Section id="capabilities" className="border-t border-[var(--border)]">
          <Eyebrow>Capabilities</Eyebrow>
          <h2 className="mt-3 max-w-[32ch] text-[1.55rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.9rem]">
            Built for Nepali, not translated into it.
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.title} icon={f.icon} title={f.title}>
                {f.body}
              </Card>
            ))}
          </div>
        </Section>

        {/* --------------------------------------------------------------- stack */}
        <Section id="stack" className="border-t border-[var(--border)]">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <div>
              <Eyebrow>Stack</Eyebrow>
              <h2 className="mt-3 text-[1.55rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.9rem]">
                Small, boring, documented.
              </h2>
              <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[var(--muted)]">
                No agent framework, no vector database, no orchestration layer.
                A Next.js app, a streaming proxy and a design system with its
                reasoning written down in{" "}
                <Link
                  href="/docs#design"
                  className="text-[var(--accent-text)] underline decoration-1 underline-offset-2 hover:decoration-2"
                >
                  the design notes
                </Link>
                .
              </p>
            </div>

            <dl className="divide-y divide-[var(--border)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
              {STACK.map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4"
                >
                  <dt className="w-[7.5rem] shrink-0 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--faint)]">
                    {label}
                  </dt>
                  <dd className="text-[13.5px] leading-snug text-[var(--fg)]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Section>

        {/* ----------------------------------------------------------- quickstart */}
        <Section id="quickstart" className="border-t border-[var(--border)]">
          <Eyebrow>Quickstart</Eyebrow>
          <h2 className="mt-3 text-[1.55rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.9rem]">
            Running in three commands.
          </h2>
          <p className="mt-4 max-w-[60ch] text-[0.9375rem] leading-relaxed text-[var(--muted)]">
            The client starts without a model attached — you get the full
            interface and an honest{" "}
            <span className="font-mono text-[13px]">Not configured</span> badge,
            not a crash on the first message.
          </p>

          <div className="mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[#0a0e14] p-5">
            <pre className="font-mono text-[12.5px] leading-[1.85] text-[var(--fg)]">
{`git clone ${site.links.github}.git
cd pujasetnepal.com
npm install

cp .env.example .env.local

# point it at any OpenAI-compatible server (yours, or ours)
PUJASET_API_URL=https://your-endpoint.example.com/v1

npm run dev        # http://localhost:3000`}
            </pre>
          </div>

          <Link
            href="/docs#quickstart"
            className="mt-5 inline-flex items-center gap-2 text-[13.5px] font-medium text-[var(--accent-text)] underline decoration-1 underline-offset-2 hover:decoration-2"
          >
            Full setup, configuration and API reference
            <ArrowRight size={14} aria-hidden />
          </Link>
        </Section>

        {/* -------------------------------------------------------------- status */}
        <Section id="status" className="border-t border-[var(--border)]">
          <Eyebrow>Status</Eyebrow>
          <h2 className="mt-3 max-w-[34ch] text-[1.55rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.9rem]">
            An early-stage project, described accurately.
          </h2>
          <p className="mt-4 max-w-[64ch] text-[0.9375rem] leading-relaxed text-[var(--muted)]">
            A landing page that overstates what works is the fastest way to lose
            the developers it is written for. Here is the real state of things.
          </p>

          <ul className="mt-8 grid gap-4 lg:grid-cols-3">
            {STATUS.map((s) => (
              <li
                key={s.label}
                className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={
                      "h-1.5 w-1.5 rounded-full " +
                      (s.tone === "ok"
                        ? "bg-[var(--ok)]"
                        : s.tone === "warn"
                          ? "bg-[var(--warn)]"
                          : "bg-[var(--faint)]")
                    }
                  />
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    {s.label}
                  </span>
                </span>
                <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--muted)]">
                  {s.body}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        {/* ----------------------------------------------------------------- CTA */}
        <Section className="border-t border-[var(--border)]">
          <div className="flex flex-col gap-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <span className="flex items-center gap-2">
                <Sparkles size={15} aria-hidden className="text-[var(--accent-text)]" />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--muted)]">
                  Try it, or take the code
                </span>
              </span>
              <h2 className="mt-3 text-[1.35rem] font-semibold tracking-[-0.02em] sm:text-[1.5rem]">
                Ask something in Nepali.
              </h2>
              <p className="mt-2 max-w-[48ch] text-[13.5px] leading-relaxed text-[var(--muted)]">
                The chat is free and needs no account. If the hosted model is
                offline, the documentation shows how to run the weights yourself
                in an afternoon.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--btn-primary-bg)] px-4 py-2.5 text-sm font-medium text-[var(--btn-primary-fg)] transition-opacity duration-150 hover:opacity-90 active:opacity-80"
              >
                Open the chat
                <ArrowRight size={15} aria-hidden />
              </Link>
              <a
                href={site.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border-strong)] px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-[var(--surface-2)]"
              >
                <GitFork size={15} aria-hidden />
                View the source
              </a>
            </div>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
