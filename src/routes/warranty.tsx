import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Wrench,
  Droplets,
  FileText,
  Star,
} from "lucide-react";
import logoImg from "@/assets/logo-header.webp";

const COVERED = [
  "Material and manufacturing defects",
  "The surface is warranted not to materially fade, yellow, crack, bubble, or peel under normal use with proper care",
];

const NOT_COVERED = [
  "Installation or labor",
  "Non-BCI parts (faucets, doors, etc.)",
  "Damage from unapproved cleaners or chemicals",
  "Misuse, abuse, or commercial use (commercial installations get a 5-year warranty)",
];

function WarrantyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ---------- Top bar ---------- */}
      <div className="border-b border-neutral-900/10 bg-card/70">
        <div className="container-x py-4">
          <Link to="/" aria-label="Texas Bath Solutions home" className="inline-block">
            <img
              src={logoImg}
              alt="Texas Bath Solutions"
              className="h-12 w-auto"
              width={900}
              height={669}
            />
          </Link>
        </div>
      </div>

      {/* ---------- Heading band ---------- */}
      <header className="border-b border-navy/10 bg-gradient-to-b from-navy/[0.07] via-navy/[0.03] to-transparent">
        <div className="container-x max-w-3xl pt-10 pb-12 md:pt-14 md:pb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy/[0.07] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Lifetime Warranty
          </span>

          <h1 className="mt-5 text-3xl leading-tight font-bold tracking-tight text-navy md:text-4xl">
            Hey San Antonio &amp; Surrounding Areas,
            <br className="hidden sm:block" /> You&rsquo;re Protected&hellip; FOR LIFE!
          </h1>

          {/* soft navy accent bar */}
          <div
            aria-hidden
            className="mt-6 h-1.5 w-28 rounded-full bg-gradient-to-r from-navy via-navy/70 to-teal"
          />

          {/* clean white statement box */}
          <div className="mt-7 rounded-2xl border border-border bg-card p-6 shadow-card md:p-7">
            <p className="text-lg leading-snug font-semibold text-navy md:text-xl">
              We have one of the strongest warranties in the industry.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
              There is a reason why we have no complaints and maintain a 5-star review status on
              Google.
            </p>
            <div className="mt-3 flex items-center gap-1" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container-x max-w-3xl py-10 md:py-14">
        {/* ---------- BCI intro ---------- */}
        <div className="space-y-5 text-sm leading-relaxed text-neutral-700 md:text-base">
          <p>
            Your acrylic shower base and wall surrounds are covered by a limited lifetime
            manufacturer&rsquo;s warranty from BCI Concepts for residential use. As long as you take
            care of it, this protection lasts for as long as you own your home. It can also transfer
            once under certain conditions (usually within 2 years).
          </p>
          <p>
            Most companies only cover labor for a year. Your walls and base are covered for as long
            as you own the home.
          </p>
        </div>

        {/* ---------- Covered / not covered ---------- */}
        <div className="mt-9 grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-check/25 bg-card p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-check/12 text-check">
                <ShieldCheck className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="text-lg font-bold tracking-tight text-navy md:text-xl">
                What&rsquo;s covered
              </h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-700 md:text-base">
              {COVERED.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-check" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
                <XCircle className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="text-lg font-bold tracking-tight text-navy md:text-xl">
                What&rsquo;s not covered
              </h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-700 md:text-base">
              {NOT_COVERED.map((item) => (
                <li key={item} className="flex gap-3">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ---------- Covered defect callout ---------- */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-navy/12 bg-navy/[0.05] p-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-navy" aria-hidden />
          <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
            If there&rsquo;s a covered defect, BCI will repair, replace, or refund at their option.
          </p>
        </div>

        {/* ---------- Grab bars / faucets + plumbing ---------- */}
        <div className="mt-10 space-y-5">
          <section className="rounded-2xl border border-border bg-navy/[0.04] p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-navy-foreground">
                <Droplets className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="text-lg font-bold tracking-tight text-navy md:text-xl">
                Grab bars and faucets
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-700 md:text-base">
              <p>Our grab bars are covered by a lifetime warranty.</p>
              <p>
                Our faucets (Moen and Delta) are also covered by a lifetime manufacturer&rsquo;s
                warranty.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-navy/[0.04] p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-navy-foreground">
                <Wrench className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="text-lg font-bold tracking-tight text-navy md:text-xl">
                Plumbing Warranty
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-700 md:text-base">
              <p>
                Our plumbing work is backed by a 1-year warranty on everything we install and work
                on.
              </p>
              <p>
                We stand behind our work and match the level of protection you&rsquo;ll find with
                some of the best companies in the area.
              </p>
            </div>
          </section>
        </div>

        {/* ---------- Care + contact ---------- */}
        <section className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy/[0.08] text-navy">
              <FileText className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="text-lg font-bold tracking-tight text-navy md:text-xl">
              Keeping your warranty valid
            </h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-neutral-700 md:text-base">
            Always follow the care guidelines that come with your products to keep the warranty
            valid. For the full details, refer to the paperwork from your installer or contact us.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
            Questions about your warranty? Call or text us at{" "}
            <a href="tel:2107020753" className="font-semibold text-navy hover:underline">
              210-702-0753
            </a>
            .
          </p>
          <div className="mt-5 border-t border-neutral-900/10 pt-5 text-sm leading-relaxed text-neutral-700">
            <p className="font-semibold text-navy">Texas Bath Solutions LLC</p>
            <p className="mt-1">
              7550 W IH-10 Suite 800
              <br />
              San Antonio, TX 78229
              <br />
              Email:{" "}
              <a
                href="mailto:Contact@TexasBathSolutions.com"
                className="font-semibold text-navy hover:underline"
              >
                Contact@TexasBathSolutions.com
              </a>
            </p>
          </div>
        </section>

        {/* ---------- Actions ---------- */}
        <div className="mt-10 flex flex-wrap items-center gap-4 text-sm">
          <Link
            to="/estimate"
            className="inline-flex items-center rounded-full bg-navy px-6 py-3 font-semibold text-navy-foreground shadow-card transition-colors hover:bg-navy/90"
          >
            Book Your Free Estimate
          </Link>
          <Link
            to="/"
            className="inline-flex items-center px-1 py-3 font-semibold text-navy hover:underline"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-10 border-t border-neutral-900/10 pt-5 text-center text-xs text-neutral-600">
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          {"  |  "}
          <Link to="/sms-terms" className="hover:underline">SMS Terms</Link>
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/warranty")({
  component: WarrantyPage,
  head: () => ({
    meta: [
      { title: "Lifetime Warranty | Texas Bath Solutions" },
      {
        name: "description",
        content:
          "Our acrylic shower bases and wall surrounds carry a limited lifetime manufacturer's warranty from BCI Concepts, grab bars and Moen and Delta faucets are covered for life, and our plumbing work carries a 1-year warranty.",
      },
      { property: "og:title", content: "Lifetime Warranty | Texas Bath Solutions" },
      {
        property: "og:description",
        content:
          "Limited lifetime manufacturer's warranty on our acrylic shower bases and wall surrounds, lifetime coverage on grab bars and Moen and Delta faucets, and a 1-year warranty on our plumbing work.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://texasbathsolutions.com/warranty" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://texasbathsolutions.com/warranty" }],
  }),
});
