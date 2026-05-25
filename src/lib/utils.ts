import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const budgetUtils = {
  getStatusColor: (percent: number) => {
    if (percent >= 100) return "text-destructive";
    if (percent >= 80) return "text-orange-600";
    return "text-secondary";
  },
  getBarColor: (percent: number) => {
    if (percent >= 100) return "bg-destructive";
    if (percent >= 80) return "bg-orange-600 text-orange-600";
    return "bg-secondary";
  },
  getBgColor: (percent: number) => {
    if (percent <= 0) return "bg-destructive";
    if (percent <= 20) return "bg-orange-600 text-orange-600";
    return "bg-blue-900";
  },
  formatMoney: (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  },
};
