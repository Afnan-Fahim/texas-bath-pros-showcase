import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAttribution, trackLeadEvent, trackScheduleEvent } from "@/lib/tracking";

const CALENDLY_URL = "https://calendly.com/rugsafari/texas-bath-solutions";

export type Prefill = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  project?: string;
  notes?: string;
  offer?: string;
};

export function CalendlyEmbed({
  url = "https://calendly.com/rugsafari/texas-bath-solutions",
  prefill,
  onBack,
  onScheduled,
  title,
  subtitle,
  mobileSubtitle,
  compact = false,
}: {
  url?: string;
  prefill: Prefill;
  onBack: () => void;
  onScheduled: (eventUri: string) => void;
  title?: string;
  subtitle?: string;
  mobileSubtitle?: string;
  compact?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const mobileScrollTargetRef = useRef<HTMLDivElement>(null);
  const [mobileDetailsSelected, setMobileDetailsSelected] = useState(false);
  useEffect(() => {
    const id = "calendly-widget-script";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      document.body.appendChild(s);
    }
    const mobileAlignmentTimers: number[] = [];
    let calendlyFrame: HTMLIFrameElement | null = null;
    let detailsAlignmentStarted = false;
    const alignMobileDetails = () => {
      if (typeof window === "undefined" || window.innerWidth >= 640 || !compact) return;

      setMobileDetailsSelected(true);
      calendlyFrame = hostRef.current?.querySelector("iframe") ?? null;
      if (calendlyFrame) {
        // Calendly is cross-origin, so its inner document cannot be scrolled.
        // Give the complete invitee form enough room in the page instead of
        // translating/cropping it. The initial page scroll reveals the fields,
        // then normal page scrolling remains free in both directions.
        calendlyFrame.style.height = "1400px";
        calendlyFrame.style.minHeight = "1400px";
        calendlyFrame.style.transform = "none";
      }
      mobileScrollTargetRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    };
    const onMessage = (e: MessageEvent) => {
      if (typeof e.origin !== "string" || !e.origin.includes("calendly.com")) return;
      if (e.data?.event === "calendly.date_and_time_selected") {
        if (typeof window !== "undefined" && window.innerWidth < 640 && compact) {
          if (detailsAlignmentStarted) return;
          detailsAlignmentStarted = true;
          calendlyFrame = hostRef.current?.querySelector("iframe") ?? null;
          // Expand the already-mounted widget immediately, before Calendly's
          // details view paints, so its internal transition never exposes a
          // clipped or empty card.
          setMobileDetailsSelected(true);
          if (calendlyFrame) {
            calendlyFrame.style.height = "1400px";
            calendlyFrame.style.minHeight = "1400px";
            calendlyFrame.style.transform = "none";
          }
          // Keep the current calendar viewport stable while Calendly swaps in
          // its already-preloaded details form. Then align twice and stop, so
          // the visitor retains unrestricted page scrolling afterward.
          [650, 1250].forEach((delay) => {
            mobileAlignmentTimers.push(window.setTimeout(alignMobileDetails, delay));
          });
        } else {
          rootRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      }
      if (e.data?.event === "calendly.event_scheduled") {
        const identity = {
          email: prefill.email,
          phone: prefill.phone,
          name: prefill.name,
        };
        trackScheduleEvent(identity);
        trackLeadEvent(`calendly:${prefill.email}:${prefill.phone}`, identity);
        if (e.data?.payload?.event?.uri) {
          onScheduled(e.data.payload.event.uri);
        } else {
          onScheduled("");
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      mobileAlignmentTimers.forEach((timer) => window.clearTimeout(timer));
      if (calendlyFrame) calendlyFrame.onload = null;
    };
  }, [compact, onScheduled]);

  const details = [
    prefill.offer ? `Offer claimed: ${prefill.offer}` : "",
    prefill.project ? `Desired timeframe: ${prefill.project}` : "",
    prefill.address ? `Address: ${prefill.address}` : "",
    prefill.phone ? `Phone: ${prefill.phone}` : "",
    prefill.notes ? `Notes: ${prefill.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const attribution = getAttribution();
  const params = new URLSearchParams({
    hide_gdpr_banner: "1",
    // Hides the big profile/logo side panel so the form fills the frame.
    hide_event_type_details: "1",
    // Removes the top logo/title block and trims empty padding above the form.
    hide_landing_page_details: "1",
    primary_color: "0D3B66",
    ...(prefill.name ? { name: prefill.name } : {}),
    ...(prefill.email ? { email: prefill.email } : {}),
    // Calendly invitee question prefills (a1 = first question, a2 = second, ...)
    // Only send when we have a real value — an empty a1 makes Calendly shift
    // a2 into the phone field.
    ...(prefill.phone ? { a1: prefill.phone, location: prefill.phone } : {}),
    ...(prefill.phone && details ? { a2: details } : {}),
    utm_campaign: attribution.utm_campaign ?? prefill.offer ?? "Website Estimate",
    utm_source: attribution.utm_source ?? "texasbathsolutions.com",
    utm_medium: attribution.utm_medium ?? (prefill.offer ? "offer-claim" : "main-form"),
    ...(attribution.utm_content ? { utm_content: attribution.utm_content } : {}),
    ...(attribution.utm_term ? { utm_term: attribution.utm_term } : {}),
  });

  const finalUrl = `${url}?${params.toString()}`;

  // The frame exists as soon as Calendly injects it — reveal it right away
  // instead of waiting for a full load event.
  const [calendarReady, setCalendarReady] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let observer: MutationObserver | undefined;
    const fallbackTimer = setTimeout(() => !cancelled && setShowFallback(true), 1000);
    const tryInit = () => {
      if (cancelled) return;
      const host = hostRef.current;
      const C = (window as unknown as { Calendly?: { initInlineWidget: (o: Record<string, unknown>) => void } })
        .Calendly;
      if (host && C) {
        host.innerHTML = "";
        C.initInlineWidget({ url: finalUrl, parentElement: host });
        const reveal = () => {
          if (cancelled) return;
          setCalendarReady(true);
          setShowFallback(false);
          clearTimeout(fallbackTimer);
        };
        if (host.querySelector("iframe")) {
          reveal();
        } else {
          observer = new MutationObserver(() => {
            if (host.querySelector("iframe")) {
              observer?.disconnect();
              reveal();
            }
          });
          observer.observe(host, { childList: true, subtree: true });
        }
      } else {
        setTimeout(tryInit, 30);
      }
    };
    tryInit();
    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
      observer?.disconnect();
    };
  }, [url]);


  return (
    <div ref={rootRef}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className={cn("font-display font-semibold text-navy", compact ? "text-lg sm:text-xl" : "text-xl")}>
            {title ?? (prefill.name ? `Almost done, ${prefill.name.split(" ")[0]} — pick your time` : "Pick a time for your free estimate")}
          </h3>
          <p className={cn("mt-1 text-sm text-muted-foreground", mobileSubtitle && "hidden sm:block")}>
            {subtitle ?? "Choose any open slot."}
          </p>
          {mobileSubtitle && (
            <p className="mt-1 text-sm font-medium text-navy sm:hidden">
              {mobileSubtitle}
            </p>
          )}
        </div>
        <Button type="button" variant="outline" className="shrink-0 border-navy/25 text-navy" onClick={onBack}>
          Back
        </Button>
      </div>

      {!calendarReady && showFallback && (
        <a
          href={finalUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-navy px-6 py-3 text-base font-semibold text-primary-foreground"
        >
          Open calendar
        </a>
      )}

      <div
        className={cn(
          "relative mt-4 overflow-hidden rounded-2xl border border-border bg-card",
          mobileDetailsSelected && "max-sm:h-auto max-sm:overflow-visible max-sm:pt-4"
        )}
        style={
          mobileDetailsSelected
            ? { paddingBottom: "calc(8rem + env(safe-area-inset-bottom, 0px))" }
            : undefined
        }
      >
        {/* Compact frame: never taller than the viewport, so the form fields
            are visible without scrolling inside a huge empty iframe. On mobile
            after a time is picked, let the frame keep its full height and the
            page scroll, so the Schedule Event button is never clipped. */}
        <div
          ref={hostRef}
          style={{
            minWidth: "300px",
            height: mobileDetailsSelected
              ? "1400px"
              : compact
                ? "clamp(360px, 50dvh, 460px)"
                : "clamp(460px, calc(100dvh - 260px), 600px)",
          }}
        />
        {/* Mobile-only scroll target: after a time is selected we center this
            marker so the Name/Email/Phone fields land near the middle of the
            phone screen while our headline stays visible above. */}
        <div
          ref={mobileScrollTargetRef}
          className="pointer-events-none absolute left-0 right-0 h-px"
          style={{ top: "44%" }}
          aria-hidden="true"
        />
      </div>


      <noscript>
        <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
          Book your Free estimate
        </a>
      </noscript>
    </div>
  );
}
