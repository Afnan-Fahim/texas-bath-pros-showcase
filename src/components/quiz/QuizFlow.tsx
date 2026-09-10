import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuizCard } from "./QuizCard";
import blackFramedShower from "@/assets/offer-summer-sale.avif";
import brandLogo from "@/assets/texas-bath-solutions-logo-transparent.png.asset.json";

export type QuizState = {
  desiredUpgrade: string;
  mainProblem: string;
  timeline: string;
  name: string;
  phone: string;
  address: string;
  homeowner: "Yes" | "No" | "";
};

const QUIZ_DATA = {
  question1: {
    title: "Tap the one that looks like your project.",
    description: "15 seconds. We’ll come look at it and give you a straight price — no pressure.",
    options: [
      { id: "Walk-in shower", label: "Walk-in shower", image: blackFramedShower },
      { id: "New tub remodel", label: "New tub remodel", image: "/images/quiz/new-tub.jpg" },
      { id: "Not sure yet", label: "Not sure yet" },
    ],
  },
  question2: {
    title: "What's the main problem?",
    description: "Choose what matters most to you.",
    options: [
      { id: "Hard to step over", label: "Hard to step over", image: "/images/quiz/hard-step.jpg" },
      { id: "Looks dated", label: "Looks dated", image: "/images/quiz/looks-dated.jpg" },
      { id: "Leak or damage", label: "Leak or damage", image: "/images/quiz/leak.jpg" },
      { id: "Not guest-ready", label: "Not guest-ready", image: "/images/quiz/not-guest-ready.jpg" },
    ],
  },
  question3: {
    title: "When would you like it done?",
    description: "Choose the timing that works best for you.",
    options: [
      { id: "ASAP", label: "ASAP" },
      { id: "2 weeks", label: "2 weeks" },
      { id: "1–3 months", label: "1–3 months" },
      { id: "Just looking", label: "Just looking" },
    ],
  },
};

interface QuizFlowProps {
  onShowCalendly?: (data: QuizState, url?: string) => void;
  onComplete?: (data: QuizState) => Promise<void> | void;
  onContactSubmit?: (data: QuizState) => Promise<void> | void;
  calendlyCompleted?: boolean;
}

export function QuizFlow({ onShowCalendly, onComplete, onContactSubmit, calendlyCompleted = false }: QuizFlowProps) {
  const [step, setStep] = useState(1);
  const quizData = QUIZ_DATA;

  // Warm up the booking calendar as soon as the quiz is on screen, so it is
  // ready by the time the visitor finishes the questions.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const addLink = (rel: string, href: string, id: string) => {
      if (document.getElementById(id)) return;
      const l = document.createElement("link");
      l.id = id;
      l.rel = rel;
      l.href = href;
      if (rel === "preconnect") l.crossOrigin = "";
      document.head.appendChild(l);
    };
    addLink("preconnect", "https://assets.calendly.com", "calendly-preconnect-assets");
    addLink("preconnect", "https://calendly.com", "calendly-preconnect-app");
    if (!document.getElementById("calendly-widget-script")) {
      const s = document.createElement("script");
      s.id = "calendly-widget-script";
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  const [state, setState] = useState<QuizState>({
    desiredUpgrade: "",
    mainProblem: "",
    timeline: "",
    name: "",
    phone: "",
    address: "",
    homeowner: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currentStep = calendlyCompleted ? 4 : step;

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const updateState = (key: keyof QuizState, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleOptionSelect = (key: keyof QuizState, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
    // Move to the next screen right away — never leave a blank/loading gap.
    handleNext();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.name || !state.phone || !state.address || !state.homeowner) {
      setError("Please fill out all fields.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      if (onComplete) {
        await onComplete(state);
      } else if (onContactSubmit) {
        await onContactSubmit(state);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto z-40">
      <div className="w-full relative overflow-hidden transition-all duration-500">
        {/* Decorative gradient backgrounds */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-teal/10 blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-navy/5 blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative z-10 p-5 sm:p-8 md:p-10">
          {/* Progress */}
          {currentStep <= 4 && (
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`text-sm font-medium transition-opacity ${currentStep === 1 ? "opacity-0" : "opacity-100 text-muted-foreground hover:text-foreground"}`}
              >
                ← Back
              </button>
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStep} of 4
              </span>
              <div className="w-12"></div>
            </div>
          )}

          {/* QUESTION 1 */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-4 sm:mb-5">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{quizData.question1.title}</h1>
                <p className="text-muted-foreground">{quizData.question1.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quizData.question1.options.map((opt: any, idx: number) => (
                  opt.image ? (
                    <QuizCard
                      key={opt.id}
                      index={idx}
                      title={opt.label}
                      image={opt.image}
                      brandLogo={brandLogo.url}
                      selected={state.desiredUpgrade === opt.label}
                      onClick={() => handleOptionSelect("desiredUpgrade", opt.label)}
                    />
                  ) : (
                    <Button
                      key={opt.id}
                      variant={state.desiredUpgrade === opt.label ? "default" : "outline"}
                      className={`h-auto py-4 text-lg border-2 sm:col-span-2 ${state.desiredUpgrade === opt.label ? "border-primary" : "border-border hover:border-primary/50"}`}
                      onClick={() => handleOptionSelect("desiredUpgrade", opt.label)}
                    >
                      {opt.label}
                    </Button>
                  )
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 2 */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-4 sm:mb-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{quizData.question2.title}</h2>
                <p className="text-muted-foreground">{quizData.question2.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quizData.question2.options.map((opt: any, idx: number) => (
                  <QuizCard
                    key={opt.id}
                    index={idx}
                    title={opt.label}
                    image={opt.image}
                    selected={state.mainProblem === opt.label}
                    onClick={() => handleOptionSelect("mainProblem", opt.label)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 3 */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-4 sm:mb-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{quizData.question3.title}</h2>
                <p className="text-muted-foreground">{quizData.question3.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quizData.question3.options.map((opt: any, idx: number) => (
                  <Button
                    key={opt.id}
                    variant={state.timeline === (opt.id || opt.label) ? "default" : "outline"}
                    className={`h-auto py-4 text-lg border-2 ${state.timeline === (opt.id || opt.label) ? "border-primary" : "border-border hover:border-primary/50"}`}
                    onClick={() => handleOptionSelect("timeline", opt.id || opt.label)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT STEP */}
          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-2 leading-tight">You're all set —<br />where should we come look?</h2>
                <p className="text-muted-foreground text-base mt-4">Free estimate at your house from a local Texas company. No pressure.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 mx-auto text-left">
                {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{error}</div>}

                <div className="space-y-2">
                  <Label htmlFor="quiz-name" className="text-base font-semibold text-navy">Name *</Label>
                  <Input
                    id="quiz-name"
                    type="text"
                    placeholder="First and last name"
                    className="h-12 text-base"
                    value={state.name}
                    onChange={(e) => updateState("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quiz-phone" className="text-base font-semibold text-navy">Mobile phone *</Label>
                  <Input
                    id="quiz-phone"
                    type="tel"
                    placeholder="(   ) ___-____"
                    className="h-12 text-base"
                    value={state.phone}
                    onChange={(e) => updateState("phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quiz-address" className="text-base font-semibold text-navy">ZIP code *</Label>
                  <Input
                    id="quiz-address"
                    type="text"
                    inputMode="numeric"
                    placeholder="78216"
                    className="h-12 text-base"
                    value={state.address}
                    onChange={(e) => updateState("address", e.target.value)}
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <Label className="text-base font-semibold text-navy">Are you the homeowner?</Label>
                  <div className="flex gap-8">
                    {(["Yes", "No"] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => updateState("homeowner", val)}
                        className="flex items-center space-x-3 cursor-pointer group"
                        aria-pressed={state.homeowner === val}
                      >
                        <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${state.homeowner === val ? "border-navy" : "border-border group-hover:border-navy"}`}>
                          {state.homeowner === val && <span className="w-3 h-3 bg-navy rounded-full" />}
                        </span>
                        <span className="text-lg text-foreground">{val}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full h-14 text-lg bg-[#0d2240] hover:bg-[#0d2240]/90 text-white mt-8" disabled={submitting}>
                  {submitting ? "Saving..." : "See available times"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
