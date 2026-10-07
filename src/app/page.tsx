import Link from "next/link";
import {
  ArrowRight,
  Braces,
  Cloud,
  Code,
  FileCode,
  Languages,
  ScrollText,
  Server,
  Terminal,
  Wifi,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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

/* -------------------------------------------------------------------- data -- */

const PILLARS = [
  {
    icon: Languages,
    title: "Nepali first",
    body: (
      <>
        Built for Nepali rather than translated into it. It answers in the
        language you wrote in — Devanagari, Romanised Nepali or English — and
        does not drift back to English unprompted.
      </>
    ),
  },
  {
    icon: Cloud,
    title: "Hosted for you",
    body: (
      <>
        Running a{" "}
        <span className="font-mono text-[12.5px]">
          {site.model.parameters}
        </span>{" "}
        model needs a GPU, so we run it. You get an endpoint and an API key
        arrangement instead of a driver problem.
      </>
    ),
  },
  {
    icon: Braces,
    title: "An interface you already have",
    body: (
      <>
        The wire is{" "}
        <span className="font-mono text-[12.5px]">chat/completions</span>, so an
        OpenAI client library, a curl call or an agent framework works
        unchanged.
      </>
    ),
  },
];

const CAPABILITIES = [
  {
    icon: Languages,
    title: "Devanagari, properly",
    body: "Nepali text is decoded and returned as characters, not escapes. Multi-byte boundaries are handled at the byte level, so replies stream without breaking words apart.",
  },
  {
    icon: Wifi,
    title: "Streaming responses",
    body: "Server-sent events from the first token. Long answers arrive progressively, which is what makes a Nepali reply at generation speed feel usable.",
  },
  {
    icon: FileCode,
    title: "Markdown and code",
    body: "Structure comes back as Markdown — headings, lists, tables and fenced code — so a client can render it without a translation layer.",
  },
  {
    icon: Code,
    title: "Drop-in OpenAI client",
    body: "Point any OpenAI SDK at the base URL and name the model. There is no custom protocol, no proprietary SDK and nothing to install.",
  },
  {
    icon: ScrollText,
    title: "Documented behaviour",
    body: "Parameters, defaults, stream format and error codes are written down rather than discovered by experiment.",
  },
  {
    icon: Server,
    title: "A hosted, not borrowed, endpoint",
    body: "The model runs on our own serving stack behind a single base URL, so your integration does not depend on a notebook session.",
  },
];

const MODEL_CARD: [string, React.ReactNode][] = [
  ["Model", site.model.name],
  ["Model id", <span key="id">{site.model.id}</span>],
  ["Version", site.model.version],
  ["Parameters", site.model.parameters],
  ["Languages", site.model.languages.join(" · ")],
  ["Context", site.model.context],
  ["Interface", "OpenAI-compatible HTTP API · SSE streaming"],
  ["Endpoint", <span key="ep">{site.api.baseUrl}</span>],
  ["Trained by", `${site.creator.name}, ${site.creator.place}`],
];

const STATUS = [
  {
    tone: "ok" as const,
    label: "Working",
    body: "Jaynepal 1.1 answers in Nepali, Romanised Nepali and English, over a streaming OpenAI-compatible API with documented parameters and errors.",
  },
  {
    tone: "warn" as const,
    label: "Demo-grade",
    body: `The public "try it" endpoint runs on a session-bound GPU host, so it goes away when the session ends and its address changes when it comes back. The documented production base URL is ${site.api.baseUrl}.`,
  },
  {
    tone: "faint" as const,
    label: "Planned",
    body: "Self-serve API keys, per-key quotas, a published Nepali evaluation against comparable models, and a permanently hosted endpoint.",
  },
];

/* -------------------------------------------------------------------- page -- */

export default function Page() {
  return (
    <>
      <SiteHeader current="/" />

      <main>
        {/* ------------------------------------------------------------ hero */}
        <Section className="pb-6 sm:pb-10">
          <Eyebrow>Made in Nepal · Hosted API · v{site.model.version}</Eyebrow>

          <h1 className="mt-4 max-w-[26ch] text-[2rem] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[3rem]">
            {site.model.name} is a Nepali language model you can call over HTTP.
          </h1>

          <p className="mt-5 max-w-[64ch] text-[15.5px] leading-relaxed text-[var(--muted)]">
            {site.name} builds and hosts {site.model.name} — a Nepali-first
            model made in Nepal. It answers in Nepali, Romanised Nepali or
            English, and it is served from{" "}
            <span className="font-mono text-[13.5px]">{site.api.baseUrl}</span>,
            so you can integrate it without renting or operating a GPU.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--btn-primary-bg)] px-4 py-2.5 text-sm font-medium text-[var(--btn-primary-fg)] transition-opacity duration-150 hover:opacity-90 active:opacity-80"
            >
              Read the documentation
              <ArrowRight size={15} aria-hidden />
            </Link>
            <Link
              href="/docs#api"
              className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border-strong)] px-4 py-2.5 text-sm font-medium text-[var(--fg)] transition-colors duration-150 hover:bg-[var(--surface-2)]"
            >
              <Terminal size={15} aria-hidden />
              API reference
            </Link>
          </div>

          <dl className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Model", site.model.name],
              ["Languages", "Nepali · Romanised · English"],
              ["Interface", "OpenAI-compatible · streaming"],
              ["Serving", site.domain],
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

        {/* ------------------------------------------------------- the model */}
        <Section id="model" className="border-t border-[var(--border)]">
          <Eyebrow>The model</Eyebrow>
          <h2 className="mt-3 max-w-[30ch] text-[1.55rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.9rem]">
            Built for the language it speaks.
          </h2>
          <p className="mt-4 max-w-[64ch] text-[0.9375rem] leading-relaxed text-[var(--muted)]">
            {site.model.name} was trained in Nepal for Nepali speakers. Three
            things follow from that, and they are the reasons to use it rather
            than a general model with Nepal bolted on.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <Card key={p.title} icon={p.icon} title={p.title}>
                {p.body}
              </Card>
            ))}
          </div>
        </Section>

        {/* ------------------------------------------------------ the hosted */}
        <Section id="hosted" className="border-t border-[var(--border)]">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div>
              <Eyebrow>How it is served</Eyebrow>
              <h2 className="mt-3 text-[1.55rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.9rem]">
                An endpoint, not a deployment
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-[var(--muted)]">
                You do not download weights, install CUDA or book a GPU by the
                hour. Your request goes to a single base URL; the model runs on
                our serving stack behind it and streams the answer back.
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {[
                  "One base URL, one API shape — the same call works from a script, a backend or an agent.",
                  "The model id is all you pass to select it; there is nothing version-specific to wire up on your side.",
                  "Streaming is the default, so a long Nepali answer arrives as it is generated rather than in one late block.",
                  "Parameters and errors are documented, so failures are diagnosable instead of mysterious.",
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
{`your app · script · agent
  │  POST ${site.api.baseUrl}/chat/completions
  │  { model: "${site.model.id}", messages: [...] }
  ▼
${site.name}  ·  hosted API        ${site.domain}
  │  OpenAI-compatible · SSE streaming
  ▼
${site.model.name}  (${site.model.parameters})
  │  Nepali · Romanised Nepali · English
  ▼
streamed reply — delta frames, then done`}
                </pre>
              </div>
              <figcaption className="mt-3 text-[12.5px] text-[var(--faint)]">
                One request, one model, one streamed response. Everything
                between your code and the answer is ours to keep running.
              </figcaption>
            </figure>
          </div>
        </Section>

        {/* -------------------------------------------------------- capabilities */}
        <Section id="capabilities" className="border-t border-[var(--border)]">
          <Eyebrow>Capabilities</Eyebrow>
          <h2 className="mt-3 max-w-[32ch] text-[1.55rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.9rem]">
            What you get when you call it.
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((f) => (
              <Card key={f.title} icon={f.icon} title={f.title}>
                {f.body}
              </Card>
            ))}
          </div>
        </Section>

        {/* ------------------------------------------------------- model card */}
        <Section id="model-card" className="border-t border-[var(--border)]">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div>
              <Eyebrow>Model card</Eyebrow>
              <h2 className="mt-3 text-[1.55rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.9rem]">
                The facts, in one table.
              </h2>
              <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[var(--muted)]">
                Model identity, size, languages and serving interface — the
                things you need before deciding whether to build on it. The{" "}
                <Link
                  href="/docs#model"
                  className="text-[var(--accent-text)] underline decoration-1 underline-offset-2 hover:decoration-2"
                >
                  full model card
                </Link>{" "}
                also lists what it is not good at.
              </p>
            </div>

            <dl className="divide-y divide-[var(--border)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
              {MODEL_CARD.map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4"
                >
                  <dt className="w-[7.5rem] shrink-0 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--faint)]">
                    {label}
                  </dt>
                  <dd className="font-mono text-[13px] leading-snug text-[var(--fg)] sm:font-sans sm:text-[13.5px]">
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
            One request, no SDK.
          </h2>
          <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed text-[var(--muted)]">
            Ask in Nepali and get Nepali back. Streaming is on by default;
            remove the final flag for a single JSON response.
          </p>

          <div className="mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[#0a0e14] p-5">
            <pre className="font-mono text-[12.5px] leading-[1.85] text-[var(--fg)]">
{`curl -N ${site.api.baseUrl}/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $JAYNEPAL_API_KEY" \\
  -d '{
        "model": "${site.model.id}",
        "messages": [
          { "role": "user", "content": "लमजुङ किन प्रसिद्ध छ?" }
        ],
        "stream": true
      }'

data: {"choices":[{"delta":{"content":"लमजुङ"}}]}
data: {"choices":[{"delta":{"content":" जिल्ला"}}]}
data: [DONE]`}
            </pre>
          </div>

          <p className="mt-4 max-w-[62ch] text-[13px] leading-relaxed text-[var(--faint)]">
            That is the production base URL. Access is arranged directly rather
            than through a signup form, so read{" "}
            <Link
              href="/docs#access"
              className="text-[var(--muted)] underline decoration-1 underline-offset-2 hover:text-[var(--accent-text)]"
            >
              access and status
            </Link>{" "}
            before you build against it — the demo host rotates between GPU
            sessions.
          </p>

          <Link
            href="/docs#quickstart"
            className="mt-5 inline-flex items-center gap-2 text-[13.5px] font-medium text-[var(--accent-text)] underline decoration-1 underline-offset-2 hover:decoration-2"
          >
            Full quickstart, parameters and streaming format
            <ArrowRight size={14} aria-hidden />
          </Link>
        </Section>

        {/* -------------------------------------------------------------- status */}
        <Section id="status" className="border-t border-[var(--border)]">
          <Eyebrow>Status</Eyebrow>
          <h2 className="mt-3 max-w-[34ch] text-[1.55rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.9rem]">
            Described accurately, not flatteringly.
          </h2>
          <p className="mt-4 max-w-[64ch] text-[0.9375rem] leading-relaxed text-[var(--muted)]">
            A page that overstates what works is the fastest way to lose the
            developers it is written for. Here is the real state of things.
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
                <Code
                  size={15}
                  aria-hidden
                  className="text-[var(--accent-text)]"
                />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--muted)]">
                  Start with the spec
                </span>
              </span>
              <h2 className="mt-3 text-[1.35rem] font-semibold tracking-[-0.02em] sm:text-[1.5rem]">
                Everything needed to integrate {site.model.name}.
              </h2>
              <p className="mt-2 max-w-[52ch] text-[13.5px] leading-relaxed text-[var(--muted)]">
                The model card, the request and response shapes, the streaming
                format, every parameter and every error code.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--btn-primary-bg)] px-4 py-2.5 text-sm font-medium text-[var(--btn-primary-fg)] transition-opacity duration-150 hover:opacity-90 active:opacity-80"
              >
                Read the documentation
                <ArrowRight size={15} aria-hidden />
              </Link>
              <a
                href={site.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border-strong)] px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-[var(--surface-2)]"
              >
                <Code size={15} aria-hidden />
                This website&apos;s source
              </a>
            </div>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
