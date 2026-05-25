import { create } from "zustand";
import { useTripStore } from "@/stores/useTripStore";
import type { BudgetStore, Expense } from "@/types/budget";

export const useBudgetStore = create<BudgetStore>()((set) => ({
  totalBudget: 12000,
  expenses: [
    {
      id: "1",
      category: "Shopping",
      name: "Buy Gucci bag",
      estimatedCost: 1500,
      actualCost: 1200,
      paymentStatus: "Paid",
    },
    {
      id: "2",
      category: "Food",
      name: "Matcha",
      estimatedCost: 1500,
      actualCost: 1200,
      paymentStatus: "Paid",
    },
  ],
  addExpenses: (newExpenses: Expense[]) =>
    set((state) => ({ expenses: [...state.expenses, ...newExpenses] })),
  updateExpense: (id, updatedFields) =>
    set((state) => ({
      expenses: state.expenses.map((exp) =>
        exp.id === id ? { ...exp, ...updatedFields } : exp,
      ),
    })),
  deleteExpense: (id) =>
    set((state) => ({
      expenses: state.expenses.filter((exp) => exp.id !== id),
    })),
  clearAllExpenses: () =>
    set(() => ({
      expenses: [],
    })),
  setTotalBudget: (amount) => {
    set({ totalBudget: amount });
    const tripId = useTripStore.getState().activeTripId;
    if (tripId) {
      useTripStore.setState((s) => ({
        trips: s.trips.map((t) =>
          t.id === tripId ? { ...t, budget: amount } : t,
        ),
      }));
    }
  },
  filters: {
    category: "All",
    status: "All",
  },
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
}));

export const getBudgetAlertStatus = (
  state: { expenses: Expense[]; totalBudget: number },
  payload: { newEstimated: number; newActual: number },
  excludeExpenseId: string | null = null,
) => {
  const currentExpenses = state.expenses.filter(
    (exp) => exp.id !== excludeExpenseId,
  );

  const currentTotalEstimated = currentExpenses.reduce(
    (sum, exp) => sum + (exp.estimatedCost ?? 0),
    0,
  );
  const currentTotalActual = currentExpenses.reduce(
    (sum, exp) => sum + (exp.actualCost ?? 0),
    0,
  );

  const finalPredictedEstimated = currentTotalEstimated + payload.newEstimated;
  const finalPredictedActual = currentTotalActual + payload.newActual;

  const estimatedPercent =
    state.totalBudget > 0
      ? (finalPredictedEstimated / state.totalBudget) * 100
      : 0;
  const actualPercent =
    state.totalBudget > 0
      ? (finalPredictedActual / state.totalBudget) * 100
      : 0;

  const isEstimatedOver = estimatedPercent >= 100;
  const isActualOver = actualPercent >= 100;

  return {
    isOverBudget: isEstimatedOver || isActualOver,
    isEstimatedOver,
    isActualOver,
    estimatedPercent: Math.round(estimatedPercent),
    actualPercent: Math.round(actualPercent),
  };
};
