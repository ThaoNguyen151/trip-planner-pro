import { useEffect } from "react";
import { Plus, MapPin } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

const formSchema = z
  .object({
    title: z.string().min(1, "Activity name is required"),
    category: z.enum(ACTIVITY_CATEGORIES as unknown as [string, ...string[]]),
    status: z.enum(ACTIVITY_STATUSES as unknown as [string, ...string[]]),
    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().optional(),
    location: z.string().min(1, "Location is required"),
    priority: z.enum(ACTIVITY_PRIORITIES as unknown as [string, ...string[]]),
  })
  .refine(
    (data) => !data.startTime || !data.endTime || data.startTime < data.endTime,
    { message: "Start time must be before end time", path: ["endTime"] },
  );

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  title: "",
  category: ACTIVITY_CATEGORIES[0],
  status: ACTIVITY_STATUSES[0],
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  priority: ACTIVITY_PRIORITIES[ACTIVITY_PRIORITIES.length - 1],
};

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingActivity?: ItineraryActivity | null;
  editingDay?: number | null;
  minDate?: string;
  maxDate?: string;
}

function dateToInputValue(dateStr: string) {
  const d = new Date(dateStr.replace(/^[^,]+, /, ""));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function AddItemModal({
  open,
  onOpenChange,
  editingActivity,
  editingDay,
  minDate = "",
  maxDate = "",
}: AddItemModalProps) {
  const days = useItineraryStore((s) => s.days);
  const addActivity = useItineraryStore((s) => s.addActivity);
  const updateActivity = useItineraryStore((s) => s.updateActivity);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const isEditing = !!editingActivity;

  useEffect(() => {
    if (open) {
      if (editingActivity && editingDay) {
        const dayData = days.find((d) => d.day === editingDay);
        form.reset({
          title: editingActivity.title,
          category: editingActivity.category,
          status: editingActivity.status,
          date: dayData ? dateToInputValue(dayData.date) : "",
          startTime: editingActivity.startTime,
          endTime: editingActivity.endTime,
          location: editingActivity.location,
          priority: editingActivity.priority,
        });
      } else {
        form.reset(defaultValues);
      }
    }
  }, [open, editingActivity, editingDay, days, form]);

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const [y, m, d] = values.date.split("-").map(Number);
    const day = y * 10000 + m * 100 + d;
    const dateObj = new Date(y, m - 1, d);
    const displayDate = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (isEditing && editingActivity) {
      updateActivity(day, editingActivity.id, {
        title: values.title.trim(),
        location: values.location.trim(),
        startTime: values.startTime,
        endTime: values.endTime ?? "",
        category: values.category as ActivityCategory,
        priority: values.priority as ActivityPriority,
        status: values.status as ActivityStatus,
      }, displayDate);
    } else {
      addActivity(day, displayDate, {
        title: values.title.trim(),
        location: values.location.trim(),
        startTime: values.startTime,
        endTime: values.endTime ?? "",
        category: values.category as ActivityCategory,
        priority: values.priority as ActivityPriority,
        status: values.status as ActivityStatus,
        overdue: false,
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog
      key={editingActivity?.id ?? "add"}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="max-w-[640px] p-0 gap-0"
        showCloseButton={false}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
            {/* Header */}
            <DialogHeader className="px-4 pt-5 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-semibold tracking-tight text-primary">
                  {isEditing ? "Edit Item" : "Add New Item"}
                </DialogTitle>
                <DialogClose />
              </div>
            </DialogHeader>

            {/* Body */}
            <div className="px-4 pb-5 space-y-4 sm:px-6 sm:pb-6 sm:space-y-5">
              {/* Activity Name */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Activity Name
                    </FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        placeholder="e.g., Flight to Da Nang"
                        className="h-11 w-full rounded-lg border border-input bg-white px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category & Status */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Category
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 w-full border-input bg-white text-sm">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ACTIVITY_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Status
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 w-full border-input bg-white text-sm">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ACTIVITY_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Date & Time */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Date
                    </FormLabel>
                    <FormControl>
                      <input
                        type="date"
                        {...field}
                        min={minDate}
                        max={maxDate}
                        className="h-11 w-full rounded-lg border border-input bg-white px-4 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        From
                      </FormLabel>
                      <FormControl>
                        <input
                          type="time"
                          {...field}
                          className="h-11 w-full rounded-lg border border-input bg-white px-4 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        To
                      </FormLabel>
                      <FormControl>
                        <input
                          type="time"
                          {...field}
                          className="h-11 w-full rounded-lg border border-input bg-white px-4 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Location
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
                        <input
                          {...field}
                          placeholder="Enter address"
                          className="h-11 w-full rounded-lg border border-input bg-white pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Priority
                    </FormLabel>
                    <FormControl>
                      <div className="flex h-11 gap-1 rounded-lg bg-muted/40 p-1">
                        {(["Low", "Medium", "High"] as const).map((p) => {
                          const selected = field.value === p;
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => field.onChange(p)}
                              className={cn(
                                "flex-1 rounded-md text-sm font-medium transition-all",
                                selected &&
                                  p === "Low" &&
                                  "border border-green-200 bg-green-50 text-green-700",
                                selected &&
                                  p === "Medium" &&
                                  "border border-primary/30 bg-primary/10 text-primary",
                                selected &&
                                  p === "High" &&
                                  "border border-red-200 bg-red-50 text-red-700",
                                !selected && "text-muted-foreground hover:bg-white/60",
                              )}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <DialogFooter className="px-4 pb-5 pt-0 border-t-0 bg-transparent sm:px-6 sm:pb-6">
              <DialogClose asChild>
                <Button variant="ghost" className="text-muted-foreground">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="size-4" />
                {isEditing ? "Save Changes" : "Add to Itinerary"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
