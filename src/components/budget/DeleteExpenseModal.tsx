import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-100 p-6 flex flex-col items-center text-center">
        <DialogHeader className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <Trash2 className="w-4 h-4 text-red-600 stroke-3" />
            </div>
          </div>

          <DialogTitle className="text-2xl font-bold text-slate-900">
            Delete Item?
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-base py-2">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex w-full gap-3 mt-4 sm:justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-600 font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
