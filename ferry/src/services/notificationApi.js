import { http } from "./apiClient";

export async function getNotifications() {
  return http.get("/notifications");
}

export async function markNotificationRead(id) {
  return http.put(`/notifications/${id}/read`);
}

export async function markAllRead() {
  return http.put("/notifications/read-all");
}
