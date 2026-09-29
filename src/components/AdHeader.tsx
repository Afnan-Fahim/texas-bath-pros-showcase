import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo-header.webp";

const PHONE_B64 = "KDIxMCkgNzAyLTA3NTM=";

const extraLines = [
  "San Antonio & surrounding areas",
  "We beat any quote by $1,000+",
  "Free in-home estimate · no pressure",
];

/**
 * Navy ad-landing header for /estimate only — not a website menu.
 * No homepage navigation links. Extra copy collapses into the hamburger on mobile.
 */
export function AdHeader({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState<{ display: string; tel: string } | null>(null);
  useEffect(() => {
    const display = window.atob(PHONE_B64);
    setPhone({ display, tel: `tel:+1${display.replace(/\D/g, "")}` });
  }, []);

  const bookTime = () => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className={cn("relative z-50 w-full bg-navy text-white", className)}>
      <div className="container-x flex h-24 items-center gap-4 md:h-28">
        <a href="/" aria-label="Texas Bath Solutions — home" className="flex shrink-0 items-center gap-3">
          <img
            src={logoImg}
            alt="Texas Bath Solutions"
            width={900}
            height={669}
            fetchPriority="high"
            className="h-16 w-auto object-contain md:h-20"
          />
        </a>

        {/* Desktop headline strip, left to right after the logo */}
        <div className="ml-2 hidden min-[1000px]:block min-w-0">
          <p className="whitespace-nowrap text-xs font-medium text-white/75 xl:text-[13px]">
            San Antonio &amp; surrounding areas
          </p>
          <p className="whitespace-nowrap text-sm font-bold leading-tight xl:text-[15px]">
            We beat any quote by $1,000+
          </p>
          <p className="whitespace-nowrap text-xs font-medium text-white/75 xl:text-[13px]">
            Free in-home estimate · no pressure
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <a
            href={phone?.tel}
            aria-label="Call Texas Bath Solutions"
            className="flex items-center gap-1.5 font-semibold text-white hover:text-white/80 transition-colors"
          >
            <Phone className="hidden min-[480px]:block h-4 w-4" />
            <span className="whitespace-nowrap text-[13px] md:text-base">{phone?.display ?? ""}</span>
          </a>
          <Button
            asChild
            className="h-9 bg-white px-3 text-xs font-semibold text-navy hover:bg-white/90 sm:h-10 sm:px-4 sm:text-sm"
          >
            <a href={phone?.tel}>Call Now</a>
          </Button>
          <Button
            asChild
            variant="outline"
            onClick={bookTime}
            className="hidden h-9 border-white/60 bg-transparent px-3 text-xs text-white hover:bg-white/10 hover:text-white sm:h-10 sm:px-4 sm:text-sm md:inline-flex"
          >
            <span>Book a Time</span>
          </Button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-md border border-white/30 text-white md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/15 bg-navy md:hidden">
          <div className="container-x flex flex-col gap-1 py-3">
            {extraLines.map((line) => (
              <p key={line} className="px-3 py-2 text-sm font-medium text-white/85">
                {line}
              </p>
            ))}
            <Button
              asChild
              variant="outline"
              onClick={bookTime}
              className="mt-1 border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <span>Book a Time</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
