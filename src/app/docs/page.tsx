import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

export const metadata = {
  // The layout's title template appends the brand, so this stays a bare word.
  title: "Documentation",
  description:
    "Model card, quickstart, and the full API reference for Jaynepal 1.1 — a Nepali language model served from a hosted, OpenAI-compatible endpoint.",
  alternates: { canonical: `${site.url}/docs` },
};

/* ------------------------------------------------------------------ pieces -- */

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "model", label: "Model card" },
  { id: "quickstart", label: "Quickstart" },
  { id: "api", label: "API reference" },
  { id: "streaming", label: "Streaming" },
  { id: "errors", label: "Errors" },
  { id: "access", label: "Access and status" },
  { id: "limits", label: "Limits and roadmap" },
  { id: "credits", label: "Credits" },
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

function Note({
  children,
  tone = "warn",
}: {
  children: React.ReactNode;
  tone?: "warn" | "info";
}) {
  return (
    <div
      className="mt-4 max-w-[68ch] border-l-2 bg-[var(--surface)] py-3 pl-4 pr-3 text-[13.5px] leading-relaxed text-[var(--muted)]"
      style={{
        borderColor: tone === "warn" ? "var(--warn)" : "var(--accent)",
      }}
    >
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
            Everything needed to call {site.model.name}.
          </h1>
          <P>
            {site.model.name} is a Nepali-first language model made in Nepal and
            served by {site.name} from a hosted, OpenAI-compatible endpoint. This
            page covers what the model is, how to send it a request, and what it
            is genuinely not good at yet.
          </P>

          <div className="mt-10 flex flex-col gap-10">
            {/* ------------------------------------------------- overview */}
            <section>
              <H2 id="overview">Overview</H2>
              <P>
                You reach {site.model.name} over plain HTTP. There is no SDK to
                install, no weights to download and no GPU to rent: send a{" "}
                <Mono>POST</Mono> to the completions endpoint with your messages,
                and the answer comes back — streamed by default.
              </P>
              <P>
                The interface is the OpenAI chat-completions shape, so an
                existing client library or agent framework works by changing two
                values: the base URL, and the model id.
              </P>
              <Code>{`Base URL     ${site.api.baseUrl}
Model id     ${site.model.id}
Endpoint     POST ${site.api.baseUrl}/chat/completions
Models       GET  ${site.api.baseUrl}/models`}</Code>

              <H3>How a request is served</H3>
              <Code>{`your app  ──►  hosted API  ──►  ${site.model.name}  ──►  streamed reply
                (${site.domain})   (${site.model.parameters})`}</Code>
              <P>
                The API is the boundary you integrate against. Which host the
                model runs on, how it is batched and how it is scaled are ours to
                change without asking you to redeploy, as long as the contract
                below holds.
              </P>
            </section>

            {/* ---------------------------------------------- model card */}
            <section>
              <H2 id="model">Model card</H2>
              <Table
                head={["Field", "Value"]}
                rows={[
                  ["Model", site.model.name],
                  ["Model id", <Mono key="i">{site.model.id}</Mono>],
                  ["Version", site.model.version],
                  ["Parameters", site.model.parameters],
                  ["Languages", site.model.languages.join(" · ")],
                  ["Context window", site.model.context],
                  ["Serving interface", "OpenAI-compatible HTTP API, SSE streaming"],
                  [
                    "Trained by",
                    `${site.creator.name} — ${site.creator.place}`,
                  ],
                ]}
              />

              <H3>What it is built for</H3>
              <P>
                Nepali conversation and Nepali prose. It replies in the language
                you wrote in — Devanagari, Romanised Nepali or English — and
                holds that choice instead of drifting back to English. It handles
                the ordinary work a Nepali-speaking user needs from an assistant:
                explaining concepts, drafting text, translating between the three
                registers, and writing code with English technical terms around
                Nepali explanation.
              </P>
              <P>
                It also writes Markdown, because structure is what makes a long
                answer readable — headings, lists, tables and fenced code blocks
                come back as Markdown rather than as plain paragraphs.
              </P>

              <H3>What it is not</H3>
              <P>
                Stated plainly, because these are the questions a reader will
                actually hit:
              </P>
              <Table
                head={["Limitation", "What that means in practice"]}
                rows={[
                  [
                    "It is small",
                    `${site.model.parameters} parameters, not a frontier model. It is strong for its size in Nepali and weaker than a very large model on hard reasoning, long maths and obscure world knowledge.`,
                  ],
                  [
                    "Academic Nepali is uneven",
                    "Formal legal, medical and academic registers are less reliable than everyday conversation. For anything published, have a native speaker review the output.",
                  ],
                  [
                    "It is not a knowledge base",
                    "It can state things confidently and wrongly. Treat factual claims — especially dates, numbers and current events — as drafts to verify.",
                  ],
                  [
                    "No tool use",
                    "It does not browse, call functions or run code. It answers from the prompt and what it learned while training.",
                  ],
                  [
                    "Devanagari is not transliterated for you",
                    "Ask for Romanised Nepali or Devanagari explicitly if the client or channel needs one of them.",
                  ],
                ]}
              />
            </section>

            {/* ---------------------------------------------- quickstart */}
            <section>
              <H2 id="quickstart">Quickstart</H2>
              <P>
                Nothing to install. Export the base URL and your key, then send
                a request.
              </P>
              <Code>{`export JAYNEPAL_API="${site.api.baseUrl}"
export JAYNEPAL_API_KEY="..."      # when access is keyed

curl -N "$JAYNEPAL_API/chat/completions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $JAYNEPAL_API_KEY" \\
  -d '{
        "model": "${site.model.id}",
        "messages": [
          { "role": "user", "content": "लमजुङ किन प्रसिद्ध छ?" }
        ],
        "stream": true
      }'`}</Code>

              <H3>Confirm the model is there</H3>
              <Code>{`curl "$JAYNEPAL_API/models"

{ "object": "list",
  "data": [ { "id": "${site.model.id}", "object": "model" } ] }`}</Code>

              <H3>From Python, with an OpenAI client</H3>
              <Code>{`from openai import OpenAI

client = OpenAI(base_url=os.environ["JAYNEPAL_API_URL"],
                api_key=os.environ["JAYNEPAL_API_KEY"])

stream = client.chat.completions.create(
    model="${site.model.id}",
    messages=[{"role": "user", "content": "नमस्ते, तपाईं कस्तो छ?"}],
    stream=True,
)

for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="", flush=True)`}</Code>
              <Note tone="info">
                Any OpenAI-compatible client works — the base URL and the model
                id are the only two things that change.
              </Note>
            </section>

            {/* ----------------------------------------------------- API */}
            <section>
              <H2 id="api">API reference</H2>

              <H3>POST /chat/completions</H3>
              <Code>{`POST ${site.api.baseUrl}/chat/completions
Content-Type: application/json
Authorization: Bearer <key>        # when access is keyed

{
  "model": "${site.model.id}",
  "messages": [
    { "role": "system",    "content": "optional persona" },
    { "role": "user",      "content": "नमस्ते" }
  ],
  "temperature": ${site.model.defaults.temperature},
  "max_tokens": ${site.model.defaults.maxTokens},
  "stream": true
}`}</Code>

              <H3>Request body</H3>
              <Table
                head={["Field", "Type", "Default", "Notes"]}
                rows={[
                  [
                    <Mono key="f">model</Mono>,
                    "string",
                    <Mono key="d">{site.model.id}</Mono>,
                    "Required. The only id currently served.",
                  ],
                  [
                    <Mono key="f">messages</Mono>,
                    "array",
                    "—",
                    "Required. Roles are user, assistant and system. Send the whole conversation each time; the model holds no state between requests.",
                  ],
                  [
                    <Mono key="f">temperature</Mono>,
                    "number",
                    site.model.defaults.temperature,
                    "0 is nearly deterministic, 1 is loose. Lower it for factual or technical answers, raise it for drafting.",
                  ],
                  [
                    <Mono key="f">max_tokens</Mono>,
                    "integer",
                    site.model.defaults.maxTokens,
                    "Ceiling on the reply. Generous values cost latency you do not get back if the model finishes early.",
                  ],
                  [
                    <Mono key="f">stream</Mono>,
                    "boolean",
                    "true",
                    "Server-sent events instead of one JSON body. See Streaming below.",
                  ],
                ]}
              />

              <H3>Response — non-streaming</H3>
              <Code>{`{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "model": "${site.model.id}",
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "message": { "role": "assistant", "content": "..." }
    }
  ],
  "usage": { "prompt_tokens": 18, "completion_tokens": 96, "total_tokens": 114 }
}`}</Code>

              <H3>GET /models</H3>
              <P>
                Lists what the endpoint is serving. Useful as a cheap liveness
                check, and as the first thing to try when a request fails.
              </P>
              <Code>{`GET ${site.api.baseUrl}/models

{ "object": "list", "data": [ { "id": "${site.model.id}", "object": "model" } ] }`}</Code>
            </section>

            {/* ------------------------------------------------ streaming */}
            <section>
              <H2 id="streaming">Streaming</H2>
              <P>
                With <Mono>stream: true</Mono> — the default — the response is a
                sequence of server-sent events, each carrying one fragment of the
                reply, terminated by a literal{" "}
                <Mono>[DONE]</Mono> line.
              </P>
              <Code>{`data: {"choices":[{"delta":{"content":"लमजुङ"}}]}
data: {"choices":[{"delta":{"content":" जिल्ला"}}]}
data: {"choices":[{"delta":{"content":" हो"}}]}
data: [DONE]`}</Code>

              <H3>Consuming it without breaking Nepali</H3>
              <P>
                Read the response as a <em>byte</em> stream and decode with
                buffering enabled, splitting lines only on complete newlines. A
                Devanagari character is several bytes, and a token can land in
                the middle of one; decoding each chunk independently turns that
                into mojibake in exactly the language this model exists to serve.
              </P>
              <Code>{`reader = response.iter_lines(decode_unicode=False)
buffer = b""

for chunk in reader:
    buffer += chunk + b"\\n"
    lines = buffer.split(b"\\n")
    buffer = lines.pop()          # keep the partial line for next time
    for line in lines:
        if not line.startswith(b"data: "):
            continue
        payload = line[6:]
        if payload == b"[DONE]":
            break
        text = json.loads(payload)["choices"][0]["delta"].get("content", "")
        print(text, end="", flush=True)`}</Code>
              <Note tone="info">
                Fragment boundaries are not word boundaries. Accumulate deltas
                and re-render; never assume one chunk is one word or one
                character.
              </Note>
            </section>

            {/* --------------------------------------------------- errors */}
            <section>
              <H2 id="errors">Errors</H2>
              <P>
                Failures are JSON, not an empty stream — so a client can tell
                &ldquo;the model said nothing&rdquo; apart from &ldquo;the model
                could not be reached&rdquo;.
              </P>
              <Code>{`{
  "error": {
    "message": "human-readable description",
    "type": "invalid_request_error",
    "code": "bad_request"
  }
}`}</Code>
              <Table
                head={["Status", "Code", "Cause"]}
                rows={[
                  ["400", <Mono key="c">bad_request</Mono>, "Body was not JSON, messages was empty, or a message had no valid role and string content."],
                  ["401", <Mono key="c">invalid_api_key</Mono>, "Missing or wrong key, when the endpoint is keyed."],
                  ["404", <Mono key="c">model_not_found</Mono>, "The model field does not name the served model."],
                  ["429", <Mono key="c">rate_limited</Mono>, "Too many requests in flight. Back off and retry."],
                  ["502", <Mono key="c">upstream_unreachable</Mono>, "The model host could not be reached — usually the serving session not running."],
                  ["503", <Mono key="c">unavailable</Mono>, "The model is loading. Retry shortly."],
                  ["504", <Mono key="c">timeout</Mono>, "No response within the gateway window. Long answers on a CPU-only host can hit this."],
                ]}
              />
              <Note>
                Retry <Mono>429</Mono> and <Mono>503</Mono> with exponential
                backoff. Do not retry <Mono>400</Mono> — the request itself is
                wrong and will fail again.
              </Note>
            </section>

            {/* --------------------------------------------------- access */}
            <section>
              <H2 id="access">Access and status</H2>
              <P>
                The canonical production base URL is{" "}
                <Mono>{site.api.baseUrl}</Mono>. Access is arranged directly at
                the moment rather than granted by a signup form, and the
                endpoint you are given is the one to use in{" "}
                <Mono>base_url</Mono>.
              </P>
              <Note>
                <strong className="text-[var(--fg)]">
                  The hosted endpoint is not yet publicly attached.
                </strong>{" "}
                Today the model runs behind a session-bound GPU host, which means
                its address changes when the session restarts. That is fine for
                evaluation and integration work, and not yet fine for a product
                that promises five nines. A permanently hosted endpoint is the
                first item on the roadmap below.
              </Note>

              <H3>Bringing up an endpoint yourself</H3>
              <P>
                The interface is standard, so any server that speaks OpenAI chat
                completions can front the model while the hosted one is being
                brought up — a rented GPU box with vLLM, llama.cpp, or a GPU
                Space. Point your client at it and the code below does not
                change.
              </P>
              <Code>{`# 1. serve it
vllm serve <jaynepal-1.1> --port 8000 --max-model-len 8192

# 2. confirm the contract
curl http://localhost:8000/v1/models

# 3. use it — the only change your client needs
export JAYNEPAL_API=http://localhost:8000/v1`}</Code>
            </section>

            {/* --------------------------------------------------- limits */}
            <section>
              <H2 id="limits">Limits and roadmap</H2>
              <P>
                The gaps, stated as gaps. A reader deciding whether to build on
                a model needs these more than it needs a feature list.
              </P>
              <Table
                head={["Today", "Consequence"]}
                rows={[
                  ["No self-serve keys", "Access is arranged directly, so onboarding is not instant."],
                  ["The evaluation endpoint is session-bound", "It is offline between GPU sessions, and its address moves."],
                  ["No published benchmark", "Quality claims are qualitative until the evaluation below ships."],
                  [`${site.model.context} context`, "Very long documents must be chunked or summarised rather than pasted whole."],
                  ["No tool calling", "It cannot browse, run code or call your functions."],
                ]}
              />

              <H3>Roadmap</H3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {[
                  "A permanently hosted endpoint on a persistent GPU host.",
                  "Self-serve API keys with per-key quotas and usage reporting.",
                  "A published Nepali evaluation — comprehension, generation and Romanised transcription — against comparable models.",
                  "A quantised release for people who want to run it on their own hardware.",
                  "Deeper register coverage for formal, legal and academic Nepali.",
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

            {/* -------------------------------------------------- credits */}
            <section className="pb-6">
              <H2 id="credits">Credits</H2>
              <P>
                {site.model.name} and this platform are built by{" "}
                <ExternalLink href={site.links.creator}>
                  {site.creator.name}
                </ExternalLink>{" "}
                ({site.creator.handle}) in {site.creator.place}.
              </P>
              <P>
                The model is published on{" "}
                <ExternalLink href={site.links.weights}>Hugging Face</ExternalLink>
                . The source for this website is on{" "}
                <ExternalLink href={site.links.github}>GitHub</ExternalLink>{" "}
                under the {site.license} licence, and issues and pull requests
                are welcome.
              </P>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--btn-primary-bg)] px-4 py-2.5 text-sm font-medium text-[var(--btn-primary-fg)] transition-opacity duration-150 hover:opacity-90"
                >
                  Back to the overview
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
