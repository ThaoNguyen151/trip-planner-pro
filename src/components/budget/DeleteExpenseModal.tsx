import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useBudgetStore } from "@/stores/";

interface DeleteExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId: string | null;
}

export function DeleteExpenseModal({
  isOpen,
  onClose,
  expenseId,
}: DeleteExpenseModalProps) {
  const deleteExpense = useBudgetStore((state) => state.deleteExpense);

  const handleDelete = () => {
    if (expenseId) {
      deleteExpense(expenseId);
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[400px] p-6 flex flex-col items-center text-center">
        <AlertDialogHeader className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <Trash2 className="w-4 h-4 text-red-600 stroke-[3]" />
            </div>
          </div>

          <AlertDialogTitle className="text-2xl font-bold text-slate-900">
            Delete Item?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 text-base py-2">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex w-full gap-3 mt-4 sm:justify-center">
          <AlertDialogCancel className="flex-1 h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-600 font-semibold">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
