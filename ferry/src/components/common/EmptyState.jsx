import { Compass } from "lucide-react";

export default function EmptyState({ icon: Icon = Compass, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-full bg-sand-2 flex items-center justify-center mb-4">
        <Icon size={22} className="text-ink-soft" />
      </div>
      <h3 className="text-lg mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-ink-soft max-w-xs mb-4">{subtitle}</p>}
      {action}
    </div>
  );
}
