import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo-header.webp";

const PHONE_B64 = "KDIxMCkgNzAyLTA3NTM=";

/**
 * Navy ad-landing header for /estimate only — not a website menu.
 * Mobile: compact logo + written guarantee only (no menu, no buttons).
 * Desktop: logo + guarantee wording + tap-to-call phone + Call Now / Book a Time.
 */
export function AdHeader({ className }: { className?: string }) {
  const [phone, setPhone] = useState<{ display: string; tel: string } | null>(null);
  useEffect(() => {
    const display = window.atob(PHONE_B64);
    setPhone({ display, tel: `tel:+1${display.replace(/\D/g, "")}` });
  }, []);


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

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <a
            href={phone?.tel}
            aria-label="Call Texas Bath Solutions"
            className="flex items-center gap-1.5 font-semibold text-white hover:text-white/80 transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span className="whitespace-nowrap text-sm lg:text-base">{phone?.display ?? ""}</span>
          </a>
          <Button
            asChild
            className="h-10 bg-white px-4 text-sm font-semibold text-navy hover:bg-white/90"
          >
            <a href={phone?.tel}>Call Now</a>
          </Button>
          <Button
            asChild
            variant="outline"
            onClick={bookTime}
            className="h-10 border-white/60 bg-transparent px-4 text-sm text-white hover:bg-white/10 hover:text-white"
          >
            <span>Book a Time</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
