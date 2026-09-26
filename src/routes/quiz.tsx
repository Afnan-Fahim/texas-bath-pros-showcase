import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { QuizFlow, QuizState } from "@/components/quiz/QuizFlow";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { captureAttribution, attributionNote } from "@/lib/tracking";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo-footer.webp";

import { useQuizConfig, DEFAULT_CALENDLY_URL, type QuizConfig } from "@/lib/quiz-content";
import { loadQuizConfigWithStepOne } from "@/lib/quiz-preload";
import { scheduleLead, submitLead } from "@/lib/leads.functions";
import { Button } from "@/components/ui/button";

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
      { title: "Got a Bathroom quote? Don’t Overpay: We will Beat it by $1000.+ for same Scope!" },
      {
        name: "description",
        content:
          "Got a Bathroom quote? Don’t Overpay: We will Beat it by $1000.+ for same Scope!",
      },
      {
        property: "og:title",
        content: "Got a Bathroom quote? Don’t Overpay: We will Beat it by $1000.+ for same Scope!",
      },
      {
        property: "twitter:title",
        content: "Got a Bathroom quote? Don’t Overpay: We will Beat it by $1000.+ for same Scope!",
      },
      {
        property: "og:description",
        content: "Got a Bathroom quote? Don’t Overpay: We will Beat it by $1000.+ for same Scope!",
      },
      {
        property: "twitter:description",
        content: "Got a Bathroom quote? Don’t Overpay: We will Beat it by $1000.+ for same Scope!",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://texasbathsolutions.com/quiz" },
      { property: "og:image", content: "https://texasbathsolutions.com/__l5e/assets-v1/84a80dd6-704f-445a-b327-0f381919baa3/quiz-link-preview-sep26.jpg" },
      { name: "twitter:image", content: "https://texasbathsolutions.com/__l5e/assets-v1/84a80dd6-704f-445a-b327-0f381919baa3/quiz-link-preview-sep26.jpg" },
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

type ContactForm = { name: string; email: string; phone: string; address: string; homeowner: string };
const EMPTY_CONTACT: ContactForm = { name: "", email: "", phone: "", address: "", homeowner: "" };

function QuizPage() {
  const stageRef = useRef<HTMLElement>(null);
  const [calendlyCompleted, setCalendlyCompleted] = useState(false);
  // 1 = photo question, 2 = our contact form, 3 = Calendly (time only)
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const showCalendly = stage !== 1;
  const [quizData, setQuizData] = useState<QuizState | null>(null);
  const [contact, setContact] = useState<ContactForm>(EMPTY_CONTACT);
  const [formError, setFormError] = useState("");
  const { quizConfig: initialQuizConfig } = Route.useLoaderData();
  const { config: quizConfig } = useQuizConfig(initialQuizConfig ?? undefined);
  const calendlyUrl = quizConfig.calendlyUrl || DEFAULT_CALENDLY_URL;

  useEffect(() => {
    captureAttribution();
    // PageView is fired once by the base Meta Pixel in the site head
    // (__root.tsx). Do not fire it again here — that would double-count.
    // Warm the Calendly script so step 3 opens fast.
    const t = window.setTimeout(() => {
      const id = "calendly-widget-script";
      if (!document.getElementById(id)) {
        const s = document.createElement("script");
        s.id = id;
        s.src = "https://assets.calendly.com/assets/external/widget.js";
        s.async = true;
        document.body.appendChild(s);
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, []);

  const buildLead = (d: QuizState, c: ContactForm, booked: boolean) => ({
    name: c.name,
    email: c.email,
    phone: c.phone,
    address: c.address,
    timeframe: d.timeline,
    notes:
      [
        `Status: ${booked ? "BOOKED" : "FORM SUBMITTED — NOT BOOKED YET"}`,
        `Homeowner: ${c.homeowner}`,
        `Upgrade: ${d.desiredUpgrade}`,
        `Problem: ${d.mainProblem}`,
        `Page: ${typeof window !== "undefined" ? window.location.href : "/quiz"}`,
      ].join("\n") + attributionNote(),
    source: booked ? "Facebook/Messenger Quiz — Booked" : "Facebook/Messenger Quiz",
  });

  const handleCalendlyScheduled = (uri: string) => {
    setCalendlyCompleted(true);
    if (quizData) {
      scheduleLead({
        data: { leadData: buildLead(quizData, contact, true), eventUri: uri || "" },
      }).catch((e) => console.error(e));
    }
  };

  const handleQuizComplete = async (finalData: QuizState) => {
    setQuizData(finalData);
    setStage(2);
  };

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    const c = {
      name: contact.name.trim(),
      email: contact.email.trim(),
      phone: contact.phone.trim(),
      address: contact.address.trim(),
      homeowner: contact.homeowner,
    };
    if (!c.name || !c.phone || !c.address || !c.homeowner) return setFormError("Please fill in every field.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) return setFormError("Please enter a valid email.");
    if (c.phone.replace(/\D/g, "").length < 10) return setFormError("Please enter a valid phone number.");
    setFormError("");
    setContact(c);
    // Save + email right away — no Meta Lead here (Lead fires only after booking).
    if (quizData) submitLead({ data: buildLead(quizData, c, false) }).catch((err) => console.error(err));
    setStage(3);
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

        {stage === 2 && (
          <div className="mx-auto w-full max-w-xl px-4 sm:px-6">
            <form
              onSubmit={handleContactSubmit}
              noValidate
              className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6"
            >
              <div className="flex justify-end">
                <span className="whitespace-nowrap text-[9px] font-bold text-navy/70 sm:text-[10px]">
                  Three easy steps · 2 of 3
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-semibold text-navy sm:text-xl">How do we reach you?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We’ll call to confirm your free in-home visit. Next screen you pick a time.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/80">
                    We don’t sell your info. It’s only to schedule your visit.
                  </p>
                </div>
                <Button type="button" variant="outline" className="shrink-0 border-navy/25 text-navy" onClick={() => setStage(1)}>
                  Back
                </Button>
              </div>
              <div className="mt-4 grid gap-3">
                {([
                  ["name", "Name", "text", "name"],
                  ["email", "Email", "email", "email"],
                  ["phone", "Phone", "tel", "tel"],
                  ["address", "Address", "text", "street-address"],
                ] as const).map(([key, label, type, ac]) => (
                  <label key={key} className="grid gap-1 text-sm font-medium text-navy">
                    {label}
                    <input
                      type={type}
                      autoComplete={ac}
                      maxLength={key === "address" ? 240 : 160}
                      placeholder={key === "address" ? "Street address, city, ZIP" : undefined}
                      value={contact[key]}
                      onChange={(e) => setContact({ ...contact, [key]: e.target.value })}
                      className="h-11 rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus:border-navy"
                    />
                  </label>
                ))}
                <fieldset className="grid gap-1 text-sm font-medium text-navy">
                  <legend className="mb-1">Are you the homeowner?</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {["Yes", "No"].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setContact({ ...contact, homeowner: v })}
                        className={cn(
                          "h-11 rounded-lg border text-base",
                          contact.homeowner === v ? "border-navy bg-navy text-primary-foreground" : "border-input bg-background text-navy"
                        )}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
              {formError && <p className="mt-3 text-sm text-destructive">{formError}</p>}
              <Button type="submit" className="mt-4 h-12 w-full bg-navy text-base font-semibold text-primary-foreground">
                Continue to pick a time
              </Button>
            </form>
          </div>
        )}

        {stage === 3 && (
          <div className="mx-auto w-full max-w-xl md:max-w-3xl px-4 sm:px-6 md:px-8">
            <div className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6 md:p-8">
              <CalendlyEmbed
                url={calendlyUrl}
                prefill={{
                  name: contact.name,
                  email: contact.email,
                  phone: contact.phone,
                  address: contact.address,
                  notes: `Homeowner: ${contact.homeowner}`,
                }}
                onBack={() => setStage(2)}
                onScheduled={handleCalendlyScheduled}
                title="Pick a time for your free estimate"
                subtitle={"We come to your house, measure, and give you a straight price. No pressure.\nVisit takes about 30–45 minutes."}
                compact={true}
                progressLabel="Three easy steps · 3 of 3"
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
