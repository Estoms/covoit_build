import { api } from "./client";
import type { Notification } from "../types";

export function listNotifications() {
  return api.get<{ items: Notification[] }>("/notifications");
}

export function markNotificationRead(id: string) {
  return api.post(`/notifications/${id}/read`);
}
