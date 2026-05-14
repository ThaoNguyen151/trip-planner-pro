import DashboardItinPreviewCard from "./DashboardItinPreviewCard";
import { Clock, PlaneTakeoff, House, Glasses } from "lucide-react";

const iconDict = {
    Transport: <PlaneTakeoff></PlaneTakeoff>, 
    Hotel: <House></House>,
    Sightseeing: <Glasses></Glasses>
}

export default function DashboardItinPreviewArea() {
    const tempData = [{
        name: "Family Trip to Da Nang",
        location: "Da nang International Airport",
        category: "Transport",
        time: "14:00 PM",
        priority: "High",
    },
    {
        name: "Hotel Check-in",
        location: "International DaNang Sun Peninsula",
        category: "Hotel",
        time: "18:00 PM",
        priority: "Medium",
    },
    {
        name: "Visit My Khe Beach",
        location: "My Khe Beach, Da Nang",
        category: "Sightseeing",
        time: "19:00 PM",
        priority: "Low",
    }] as const;
    
    return (
        <div>
            <div className="pb-5 pl-3.5 flex flex-row items-center space-x-1.5">
                <Clock className="w-5"/>
                <p className="text-foreground font-bold text-lg">Today is 15/05/2024</p>
            </div>
            
            <div className="space-y-5">
                {tempData?.length > 0 ? (
                    tempData.map((item, index) => (
                        <DashboardItinPreviewCard
                        key={index}
                        name={item.name}
                        location={item.location}
                        category={item.category}
                        time={item.time}
                        priority={item.priority}
                        icon={iconDict[item.category]}
                        />
                    ))
                ) : (
                <p>No items found.</p>
                )}
            </div>
        </div>
    )
}