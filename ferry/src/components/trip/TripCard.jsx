import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import Stamp from "../common/Stamp";
import Badge from "../common/Badge";

export default function TripCard({ trip }) {
  const seatsLeft = trip.availableSeats;
  const urgency = seatsLeft <= 8;

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="group relative rounded-[20px] overflow-hidden min-h-[300px] flex flex-col justify-between bg-cover bg-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral"
      style={{ backgroundImage: `url(${trip.banner})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

      <div className="relative flex justify-between items-start p-3">
        <Badge tone={urgency ? "danger" : "neutral"} className="bg-white/90 border-none text-ink">
          {trip.recommendationReason ? trip.recommendationReason : `${seatsLeft} seats left`}
        </Badge>
        <button
          type="button"
          aria-label="Save trip"
          onClick={(e) => e.preventDefault()}
          className="text-white/80 hover:text-white transition"
        >
          <Heart size={18} />
        </button>
      </div>

      <Stamp
        top=""
        num={trip.rating.toFixed(1) + "★"}
        label="rated"
        className="top-3 right-3"
        size={64}
      />

      <div className="relative p-4 text-white">
        <h3 className="text-lg font-medium mb-1">{trip.title}</h3>
        <div className="flex justify-between items-center text-xs text-white/85">
          <span>{trip.duration} · {trip.destination}</span>
          <span className="font-display text-base font-semibold text-white">₹{trip.startingPrice.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </Link>
  );
}
