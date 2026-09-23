import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CreditCard, Smartphone, Landmark } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { createPayment } from "../services/paymentApi";
import { createBooking } from "../services/bookingApi";

const METHODS = [
  { id: "UPI", label: "UPI", icon: Smartphone },
  { id: "CARD", label: "Card", icon: CreditCard },
  { id: "NETBANKING", label: "Net banking", icon: Landmark },
];

export default function Payment() {
  const { draft, setPayment } = useBooking();
  const navigate = useNavigate();
  const [method, setMethod] = useState("UPI");
  const [status, setStatus] = useState("idle"); // idle | processing | failed

  if (!draft?.trip || !draft?.seat || !draft?.passenger) {
    return (
      <div className="max-w-[500px] mx-auto px-4 py-10 text-center">
        <p className="text-sm text-ink-soft">Missing booking details.</p>
        <button type="button" onClick={() => navigate("/")} className="mt-4 bg-ink text-white text-sm font-semibold px-6 py-2.5 rounded-full">
          Start over
        </button>
      </div>
    );
  }

  const { trip, seat, passenger } = draft;
  const total = trip.startingPrice + 200;

  async function handlePay() {
    setStatus("processing");
    try {
      const payment = await createPayment({ amount: total, method });
      if (payment.status !== "SUCCESS") {
        setStatus("failed");
        return;
      }
      setPayment(payment);
      const booking = await createBooking({
        tripId: trip.id,
        tripTitle: trip.title,
        banner: trip.banner,
        seat,
        passenger,
        amount: total,
        paymentId: payment.id,
        date: trip.departureDate,
      });
      navigate("/booking/success", { state: { booking, trip, seat } });
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="max-w-[500px] mx-auto px-4 md:px-8 py-6">
      <h1 className="text-2xl mb-6">Payment</h1>

      <div className="bg-white border border-line rounded-2xl p-5 mb-5">
        <div className="flex justify-between text-sm text-ink-soft mb-1"><span>{trip.title}</span><span>Seat {seat}</span></div>
        <div className="flex justify-between text-2xl font-display font-semibold mt-2"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
      </div>

      <div className="bg-white border border-line rounded-2xl p-5 mb-5">
        <p className="text-sm font-semibold mb-3">Choose payment method</p>
        <div className="grid grid-cols-3 gap-2">
          {METHODS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMethod(id)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium ${
                method === id ? "border-coral bg-coral-light text-coral-dark" : "border-line text-ink-soft"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {status === "failed" && (
        <div className="bg-coral-light text-coral-dark text-sm rounded-xl p-3 mb-4">
          Payment failed. Please try again — no amount was deducted.
        </div>
      )}

      <button
        type="button"
        onClick={handlePay}
        disabled={status === "processing"}
        className="w-full bg-coral text-white text-sm font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {status === "processing" ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Processing payment...
          </>
        ) : (
          `Pay ₹${total.toLocaleString("en-IN")}`
        )}
      </button>
      <p className="text-xs text-ink-muted text-center mt-3">This is a simulated payment for demo purposes. No real charge will occur.</p>
    </div>
  );
}
