import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatMoneyInput } from "@/lib/money-input";
import { cn } from "@/lib/utils";

export interface TripFormValues {
  tripName: string;
  tripBudget: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}
interface CreateTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: TripFormValues) => void;
}

export function CreateTripDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateTripDialogProps) {
  const [tripName, setTripName] = useState("");
  const [tripBudget, setTripBudget] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const handleCreate = () => {
    if (!tripName.trim() || !startDate || !endDate) return;
    onSubmit?.({ tripName, tripBudget, startDate, endDate });
    setTripName("");
    setTripBudget("");
    setStartDate(undefined);
    setEndDate(undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100vw-2rem)] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Trip</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tripName">Trip Name</Label>
            <Input
              id="tripName"
              placeholder="e.g., Summer in Santorini"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tripBudget">Trip Budget</Label>
            <Input
              id="tripBudget"
              inputMode="numeric"
              placeholder="e.g., 10.000.000"
              value={tripBudget}
              onChange={(e) =>
                setTripBudget(formatMoneyInput(e.target.value))
              }
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {startDate ? format(startDate, "MM/dd/yyyy") : "mm/dd/yyyy"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    defaultMonth={startDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {endDate ? format(endDate, "MM/dd/yyyy") : "mm/dd/yyyy"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => (startDate ? date < startDate : false)}
                    defaultMonth={endDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Add Trip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
