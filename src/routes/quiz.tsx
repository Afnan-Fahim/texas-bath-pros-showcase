import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { QuizFlow, QuizState } from "@/components/quiz/QuizFlow";
import { CalendlyEmbed, trackLeadEvent, captureAttribution, attributionNote } from "./index";
import logoImg from "@/assets/logo-header.webp";

import { useQuizConfig, DEFAULT_CALENDLY_URL } from "@/lib/quiz-content";
import { scheduleLead } from "@/lib/leads.functions";

export const Route = createFileRoute("/quiz")({
  component: QuizPage,
  head: () => ({
    meta: [
      { title: "Free Bathroom Remodel Estimate Quiz | Texas Bath Solutions" },
      {
        name: "description",
        content:
          "Answer three quick questions and book a free in-home bathroom remodel estimate with Texas Bath Solutions. About 15 seconds, no pressure.",
      },
      { property: "og:title", content: "Free Bathroom Remodel Estimate Quiz | Texas Bath Solutions" },
      {
        property: "og:description",
        content: "Three quick questions, then pick a time for your free in-home estimate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function QuizPage() {
  const stageRef = useRef<HTMLElement>(null);
  const [calendlyCompleted, setCalendlyCompleted] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [quizData, setQuizData] = useState<QuizState | null>(null);
  const quizConfig = useQuizConfig();
  const calendlyUrl = quizConfig.calendlyUrl || DEFAULT_CALENDLY_URL;

  useEffect(() => {
    captureAttribution();
    const w = window as unknown as { fbq?: (...args: unknown[]) => void };
    w.fbq?.("track", "PageView");
  }, []);

  const buildLead = (d: QuizState, booked: boolean) => ({
    // Calendly collects the personal details; the quiz only carries the answers.
    name: d.name || "Quiz lead",
    email: d.email || "quiz@provided.com",
    phone: d.phone || "See Calendly",
    address: d.address || "Provided in Calendly",
    timeframe: d.timeline,
    notes:
      [
        `Status: ${booked ? "BOOKED" : "NOT BOOKED"}`,
        `Upgrade: ${d.desiredUpgrade}`,
        `Problem: ${d.mainProblem}`,
        `Timeline: ${d.timeline}`,
        `Page: ${typeof window !== "undefined" ? window.location.href : "/quiz"}`,
      ].join("\n") + attributionNote(),
    source: booked ? "Facebook/Messenger Quiz — Booked" : "Facebook/Messenger Quiz",
  });

  const handleCalendlyScheduled = (uri: string) => {
    setCalendlyCompleted(true);
    if (quizData) {
      scheduleLead({
        data: { leadData: buildLead(quizData, true), eventUri: uri || "" },
      }).catch((e) => console.error(e));
    }
  };

  const handleCalendlyBack = () => {
    setShowCalendly(false);
  };

  const handleQuizComplete = async (finalData: QuizState) => {
    // Straight to the calendar after the last photo question.
    setQuizData(finalData);
    setShowCalendly(true);
    trackLeadEvent(`quiz:${finalData.desiredUpgrade}:${Date.now()}`, {});
  };

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const targetTop = window.scrollY + rect.top - Math.max(0, (window.innerHeight - rect.height) / 2);
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  }, [showCalendly]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <header className="w-full flex justify-center py-2 sm:py-2">
        <img src={logoImg} alt="Texas Bath Solutions" className="h-10 sm:h-12 w-auto" />
      </header>

      <main ref={stageRef} className="flex w-full flex-1 items-start justify-center px-3 pt-1 pb-2 sm:px-6 relative">
        <div className={showCalendly ? "hidden" : "contents"}>
          <QuizFlow
            onComplete={handleQuizComplete}
            calendlyCompleted={calendlyCompleted}
            showStartCue={false}
            photoFill={false}
            compact={true}
            labelOverrides={{ "new-tub": "New bathtub" }}
            extraSubline="Free in-home estimate • San Antonio • No pressure"
          />
        </div>

        {/* Calendar mounts with the quiz so finishing step 3 reveals it instantly. */}
        <div
          className={
            showCalendly
              ? "mx-auto h-[calc(100svh-1.5rem)] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6"
              : "pointer-events-none absolute inset-0 -z-10 w-full overflow-hidden p-4 opacity-0"
          }
          aria-hidden={!showCalendly}
        >
          <CalendlyEmbed
            url={calendlyUrl}
            prefill={{
              name: quizData?.name || "",
              email: quizData?.email || "",
            }}
            onBack={handleCalendlyBack}
            onScheduled={handleCalendlyScheduled}
            title="Pick a time for your free estimate"
            subtitle="After you tap a time, scroll is not needed — fill in your name and phone to lock it in."
          />
        </div>
      </main>
    </div>
  );
}
