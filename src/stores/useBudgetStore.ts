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
          estimatedCost: 2500,
          actualCost: 1400,
          category: "Food",
          name: "Dinner",
          paymentStatus: "Paid",
        },
        {
          id: "2",
          estimatedCost: 1000,
          actualCost: 500,
          category: "Food",
          name: "Cafe",
          paymentStatus: "Paid",
        },
        {
          id: "3",
          estimatedCost: 1400,
          actualCost: 1500,
          category: "Transport",
          name: "Grab",
          paymentStatus: "Paid",
        },
        {
          id: "4",
          estimatedCost: 2400,
          actualCost: 3500,
          category: "Shopping",
          name: "Buy Gucci jacket",
          paymentStatus: "Paid",
        },
        {
          id: "5",
          estimatedCost: 3400,
          actualCost: 3000,
          category: "Activity",
          name: "Skydiving",
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
