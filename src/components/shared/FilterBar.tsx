import type { ReactNode } from "react";
import { FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  children: ReactNode;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function FilterBar({
  children,
  onClear,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <Card className="flex flex-row flex-nowrap items-end gap-3 overflow-x-auto p-3 md:flex-wrap md:gap-4 md:p-4 border-border shadow-sm w-full sm:w-auto bg-card">
      {children}
      <div className="mx-1 hidden h-8 w-px self-end bg-border md:block" />
      <Button
        variant="ghost"
        onClick={onClear}
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 self-end rounded-md border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors h-9",
          hasActiveFilters
            ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
            : "border-transparent text-popover-foreground/80 hover:bg-muted/70",
        )}
      >
        <FilterX className="h-4 w-4" />
        Clear Filters
      </Button>
    </Card>
  );
}
