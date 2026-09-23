import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { getPlannerQuestions } from "../services/chatApi";
import { searchTrips } from "../services/tripApi";
import { generateTravelPlan, PLANNING_STEPS } from "../services/plannerApi";
import TripCard from "../components/trip/TripCard";

const QUESTIONS = getPlannerQuestions();

export default function Planner() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // index into QUESTIONS
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [phase, setPhase] = useState("questions"); // questions | checking | matched | no-match | generating
  const [matchedTrip, setMatchedTrip] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const current = QUESTIONS[step];

  async function handleAnswer(value) {
    const next = { ...answers, [current.key]: value };
    setAnswers(next);
    setInputValue("");

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
      return;
    }

    // Last question answered - check for an existing curated trip first.
    setPhase("checking");
    const results = await searchTrips({ query: next.destination });
    if (results.length) {
      setMatchedTrip(results[0]);
      setPhase("matched");
    } else {
      setPhase("no-match");
    }
  }

  async function handleBuildPlan() {
    setPhase("generating");
    for (let i = 0; i < PLANNING_STEPS.length; i++) {
      setActiveStep(i);
      await new Promise((r) => setTimeout(r, 550));
    }
    const plan = await generateTravelPlan(answers);
    navigate(`/planner/result/${plan.id}`);
  }

  return (
    <div className="max-w-[700px] mx-auto px-4 md:px-8 py-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-coral-light flex items-center justify-center mx-auto mb-3">
          <Sparkles size={20} className="text-coral-dark" />
        </div>
        <h1 className="text-3xl mb-1">Plan your journey</h1>
        <p className="text-sm text-ink-soft">Tell us where you want to go and what kind of experience you want.</p>
      </div>

      {phase === "questions" && (
        <div className="bg-white border border-line rounded-2xl p-6">
          <div className="flex gap-1.5 mb-6">
            {QUESTIONS.map((_, i) => (
              <span key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-coral" : "bg-line"}`} />
            ))}
          </div>
          <p className="text-lg font-display mb-4">{current.prompt}</p>

          {current.options ? (
            <div className="flex flex-wrap gap-2">
              {current.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleAnswer(opt)}
                  className="text-sm font-medium px-4 py-2.5 rounded-full border border-line hover:border-ink"
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); if (inputValue.trim()) handleAnswer(inputValue.trim()); }}
              className="flex gap-2"
            >
              <input
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                type="text"
                placeholder="Type your answer"
                className="flex-1 h-11 px-4 rounded-full border border-line text-sm outline-none focus-visible:ring-2 focus-visible:ring-coral"
              />
              <button type="submit" className="bg-coral text-white text-sm font-semibold px-6 rounded-full">Next</button>
            </form>
          )}

          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} className="text-xs text-ink-muted mt-4">← Back</button>
          )}
        </div>
      )}

      {phase === "checking" && (
        <div className="bg-white border border-line rounded-2xl p-8 text-center">
          <Loader2 size={24} className="animate-spin text-coral mx-auto mb-3" />
          <p className="text-sm text-ink-soft">Checking whether we already have a matching curated trip...</p>
        </div>
      )}

      {phase === "matched" && matchedTrip && (
        <div>
          <p className="text-center text-sm font-medium mb-4">We found a trip that matches your requirements.</p>
          <div className="max-w-sm mx-auto mb-5">
            <TripCard trip={matchedTrip} />
          </div>
          <div className="flex justify-center gap-3">
            <button type="button" onClick={() => navigate(`/trips/${matchedTrip.id}`)} className="bg-ink text-white text-sm font-semibold px-6 py-3 rounded-full">
              View trip
            </button>
            <button type="button" onClick={() => setPhase("no-match")} className="border border-line text-sm font-semibold px-6 py-3 rounded-full">
              Create a custom plan instead
            </button>
          </div>
        </div>
      )}

      {phase === "no-match" && (
        <div className="bg-white border border-line rounded-2xl p-6 text-center">
          <p className="text-sm mb-5">
            I couldn't find an exact match in our available trips. I can create a personalized travel plan for you.
          </p>
          <button type="button" onClick={handleBuildPlan} className="bg-coral text-white text-sm font-semibold px-8 py-3.5 rounded-full">
            Build my plan
          </button>
        </div>
      )}

      {phase === "generating" && (
        <div className="bg-white border border-line rounded-2xl p-6">
          <div className="space-y-3">
            {PLANNING_STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-3 text-sm">
                {i < activeStep ? (
                  <CheckCircle2 size={16} className="text-teal shrink-0" />
                ) : i === activeStep ? (
                  <Loader2 size={16} className="animate-spin text-coral shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-line shrink-0" />
                )}
                <span className={i <= activeStep ? "text-ink" : "text-ink-muted"}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
