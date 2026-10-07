import { systemPrompt } from "@/lib/system-prompt";
import {
  baseUrl,
  completionsUrl,
  maxTokens,
  modelId,
  temperature,
} from "@/lib/upstream";
import type { ChatRequest, Role } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Raised from 60s. A GPU backend answers in a few seconds, but the same model
// running CPU-only generates at single-digit tokens per second, so a 300-token
// reply can legitimately take a minute or more. At 60s the connection would be
// cut mid-answer and the partial reply would look like a model failure rather
// than a hosting limit.
//
// The real constraint is now the opposite direction: PUJASET_MAX_TOKENS must
// stay under (maxDuration x tokens-per-second) for the backend in use, or the
// tail of every long answer gets truncated.
export const maxDuration = 300;

/**
 * POST /api/chat — streaming proxy to the model server.
 *
 * Why a proxy instead of calling the server straight from the browser:
 *
 *  1. The upstream URL stays server-side. Baking a tunnel hostname into the
 *     client bundle means every URL change needs a redeploy, and it hands the
 *     raw endpoint to anyone who opens devtools.
 *  2. It removes the runtime dependency on the server sending CORS headers.
 *  3. It gives one place to add auth or rate limiting later, without touching
 *     the UI.
 *
 * The wire format in *both* directions is a deliberately tiny SSE protocol:
 *
 *     data: {"type":"delta","text":"..."}
 *     data: {"type":"done"}
 *     data: {"type":"error","message":"..."}
 *
 * Reproducing the full OpenAI chunk shape here would push vendor-specific
 * parsing into the React component. The client should not need to know that
 * choices[0].delta.content exists.
 */

function sse(stream: ReadableStream<Uint8Array>): Response {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      // no-transform stops intermediaries from buffering the stream, which is
      // what turns a token-by-token reply into one long wait.
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

function fail(code: string, message: string, status: number, extra?: object) {
  return Response.json({ error: { code, message, ...extra } }, { status });
}

const VALID_ROLES: Role[] = ["user", "assistant", "system"];

export async function POST(req: Request) {
  const base = baseUrl();

  if (!base) {
    return fail(
      "not_configured",
      "No model endpoint is configured on the server (set PUJASET_API_URL, or the legacy JAYNEPAL_API_URL), so there is no model to talk to yet.",
      503,
    );
  }

  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return fail("bad_request", "Request body was not valid JSON.", 400);
  }

  const incoming = Array.isArray(body?.messages) ? body.messages : [];
  if (incoming.length === 0) {
    return fail("bad_request", "`messages` must be a non-empty array.", 400);
  }

  const cleaned = incoming
    .filter((m) => m && VALID_ROLES.includes(m.role) && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 32_000) }));

  if (cleaned.length === 0) {
    return fail("bad_request", "No message had a valid role and string content.", 400);
  }

  const sys = systemPrompt();
  const messages = sys ? [{ role: "system" as const, content: sys }, ...cleaned] : cleaned;

  // Client disconnect and a connect timeout both need to cancel the upstream
  // request: without this, abandoning a turn leaves the model generating into a
  // dead socket. AbortSignal.any is not used because the connect timer must be
  // cleared once headers arrive — a plain timeout would also kill long streams.
  const ac = new AbortController();
  const onAbort = () => ac.abort();
  req.signal.addEventListener("abort", onAbort);
  const connectTimer = setTimeout(() => ac.abort(), 30_000);

  let upstream: Response;
  try {
    upstream = await fetch(completionsUrl(base), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        model: modelId(),
        messages,
        stream: body.stream !== false,
        temperature: temperature(),
        max_tokens: maxTokens(),
      }),
      signal: ac.signal,
      cache: "no-store",
    });
  } catch (err) {
    clearTimeout(connectTimer);
    req.signal.removeEventListener("abort", onAbort);
    const aborted = ac.signal.aborted && !req.signal.aborted;
    return fail(
      aborted ? "upstream_timeout" : "upstream_unreachable",
      aborted
        ? "The model server did not respond within 30s. It is probably still loading weights."
        : `Could not reach the model server at ${new URL(base).host}.`,
      502,
      { detail: err instanceof Error ? err.message : String(err) },
    );
  }

  clearTimeout(connectTimer);

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    req.signal.removeEventListener("abort", onAbort);
    return fail(
      "upstream_error",
      `The model server replied ${upstream.status}.`,
      502,
      { detail: text.slice(0, 600) },
    );
  }

  // Non-streaming path: drain the JSON and hand it back as a single delta.
  if (body.stream === false) {
    const data = await upstream.json().catch(() => null);
    req.signal.removeEventListener("abort", onAbort);
    const text =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ??
      "";
    return Response.json({ content: typeof text === "string" ? text : "" });
  }

  const enc = new TextEncoder();
  const decoder = new TextDecoder();
  const upstreamBody = upstream.body;

  const out = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));

      const reader = upstreamBody.getReader();
      let buffer = "";
      let closed = false;

      const close = () => {
        if (closed) return;
        closed = true;
        try {
          controller.close();
        } catch {
          /* already closed by the client */
        }
      };

      try {
        // Reading a byte stream in a loop and decoding with {stream:true} keeps
        // multi-byte characters intact when a token lands on a chunk boundary —
        // which for Devanagari is the common case, not the edge case.
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const raw of lines) {
            const line = raw.trim();
            if (!line || !line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (payload === "[DONE]") {
              send({ type: "done" });
              close();
              return;
            }
            try {
              const chunk = JSON.parse(payload);
              const delta = chunk?.choices?.[0]?.delta;
              const text = delta?.content ?? chunk?.choices?.[0]?.text;
              if (typeof text === "string" && text.length > 0) {
                send({ type: "delta", text });
              }
            } catch {
              // A malformed chunk is not worth killing the turn over; the next
              // one usually parses and the user still gets their answer.
            }
          }
        }
        send({ type: "done" });
      } catch (err) {
        if (!req.signal.aborted) {
          send({
            type: "error",
            message: err instanceof Error ? err.message : "Stream failed.",
          });
        } else {
          // The user pressed stop. That is a normal outcome, not an error.
          send({ type: "done", reason: "client_abort" });
        }
      } finally {
        req.signal.removeEventListener("abort", onAbort);
        try {
          reader.releaseLock();
        } catch {
          /* noop */
        }
        close();
      }
    },
  });

  return sse(out);
}
