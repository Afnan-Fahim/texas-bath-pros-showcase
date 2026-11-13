import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
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
      <div className="border-b border-neutral-900/10">
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

      <main className="container-x py-10 md:py-14 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-navy">
          Lifetime Warranty
        </h1>

        <div className="mt-6 space-y-5 text-sm md:text-base leading-relaxed text-neutral-700">
          <p>
            Our acrylic shower bases and wall surrounds are covered by a limited lifetime
            manufacturer&rsquo;s warranty from BCI Concepts (BCI Acrylic / Bath Concepts) for
            residential use.
          </p>
          <p>
            The warranty covers the product for as long as the original residential purchaser owns
            the home. It can transfer once under certain conditions (usually within 2 years).
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <section className="rounded-xl border border-check/25 bg-card p-5 shadow-card">
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-navy">
              What&rsquo;s covered
            </h2>
            <ul className="mt-3 space-y-3 text-sm md:text-base leading-relaxed text-neutral-700">
              {COVERED.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-check" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-navy">
              What&rsquo;s not covered
            </h2>
            <ul className="mt-3 space-y-3 text-sm md:text-base leading-relaxed text-neutral-700">
              {NOT_COVERED.map((item) => (
                <li key={item} className="flex gap-3">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <p className="mt-6 rounded-xl bg-navy/5 p-5 text-sm md:text-base leading-relaxed text-neutral-700">
          If there&rsquo;s a covered defect, BCI will repair, replace, or refund at their option.
        </p>

        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-navy">
            Grab bars and faucets
          </h2>
          <div className="mt-3 space-y-3 text-sm md:text-base leading-relaxed text-neutral-700">
            <p>Our grab bars are covered by a lifetime warranty.</p>
            <p>
              Our faucets (Moen and Delta) are also covered by a lifetime manufacturer&rsquo;s
              warranty.
            </p>
          </div>
        </section>

        <section className="mt-10 border-t border-neutral-900/10 pt-6 text-sm md:text-base leading-relaxed text-neutral-700">
          <p>
            Always follow the care guidelines that come with your products to keep the warranty
            valid. For the full details, refer to the paperwork from your installer or contact us.
          </p>
          <p className="mt-4">
            Texas Bath Solutions LLC
            <br />
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
        </section>

        <div className="mt-10 flex flex-wrap gap-4 text-sm">
          <Link
            to="/estimate"
            className="inline-flex items-center rounded-full bg-navy px-5 py-2.5 font-semibold text-navy-foreground transition-colors hover:bg-navy/90"
          >
            Book Your Free Estimate
          </Link>
          <Link to="/" className="inline-flex items-center px-1 py-2.5 font-semibold text-navy hover:underline">
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
          "Our acrylic shower bases and wall surrounds carry a limited lifetime manufacturer's warranty from BCI Concepts. See what's covered, what's not, and the lifetime warranty on grab bars and faucets.",
      },
      { property: "og:title", content: "Lifetime Warranty | Texas Bath Solutions" },
      {
        property: "og:description",
        content:
          "Limited lifetime manufacturer's warranty on our acrylic shower bases and wall surrounds, plus lifetime coverage on grab bars and Moen and Delta faucets.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://texasbathsolutions.com/warranty" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "canonical", href: "https://texasbathsolutions.com/warranty" },
    ],
  }),
});
