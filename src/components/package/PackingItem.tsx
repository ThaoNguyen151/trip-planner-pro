import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PackingItem } from "@/types/package";

interface PackingItemProps {
  categoryId: string;
  item: PackingItem;
  onToggle: (categoryId: string, itemId: string) => void;
  onDelete: (categoryId: string, itemId: string) => void;
}

export function PackingItem({
  categoryId,
  item,
  onToggle,
  onDelete,
}: PackingItemProps) {
  return (
    <div
      className={cn(
        "group flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-slate-50/70",
        item.packed && "opacity-60",
      )}
    >
      {/* Left: checkbox + name + badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(categoryId, item.id)}
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all",
            item.packed
              ? "border-sky-500 bg-sky-500"
              : "border-slate-300 hover:border-sky-400",
          )}
          aria-label={item.packed ? "Mark as unpacked" : "Mark as packed"}
        >
          {item.packed && (
            <svg
              className="size-2.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        <div>
          <p
            className={cn(
              "text-xs font-medium text-slate-700",
              item.packed && "text-slate-400 line-through",
            )}
          >
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

      {/* Delete button: always visible on mobile, hover-visible on desktop */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-500 opacity-100 hover:bg-red-50 hover:text-red-600"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(categoryId, item.id);
        }}
        aria-label="Delete item"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}
