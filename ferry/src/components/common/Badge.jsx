export default function Badge({ children, tone = "neutral", className = "" }) {
  const tones = {
    neutral: "bg-sand-2 text-ink-soft border border-line",
    success: "bg-teal-light text-teal",
    warning: "bg-amber-light text-amber",
    danger: "bg-coral-light text-coral-dark",
    accent: "bg-coral text-white",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
