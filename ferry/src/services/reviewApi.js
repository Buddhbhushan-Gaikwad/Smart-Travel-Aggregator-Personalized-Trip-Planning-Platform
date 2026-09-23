import { http } from "./apiClient";

export async function getReviewsByTrip(tripId) {
  return http.get(`/trips/${tripId}/reviews`);
}

export async function getReviewSummary(tripId) {
  return http.get(`/trips/${tripId}/reviews/summary`);
}

export async function submitReview(data) {
  return http.post("/reviews", data);
}

export async function likeReview(reviewId) {
  return http.post(`/reviews/${reviewId}/like`);
}
