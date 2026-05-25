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
      <DialogContent className="max-w-[280px] rounded-2xl py-7 px-5 text-center shadow-2xl [&>button]:hidden">
        <DialogHeader className="flex flex-col items-center">
          <div className="mx-auto w-9 h-9 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="size-5 text-red-500" />
          </div>

          <DialogTitle className="text-sm font-semibold text-slate-800">
            Delete Item?
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs max-w-[250px]">
            Are you sure you want to delete this item?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row gap-2 items-center justify-center sm:justify-center border-t-0 bg-white">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 max-w-[150px]"
            size="sm"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex-1 max-w-[150px] bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
