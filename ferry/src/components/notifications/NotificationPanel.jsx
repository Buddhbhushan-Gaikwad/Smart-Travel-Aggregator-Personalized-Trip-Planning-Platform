import { Bell, BellOff, Check } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import EmptyState from "../common/EmptyState";

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationPanel({ onClose, mobile = false }) {
  const { notifications, loading, markRead, markAllRead } = useNotifications();

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
      <div
        className={`absolute z-50 bg-white border border-line rounded-2xl shadow-xl overflow-hidden ${
          mobile ? "right-0 top-10 w-[88vw] max-w-sm" : "right-0 top-10 w-96"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-line">
          <h3 className="text-sm font-semibold">Notifications</h3>
          <button type="button" onClick={markAllRead} className="text-xs text-coral-dark font-medium flex items-center gap-1">
            <Check size={13} /> Mark all read
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {loading && <div className="p-6 text-center text-sm text-ink-soft">Loading...</div>}
          {!loading && notifications.length === 0 && (
            <EmptyState icon={BellOff} title="You're all caught up" subtitle="New updates about your trips will show up here." />
          )}
          {!loading &&
            notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => markRead(n.id)}
                className={`w-full text-left px-4 py-3 border-b border-line last:border-0 flex gap-3 hover:bg-sand-2/60 ${
                  !n.read ? "bg-coral-light/30" : ""
                }`}
              >
                <div className="mt-1.5 shrink-0">
                  {!n.read ? <span className="block w-2 h-2 rounded-full bg-coral" /> : <Bell size={14} className="text-ink-muted" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{n.title}</p>
                  <p className="text-xs text-ink-soft mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-[11px] text-ink-muted mt-1">{timeAgo(n.createdAt)}</p>
                </div>
              </button>
            ))}
        </div>
      </div>
    </>
  );
}
