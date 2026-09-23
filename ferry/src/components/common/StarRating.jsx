import { Star } from "lucide-react";

export default function StarRating({ rating = 0, size = 14, showValue = true, reviewCount }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-ink-soft">
      <Star size={size} className="text-amber fill-amber" />
      {showValue && <span className="font-medium text-ink">{rating.toFixed(1)}</span>}
      {reviewCount != null && <span>({reviewCount})</span>}
    </span>
  );
}
