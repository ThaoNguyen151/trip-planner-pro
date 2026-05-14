import DashboardItinPreviewCard from "./DashboardItinPreviewCard";
import { Clock } from "lucide-react";

export default function DashboardItinPreviewArea() {
    return (
        <div>
            <div className="pt-5 pb-5 pl-3.5 flex flex-row items-center space-x-1.5">
                <Clock className="w-5"/>
                <p className="text-foreground font-bold text-lg">Today is 15/05/2024</p>
            </div>
            
            <div>
                <DashboardItinPreviewCard></DashboardItinPreviewCard>
            </div>
        </div>
    )
}