import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSeats } from "../services/seatApi";
import { useBooking } from "../context/BookingContext";
import { SkeletonBlock } from "../components/common/Skeleton";

const STATUS_STYLES = {
  AVAILABLE: "bg-teal-light border border-teal/40 text-teal hover:border-teal cursor-pointer",
  BOOKED: "bg-coral-light/70 border border-coral-dark/20 text-coral-dark/70 cursor-not-allowed",
  SELECTED: "bg-coral text-white border-none cursor-pointer",
};

export default function SeatSelection() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { draft, setSeat } = useBooking();
  const [layout, setLayout] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getSeats(tripId).then(setLayout);
  }, [tripId]);

  const trip = draft?.trip;
  const taxes = 200;
  const total = trip ? trip.startingPrice + taxes : 0;

  const rows = useMemo(() => {
    if (!layout) return [];
    const grouped = {};
    layout.seats.forEach((s) => {
      const rowNum = s.seatNumber.slice(1);
      grouped[rowNum] = grouped[rowNum] || [];
      grouped[rowNum].push(s);
    });
    return Object.entries(grouped).sort((a, b) => Number(a[0]) - Number(b[0]));
  }, [layout]);

  function pick(seat) {
    if (seat.status === "BOOKED") return;
    setSelected(seat.seatNumber);
    setSeat(seat.seatNumber);
  }

  function handleContinue() {
    navigate("/checkout");
  }

  if (!draft?.trip) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-10 text-center">
        <p className="text-sm text-ink-soft">Start by picking a trip first.</p>
        <button type="button" onClick={() => navigate("/")} className="mt-4 bg-ink text-white text-sm font-semibold px-6 py-2.5 rounded-full">
          Explore trips
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-8 py-6">
      <div className="bg-white border border-line rounded-2xl p-4 flex flex-wrap justify-between gap-3 mb-6">
        <div>
          <p className="text-sm font-semibold">{trip.title}</p>
          <p className="text-xs text-ink-soft">{trip.departureDate} · {trip.transport} · Pickup: {trip.pickupPoint}</p>
        </div>
        <div className="flex gap-4 text-xs text-ink-soft items-center">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal" /> Available</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-coral-dark/50" /> Booked</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-coral" /> Selected</span>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_260px] gap-5">
        <div className="bg-white border border-line rounded-2xl p-5 md:p-6">
          <p className="text-xs text-ink-muted text-right mb-4 flex items-center justify-end gap-1.5">
            Driver
          </p>
          {!layout ? (
            <SkeletonBlock className="h-64 w-full" />
          ) : (
            <div className="flex flex-col gap-2.5 max-w-[220px] ml-auto">
              {rows.map(([rowNum, seats]) => (
                <div key={rowNum} className="grid grid-cols-2 gap-2.5">
                  {seats.map((seat) => {
                    const isSelected = selected === seat.seatNumber;
                    const style = isSelected ? STATUS_STYLES.SELECTED : STATUS_STYLES[seat.status];
                    return (
                      <button
                        key={seat.seatNumber}
                        type="button"
                        disabled={seat.status === "BOOKED"}
                        onClick={() => pick(seat)}
                        aria-label={`Seat ${seat.seatNumber}, ${isSelected ? "selected" : seat.status.toLowerCase()}`}
                        className={`h-10 rounded-lg text-xs font-semibold transition ${style}`}
                      >
                        {seat.seatNumber}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-line rounded-2xl p-5 h-fit">
          <p className="text-sm font-semibold mb-3">Booking summary</p>
          <div className="text-sm text-ink-soft space-y-1.5 mb-3">
            <div className="flex justify-between"><span>Selected seat</span><span className="text-ink font-medium">{selected || "—"}</span></div>
            <div className="flex justify-between"><span>Trip price</span><span>₹{trip.startingPrice.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between"><span>Taxes</span><span>₹{taxes}</span></div>
          </div>
          <div className="flex justify-between text-base font-semibold border-t border-line pt-3 mb-4">
            <span>Total</span><span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <button
            type="button"
            disabled={!selected}
            onClick={handleContinue}
            className="w-full bg-coral text-white text-sm font-semibold py-3 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue to checkout
          </button>
        </div>
      </div>
    </div>
  );
}
