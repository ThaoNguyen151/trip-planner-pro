"use client";

import { budgetUtils } from "@/lib/utils";
import type { Expense } from "@/types";
import React from "react";
import { useBudgetStore } from "@/stores";

interface BudgetUtilizationProps {
  expenses: Expense[];
  onCategoryClick: (category: string) => void;
  selectedCategory: string | null;
}

export function BudgetUtilization({
  expenses,
  onCategoryClick,
  selectedCategory,
}: BudgetUtilizationProps) {
  const totalBudget = useBudgetStore((state) => state.totalBudget || 0);

  const utilizationData = React.useMemo(() => {
    const groups: Record<string, { actual: number; estimated: number }> = {};
    expenses.forEach((exp) => {
      if (exp.actualCost && exp.actualCost > 0) {
        if (!groups[exp.category]) {
          groups[exp.category] = { actual: 0, estimated: 0 };
        }
        groups[exp.category].actual += exp.actualCost;
        groups[exp.category].estimated += exp.estimatedCost;
      }
    });
    return Object.entries(groups).map(([name, values]) => {
      const percent =
        values.estimated > 0 ? (values.actual / values.estimated) * 100 : 0;
      const isOverTotalBudget = values.actual > totalBudget;

      return { name, ...values, percent, isOverTotalBudget };
    });
  }, [expenses, totalBudget]);

  return (
    <div className="flex flex-col h-full bg-card border border-border space-y-1 overflow-y-auto min-h-[350px] p-4 md:p-6 custom-scrollbar shadow-sm rounded-xl">
      <h2 className="text-lg md:text-xl font-bold text-foreground">
        Category Spending Progress
      </h2>
      <div className="flex-1 flex flex-col overflow-y-auto p-2 md:p-4 custom-scrollbar min-h-[300px]">
        {utilizationData.length > 0 ? (
          utilizationData.map((item) => (
            <div
              key={item.name}
              onClick={() => onCategoryClick(item.name)}
              className={`group cursor-pointer p-3 mb-1 rounded-xl transition-all duration-200 border ${
                selectedCategory === item.name
                  ? "bg-primary/10 border-primary/30 shadow-sm"
                  : "bg-transparent border-transparent hover:bg-muted"
              }`}
            >
              <div className="flex justify-between items-end flex-wrap gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-bold text-foreground uppercase">
                    {item.name}
                  </span>

                  <span
                    className={`whitespace-nowrap w-fit text-[10px] px-1.5 py-0.5 rounded-md text-white font-bold opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 ${
                      item.isOverTotalBudget
                        ? "bg-destructive text-white"
                        : budgetUtils.getBarColor(item.percent)
                    }`}
                  >
                    {item.percent.toFixed(0)}%
                  </span>
                </div>
                <div className="text-right lg:text-right sm:text-left ml-auto">
                  <span
                    className={`text-xs font-bold ${
                      item.isOverTotalBudget
                        ? "text-destructive"
                        : budgetUtils.getStatusColor(item.percent)
                    }`}
                  >
                    {budgetUtils.formatMoney(item.actual)}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {" "}
                    / {budgetUtils.formatMoney(item.estimated)}
                  </span>
                </div>
              </div>

              <div className="w-full bg-gray-100 h-2 md:h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out ${
                    item.isOverTotalBudget
                      ? "bg-destructive"
                      : budgetUtils.getBarColor(item.percent)
                  }`}
                  style={{ width: `${Math.min(item.percent, 100)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-muted-foreground italic text-sm">
              No paid expenses to track spending progress.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
