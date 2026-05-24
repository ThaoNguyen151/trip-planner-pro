import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BudgetStore, Expense } from "@/types/budget";

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set) => ({
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
      setTotalBudget: (amount) => set({ totalBudget: amount }),
      filters: {
        category: "All",
        status: "All",
      },
      setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
    }),
    {
      name: "budget-storage",
      version: 1,
      partialize: (state) => ({
        expenses: state.expenses,
        totalBudget: state.totalBudget,
      }),
    },
  ),
);
