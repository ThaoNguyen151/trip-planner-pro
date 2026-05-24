import { useBudgetStore } from "@/stores";
import {
  ExpenseTable,
  BudgetHeader,
  BudgetToolbar,
  BudgetSummaryCards,
  BudgetUtilization,
  ExpensePieChart,
} from "@/components/budget";
import React, { useState } from "react";
import { AddExpenseModal } from "@/components/budget/AddExpenseModal";

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header */}
      <BudgetHeader totalBudget={totalBudget} />
      {/* Summary cards */}
      <BudgetSummaryCards />
      {/* Title, filter bar and add expense button */}
      <BudgetToolbar onAddClick={() => setIsAddModalOpen(true)} />
      {/* Expense table */}
      <ExpenseTable expenses={displayExpenses} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Budget utilization chart */}
        <BudgetUtilization
          expenses={expenses}
          selectedCategory={selectedCategory}
          onCategoryClick={(cat) =>
            setSelectedCategory(cat === selectedCategory ? null : cat)
          }
        />

        <ExpensePieChart
          expenses={expenses}
          selectedCategory={selectedCategory}
          onReset={() => setSelectedCategory(null)}
        />
      </div>
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
