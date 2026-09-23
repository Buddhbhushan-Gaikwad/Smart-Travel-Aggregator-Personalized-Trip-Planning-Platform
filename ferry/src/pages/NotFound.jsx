import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-[420px] mx-auto px-4 py-24 text-center">
      <Compass size={36} className="text-ink-muted mx-auto mb-4" />
      <h1 className="text-2xl mb-2">Looks like you've wandered off the map</h1>
      <p className="text-sm text-ink-soft mb-6">We couldn't find that page.</p>
      <Link to="/" className="bg-ink text-white text-sm font-semibold px-6 py-3 rounded-full">Back to home</Link>
    </div>
  );
}
