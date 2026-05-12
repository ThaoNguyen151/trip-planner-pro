import { useBudgetStore } from "@/stores";
import { ExpenseTable, BudgetHeader, BudgetToolbar } from "@/components/budget";
import React from "react";

export default function BudgetPage() {
  const totalBudget = useBudgetStore((state) => state.totalBudget);
  const getFilteredExpenses = useBudgetStore(
    (state) => state.getFilteredExpenses,
  );
  const filters = useBudgetStore((state) => state.filters);
  const displayExpenses = React.useMemo(() => {
    return getFilteredExpenses();
  }, [filters, getFilteredExpenses]);
  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header */}
      <BudgetHeader totalBudget={totalBudget} />
      {/* Title, filter bar and add expense button */}
      <BudgetToolbar />
      {/* Expense table */}
      <ExpenseTable expenses={displayExpenses} />
    </div>
  );
}
