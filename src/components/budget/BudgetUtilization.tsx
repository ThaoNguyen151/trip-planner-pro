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
    <div className="flex flex-col h-full bg-white border border-gray-100 space-y-1 overflow-y-auto min-h-[350px] p-4 md:p-6 custom-scrollbar shadow-sm rounded-xl">
      <h2 className="text-lg md:text-xl font-bold text-slate-900">
        Budget Utilization
      </h2>
      <div className="flex-1 overflow-y-auto p-2 md:p-4 custom-scrollbar min-h-[300px]">
        {utilizationData.length > 0 ? (
          utilizationData.map((item) => (
            <div
              key={item.name}
              onClick={() => onCategoryClick(item.name)}
              className={`group cursor-pointer p-3 mb-1 rounded-xl transition-all duration-200 border ${selectedCategory === item.name ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-transparent border-transparent hover:bg-gray-50"}`}
            >
              <div className="flex justify-between items-end flex-wrap gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-bold text-gray-700 uppercase">
                    {item.name}
                  </span>

                  {/* Tooltip */}
                  <span
                    className={`whitespace-nowrap w-fit text-[10px] px-1.5 py-0.5 rounded-md text-white font-bold opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 ${budgetUtils.getBarColor(item.percent)}`}
                  >
                    {item.percent.toFixed(0)}%
                  </span>
                </div>
                <div className="text-right lg:text-right sm:text-left ml-auto">
                  <span
                    className={`text-xs font-bold ${budgetUtils.getStatusColor(item.percent)}`}
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
              <div className="w-full bg-gray-100 h-2 md:h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ease-out ${budgetUtils.getBarColor(item.percent)}`}
                  style={{ width: `${Math.min(item.percent, 100)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-slate-400 italic text-sm">
              No paid expenses to track budget utilization.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
