import BudgetPreviewCard from "./BudgetPreviewCard";
import DashboardItinPreviewArea from "./DashboardItinPreviewArea";
import { ProgressCard } from "./ProgressCard";
import TaskAlertCard from "./TaskAlertCard";
import { useBudgetStore, useItineraryStore } from "@/stores";

export function DisplayArea() {
    const itinInfo = useItineraryStore((state) => state.days);
    const allItin = itinInfo.map((days) => days.activities).flat();
    const completedItin = allItin.filter((itin) => itin.status === "Completed")

    const expenses = useBudgetStore((state) => state.expenses).map((expense) => expense.actualCost === null ? 0 : expense.actualCost)
    const totalExpenses = expenses.reduce((acc, cur) => acc + cur, 0)
    
    return (
        <div>
            <div className="lg:gap-[5%] flex min-[450px]:flex-row flex-col pt-5 pb-5 w-full flex-wrap gap-10 items-center justify-center">
                <div className="lg:w-3/10 w-50">
                    <ProgressCard name="itinerary" past={completedItin.length} total={allItin.length}></ProgressCard>
                </div>
                <div className="lg:w-3/10 w-50">
                    <ProgressCard name="packing" past={68} total={100}></ProgressCard>
                </div>
                <div className="lg:w-3/10 w-50">
                    <ProgressCard name="budget" past={totalExpenses} total={12000}></ProgressCard>
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