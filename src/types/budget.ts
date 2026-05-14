export type PaymentStatus = "Paid" | "Unpaid";

export type CategoryType =
  | "Transport"
  | "Accommodation"
  | "Food"
  | "Shopping"
  | "Activity"
  | "Others";

export interface Expense {
  id: string;
  name: string;
  category: CategoryType;
  estimatedCost: number;
  actualCost: number;
  paymentStatus: PaymentStatus;
}

export interface BudgetFilters {
  category: CategoryType | "All";
  status: PaymentStatus | "All";
}

export interface BudgetStore {
  totalBudget: number;
  expenses: Expense[];
  addExpenses: (newExpenses: Expense[]) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setTotalBudget: (amount: number) => void;
  filters: BudgetFilters;
  setFilters: (filters: Partial<BudgetFilters>) => void;
}
