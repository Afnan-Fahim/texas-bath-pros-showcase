import { createFileRoute, Link } from "@tanstack/react-router";
import logoImg from "@/assets/logo-header.webp";
import instantForm from "@/assets/sms-optin/instant-form-optin.png.asset.json";
import messenger from "@/assets/sms-optin/messenger-optin.png.asset.json";

export const Route = createFileRoute("/sms-optin")({
  head: () => ({
    meta: [
      { title: "SMS Opt In" },
      { name: "description", content: "How people opt in to receive text messages from Texas Bath Solutions LLC." },
      { property: "og:title", content: "SMS Opt In" },
      { property: "og:description", content: "How people opt in to receive text messages from Texas Bath Solutions LLC." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SmsOptinPage,
});

function SmsOptinPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-neutral-900/10">
        <div className="container-x py-4">
          <Link to="/" aria-label="Texas Bath Solutions home" className="inline-block">
            <img src={logoImg} alt="Texas Bath Solutions" className="h-12 w-auto" width={900} height={669} />
          </Link>
        </div>
      </div>
      <main className="container-x py-10 md:py-14 max-w-2xl space-y-6 text-sm md:text-base leading-relaxed text-neutral-700">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-navy">
          Text Message Consent for Texas Bath Solutions LLC
        </h1>
        <p>
          Texas Bath Solutions LLC sends text messages only to people who ask for a free in home estimate and agree to receive texts. There are two ways people opt in.
        </p>

        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-neutral-900">1. Facebook Instant Form</h2>
          <p>
            People who tap our Facebook ad fill out a short form with their name and phone number. Above the submit button, the form shows this statement:
          </p>
          <p className="italic">
            "By submitting this form, you agree to receive text messages from Texas Bath Solutions LLC about your free estimate request, including reminders. Message frequency varies. Message and data rates may apply. Reply STOP to opt out."
          </p>
          <img src={instantForm.url} alt="Facebook Instant Form showing the text message consent statement above the Submit button" className="w-full max-w-sm h-auto rounded-lg border border-neutral-900/10" />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-neutral-900">2. Facebook Messenger</h2>
          <p>
            People who message our Facebook Page tap "Text It to my phone" and are then asked for their number. The message shows this statement before they type it:
          </p>
          <p className="italic">
            "By sending your number, you agree to receive text messages from Texas Bath Solutions LLC about your free estimate request, including reminders. Message frequency varies. Message and data rates may apply. Reply STOP to opt out."
          </p>
          <img src={messenger.url} alt="Facebook Messenger conversation showing the text message consent statement" className="w-full h-auto rounded-lg border border-neutral-900/10" />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-neutral-900">What we send</h2>
          <p>
            One welcome text with a link to book a free estimate, and up to two reminder texts. Texts are sent only between 8am and 9pm Texas time. Message frequency varies. Message and data rates may apply.
          </p>
          <p>
            Reply STOP to opt out at any time. Reply HELP for help, or email{" "}
            <a href="mailto:Contact@TexasBathSolutions.com" className="text-navy underline">Contact@TexasBathSolutions.com</a>.
          </p>
          <p>We do not sell or share mobile numbers or SMS opt in data with third parties for marketing purposes.</p>
        </section>

        <p className="pt-4 border-t border-neutral-900/10">
          <Link to="/privacy" className="text-navy underline">Privacy Policy</Link>
          {" · "}
          <Link to="/sms-terms" className="text-navy underline">SMS Terms</Link>
        </p>
      </main>
    </div>
  );
}
