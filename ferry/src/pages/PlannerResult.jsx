import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, Share2, Pencil, BookmarkPlus, CloudSun, Hotel, Bus } from "lucide-react";
import { getTravelPlanById } from "../services/plannerApi";
import { generateTravelKit } from "../services/documentApi";
import { SkeletonBlock } from "../components/common/Skeleton";
import Badge from "../components/common/Badge";

export default function PlannerResult() {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    getTravelPlanById(planId).then(setPlan);
  }, [planId]);

  async function handleDownload() {
    setDownloading(true);
    await generateTravelKit(planId);
    setDownloading(false);
  }

  if (!plan) {
    return <div className="max-w-[800px] mx-auto px-4 py-10"><SkeletonBlock className="h-96 w-full" /></div>;
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-8 py-6 pb-16">
      <Badge tone="accent" className="mb-3">✨ AI-generated plan</Badge>
      <h1 className="text-3xl mb-2">{plan.title}</h1>
      <p className="text-sm text-ink-soft mb-6">{plan.summary}</p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-sand-2 border border-line rounded-2xl p-4">
          <p className="text-xs text-ink-muted">Dates</p>
          <p className="text-sm font-semibold mt-0.5">{plan.travelDates.start} → {plan.travelDates.end}</p>
        </div>
        <div className="bg-sand-2 border border-line rounded-2xl p-4">
          <p className="text-xs text-ink-muted">Travelers</p>
          <p className="text-sm font-semibold mt-0.5">{plan.travelers} people</p>
        </div>
        <div className="bg-sand-2 border border-line rounded-2xl p-4">
          <p className="text-xs text-ink-muted">Estimated total</p>
          <p className="text-sm font-semibold mt-0.5">₹{plan.estimatedTotal.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-xl mb-4">Day by day</h2>
        <div className="space-y-6">
          {plan.itinerary.map((day) => (
            <div key={day.day}>
              <p className="text-sm font-semibold mb-2">Day {day.day} · {day.location}</p>
              <div className="border-l-2 border-line pl-4 space-y-2.5">
                {day.items.map((item, i) => (
                  <div key={i}>
                    <p className="text-xs text-ink-muted font-semibold">{item.time}</p>
                    <p className="text-sm">{item.activity}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl mb-4 flex items-center gap-2"><Hotel size={18} /> Hotel options</h2>
        <div className="space-y-2">
          {plan.hotels.map((h) => (
            <div key={h.name} className="flex justify-between items-center bg-white border border-line rounded-xl p-3.5">
              <div>
                <p className="text-sm font-medium">{h.name}</p>
                <p className="text-xs text-ink-muted">{h.city} · {h.source}</p>
              </div>
              <p className="text-sm font-semibold">₹{h.pricePerNight.toLocaleString("en-IN")}/night</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl mb-4 flex items-center gap-2"><Bus size={18} /> Transport</h2>
        <div className="bg-white border border-line rounded-xl p-3.5">
          <p className="text-sm font-medium">{plan.transport.mode}</p>
          <p className="text-xs text-ink-muted mt-0.5">Source: {plan.transport.source}</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl mb-4 flex items-center gap-2"><CloudSun size={18} /> Weather</h2>
        <div className="grid grid-cols-3 gap-3">
          {plan.weather.map((w) => (
            <div key={w.city} className="bg-teal-light rounded-xl p-3.5 text-center">
              <p className="text-xs text-teal-dark font-semibold">{w.city}</p>
              <p className="font-display text-xl font-semibold text-teal">{w.temperature}°C</p>
              <p className="text-[11px] text-ink-soft">{w.condition}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl mb-4">Budget breakdown</h2>
        <div className="bg-sand-2 border border-line rounded-2xl p-5">
          {plan.budgetBreakdown.map((row) => (
            <div key={row.label} className="flex justify-between text-sm text-ink-soft py-1.5">
              <span>{row.label}</span>
              <span>₹{row.amount.toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div className="flex justify-between text-base font-semibold border-t border-line mt-2 pt-3">
            <span>Estimated total</span>
            <span>₹{plan.estimatedTotal.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg mb-2">Assumptions</h2>
        <ul className="list-disc list-inside text-sm text-ink-soft space-y-1 mb-4">
          {plan.assumptions.map((a) => <li key={a}>{a}</li>)}
        </ul>
        <h2 className="text-lg mb-2">Things to double-check</h2>
        <ul className="list-disc list-inside text-sm text-coral-dark space-y-1">
          {plan.warnings.map((w) => <li key={w}>{w}</li>)}
        </ul>
        <p className="text-xs text-ink-muted mt-4">{plan.disclaimer}</p>
      </section>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={handleDownload} disabled={downloading} className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-coral text-white text-sm font-semibold py-3 rounded-full disabled:opacity-60">
          <Download size={15} /> {downloading ? "Preparing..." : "Download travel kit PDF"}
        </button>
        <button type="button" className="flex-1 min-w-[140px] flex items-center justify-center gap-2 border border-line text-sm font-semibold py-3 rounded-full">
          <Share2 size={15} /> Share plan
        </button>
        <button type="button" className="flex-1 min-w-[140px] flex items-center justify-center gap-2 border border-line text-sm font-semibold py-3 rounded-full">
          <Pencil size={15} /> Modify plan
        </button>
        <Link to="/history" className="flex-1 min-w-[140px] flex items-center justify-center gap-2 border border-line text-sm font-semibold py-3 rounded-full">
          <BookmarkPlus size={15} /> Save to history
        </Link>
      </div>
    </div>
  );
}
