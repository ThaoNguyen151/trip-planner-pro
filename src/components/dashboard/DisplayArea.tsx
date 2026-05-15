import BudgetPreviewCard from "./BudgetPreviewCard";
import DashboardItinPreviewArea from "./DashboardItinPreviewArea";
import { ProgressCard } from "./ProgressCard";


export function DisplayArea() {
    return (
        <div>
            <div className="min-[850px]:h-3/10  min-[850px]:gap-[5%] flex min-[450px]:flex-row flex-col pt-5 pb-5 w-full flex-wrap gap-5 items-center justify-center">
                <div className="min-[850px]:w-3/10 w-50">
                    <ProgressCard name="itinerary" past={4} total={16}></ProgressCard>
                </div>
                <div className="min-[850px]:w-3/10 w-50">
                    <ProgressCard name="packing" past={68} total={100}></ProgressCard>
                </div>
                <div className="min-[850px]:w-3/10 w-50">
                    <ProgressCard name="budget" past={4200} total={12000}></ProgressCard>
                </div>
            </div>
            <div className="min-[850px]:h-7/10 lg:gap-[5%] flex flex-col lg:flex-row w-full gap-5">
                <div className="lg:w-[65%] w-full">
                    <DashboardItinPreviewArea></DashboardItinPreviewArea>
                </div>
                <div className="lg:w-3/10">
                    <div>
                        <BudgetPreviewCard></BudgetPreviewCard>
                    </div>
                </div>
            </div>
        </div>
    )
}