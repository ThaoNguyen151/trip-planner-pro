import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/shared/FilterBar";
import { Plus } from "lucide-react";

export function BudgetToolbar() {
  return (
    <div className="mb-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-slate-900">Expense Breakdown</h2>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <FilterBar>
          {/* Filter category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
              Category
            </label>
            <Select>
              <SelectTrigger className="w-[180px] bg-slate-50 border-none shadow-none focus:ring-0 font-medium text-slate-700">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Accommodation">Accommodation</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Activity">Activity</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
              Status
            </label>
            <Select>
              <SelectTrigger className="w-[180px] bg-slate-50 border-none shadow-none focus:ring-0 font-medium text-slate-700">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FilterBar>

        {/* Add Expense button */}
        <div>
          <Button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 h-10 shadow-sm flex gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>
    </div>
  );
}
