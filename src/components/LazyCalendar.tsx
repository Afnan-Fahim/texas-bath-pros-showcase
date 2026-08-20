import { lazy, Suspense, type ComponentProps } from "react";
import { Calendar } from "@/components/ui/calendar";

const CalendarLazy = lazy(async () => ({
  default: (await import("@/components/ui/calendar")).Calendar,
}));

export function LazyCalendar(props: ComponentProps<typeof Calendar>) {
  return (
    <Suspense
      fallback={
        <div className="flex h-[300px] w-[280px] items-center justify-center p-3 text-sm text-muted-foreground">
          Loading calendar…
        </div>
      }
    >
      <CalendarLazy {...props} />
    </Suspense>
  );
}
