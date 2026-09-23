import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";

export default function Checkout() {
  const { draft, setPassenger } = useBooking();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});

  if (!draft?.trip || !draft?.seat) {
    return (
      <div className="max-w-[700px] mx-auto px-4 py-10 text-center">
        <p className="text-sm text-ink-soft">Please select a trip and seat first.</p>
        <button type="button" onClick={() => navigate("/")} className="mt-4 bg-ink text-white text-sm font-semibold px-6 py-2.5 rounded-full">
          Explore trips
        </button>
      </div>
    );
  }

  const { trip, seat } = draft;
  const taxes = 200;
  const total = trip.startingPrice + taxes;

  function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!/^\d{10}$/.test(form.phone)) next.phone = "Enter a 10-digit phone number";
    setErrors(next);
    if (Object.keys(next).length) return;
    setPassenger(form);
    navigate("/payment");
  }

  return (
    <div className="max-w-[700px] mx-auto px-4 md:px-8 py-6">
      <h1 className="text-2xl mb-6">Checkout</h1>

      <div className="bg-white border border-line rounded-2xl p-5 mb-5">
        <div className="flex gap-3 items-center">
          <img src={trip.banner} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
          <div>
            <p className="text-sm font-semibold">{trip.title}</p>
            <p className="text-xs text-ink-soft">{trip.departureDate} · Seat {seat} · Pickup: {trip.pickupPoint}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-line rounded-2xl p-5 mb-5 space-y-4">
        <p className="text-sm font-semibold">Passenger details</p>
        <div>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            type="text"
            placeholder="Full name"
            className="w-full h-11 px-4 rounded-xl border border-line text-sm outline-none focus-visible:ring-2 focus-visible:ring-coral"
          />
          {errors.name && <p className="text-xs text-coral-dark mt-1">{errors.name}</p>}
        </div>
        <div>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
            placeholder="Email address"
            className="w-full h-11 px-4 rounded-xl border border-line text-sm outline-none focus-visible:ring-2 focus-visible:ring-coral"
          />
          {errors.email && <p className="text-xs text-coral-dark mt-1">{errors.email}</p>}
        </div>
        <div>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            type="tel"
            placeholder="Phone number"
            className="w-full h-11 px-4 rounded-xl border border-line text-sm outline-none focus-visible:ring-2 focus-visible:ring-coral"
          />
          {errors.phone && <p className="text-xs text-coral-dark mt-1">{errors.phone}</p>}
        </div>

        <div className="border-t border-line pt-4 space-y-1.5 text-sm text-ink-soft">
          <div className="flex justify-between"><span>Trip price</span><span>₹{trip.startingPrice.toLocaleString("en-IN")}</span></div>
          <div className="flex justify-between"><span>Taxes</span><span>₹{taxes}</span></div>
          <div className="flex justify-between text-base font-semibold text-ink pt-1"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
        </div>

        <p className="text-xs text-ink-muted">
          By continuing you agree to our cancellation policy: full refund up to 48 hours before departure.
        </p>

        <button type="submit" className="w-full bg-coral text-white text-sm font-semibold py-3.5 rounded-full">
          Continue to payment
        </button>
      </form>
    </div>
  );
}
