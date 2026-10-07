/**
 * One place for every brand string, URL and product fact the UI renders.
 *
 * Names, domains and version numbers are data, so they live in data: a rename
 * should be one file, not a hunt through metadata, headers and footers that
 * leaves one string behind.
 */

export const site = {
  /** The platform. */
  name: "Puja Set Nepal",
  title: "Jaynepal 1.1 — a Nepali language model, hosted",
  tagline: "A Nepali language model, made in Nepal and served over an API.",
  description:
    "Jaynepal 1.1 is a Nepali-first language model made in Nepal. It answers in Nepali, Romanised Nepali or English, and it is served from a hosted, OpenAI-compatible endpoint — so you can build on it without running a GPU.",

  domain: "pujasetnepal.com",
  url: "https://pujasetnepal.com",

  /** The model. This is the product; the platform is how you reach it. */
  model: {
    name: "Jaynepal 1.1",
    /** The id sent as `model` in a request body. */
    id: "jaynepal-1.1",
    version: "1.1",
    parameters: "9B",
    languages: ["Nepali (Devanagari)", "Romanised Nepali", "English"],
    context: "8,192 tokens",
    defaults: {
      temperature: "0.7",
      maxTokens: "1024",
    },
  },

  api: {
    /** Canonical base URL for the hosted endpoint. */
    baseUrl: "https://pujasetnepal.com/v1",
    modelsUrl: "https://pujasetnepal.com/v1/models",
    completionsUrl: "https://pujasetnepal.com/v1/chat/completions",
  },

  links: {
    github: "https://github.com/samirpuri204/pujasetnepal.com",
    issues: "https://github.com/samirpuri204/pujasetnepal.com/issues",
    weights: "https://huggingface.co/sami5645678/Jaynepal1.1",
    creator: "https://samirpuri.com.np",
  },

  creator: {
    name: "Samir Puri",
    handle: "DevSamirX",
    place: "Bharatpur, Chitwan, Nepal",
  },

  license: "MIT",
} as const;

/** Primary navigation, shared by the header and the footer. */
export const nav = [
  { href: "/", label: "Product" },
  { href: "/docs", label: "Documentation" },
  { href: "/docs#api", label: "API reference" },
] as const;
