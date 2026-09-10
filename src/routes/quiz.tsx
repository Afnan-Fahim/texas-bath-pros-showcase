import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QuizFlow, QuizState } from "@/components/quiz/QuizFlow";
import { CalendlyEmbed, trackLeadEvent, captureAttribution, attributionNote } from "./index";
import logoImg from "@/assets/logo-header.webp";
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
  const [calendlyCompleted, setCalendlyCompleted] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [quizData, setQuizData] = useState<QuizState | null>(null);
  const [calendlyUrl] = useState("https://calendly.com/rugsafari/texas-bath-solutions");

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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <header className="w-full bg-background border-b border-border py-4 px-6 flex justify-center shadow-sm z-10 relative">
        <img src={logoImg} alt="Texas Bath Solutions" className="h-10 object-contain" />
      </header>

      <main className="flex-1 w-full flex flex-col justify-center py-12 px-4 sm:px-6 relative">
        {!showCalendly && (
          <QuizFlow onComplete={handleQuizComplete} calendlyCompleted={calendlyCompleted} />
        )}

        {showCalendly && (
          <div className="w-full max-w-3xl mx-auto bg-background p-6 rounded-2xl shadow-sm border border-border">
            <CalendlyEmbed
              url={calendlyUrl}
              prefill={{
                name: quizData?.name || "",
                email: quizData?.email || "",
                phone: quizData?.phone || "",
                project: quizData?.timeline || "",
                address: quizData?.address || "",
              }}
              onBack={handleCalendlyBack}
              onScheduled={handleCalendlyScheduled}
              title="Last step — pick a time for your free in-home estimate."
              subtitle="No pressure."
            />
          </div>
        )}
      </main>
    </div>
  );
}
