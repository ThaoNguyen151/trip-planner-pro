import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BudgetStore, Expense } from "@/types/budget";

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      totalBudget: 12000,
      expenses: [
        {
          id: "1",
          estimatedCost: 2500,
          actualCost: 0,
          category: "Food",
          name: "Dinner",
          paymentStatus: "Unpaid",
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
      ],
      addExpense: (expense: Expense) =>
        set((state) => ({ expenses: [...state.expenses, expense] })),
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
      getFilteredExpenses: () => {
        const { expenses, filters } = get();
        return expenses.filter((exp) => {
          const matchCategory =
            filters.category === "All" || exp.category === filters.category;
          const matchStatus =
            filters.status === "All" || exp.paymentStatus === filters.status;
          return matchCategory && matchStatus;
        });
      },
    }),
    {
      name: "budget-storage",
      partialize: (state) => ({
        expenses: state.expenses,
        totalBudget: state.totalBudget,
      }),
    },
  ),
);
