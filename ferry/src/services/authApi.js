import { http } from "./apiClient";

export async function login({ identifier, password }) {
  return http.post("/auth/login", { identifier, password });
}

export async function register(data) {
  return http.post("/auth/register", data);
}

export async function verifyOtp({ otp }) {
  return http.post("/auth/verify", { otp });
}

export async function getProfile() {
  return http.get("/auth/profile");
}

export async function updateProfile(data) {
  return http.put("/auth/profile", data);
}
