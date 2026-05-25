import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import AddItemModal from "./AddItemModal";
import DeleteModal from "../ui/DeleteItemModal";
import { PackingCategoryIcon } from "@/lib/packing-icons";
import { usePackingStore } from "@/stores/usePackingStore";
import type { PackingCategory } from "@/types/package";

export default function CategoryCard({ category }: { category: PackingCategory }) {
  const togglePacked = usePackingStore((s) => s.togglePacked)
  const [addOpen, setAddOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ categoryId: string; itemId: string } | null>(null)
  const [expanded, setExpanded] = useState(true)
 
  const total = category.items.length
  const packed = category.items.filter((i) => i.packed).length
  const pct = total === 0 ? 0 : Math.round((packed / total) * 100)
 
  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white">
        {/* Header */}
        <div
          className="flex cursor-pointer items-center justify-between px-4 py-3"
          onClick={() => setExpanded((e) => !e)}
        >
          <div className="flex items-center gap-2">
            <PackingCategoryIcon
              iconName={category.iconName}
              size={18}
              color={category.color}
            />
            <span className="text-sm font-semibold text-slate-700">{category.name}</span>
            {total > 0 && (
              <span className="text-xs text-slate-400">
                {packed}/{total}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{pct}% Done</span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-sky-600 hover:bg-sky-50"
              onClick={(e) => { e.stopPropagation(); setAddOpen(true) }}
            >
              <Plus className="size-3.5" />
            </Button>
            <ChevronDown
              className={cn('size-4 text-slate-300 transition-transform', expanded && 'rotate-180')}
            />
          </div>
        </div>
 
        {/* Progress bar */}
        {total > 0 && (
          <div className="mx-4 mb-1 h-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: category.color }}
            />
          </div>
        )}
 
        {/* Items */}
        {expanded && total > 0 && (
          <div className="divide-y divide-slate-50">
            {category.items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'group flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-slate-50/70',
                  item.packed && 'opacity-60',
                )}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePacked(category.id, item.id)}
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all',
                      item.packed
                        ? 'border-sky-500 bg-sky-500'
                        : 'border-slate-300 hover:border-sky-400',
                    )}
                  >
                    {item.packed && (
                      <svg className="size-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div>
                    <p className={cn('text-xs font-medium text-slate-700', item.packed && 'text-slate-400 line-through')}>
                      {item.name}
                    </p>
                    {item.required && !item.packed && (
                      <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[9px] font-semibold text-red-500">
                        REQUIRED
                      </span>
                    )}
                    {item.packed && (
                      <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600">
                        PACKED
                      </span>
                    )}
                  </div>
                </div>
 
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="sm:opacity-0 opacity-80  text-red-400 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  onClick={() => setDeleteTarget({ categoryId: category.id, itemId: item.id })}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
 
        {/* Empty state */}
        {expanded && total === 0 && (
          <div className="px-4 pb-4 pt-1 text-center">
            {/* <p className="text-xs text-slate-400">No items yet.</p> */}
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 text-xs text-sky-600 hover:bg-sky-50"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="size-3" /> Add first item
            </Button>
          </div>
        )}
      </div>
 
      {addOpen && (
        <AddItemModal
          categoryId={category.id}
          categoryName={category.name}
          onClose={() => setAddOpen(false)}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          categoryId={deleteTarget.categoryId}
          itemId={deleteTarget.itemId}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  )
}