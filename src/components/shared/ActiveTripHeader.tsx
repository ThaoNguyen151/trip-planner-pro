import type { ReactNode } from "react";
import { Calendar } from "lucide-react";

import { useActiveTripMeta } from "@/hooks/useActiveTripMeta";
import { budgetUtils } from "@/lib/utils";
import { cn } from "@/lib/utils";

type ActiveTripHeaderProps = {
  variant: "budget" | "dashboard" | "page" | "packing";
  className?: string;
  action?: ReactNode;
};

export function ActiveTripHeader({
  variant,
  className,
  action,
}: ActiveTripHeaderProps) {
  const { title, dateRange, dayCount, totalBudget } = useActiveTripMeta();

  if (variant === "budget") {
    const excursionLabel =
      dayCount > 0 ? `${dayCount}-day excursion` : "excursion";

    return (
      <div
        className={cn("mb-6 md:mb-10 flex flex-col gap-2 text-left", className)}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          <span className="text-[12px] md:text-sm font-semibold uppercase tracking-wider text-foreground">
            Total Budget: {budgetUtils.formatMoney(totalBudget)}
          </span>
        </div>
        <h1 className="text-2xl md:text-4xl font-semibold mb-2 tracking-tight text-foreground">
          {title}
        </h1>
        {dateRange ? (
          <p className="text-foreground text-sm md:text-base">{dateRange}</p>
        ) : null}
        <p className="text-foreground text-sm md:text-base">
          Comprehensive budget tracking for the {excursionLabel}
        </p>
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className={className}>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl">
          {title}
        </h1>
        {dateRange ? (
          <div className="flex flex-row items-center space-x-1.5 pt-0.5">
            <Calendar className="w-3 h-3" aria-hidden />
            <p className="text-muted-foreground font-bold">{dateRange}</p>
          </div>
        ) : null}
        {totalBudget > 0 ? (
          <p className="mt-1 text-sm text-muted-foreground">
            Budget {budgetUtils.formatMoney(totalBudget)}
          </p>
        ) : null}
      </div>
    );
  }

  if (variant === "packing") {
    return (
      <div className={cn("flex items-start justify-between gap-3", className)}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
          <p className="text-muted-foreground ">
            {[
              dateRange,
              dayCount > 0 ? `${dayCount} days` : null,
              totalBudget > 0 ? budgetUtils.formatMoney(totalBudget) : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        {action}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl">
          {title}
        </h2>
        {dateRange ? (
          <p className="mt-1 text-base text-muted-foreground">{dateRange}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
