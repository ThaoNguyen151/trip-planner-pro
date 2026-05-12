import { budgetUtils } from "@/lib/utils";
import type { Expense } from "@/types";
import React from "react";

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
      return { name, ...values, percent };
    });
  }, [expenses]);
  return (
    <div className="space-y-1 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
      <h2 className="text-xl font-bold text-slate-900">Budget Utilization</h2>
      {utilizationData.length > 0 ? (
        utilizationData.map((item) => (
          <div
            key={item.name}
            onClick={() => onCategoryClick(item.name)}
            className={`group cursor-pointer p-3 rounded-xl transition-all duration-200 border ${selectedCategory === item.name ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-transparent border-transparent hover:bg-gray-50"}`}
          >
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-700 uppercase">
                  {item.name}
                </span>

                {/* Tooltip */}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${budgetUtils.getBarColor(item.percent)}`}
                >
                  {item.percent.toFixed(0)}%
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-sm font-bold ${budgetUtils.getStatusColor(item.percent)}`}
                >
                  {budgetUtils.formatMoney(item.actual)}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {" "}
                  / {budgetUtils.formatMoney(item.estimated)}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out ${budgetUtils.getBarColor(item.percent)}`}
                style={{ width: `${Math.min(item.percent, 100)}%` }}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10 text-gray-400 italic text-sm">
          No paid expenses to track utilization.
        </div>
      )}
    </div>
  );
}
