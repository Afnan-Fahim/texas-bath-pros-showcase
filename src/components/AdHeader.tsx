import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo-header.webp";

/**
 * Navy ad-landing header for /estimate only — not a website menu.
 * Mobile: compact logo + written guarantee only (no menu, no buttons).
 * Desktop: logo + guarantee wording + text/call line.
 */
export function AdHeader({ className }: { className?: string }) {



  const guarantee = (
    <>
      <p className="text-[11px] font-semibold leading-tight text-white/85 md:text-xs">
        Proudly Serving San Antonio &amp; Surrounding Areas
      </p>
      <p className="mt-0.5 text-[11px] leading-snug text-white md:mt-1 md:text-[13px]">
        <span className="font-bold">Our Guarantee:</span>{" "}
        <span className="text-white/95">
          Got a quote? On the same project and same materials, we will beat any written quote by{" "}
          <span className="font-bold text-white">$1,000 or more</span>.
        </span>
      </p>
      <p className="mt-0.5 text-[7.5px] leading-none text-white/55 md:mt-1 md:text-[8px]">
        *Terms and conditions may apply.
      </p>
    </>
  );

  return (
    <header className={cn("estimate-ad-header relative z-50 w-full bg-navy text-white", className)}>
      {/* Mobile: compact — only logo + guarantee */}
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-4 py-2.5 md:hidden">
        <a href="/" aria-label="Texas Bath Solutions — home" className="flex shrink-0 items-center">
          <img
            src={logoImg}
            alt="Texas Bath Solutions"
            width={900}
            height={669}
            fetchPriority="high"
            className="h-11 w-auto object-contain"
          />
        </a>
        <div className="min-w-0">{guarantee}</div>
      </div>

      {/* Desktop: logo + guarantee wording + phone + buttons */}
      <div className="hidden items-center gap-4 px-6 py-4 md:flex lg:gap-6">
        <a href="/" aria-label="Texas Bath Solutions — home" className="flex shrink-0 items-center">
          <img
            src={logoImg}
            alt="Texas Bath Solutions"
            width={900}
            height={669}
            fetchPriority="high"
            className="h-16 w-auto object-contain lg:h-[72px]"
          />
        </a>

        <div className="min-w-0 max-w-[620px]">{guarantee}</div>

        <div className="ml-auto flex shrink-0 items-center">
          <p className="max-w-[300px] text-[11px] leading-snug text-white/85 lg:max-w-[400px] lg:text-xs">
            Prefer to speak with us directly? Call or text{" "}
            <a href="tel:+12103734295" className="font-semibold text-white underline underline-offset-2 hover:text-white/80">
              (210) 373-4295
            </a>{" "}
            (texting is often faster) and we will get back to you ASAP.
          </p>
        </div>
      </div>
    </header>
  );
}
