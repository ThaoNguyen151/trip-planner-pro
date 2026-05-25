import { memo } from "react";
import { MapPin, Clock, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn, formatStartToEndTime } from "@/lib/utils";
import { ActionMenu } from "@/components/shared/ActionMenu";
import type { ItineraryActivity } from "@/types";

const priorityColors: Record<string, string> = {
  High: "bg-red-50 text-red-600 border-red-100",
  Medium: "bg-orange-50 text-orange-600 border-orange-100",
  Low: "bg-slate-50 text-slate-500 border-slate-200",
};

const statusColors: Record<string, string> = {
  Planned: "bg-slate-50 text-slate-500 border-slate-200",
  Confirmed: "bg-green-50 text-green-700 border-green-100",
};

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded border px-2.5 py-0.5 text-[10px] font-bold uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

interface ActivityCardProps {
  activity: ItineraryActivity;
  day: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ActivityCard = memo(function ActivityCard({
  activity,
  onEdit,
  onDelete,
}: ActivityCardProps) {
  return (
    <div className="relative">
      <div className="absolute -left-9.25 top-1/2 -translate-y-1/2 z-10 size-3 rounded-full border-2 border-white bg-primary" />
      <Card className="gap-3 p-4">
        {activity.overdue && (
          <div className="flex items-center gap-3">
            <Badge className="border-destructive bg-destructive text-destructive-foreground">
              Overdue
            </Badge>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-destructive/40">
              <AlertTriangle className="size-3.5" />
              Action Required
            </span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <h4 className="min-w-0 text-base font-bold text-foreground">
              {activity.title}
            </h4>
            <ActionMenu onEdit={onEdit} onDelete={onDelete} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0 text-foreground" />
              <span className="truncate text-foreground/90">
                {activity.location}
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-foreground/90">
              <Clock className="size-4 shrink-0 text-foreground" />
              {/* {activity.startTime} - {activity.endTime} */}
              {formatStartToEndTime(activity.startTime, activity.endTime)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge className="border-primary/20 bg-primary/10 text-primary">
              {activity.category}
            </Badge>
            <Badge className={priorityColors[activity.priority]}>
              Priority: {activity.priority}
            </Badge>
            <Badge className={statusColors[activity.status]}>
              {activity.status}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
});
