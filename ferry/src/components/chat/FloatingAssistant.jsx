import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Compass, X, Mic, Send, Minus } from "lucide-react";
import { getGreeting, sendChatMessage } from "../../services/chatApi";
import Stamp from "../common/Stamp";

function Message({ role, children }) {
  if (role === "status") {
    return <p className="text-xs text-ink-muted flex items-center gap-1.5 my-1"><span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />{children}</p>;
  }
  const isUser = role === "user";
  return (
    <div
      className={`max-w-[85%] text-sm px-3 py-2 rounded-2xl ${
        isUser
          ? "self-end bg-coral text-white rounded-tr-sm"
          : "self-start bg-sand-2 border border-line rounded-tl-sm"
      }`}
    >
      {children}
    </div>
  );
}

export default function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [matchedTrip, setMatchedTrip] = useState(null);
  const scrollRef = useRef(null);
  const greeting = getGreeting();

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", text: greeting.text }]);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function handleSend(text) {
    const value = (text ?? input).trim();
    if (!value || busy) return;
    setInput("");
    setMatchedTrip(null);
    setMessages((prev) => [...prev, { role: "user", text: value }]);
    setBusy(true);
    setMessages((prev) => [...prev, { role: "status", text: "Checking available trips..." }]);
    try {
      const res = await sendChatMessage({ message: value });
      setMessages((prev) => {
        const withoutStatus = prev.filter((m) => m.role !== "status");
        return [...withoutStatus, { role: "assistant", text: res.reply }];
      });
      if (res.matchedTrip) setMatchedTrip(res.matchedTrip);
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.role !== "status"),
        { role: "assistant", text: "I couldn't complete that just now. Please try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50">
      {open && (
        <div className="mb-3 w-[92vw] max-w-sm h-[70vh] max-h-[560px] bg-white rounded-3xl shadow-2xl border border-line flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-sand-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-coral-light flex items-center justify-center">
                <Compass size={16} className="text-coral-dark" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">Travel assistant</p>
                <p className="text-[11px] text-teal flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal" /> Ready to help
                </p>
              </div>
            </div>
            <button type="button" aria-label="Minimize assistant" onClick={() => setOpen(false)} className="text-ink-soft hover:text-ink">
              <Minus size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
            {messages.map((m, i) => (
              <Message key={i} role={m.role}>{m.text}</Message>
            ))}

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {greeting.quickActions.map((qa) => (
                  <button
                    key={qa}
                    type="button"
                    onClick={() => handleSend(qa)}
                    className="text-xs bg-sand-2 border border-line rounded-full px-3 py-1.5 hover:border-ink"
                  >
                    {qa}
                  </button>
                ))}
              </div>
            )}

            {matchedTrip && (
              <div className="self-start w-full mt-1 rounded-2xl overflow-hidden border border-line bg-white">
                <div className="h-24 bg-cover bg-center relative" style={{ backgroundImage: `url(${matchedTrip.banner})` }}>
                  <Stamp num={matchedTrip.rating.toFixed(1) + "★"} label="rated" size={48} className="top-2 right-2" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium">{matchedTrip.title}</p>
                  <p className="text-xs text-ink-soft mb-2">{matchedTrip.duration} · From ₹{matchedTrip.startingPrice.toLocaleString("en-IN")}</p>
                  <div className="flex gap-2">
                    <Link to={`/trips/${matchedTrip.id}`} className="flex-1 text-center text-xs font-semibold bg-ink text-white rounded-full py-2">
                      View trip
                    </Link>
                    <Link to="/planner" className="flex-1 text-center text-xs font-semibold border border-line rounded-full py-2">
                      Custom plan instead
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 px-3 py-2.5 border-t border-line"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="Type a message"
              className="flex-1 h-9 px-3 rounded-full bg-sand-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-coral"
            />
            <button type="button" aria-label="Voice input" className="w-9 h-9 shrink-0 rounded-full border border-line flex items-center justify-center text-ink-soft">
              <Mic size={15} />
            </button>
            <button type="submit" aria-label="Send message" disabled={busy} className="w-9 h-9 shrink-0 rounded-full bg-coral text-white flex items-center justify-center disabled:opacity-50">
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close travel assistant" : "Open travel assistant"}
        className="relative w-14 h-14 rounded-full bg-coral text-white shadow-lg flex items-center justify-center hover:scale-105 transition"
      >
        {!open && <span className="absolute inset-0 rounded-full bg-coral animate-ping opacity-40" />}
        {open ? <X size={22} /> : <Compass size={22} />}
      </button>
    </div>
  );
}
