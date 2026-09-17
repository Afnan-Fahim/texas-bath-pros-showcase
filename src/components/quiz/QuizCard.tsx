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
  stretchImage?: boolean;
  /** Like stretchImage, but the image fills via object-fit: cover (no distortion). */
  coverImage?: boolean;
  /** When true, force every label in the mobile row to the same height so photo areas line up. */
  uniformLabels?: boolean;
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
  stretchImage = false,
  coverImage = false,
  uniformLabels = false,
}: QuizCardProps) {
  const isDense = compact && dense;
  const hasImage = !!image;
  const matchRowHeight = stretchImage || coverImage;
  return (
    <div
      data-quiz-card
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
        <div
          className={cn(
            "w-full overflow-hidden bg-card",
            isDense
              ? "aspect-square"
              : stretchImage
                ? "flex-1 min-h-0"
                : "shrink-0"
          )}
        >
          <img
            src={image}
            alt={title}
            className={cn(
              "block h-auto w-full",
              isDense
                ? "h-full w-full object-contain object-center"
                : stretchImage && "h-full object-fill"
            )}
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
          isDense
            ? "flex flex-1 items-center justify-center p-1 md:p-1"
            : compact
              ? "p-1.5 md:p-2"
              : "p-3",
          uniformLabels && "max-md:flex max-md:items-center max-md:justify-center",
          uniformLabels &&
            (isDense
              ? "max-md:min-h-[2rem]"
                 : compact
                 ? "max-md:min-h-[3.25rem]"
                : "max-md:min-h-[4.5rem]")
        )}
      >
        <h3
          className={cn(
            "font-medium leading-tight",
            isDense
              ? "line-clamp-2 text-[10px] sm:text-xs md:text-xs"
              : compact
                ? "text-sm sm:text-sm md:text-base"
                : "text-base sm:text-lg",
            uniformLabels && "max-md:line-clamp-2"
          )}
        >
          {title}
        </h3>
        {description && (
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
