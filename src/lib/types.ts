/**
 * Shared types for the Puja Set Nepal chat client.
 *
 * Message.status is a first-class field rather than an implicit flag, because a
 * stopped or failed turn has to stay visibly distinct from a finished one — an
 * assistant bubble that simply stops mid-sentence with no marker is the exact
 * failure mode that makes a chat UI feel unreliable.
 */

export type Role = "user" | "assistant" | "system";

export type MsgStatus = "streaming" | "complete" | "stopped" | "error";

export interface Message {
  id: string;
  role: Role;
  content: string;
  status: MsgStatus;
  createdAt: number;
  /** Present only when status === "error". */
  error?: string;
  /** Which path the model took, when the backend reports one. */
  route?: string;
}

export interface Thread {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface EndpointStatus {
  /** Is a model URL set on the server? (PUJASET_API_URL or JAYNEPAL_API_URL) */
  configured: boolean;
  /** Could the server actually reach it just now? */
  reachable: boolean;
  model?: string;
  detail?: string;
}

/** What POST /api/chat accepts. */
export interface ChatRequest {
  messages: { role: Role; content: string }[];
  stream?: boolean;
}
