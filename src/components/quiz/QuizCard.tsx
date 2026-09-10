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
}

export function QuizCard({ title, description, image, selected, onClick, fill = false, compact = false }: QuizCardProps) {
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
        <div className={cn(
          "w-full bg-muted/30 relative overflow-hidden flex items-center justify-center group",
          compact
            ? "aspect-square"
            : "aspect-video sm:aspect-[4/3]",
          !fill && !compact && "p-2"
        )}>
          {/* Premium blurred background effect */}
          <div 
            className="absolute inset-0 blur-2xl opacity-50 bg-cover bg-center scale-110" 
            style={{ backgroundImage: `url(${image})` }} 
          />
          <img
            src={image}
            alt={title}
            className={cn(
              "relative w-full h-full rounded-md drop-shadow-md z-10 transition-transform duration-500 ease-out group-hover:scale-105",
              fill || compact ? "object-cover" : "object-contain"
            )}
            loading="eager"
            decoding="sync"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      ) : (
        // Neutral placeholder while the saved photo loads
        <div className={cn("w-full bg-muted/40", compact ? "aspect-square" : "aspect-video sm:aspect-[4/3]")} />
      )}
      <div className="p-3 w-full">
        <h3 className="font-medium text-base sm:text-lg">{title}</h3>
        {description && <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </div>
  );
}
