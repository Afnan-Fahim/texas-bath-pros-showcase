import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuizCard } from "./QuizCard";
import { useQuizConfig } from "@/lib/quiz-content";

export type QuizState = {
  desiredUpgrade: string;
  mainProblem: string;
  timeline: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  homeowner: "Yes" | "No" | "";
};


interface QuizFlowProps {
  onShowCalendly?: (data: QuizState, url?: string) => void;
  onComplete?: (data: QuizState) => Promise<void> | void;
  onContactSubmit?: (data: QuizState) => Promise<void> | void;
  calendlyCompleted?: boolean;
}

export function QuizFlow({ onShowCalendly, onComplete, onContactSubmit, calendlyCompleted = false }: QuizFlowProps) {
  const [step, setStep] = useState(1);
  // All quiz steps, questions and photos are managed from /admin.
  const quizConfig = useQuizConfig();
  const steps = quizConfig.steps;
  const totalSteps = steps.length;

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
    email: "",
    phone: "",
    address: "",
    homeowner: "",
  });
  const currentStep = calendlyCompleted ? totalSteps : Math.min(step, totalSteps);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleOptionSelect = (key: keyof QuizState, value: string) => {
    const next = { ...state, [key]: value };
    setState(next);
    const isLastQuestion = step >= steps.length;
    if (isLastQuestion) {
      // Straight to the calendar — Calendly collects all personal details.
      if (onComplete) {
        void onComplete(next);
      } else if (onContactSubmit) {
        void onContactSubmit(next);
      }
      onShowCalendly?.(next);
      return;
    }
    handleNext();
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto z-40">
      <div className="w-full relative overflow-hidden transition-all duration-500">
        {/* Decorative gradient backgrounds */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-teal/10 blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-navy/5 blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative z-10 p-5 sm:p-8 md:p-10">
          {/* Progress */}
          {currentStep <= totalSteps && (
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`text-sm font-medium transition-opacity ${currentStep === 1 ? "opacity-0" : "opacity-100 text-muted-foreground hover:text-foreground"}`}
              >
                ← Back
              </button>
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
              <div className="w-12"></div>
            </div>
          )}

          {/* PHOTO / CHOICE QUESTIONS — every step is editable in /admin */}
          {steps.map((stepConfig, stepIdx) =>
            currentStep === stepIdx + 1 ? (
              <div key={stepConfig.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-4 sm:mb-5">
                  {stepIdx === 0 ? (
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{stepConfig.title}</h1>
                  ) : (
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{stepConfig.title}</h2>
                  )}
                  <p className="text-muted-foreground">{stepConfig.description}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stepConfig.options.map((opt, idx) =>
                    opt.image ? (
                      <QuizCard
                        key={opt.id}
                        index={idx}
                        title={opt.label}
                        image={opt.image}
                        selected={state[stepConfig.key] === opt.label}
                        onClick={() => handleOptionSelect(stepConfig.key, opt.label)}
                      />
                    ) : (
                      <Button
                        key={opt.id}
                        variant={state[stepConfig.key] === opt.label ? "default" : "outline"}
                        className={`h-auto border-2 text-lg ${stepIdx === 0 ? "min-h-20 py-6 sm:col-span-2" : "py-4"} ${state[stepConfig.key] === opt.label ? "border-primary" : "border-border hover:border-primary/50"}`}
                        onClick={() => handleOptionSelect(stepConfig.key, opt.label)}
                      >
                        {opt.label}
                      </Button>
                    ),
                  )}
                </div>
              </div>
            ) : null,
          )}

        </div>
      </div>
    </div>
  );
}
