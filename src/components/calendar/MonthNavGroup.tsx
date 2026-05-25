import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MonthNavGroupProps = {
  compact?: boolean;
  onPrev: () => void;
  onToday: () => void;
  onNext: () => void;
};

export function MonthNavGroup({
  compact,
  onPrev,
  onToday,
  onNext,
}: MonthNavGroupProps) {
  const iconBtn = compact ? "size-8" : "size-9";
  const iconSize = compact ? "size-4" : "size-5";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-0.5 rounded-lg",
        compact && "mx-auto w-full max-w-xs justify-center sm:max-w-sm",
      )}
      role="group"
      aria-label="Month navigation"
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60",
          iconBtn,
        )}
        aria-label="Previous month"
        onClick={onPrev}
      >
        <ChevronLeft className={iconSize} aria-hidden />
      </button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          "rounded-md border-slate-200/90 bg-white font-medium text-slate-700 shadow-sm hover:bg-slate-50",
          compact ? "h-8 px-3 text-xs" : "h-9 px-4 text-sm",
        )}
        onClick={onToday}
      >
        Today
      </Button>
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60",
          iconBtn,
        )}
        aria-label="Next month"
        onClick={onNext}
      >
        <ChevronRight className={iconSize} aria-hidden />
      </button>
    </div>
  );
}
