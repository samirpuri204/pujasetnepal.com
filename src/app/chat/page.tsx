import { ChatApp } from "@/components/chat";
import { site } from "@/lib/site";

export const metadata = {
  // The layout's title template appends the brand, so this stays a bare word.
  title: "Chat",
  description:
    "Talk to Puja Set Nepal 1.1, a Nepali language model made in Nepal. Ask in Nepali, Romanised Nepali, or English.",
  alternates: { canonical: `${site.url}/chat` },
};

/**
 * Server Component shell for the chat.
 *
 * It does nothing but render the client app. Keeping the page itself a Server
 * Component (rather than adding "use client" here) means the route ships the
 * static frame from the server and only the interactive tree is hydrated.
 *
 * The chat lives at `/chat` rather than `/` because the root is now the
 * marketing page: a visitor arriving from a search result or a link preview
 * should land on something that explains the product before being dropped into
 * a text box.
 */
export default function Page() {
  return <ChatApp />;
}
