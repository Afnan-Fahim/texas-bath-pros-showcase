import React, { useState, useEffect, useLayoutEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
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
  showStartCue?: boolean;
  photoFill?: boolean;
  compact?: boolean;
  labelOverrides?: Record<string, string>;
  extraSubline?: string;
}

export function QuizFlow({
  onShowCalendly,
  onComplete,
  onContactSubmit,
  calendlyCompleted = false,
  showStartCue = true,
  photoFill = false,
  compact = false,
  labelOverrides = {},
  extraSubline,
}: QuizFlowProps) {
  const [step, setStep] = useState(1);
  const [cueDismissed, setCueDismissed] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const hasMountedRef = React.useRef(false);

  // Pin every question to the same viewport position before it paints.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const targetTop = window.scrollY + rect.top - Math.max(12, (window.innerHeight - rect.height) / 2);
    window.scrollTo({ top: Math.max(0, targetTop), behavior: hasMountedRef.current ? "smooth" : "auto" });
    hasMountedRef.current = true;
  }, [step]);
  // All quiz steps, questions and photos are managed from /admin.
  const quizConfig = useQuizConfig();
  const steps = quizConfig.steps;
  const totalSteps = steps.length;

  // Warm up the booking calendar only AFTER the first question has painted, so
  // Calendly never competes with the first screen on a slow ad-click load.
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
    const warm = () => {
      addLink("preconnect", "https://assets.calendly.com", "calendly-preconnect-assets");
      addLink("preconnect", "https://calendly.com", "calendly-preconnect-app");
      if (!document.getElementById("calendly-widget-script")) {
        const s = document.createElement("script");
        s.id = "calendly-widget-script";
        s.src = "https://assets.calendly.com/assets/external/widget.js";
        s.async = true;
        document.body.appendChild(s);
      }
    };
    const w = window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const timer = w.requestIdleCallback
      ? w.requestIdleCallback(warm, { timeout: 4000 })
      : window.setTimeout(warm, 2500);
    return () => {
      const cancel = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (w.requestIdleCallback && cancel) cancel(timer);
      else window.clearTimeout(timer);
    };
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
    setCueDismissed(true);
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
    <div
      ref={containerRef}
      className={cn(
        "relative z-40 mx-auto flex w-full justify-center overflow-y-auto overscroll-contain scroll-m-0",
        compact
          ? "h-full max-h-[calc(100svh-0.5rem)] max-w-xl items-center md:max-w-3xl"
          : "max-h-[calc(100svh-1.5rem)] min-h-[34rem] max-w-4xl items-start"
      )}
    >
      <div className="w-full relative overflow-hidden">
        {/* Decorative gradient backgrounds */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-teal/10 blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-navy/5 blur-3xl opacity-50 pointer-events-none"></div>

        <div className={cn("relative z-10", compact ? "p-3 sm:p-5 md:p-8" : "p-4 sm:p-7 md:p-8")}>
          {/* Start here cue */}
          {showStartCue && (
            <div
              className={`flex flex-col items-center justify-center transition-all duration-300 ease-out ${
                cueDismissed || step !== 1 ? "pointer-events-none mb-0 max-h-0 opacity-0" : "mb-6 max-h-56 opacity-100"
              }`}
              aria-hidden={cueDismissed || step !== 1}
            >
              <button
                type="button"
                onClick={() => setCueDismissed(true)}
                className="group inline-flex flex-col items-center justify-center rounded-full bg-navy px-12 py-2 text-lg font-sans font-semibold tracking-wide text-white shadow-md transition-all duration-200 animate-soft-bounce min-w-[16rem] sm:min-w-[22rem] sm:px-14 sm:py-2.5 sm:text-xl"
              >
                <span>Start here</span>
                <ChevronDown className="mt-0.5 h-4 w-4 text-white" strokeWidth={2.5} />
              </button>
            </div>
          )}

          {/* Progress */}
          {currentStep <= totalSteps && (
            <div className={cn("flex items-center justify-between", compact ? "mb-2 md:mb-4" : "mb-4")}>
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
              <div key={stepConfig.id} className={cn("flex flex-col justify-center", compact ? "" : "min-h-[25rem] sm:min-h-[27rem]")}>
                <div className={cn("text-center", compact ? "mb-2 sm:mb-3 md:mb-5" : "mb-4 sm:mb-5")}>
                  {stepIdx === 0 ? (
                    <h1 className={cn("font-sans font-bold text-navy leading-snug mb-1", compact ? "text-xl sm:text-2xl md:text-3xl" : "text-2xl sm:text-3xl")}>{stepConfig.title}</h1>
                  ) : (
                    <h2 className={cn("font-bold text-foreground mb-1", compact ? "text-xl sm:text-2xl md:text-3xl" : "text-2xl sm:text-3xl")}>{stepConfig.title}</h2>
                  )}
                  <p className={cn("text-muted-foreground", compact ? "text-sm md:text-base" : "")}>{stepConfig.description}</p>
                  {stepIdx === 0 && extraSubline && (
                    <p className={cn("text-muted-foreground", compact ? "mt-0.5 text-xs" : "mt-1 text-sm")}>{extraSubline}</p>
                  )}
                </div>
                <div className={cn("grid grid-cols-2", compact ? "gap-2 sm:gap-3" : "gap-3 sm:gap-4")}>
                  {stepConfig.options.map((opt, idx) => {
                    const optionLabel = labelOverrides[opt.id] ?? opt.label;
                    return opt.image || opt.imagePending ? (
                      <QuizCard
                        key={opt.id}
                        index={idx}
                        title={optionLabel}
                        image={opt.image}
                        fill={photoFill}
                        compact={compact}
                        selected={state[stepConfig.key] === optionLabel}
                        onClick={() => handleOptionSelect(stepConfig.key, optionLabel)}
                      />
                    ) : (
                      <button
                        key={opt.id}
                        type="button"
                        className={cn(
                          "col-span-2 w-full rounded-xl border text-center transition-colors",
                          stepIdx === 0
                            ? compact
                              ? "border-navy/30 bg-card px-4 py-2 text-sm font-medium text-navy hover:bg-navy/5 hover:border-navy/50 sm:text-base"
                              : "border-navy/30 bg-card px-4 py-2.5 text-base font-medium text-navy hover:bg-navy/5 hover:border-navy/50 sm:text-lg"
                            : compact
                              ? "min-h-10 border-2 py-2 text-sm sm:py-2.5 sm:text-base"
                              : "min-h-14 border-2 py-3 text-base sm:py-4 sm:text-lg",
                          state[stepConfig.key] === optionLabel
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => handleOptionSelect(stepConfig.key, optionLabel)}
                      >
                        {optionLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null,
          )}

        </div>
      </div>
    </div>
  );
}
