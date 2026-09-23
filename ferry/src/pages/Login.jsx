import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="max-w-[420px] mx-auto px-4 py-14">
      <h1 className="text-3xl mb-1">Welcome back</h1>
      <p className="text-sm text-ink-soft mb-8">Sign in to manage your trips.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={form.identifier}
          onChange={(e) => setForm({ ...form, identifier: e.target.value })}
          type="text"
          placeholder="Email or mobile number"
          className="w-full h-12 px-4 rounded-xl border border-line text-sm outline-none focus-visible:ring-2 focus-visible:ring-coral"
        />
        <input
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          type="password"
          placeholder="Password"
          className="w-full h-12 px-4 rounded-xl border border-line text-sm outline-none focus-visible:ring-2 focus-visible:ring-coral"
        />
        {error && <p className="text-xs text-coral-dark">{error}</p>}
        <div className="flex justify-end">
          <button type="button" className="text-xs text-ink-soft hover:text-ink">Forgot password?</button>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-coral text-white text-sm font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 disabled:opacity-70">
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Sign in"}
        </button>
        <button type="button" className="w-full border border-line text-sm font-semibold py-3.5 rounded-full">
          Continue with Google
        </button>
      </form>

      <p className="text-sm text-ink-soft text-center mt-6">
        New to Ferry? <Link to="/register" className="text-coral-dark font-semibold">Create an account</Link>
      </p>
      <p className="text-xs text-ink-muted text-center mt-3">Use your Ferry account credentials to sign in.</p>
    </div>
  );
}
