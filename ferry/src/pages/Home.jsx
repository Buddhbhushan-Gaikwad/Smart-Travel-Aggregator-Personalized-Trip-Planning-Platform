import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import TripCard from "../components/trip/TripCard";
import CategoryChip from "../components/trip/CategoryChip";
import { RowSkeleton } from "../components/common/Skeleton";
import EmptyState from "../components/common/EmptyState";
import { getTrendingTrips, getUpcomingTrips, getRecommendedTrips, getAllCategories } from "../services/tripApi";

const CHIPS = ["Weekend", "Budget", "Mountains", "Beach", "Historical", "Adventure"];

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [trending, setTrending] = useState(null);
  const [upcoming, setUpcoming] = useState(null);
  const [recommended, setRecommended] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getTrendingTrips().then(setTrending);
    getUpcomingTrips().then(setUpcoming);
    getRecommendedTrips("USR-001").then(setRecommended);
    getAllCategories().then(setCategories);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  }

  return (
    <div className="max-w-[1180px] mx-auto px-4 md:px-8 pt-4 md:pt-2 pb-10">
      {/* Hero */}
      <div className="relative rounded-[26px] overflow-hidden min-h-[440px] md:min-h-[520px] flex flex-col justify-end bg-[#0F6E56] bg-cover bg-center"
        style={{ backgroundImage: "url('https://commons.wikimedia.org/wiki/Special:FilePath/Rishikesh_India_(183707211).jpeg?width=1600')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="relative flex justify-between items-start p-4">
          <span className="text-xs font-semibold bg-white/15 backdrop-blur text-white px-3 py-1.5 rounded-full">
            🔥 Trending in Uttarakhand this week
          </span>
        </div>
        <div className="relative p-5 md:p-10 text-white max-w-xl">
          <h1 className="text-3xl md:text-5xl mb-3 font-display">
            Your next <em className="italic text-[#FFC9B6]">journey</em> starts here
          </h1>
          <p className="text-white/85 mb-6 max-w-md">
            Discover curated trips or let AI build a plan around you.
          </p>
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white rounded-full p-1.5 pl-5 max-w-md shadow-lg">
            <SearchIcon size={16} className="text-ink-soft shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Where do you want to go?"
              className="flex-1 outline-none text-sm text-ink py-2 bg-transparent"
            />
            <button type="submit" className="bg-coral text-white text-sm font-semibold px-5 py-2.5 rounded-full shrink-0">
              Search
            </button>
          </form>
          <div className="flex flex-wrap gap-2 mt-4">
            {CHIPS.map((c) => (
              <Link
                key={c}
                to={`/search?category=${encodeURIComponent(c)}`}
                className="text-xs bg-white/15 backdrop-blur text-white px-3 py-1.5 rounded-full hover:bg-white/25"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-line px-5 py-4 mt-4">
        <div className="flex items-center gap-3">
          <div className="flex">
            {["AK", "RM", "SP"].map((initials, i) => (
              <span
                key={initials}
                style={{ marginLeft: i === 0 ? 0 : -10, background: ["#7F77DD", "#D85A30", "#0F6E56"][i] }}
                className="w-7 h-7 rounded-full border-2 border-white text-white text-[10px] font-semibold flex items-center justify-center"
              >
                {initials}
              </span>
            ))}
            <span style={{ marginLeft: -10, background: "#D4537E" }} className="w-7 h-7 rounded-full border-2 border-white text-white text-[10px] font-semibold flex items-center justify-center">+</span>
          </div>
          <p className="text-sm">
            <strong>12,400+ trips</strong> <span className="text-ink-soft">booked by travelers like you this month</span>
          </p>
        </div>
        <p className="text-sm text-ink-soft">★ <strong className="text-ink">4.7</strong> average rating · 8,200 reviews</p>
      </div>

      {/* Trending */}
      <section className="mt-10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl">Trending now</h2>
            <p className="text-sm text-ink-soft mt-1">Popular with travelers this week</p>
          </div>
          <Link to="/search" className="text-sm font-semibold text-coral-dark whitespace-nowrap">See all trips →</Link>
        </div>
        {!trending ? <RowSkeleton /> : trending.length === 0 ? (
          <EmptyState title="No trips match your current filters." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trending.map((t) => <TripCard key={t.id} trip={t} />)}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="mt-10">
        <h2 className="text-2xl mb-1">Browse by mood</h2>
        <p className="text-sm text-ink-soft mb-4">Pick a vibe, we'll do the rest</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <CategoryChip key={c} label={c} onClick={() => navigate(`/search?category=${encodeURIComponent(c)}`)} />
          ))}
        </div>
      </section>

      {/* Upcoming */}
      <section className="mt-10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl">Just launched</h2>
            <p className="text-sm text-ink-soft mt-1">New trips added recently</p>
          </div>
        </div>
        {!upcoming ? <RowSkeleton /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((t) => <TripCard key={t.id} trip={t} />)}
          </div>
        )}
      </section>

      {/* Recommended */}
      <section className="mt-10">
        <h2 className="text-2xl mb-1">Recommended for you</h2>
        <p className="text-sm text-ink-soft mb-4">Based on your interests and past searches</p>
        {!recommended ? <RowSkeleton /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map((t) => <TripCard key={t.id} trip={t} />)}
          </div>
        )}
      </section>

      {/* CTA band */}
      <div className="mt-14 bg-ink rounded-3xl p-8 md:p-12 flex flex-wrap justify-between items-center gap-5">
        <h2 className="text-white text-2xl md:text-3xl max-w-md">Can't find your trip? Let AI build one around you.</h2>
        <div className="flex gap-3">
          <Link to="/planner" className="bg-coral text-white text-sm font-semibold px-6 py-3 rounded-full">Plan with AI</Link>
          <Link to="/search" className="border border-white/30 text-white text-sm font-semibold px-6 py-3 rounded-full">Explore all trips</Link>
        </div>
      </div>
    </div>
  );
}
