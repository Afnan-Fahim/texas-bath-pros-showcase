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
import logoAsset from "@/assets/texas-bath-solutions-mark.png.asset.json";
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
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

import heroShower from "@/assets/hero-shower.jpg";
import afterSubway from "@/assets/after-subway.jpg";
import afterSubway2 from "@/assets/after-subway-2.jpg";
import afterSubway3 from "@/assets/after-subway-3.jpg";
import afterMarble from "@/assets/after-marble.jpg";
import afterMarble2 from "@/assets/after-marble-2.jpg";
import afterMarble3 from "@/assets/after-marble-3.jpg";
import afterModern from "@/assets/after-modern.jpg";
import afterModern2 from "@/assets/after-modern-2.jpg";
import afterModern3 from "@/assets/after-modern-3.jpg";
import afterVenatino from "@/assets/after-venatino.jpg";
import beforeBeige from "@/assets/before-beige.jpg";
import beforeFiberglass from "@/assets/before-fiberglass.jpg";
import beforePink from "@/assets/before-pink.jpg";
import beforeWhiteTile from "@/assets/before-white-tile.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:image", content: heroShower },
      { name: "twitter:image", content: heroShower },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Texas Bath Solutions",
          description:
            "Family-owned San Antonio bathroom remodeler specializing in Bella Stone acrylic showers and tub-to-shower conversions. Trusted Shower Experts.",
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
function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn("flex items-center gap-3 group", className)}>
      <img
        src={logoAsset.url}
        alt="Texas Bath Solutions"
        width={200}
        height={200}
        className="h-16 w-16 md:h-20 md:w-20 object-contain"
      />
      <div className="flex flex-col leading-tight">
        <span className="font-display text-2xl md:text-3xl font-bold text-navy tracking-tight">
          Texas Bath Solutions
        </span>
        <span className="text-xs md:text-sm font-medium text-navy/70 tracking-wide">
          Trusted Shower Experts · San Antonio, Texas
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
      <div className="container-x flex h-24 items-center gap-4 md:h-28">
        <Logo />
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
    <section id="top" className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
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
            Family-Owned <span className="text-muted-foreground">•</span> Free Same-Day Estimates{" "}
            <span className="text-muted-foreground">•</span> A+ BBB Rated — Zero Complaints
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={onBook}
              className="bg-navy text-navy-foreground hover:bg-navy/90 shadow-elegant text-base h-12 px-6"
            >
              Book Your Free Same-Day Estimate
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
          <BeforeAfterReel />
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

/* ---------------- BEFORE/AFTER REEL (auto-play) ---------------- */
const REEL_PAIRS = [
  { before: beforeFiberglass, after: afterMarble, label: "Fiberglass → Bella Stone Marble" },
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
              Bella Stone Acrylic Shower Remodel
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
    { icon: Clock, label: "Free Same-Day", sub: "Estimates" },
    { icon: Droplets, label: "Premium Acrylic", sub: "Fast & Leak-Proof" },
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
    <section className="py-10 md:py-14">
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
    <section className="py-16 md:py-24">
      <div className="container-x max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
          About Us
        </span>
        <h2 className="mt-4 text-3xl md:text-4xl text-navy text-balance">
          A local San Antonio family, transforming bathrooms our neighbors love.
        </h2>
        <p className="mt-5 text-lg text-muted-foreground text-balance">
          We're a family business dedicated to turning outdated bathrooms into beautiful,
          functional spaces. We believe in honest pricing, same-day estimates, and doing the
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
    id: "6",
    category: "subway",
    after: afterSubway,
    title: "Classic Subway Shower",
    location: "Boerne",
  },
  {
    id: "7",
    category: "marble",
    after: afterMarble,
    title: "Calacatta Marble Look",
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
    id: "11",
    category: "modern",
    after: afterModern2,
    title: "Matte Black Minimalist Shower",
    location: "Cibolo",
  },
  {
    id: "12",
    category: "modern",
    after: afterModern3,
    title: "Dark Stone Spa Retreat",
    location: "Garden Ridge",
  },
  {
    id: "13",
    category: "marble",
    after: afterMarble2,
    title: "Carrara Marble Master Shower",
    location: "Olmos Park",
  },
  {
    id: "14",
    category: "marble",
    after: afterMarble3,
    title: "Calacatta Gold Luxury Shower",
    location: "Hill Country Village",
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
    <section id="work" className="py-16 md:py-28 bg-gradient-to-b from-secondary/40 to-background">
      <div className="container-x">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
            Our Work
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl text-navy text-balance">
            See the Difference — Real San Antonio Bathroom Transformations
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-balance">
            Every project starts with a free same-day estimate. Here's what we deliver.
          </p>
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
          All showers feature durable, leak-resistant premium acrylic panels — installed quickly and cleanly.
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

/* ---------------- WHY US ---------------- */
function WhyUs() {
  const items = [
    {
      icon: Clock,
      title: "Free Same-Day Estimates",
      body: "No obligation, no pressure. We come to you and give you an honest quote — often the same day you call.",
    },
    {
      icon: Sparkles,
      title: "Premium Acrylic Systems",
      body: "Beautiful subway tile, marble, and stone looks with lifetime durability and easy cleaning.",
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
    <section id="why" className="py-16 md:py-24">
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
    { n: "1", title: "Book Your Free Estimate", body: "Call or fill out the form — same-day appointments often available." },
    { n: "2", title: "We Visit, Measure & Design", body: "A friendly, no-obligation home visit with an honest, upfront quote — then we walk you through beautiful acrylic tile, marble, and stone options." },
    { n: "3", title: "Professional Installation", body: "Fast, clean installation — most showers finished in a single day." },
  ];
  return (
    <section id="process" className="py-16 md:py-24 bg-gradient-to-b from-navy to-navy/95 text-navy-foreground">
      <div className="container-x">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy-foreground/90">
            The Process
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl text-navy-foreground text-balance">
            Simple, honest, and hassle-free from day one.
          </h2>
        </div>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-6">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-navy font-display font-bold text-lg">
                {s.n}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-navy-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-navy-foreground/75">{s.body}</p>
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
      body: "They came out the same day I called, gave me an honest quote, and my new shower looks straight out of a magazine. Zero hassle from start to finish.",
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
    <section className="py-16 md:py-24">
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
      className="py-16 md:py-28 bg-gradient-to-b from-background to-secondary/60"
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
            Same-day appointments often available. We'll call to confirm within 1 hour.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "No pressure. No obligation. Ever.",
              "$0 down financing — up to 12 months no payments, no interest",
              "Soft credit check only — won't affect your score",
              "Same-day estimates for most San Antonio homes",
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
          <a
            href={PHONE_TEL}
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3 shadow-card"
          >
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-navy text-navy-foreground">
              <Phone className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs text-muted-foreground">Prefer to call?</span>
              <span className="block font-semibold text-navy">{PHONE_DISPLAY}</span>
            </span>
          </a>
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
                        <Calendar
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
      a: "Most acrylic shower installations are completed in a single day. Larger remodels or tub-to-shower conversions may take 1–2 days depending on plumbing and prep work.",
    },
    {
      q: "Do you really offer same-day estimates?",
      a: "Yes! Call us in the morning and we can often come by that same afternoon. We'll call within 1 hour to confirm your appointment window.",
    },
    {
      q: "What do your acrylic shower systems cost?",
      a: "Every home is different, so we provide free, honest, no-pressure quotes tailored to your bathroom. Most tub-to-shower conversions land in a competitive, affordable range with financing options available.",
    },
    {
      q: "Are your acrylic panels really as durable as tile?",
      a: "Absolutely. Our premium acrylic wall systems are non-porous, leak-resistant, easy to clean, and built to last a lifetime — with none of the grout maintenance real tile requires.",
    },
    {
      q: "Do you serve all of San Antonio?",
      a: "Yes — San Antonio, Alamo Heights, Stone Oak, Shavano Park, Boerne, Helotes, Fair Oaks Ranch, and surrounding areas.",
    },
  ];
  return (
    <section className="py-16 md:py-24 bg-secondary/40">
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
    <footer className="bg-navy text-navy-foreground">
      <div className="container-x py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white p-4 pr-6 shadow-sm ring-1 ring-black/5">
            <img
              src={logoAsset.url}
              alt="Texas Bath Solutions"
              width={200}
              height={200}
              className="h-16 w-16 object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-display text-xl font-bold text-navy tracking-tight">
                Texas Bath Solutions
              </span>
              <span className="text-xs font-medium text-navy/70 tracking-wide">
                Trusted Shower Experts · San Antonio, Texas
              </span>
            </div>
          </div>
          <p className="mt-5 text-navy-foreground/70 text-sm max-w-xs">
            Family-owned bathroom remodeling. Beautiful showers, fast installs, zero hassle.
          </p>
          <p className="mt-3 text-navy-foreground/60 text-sm">
            Proudly serving San Antonio and surrounding areas.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-navy-foreground">Get In Touch</h4>
          <a href={PHONE_TEL} className="mt-3 flex items-center gap-2 text-lg font-semibold hover:text-white">
            <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
          </a>
          <a href="#book" className="mt-3 inline-block text-navy-foreground/80 hover:text-white">
            Book a Free Same-Day Estimate →
          </a>
        </div>
        <div>
          <h4 className="font-semibold text-navy-foreground">Trust & Credentials</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="https://www.bbb.org"
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-white/10 px-3 py-2 text-xs font-semibold text-navy-foreground hover:bg-white/15"
            >
              A+ BBB Accredited
            </a>
            <span className="rounded-md bg-white/10 px-3 py-2 text-xs font-semibold">
              Zero Complaints
            </span>
            <span className="rounded-md bg-white/10 px-3 py-2 text-xs font-semibold">
              Licensed & Insured
            </span>
          </div>
          <p className="mt-4 text-xs text-navy-foreground/60">
            Quality acrylic shower systems featuring styles similar to Bella Stone Systems.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-navy-foreground/60">
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
        <FinancingBanner onBook={scrollToBook} />
        <About />
        <Gallery />
        <WhyUs />
        <Process />
        <BookingForm formRef={formRef} />
        <FAQ />
        <Testimonials />
      </main>
      <Footer />
      <MobilePhoneCTA />
    </div>
  );
}
