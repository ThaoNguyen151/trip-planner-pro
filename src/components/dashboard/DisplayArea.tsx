import BudgetPreviewCard from "./BudgetPreviewCard";
import DashboardItinPreviewArea from "./DashboardItinPreviewArea";
import { ProgressCard } from "./ProgressCard";
import TaskAlertCard from "./TaskAlertCard";


export function DisplayArea() {
    return (
        <div>
            <div className="lg:gap-[5%] flex min-[450px]:flex-row flex-col pt-5 pb-5 w-full flex-wrap gap-10 items-center justify-center">
                <div className="lg:w-3/10 w-50">
                    <ProgressCard name="itinerary" past={4} total={16}></ProgressCard>
                </div>
                <div className="lg:w-3/10 w-50">
                    <ProgressCard name="packing" past={68} total={100}></ProgressCard>
                </div>
                <div className="lg:w-3/10 w-50">
                    <ProgressCard name="budget" past={4200} total={12000}></ProgressCard>
                </div>
            </div>
            <div className="lg:gap-[5%] flex flex-col lg:flex-row w-full gap-5">
                <div className="lg:w-[65%] w-full">
                    <DashboardItinPreviewArea></DashboardItinPreviewArea>
                </div>
                <div className="lg:w-3/10">
                    <div className="flex flex-col gap-5">
                        <BudgetPreviewCard></BudgetPreviewCard>
                        <TaskAlertCard></TaskAlertCard>
                    </div>
                </div>
            </div>
        </div>
    )
}