/**
 * Single place that knows how to talk to the model server behind the hosted
 * cloud.
 *
 * The server is an OpenAI-compatible endpoint (the notebook exposes
 * `/v1/models` and `/v1/chat/completions`). People paste that base URL in
 * several different shapes, so normalise here once rather than in every caller.
 *
 * ---
 * On the environment variable names
 *
 * The variables read `JAYNEPAL_*` rather than `PUJASET_*` because they describe
 * the *upstream* — a server that serves the `jaynepal-1.1` adapter — and because
 * renaming them would silently break every existing deployment and `.env.local`
 * for no functional gain.
 *
 * The rebrand is still honest about it: the `PUJASET_*` names are read first, so
 * new deployments can use the product's own prefix, and the old names keep
 * working as a fallback. Two names for one setting is normally a smell; here it
 * is a migration, and `docs#configuration` documents exactly which wins.
 */

/** First key whose value is present and not empty. For URLs, ids and numbers. */
function firstNonEmpty(keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value !== undefined && value.trim() !== "") return value;
  }
  return undefined;
}

/** First key that is defined at all. Needed where "" is a meaningful value. */
function firstDefined(keys: string[]): string | undefined {
  for (const key of keys) {
    if (process.env[key] !== undefined) return process.env[key];
  }
  return undefined;
}

const URL_KEYS = ["PUJASET_API_URL", "JAYNEPAL_API_URL"];
const MODEL_KEYS = ["PUJASET_MODEL", "JAYNEPAL_MODEL"];
const TEMPERATURE_KEYS = ["PUJASET_TEMPERATURE", "JAYNEPAL_TEMPERATURE"];
const MAX_TOKENS_KEYS = ["PUJASET_MAX_TOKENS", "JAYNEPAL_MAX_TOKENS"];
export const SYSTEM_PROMPT_KEYS = [
  "PUJASET_SYSTEM_PROMPT",
  "JAYNEPAL_SYSTEM_PROMPT",
];

export function baseUrl(): string | null {
  const b = firstNonEmpty(URL_KEYS)?.trim();
  return b ? b.replace(/\/+$/, "") : null;
}

export function modelId(): string {
  return firstNonEmpty(MODEL_KEYS) || "jaynepal-1.1";
}

export function temperature(): number {
  const n = Number(firstNonEmpty(TEMPERATURE_KEYS) ?? 0.7);
  return Number.isFinite(n) ? n : 0.7;
}

export function maxTokens(): number {
  const n = Number(firstNonEmpty(MAX_TOKENS_KEYS) ?? 1024);
  return Number.isFinite(n) && n > 0 ? n : 1024;
}

export function rawSystemPromptOverride(): string | undefined {
  return firstDefined(SYSTEM_PROMPT_KEYS);
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
