import { createFileRoute, Link } from "@tanstack/react-router";
import logoImg from "@/assets/logo-header.webp";

function SmsTermsPage() {
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
          SMS Terms &amp; Conditions
        </h1>

        <p className="mt-6 text-sm md:text-base leading-relaxed text-neutral-700">
          These Terms &amp; Conditions apply to your use of the Texas Bath Solutions LLC website
          and our services. Our full website terms are also available in the footer of this
          website.
        </p>

        <div className="mt-6 space-y-6 text-sm md:text-base leading-relaxed text-neutral-700">
          <section>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 mb-2">
              SMS Terms
            </h2>

            <p>
              Program name: Texas Bath Solutions Texts.
            </p>
            <p className="mt-4">
              Program description: If you submit a Facebook lead form or share your phone number
              in a Facebook Messenger chat with Texas Bath Solutions, you agree to receive text
              messages from Texas Bath Solutions LLC about your free estimate request. These
              include a welcome text with a link to book your estimate and up to two reminder
              texts.
            </p>
            <p className="mt-4">
              Consent: By providing your phone number, you agree to receive these text messages.
              Consent is not a condition of any purchase.
            </p>
            <p className="mt-4">
              Message frequency varies. Message and data rates may apply.
            </p>
            <p className="mt-4">
              To stop receiving messages, reply STOP at any time. For help, reply HELP or email
              Contact@TexasBathSolutions.com.
            </p>
            <p className="mt-4">
              Carriers are not liable for delayed or undelivered messages.
            </p>
            <p className="mt-4">
              Your phone number and opt-in data are not sold or shared with third parties for
              marketing purposes. See our Privacy Policy for details.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 mb-2">
              Company
            </h2>
            <p>
              Texas Bath Solutions LLC
              <br />
              7550 W IH-10 Suite 800
              <br />
              San Antonio, TX 78229
              <br />
              United States
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/sms-terms")({
  component: SmsTermsPage,
  head: () => ({
    meta: [
      { title: "SMS Terms & Conditions | Texas Bath Solutions" },
      {
        name: "description",
        content:
          "SMS terms for Texas Bath Solutions text messages: consent, message frequency, and how to stop receiving texts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
