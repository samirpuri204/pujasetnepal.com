/**
 * Single place that knows how to talk to the Jaynepal inference server.
 *
 * The server is an OpenAI-compatible endpoint (the Kaggle / Oracle notebook
 * exposes /v1/models and /v1/chat/completions). People paste that base URL in
 * several different shapes, so normalise here once rather than in every caller.
 */

export function baseUrl(): string | null {
  const b = process.env.JAYNEPAL_API_URL?.trim();
  return b ? b.replace(/\/+$/, "") : null;
}

export function modelId(): string {
  return process.env.JAYNEPAL_MODEL || "jaynepal-1.1";
}

/** Accepts `host`, `host/v1`, or a full `.../chat/completions` path. */
export function completionsUrl(base: string): string {
  if (/\/chat\/completions$/.test(base)) return base;
  if (/\/v1$/.test(base)) return `${base}/chat/completions`;
  return `${base}/v1/chat/completions`;
}

export function modelsUrl(base: string): string {
  if (/\/v1$/.test(base)) return `${base}/models`;
  return `${base}/v1/models`;
}

/** Host only — safe to show in the UI, unlike the full URL's path/query. */
export function safeHost(base: string): string {
  try {
    return new URL(base).host;
  } catch {
    return base;
  }
}
