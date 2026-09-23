import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Check, X as XIcon, CloudSun, Bus, Hotel, Users, MapPin } from "lucide-react";
import Stamp from "../components/common/Stamp";
import StarRating from "../components/common/StarRating";
import { SkeletonBlock } from "../components/common/Skeleton";
import { getTripById } from "../services/tripApi";
import { getReviewsByTrip, likeReview } from "../services/reviewApi";
import { getWeatherByDestination } from "../services/weatherApi";
import { useBooking } from "../context/BookingContext";

export default function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { startBooking } = useBooking();
  const [trip, setTrip] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [weather, setWeather] = useState(undefined);

  useEffect(() => {
    setTrip(null);
    setWeather(undefined);
    getTripById(tripId).then((t) => {
      setTrip(t);
      if (t) getWeatherByDestination(t.destination).then(setWeather);
    });
    getReviewsByTrip(tripId).then(setReviews);
  }, [tripId]);

  function handleLike(id) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, likedByCurrentUser: !r.likedByCurrentUser, likes: r.likes + (r.likedByCurrentUser ? -1 : 1) } : r)));
    likeReview(id);
  }

  function handleBook() {
    startBooking(trip);
    navigate(`/trips/${trip.id}/seats`);
  }

  if (!trip) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-6">
        <SkeletonBlock className="h-[420px] w-full rounded-[26px]" />
        <div className="grid grid-cols-4 gap-3 mt-6">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-4 pb-16">
      {/* Hero */}
      <div className="relative rounded-[26px] overflow-hidden min-h-[380px] md:min-h-[440px] flex flex-col justify-end bg-cover bg-center"
        style={{ backgroundImage: `url(${trip.banner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/15 to-transparent" />
        <Stamp num={trip.rating.toFixed(1) + "★"} label={`${trip.reviewCount} reviews`} className="top-5 right-5" size={92} />
        <div className="relative p-5 md:p-8 text-white">
          <p className="text-sm text-white/80 font-medium mb-1.5 flex items-center gap-1">
            <MapPin size={13} /> {trip.origin} → {trip.destination}
          </p>
          <h1 className="text-3xl md:text-4xl mb-2">{trip.title}</h1>
          <p className="text-sm text-white/85 mb-5">
            {new Date(trip.departureDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            {" – "}
            {new Date(trip.returnDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            {" · "}<strong className="text-white">{trip.duration}</strong>{" · "}{trip.transport}{" · "}{trip.availableSeats} seats left
          </p>
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <p className="text-xs text-white/70">Starting from</p>
              <p className="font-display text-2xl md:text-3xl font-semibold">₹{trip.startingPrice.toLocaleString("en-IN")}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="flex items-center gap-1.5 bg-white/15 border border-white/40 text-white text-sm font-semibold px-5 py-3 rounded-full">
                <Heart size={15} /> Save
              </button>
              <button type="button" onClick={handleBook} className="bg-coral text-white text-sm font-semibold px-6 py-3 rounded-full">
                Book this trip
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overview grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { icon: Bus, label: "Transport", value: trip.transport },
          { icon: Hotel, label: "Accommodation", value: trip.accommodation },
          { icon: Users, label: "Group size", value: `${trip.groupSize} travelers` },
          { icon: MapPin, label: "Pickup", value: trip.pickupPoint },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-sand-2 border border-line rounded-2xl p-4">
            <Icon size={16} className="text-ink-soft mb-2" />
            <p className="text-xs text-ink-muted">{label}</p>
            <p className="text-sm font-semibold mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* Gallery */}
      {trip.gallery?.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl mb-1">Gallery & moments</h2>
          <p className="text-sm text-ink-soft mb-4">Real views and photos from past trips</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {trip.gallery.map((src, i) => (
              <img key={i} src={src} alt={`${trip.title} photo ${i + 1}`} className={`rounded-2xl object-cover w-full h-40 ${i === 0 ? "col-span-2 row-span-2 h-full" : ""}`} loading="lazy" />
            ))}
          </div>
        </section>
      )}

      {/* Included / Excluded */}
      <section className="grid md:grid-cols-2 gap-8 mt-10">
        <div>
          <h3 className="text-base font-semibold mb-3">Included</h3>
          {trip.included.map((item) => (
            <p key={item} className="text-sm text-ink-soft flex items-start gap-2 mb-2">
              <Check size={15} className="text-teal shrink-0 mt-0.5" /> {item}
            </p>
          ))}
        </div>
        <div>
          <h3 className="text-base font-semibold mb-3">Not included</h3>
          {trip.excluded.map((item) => (
            <p key={item} className="text-sm text-ink-soft flex items-start gap-2 mb-2">
              <XIcon size={15} className="text-coral-dark shrink-0 mt-0.5" /> {item}
            </p>
          ))}
        </div>
      </section>

      {/* Itinerary */}
      <section className="mt-10">
        <h2 className="text-xl mb-1">Day by day</h2>
        <p className="text-sm text-ink-soft mb-4">What this trip actually looks like</p>
        <div className="space-y-6">
          {trip.itinerary.map((day) => (
            <div key={day.day}>
              <p className="text-sm font-semibold mb-2">Day {day.day}</p>
              <div className="border-l-2 border-line pl-4 space-y-3">
                {day.items.map((item, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-coral" />
                    <p className="text-xs text-ink-muted font-semibold">{item.time}</p>
                    <p className="text-sm">{item.activity}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weather */}
      {weather && (
        <section className="mt-10 bg-teal-light rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <CloudSun size={32} className="text-teal shrink-0" />
            <div>
              <p className="text-xs text-teal-dark font-semibold uppercase tracking-wide mb-0.5">Travel day weather</p>
              <p className="font-display text-3xl font-semibold text-teal">{weather.temperature}°C</p>
              <p className="text-sm text-ink-soft">{weather.condition} · rain probability {weather.rainProbability}%</p>
            </div>
          </div>
          <p className="text-xs text-ink-muted max-w-[180px]">Forecast may change closer to your travel date. Source: {weather.source}.</p>
        </section>
      )}

      {/* Cost breakdown */}
      <section className="mt-10">
        <h2 className="text-xl mb-4">Cost breakdown</h2>
        <div className="bg-sand-2 border border-line rounded-2xl p-5">
          {trip.costBreakdown.map((row) => (
            <div key={row.label} className="flex justify-between text-sm text-ink-soft py-1.5">
              <span>{row.label}</span>
              <span>₹{row.amount.toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div className="flex justify-between text-base font-semibold border-t border-line mt-2 pt-3">
            <span>Estimated total</span>
            <span>₹{trip.costBreakdown.reduce((s, r) => s + r.amount, 0).toLocaleString("en-IN")}</span>
          </div>
        </div>
        <p className="text-xs text-ink-muted mt-2">
          Prices are indicative and may vary based on availability, date and season. Transport source: {trip.sources?.transport} · Accommodation source: {trip.sources?.accommodation}
        </p>
      </section>

      {/* Reviews */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl">What travelers say</h2>
            <StarRating rating={trip.rating} reviewCount={trip.reviewCount} />
          </div>
        </div>
        {reviews.length === 0 ? (
          <EmptyState title="No reviews yet" subtitle="Be the first to share how this trip went." />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white border border-line rounded-2xl p-4 flex gap-3">
                <img src={r.avatar} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{r.userName}</p>
                  <StarRating rating={r.rating} showValue={false} />
                  <p className="text-sm text-ink-soft mt-1.5 leading-relaxed">{r.comment}</p>
                  <button
                    type="button"
                    onClick={() => handleLike(r.id)}
                    className={`text-xs mt-2 flex items-center gap-1 ${r.likedByCurrentUser ? "text-coral" : "text-ink-muted"}`}
                  >
                    <Heart size={13} fill={r.likedByCurrentUser ? "currentColor" : "none"} /> {r.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-10 flex justify-center">
        <button type="button" onClick={handleBook} className="bg-coral text-white text-sm font-semibold px-8 py-3.5 rounded-full">
          Book this trip
        </button>
      </div>
    </div>
  );
}

function EmptyState({ title, subtitle }) {
  return (
    <div className="text-center py-10">
      <p className="text-sm font-medium">{title}</p>
      {subtitle && <p className="text-xs text-ink-soft mt-1">{subtitle}</p>}
    </div>
  );
}
