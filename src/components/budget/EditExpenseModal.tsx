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
  DialogFooter,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { getBudgetAlertStatus } from "@/stores";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus } from "lucide-react";

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
  const storeState = useBudgetStore();
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
        paymentStatus: values.paymentStatus,
      } as Partial<Expense>);
      onClose();
    }
  };
  if (!expense) return null;
  const watchedEstimated = watch("estimatedCost") || 0;
  const watchedActual = watch("actualCost") || 0;
  const {
    isOverBudget,
    isEstimatedOver,
    isActualOver,
    estimatedPercent,
    actualPercent,
  } = getBudgetAlertStatus(
    storeState,
    {
      newEstimated: Number(watchedEstimated),
      newActual: Number(watchedActual),
    },
    expenseId,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white border-none shadow-lg pl-6 [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight text-primary">
            Edit Item
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-primary">
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
            <Label className="text-sm font-semibold text-primary">
              Item Name
            </Label>
            <Input
              {...register("name")}
              className="border-slate-200 focus-visible:border-primary focus-visible:ring-primary focus-visible:ring-1 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-primary">
                Estimated Cost
              </Label>
              <Input
                type="number"
                step="0.01"
                {...register("estimatedCost")}
                className="border-slate-200 text-slate-900 focus-visible:border-primary focus-visible:ring-primary focus-visible:ring-1"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-primary">
                Actual Cost
              </Label>
              <Input
                type="number"
                step="0.01"
                {...register("actualCost")}
                className="border-slate-200 text-slate-900 focus-visible:border-primary focus-visible:ring-primary focus-visible:ring-1"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-primary">
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

          {/* Alert */}
          {isOverBudget && (
            <Alert
              variant="destructive"
              className="bg-red-50 border-red-200 text-red-950 animate-in fade-in-50"
            >
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertTitle className="font-bold text-destructive">
                Critical Alert!
              </AlertTitle>
              <AlertDescription className="text-xs text-red-800 font-medium space-y-1">
                {isEstimatedOver && (
                  <p>
                    • Total estimated cost is {estimatedPercent}% over budget.
                  </p>
                )}
                {isActualOver && (
                  <p>• Total actual cost is {actualPercent}% over budget.</p>
                )}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className="bg-transparent px-4 pb-5 pt-0 border-t-0 sm:px-6 sm:pb-6">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 transition-all"
            >
              <Plus className="size-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
