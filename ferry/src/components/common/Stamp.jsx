// The passport-stamp badge - the one signature motif reused across every
// page (trending cards, hero banners, review cards) to reinforce
// "verified traveler proof" rather than generic UI chrome.
export default function Stamp({ top, num, label, className = "", size = 88 }) {
  return (
    <div
      className={`stamp ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.16 }}
    >
      <span className="font-semibold not-italic" style={{ fontSize: size * 0.16 }}>{top}</span>
      <span className="font-semibold" style={{ fontSize: size * 0.15 }}>{num}</span>
      <span className="uppercase not-italic opacity-85" style={{ fontSize: size * 0.09, letterSpacing: "0.1em" }}>{label}</span>
    </div>
  );
}
