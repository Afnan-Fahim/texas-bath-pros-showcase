import React from "react";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  title: string;
  description?: string;
  image?: string;
  selected: boolean;
  onClick: () => void;
  index?: number;
  fill?: boolean;
  compact?: boolean;
  /** Even smaller rendering for later quiz steps with a 2x2 photo grid. */
  dense?: boolean;
}

export function QuizCard({ title, description, image, selected, onClick, fill = false, compact = false, dense = false }: QuizCardProps) {
  const isDense = compact && dense;
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-xl border-2 overflow-hidden transition-colors duration-150",
        "flex flex-col items-center text-center",
        "hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]",
        selected
          ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(var(--color-primary),0.15)] scale-[1.02]"
          : "border-border bg-card"
      )}
    >
      {image ? (
        // Photo fills the top of the card edge to edge — cover, centered, no bars
        <div className={cn(
          "relative w-full overflow-hidden p-0",
          isDense ? "aspect-video" : compact ? "aspect-square" : "aspect-[4/5]"
        )}>
          <img
            src={image}
            alt={title}
            className="absolute inset-0 block w-full h-full object-cover object-center transition-transform duration-500 ease-out hover:scale-105"
            loading="eager"
            decoding="sync"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      ) : (
        // Neutral placeholder while the saved photo loads
        <div className={cn("w-full", isDense ? "aspect-video bg-muted/40" : compact ? "aspect-square bg-muted/40" : "aspect-[4/5] bg-muted/40")} />
      )}
      <div className={cn("w-full", isDense ? "p-1.5 md:p-2" : compact ? "p-2 md:p-3" : "p-3")}>
        <h3 className={cn("font-medium", isDense ? "text-xs sm:text-sm md:text-base" : compact ? "text-sm sm:text-base md:text-lg" : "text-base sm:text-lg")}>{title}</h3>
        {description && <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </div>
  );
}
