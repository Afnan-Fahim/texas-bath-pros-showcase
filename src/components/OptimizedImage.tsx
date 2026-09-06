import { cn } from "@/lib/utils";

type OptimizedImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "loading" | "decoding"> & {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Set for the LCP image only. Everything else stays lazy. */
  priority?: boolean;
};

/**
 * Standard <img> wrapper: always ships explicit dimensions (CLS = 0),
 * async decoding, and lazy loading unless the image is the LCP asset.
 * Purely presentational — no visual change to the images it renders.
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  sizes,
  ...rest
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={cn(className)}
      {...rest}
    />
  );
}
