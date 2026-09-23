import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await register(form);
      navigate("/verify");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="max-w-[420px] mx-auto px-4 py-14">
      <h1 className="text-3xl mb-1">Create your account</h1>
      <p className="text-sm text-ink-soft mb-8">Join Ferry and start planning your next trip.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} type="text" placeholder="Full name" className="w-full h-12 px-4 rounded-xl border border-line text-sm outline-none focus-visible:ring-2 focus-visible:ring-coral" required />
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Email address" className="w-full h-12 px-4 rounded-xl border border-line text-sm outline-none focus-visible:ring-2 focus-visible:ring-coral" required />
        <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} type="tel" placeholder="Mobile number" className="w-full h-12 px-4 rounded-xl border border-line text-sm outline-none focus-visible:ring-2 focus-visible:ring-coral" required />
        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" placeholder="Password" className="w-full h-12 px-4 rounded-xl border border-line text-sm outline-none focus-visible:ring-2 focus-visible:ring-coral" required />
        <input value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} type="password" placeholder="Confirm password" className="w-full h-12 px-4 rounded-xl border border-line text-sm outline-none focus-visible:ring-2 focus-visible:ring-coral" required />
        {error && <p className="text-xs text-coral-dark">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-coral text-white text-sm font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 disabled:opacity-70">
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Create account"}
        </button>
      </form>

      <p className="text-sm text-ink-soft text-center mt-6">
        Already have an account? <Link to="/login" className="text-coral-dark font-semibold">Sign in</Link>
      </p>
    </div>
  );
}
