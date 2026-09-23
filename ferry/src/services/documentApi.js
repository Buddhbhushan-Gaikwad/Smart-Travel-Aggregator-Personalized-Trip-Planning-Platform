import { http } from "./apiClient";

export async function generateTravelKit(planId) {
  return http.post(`/documents/travel-kit/${planId}`);
}

export async function getTicket(bookingId) {
  return http.get(`/documents/ticket/${bookingId}`);
}
