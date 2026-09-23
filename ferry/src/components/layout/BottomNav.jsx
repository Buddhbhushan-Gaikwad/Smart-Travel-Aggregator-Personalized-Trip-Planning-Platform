import { NavLink } from "react-router-dom";
import { Home, Compass, Ticket, Sparkles, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/search", label: "Explore", icon: Compass },
  { to: "/history", label: "My trips", icon: Ticket },
  { to: "/planner", label: "AI planner", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-line px-2 py-1.5 flex justify-between">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[10px] font-medium ${
              isActive ? "text-coral" : "text-ink-soft"
            }`
          }
        >
          <Icon size={19} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
