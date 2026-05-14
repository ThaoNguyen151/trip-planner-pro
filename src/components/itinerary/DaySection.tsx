import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useItineraryStore } from "@/stores";
import { ActivityCard } from "@/components/itinerary/ActivityCard";
import type { ItineraryActivity } from "@/types";

function DayDot({ day, active }: { day: number; active: boolean }) {
  return (
    <div className="absolute -left-14 top-0 z-10 flex flex-col items-center">
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg",
          active ? "bg-blue-700" : "bg-blue-300",
        )}
      >
        {day}
      </div>
    </div>
  );
}

interface DaySectionProps {
  day: number;
  date: string;
  collapsed: boolean;
  activities: ItineraryActivity[];
  onEditActivity?: (activity: ItineraryActivity, day: number) => void;
  onDeleteActivity?: (day: number, activityId: string) => void;
}

export function DaySection({
  day,
  date,
  collapsed,
  activities,
  onEditActivity,
  onDeleteActivity,
}: DaySectionProps) {
  const toggleCollapse = useItineraryStore((s) => s.toggleCollapse);

  return (
    <div className="relative mb-12">
      <DayDot day={day} active={!collapsed} />
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">{date}</h3>
        <button
          onClick={() => toggleCollapse(day)}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted"
        >
          {collapsed ? (
            <ChevronDown className="size-5" />
          ) : (
            <ChevronUp className="size-5" />
          )}
        </button>
      </div>
      {!collapsed && (
        <div className="space-y-3">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              day={day}
              onEdit={
                onEditActivity ? () => onEditActivity(activity, day) : undefined
              }
              onDelete={
                onDeleteActivity
                  ? () => onDeleteActivity(day, activity.id)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
