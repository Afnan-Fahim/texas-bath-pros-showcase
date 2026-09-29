import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo-header.webp";

const PHONE_B64 = "KDIxMCkgNzAyLTA3NTM=";

const links = [
  { href: "/#work", label: "Inspiration" },
  { href: "/#offers", label: "Offers" },
  { href: "/#why", label: "Why Us" },
  { href: "/#process", label: "The Process" },
  { href: "/#book", label: "Book Estimate" },
];

/** Navy site header for secondary pages — mirrors the homepage header. */
export function SiteHeader({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState<{ display: string; tel: string } | null>(null);
  useEffect(() => {
    const display = window.atob(PHONE_B64);
    setPhone({ display, tel: `tel:+1${display.replace(/\D/g, "")}` });
  }, []);

  const bookClick = () => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className={cn("relative z-50 w-full bg-[#0B1F3A] border-b border-white/10", className)}>
      <div className="container-x flex h-40 items-center gap-4 md:h-48">
        <a href="/" className="flex shrink-0 flex-row items-center gap-3">
          <img
            src={logoImg}
            alt="Texas Bath Solutions"
            width={900}
            height={669}
            fetchPriority="high"
            className="logo-outline h-30 w-auto object-contain md:h-24 xl:h-36"
          />
          <span className="hidden sm:block text-[0.78rem] md:text-[0.8775rem] font-medium tracking-wide text-white xl:whitespace-nowrap max-xl:w-[5.6rem]">
            San Antonio, TX
          </span>
        </a>
        <nav className="ml-auto hidden min-[900px]:flex items-center gap-3 xl:gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[13px] xl:text-sm whitespace-nowrap font-medium text-white hover:text-white/80 transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto min-[900px]:ml-3 xl:ml-6 flex items-center gap-2 md:gap-3">
          <a
            href={phone?.tel}
            aria-label="Call Texas Bath Solutions"
            className="hidden md:flex items-center gap-2 text-white font-semibold hover:text-white/80 transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span className="text-sm whitespace-nowrap xl:text-base">{phone?.display ?? ""}</span>
          </a>
          <div className="flex flex-col items-stretch gap-1.5">
            <Button
              onClick={bookClick}
              className="h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm bg-white text-navy font-semibold rounded-lg border border-white hover:bg-white/90 shadow-sm"
            >
              Book Free Estimate
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a href="/#book">Contact Us</a>
            </Button>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="min-[900px]:hidden grid h-10 w-10 place-items-center rounded-md border border-white/30 text-white"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="min-[900px]:hidden border-t border-white/10 bg-[#0B1F3A] text-white">
          <div className="container-x py-4 flex flex-col gap-1">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="rounded-md px-3 py-3 text-base font-medium text-white hover:bg-white/10">
                {l.label}
              </a>
            ))}
            <a href={phone?.tel} className="mt-2 flex items-center justify-center gap-2 rounded-md bg-white/10 px-3 py-3 font-semibold text-white">
              <Phone className="h-4 w-4" /> {phone?.display ?? ""}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
