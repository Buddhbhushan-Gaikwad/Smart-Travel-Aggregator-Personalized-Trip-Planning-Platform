import { Link, NavLink } from "react-router-dom";
import { Bell, Search, User } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import NotificationPanel from "../notifications/NotificationPanel";

const navLink = ({ isActive }) =>
  `text-sm font-medium transition ${isActive ? "text-ink" : "text-ink-soft hover:text-ink"}`;

export default function Navbar() {
  const { unreadCount } = useNotifications();
  const { isAuthenticated, user } = useAuth();
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-sand/90 backdrop-blur border-b border-line">
      <nav className="max-w-[1180px] mx-auto px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-semibold">
          Ferry <span className="text-coral italic">.</span>
        </Link>

        <div className="flex items-center gap-7">
          <NavLink to="/" end className={navLink}>Home</NavLink>
          <NavLink to="/search" className={navLink}>Explore</NavLink>
          <NavLink to="/history" className={navLink}>My trips</NavLink>
          <NavLink to="/planner" className={navLink}>AI planner</NavLink>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/search" aria-label="Search" className="text-ink-soft hover:text-ink">
            <Search size={19} />
          </Link>
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setPanelOpen((v) => !v)}
              className="relative text-ink-soft hover:text-ink"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-coral text-white text-[10px] flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {panelOpen && <NotificationPanel onClose={() => setPanelOpen(false)} />}
          </div>
          <Link
            to={isAuthenticated ? "/profile" : "/login"}
            className="flex items-center gap-2 bg-ink text-white text-sm font-medium px-4 py-2 rounded-full"
          >
            <User size={15} />
            {isAuthenticated ? user?.name?.split(" ")[0] : "Sign in"}
          </Link>
        </div>
      </nav>
    </header>
  );
}
