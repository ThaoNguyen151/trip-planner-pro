import type { Expense } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plane,
  Utensils,
  Hotel,
  ShoppingBag,
  Ticket,
  CircleEllipsis,
} from "lucide-react";
import { ActionMenu } from "@/components/shared/ActionMenu";

{
  /* Map icon by category */
}
const categoryIcons: Record<string, React.ReactNode> = {
  Food: <Utensils className="h-5 w-5 text-blue-600" />,
  Accommodation: <Hotel className="h-5 w-5 text-blue-600" />,
  Transport: <Plane className="h-5 w-5 text-blue-600" />,
  Shopping: <ShoppingBag className="h-5 w-5 text-blue-600" />,
  Activity: <Ticket className="h-5 w-5 text-blue-600" />,
  Others: <CircleEllipsis className="h-5 w-5 text-blue-600" />,
};

export function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  return (
    <div className="rounded-md border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100">
            <TableHead className="font-bold text-slate-900">
              <div className="flex items-center gap-4">
                <div className="w-10 shrink-0" />
                <span>Item</span>
              </div>
            </TableHead>
            <TableHead className="font-bold text-slate-900">
              Estimated
            </TableHead>
            <TableHead className="font-bold text-slate-900">Actual</TableHead>
            <TableHead className="font-bold text-slate-900">
              Difference
            </TableHead>
            <TableHead className="font-bold text-slate-900">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {expenses.length > 0 ? (
            expenses.map((expense) => {
              {
                /* Calculation logics for difference, difference text color and zero actual cost */
              }
              const diff = expense.estimatedCost - (expense.actualCost ?? 0);
              const isOverEstimated = diff < 0;
              const isUnpaid = expense.actualCost === 0;
              return (
                <TableRow key={expense.id} className="text-slate-900">
                  {/* Expense name & category */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        {categoryIcons[expense.category]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold leading-none mb-1">
                          {expense.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {expense.category}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Expense estimated cost */}
                  <TableCell className="font-medium">
                    $
                    {expense.estimatedCost.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>

                  {/* Expense actual cost: switch to red if above estimated cost */}
                  <TableCell
                    className={
                      isOverEstimated ? "text-red-700 font-bold" : "font-medium"
                    }
                  >
                    $
                    {expense.actualCost.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>

                  {/* Expense difference: blue if positive, red if negative, - if unpaid */}
                  <TableCell className="font-bold">
                    {isUnpaid ? (
                      <span className="text-slate-400 font-normal">-</span>
                    ) : (
                      <span
                        className={
                          isOverEstimated ? "text-red-700" : "text-blue-700"
                        }
                      >
                        {isOverEstimated ? "-" : "+"}$
                        {Math.abs(diff).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    )}
                  </TableCell>

                  {/* Payment status */}
                  <TableCell>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${expense.paymentStatus === "Paid" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}
                    >
                      {expense.paymentStatus}
                    </span>
                  </TableCell>

                  {/* Edit and delete actions */}
                  <TableCell>
                    <ActionMenu />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-slate-500 italic"
              >
                No Expense Yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
