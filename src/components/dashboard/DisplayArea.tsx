import { usePackingStore } from "@/stores/usePackingStore";
import BudgetPreviewCard from "./BudgetPreviewCard";
import DashboardItinPreviewArea from "./DashboardItinPreviewArea";
import { ProgressCard } from "./ProgressCard";
import TaskAlertCard from "./TaskAlertCard";
import { useActiveTripMeta } from "@/hooks/useActiveTripMeta";
import { useItineraryStore} from "@/stores/useItineraryStore";

export function DisplayArea() {
    const { totalActual, totalBudget } = useActiveTripMeta();
    const todayDate = new Date();

    const allItin = useItineraryStore((state) => state.days);
    const itinActivities = allItin.map((day) => day.activities).flat();
    const completedActivity = itinActivities.filter((item) => item.status === "Completed");

    const allPacking = usePackingStore((state) => state.categories);
    const packingItems = allPacking.map((category) => category.items).flat();
    const packedItems = packingItems.filter((item) => item.packed === true);

    return (
        <div>
            <div className="lg:gap-[5%] flex min-[450px]:flex-row flex-col pt-5 pb-5 w-full flex-wrap gap-10 items-center justify-center">
                <div className="lg:w-3/10 w-50">
                    <ProgressCard name="itinerary" past={completedActivity.length} total={itinActivities.length}></ProgressCard>
                </div>
                <div className="lg:w-3/10 w-50">
                    <ProgressCard name="packing" past={packedItems.length} total={packingItems.length}></ProgressCard>
                </div>
                <div className="lg:w-3/10 w-50">
                    <ProgressCard name="budget" past={totalActual} total={totalBudget}></ProgressCard>
                </div>
            </div>
            <div className="lg:gap-[5%] flex flex-col lg:flex-row w-full gap-5">
                <div className="lg:w-[65%] w-full">
                    <DashboardItinPreviewArea today={todayDate} itinToday={[]}></DashboardItinPreviewArea>
                </div>
                <div className="lg:w-3/10">
                    <div className="flex flex-col gap-5">
                        <BudgetPreviewCard></BudgetPreviewCard>
                        <TaskAlertCard numOverdue={5} numUnpaid={1}></TaskAlertCard>
                    </div>
                </div>
            </div>
        </div>
    )
}