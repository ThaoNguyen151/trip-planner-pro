import { useBudgetStore } from "@/stores";
import { ExpenseTable, BudgetHeader, BudgetToolbar } from "@/components/budget";

export default function BudgetPage() {
  const totalBudget = useBudgetStore((state) => state.totalBudget);
  const expenses = useBudgetStore((state) => state.expenses);
  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header */}
      <BudgetHeader totalBudget={totalBudget} />
      {/* Title, filter bar and add expense button */}
      <BudgetToolbar />
      {/* Expense table */}
      <ExpenseTable expenses={expenses} />
    </div>
  );
}
