import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
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
} from "lucide-react";
import logoImg from "@/assets/logo-header.webp";
import logoFooterImg from "@/assets/logo-footer.webp";

import heroVideoAsset from "@/assets/texas-bath-solutions-hero.mp4.asset.json";
import heroPoster from "@/assets/hero-video-poster.webp";

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

import heroShower from "@/assets/hero-shower.webp";
import afterSubway from "@/assets/after-subway.webp";
import afterSubway2 from "@/assets/after-subway-2.webp";
import afterSubway3 from "@/assets/after-subway-3.webp";
import afterMarble from "@/assets/after-marble.webp";
import afterMarble2 from "@/assets/after-marble-2.webp";
import afterModern from "@/assets/after-modern.webp";
import afterVenatino from "@/assets/after-venatino.webp";
import offerTeachers from "@/assets/offer-teachers-first-responders.webp";
import offerMilitary from "@/assets/offer-military-veterans.webp";
import offerSeniors from "@/assets/offer-seniors.webp";
import offerSummer from "@/assets/offer-summer-sale.webp";
import beforeBeige from "@/assets/before-beige.webp";
import beforeFiberglass from "@/assets/before-fiberglass.webp";
import beforePink from "@/assets/before-pink.webp";
import beforeWhiteTile from "@/assets/before-white-tile.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:image", content: heroShower },
      { name: "twitter:image", content: heroShower },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: logoImg, fetchPriority: "high" },
      { rel: "preload", as: "image", href: heroPoster },
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
          telephone: "+1-210-702-0753",
          areaServed: "San Antonio, TX",
          address: { "@type": "PostalAddress", addressLocality: "San Antonio", addressRegion: "TX", addressCountry: "US" },
          url: "https://www.texasbathsolutions.com",
        }),
      },
    ],
  }),
  component: Index,
});

const PHONE_DISPLAY = "(210) 702-0753";
const PHONE_TEL = "tel:+12107020753";

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

      <div className="hidden sm:flex flex-col leading-tight">

        <span
          className={cn(
            "text-[0.78rem] md:text-[0.8775rem] font-medium tracking-wide",
            dark ? "text-white/70" : "text-navy/70",
          )}
        >
          San Antonio, TX
        </span>
      </div>
    </a>
  );
}

/* ---------------- NAVBAR ---------------- */
function Navbar({ onBook }: { onBook: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#work", label: "Our Work" },
    { href: "#offers", label: "Offers" },
    { href: "#why", label: "Why Us" },
    { href: "#process", label: "The Process" },
    { href: "#book", label: "Book Estimate" },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
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
          <a
            href={PHONE_TEL}
            className="hidden md:flex items-center gap-2 text-navy font-semibold hover:text-teal transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span className="text-sm md:text-base">{PHONE_DISPLAY}</span>
          </a>
          <Button
            onClick={onBook}
            className="hidden sm:inline-flex bg-navy text-navy-foreground hover:bg-navy/90 shadow-sm"
          >
            Book Free Estimate
          </Button>
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
            <a
              href={PHONE_TEL}
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-secondary px-3 py-3 font-semibold text-navy"
            >
              <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
            </a>
            <Button
              onClick={() => {
                setOpen(false);
                onBook();
              }}
              className="mt-2 bg-navy text-navy-foreground hover:bg-navy/90"
            >
              Book Free Estimate
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------------- FLOATING MOBILE PHONE CTA ---------------- */
function MobilePhoneCTA() {
  return (
    <a
      href={PHONE_TEL}
      className="lg:hidden fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-navy px-5 py-3.5 text-navy-foreground shadow-elegant"
    >
      <Phone className="h-5 w-5" />
      <span className="font-semibold">Call Now</span>
    </a>
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
            Beautiful showers. Fast, clean installs. Zero hassle.
          </p>
          <p className="mt-3 text-sm md:text-base font-medium text-foreground/80">
            Family-Owned <span className="text-muted-foreground">•</span> Free No Hassle Estimates{" "}
            <span className="text-muted-foreground">•</span> A+ BBB Rated — Zero Complaints
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={onBook}
              className="bg-navy text-navy-foreground hover:bg-navy/90 shadow-elegant text-base h-12 px-6"
            >
              Book Your Free No Hassle Estimate
            </Button>
            <a href="#work">
              <Button
                size="lg"
                variant="outline"
                className="border-navy/25 text-navy hover:bg-navy/5 text-base h-12 px-6"
              >
                See Our Transformations
              </Button>
            </a>
          </div>
          <a
            href={PHONE_TEL}
            className="mt-6 inline-flex items-center gap-2 text-navy font-semibold hover:text-teal"
          >
            <Phone className="h-4 w-4" /> Call now: {PHONE_DISPLAY}
          </a>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-teal/30 bg-teal/5 p-4 max-w-xl">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-teal/15 text-navy">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-navy">$0 Down Financing Available</div>
              <p className="mt-0.5 text-foreground/75">
                Hassle-free <span className="font-semibold text-navy">soft credit check</span> — won't affect your score.
                Qualify for <span className="font-semibold text-navy">up to 12 months no payments &amp; no interest</span>.
              </p>
            </div>
          </div>
        </div>
        <div className="relative animate-fade-up">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-teal/25 via-transparent to-navy/20 blur-2xl" />
          <HeroVideo />
          <div className="absolute -bottom-6 -left-6 hidden md:flex items-center gap-3 rounded-xl bg-card px-4 py-3 shadow-card ring-1 ring-border">
            <div className="flex -space-x-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
            </div>
            <div className="text-sm">
              <div className="font-semibold text-navy">Loved by San Antonio homeowners</div>
              <div className="text-xs text-muted-foreground">100% satisfaction • Zero complaints</div>
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
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Start muted so playback begins instantly (browsers always allow muted autoplay).
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) v.volume = 1;
    setMuted(v.muted);
  };

  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl shadow-elegant ring-1 ring-black/5 bg-navy">
      <video
        ref={videoRef}
        className="block h-auto w-full"
        src={heroVideoAsset.url}
        poster={heroPoster}
        width={720}
        height={1280}
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="metadata"
        aria-label="Texas Bath Solutions shower remodel walkthrough video"
      />

      <button
        type="button"
        onClick={toggleSound}
        className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-black/75"
        aria-label={muted ? "Unmute video" : "Mute video"}
      >
        {muted ? "🔇 Tap for sound" : "🔊 Sound on"}
      </button>
    </div>
  );
}

/* ---------------- BEFORE/AFTER REEL (auto-play) ---------------- */
const REEL_PAIRS = [
  { before: beforeFiberglass, after: afterMarble, label: "Fiberglass → Marble" },
  { before: beforePink, after: afterSubway, label: "Dated Tile → Modern Subway" },
  { before: beforeBeige, after: afterVenatino, label: "Beige Tub → Venatino Walk-In" },
  { before: beforeWhiteTile, after: afterModern, label: "Tired Tile → Modern Spa" },
];

function BeforeAfterReel() {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<"before" | "after">("before");
  useEffect(() => {
    const t = setInterval(() => {
      setPhase((p) => {
        if (p === "before") return "after";
        setI((n) => (n + 1) % REEL_PAIRS.length);
        return "before";
      });
    }, 2400);
    return () => clearInterval(t);
  }, []);
  const pair = REEL_PAIRS[i];
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-elegant ring-1 ring-black/5 aspect-[4/3] bg-navy">
      {REEL_PAIRS.map((p, idx) => (
        <div
          key={idx}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            idx === i ? "opacity-100" : "opacity-0",
          )}
        >
          <img
            src={p.before}
            alt={`${p.label} — before`}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              idx === i && phase === "before" ? "opacity-100" : "opacity-0",
            )}
          />
          <img
            src={p.after}
            alt={`${p.label} — after`}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              idx === i && phase === "after" ? "opacity-100" : "opacity-0",
            )}
          />
        </div>
      ))}
      {/* corner label */}
      <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
        {phase === "before" ? "Before" : "After"}
      </div>
      <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-navy shadow">
        {pair.label}
      </div>
      {/* pricing overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-5 md:p-6 text-white">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-foreground/90 text-white/80">
              Acrylic & Onyx Shower Remodel
            </div>
            <div className="mt-1 font-display text-2xl md:text-3xl font-bold leading-tight">
              Starting at <span className="text-gold">$8,477</span>
            </div>
            <div className="mt-1 text-xs md:text-sm text-white/80">
              Full walk-in conversion • Installed in as little as 1 day
            </div>
          </div>
          <ul className="grid grid-cols-1 gap-1 text-xs md:text-sm text-white/90">
            <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-teal" /> Lifetime warranty</li>
            <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-teal" /> Mold &amp; leak-proof</li>
            <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-teal" /> $0 down financing</li>
          </ul>
        </div>
        {/* progress dots */}
        <div className="mt-4 flex items-center gap-1.5">
          {REEL_PAIRS.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "h-1 rounded-full transition-all",
                idx === i ? "w-8 bg-gold" : "w-3 bg-white/40",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- TRUST BAR ---------------- */
function TrustBar() {
  const items = [
    { icon: Award, label: "A+ BBB Rating", sub: "Zero Complaints" },
    { icon: Home, label: "Family Owned", sub: "San Antonio, TX" },
    { icon: Clock, label: "Free Hassle-Free", sub: "Estimates" },
    { icon: Droplets, label: "Acrylic & Onyx", sub: "Fast & Leak-Proof" },
    { icon: MapPin, label: "Local Service", sub: "San Antonio Area" },
  ];
  return (
    <section className="border-y border-border bg-secondary/60">
      <div className="container-x py-6 md:py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-navy/10 text-navy">
              <it.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-navy truncate">{it.label}</div>
              <div className="text-xs text-muted-foreground truncate">{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FINANCING BANNER ---------------- */
function FinancingBanner({ onBook }: { onBook: () => void }) {
  return (
    <section className="py-8 md:py-10">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy to-navy/90 text-navy-foreground shadow-elegant">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-teal/25 blur-3xl" aria-hidden />
          <div className="absolute -left-10 -bottom-16 h-56 w-56 rounded-full bg-teal/15 blur-3xl" aria-hidden />
          <div className="relative grid gap-6 p-6 md:p-10 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-white/10 text-navy-foreground">
              <CreditCard className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                $0 Down Financing
              </div>
              <h3 className="mt-2 font-display text-2xl md:text-3xl font-semibold text-navy-foreground text-balance">
                Zero money down. Up to 12 months no payments &amp; no interest.
              </h3>
              <p className="mt-2 text-navy-foreground/80 max-w-2xl">
                Prequalify in seconds with a <span className="font-semibold text-white">hassle-free soft credit check</span>{" "}
                — it won't affect your credit score. Get the shower you love now, pay comfortably later.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button
                onClick={onBook}
                size="lg"
                className="bg-white text-navy hover:bg-white/90 h-12 px-6 font-semibold shadow-sm"
              >
                See If I Prequalify
              </Button>
              <a href={PHONE_TEL}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-transparent text-navy-foreground hover:bg-white/10 h-12 px-6"
                >
                  <Phone className="h-4 w-4 mr-2" /> {PHONE_DISPLAY}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ---------------- ABOUT ---------------- */
function About() {
  return (
    <section className="pt-12 pb-8 md:pt-16 md:pb-10">
      <div className="container-x max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
          About Us
        </span>
        <h2 className="mt-4 text-3xl md:text-4xl text-navy text-balance">
          A local San Antonio family, transforming bathrooms our neighbors love.
        </h2>
        <p className="mt-5 text-lg text-muted-foreground text-balance">
          We're a family business dedicated to turning outdated bathrooms into beautiful,
          functional spaces. We believe in honest pricing, hassle-free estimates, and doing the
          job right the first time — no pressure, no surprises, no hassle.
        </p>
      </div>
    </section>
  );
}

/* ---------------- GALLERY ---------------- */
type GalleryItem = {
  id: string;
  category: "subway" | "marble" | "modern";
  after: string;
  before?: string;
  title: string;
  location: string;
};

const GALLERY: GalleryItem[] = [
  {
    id: "1",
    category: "marble",
    before: beforeBeige,
    after: heroShower,
    title: "Tub-to-Shower Conversion",
    location: "Alamo Heights",
  },
  {
    id: "2",
    category: "subway",
    before: beforeFiberglass,
    after: afterSubway,
    title: "Full Shower Update",
    location: "Stone Oak",
  },
  {
    id: "3",
    category: "marble",
    before: beforePink,
    after: afterMarble,
    title: "Master Bath Remodel",
    location: "Terrell Hills",
  },
  {
    id: "4",
    category: "modern",
    before: beforeWhiteTile,
    after: afterModern,
    title: "Guest Bath Refresh",
    location: "Shavano Park",
  },
  {
    id: "5",
    category: "marble",
    after: afterVenatino,
    title: "Walk-In Shower with Bench",
    location: "Helotes",
  },
  {
    id: "7",
    category: "marble",
    after: afterMarble,
    title: "Calcutta Marble Look — Moen Gibson Fixtures",
    location: "The Dominion",
  },
  {
    id: "8",
    category: "modern",
    after: afterModern,
    title: "Spa-Style Walk-In",
    location: "Fair Oaks Ranch",
  },
  {
    id: "9",
    category: "subway",
    after: afterSubway2,
    title: "Bright White Subway Conversion",
    location: "Alamo Ranch",
  },
  {
    id: "10",
    category: "subway",
    after: afterSubway3,
    title: "Vertical Subway with Bench",
    location: "Schertz",
  },
  {
    id: "13",
    category: "marble",
    after: afterMarble2,
    title: "Carrara Marble Master Shower",
    location: "Olmos Park",
  },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "subway", label: "Subway Tile" },
  { id: "marble", label: "Marble & Stone" },
  { id: "modern", label: "Modern Minimal" },
] as const;


function Gallery() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [sliderPos, setSliderPos] = useState(50);

  const items = useMemo(
    () => (filter === "all" ? GALLERY : GALLERY.filter((g) => g.category === filter)),
    [filter],
  );

  const active = activeIdx !== null ? items[activeIdx] : null;

  useEffect(() => {
    setSliderPos(50);
  }, [activeIdx]);

  const next = () =>
    setActiveIdx((i) => (i === null ? 0 : (i + 1) % items.length));
  const prev = () =>
    setActiveIdx((i) => (i === null ? 0 : (i - 1 + items.length) % items.length));

  return (
    <section id="work" className="pt-8 pb-12 md:pt-12 md:pb-16 bg-gradient-to-b from-secondary/40 to-background">
      <div className="container-x">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
            Our Work
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl text-navy text-balance">
            See the Difference — Real San Antonio Bathroom Transformations
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-balance">
            Every project starts with a free hassle-free estimate. Here's what we deliver.
          </p>
        </div>

        <div className="mt-10 mx-auto max-w-3xl">
          <BeforeAfterReel />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors border",
                filter === f.id
                  ? "bg-navy text-navy-foreground border-navy"
                  : "bg-card text-foreground border-border hover:border-navy/40",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIdx(idx)}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-border text-left"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={item.after}
                  alt={`${item.title} — ${item.location}`}
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={1200}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {item.before && (
                  <span className="absolute left-3 top-3 rounded-full bg-navy/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy-foreground">
                    Before & After
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 via-navy/40 to-transparent p-4">
                  <div className="text-navy-foreground">
                    <div className="text-sm font-semibold">{item.title}</div>
                    <div className="text-xs opacity-90">{item.location}</div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          All showers feature durable, leak-resistant premium acrylic or Onyx shower systems — installed quickly and cleanly.
        </p>
      </div>

      <Dialog open={active !== null} onOpenChange={(o) => !o && setActiveIdx(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background">
          {active && (
            <div className="relative">
              {active.before ? (
                <div
                  className="relative aspect-[16/10] select-none"
                  onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    setSliderPos(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
                  }}
                  onTouchMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    const x = e.touches[0].clientX - r.left;
                    setSliderPos(Math.max(0, Math.min(100, (x / r.width) * 100)));
                  }}
                >
                  <img src={active.after} alt="After" className="absolute inset-0 h-full w-full object-cover" />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPos}%` }}
                  >
                    <img
                      src={active.before}
                      alt="Before"
                      className="absolute inset-0 h-full object-cover"
                      style={{ width: `${100 / (sliderPos / 100 || 0.001)}%`, maxWidth: "none" }}
                    />
                  </div>
                  <div
                    className="absolute inset-y-0 w-0.5 bg-white shadow-lg"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white text-navy shadow-lg">
                      <ChevronLeft className="h-4 w-4" />
                    </div>
                  </div>
                  <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">
                    BEFORE
                  </span>
                  <span className="absolute right-4 top-4 rounded-full bg-navy px-3 py-1 text-xs font-bold text-navy-foreground">
                    AFTER
                  </span>
                </div>
              ) : (
                <img src={active.after} alt={active.title} className="w-full h-auto" />
              )}
              <div className="flex items-center justify-between p-5 border-t border-border">
                <div>
                  <div className="font-display text-lg font-semibold text-navy">{active.title}</div>
                  <div className="text-sm text-muted-foreground">{active.location}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={prev}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={next}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {active.before && (
                <p className="px-5 pb-5 text-xs text-muted-foreground">
                  Drag across the image to compare before and after.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
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

function Offers({ onBook }: { onBook: () => void }) {
  const [active, setActive] = useState<Offer | null>(null);
  const [claimed, setClaimed] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", time: "Morning (8am–12pm)" });

  const open = (o: Offer) => {
    setActive(o);
    setClaimed(false);
    setForm({ name: "", phone: "", email: "", date: "", time: "Morning (8am–12pm)" });
  };

  return (
    <section id="offers" className="py-12 md:py-16 bg-secondary/40">
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
                <img
                  src={o.image}
                  alt={`${o.headline} bathroom remodel discount in San Antonio, TX`}
                  loading="lazy"
                  decoding="async"
                  width={1024}
                  height={768}
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
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          {active && !claimed && (
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
                  setClaimed(true);
                }}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="offer-name">Full name</Label>
                  <Input
                    id="offer-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
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
                    placeholder="you@email.com"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="offer-date">Preferred date</Label>
                    <Input
                      id="offer-date"
                      required
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="offer-time">Preferred time</Label>
                    <select
                      id="offer-time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option>Morning (8am–12pm)</option>
                      <option>Afternoon (12pm–4pm)</option>
                      <option>Evening (4pm–7pm)</option>
                    </select>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Claim My {active.amount} &amp; Book Free Estimate
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Stackable with $0 down financing · Soft credit check only · No payments &amp; no
                  interest for up to 12 months
                </p>
              </form>
            </>
          )}
          {active && claimed && (
            <div className="py-4 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy text-navy-foreground">
                <Check className="h-7 w-7" />
              </div>
              <DialogTitle className="mt-4 text-2xl text-navy">
                Your {active.amount} is reserved!
              </DialogTitle>
              <DialogDescription className="mt-2">
                We'll confirm your Free Estimate appointment shortly. Want it faster? Call us at{" "}
                {PHONE_DISPLAY}.
              </DialogDescription>
              <div className="mt-5 grid gap-2">
                <Button
                  onClick={() => {
                    setActive(null);
                    onBook();
                  }}
                >
                  Pick My Estimate Time
                </Button>
                <Button variant="outline" asChild>
                  <a href={PHONE_TEL}>Call {PHONE_DISPLAY}</a>
                </Button>
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
  const items = [
    {
      icon: Clock,
      title: "Free Hassle-Free Estimates",
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
      body: "Most showers completed in a single day with careful protection of your home and minimal disruption.",
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
    <section id="why" className="cv-auto py-12 md:py-16">
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
  const steps = [
    { n: "1", title: "Book Your Free Estimate", body: "Call or fill out the form — hassle-free appointments often available." },
    { n: "2", title: "We Visit, Measure & Design", body: "A friendly, no-obligation home visit with an honest, upfront quote — then we walk you through beautiful acrylic and Onyx tile, marble, and stone options." },
    { n: "3", title: "Professional Installation", body: "Fast, clean installation — most showers finished in a single day." },
  ];
  return (
    <section id="process" className="cv-auto py-5 md:py-8 bg-gradient-to-b from-navy to-navy/95 text-navy-foreground">
      <div className="container-x">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-navy-foreground/90">
            The Process
          </span>
          <h2 className="mt-2 text-lg md:text-2xl text-navy-foreground text-balance">
            Simple, honest, and hassle-free from day one.
          </h2>
        </div>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-3">
              <div className="grid h-6 w-6 place-items-center rounded-full bg-white text-navy font-display font-bold text-[10px]">
                {s.n}
              </div>
              <h3 className="mt-2 text-sm font-semibold text-navy-foreground">{s.title}</h3>
              <p className="mt-0.5 text-[10px] text-navy-foreground/75">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIALS ---------------- */
function Testimonials() {
  const items = [
    {
      name: "Maria G.",
      area: "Alamo Heights",
      body: "They came out quickly, gave me an honest quote, and my new shower looks straight out of a magazine. Zero hassle from start to finish.",
    },
    {
      name: "David R.",
      area: "Stone Oak",
      body: "Old fiberglass tub gone in a day. The marble-look walls are gorgeous and the crew was respectful of my home. Best remodel decision we've made.",
    },
    {
      name: "Jennifer T.",
      area: "Shavano Park",
      body: "Family-owned really shows. They treated us like neighbors, not customers. Estimate was upfront, no pressure, no surprises.",
    },
    {
      name: "Robert & Linda M.",
      area: "Boerne",
      body: "We got three quotes — Texas Bath Solutions was the most professional and by far the easiest to work with. Beautiful subway-tile shower.",
    },
    {
      name: "Anthony P.",
      area: "Helotes",
      body: "Clean, fast, and stunning results. I've already recommended them to two neighbors. The A+ BBB rating is well-earned.",
    },
  ];
  return (
    <section className="cv-auto py-12 md:py-16">
      <div className="container-x">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
            Reviews
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl text-navy text-balance">
            What our San Antonio neighbors say
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="mt-4 text-foreground/90 leading-relaxed">
                "{t.body}"
              </blockquote>
              <figcaption className="mt-5 text-sm">
                <div className="font-semibold text-navy">{t.name}</div>
                <div className="text-muted-foreground">{t.area}</div>
              </figcaption>
            </figure>
          ))}
        </div>
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

function BookingForm({ formRef }: { formRef: React.RefObject<HTMLElement | null> }) {
  const [state, setState] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    project: "",
    date: undefined as Date | undefined,
    time: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof typeof state>(k: K, v: (typeof state)[K]) =>
    setState((s) => ({ ...s, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!state.name.trim()) e.name = "Please enter your name";
    if (state.phone.replace(/\D/g, "").length !== 10) e.phone = "Enter a valid 10-digit phone";
    if (!state.address.trim()) e.address = "Address or ZIP code required";
    if (!state.project) e.project = "Please select a project type";
    if (!state.date) e.date = "Choose a preferred date";
    if (!state.time) e.time = "Choose a preferred time";
    if (state.email && !/^\S+@\S+\.\S+$/.test(state.email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  // Suggested dates: next 14 days, exclude Sundays
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 45);

  return (
    <section
      id="book"
      ref={formRef as React.RefObject<HTMLElement>}
      className="py-12 md:py-16 bg-gradient-to-b from-background to-secondary/60"
    >
      <div className="container-x grid gap-10 lg:grid-cols-5 items-start">
        <div className="lg:col-span-2 lg:sticky lg:top-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold normal-case tracking-wide text-navy">
            Book Your Free Estimate
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl text-navy text-balance">
            Ready to see your new shower? Schedule your free, no-obligation estimate.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Hassle-free appointments often available. We'll call to confirm within 1 hour.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "No pressure. No obligation.",
              "$0 down financing — up to 12 months no payments, no interest",
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

        <div className="lg:col-span-3">
          <div className="rounded-3xl bg-card border border-border shadow-elegant p-6 md:p-8">
            {submitted ? (
              <ConfirmationScreen state={state} onReset={() => {
                setSubmitted(false);
                setState({ name: "", phone: "", email: "", address: "", project: "", date: undefined, time: "", notes: "" });
              }} />
            ) : (
              <form onSubmit={submit} className="space-y-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full Name" error={errors.name} required>
                    <Input
                      value={state.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Jane Smith"
                      autoComplete="name"
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
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Email (optional)" error={errors.email}>
                    <Input
                      type="email"
                      value={state.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@email.com"
                      autoComplete="email"
                    />
                  </Field>
                  <Field label="Service Address or ZIP" error={errors.address} required>
                    <Input
                      value={state.address}
                      onChange={(e) => update("address", e.target.value)}
                      placeholder="78209"
                      autoComplete="postal-code"
                    />
                  </Field>
                </div>

                <Field label="What best describes your project?" error={errors.project} required>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      "Tub-to-Shower Conversion",
                      "Full Shower Remodel",
                      "Shower Refresh / Update",
                      "Other",
                    ].map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => update("project", p)}
                        className={cn(
                          "rounded-lg border px-4 py-3 text-sm text-left transition-colors",
                          state.project === p
                            ? "border-navy bg-navy/5 text-navy font-semibold"
                            : "border-border bg-card hover:border-navy/40",
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Preferred Date" error={errors.date} required>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-10",
                            !state.date && "text-muted-foreground",
                          )}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {state.date ? format(state.date, "EEE, MMM d") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <LazyCalendar
                          mode="single"
                          selected={state.date}
                          onSelect={(d) => update("date", d)}
                          disabled={(d) => d < today || d > maxDate || d.getDay() === 0}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                  <Field label="Preferred Time" error={errors.time} required>
                    <Select value={state.time} onValueChange={(v) => update("time", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a time window" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Morning (8am–12pm)">Morning (8am–12pm)</SelectItem>
                        <SelectItem value="Afternoon (12pm–5pm)">Afternoon (12pm–5pm)</SelectItem>
                        <SelectItem value="I'm flexible">I'm flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field label="Tell us about your current bathroom (optional)">
                  <Textarea
                    value={state.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    placeholder="Size, age, style you're going for, any concerns…"
                    rows={4}
                  />
                </Field>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 bg-navy text-navy-foreground hover:bg-navy/90 text-base font-semibold shadow-elegant"
                >
                  Request My Free Estimate
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  We'll call within 1 hour to confirm. No obligation, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
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
    project: string;
    date: Date | undefined;
    time: string;
    address: string;
  };
  onReset: () => void;
}) {
  return (
    <div className="text-center py-4">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-navy text-navy-foreground">
        <Check className="h-8 w-8" strokeWidth={3} />
      </div>
      <h3 className="mt-5 text-2xl font-display font-semibold text-navy">Thank you, {state.name.split(" ")[0]}!</h3>
      <p className="mt-2 text-muted-foreground max-w-md mx-auto">
        Your request has been received. A member of our team will call you shortly at{" "}
        <span className="font-semibold text-foreground">{state.phone}</span> to confirm your appointment.
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
        <div>
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">Date</dt>
          <dd className="font-medium text-navy">
            {state.date ? format(state.date, "EEEE, MMM d") : ""}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">Time</dt>
          <dd className="font-medium text-navy">{state.time}</dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a href={PHONE_TEL}>
          <Button variant="outline" className="border-navy/25 text-navy">
            <Phone className="mr-2 h-4 w-4" /> {PHONE_DISPLAY}
          </Button>
        </a>
        <Button onClick={onReset} className="bg-navy text-navy-foreground hover:bg-navy/90">
          Submit another request
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
      a: "Most acrylic and Onyx shower installations are completed in a single day. Larger remodels or tub-to-shower conversions may take 1–2 days depending on plumbing and prep work.",
    },
    {
      q: "Do you really offer hassle-free estimates?",
      a: "Yes! We work around your schedule and can often come by within a day or two. We'll call within 1 hour to confirm your appointment window.",
    },
    {
      q: "What do your acrylic and Onyx shower systems cost?",
      a: "Every home is different, so we provide free, honest, no-pressure quotes tailored to your bathroom. Most tub-to-shower conversions land in a competitive, affordable range with financing options available.",
    },
    {
      q: "Are your acrylic and Onyx panels really as durable as tile?",
      a: "Absolutely. Our premium acrylic and Onyx wall systems are non-porous, leak-resistant, easy to clean, and built to last a lifetime — with none of the grout maintenance real tile requires.",
    },
    {
      q: "Do you serve all of San Antonio?",
      a: "Yes — San Antonio, Alamo Heights, Stone Oak, Shavano Park, Boerne, Helotes, Fair Oaks Ranch, and surrounding areas.",
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
    <footer className="bg-neutral-800 text-neutral-100">
      <div className="container-x py-14 grid gap-10 md:grid-cols-2">
        <div>
          <Logo size="sm" variant="footer" dark />
          <p className="mt-5 text-neutral-300 text-sm max-w-sm">
            Family-owned bathroom remodeling. Beautiful showers, fast installs, zero hassle.
          </p>
          <p className="mt-3 text-neutral-400 text-sm">
            Proudly serving San Antonio and surrounding areas.
          </p>
        </div>
        <div className="md:justify-self-end">
          <h4 className="font-semibold text-neutral-100">Trust &amp; Credentials</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="https://www.bbb.org"
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-white/10 px-3 py-2 text-xs font-semibold text-neutral-100 hover:bg-white/15"
            >
              A+ BBB Accredited
            </a>
            <span className="rounded-md bg-white/10 px-3 py-2 text-xs font-semibold">
              Zero Complaints
            </span>
            <span className="rounded-md bg-white/10 px-3 py-2 text-xs font-semibold">
              Licensed &amp; Insured
            </span>
          </div>
          <p className="mt-4 text-xs text-neutral-400 max-w-xs">
            Quality acrylic and Onyx shower systems featuring premium finishes and lifetime durability.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
          <div>© {new Date().getFullYear()} Texas Bath Solutions. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </div>

    </footer>
  );
}

/* ---------------- PAGE ---------------- */
function Index() {
  const formRef = useRef<HTMLElement | null>(null);
  const scrollToBook = () => {
    const el = document.getElementById("book");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onBook={scrollToBook} />
      <main>
        <Hero onBook={scrollToBook} />
        <TrustBar />
        <About />
        <BookingForm formRef={formRef} />
        <Gallery />
        <Offers onBook={scrollToBook} />
        <WhyUs />
        <Process />
        <FAQ />
        <Testimonials />
      </main>
      <FinancingBanner onBook={scrollToBook} />
      <Footer />
      <MobilePhoneCTA />
    </div>
  );
}
