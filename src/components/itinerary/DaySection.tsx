import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActivityCard } from "@/components/itinerary/ActivityCard";
import type { ItineraryActivity } from "@/types";

function DayDot({ day, active }: { day: number; active: boolean }) {
  return (
    <div className="absolute -left-12 top-0 z-10 flex flex-col items-center md:-left-14">
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-full text-base font-bold text-white shadow-lg md:size-12 md:text-lg",
          active ? "bg-primary" : "bg-primary/40",
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
  activities: ItineraryActivity[];
  forceExpand?: boolean;
  onEditActivity?: (activity: ItineraryActivity, day: number) => void;
  onDeleteActivity?: (day: number, activityId: string) => void;
}

export function DaySection({
  day,
  date,
  activities,
  forceExpand = false,
  onEditActivity,
  onDeleteActivity,
}: DaySectionProps) {
  const [collapsed, setCollapsed] = useState(false);
  const expanded = forceExpand || !collapsed;

  return (
    <div className="relative mb-8 md:mb-12">
      <DayDot day={day} active={expanded} />
      <div className="mb-6 flex items-center justify-between">
        <h3 className="min-w-0 truncate text-base font-bold text-foreground md:text-lg">{date}</h3>
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="shrink-0 rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted"
        >
          {collapsed ? (
            <ChevronDown className="size-5" />
          ) : (
            <ChevronUp className="size-5" />
          )}
        </button>
      </div>
      {expanded && (
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
