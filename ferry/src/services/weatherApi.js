import { http } from "./apiClient";

export async function getWeatherByDestination(destination) {
  return http.get(`/weather?destination=${encodeURIComponent(destination)}`);
}
