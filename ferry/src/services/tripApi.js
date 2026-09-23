import { http } from "./apiClient";

export async function getTrendingTrips() {
  return http.get("/trips/trending");
}

export async function getUpcomingTrips() {
  return http.get("/trips/upcoming");
}

export async function getRecommendedTrips(userId) {
  return http.get(`/trips/recommended?userId=${userId}`);
}

export async function searchTrips(filters = {}) {
  return http.get(`/trips/search?${new URLSearchParams(filters)}`);
}

export async function getTripById(id) {
  return http.get(`/trips/${id}`);
}

export async function getAllCategories() {
  return http.get("/trips/categories");
}
