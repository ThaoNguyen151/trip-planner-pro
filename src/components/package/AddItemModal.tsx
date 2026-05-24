import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePackingStore } from "@/stores/usePackingStore";


export default function AddItemModal({
  categoryId,
  categoryName,
  onClose,
}: {
  categoryId: string;
  categoryName: string;
  onClose: () => void;
}) {
  const addItem = usePackingStore((s) => s.addItem);
  const [form, setForm] = useState({
    name: "",
    quantity: 1,
    unit: "",
    required: false,
  });

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    addItem(categoryId, form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-sm font-semibold text-slate-800">Add New Item</h3>
        <p className="mt-0.5 text-xs text-slate-400">
          Add a new item to{" "}
          <span className="font-medium text-sky-600">{categoryName}</span>.
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Item name
            </label>
            <input
              placeholder="Linen Shirt"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 outline-none ring-sky-500/30 focus-visible:ring-2"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                Quantity
              </label>
              <div className="flex items-center overflow-hidden rounded-lg border border-slate-200">
                <button
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      quantity: Math.max(1, f.quantity - 1),
                    }))
                  }
                  className="px-2.5 py-2 text-slate-400 hover:bg-slate-50"
                >
                  −
                </button>
                 <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1) {
                      setForm((f) => ({ ...f, quantity: val }));
                    } else if (e.target.value === "") {
                      setForm((f) => ({ ...f, quantity: "" as unknown as number }));
                    }
                  }}
                  onBlur={() => {
                    if (!form.quantity || (form.quantity as unknown as string) === "") {
                      setForm((f) => ({ ...f, quantity: 1 }));
                    }
                  }}
                  className="flex-1 w-0 text-center text-xs text-slate-700 outline-none appearance-none [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden [-moz-appearance:textfield]"
                />
                  
                <button
                  onClick={() =>
                    setForm((f) => ({ ...f, quantity: f.quantity + 1 }))
                  }
                  className="px-2.5 py-2 text-slate-400 hover:bg-slate-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setForm((f) => ({ ...f, required: !f.required }))}
              className={cn(
                "relative h-5 w-9 rounded-full transition-colors",
                form.required ? "bg-sky-500" : "bg-slate-200",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
                  form.required ? "left-4" : "left-0.5",
                )}
              />
            </button>
            <label className="text-xs text-slate-500">Mark as required</label>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-sky-600 hover:bg-sky-700"
            onClick={handleSubmit}
          >
            Add Item
          </Button>
        </div>
      </div>
    </div>
  );
}
