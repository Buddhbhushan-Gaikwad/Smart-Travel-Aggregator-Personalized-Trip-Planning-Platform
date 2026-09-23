const COLORS = {
  Mountains: "bg-teal-light text-teal",
  Beach: "bg-coral-light text-coral-dark",
  Historical: "bg-amber-light text-amber",
  Nature: "bg-teal-light text-teal",
  Adventure: "bg-coral-light text-coral-dark",
  Weekend: "bg-sand-2 text-ink-soft",
  Family: "bg-amber-light text-amber",
  Luxury: "bg-sand-2 text-ink-soft",
  Budget: "bg-teal-light text-teal",
  Spiritual: "bg-amber-light text-amber",
};

export default function CategoryChip({ label, active = false, onClick }) {
  const tone = COLORS[label] || "bg-sand-2 text-ink-soft";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-sm font-medium px-4 py-2 rounded-full border transition ${
        active ? "border-ink bg-ink text-white" : `border-line ${tone}`
      }`}
    >
      {label}
    </button>
  );
}
