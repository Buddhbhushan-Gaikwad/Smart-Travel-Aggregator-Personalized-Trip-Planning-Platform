import { http } from "./apiClient";

export async function createBooking(data) {
  return http.post("/bookings", data);
}

export async function getBookingHistory(userId) {
  return http.get(`/bookings?userId=${userId}`);
}
