import { http } from "./apiClient";

export async function createPayment({ amount, method = "UPI" }) {
  return http.post("/payments", { amount, method });
}
