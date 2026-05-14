import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useItineraryStore } from "@/stores";
import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_PRIORITIES,
  ACTIVITY_STATUSES,
  type ActivityCategory,
  type ActivityPriority,
  type ActivityStatus,
  type ItineraryActivity,
} from "@/types";

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingActivity?: ItineraryActivity | null;
  editingDay?: number | null;
}

interface FormData {
  title: string;
  category: ActivityCategory;
  status: ActivityStatus;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  priority: ActivityPriority;
}

const defaultForm: FormData = {
  title: "",
  category: ACTIVITY_CATEGORIES[0],
  status: ACTIVITY_STATUSES[0],
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  priority: ACTIVITY_PRIORITIES[ACTIVITY_PRIORITIES.length - 1],
};

export function AddItemModal({
  open,
  onOpenChange,
  editingActivity,
  editingDay,
}: AddItemModalProps) {
  const days = useItineraryStore((s) => s.days);
  const addActivity = useItineraryStore((s) => s.addActivity);
  const updateActivity = useItineraryStore((s) => s.updateActivity);

  const dateToInputValue = (dateStr: string) => {
    const d = new Date(dateStr.replace(/^[^,]+, /, ""));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const buildEditForm = (): FormData => {
    if (editingActivity && editingDay) {
      const dayData = days.find((d) => d.day === editingDay);
      return {
        title: editingActivity.title,
        category: editingActivity.category,
        status: editingActivity.status,
        date: dayData ? dateToInputValue(dayData.date) : "",
        startTime: editingActivity.startTime,
        endTime: editingActivity.endTime,
        location: editingActivity.location,
        priority: editingActivity.priority,
      };
    }
    return defaultForm;
  };

  const [form, setForm] = useState(buildEditForm);

  const isEditing = !!editingActivity;

  const tripStart = days.length > 0 ? days[0].date.replace(/^[^,]+, /, "") : "";
  const tripEnd =
    days.length > 0 ? days[days.length - 1].date.replace(/^[^,]+, /, "") : "";
  const minDate = tripStart ? dateToInputValue(days[0].date) : "";
  const maxDate = tripEnd ? dateToInputValue(days[days.length - 1].date) : "";

  const update = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.title.trim() || !form.date) return;

    const day = parseInt(form.date.split("-").pop()!, 10);

    if (isEditing && editingActivity) {
      updateActivity(day, editingActivity.id, {
        title: form.title.trim(),
        location: form.location.trim(),
        startTime: form.startTime,
        endTime: form.endTime,
        category: form.category,
        priority: form.priority,
        status: form.status,
      });
    } else {
      addActivity(day, {
        title: form.title.trim(),
        location: form.location.trim(),
        startTime: form.startTime,
        endTime: form.endTime,
        category: form.category,
        priority: form.priority,
        status: form.status,
      });
    }

    setForm(defaultForm);
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setForm(defaultForm);
    }
    onOpenChange(open);
  };

  const isValid = form.title.trim() && form.date;

  return (
    <Dialog
      key={editingActivity?.id ?? "add"}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent
        className="max-w-[640px] p-0 gap-0"
        showCloseButton={false}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold tracking-tight text-blue-900">
              {isEditing ? "Edit Item" : "Add New Item"}
            </DialogTitle>
            <DialogClose />
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 pb-6 space-y-5">
          {/* Activity Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Activity Name
            </label>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g., Flight to Da Nang"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Category
              </label>
              <Select
                value={form.category}
                onValueChange={(val) =>
                  update("category", val as typeof form.category)
                }
              >
                <SelectTrigger className="h-11 w-full border-slate-300 bg-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Status
              </label>
              <Select
                value={form.status}
                onValueChange={(val) =>
                  update("status", val as typeof form.status)
                }
              >
                <SelectTrigger className="h-11 w-full border-slate-300 bg-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                min={minDate}
                max={maxDate}
                onChange={(e) => update("date", e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition-all focus:border-blue-700 focus:ring-1 focus:ring-blue-700 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                From
              </label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => update("startTime", e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition-all focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                To
              </label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => update("endTime", e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition-all focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Location
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Search location or enter address"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Priority
            </label>
            <div className="flex h-11 gap-1 rounded-lg bg-muted/40 p-1">
              {(["Low", "Medium", "High"] as const).map((p) => {
                const selected = form.priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => update("priority", p)}
                    className={cn(
                      "flex-1 rounded-md text-sm font-medium transition-all",
                      selected &&
                        p === "Low" &&
                        "border border-green-200 bg-green-50 text-green-700",
                      selected &&
                        p === "Medium" &&
                        "border border-blue-200 bg-blue-50 text-blue-700",
                      selected &&
                        p === "High" &&
                        "border border-red-200 bg-red-50 text-red-700",
                      !selected && "text-slate-500 hover:bg-white/60",
                    )}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 pb-6 pt-0 border-t-0 bg-transparent">
          <DialogClose asChild>
            <Button variant="ghost" className="text-slate-700">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="gap-1.5 bg-blue-700 text-white hover:bg-blue-800"
          >
            <Plus className="size-4" />
            {isEditing ? "Save Changes" : "Add to Itinerary"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
