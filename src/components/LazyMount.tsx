import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders `children` only once the block scrolls near the viewport.
 * Until then it renders a same-height placeholder so nothing shifts (CLS = 0).
 */
export function LazyMount({
  children,
  minHeight,
  placeholder,
  rootMargin = "400px",
  className,
}: {
  children: ReactNode;
  minHeight: number | string;
  placeholder?: ReactNode;
  rootMargin?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [show, rootMargin]);

  return (
    <div ref={ref} className={className} style={show ? undefined : { minHeight }}>
      {show ? children : placeholder}
    </div>
  );
}
