import { useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FilterBar } from "@/components/shared/FilterBar";
import FilterDropdown from "../../components/package/FilterDropdown";
import CategoryCard from "../../components/package/CategoryCard";
import { usePackingStore } from "@/stores/usePackingStore";
import { ActiveTripHeader } from "@/components/shared/ActiveTripHeader";

export default function PackingPage() {
  const { categories, filters, setFilter, unpackAll } = usePackingStore();

  const allItems = useMemo(
    () => categories.flatMap((c) => c.items),
    [categories],
  );
  const totalItems = allItems.length;
  const packedItems = allItems.filter((i) => i.packed).length;
  const overallPct =
    totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100);

  const categoryOptions = ["All Categories", ...categories.map((c) => c.name)];
  const statusOptions = ["All Status", "Packed", "Unpacked"];
  const priorityOptions = ["All Priorities", "Required", "Optional"];

  const filteredCategories = useMemo(
    () =>
      categories
        .map((cat) => {
          let items = cat.items;
          if (filters.status === "Packed")
            items = items.filter((i) => i.packed);
          if (filters.status === "Unpacked")
            items = items.filter((i) => !i.packed);
          if (filters.priority === "Required")
            items = items.filter((i) => i.required);
          if (filters.priority === "Optional")
            items = items.filter((i) => !i.required);
          return { ...cat, items };
        })
        .filter(
          (cat) =>
            filters.category === "All Categories" ||
            cat.name === filters.category,
        ),
    [categories, filters],
  );

  const hasFilters =
    filters.category !== "All Categories" ||
    filters.status !== "All Status" ||
    filters.priority !== "All Priorities";

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 rounded-xl bg-muted/40 px-2 py-4 sm:px-4 sm:gap-5 md:px-6 md:py-6 md:gap-6">
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
      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              Packing Progress
            </span>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>
                <span className="font-semibold text-primary">
                  {overallPct}%
                </span>{" "}
                Complete
              </span>
              <span className="text-border">|</span>
              <span>
                <span className="font-semibold text-foreground">
                  {packedItems}/{totalItems}
                </span>{" "}
                Packed
              </span>
              <span className="text-border">|</span>
              <span>
                <span className="font-semibold text-foreground">
                  {totalItems - packedItems}
                </span>{" "}
                Remaining
              </span>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-700"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <FilterBar
        onClear={() => {
          setFilter("category", "All Categories");
          setFilter("status", "All Status");
          setFilter("priority", "All Priorities");
        }}
        hasActiveFilters={hasFilters}
      >
        <SlidersHorizontal className="size-4 text-muted-foreground" />
        <FilterDropdown
          options={categoryOptions}
          value={filters.category}
          onChange={(v) => setFilter("category", v)}
        />
        <FilterDropdown
          options={statusOptions}
          value={filters.status}
          onChange={(v) => setFilter("status", v)}
        />
        <FilterDropdown
          options={priorityOptions}
          value={filters.priority}
          onChange={(v) => setFilter("priority", v)}
        />
      </FilterBar>

      {/* Category grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filteredCategories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}
