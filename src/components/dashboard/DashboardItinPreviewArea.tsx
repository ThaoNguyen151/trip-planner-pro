import type { ItineraryActivity } from "@/types";
import DashboardItinPreviewCard from "./DashboardItinPreviewCard";
import { Plane, Utensils, Hotel, Glasses, Clock, ShoppingBag, CircleEllipsis } from "lucide-react";

const iconDict: Record<string, React.ReactNode> = {
    Transport: <Plane />,
    Lodging: <Hotel />,
    Sightseeing: <Glasses />,
    Dining: <Utensils />,
    Shopping: <ShoppingBag />,
    Other: <CircleEllipsis />,
}

interface DashboardItinPreviewAreaProps {
  today: Date;
  itinToday: ItineraryActivity[]
}

export default function DashboardItinPreviewArea(props: DashboardItinPreviewAreaProps) {
    return (
        <div className = "flex flex-col gap-2">
            <div className="pb-5 pl-3.5 flex flex-row items-center space-x-1.5">
                <Clock className="w-5 h-5"/>
                <p className="text-foreground font-bold text-lg">Today is {props.today.getDate()}/{props.today.getMonth() + 1}/{props.today.getFullYear()} </p>
            </div>
            
            {props.itinToday?.length > 0 ? (
                    <div className="space-y-5">
                        {props.itinToday.map((item, index) => (
                        <DashboardItinPreviewCard
                        key={index}
                        name={item.title}
                        location={item.location}
                        category={item.category}
                        time={item.startTime}
                        priority={item.priority}
                        icon={iconDict[item.category]}
                        />
                    ))}
                    </div>
                ) : (
                <div className="flex flex-col w-full lg:items-center max-lg:pl-3.5">                
                    <p className="italic">No activities scheduled today</p>
                </div>
                )}
            
        </div>
    )
}