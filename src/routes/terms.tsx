import { createFileRoute, Link } from "@tanstack/react-router";
import logoImg from "@/assets/logo-header.webp";
import { LegalTerms } from "@/components/LegalTerms";

function TermsPage() {
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
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-navy">
          Terms and Conditions
        </h1>
        <p className="mt-4 text-sm md:text-base leading-relaxed text-neutral-700">
          The full Terms and Conditions of Use, legal disclaimers, and privacy notice for the
          Texas Bath Solutions website are shown below.
        </p>
      </main>

      <LegalTerms defaultOpen />
    </div>
  );
}

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms and Conditions | Texas Bath Solutions" },
      {
        name: "description",
        content:
          "The Terms and Conditions of Use, legal disclaimers, and privacy notice for the Texas Bath Solutions website.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
