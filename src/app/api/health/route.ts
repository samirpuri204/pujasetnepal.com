import { baseUrl, modelId, modelsUrl, safeHost } from "@/lib/upstream";
import type { EndpointStatus } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/health — is there a model behind this UI right now?
 *
 * This exists because the inference server is not always up. It runs on a GPU
 * box behind a temporary tunnel, so it goes away when the session ends. A chat
 * UI with no way to tell "the model is starting" from "the model is gone"
 * produces nothing but confusing failures, so the client polls this instead of
 * guessing.
 *
 * A 5s ceiling is deliberate: a health check that hangs is worse than one that
 * reports "unreachable".
 */
export async function GET() {
  const base = baseUrl();

  if (!base) {
    return Response.json({
      configured: false,
      reachable: false,
      detail: "JAYNEPAL_API_URL is not set.",
    } satisfies EndpointStatus);
  }

  const started = Date.now();
  try {
    const res = await fetch(modelsUrl(base), {
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });

    if (!res.ok) {
      return Response.json({
        configured: true,
        reachable: false,
        detail: `${safeHost(base)} replied ${res.status}.`,
      } satisfies EndpointStatus);
    }

    const data = await res.json().catch(() => null);
    // /v1/models returns { data: [{ id }] }; take the served id when present so
    // the header can show what is actually loaded rather than what we asked for.
    const served: string | undefined =
      data?.data?.[0]?.id ?? data?.id ?? data?.model;

    return Response.json({
      configured: true,
      reachable: true,
      model: served || modelId(),
      detail: `${safeHost(base)} · ${Date.now() - started}ms`,
    } satisfies EndpointStatus);
  } catch (err) {
    const timedOut = err instanceof DOMException && err.name === "TimeoutError";
    return Response.json({
      configured: true,
      reachable: false,
      detail: timedOut
        ? `${safeHost(base)} did not answer within 5s.`
        : `${safeHost(base)} is unreachable.`,
    } satisfies EndpointStatus);
  }
}
