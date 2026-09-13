import React from "react";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  title: string;
  description?: string;
  image?: string;
  imagePending?: boolean;
  selected: boolean;
  onClick: () => void;
  index?: number;
  fill?: boolean;
  compact?: boolean;
  /** Even smaller rendering for later quiz steps with a 2x2 photo grid. */
  dense?: boolean;
}

export function QuizCard({
  title,
  description,
  image,
  imagePending,
  selected,
  onClick,
  compact = false,
  dense = false,
}: QuizCardProps) {
  const isDense = compact && dense;
  const hasImage = !!image;
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-xl border-2 overflow-hidden transition-colors duration-150 text-center flex flex-col",
        "hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]",
        selected
          ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(var(--color-primary),0.15)] scale-[1.02]"
          : "border-border bg-card"
      )}
    >
      {imagePending || !hasImage ? (
        <div
          className={cn(
            "w-full shrink-0 animate-pulse bg-muted/30",
            isDense ? "aspect-square" : "aspect-[4/5]"
          )}
        />
      ) : (
        <div className="w-full shrink-0 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="block h-auto w-full"
            loading="eager"
            decoding="sync"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
      <div
        className={cn(
          "w-full",
          isDense ? "p-1.5 md:p-2" : compact ? "p-2 md:p-3" : "p-3"
        )}
      >
        <h3
          className={cn(
            "font-medium",
            isDense
              ? "text-xs sm:text-sm md:text-base"
              : compact
                ? "text-sm sm:text-base md:text-lg"
                : "text-base sm:text-lg"
          )}
        >
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
