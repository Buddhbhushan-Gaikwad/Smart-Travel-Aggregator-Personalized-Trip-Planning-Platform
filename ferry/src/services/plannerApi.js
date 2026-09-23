import { http } from "./apiClient";

export const PLANNING_STEPS = [
  "Understanding your preferences",
  "Checking available destinations",
  "Checking transport",
  "Checking accommodation",
  "Checking weather",
  "Calculating estimated cost",
  "Preparing your travel kit",
];

export async function generateTravelPlan(preferences) {
  return http.post("/planner/generate", preferences);
}

export async function getTravelPlanById(id) {
  return http.get(`/planner/${id}`);
}
