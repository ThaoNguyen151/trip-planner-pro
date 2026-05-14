import { useBudgetStore } from "@/stores";
import type { CategoryType, Expense, PaymentStatus } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const editSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  category: z.string().min(3, "Category is required"),
  estimatedCost: z.coerce.number().min(0, "Cost must be larger than 0"),
  actualCost: z.coerce.number().min(0),
  paymentStatus: z.enum(["Paid", "Unpaid"]),
});

type EditInput = z.input<typeof editSchema>;

interface EditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId: string | null;
}

export function EditExpenseModal({
  isOpen,
  onClose,
  expenseId,
}: EditExpenseModalProps) {
  const expense = useBudgetStore((state) =>
    state.expenses.find((e) => e.id === expenseId),
  );
  const updateExpense = useBudgetStore((state) => state.updateExpense);
  const { register, handleSubmit, reset, setValue, watch } = useForm<EditInput>(
    {
      resolver: zodResolver(editSchema),
    },
  );

  useEffect(() => {
    if (expense && isOpen) {
      reset({
        name: expense.name,
        category: expense.category,
        estimatedCost: expense.estimatedCost,
        actualCost: expense.actualCost,
        paymentStatus: expense.paymentStatus,
      });
    }
  }, [expense, isOpen, reset]);

  const onSubmit: SubmitHandler<EditInput> = (values) => {
    if (expenseId) {
      updateExpense(expenseId, {
        name: values.name,
        category: values.category as CategoryType,
        estimatedCost: values.estimatedCost,
        actualCost: values.actualCost,
        paymentSTatus: values.paymentStatus,
      } as Partial<Expense>);
      onClose();
    }
  };
  if (!expense) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white border-none shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Edit Expense Item
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">
              Category
            </Label>
            <Select
              value={watch("category")}
              onValueChange={(val) => setValue("category", val)}
            >
              <SelectTrigger className="border-slate-200 text-slate-900">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {[
                  "Food",
                  "Accommodation",
                  "Transport",
                  "Shopping",
                  "Activity",
                  "Others",
                ].map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-slate-900">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">
              Item Name
            </Label>
            <Input
              {...register("name")}
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Estimated Cost
              </Label>
              <Input
                type="number"
                step="0.01"
                {...register("estimatedCost")}
                className="border-slate-200 text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Actual Cost
              </Label>
              <Input
                type="number"
                step="0.01"
                {...register("actualCost")}
                className="border-slate-200 text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">
              Payment Status
            </Label>
            <RadioGroup
              value={watch("paymentStatus")}
              onValueChange={(val: PaymentStatus) =>
                setValue("paymentStatus", val)
              }
              className="flex gap-20"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Unpaid"
                  id="Unpaid"
                  className="border-slate-300"
                />
                <Label
                  htmlFor="Unpaid"
                  className="text-slate-700 font-medium cursor-pointer"
                >
                  Unpaid
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Paid"
                  id="Paid"
                  className="border-slate-300"
                />
                <Label
                  htmlFor="Paid"
                  className="text-slate-700 font-medium cursor-pointer"
                >
                  Paid
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 h-12 font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 font-bold bg-blue-600 hover:bg-blue-900 text-white rounded-xl shadow-lg shadow-blue-900/20 transition-all"
            >
              Save Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
