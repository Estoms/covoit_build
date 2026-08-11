import { api } from "./client";
import type { SupportTicket } from "../types";

export function createTicket(subject: string, body: string) {
  return api.post("/support/tickets", { subject, body });
}
export function myTickets() {
  return api.get<{ items: SupportTicket[] }>("/support/tickets/mine");
}
export function allTickets(status?: string) {
  return api.get<{ items: SupportTicket[] }>(`/support/tickets${status ? `?status=${status}` : ""}`);
}
export function getTicket(id: string) {
  return api.get<{ ticket: SupportTicket }>(`/support/tickets/${id}`);
}
export function replyTicket(id: string, body: string) {
  return api.post(`/support/tickets/${id}/messages`, { body });
}
export function updateTicketStatus(id: string, status: string) {
  return api.patch(`/support/tickets/${id}/status`, { status });
}
