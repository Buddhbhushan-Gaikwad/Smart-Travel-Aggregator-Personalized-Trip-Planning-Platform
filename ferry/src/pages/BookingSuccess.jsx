import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, Download, Ticket } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { useEffect } from "react";

export default function BookingSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { clearBooking } = useBooking();

  useEffect(() => {
    if (!state?.booking) navigate("/", { replace: true });
  }, [state, navigate]);

  if (!state?.booking) return null;
  const { booking, trip, seat } = state;

  function handleReturnHome() {
    clearBooking();
    navigate("/");
  }

  return (
    <div className="max-w-[560px] mx-auto px-4 md:px-8 py-10 text-center">
      <div className="w-16 h-16 rounded-full bg-teal-light flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 size={32} className="text-teal" />
      </div>
      <h1 className="text-3xl mb-2">Your journey is booked!</h1>
      <p className="text-sm text-ink-soft mb-8 max-w-sm mx-auto">
        Everything is ready. Your travel details are available in your account.
      </p>

      <div className="bg-white border border-line rounded-2xl p-5 text-left mb-8">
        <div className="flex gap-3 items-center mb-4 pb-4 border-b border-line">
          <img src={trip.banner} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
          <div>
            <p className="text-sm font-semibold">{trip.title}</p>
            <p className="text-xs text-ink-soft">{trip.departureDate}</p>
          </div>
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-ink-soft"><span>Booking ID</span><span className="text-ink font-medium">{booking.id}</span></div>
          <div className="flex justify-between text-ink-soft"><span>Seat</span><span className="text-ink font-medium">{seat}</span></div>
          <div className="flex justify-between text-ink-soft"><span>Payment status</span><span className="text-teal font-medium">Confirmed</span></div>
          <div className="flex justify-between text-ink-soft"><span>Amount paid</span><span className="text-ink font-medium">₹{booking.amount.toLocaleString("en-IN")}</span></div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button type="button" className="flex-1 flex items-center justify-center gap-2 border border-line text-sm font-semibold py-3 rounded-full">
          <Download size={15} /> Download ticket
        </button>
        <Link to="/history" className="flex-1 flex items-center justify-center gap-2 border border-line text-sm font-semibold py-3 rounded-full">
          <Ticket size={15} /> View my trip
        </Link>
        <button type="button" onClick={handleReturnHome} className="flex-1 bg-coral text-white text-sm font-semibold py-3 rounded-full">
          Return home
        </button>
      </div>
    </div>
  );
}
