import { useBudgetStore } from "@/stores";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BudgetPage() {
  const totalBudget = useBudgetStore((state) => state.totalBudget);
  const expenses = useBudgetStore((state) => state.expenses);
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-10 flex flex-col gap-2 text-left">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          <span className="text-sm font-semibold uppercase tracking-wider text-slate-900">
            Total Budget: $
            {totalBudget.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-2 tracking-tight text-slate-900">
          Da Nang Family Trip
        </h1>
        <p className="text-slate-500 text-md">
          Comprehensive budget tracking for the 7-day excursion
        </p>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead className="font-bold text-slate-900">Item</TableHead>
              <TableHead className="font-bold text-slate-900">
                Estimated
              </TableHead>
              <TableHead className="font-bold text-slate-900">Actual</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <TableRow key={expense.id} className="text-slate-700">
                  <TableCell className="font-medium">{expense.name}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ${expense.actualCost.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-32 text-center text-slate-500 italic"
                >
                  No Expense Yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
