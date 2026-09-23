import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Share2, Eye, PackageOpen } from "lucide-react";
import { getBookingHistory } from "../services/bookingApi";
import { getTravelPlanById } from "../services/plannerApi";
import EmptyState from "../components/common/EmptyState";
import { RowSkeleton } from "../components/common/Skeleton";

const TABS = ["My bookings", "My plans", "Documents"];

export default function History() {
  const [tab, setTab] = useState(TABS[0]);
  const [bookings, setBookings] = useState(null);
  const [plans, setPlans] = useState(null);

  useEffect(() => {
    getBookingHistory("USR-001").then(setBookings);
    getTravelPlanById("PLAN-001").then((p) => setPlans(p ? [p] : []));
  }, []);

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-8 py-6">
      <h1 className="text-2xl mb-5">History</h1>

      <div className="flex gap-1 bg-sand-2 p-1 rounded-full w-fit mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`text-sm font-medium px-4 py-2 rounded-full transition ${tab === t ? "bg-white shadow-sm" : "text-ink-soft"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "My bookings" && (
        !bookings ? <RowSkeleton count={2} /> :
        bookings.length === 0 ? (
          <EmptyState icon={PackageOpen} title="Your journeys will appear here once you book a trip." action={
            <Link to="/" className="bg-ink text-white text-sm font-semibold px-5 py-2.5 rounded-full">Explore trips</Link>
          } />
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white border border-line rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-3 items-center">
                  <img src={b.banner} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <p className="text-sm font-semibold">{b.tripTitle}</p>
                    <p className="text-xs text-ink-soft">{b.date} · Seat {b.seat} · {b.id}</p>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-teal bg-teal-light px-2 py-0.5 rounded-full">{b.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold">₹{b.amount.toLocaleString("en-IN")}</p>
                  <Link to={`/trips/${b.tripId}`} className="text-xs font-semibold border border-line rounded-full px-3 py-2 flex items-center gap-1">
                    <Eye size={13} /> View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "My plans" && (
        !plans ? <RowSkeleton count={1} /> :
        plans.length === 0 ? (
          <EmptyState icon={PackageOpen} title="No AI-generated plans yet." action={
            <Link to="/planner" className="bg-ink text-white text-sm font-semibold px-5 py-2.5 rounded-full">Plan with AI</Link>
          } />
        ) : (
          <div className="space-y-3">
            {plans.map((p) => (
              <div key={p.id} className="bg-white border border-line rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{p.title}</p>
                  <p className="text-xs text-ink-soft">{p.destinations.join(", ")} · Est. ₹{p.estimatedTotal.toLocaleString("en-IN")}</p>
                </div>
                <Link to={`/planner/result/${p.id}`} className="text-xs font-semibold border border-line rounded-full px-3 py-2 flex items-center gap-1">
                  <Eye size={13} /> View plan
                </Link>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "Documents" && (
        !bookings ? <RowSkeleton count={1} /> :
        bookings.length === 0 ? (
          <EmptyState icon={PackageOpen} title="No documents yet." subtitle="Tickets and travel kits will appear here after booking." />
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white border border-line rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{b.tripTitle} — Ticket</p>
                  <p className="text-xs text-ink-soft">{b.id}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="text-xs font-semibold border border-line rounded-full px-3 py-2 flex items-center gap-1">
                    <Download size={13} /> Download
                  </button>
                  <button type="button" className="text-xs font-semibold border border-line rounded-full px-3 py-2 flex items-center gap-1">
                    <Share2 size={13} /> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
