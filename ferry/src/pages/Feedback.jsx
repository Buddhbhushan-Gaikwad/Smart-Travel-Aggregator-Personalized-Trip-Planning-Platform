import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, CheckCircle2 } from "lucide-react";
import { getTripById } from "../services/tripApi";
import { submitReview } from "../services/reviewApi";
import { SkeletonBlock } from "../components/common/Skeleton";

const TAGS = ["Comfortable bus", "Great hotel", "Well planned", "Great food", "Beautiful location", "Friendly team"];

export default function Feedback() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getTripById(tripId).then(setTrip);
  }, [tripId]);

  function toggleTag(tag) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating) return;
    setSubmitting(true);
    await submitReview({
      tripId,
      userName: "You",
      avatar: "https://commons.wikimedia.org/wiki/Special:FilePath/A_study_group_by_the_Ganga_at_Muni_ki_Reti_near_Rishikesh.jpg?width=120",
      rating,
      comment: comment || tags.join(", "),
    });
    setSubmitting(false);
    setSubmitted(true);
  }

  if (!trip) return <div className="max-w-[600px] mx-auto px-4 py-10"><SkeletonBlock className="h-64 w-full" /></div>;

  if (submitted) {
    return (
      <div className="max-w-[500px] mx-auto px-4 py-16 text-center">
        <CheckCircle2 size={40} className="text-teal mx-auto mb-4" />
        <h1 className="text-2xl mb-2">Thanks for your feedback</h1>
        <p className="text-sm text-ink-soft mb-6">Your review has been posted to this trip's page.</p>
        <button type="button" onClick={() => navigate(`/trips/${tripId}`)} className="bg-ink text-white text-sm font-semibold px-6 py-3 rounded-full">
          View trip page
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto px-4 md:px-8 py-6">
      <div className="rounded-2xl overflow-hidden h-32 bg-cover bg-center relative mb-6" style={{ backgroundImage: `url(${trip.banner})` }}>
        <div className="absolute inset-0 bg-black/40 flex items-end p-4">
          <p className="text-white font-medium">{trip.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <p className="text-sm font-semibold mb-3">How was your trip overall?</p>
          <div className="flex justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(n)}
                aria-label={`Rate ${n} star`}
              >
                <Star size={30} className={(hoverRating || rating) >= n ? "text-amber fill-amber" : "text-line fill-line"} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">What stood out?</p>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`text-xs font-medium px-3 py-2 rounded-full border ${
                  tags.includes(tag) ? "bg-ink text-white border-ink" : "border-line text-ink-soft"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">Tell us more (optional)</p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="What made this trip memorable?"
            className="w-full p-4 rounded-xl border border-line text-sm outline-none focus-visible:ring-2 focus-visible:ring-coral resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!rating || submitting}
          className="w-full bg-coral text-white text-sm font-semibold py-3.5 rounded-full disabled:opacity-40"
        >
          {submitting ? "Submitting..." : "Submit feedback"}
        </button>
      </form>
    </div>
  );
}
