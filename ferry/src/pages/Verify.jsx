import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { verifyOtp } from "../services/authApi";

export default function Verify() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await verifyOtp({ otp });
      setStatus("success");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      setStatus("idle");
      setError(err.message);
    }
  }

  return (
    <div className="max-w-[400px] mx-auto px-4 py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-teal-light flex items-center justify-center mx-auto mb-5">
        <ShieldCheck size={24} className="text-teal" />
      </div>
      <h1 className="text-2xl mb-2">Verify your account</h1>
      <p className="text-sm text-ink-soft mb-8">Enter the 4-digit code we sent to your mobile number.</p>

      {status === "success" ? (
        <p className="text-teal text-sm font-medium">Verified! Redirecting you home...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="1234"
            className="w-full h-14 text-center text-2xl tracking-[0.5em] rounded-xl border border-line outline-none focus-visible:ring-2 focus-visible:ring-coral"
          />
          {error && <p className="text-xs text-coral-dark">{error}</p>}
          <button type="submit" disabled={status === "loading"} className="w-full bg-coral text-white text-sm font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 disabled:opacity-70">
            {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : "Verify"}
          </button>
          <p className="text-xs text-ink-muted">Enter the verification code sent to your mobile.</p>
        </form>
      )}
    </div>
  );
}
