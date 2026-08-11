import { api } from "./client";
import type { Conversation, Message } from "../types";

export function listConversations() {
  return api.get<{ items: Conversation[] }>("/messaging/conversations");
}

export function getConversationMessages(id: string) {
  return api.get<{ conversation: Conversation; messages: Message[] }>(`/messaging/conversations/${id}/messages`);
}

export function sendMessage(conversationId: string, body: string) {
  return api.post<{ message: Message }>(`/messaging/conversations/${conversationId}/messages`, { body });
}
