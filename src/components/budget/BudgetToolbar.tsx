import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/shared/FilterBar";
import { Plus, Trash2 } from "lucide-react";
import { useBudgetStore } from "@/stores";
import type { BudgetStore } from "@/types";
import { useState, useEffect, useRef } from "react";

interface BudgetToolbarProps {
  onAddClick: () => void;
}

export function BudgetToolbar({ onAddClick }: BudgetToolbarProps) {
  const filters = useBudgetStore((state) => state.filters);
  const setFilters = useBudgetStore((state) => state.setFilters);
  const expenses = useBudgetStore((state) => state.expenses || []);
  const clearAllExpenses = useBudgetStore((state) => state.clearAllExpenses);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters =
    filters.category !== "All" || filters.status !== "All";

  const handleDeleteAll = () => {
    clearAllExpenses();
    setIsConfirmOpen(false);
  };

  useEffect(() => {
    if (!isConfirmOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsConfirmOpen(false);
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isConfirmOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="mb-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-foreground">Expense Breakdown</h2>
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-4">
        <FilterBar
          onClear={() => setFilters({ category: "All", status: "All" })}
          hasActiveFilters={hasActiveFilters}
        >
          <div className="flex flex-row gap-3 w-full sm:w-auto items-end">
            <div className="flex flex-col gap-1.5 flex-1 md:flex-none">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Category
              </label>
              <Select
                value={filters.category}
                onValueChange={(val) =>
                  setFilters({
                    category: val as BudgetStore["filters"]["category"],
                  })
                }
              >
                <SelectTrigger className="w-full sm:w-[120px] lg:w-[180px] bg-muted/50 border-border shadow-none focus:ring-0 font-medium text-popover-foreground">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Accommodation">Accommodation</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Activity">Activity</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 md:flex-none">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Status
              </label>
              <Select
                value={filters.status}
                onValueChange={(val) =>
                  setFilters({
                    status: val as BudgetStore["filters"]["status"],
                  })
                }
              >
                <SelectTrigger className="w-full sm:w-[120px] lg:w-[160px] bg-muted/50 border-border shadow-none focus:ring-0 font-medium text-popover-foreground">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {expenses.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setIsConfirmOpen(true)}
                className="h-10 w-10 border-destructive/30 hover:border-destructive text-destructive hover:bg-destructive/10 transition-colors shadow-none shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </FilterBar>

        <div className="w-full lg:w-auto mt-2 sm:mt-0">
          <Button
            onClick={onAddClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors font-bold px-4 h-10 shadow-sm flex gap-2 w-full lg:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {isConfirmOpen && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-fade-in"
        >
          <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-2 mb-4">
              <h3 className="text-lg font-semibold text-foreground leading-none">
                Are you absolutely sure?
              </h3>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. This will permanently delete all
                your expenses from the dashboard.
              </p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsConfirmOpen(false)}
                className="h-10 font-medium"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAll}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 font-medium"
              >
                Delete All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
