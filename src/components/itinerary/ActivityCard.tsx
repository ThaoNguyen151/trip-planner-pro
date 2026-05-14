import { MapPin, Clock, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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

export function ActivityCard({
  activity,
  onEdit,
  onDelete,
}: ActivityCardProps) {
  return (
    <div className="relative">
      <div className="absolute -left-9.25 top-1/2 -translate-y-1/2 z-10 size-3 rounded-full border-2 border-white bg-blue-500" />
      <Card className="gap-3 p-4">
        {activity.overdue && (
          <div className="flex items-center gap-3">
            <Badge className="border-red-600 bg-red-600 text-white">
              Overdue
            </Badge>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-red-600">
              <AlertTriangle className="size-3.5" />
              Action Required
            </span>
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2.5">
            <h4 className="text-base font-bold text-foreground">
              {activity.title}
            </h4>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-slate-400" />
                {activity.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4 text-slate-400" />
                {activity.startTime} - {activity.endTime}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Badge className="border-blue-100 bg-blue-50 text-blue-600">
              {activity.category}
            </Badge>
            <Badge className={priorityColors[activity.priority]}>
              Priority: {activity.priority}
            </Badge>
            <Badge className={statusColors[activity.status]}>
              {activity.status}
            </Badge>
            <ActionMenu onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>
      </Card>
    </div>
  );
}
