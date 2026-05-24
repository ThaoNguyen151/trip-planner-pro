import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePackingStore } from "@/stores/usePackingStore"

export default function DeleteModal({
  categoryId,
  itemId,
  onClose,
}: {
  categoryId: string
  itemId: string
  onClose: () => void
}) {
  const deleteItem = usePackingStore((s) => s.deleteItem)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xs rounded-2xl bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
          <Trash2 className="size-5 text-red-500" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">Delete Item?</h3>
        <p className="mt-1 text-xs text-slate-400">
          Are you sure you want to delete this item?
        </p>
        <div className="mt-5 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 bg-red-500 text-white hover:bg-red-600"
            onClick={() => { deleteItem(categoryId, itemId); onClose() }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}