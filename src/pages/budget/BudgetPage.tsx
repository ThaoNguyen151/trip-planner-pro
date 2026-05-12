import { useBudgetStore } from "@/stores";
import {
  ExpenseTable,
  BudgetHeader,
  BudgetToolbar,
  BudgetSummaryCards,
} from "@/components/budget";
import React from "react";

export default function BudgetPage() {
  const totalBudget = useBudgetStore((state) => state.totalBudget);
  const expenses = useBudgetStore((state) => state.expenses);
  const filters = useBudgetStore((state) => state.filters);
  const displayExpenses = React.useMemo(() => {
    if (!expenses) return [];
    return expenses.filter((exp) => {
      const matchCategory =
        filters.category === "All" || exp.category === filters.category;
      const matchStatus =
        filters.status === "All" || exp.paymentStatus === filters.status;
      return matchCategory && matchStatus;
    });
  }, [filters, expenses]);
  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header */}
      <BudgetHeader totalBudget={totalBudget} />
      {/* Summary cards */}
      <BudgetSummaryCards />
      {/* Title, filter bar and add expense button */}
      <BudgetToolbar />
      {/* Expense table */}
      <ExpenseTable expenses={displayExpenses} />
    </div>
  );
}
