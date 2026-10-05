import { ChatApp } from "@/components/chat";

/**
 * Server Component shell.
 *
 * It does nothing but render the client app. Keeping the page itself a Server
 * Component (rather than adding "use client" here) means the route ships the
 * static frame from the server and only the interactive tree is hydrated.
 */
export default function Page() {
  return <ChatApp />;
}
