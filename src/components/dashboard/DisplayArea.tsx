import DashboardItinPreviewArea from "./DashboardItinPreviewArea";
import { ProgressCard } from "./ProgressCard";


export function DisplayArea() {
    return (
        <div className="">
            <div className="min-[850px]:h-3/10  min-[850px]:gap-[5%] flex flex-col min-[850px]:flex-row">
                <div className="min-[850px]:w-3/10 w-full">
                    <ProgressCard name="itinerary" past={4} total={16}></ProgressCard>
                </div>
                <div className="min-[850px]:w-3/10 w-full">
                    <ProgressCard name="packing" past={68} total={100}></ProgressCard>
                </div>
                <div className="min-[850px]:w-3/10 w-full">
                    <ProgressCard name="budget" past={4200} total={12000}></ProgressCard>
                </div>
            </div>
            <div className="min-[850px]:h-7/10">
                <DashboardItinPreviewArea></DashboardItinPreviewArea>
            </div>
        </div>
    )
}