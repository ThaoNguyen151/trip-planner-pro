import { useBudgetStore } from "@/stores";
import { ChartColumn, ScrollText, Wallet } from "lucide-react";

export function BudgetSummaryCards() {
  const { totalBudget, expenses } = useBudgetStore();

  {
    /* Calculations */
  }
  const totalEstimated = expenses.reduce(
    (sum, expense) => sum + (expense.estimatedCost ?? 0),
    0,
  );
  const totalActual = expenses.reduce(
    (sum, expense) => sum + (expense.actualCost ?? 0),
    0,
  );
  const remainingBalance = totalEstimated - totalActual;
  const estimatedPercent =
    totalBudget > 0 ? (totalEstimated / totalBudget) * 100 : 0;
  const actualPercent =
    totalEstimated > 0 ? (totalActual / totalEstimated) * 100 : 0;
  const savingPercent =
    totalEstimated > 0 ? (remainingBalance / totalEstimated) * 100 : 0;
  const getStatusColor = (percent: number) => {
    if (percent >= 100) return "text-red-700";
    if (percent >= 80) return "text-yellow-700";
    return "text-blue-700";
  };
  const getBarColor = (percent: number) => {
    if (percent >= 100) return "bg-red-700";
    if (percent >= 80) return "bg-yellow-700";
    return "bg-blue-700";
  };
  const getBgColor = (percent: number) => {
    if (percent <= 0) return "bg-red-700";
    if (percent <= 20) return "bg-yellow-700";
    return "bg-blue-900";
  };
  {
    /* Currency format */
  }
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card 1: Total Estimated */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Total Estimated
          </span>
          <span className="text-slate-900">
            <ChartColumn className="w-4 h-4" />
          </span>
        </div>
        <div
          className={`text-3xl font-bold mb-2 ${getStatusColor(estimatedPercent)}`}
        >
          {formatMoney(totalEstimated)}
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full mb-2 overflow-hidden">
          <div
            className={`h-full ${getBarColor(estimatedPercent)}`}
            style={{ width: `${Math.min(estimatedPercent, 100)}%` }}
          />
        </div>
        <p
          className={`text-xs font-medium ${getStatusColor(estimatedPercent)}`}
        >
          {estimatedPercent.toFixed(0)}% of total budget allocated
        </p>
      </div>

      {/* Card 2: Total Actual */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Total Actual
          </span>
          <span className="text-slate-900">
            <ScrollText className="w-4 h-4" />
          </span>
        </div>
        <div
          className={`text-3xl font-bold mb-2 ${getStatusColor(actualPercent)}`}
        >
          {formatMoney(totalActual)}
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full mb-2 overflow-hidden">
          <div
            className={`h-full ${getBarColor(actualPercent)}`}
            style={{ width: `${Math.min(actualPercent, 100)}%` }}
          />
        </div>
        <p className={`text-xs font-medium ${getStatusColor(actualPercent)}`}>
          {actualPercent.toFixed(0)}% of estimated costs paid
        </p>
      </div>

      {/* Card 3: Remaining Balance */}
      <div
        className={`${getBgColor(savingPercent)} p-6 rounded-xl shadow-sm text-white border border-gray-100 transition-colors duration-300`}
      >
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold opacity-70 uppercase tracking-wider">
            Remaining Balance
          </span>
          <span>
            <Wallet className="w-4 h-4" />
          </span>
        </div>
        <div className="text-4xl font-bold mb-2">
          {formatMoney(remainingBalance)}
        </div>
        <p className="text-xs font-medium opacity-70">
          {remainingBalance >= 0
            ? `${savingPercent.toFixed(0)}% saved from estimation`
            : `${Math.abs(savingPercent).toFixed(0)}% over estimation`}
        </p>
      </div>
    </div>
  );
}
