import { Link } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "../../context/NotificationContext";
import NotificationPanel from "../notifications/NotificationPanel";

export default function MobileHeader() {
  const { unreadCount } = useNotifications();
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <header className="md:hidden sticky top-0 z-40 bg-sand/90 backdrop-blur border-b border-line">
      <div className="h-14 px-4 flex items-center justify-between">
        <Link to="/" className="font-display text-lg font-semibold">
          Ferry <span className="text-coral italic">.</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button type="button" aria-label="Notifications" onClick={() => setPanelOpen((v) => !v)} className="relative text-ink-soft">
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-coral text-white text-[10px] flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {panelOpen && <NotificationPanel onClose={() => setPanelOpen(false)} mobile />}
          </div>
          <Link to="/profile" aria-label="Profile menu" className="text-ink-soft">
            <Menu size={19} />
          </Link>
        </div>
      </div>
    </header>
  );
}
