import { http } from "./apiClient";

export function getGreeting() {
  return { text: "Tell us where you would like to go.", quickActions: [] };
}

export function getPlannerQuestions() {
  return [];
}

export async function sendChatMessage({ message, collectedPreferences = {} }) {
  return http.post("/chat/message", { message, collectedPreferences });
}
