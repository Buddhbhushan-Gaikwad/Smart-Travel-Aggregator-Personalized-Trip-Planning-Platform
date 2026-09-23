import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import MobileHeader from "./MobileHeader";
import BottomNav from "./BottomNav";
import FloatingAssistant from "../chat/FloatingAssistant";

export default function Layout() {
  const { pathname } = useLocation();
  // Keep the chatbot out of the way during checkout/payment focus flows.
  const hideAssistant = ["/checkout", "/payment"].includes(pathname);

  return (
    <div className="min-h-screen bg-sand text-ink pb-16 md:pb-0">
      <Navbar />
      <MobileHeader />
      <main>
        <Outlet />
      </main>
      <BottomNav />
      {!hideAssistant && <FloatingAssistant />}
    </div>
  );
}
