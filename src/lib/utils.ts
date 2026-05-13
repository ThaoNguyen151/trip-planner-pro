import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const budgetUtils = {
  getStatusColor: (percent: number) => {
    if (percent >= 100) return "text-red-700";
    if (percent >= 80) return "text-yellow-700";
    return "text-blue-700";
  },
  getBarColor: (percent: number) => {
    if (percent >= 100) return "bg-red-700";
    if (percent >= 80) return "bg-yellow-700";
    return "bg-blue-700";
  },
  getBgColor: (percent: number) => {
    if (percent <= 0) return "bg-red-700";
    if (percent <= 20) return "bg-yellow-700";
    return "bg-blue-900";
  },
  formatMoney: (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  },
};