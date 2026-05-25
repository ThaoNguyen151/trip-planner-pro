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
import { budgetUtils } from "@/lib/utils";
import { useState } from "react";
import { DeleteExpenseModal } from "./DeleteExpenseModal";
import { EditExpenseModal } from "./EditExpenseModal";

{
  /* Map icon by category */
}
const categoryIcons: Record<string, React.ReactNode> = {
  Food: <Utensils className="h-5 w-5 text-primary" />,
  Accommodation: <Hotel className="h-5 w-5 text-primary" />,
  Transport: <Plane className="h-5 w-5 text-primary" />,
  Shopping: <ShoppingBag className="h-5 w-5 text-primary" />,
  Activity: <Ticket className="h-5 w-5 text-primary" />,
  Others: <CircleEllipsis className="h-5 w-5 text-primary" />,
};

export function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };
  const handleEditClick = (id: string) => {
    setSelectedId(id);
    setIsEditModalOpen(true);
  };
  return (
    <div className="rounded-md border bg-card shadow-sm overflow-hidden">
      <div className="max-h-[400px] md:max-h-[250px] overflow-auto custom-scrollbar">
        <Table className="border-separate border-spacing-0">
          <TableHeader className="relative">
            <TableRow className="">
              <TableHead className="font-bold text-foreground sticky top-0">
                <div className="flex items-center gap-4">
                  <div className="w-8 md:w-10 shrink-0" />
                  <span>Item</span>
                </div>
              </TableHead>
              <TableHead className="font-bold text-foreground sticky top-0">
                Estimated
              </TableHead>
              <TableHead className="font-bold text-foreground sticky top-0">
                Actual
              </TableHead>
              <TableHead className="font-bold text-foreground sticky top-0">
                Difference
              </TableHead>
              <TableHead className="font-bold text-foreground sticky top-0">
                Status
              </TableHead>
              <TableHead className="sticky top-0 border-b"></TableHead>
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
                  <TableRow key={expense.id} className="text-foreground">
                    {/* Expense name & category */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
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
                      {budgetUtils.formatMoney(expense.estimatedCost)}
                    </TableCell>

                    {/* Expense actual cost: switch to red if above estimated cost */}
                    <TableCell
                      className={
                        isOverEstimated
                          ? "text-destructive font-bold"
                          : "font-medium"
                      }
                    >
                      {budgetUtils.formatMoney(expense.actualCost)}
                    </TableCell>

                    {/* Expense difference: blue if positive, red if negative, - if unpaid */}
                    <TableCell className="font-bold">
                      {isUnpaid ? (
                        <span className="text-slate-400 font-normal">-</span>
                      ) : (
                        <span
                          className={
                            isOverEstimated
                              ? "text-destructive"
                              : "text-secondary"
                          }
                        >
                          {isOverEstimated ? "-" : "+"}
                          {budgetUtils.formatMoney(Math.abs(diff))}
                        </span>
                      )}
                    </TableCell>

                    {/* Payment status */}
                    <TableCell>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${expense.paymentStatus === "Paid" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}
                      >
                        {expense.paymentStatus}
                      </span>
                    </TableCell>

                    {/* Edit and delete actions */}
                    <TableCell>
                      <ActionMenu
                        onEdit={() => handleEditClick(expense.id)}
                        onDelete={() => {
                          handleDeleteClick(expense.id);
                        }}
                      />
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

      {/* Edit modal */}
      <EditExpenseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedId(null);
        }}
        expenseId={selectedId}
      />

      {/* Delete modal */}
      <DeleteExpenseModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        expenseId={selectedId}
      />
    </div>
  );
}
