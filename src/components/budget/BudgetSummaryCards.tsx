import { useBudgetStore } from "@/stores";
import { ChartColumn, ScrollText, Wallet } from "lucide-react";
import { budgetUtils } from "@/lib/utils";
import { useMemo } from "react";

export function BudgetSummaryCards() {
  const { totalBudget, expenses } = useBudgetStore();

  {
    /* Calculations */
  }
  const {
    totalEstimated,
    totalActual,
    remainingBalance,
    estimatedPercent,
    actualPercent,
    savingPercent,
  } = useMemo(() => {
    const totalEstimated = expenses.reduce(
      (sum, expense) => sum + (expense.estimatedCost ?? 0),
      0,
    );
    const totalActual = expenses.reduce(
      (sum, expense) => sum + (expense.actualCost ?? 0),
      0,
    );
    const remainingBalance = totalBudget - totalActual;
    const estimatedPercent =
      totalBudget > 0 ? (totalEstimated / totalBudget) * 100 : 0;
    const actualPercent =
      totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;
    const savingPercent =
      totalBudget > 0 ? (remainingBalance / totalBudget) * 100 : 100;

    return {
      totalEstimated,
      totalActual,
      remainingBalance,
      estimatedPercent,
      actualPercent,
      savingPercent,
    };
  }, [expenses, totalBudget]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
      {/* Card 1: Total Estimated */}
      <div className="flex flex-col h-full bg-card p-4 md:p-6 rounded-xl shadow-sm border border-border">
        <div className="flex justify-between items-start mb-2 md:mb-4">
          <span className="text-[10px] md:text-xs font-bold text-foreground uppercase tracking-wider">
            Total Estimated
          </span>
          <span className="text-foreground p-2 bg-card rounded-lg">
            <ChartColumn className="w-4 h-4" />
          </span>
        </div>
        <div
          className={`text-2xl md:text-3xl font-bold md:mb-2 ${budgetUtils.getStatusColor(estimatedPercent)}`}
        >
          {budgetUtils.formatMoney(totalEstimated)}
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full mb-2 overflow-hidden">
          <div
            className={`h-full ${budgetUtils.getBarColor(estimatedPercent)}`}
            style={{ width: `${Math.min(estimatedPercent, 100)}%` }}
          />
        </div>
        <p
          className={`text-[10px] md:text-xs font-medium ${budgetUtils.getStatusColor(estimatedPercent)}`}
        >
          {estimatedPercent.toFixed(0)}% of total budget allocated
        </p>
      </div>

      {/* Card 2: Total Actual */}
      <div className="flex flex-col h-full bg-card p-4 md:p-6 rounded-xl shadow-sm border border-border">
        <div className="flex justify-between items-start mb-2 md:mb-4">
          <span className="text-[10px] md:text-xs font-bold text-foreground uppercase tracking-wider">
            Total Actual
          </span>
          <span className="text-foreground p-2 bg-card rounded-lg">
            <ScrollText className="w-4 h-4" />
          </span>
        </div>
        <div
          className={`text-2xl md:text-3xl font-bold md:mb-2 ${budgetUtils.getStatusColor(actualPercent)}`}
        >
          {budgetUtils.formatMoney(totalActual)}
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full mb-2 overflow-hidden">
          <div
            className={`h-full ${budgetUtils.getBarColor(actualPercent)}`}
            style={{ width: `${Math.min(actualPercent, 100)}%` }}
          />
        </div>
        <p
          className={`text-[10px] md:text-xs font-medium ${budgetUtils.getStatusColor(actualPercent)}`}
        >
          {actualPercent.toFixed(0)}% of total budget used
        </p>
      </div>

      {/* Card 3: Remaining Balance */}
      <div
        className={`${budgetUtils.getBgColor(savingPercent)} p-4 md:p-6 rounded-xl shadow-sm text-white border border-border transition-colors duration-300 sm:col-span-2 lg:col-span-1 flex flex-col justify-center min-h-[140px] md:min-h-0`}
      >
        <div className="flex justify-between items-start mb-2 md:mb-4">
          <span className="text-[10px] md:text-xs font-bold opacity-70 text-primary-foreground uppercase tracking-wider">
            Remaining Balance
          </span>
          <span className="p-2 bg-white/20 rounded-lg">
            <Wallet className="w-4 h-4" />
          </span>
        </div>
        <div className="text-3xl md:text-4xl font-bold mb-2">
          {budgetUtils.formatMoney(remainingBalance)}
        </div>
        <p className="text-[10px] md:text-xs font-medium opacity-70">
          {expenses.length === 0
            ? "No estimation data yet"
            : remainingBalance >= 0
              ? `${savingPercent.toFixed(0)}% left in budget`
              : `${Math.abs(savingPercent).toFixed(0)}% over budget`}
        </p>
      </div>
    </div>
  );
}
