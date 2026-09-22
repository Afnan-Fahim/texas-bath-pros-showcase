import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { QuizFlow, QuizState } from "@/components/quiz/QuizFlow";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { captureAttribution, attributionNote } from "@/lib/tracking";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo-footer.webp";

import { useQuizConfig, DEFAULT_CALENDLY_URL, type QuizConfig } from "@/lib/quiz-content";
import { loadQuizConfigWithStepOne } from "@/lib/quiz-preload";
import { scheduleLead } from "@/lib/leads.functions";

export const Route = createFileRoute("/quiz")({
  component: QuizPage,
  // Resolve the saved content + step 1 photo URLs before the page is sent, so
  // an ad click (…?fbclid=…) paints the real photos on the first frame.
  loader: async () => {
    try {
      return { quizConfig: await loadQuizConfigWithStepOne() };
    } catch {
      return { quizConfig: null as QuizConfig | null };
    }
  },
  head: ({ loaderData }) => ({
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
    links: [
      // The step 1 photos come from the backend — open that connection early.
      { rel: "preconnect", href: "https://xbfbqbytfzwjqpovuiff.supabase.co", crossOrigin: "" },
      { rel: "dns-prefetch", href: "https://xbfbqbytfzwjqpovuiff.supabase.co" },
      // Start downloading the step 1 photos with the document itself.
      ...((loaderData?.quizConfig?.steps?.[0]?.options ?? [])
        .map((o) => o.image)
        .filter((src): src is string => !!src)
        .map((href) => ({ rel: "preload", as: "image", href, fetchpriority: "high" }))),
    ],
  }),
});

function QuizPage() {
  const stageRef = useRef<HTMLElement>(null);
  const [calendlyCompleted, setCalendlyCompleted] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [quizData, setQuizData] = useState<QuizState | null>(null);
  const { quizConfig: initialQuizConfig } = Route.useLoaderData();
  const { config: quizConfig } = useQuizConfig(initialQuizConfig ?? undefined);
  const calendlyUrl = quizConfig.calendlyUrl || DEFAULT_CALENDLY_URL;

  const [mountCalendly, setMountCalendly] = useState(false);

  useEffect(() => {
    captureAttribution();
    // PageView is fired once by the base Meta Pixel in the site head
    // (__root.tsx). Do not fire it again here — that would double-count.
  }, []);

  // Prepare the calendar in the background immediately after the first paint,
  // well before the visitor reaches the final step.
  useEffect(() => {
    const t = window.setTimeout(() => setMountCalendly(true), 250);
    return () => window.clearTimeout(t);
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
    // Meta Lead/Schedule fire ONLY on a completed Calendly booking (see CalendlyEmbed).
    setQuizData(finalData);
    setShowCalendly(true);
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
      <header
        className={cn(
          "relative z-20 w-full flex justify-center py-0 sm:py-0.5",
          showCalendly && "hidden sm:flex"
        )}
      >
        <img
          src={logoImg}
          alt="Texas Bath Solutions — Trusted Shower Experts"
          className="relative z-20 h-24 w-auto max-w-[94vw] translate-y-10 sm:h-[10.5rem] sm:max-w-none sm:translate-y-2 md:h-28 md:translate-y-0"
          width={400}
          height={80}
          fetchPriority="high"
        />
      </header>

      <main ref={stageRef} className="flex w-full flex-1 items-center justify-center px-4 sm:px-6 py-3 sm:py-5 md:py-1 relative">
        <div className={showCalendly ? "hidden" : "contents"}>
          <QuizFlow
            initialConfig={initialQuizConfig ?? undefined}
            onComplete={handleQuizComplete}
            calendlyCompleted={calendlyCompleted}
            showStartCue={false}
            photoFill={false}
            compact={true}
            waitForContent={true}
            maxSteps={1}
            progressLabel="Three easy steps · 1 of 3"
            extraSubline="Free in-home estimate • San Antonio • (210) 702-0753"
            trustLine="Family-owned · A+ BBB · Licensed"
          />
        </div>

        {/* Calendar mounts hidden shortly AFTER step 1 paints, so finishing
            step 3 reveals it instantly without slowing the first screen. */}
        {(mountCalendly || showCalendly) && (
          <div
            className={
              showCalendly
                ? "mx-auto w-full max-w-xl md:max-w-3xl px-4 sm:px-6 md:px-8"
                : "pointer-events-none absolute inset-0 -z-10 w-full overflow-hidden p-4 opacity-0"
            }
            aria-hidden={!showCalendly}
          >
            <div className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6 md:p-8">
              <CalendlyEmbed
                url={calendlyUrl}
                prefill={{
                  name: quizData?.name || "",
                  email: quizData?.email || "",
                }}
                onBack={handleCalendlyBack}
                onScheduled={handleCalendlyScheduled}
                title="Pick a time for your free estimate"
                subtitle={
                  "We come to your house, measure, and give you a straight price. No pressure.\nVisit takes about 30–45 minutes. Next you’ll enter your name and phone."
                }
                compact={true}
                progressLabel="Three easy steps · 2 of 3"
                detailsProgressLabel="Three easy steps · 3 of 3"
                fireBookingEvents={true}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
