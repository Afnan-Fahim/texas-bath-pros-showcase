import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import {
  Phone,
  Menu,
  X,
  Star,
  ShieldCheck,
  Award,
  Home,
  Sparkles,
  Clock,
  Droplets,
  CalendarDays,
  MapPin,
  Check,
  ChevronRight,
  ChevronLeft,
  Waves,
  CreditCard,
  ClipboardCheck,
  Ruler,
  ShowerHead,
  Mail,
} from "lucide-react";
import logoImg from "@/assets/logo-header.webp";
import logoFooterImg from "@/assets/logo-footer.webp";
import aboutBgAsset from "@/assets/about-bg.jpg.asset.json";

import heroPoster from "@/assets/hero-video-poster.avif";
import inspirationGlacier from "@/assets/inspiration/grok-image-9cfd268e-f2e2-4178-95e4-5919f5cb5ab1-2.jpg.asset.json";
import inspirationTravertine from "@/assets/inspiration/788641034_122106367562588540_4141436483953783347_n-2.jpg.asset.json";
import inspirationMarble from "@/assets/inspiration/787726868_122106369626588540_9222586880756702135_n-2.jpg.asset.json";
import inspirationGray from "@/assets/inspiration/798047077_122106977966588540_5958046283204508744_n-2.jpg.asset.json";
import inspirationTub from "@/assets/inspiration/802964770_122107069166588540_8048500090487694760_n-2.jpg.asset.json";
import inspirationVersailles from "@/assets/inspiration/grok-image-b484baec-a7f9-4504-bcc2-1d7229047ab0_1-2.jpg.asset.json";
import inspirationHorizon from "@/assets/inspiration/grok-image-8e98888b-4785-4e9b-a498-bc6bea0d7a1f-2.jpg.asset.json";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LazyCalendar } from "@/components/LazyCalendar";
import { submitLead, scheduleLead } from "@/lib/leads.functions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { LegalTerms } from "@/components/LegalTerms";
import type { QuizState } from "@/components/quiz/QuizFlow";
import { useQuizConfig, DEFAULT_CALENDLY_URL } from "@/lib/quiz-content";
import { LazyMount } from "@/components/LazyMount";
import { OptimizedImage } from "@/components/OptimizedImage";

import heroShower from "@/assets/hero-shower.avif";
import offerTeachers from "@/assets/offer-teachers-first-responders.avif";
import offerMilitary from "@/assets/offer-military-veterans.avif";
import offerSeniors from "@/assets/offer-seniors.avif";
import offerSummer from "@/assets/offer-summer-sale.avif";

import {
  captureAttribution,
  getAttribution,
  attributionNote,
  trackLeadEvent,
  trackScheduleEvent,
  trackContactEvent,
  usePixelInitCheck,
  type LeadIdentity,
} from "@/lib/tracking";
export { captureAttribution, attributionNote, trackLeadEvent, getAttribution };
export type { LeadIdentity };


function LeadEventTracker({
  dedupeKey = "default",
  identity,
}: {
  dedupeKey?: string;
  identity?: LeadIdentity;
}) {
  useEffect(() => {
    trackLeadEvent(dedupeKey, identity ?? {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dedupeKey]);
  return null;
}


function trackViewContent(contentName: string) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  if (w.fbq) {
    w.fbq("track", "ViewContent", {
      content_name: contentName,
      content_category: "Bathroom Remodel",
    });
  }
}

function useViewContentTracking(contentName: string) {
  const ref = useRef<HTMLElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || tracked.current) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true;
          trackViewContent(contentName);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [contentName]);

  return ref;
}



const SITE_URL = "https://texasbathsolutions.com";

/** Social crawlers require absolute URLs; bundled asset paths are root-relative. */
function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Texas Bath Solutions | San Antonio Shower & Bathroom Remodeling" },
      {
        name: "description",
        content:
          "San Antonio's Trusted Shower Experts. Acrylic and Onyx shower remodels from $8,477, installed in days. Free estimates, $0 down financing, A+ BBB rated.",
      },
      { property: "og:title", content: "Texas Bath Solutions | San Antonio Shower Remodeling" },
      {
        property: "og:description",
        content:
          "Acrylic & Onyx shower remodels from $8,477. Family-owned, licensed installers, A+ BBB rated. Book your free San Antonio estimate.",
      },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: absoluteUrl(heroShower) },
      { property: "og:image:alt", content: "Completed acrylic shower remodel by Texas Bath Solutions" },
      { name: "twitter:image", content: absoluteUrl(heroShower) },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
      { rel: "preload", as: "image", href: logoImg, fetchPriority: "high" },
      { rel: "preload", as: "image", href: heroPoster, fetchPriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Texas Bath Solutions",
          description:
            "Family-owned San Antonio bathroom remodeler specializing in acrylic and Onyx shower systems and tub-to-shower conversions. Trusted Shower Experts.",
          
          areaServed: "San Antonio, TX",
          address: { "@type": "PostalAddress", addressLocality: "San Antonio", addressRegion: "TX", addressCountry: "US" },
          url: "https://www.texasbathsolutions.com",
        }),
      },
    ],
  }),
  component: Index,
});

/* Phone is stored encoded so it never appears in the raw HTML/JS source as a
   harvestable string; it is decoded in the browser after hydration. */
const PHONE_B64 = "KDIxMCkgNzAyLTA3NTM=";

function decodePhone() {
  if (typeof window === "undefined") return null;
  try {
    const display = window.atob(PHONE_B64);
    return { display, tel: `tel:+1${display.replace(/\D/g, "")}` };
  } catch {
    return null;
  }
}

function usePhone() {
  const [phone, setPhone] = useState<{ display: string; tel: string } | null>(null);
  useEffect(() => {
    setPhone(decodePhone());
  }, []);
  return phone;
}

/** Renders the phone link with identical styling; number injected client-side. */
function PhoneLink({
  className,
  children,
}: {
  className?: string;
  children: (display: string) => React.ReactNode;
}) {
  const phone = usePhone();
  return (
    <a
      href={phone?.tel}
      className={className}
      aria-label="Call Texas Bath Solutions"
      onClick={(e) => {
        trackContactEvent();
        if (!phone) {
          e.preventDefault();
          const p = decodePhone();
          if (p) window.location.href = p.tel;
        }
      }}
    >
      {children(phone?.display ?? "")}
    </a>
  );
}

/* ---------------- LOGO ---------------- */
function Logo({
  className,
  size = "default",
  dark,
  variant = "header",
}: {
  className?: string;
  size?: "default" | "sm";
  dark?: boolean;
  variant?: "header" | "footer";
}) {
  const isFooter = variant === "footer";
  return (
    <a href="#top" className={cn("flex flex-row items-center gap-3 group", className)}>
      <img
        src={isFooter ? logoFooterImg : logoImg}
        alt="Texas Bath Solutions"
        width={isFooter ? 1400 : 900}
        height={isFooter ? 524 : 669}
        fetchPriority={isFooter ? "low" : "high"}
        decoding="async"
        loading={isFooter ? "lazy" : "eager"}
        className={cn(
          "w-auto object-contain",
          isFooter ? "h-40 md:h-48" : size === "sm" ? "h-30 md:h-36" : "h-60 md:h-72",
        )}
      />

      {!isFooter && (
      <div className="hidden sm:flex flex-col leading-tight">

        <span
          className={cn(
            "text-[0.78rem] md:text-[0.8775rem] font-medium tracking-wide whitespace-nowrap",
            dark ? "text-white/70" : "text-navy/70",
          )}
        >
          San Antonio, TX
        </span>
      </div>
      )}
    </a>
  );
}

/* ---------------- NAVBAR ---------------- */
function Navbar({ onBook, onContact, forceHidden = false }: { onBook: () => void; onContact: () => void; forceHidden?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const anchorY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y < 20) {
        setHidden(false);
        anchorY.current = y;
      } else if (!hidden) {
        anchorY.current = Math.min(anchorY.current, y);
        if (y - anchorY.current > 5) {
          setHidden(true);
          anchorY.current = y;
        }
      } else {
        anchorY.current = Math.max(anchorY.current, y);
        if (anchorY.current - y > 50) {
          setHidden(false);
          anchorY.current = y;
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hidden]);

  useEffect(() => {
    if (forceHidden) setOpen(false);
  }, [forceHidden]);

  const isHidden = (forceHidden || hidden) && !open;

  const links = [
    { href: "#work", label: "Inspiration" },
    { href: "#offers", label: "Offers" },
    { href: "#why", label: "Why Us" },
    { href: "#process", label: "The Process" },
    { href: "#book", label: "Book Estimate" },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out will-change-transform",
        isHidden ? "-translate-y-full pointer-events-none" : "translate-y-0",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-background/60 backdrop-blur-sm",
      )}
    >
      <div className="container-x flex h-40 items-center gap-4 md:h-48">
        <Logo size="sm" />
        <nav className="ml-auto hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-foreground/80 hover:text-navy transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto lg:ml-6 flex items-center gap-2 md:gap-3">
          <PhoneLink className="hidden md:flex items-center gap-2 text-navy font-semibold hover:text-teal transition-colors">
            {(display) => (
              <>
                <Phone className="h-4 w-4" />
                <span className="text-sm md:text-base">{display}</span>
              </>
            )}
          </PhoneLink>
          <div className="flex flex-col items-stretch gap-1.5">
            <Button
              onClick={onBook}
              size="default"
              className="h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm bg-navy text-navy-foreground hover:bg-navy/90 shadow-sm"
            >
              Book Free Estimate
            </Button>
            <Button
              onClick={onContact}
              size="default"
              variant="outline"
              className="h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm border-navy/25 text-navy hover:bg-navy/5 hover:text-navy"
            >
              Contact Us
            </Button>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden grid h-10 w-10 place-items-center rounded-md border border-border"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-x py-4 flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium hover:bg-secondary"
              >
                {l.label}
              </a>
            ))}
            <PhoneLink className="mt-2 flex items-center justify-center gap-2 rounded-md bg-secondary px-3 py-3 font-semibold text-navy">
              {(display) => (
                <>
                  <Phone className="h-4 w-4" /> {display}
                </>
              )}
            </PhoneLink>
            <Button
              onClick={() => {
                setOpen(false);
                onBook();
              }}
              className="mt-2 bg-navy text-navy-foreground hover:bg-navy/90"
            >
              Book Free Estimate
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                onContact();
              }}
              variant="outline"
              className="border-navy/25 text-navy hover:bg-navy/5 hover:text-navy"
            >
              Contact Us
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}


/* ---------------- HERO ---------------- */
function Hero({ onBook }: { onBook: () => void }) {
  return (
    <section id="top" className="relative pt-52 md:pt-60 pb-12 md:pb-16 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_color-mix(in_oklab,var(--teal)_18%,transparent)_0%,transparent_60%)]" />
      <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
            <Award className="h-3.5 w-3.5" /> A+ BBB • Zero Complaints
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-navy text-balance leading-[1.05]">
            San Antonio's Trusted Bathroom Remodel Experts
          </h1>
          <p className="mt-5 text-lg md:text-xl text-muted-foreground text-balance max-w-xl">
            Beautiful showers. Fast, clean installs.
          </p>
          <p className="mt-3 text-sm md:text-base font-medium text-foreground/80">
            Family-Owned <span className="text-muted-foreground">•</span> Professional Licensed Installers{" "}
            <span className="text-muted-foreground">•</span> A+ BBB Rated — Zero Complaints
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={onBook}
              className="bg-navy text-navy-foreground hover:bg-navy/90 shadow-elegant text-base h-12 px-6"
            >
              Book Your Hassle-Free Estimate
            </Button>
            <a href="#work">
              <Button
                size="lg"
                variant="outline"
                className="border-navy/25 text-navy hover:bg-navy/5 text-base h-12 px-6"
              >
                Browse Inspiration
              </Button>
            </a>
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-teal/30 bg-teal/5 p-4 max-w-xl">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-teal/15 text-navy">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-navy">$0 Down Financing Available</div>
              <p className="mt-0.5 text-foreground/75">
                Hassle-free <span className="font-semibold text-navy">soft credit check</span> — won't affect your score.
                Qualify for <span className="font-semibold text-navy">up to 12 months no interest</span>, &amp; payments as
                low as <span className="font-semibold text-navy">$115 a month</span>.
              </p>

            </div>
          </div>
        </div>
        <div className="relative animate-fade-up">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-teal/25 via-transparent to-navy/20 blur-2xl" />
          <HeroVideo />
          <div className="mt-4 mx-auto w-fit max-w-full flex md:mt-0 md:mx-0 md:w-auto md:absolute md:-bottom-6 md:-left-6 items-center gap-2.5 md:gap-3 rounded-xl bg-card px-3 py-2.5 md:px-4 md:py-3 shadow-card ring-1 ring-border">
            <svg className="h-6 w-6 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
              <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
              <path fill="#FBBC05" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
              <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
            </svg>
            <div className="text-sm">
              <div className="font-semibold text-navy">Loved by San Antonio homeowners</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5" style={{ fill: "#FBBC04", color: "#FBBC04" }} />
                  ))}
                </span>
                <span>Rated 5 Stars on Google</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ---------------- HERO VIDEO (auto-play) ---------------- */
function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const playsRef = useRef(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    playsRef.current = 0;
    setFinished(false);
    setUserPaused(false);
    hasStartedRef.current = false;
    v.muted = false;
    v.defaultMuted = false;
    v.volume = 1;
    setMuted(false);
    v.pause();
    v.currentTime = 0;
  }, []);

  // First pass: start with sound only when the video is in view. Scroll and
  // touch listeners retry the same unmuted play request on every device.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const playFirstPass = () => {
      const rect = v.getBoundingClientRect();
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      const inView = visibleHeight > Math.min(rect.height * 0.25, 120);
      if (!inView || hasStartedRef.current || playsRef.current > 0 || userPaused) return;
      v.muted = false;
      v.defaultMuted = false;
      v.volume = 1;
      void v.play().then(() => {
        hasStartedRef.current = true;
        setMuted(false);
      }).catch(() => {
        // Never substitute a muted first pass. Retry on the visitor's next
        // scroll/touch/click while this section remains visible.
        hasStartedRef.current = false;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) playFirstPass();
      },
      { threshold: 0.25 },
    );
    observer.observe(v);

    window.addEventListener("scroll", playFirstPass, { passive: true });
    window.addEventListener("wheel", playFirstPass, { passive: true });
    window.addEventListener("touchmove", playFirstPass, { passive: true });
    window.addEventListener("touchend", playFirstPass, { passive: true });
    window.addEventListener("pointerdown", playFirstPass);
    window.addEventListener("pointerup", playFirstPass);
    window.addEventListener("keydown", playFirstPass);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", playFirstPass);
      window.removeEventListener("wheel", playFirstPass);
      window.removeEventListener("touchmove", playFirstPass);
      window.removeEventListener("touchend", playFirstPass);
      window.removeEventListener("pointerdown", playFirstPass);
      window.removeEventListener("pointerup", playFirstPass);
      window.removeEventListener("keydown", playFirstPass);
    };
  }, [userPaused]);

  const handleEnded = () => {
    const v = videoRef.current;
    if (!v) return;
    playsRef.current += 1;
    if (playsRef.current === 1) {
      // Replay exactly once, muted.
      v.muted = true;
      setMuted(true);
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      // Second pass done — hold on the final frame.
      v.pause();
      if (Number.isFinite(v.duration) && v.duration > 0) {
        v.currentTime = Math.max(0, v.duration - 0.04);
      }
      setFinished(true);
    }
  };

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) v.volume = 1;
    setMuted(v.muted);
  };

  const togglePause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      setUserPaused(false);
      v.play().catch(() => {});
    } else {
      v.pause();
      setUserPaused(true);
    }
  };

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    playsRef.current = 0;
    setFinished(false);
    setUserPaused(false);
    hasStartedRef.current = true;
    v.muted = false;
    v.volume = 1;
    setMuted(false);
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  return (
    <div
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-navy shadow-elegant ring-1 ring-black/5"
    >
      <video
        ref={videoRef}
        className="block h-auto w-full"
        poster={heroPoster}
        width={720}
        height={1280}
        playsInline
        disablePictureInPicture
        /* The poster is the first paint; the video bytes are only fetched
           once playback is requested (in-view or user interaction). */
        preload="none"
        onEnded={handleEnded}
        aria-label="Texas Bath Solutions shower remodel walkthrough video"
      >
        <source src="/texas-bath-solutions-hero.webm" type="video/webm" />
        <source src="/texas-bath-solutions-hero.mp4" type="video/mp4" />
      </video>


      <button
        type="button"
        onClick={toggleSound}
        className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-black/75"
        aria-label={muted ? "Unmute video" : "Mute video"}
      >
        {muted ? "🔇 Muted" : "🔊 Sound on"}
      </button>

      <button
        type="button"
        onClick={togglePause}
        className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/75"
        aria-label={userPaused ? "Play video" : "Pause video"}
      >
        {userPaused ? (
          <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        )}
      </button>

      {finished && (
        <button
          type="button"
          onClick={replay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30"
          aria-label="Play video again"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-elegant">
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-navy" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}

/* ---------------- TRUST BAR ---------------- */
function TrustBar() {
  const items = [
    { icon: Award, label: "A+ BBB Rating", sub: "Zero Complaints" },
    { icon: Home, label: "Family Owned", sub: "San Antonio, TX" },
    { icon: Clock, label: "Hassle-Free", sub: "Estimates" },
    { icon: Droplets, label: "Acrylic & Onyx", sub: "Fast & Leak-Proof" },
    { icon: MapPin, label: "Local Service", sub: "San Antonio Area" },
  ];
  return (
    <section className="bg-navy">
      <div className="container-x py-6 md:py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/15 text-white">
              <it.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{it.label}</div>
              <div className="text-xs text-white/80 truncate">{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FINANCING BANNER ---------------- */
function FinancingBanner({ onBook }: { onBook: () => void }) {
  const financingRef = useViewContentTracking("Financing Options");
  const perks = [
    { icon: CreditCard, title: "$0 Down", copy: "Start your remodel with payments as low as $115 a month." },
    { icon: CalendarDays, title: "Up to 12 Months No Interest", copy: "Enjoy your New Bathroom with No Interest for a Full Year." },
    { icon: ShieldCheck, title: "Soft Credit Check", copy: "Prequalify in minutes — won't affect your score." },
  ];

  return (
    <section ref={financingRef} className="py-8 md:py-12">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy to-navy/85 text-navy-foreground shadow-elegant ring-1 ring-white/10">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal/25 blur-3xl" aria-hidden />
          <div className="absolute -left-12 -bottom-16 h-48 w-48 rounded-full bg-teal/15 blur-3xl" aria-hidden />

          <div className="relative p-6 md:p-10">
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal">
                Flexible Financing
              </span>
              <h3 className="mt-3 font-display text-2xl md:text-3xl font-semibold text-navy-foreground text-balance">
                Zero money down. Payments as low as $115 a month.
              </h3>
              <p className="mt-2 text-sm md:text-base text-navy-foreground/75 text-balance">
                Approved homeowners can start their remodel now and pay later — up to 12 months no payments, with no
                upfront cost.
              </p>

            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {perks.map((p) => (
                <div
                  key={p.title}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-teal/20 text-teal">
                    <p.icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="mt-3 font-semibold text-sm text-navy-foreground">{p.title}</div>
                  <p className="mt-1 text-xs leading-relaxed text-navy-foreground/70">{p.copy}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col items-center gap-2">
              <Button
                onClick={onBook}
                size="lg"
                className="bg-white text-navy hover:bg-white/90 font-semibold shadow-sm w-full sm:w-auto px-8"
              >
                See If I Prequalify
              </Button>
              <p className="text-[11px] text-navy-foreground/60">
                Subject to credit approval. Terms may vary by lender.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



/* ---------------- ABOUT ---------------- */
function About() {
  const aboutLabel = (
    <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-navy sm:text-[11px] md:text-xs">
      About Us
    </span>
  );
  const aboutHeadline = "A local San Antonio family, transforming bathrooms our neighbors love.";
  const aboutBody =
    "We're a family business dedicated to beautiful, functional bathrooms. Clean, honest, upfront pricing — done right the first time.";

  return (
    <section className="py-2 md:py-12">
      <div className="container-x">
        {/* Mobile: stacked photo + text card */}
        <div className="md:hidden">
          <div className="overflow-hidden rounded-2xl bg-[#edeae5]">
            <OptimizedImage
              src={aboutBgAsset.url}
              alt="Bathroom with walk-in shower and vanity"
              width={1920}
              height={725}
              className="h-auto w-full object-contain"
            />
          </div>
          <div className="mt-4 rounded-2xl bg-[#f7f4ef] p-5 sm:p-6 shadow-lg">
            {aboutLabel}
            <h2 className="mt-3 text-lg font-semibold leading-snug text-navy text-balance sm:text-xl">
              {aboutHeadline}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-navy/85 text-balance">{aboutBody}</p>
          </div>
        </div>

        {/* Desktop: photo with overlay text card (unchanged) */}
        <div className="hidden md:block relative overflow-hidden rounded-2xl">
          <OptimizedImage
            src={aboutBgAsset.url}
            alt="Bathroom with walk-in shower and vanity"
            width={1920}
            height={725}
            className="h-auto w-full object-cover"
            style={{ aspectRatio: "1920 / 725" }}
          />
          {/* Small cream box on the bottom-left / shower area */}
          <div className="absolute inset-0 flex items-end justify-start p-3 sm:p-5 md:p-8 lg:p-10">
            <div className="max-w-[10.5rem] rounded-xl bg-[#f7f4ef] p-3 shadow-lg sm:max-w-[15rem] sm:p-4 md:max-w-[17rem] md:p-5 lg:max-w-xs">
              {aboutLabel}
              <h2 className="mt-1.5 text-sm font-semibold leading-snug text-navy text-balance sm:text-base md:mt-2 md:text-lg lg:text-xl">
                {aboutHeadline}
              </h2>
              <p className="mt-1.5 text-[11px] leading-relaxed text-navy/85 text-balance sm:text-xs md:mt-2 md:text-sm">
                {aboutBody}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- ABOUT BLOCK (trust icons + about text) ---------------- */
function AboutBlock() {
  return (
    <div>
      <TrustBar />
      <About />
    </div>
  );
}

/* ---------------- INSPIRATION GALLERY ---------------- */
type InspirationImage = {
  src: string;
  alt: string;
};

const INSPIRATION_IMAGES: InspirationImage[] = [
  { src: inspirationGlacier.url, alt: "Glacier Ice walk-in shower inspiration" },
  { src: inspirationTravertine.url, alt: "Bianco Travertine walk-in shower inspiration" },
  { src: inspirationMarble.url, alt: "White marble walk-in shower inspiration" },
  { src: inspirationGray.url, alt: "Gray stone walk-in shower inspiration" },
  { src: inspirationTub.url, alt: "White freestanding bathtub inspiration" },
  { src: inspirationVersailles.url, alt: "Versailles acrylic wall system inspiration" },
  { src: inspirationHorizon.url, alt: "Horizon Beige acrylic wall system inspiration" },
];

function Gallery() {
  const galleryRef = useViewContentTracking("Bathroom Inspiration");
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + INSPIRATION_IMAGES.length) % INSPIRATION_IMAGES.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % INSPIRATION_IMAGES.length);
  };

  return (
    <section ref={galleryRef} id="work" className="scroll-mt-28 bg-secondary/40 py-7 md:scroll-mt-0 md:py-10">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl leading-tight text-navy text-balance md:text-5xl">
            What your bathroom could look like
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground text-balance md:mt-4 md:text-lg">
            Real styles we install. Tap through, then book a free estimate.
          </p>
        </div>

        <div
          className={cn(
            "relative left-1/2 mt-5 h-[min(75vw,48dvh)] w-[calc(100vw-1rem)] max-w-4xl -translate-x-1/2 touch-pan-y overflow-hidden rounded-lg border border-border bg-card shadow-card",
            "md:left-auto md:mx-auto md:mt-6 md:h-[min(58vw,58dvh)] md:max-h-[460px] md:w-full md:translate-x-0",
          )}
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
            const distance = endX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(distance) < 45) return;
            if (distance > 0) showPrevious();
            else showNext();
          }}
        >
          <div
            className="flex h-full transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {INSPIRATION_IMAGES.map((image, index) => (
              <div key={image.src} className="grid h-full w-full shrink-0 place-items-center bg-card">
                <OptimizedImage
                  src={image.src}
                  alt={image.alt}
                  width={index > 4 ? 1368 : 768}
                  height={index > 4 ? 768 : 1152}
                  sizes="(min-width: 1024px) 896px, 100vw"
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={showPrevious}
            aria-label="Previous inspiration photo"
            className="absolute left-2 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border-border bg-background/90 text-navy shadow-card hover:bg-background sm:left-5 sm:h-11 sm:w-11"
          >
            <ChevronLeft className="h-6 w-6 sm:h-5 sm:w-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={showNext}
            aria-label="Next inspiration photo"
            className="absolute right-2 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border-border bg-background/90 text-navy shadow-card hover:bg-background sm:right-5 sm:h-11 sm:w-11"
          >
            <ChevronRight className="h-6 w-6 sm:h-5 sm:w-5" />
          </Button>
        </div>

        <div className="mt-3 flex justify-center gap-2 md:mt-5" aria-label="Choose an inspiration photo">
          {INSPIRATION_IMAGES.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-current={activeIndex === index ? "true" : undefined}
              className={cn(
                "h-3 rounded-full transition-all duration-300 md:h-2.5",
                activeIndex === index ? "w-8 bg-navy md:w-7" : "w-3 bg-navy/25 hover:bg-navy/45 md:w-2.5",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- OFFERS ---------------- */
type Offer = {
  amount: string;
  headline: string;
  sub: string;
  detail: string;
  image: string;
  badge: string;
};

const OFFERS: Offer[] = [
  {
    amount: "$1,000 Off",
    headline: "Teachers & First Responders",
    sub: "Educators, police, fire, EMS & nurses",
    detail:
      "Our biggest thank-you goes to the people who teach and protect San Antonio. Teachers, school staff, police officers, firefighters, EMS, and nurses save $1,000 on a complete shower or bath remodel. Just show your school, department, or hospital ID at your Free Estimate.",
    image: offerTeachers,
    badge: "Most Popular",
  },
  {
    amount: "$1,000 Off",
    headline: "Military & Veterans",
    sub: "Active duty, Guard, Reserve, retirees & Veterans",
    detail:
      "San Antonio is Military City USA. Active duty, Guard, Reserve, retirees, and Veterans receive $1,000 off any complete remodel with a valid military or VA ID — plus priority scheduling around duty hours.",
    image: offerMilitary,
    badge: "Military City USA",
  },
  {
    amount: "$750 Off",
    headline: "Senior Citizens (60+)",
    sub: "Free grab bar & fold-down safety seat upgrade",
    detail:
      "Homeowners 60 and older save $750 on a walk-in shower conversion and receive a complimentary grab bar plus fold-down safety seat upgrade. Low-threshold bases and glass doors make daily bathing safer and easier.",
    image: offerSeniors,
    badge: "Safety Upgrade",
  },
  {
    amount: "$500 Off",
    headline: "Summer Sale",
    sub: "Limited-time savings on any shower remodel",
    detail:
      "Beat the San Antonio heat with a brand-new shower. Save $500 on any complete acrylic or Onyx shower remodel booked during our Summer Sale — light marble walls, rain shower head, and matte black glass barn doors available.",
    image: offerSummer,
    badge: "Limited Time",
  },
];

function Offers() {
  const offersRef = useViewContentTracking("Offers & Discounts");
  const [active, setActive] = useState<Offer | null>(null);
  const [claimed, setClaimed] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });

  const open = (o: Offer) => {
    setActive(o);
    setClaimed(false);
    setScheduling(false);
    setForm({ name: "", phone: "", email: "", address: "" });
  };


  return (
    <section ref={offersRef} id="offers" className="py-12 md:py-16 bg-secondary/40">
      <div className="container-x">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
            Current Savings
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl text-navy text-balance">
            San Antonio, TX Bathroom Remodel Offers &amp; Discounts
          </h2>
          <p className="mt-4 text-muted-foreground">
            We save our best pricing for the people who serve San Antonio every day.
          </p>
          <p className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 rounded-xl border border-navy/15 bg-card px-4 py-3 text-sm font-semibold text-navy shadow-card">
            One offer can be stacked with $0 down financing, up to 12 months no payments &amp; no
            interest, and a hassle-free soft credit check.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {OFFERS.map((o) => (
            <article
              key={o.headline}
              role="button"
              tabIndex={0}
              onClick={() => open(o)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  open(o);
                }
              }}
              aria-label={`Claim ${o.amount} — ${o.headline}`}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-card hover:shadow-elegant transition-shadow flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <OptimizedImage
                  src={o.image}
                  alt={`${o.headline} bathroom remodel discount in San Antonio, TX`}
                  width={1024}
                  height={768}
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 92vw"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <span className="absolute left-3 top-3 rounded-full bg-navy/90 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-navy-foreground">
                  {o.badge}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-3xl font-bold text-navy">{o.amount}</p>
                <h3 className="mt-1 text-lg font-semibold text-navy">{o.headline}</h3>
                <p className="mt-2 text-sm text-muted-foreground flex-1">{o.sub}</p>
                <Button className="mt-5 w-full" onClick={() => open(o)}>
                  Claim Offer
                </Button>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          One discount per household. Cannot be combined with other discounts. Valid on new contracts
          only — mention your offer at your Free Estimate.
        </p>
      </div>

      <Dialog open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent
          className={
            scheduling && !claimed
              ? "sm:max-w-3xl max-h-[92vh] overflow-y-auto"
              : "sm:max-w-md max-h-[90vh] overflow-y-auto"
          }
        >
          {active && !claimed && !scheduling && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-navy">
                  Claim {active.amount} — {active.headline}
                </DialogTitle>
                <DialogDescription>
                  {active.detail} Book your Free Estimate below to lock in this offer.
                </DialogDescription>
              </DialogHeader>
              <form
                className="mt-2 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  void submitLead({
                    data: {
                      name: form.name,
                      phone: form.phone,
                      email: form.email,
                      address: form.address,
                      timeframe: "",
                      notes: `Offer claimed: ${active.amount} — ${active.headline}` + attributionNote(),
                      source: "Offers & Discounts form",
                    },
                  }).catch((err: unknown) => console.error("Lead notification failed", err));
                  setScheduling(true);
                }}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="offer-name">Full name</Label>
                  <Input
                    id="offer-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="offer-phone">Phone</Label>
                  <Input
                    id="offer-phone"
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
                    placeholder="(210) 555-0123"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="offer-email">Email</Label>
                  <Input
                    id="offer-email"
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Your Email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="offer-address">Address</Label>
                  <Input
                    id="offer-address"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="123 Main St, San Antonio"
                    autoComplete="street-address"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Claim My {active.amount} &amp; Book Free Estimate
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Stackable with $0 down financing · Soft credit check only · No payments for up to
                  12 months
                </p>
              </form>
            </>
          )}
          {active && !claimed && scheduling && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>
                  Claim {active.amount} — {active.headline}
                </DialogTitle>
                <DialogDescription>Pick your Free Estimate appointment time.</DialogDescription>
              </DialogHeader>
              <CalendlyEmbed
                url="https://calendly.com/rugsafari/texas-bath-solutions"
                prefill={{ ...form, offer: `${active.amount} — ${active.headline}` }}
                title={`Pick your time to lock in ${active.amount}`}
                subtitle={`Your ${active.headline} discount is attached to this appointment.`}
                onBack={() => setScheduling(false)}
                onScheduled={() => setClaimed(true)}
              />
            </>
          )}
          {active && claimed && (
            <div className="py-4 text-center">
              <LeadEventTracker dedupeKey="offer-claim" />
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy text-navy-foreground">
                <Check className="h-7 w-7" />
              </div>
              <DialogTitle className="mt-4 text-2xl text-navy">
                Your {active.amount} is reserved!
              </DialogTitle>
              <DialogDescription className="mt-2">
                Your Free Estimate is booked and your {active.headline} discount is attached. Watch
                for your confirmation text and email.
              </DialogDescription>
              <div className="mt-5 grid gap-2">
                <Button onClick={() => setActive(null)}>Done</Button>
              </div>
            </div>
          )}

        </DialogContent>
      </Dialog>
    </section>
  );
}

/* ---------------- WHY US ---------------- */
function WhyUs() {
  const whyRef = useViewContentTracking("Why Choose Us");
  const items = [
    {
      icon: Clock,
      title: "Free Estimates",
      body: "No obligation, no pressure. We come to you and give you an honest quote at a time that works for you.",
    },
    {
      icon: Sparkles,
      title: "Premium Acrylic & Onyx Systems",
      body: "Choose classic acrylic or upgrade to Onyx shower systems — subway tile, marble, and stone looks with lifetime durability and easy cleaning.",
    },
    {
      icon: Droplets,
      title: "Fast, Clean Installations",
      body: "Most showers completed in two or three days with careful protection of your home and minimal disruption.",
    },
    {
      icon: Home,
      title: "Local Family-Owned Care",
      body: "We're your neighbors. We treat your home like our own — because our reputation in San Antonio is everything.",
    },
    {
      icon: ShieldCheck,
      title: "A+ BBB, Zero Complaints",
      body: "Fully licensed, insured, and accredited with the Better Business Bureau. Your trust matters.",
    },
  ];
  return (
    <section ref={whyRef} id="why" className="py-12 md:py-16">
      <div className="container-x">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
            Why Texas Bath Solutions
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl text-navy text-balance">
            Everything you'd want from a remodeler — nothing you wouldn't.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <div
              key={it.title}
              className={cn(
                "rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elegant transition-shadow",
                i === 4 && "lg:col-span-1",
              )}
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-navy text-navy-foreground">
                <it.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-navy">{it.title}</h3>
              <p className="mt-2 text-muted-foreground">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PROCESS ---------------- */
function Process() {
  const processRef = useViewContentTracking("Our Process");
  const steps = [
    { n: "1", Icon: ClipboardCheck, title: "Book Your Free Estimate", body: "Call or fill out the form — same day or next day appointments are often available." },
    { n: "2", Icon: Ruler, title: "We Visit, Measure & Design", body: "A friendly, no-obligation home visit with an honest, upfront quote — then we walk you through beautiful acrylic and Onyx tile, marble, and stone options." },
    { n: "3", Icon: ShowerHead, title: "Professional Installation", body: "Fast, clean installation — and we provide Post-Care for Peace of Mind." },
  ];
  return (
    <section ref={processRef} id="process" className="py-5 md:py-8 bg-gradient-to-b from-navy to-navy/95 text-navy-foreground">
      <div className="container-x">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-navy-foreground text-balance">
            Our Process
          </h2>
        </div>
        <ol className="mt-4 grid gap-3 grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="relative flex flex-col items-center text-center rounded-xl bg-white/5 backdrop-blur border border-white/10 p-3 md:p-4"
            >
              <div className="relative">
                <div className="grid h-12 w-12 md:h-14 md:w-14 place-items-center rounded-full bg-white/10 border border-white/20 text-teal">
                  <s.Icon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-white text-navy font-display font-bold text-[10px]">
                  {s.n}
                </span>
              </div>
              <h3 className="mt-2 text-[11px] md:text-sm font-semibold text-navy-foreground text-balance">{s.title}</h3>
              <p className="mt-1 text-[9px] md:text-[11px] leading-snug text-navy-foreground/75">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- BOOKING FORM ---------------- */
function formatPhone(input: string) {
  const digits = input.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

type BookingFields = "name" | "phone" | "email" | "address" | "project";

function validateBookingField(k: BookingFields, v: string): string {
  switch (k) {
    case "name":
      return v.trim().length < 2 ? "Please enter your full name" : "";
    case "phone":
      return v.replace(/\D/g, "").length !== 10
        ? "Enter a 10-digit phone number, e.g. (210) 555-0123"
        : "";
    case "email":
      if (!v.trim()) return "We need your email to send the confirmation";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
        ? ""
        : "That email looks incomplete — check for typos";
    case "address":
      return v.trim().length < 5
        ? "Enter the street address where the work will be done"
        : "";
    case "project":
      return v ? "" : "Choose when you'd like your new bathroom";
  }
}

/* Quiz pulls the backend client — loaded only when the booking block is near
   the viewport, so it never lands in the first-paint bundle. */
const QuizFlow = lazy(() =>
  import("@/components/quiz/QuizFlow").then((m) => ({ default: m.QuizFlow })),
);

function BookingForm({ formRef }: { formRef: React.RefObject<HTMLElement | null> }) {
  const [calendlyCompleted, setCalendlyCompleted] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [quizData, setQuizData] = useState<QuizState | null>(null);
  const { config: quizConfig } = useQuizConfig();
  const [calendlyOverride, setCalendlyUrl] = useState<string>("");
  const calendlyUrl = calendlyOverride || quizConfig.calendlyUrl || DEFAULT_CALENDLY_URL;
  const [eventUri, setEventUri] = useState<string>("");
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    captureAttribution();
  }, []);

  const handleShowCalendly = (data: QuizState, url?: string) => {
    setQuizData(data);
    if (url) setCalendlyUrl(url);
    setShowCalendly(true);
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const centerStage = () => {
      const rect = stage.getBoundingClientRect();
      const targetTop = window.scrollY + rect.top - Math.max(0, (window.innerHeight - rect.height) / 2);
      window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
    };
    requestAnimationFrame(centerStage);
  }, [showCalendly]);

  const handleCalendlyScheduled = (uri: string) => {
    if (uri) setEventUri(uri);
    setCalendlyCompleted(true);
    // Send the confirmed appointment time with the already-saved lead.
    if (uri && quizData) {
      const leadData = {
        name: quizData.name || "Provided in Calendly",
        email: "calendly@provided.com",
        phone: quizData.phone || "See Calendly",
        address: quizData.address || "Provided in Calendly",
        timeframe: quizData.timeline,
        notes:
          [
            `Upgrade: ${quizData.desiredUpgrade}`,
            `Problem: ${quizData.mainProblem}`,
          ].join("\n") + attributionNote(),
        source: "Website quiz form",
      };
      scheduleLead({ data: { leadData, eventUri: uri } }).catch((e) => console.error(e));
    }
  };

  const handleCalendlyBack = () => {
    setShowCalendly(false);
  };

  const handleQuizComplete = async (finalData: QuizState) => {
    // The quiz only asks the photo questions; Calendly collects personal details.
    setQuizData(finalData);
    setShowCalendly(true);
    trackLeadEvent(`quiz:${finalData.desiredUpgrade}:${Date.now()}`, {});
  };

  return (
    <section
      id="book"
      ref={formRef as React.RefObject<HTMLElement>}
      className="bg-gradient-to-b from-background to-secondary/60"
    >
      <div className="container-x grid items-start gap-10 py-16 md:py-20 lg:grid-cols-2 lg:gap-14">
        <div className="lg:sticky lg:top-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold normal-case tracking-wide text-navy">
            Book Your Free Estimate
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl text-navy text-balance">
            Ready to see your new shower? Schedule your Free, no-obligation estimate.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Tell us about your project, then pick the exact time that works for you.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "No pressure. No obligation.",
              "$0 down financing — up to 12 months no payments",
              "Soft credit check only — won't affect your score",
              "Hassle-free estimates for most San Antonio homes",
              "Honest, upfront pricing — no surprises",
              "A+ BBB rated with zero complaints",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3 text-foreground/85">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy text-navy-foreground">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div ref={stageRef} className="w-full">
          <div className="relative mx-auto w-full overflow-hidden rounded-3xl border border-teal/20 bg-card shadow-2xl">
            <div className={showCalendly ? "hidden" : "flex w-full items-center justify-center"}>
              <LazyMount
                placeholderClassName="w-full"
                placeholder={<div className="min-h-[34rem] w-full" />}
              >
                <Suspense fallback={<div className="min-h-[34rem] w-full" />}>
                  <QuizFlow
                    onShowCalendly={handleShowCalendly}
                    onComplete={handleQuizComplete}
                    calendlyCompleted={calendlyCompleted}
                  />
                </Suspense>
              </LazyMount>
            </div>
            {showCalendly && calendlyCompleted && (
              <div className="block min-h-full w-full p-4 md:p-6">
                <div className="py-6 text-center">
                  <h3 className="text-2xl font-display font-semibold text-navy">
                    You're confirmed — thank you!
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    We have your details and your time slot. We'll call to confirm before we head out.
                  </p>
                </div>
              </div>
            )}
            {/* Calendar stays mounted from the start so the switch from step 3 is instant. */}
            <div
              className={
                showCalendly && !calendlyCompleted
                  ? "block min-h-full w-full p-4 md:p-6"
                  : "pointer-events-none absolute inset-0 -z-10 w-full overflow-hidden p-4 opacity-0 md:p-6"
              }
              aria-hidden={!showCalendly || calendlyCompleted}
            >
              <LazyMount placeholder={<div className="h-0 w-full" />}>
                <CalendlyEmbed
                  url={calendlyUrl}
                  prefill={{
                    name: quizData?.name || "",
                    email: quizData?.email || "",
                  }}
                  onBack={handleCalendlyBack}
                  onScheduled={async (eventUri: string) => {
                    handleCalendlyScheduled(eventUri);
                  }}
                  title="Pick a time for your free estimate"
                  subtitle="After you tap a time, scroll is not needed — fill in your name and phone to lock it in."
                />
              </LazyMount>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

import { CalendlyEmbed, type Prefill } from "@/components/CalendlyEmbed";
export { CalendlyEmbed };
export type { Prefill };



function Field({

  label,
  error,
  required,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}


function ConfirmationScreen({
  state,
  onReset,
}: {
  state: {
    name: string;
    phone: string;
    email: string;
    project: string;
    address: string;
  };
  onReset: () => void;
}) {
  useEffect(() => {
    trackLeadEvent(`booking:${state.email}:${state.phone}`, {
      email: state.email,
      phone: state.phone,
      name: state.name,
    });
  }, [state.email, state.phone]);

  return (
    <div
      className="text-center py-4"
      id="booking-success"
      data-lead-success="true"
      role="status"
      aria-live="polite"
      aria-label="Booking confirmed"
    >
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-navy text-navy-foreground">
        <Check className="h-8 w-8" strokeWidth={3} />
      </div>
      <h3 className="mt-5 text-2xl font-display font-semibold text-navy">You're booked, {state.name.split(" ")[0]}!</h3>
      <p className="mt-2 text-muted-foreground max-w-md mx-auto">
        Your appointment is confirmed. A confirmation was sent to{" "}
        <span className="font-semibold text-foreground">{state.email}</span>, and you'll get automatic
        text reminders at <span className="font-semibold text-foreground">{state.phone}</span> before
        your visit.
      </p>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2 text-left max-w-md mx-auto bg-secondary/60 rounded-xl p-5">
        <div>
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">Project</dt>
          <dd className="font-medium text-navy">{state.project}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">Location</dt>
          <dd className="font-medium text-navy">{state.address}</dd>
        </div>
      </dl>
      <ol className="mt-5 grid gap-2 text-left max-w-md mx-auto text-sm text-muted-foreground">
        {[
          "Check your inbox — your confirmation email is on its way.",
          "We'll text you a reminder before your appointment — no need to confirm with us.",
          "A licensed installer arrives, measures, and gives you upfront pricing the same visit.",
        ].map((s, i) => (
          <li key={s} className="flex items-start gap-3">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy text-navy-foreground text-[11px] font-semibold">
              {i + 1}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={onReset} className="bg-navy text-navy-foreground hover:bg-navy/90">
          Book another appointment
        </Button>
      </div>

    </div>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const items = [
    {
      q: "How long does a shower installation take?",
      a: "Most acrylic and Onyx shower installations are completed in 2–3 days. Larger remodels or tub-to-shower conversions with plumbing moves typically take 3–5 days. We protect your floors, clean up daily, and keep your bathroom as usable as possible throughout the project.",
    },
    {
      q: "Do you really offer free, no-pressure estimates?",
      a: "Yes. Your estimate is 100% free and comes with absolutely no pressure to buy. We'll measure your space, walk you through your options, and leave you with a clear written quote you can review on your own time. We respect your home and your decision.",
    },
    {
      q: "What do your acrylic and Onyx shower systems cost?",
      a: "Every bathroom is different, so we provide a free custom quote based on your exact measurements and needs. Many tub-to-shower conversions start around $8,477, and we offer flexible financing so you can enjoy your new bathroom now and pay over time.",
    },
    {
      q: "Are your acrylic and Onyx panels really as durable as tile?",
      a: "Yes — and in many ways they're better. Our premium acrylic and Onyx wall systems are non-porous, leak-resistant, and backed by a solid warranty. They won't crack, stain, or grow mold in grout lines like tile can, and they clean up in minutes with just a wipe.",
    },
    {
      q: "Do you serve all of San Antonio?",
      a: "Yes. We serve San Antonio and the surrounding areas, including Alamo Heights, Stone Oak, Shavano Park, Boerne, Helotes, Fair Oaks Ranch, and beyond. Because we're a local, family-owned company, we can respond quickly and stand behind every installation we complete.",
    },
  ];
  return (
    <section className="cv-auto py-12 md:py-16 bg-secondary/40">
      <div className="container-x max-w-3xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl text-navy text-balance">
            Frequently Asked Questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="mt-8">
          {items.map((it, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-base font-medium text-navy hover:no-underline">
                {it.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="cloth-gray text-neutral-800">
      <div className="container-x pt-4 pb-14 grid gap-10 md:grid-cols-2">
        <div>
          <Logo size="sm" variant="footer" />
          <p className="mt-5 text-neutral-700 text-sm max-w-sm">
            Family-owned bathroom remodeling. Beautiful showers, fast installs, zero hassle.
          </p>
          <p className="mt-3 text-neutral-600 text-sm">
            Proudly serving San Antonio and surrounding areas.
          </p>
          <a
            href="mailto:Contact@TexasBathSolutions.com"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-teal transition-colors"
          >
            <Mail className="h-4 w-4" /> Contact@TexasBathSolutions.com
          </a>
        </div>
        <div className="md:justify-self-end">
          <h4 className="font-semibold text-neutral-900">Trust &amp; Credentials</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="https://www.bbb.org"
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-neutral-900/8 px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-900/15"
            >
              A+ BBB Accredited
            </a>
            <span className="rounded-md bg-neutral-900/8 px-3 py-2 text-xs font-semibold">
              Zero Complaints
            </span>
            <span className="rounded-md bg-neutral-900/8 px-3 py-2 text-xs font-semibold">
              Licensed &amp; Insured
            </span>
          </div>
          <p className="mt-4 text-xs text-neutral-600 max-w-xs">
            Quality acrylic and Onyx shower systems featuring premium finishes and lifetime durability.
          </p>
        </div>
      </div>
      <div className="border-t border-neutral-900/10">
        <div className="container-x py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600">
          <div>© {new Date().getFullYear()} Texas Bath Solutions. All rights reserved.</div>
          <div className="flex items-center gap-3 text-neutral-600">
            <span>Licensed &amp; Insured · San Antonio, Texas</span>
            <span>·</span>
            <a href="/admin" className="hover:text-navy hover:underline transition-colors">Admin Panel</a>
          </div>
        </div>
      </div>
      <LegalTerms />


    </footer>
  );
}

/* ---------------- PAGE ---------------- */
/* ---------------- CONTACT US DIALOG ---------------- */
function ContactUsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [state, setState] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof typeof state>(k: K, v: (typeof state)[K]) => {
    setState((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!state.name.trim()) e.name = "Please enter your name";
    if (state.phone.replace(/\D/g, "").length !== 10) e.phone = "Enter a valid 10-digit phone";
    if (!state.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(state.email)) e.email = "Invalid email";
    if (!state.message.trim()) e.message = "Please enter a message";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    void submitLead({
      data: {
        name: state.name,
        phone: state.phone,
        email: state.email,
        address: "Not provided (Contact Us form)",
        timeframe: "",
        notes: state.message + attributionNote(),
        source: "Contact Us form",
      },
    }).catch((err: unknown) => console.error("Lead notification failed", err));
    setSubmitted(true);
  };

  const reset = () => {
    setState({ name: "", email: "", phone: "", message: "" });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-navy">Contact Us</DialogTitle>
          <DialogDescription>
            Send a message to{" "}
            <a href="mailto:Contact@TexasBathSolutions.com" className="font-semibold text-navy hover:underline">
              Contact@TexasBathSolutions.com
            </a>
            . We typically reply within one business day.
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <div className="py-8 text-center space-y-4" data-lead-success="true">
            <LeadEventTracker
              dedupeKey={`contact:${state.email}:${state.phone}`}
              identity={{ name: state.name, email: state.email, phone: state.phone }}
            />
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy text-navy-foreground">
              <Check className="h-7 w-7" strokeWidth={3} />
            </div>
            <h3 className="text-xl font-semibold text-navy">Message sent</h3>
            <p className="text-muted-foreground">
              Thanks! Our team has your message and will reply within one business day.
            </p>
            <Button onClick={reset} variant="outline" className="border-navy/25 text-navy hover:bg-navy/5">
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4" noValidate>
            <Field label="Full Name" error={errors.name} required>
              <Input
                value={state.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Your Name"
                autoComplete="name"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" error={errors.email} required>
                <Input
                  type="email"
                  value={state.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="Your Email"
                  autoComplete="email"
                />
              </Field>
              <Field label="Phone Number" error={errors.phone} required>
                <Input
                  value={state.phone}
                  onChange={(e) => update("phone", formatPhone(e.target.value))}
                  placeholder="(210) 555-0123"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </Field>
            </div>
            <Field label="Message" error={errors.message} required>
              <Textarea
                value={state.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="How can we help with your bathroom project?"
                rows={4}
              />
            </Field>
            <div className="rounded-lg bg-secondary p-3 text-sm text-muted-foreground">
              Recipient: <span className="font-medium text-foreground">Contact@TexasBathSolutions.com</span>
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full h-12 bg-navy text-navy-foreground hover:bg-navy/90 text-base font-semibold shadow-elegant"
            >
              Send Message
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Index() {
  const formRef = useRef<HTMLElement | null>(null);
  const [quizVisible, setQuizVisible] = useState(false);
  // Hide the site header while the quiz card is on screen.
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setQuizVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // TEMP (QA): logs "[TBS Pixel] ✅ Meta Pixel initialized" once fbq is on window.
  usePixelInitCheck();
  // Capture fbclid / UTM params on landing, before any in-page navigation.
  useEffect(() => {
    captureAttribution();
  }, []);
  const [contactOpen, setContactOpen] = useState(false);
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const scrollToBook = () => {
    const el = document.getElementById("book");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleShowCalendly = (url: string) => {
    setCalendlyUrl(url);
  };

  // Add the telephone to structured data only in the browser, so it is not in
  // the raw HTML source for scrapers (search engines execute JS and still see it).
  useEffect(() => {
    const phone = decodePhone();
    if (!phone) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Texas Bath Solutions",
      telephone: `+1${phone.display.replace(/\D/g, "")}`,
      url: "https://www.texasbathsolutions.com",
    });
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);


  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onBook={scrollToBook} onContact={() => setContactOpen(true)} forceHidden={quizVisible} />
      <main className="pb-[4.5rem] lg:pb-0">
        <Hero onBook={scrollToBook} />
        <AboutBlock />
        <BookingForm formRef={formRef} />
        <Gallery />
        <Offers />
        <WhyUs />
        <Process />
        <FAQ />
        
      </main>
      <FinancingBanner onBook={scrollToBook} />
      <Footer />
      <ContactUsDialog open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  );
}
