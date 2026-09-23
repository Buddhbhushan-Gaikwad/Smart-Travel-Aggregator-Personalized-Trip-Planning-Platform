import { http } from "./apiClient";

export async function getSeats(tripId) {
  return http.get(`/trips/${tripId}/seats`);
}

export async function holdSeat(tripId, seatNumber) {
  return http.post(`/trips/${tripId}/seats/${seatNumber}/hold`);
}
