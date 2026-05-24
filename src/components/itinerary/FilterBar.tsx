import { FilterX } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ACTIVITY_CATEGORIES, ACTIVITY_PRIORITIES, ACTIVITY_STATUSES } from "@/types"

interface FilterBarProps {
  filters: {
    date: string
    category: string
    status: string
    priority: string
  }
  dateOptions: string[]
  onFilterChange: (key: string, value: string) => void
  onClear: () => void
  hasActiveFilters: boolean
}

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string
  value: string
  onValueChange: (val: string) => void
  options: string[]
}) {
  return (
    <div className="flex shrink-0 flex-col gap-1">
      <label className="ml-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="min-w-32.5 w-full border-border bg-muted/40 font-medium text-foreground">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function FilterBar({ filters, dateOptions, onFilterChange, onClear, hasActiveFilters }: FilterBarProps) {
  return (
    <Card className="flex flex-row flex-nowrap items-end gap-3 overflow-x-auto p-3 md:flex-wrap md:gap-4 md:p-4">
      <FilterSelect
        label="Date"
        value={filters.date}
        onValueChange={(val) => onFilterChange("date", val)}
        options={dateOptions}
      />
      <FilterSelect
        label="Category"
        value={filters.category}
        onValueChange={(val) => onFilterChange("category", val)}
        options={["All Categories", ...ACTIVITY_CATEGORIES]}
      />
      <FilterSelect
        label="Status"
        value={filters.status}
        onValueChange={(val) => onFilterChange("status", val)}
        options={["All Status", ...ACTIVITY_STATUSES]}
      />
      <FilterSelect
        label="Priority"
        value={filters.priority}
        onValueChange={(val) => onFilterChange("priority", val)}
        options={["All Priorities", ...ACTIVITY_PRIORITIES]}
      />

      <div className="mx-1 hidden h-8 w-px self-end bg-border md:block" />

      <button
        onClick={onClear}
        className={cn(
          "inline-flex shrink-0 items-center gap-1 self-end rounded-lg border px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors",
          hasActiveFilters
            ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
            : "border-transparent text-muted-foreground hover:bg-muted",
        )}
      >
        <FilterX className="size-4" />
        Clear Filters
      </button>
    </Card>
  )
}
