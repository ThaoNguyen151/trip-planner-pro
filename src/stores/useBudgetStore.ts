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
          actualCost: 0,
          category: "Food",
          name: "Ăn tối ở quán Trần",
          paymentStatus: "Unpaid",
        },
        {
          id: "2",
          estimatedCost: 1000,
          actualCost: 500,
          category: "Food",
          name: "Cafe dừa Cộng",
          paymentStatus: "Paid",
        },
        {
          id: "3",
          estimatedCost: 1400,
          actualCost: 1500,
          category: "Transport",
          name: "Grab đi Hội An",
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
    }),
    { name: "budget-storage" },
  ),
);
