import { useMemo } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import FilterDropdown from "../../components/package/FilterDropdown"
import CategoryCard from "../../components/package/CategoryCard"
import { ActiveTripHeader } from "@/components/shared/ActiveTripHeader"
import { usePackingStore } from "@/stores/usePackingStore"

export default function PackingPage() {
  const { categories, filters, setFilter, unpackAll } = usePackingStore()
 
  const allItems = useMemo(() => categories.flatMap((c) => c.items), [categories])
  const totalItems = allItems.length
  const packedItems = allItems.filter((i) => i.packed).length
  const overallPct = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100)
 
  const categoryOptions = ['All Categories', ...categories.map((c) => c.name)]
  const statusOptions = ['All Status', 'Packed', 'Unpacked']
  const priorityOptions = ['All Priorities', 'Required', 'Optional']
 
  const filteredCategories = useMemo(
    () =>
      categories
        .map((cat) => {
          let items = cat.items
          if (filters.status === 'Packed') items = items.filter((i) => i.packed)
          if (filters.status === 'Unpacked') items = items.filter((i) => !i.packed)
          if (filters.priority === 'Required') items = items.filter((i) => i.required)
          if (filters.priority === 'Optional') items = items.filter((i) => !i.required)
          return { ...cat, items }
        })
        .filter((cat) => filters.category === 'All Categories' || cat.name === filters.category),
    [categories, filters],
  )
 
  const hasFilters =
    filters.category !== 'All Categories' ||
    filters.status !== 'All Status' ||
    filters.priority !== 'All Priorities'
 
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <ActiveTripHeader
        variant="packing"
        action={
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={unpackAll}
          >
            Unpack All
          </Button>
        }
      />
 
      {/* Progress */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">Packing Progress</span>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>
              <span className="font-semibold text-sky-600">{overallPct}%</span> Complete
            </span>
            <span className="text-slate-300">|</span>
            <span>
              <span className="font-semibold text-slate-700">{packedItems}/{totalItems}</span> Packed
            </span>
            <span className="text-slate-300">|</span>
            <span>
              <span className="font-semibold text-slate-700">{totalItems - packedItems}</span> Remaining
            </span>
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-700"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>
 
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="size-4 text-slate-400" />
        <FilterDropdown options={categoryOptions} value={filters.category} onChange={(v) => setFilter('category', v)} />
        <FilterDropdown options={statusOptions} value={filters.status} onChange={(v) => setFilter('status', v)} />
        <FilterDropdown options={priorityOptions} value={filters.priority} onChange={(v) => setFilter('priority', v)} />
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => {
              setFilter('category', 'All Categories')
              setFilter('status', 'All Status')
              setFilter('priority', 'All Priorities')
            }}
          >
            <X className="size-3" /> Clear Filters
          </Button>
        )}
      </div>
 
      {/* Category grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filteredCategories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  )
}