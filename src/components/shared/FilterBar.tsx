import type { ReactNode } from "react";
import { FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  children: ReactNode;
  onClear: () => void;
}

export function FilterBar({ children, onClear }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {children}

      <Button
        variant="ghost"
        onClick={onClear}
        className="text-primary hover:text-primary hover:bg-primary/10 font-bold text-xs h-10 px-4 mt-auto uppercase tracking-wider flex gap-2"
      >
        <FilterX className="h-4 w-4" />
        Clear Filters
      </Button>
    </div>
  );
}
