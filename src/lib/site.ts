/**
 * One place for every brand string, URL and product fact the UI renders.
 *
 * Why a module instead of literals scattered across components: this project
 * was previously published under a different name, and renaming it meant
 * touching metadata, the sidebar, the empty state, the header and the system
 * prompt independently — the kind of change that always leaves one string
 * behind. Names, domains and version numbers are data, so they live in data.
 *
 * Provenance is recorded here on purpose. `Puja Set Nepal` is the product and
 * the brand; the served weights are the `jaynepal-1.1` LoRA adapter on top of
 * an Apache-2.0 base. Stating that plainly in one place is what makes the
 * ownership claim hold up in the documentation.
 */

export const site = {
  name: "Puja Set Nepal",
  /** Rendered in the wordmark and metadata title suffix. */
  title: "Puja Set Nepal — Nepali AI, open source and hosted",
  tagline: "Nepali-first AI, open source and hosted.",
  description:
    "An early-stage AI developer platform from Nepal. We publish an open-source Nepali chat stack and run the hosted cloud that serves it — self-host the client, point it at any OpenAI-compatible endpoint, or just use ours.",

  domain: "pujasetnepal.com",
  url: "https://pujasetnepal.com",

  /** The product generation shown next to the wordmark and in the chat header. */
  version: "1.1",

  model: {
    /** The id sent in the request body; also the id the adapter is published under. */
    id: "jaynepal-1.1",
    /** How the model presents itself in conversation. */
    label: "Puja Set Nepal 1.1",
    base: "Qwen/Qwen3.5-9B",
    params: "9B",
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
  { href: "/chat", label: "Open the chat" },
] as const;
