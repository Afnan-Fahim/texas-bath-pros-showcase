import { createFileRoute, Link } from "@tanstack/react-router";
import logoImg from "@/assets/logo-header.webp";

const SECTIONS: Array<{ heading?: string; paragraphs: string[] }> = [
  {
    paragraphs: [
      'Texas Bath Solutions LLC ("we", "us", "our") respects your privacy. This policy explains what information we collect and how we use it.',
    ],
  },
  {
    heading: "Information we collect",
    paragraphs: [
      "When you request a free estimate through our website, a Facebook lead form, or Facebook Messenger, we collect your name, phone number, and sometimes your email address, home address, and project details. We also collect basic website data such as browser type and pages visited.",
    ],
  },
  {
    heading: "How we use it",
    paragraphs: [
      "We use your information to contact you about your estimate request, send you a link to book your free in-home estimate, send appointment reminders, schedule and provide our services, and answer your questions. If you agree to receive text messages, we send them to the phone number you gave us.",
    ],
  },
  {
    heading: "Sharing",
    paragraphs: [
      "We do not sell or share your SMS opt-in data or personal information with third parties for marketing purposes. We only share information with service providers who help us run our business, such as our texting and scheduling tools, or when the law requires it.",
    ],
  },
  {
    heading: "Text messages",
    paragraphs: [
      "You can reply STOP at any time to stop receiving texts. Reply HELP for help. Message and data rates may apply.",
    ],
  },
];

function PrivacyPage() {
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

      <main className="container-x py-10 md:py-14 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-navy">
          Privacy Policy
        </h1>

        <div className="mt-6 space-y-6 text-sm md:text-base leading-relaxed text-neutral-700">
          {SECTIONS.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 mb-2">
                  {section.heading}
                </h2>
              )}
              {section.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </section>
          ))}

          <section>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 mb-2">
              Contact
            </h2>
            <p>
              Texas Bath Solutions LLC
              <br />
              7550 W IH-10 Suite 800
              <br />
              San Antonio, TX 78229
              <br />
              United States
              <br />
              Email: Contact@TexasBathSolutions.com
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy | Texas Bath Solutions" },
      {
        name: "description",
        content:
          "How Texas Bath Solutions collects, uses, and protects your information.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
