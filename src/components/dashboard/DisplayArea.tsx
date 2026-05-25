import BudgetPreviewCard from "./BudgetPreviewCard";
import DashboardItinPreviewArea from "./DashboardItinPreviewArea";
import { ProgressCard } from "./ProgressCard";
import TaskAlertCard from "./TaskAlertCard";
import { useBudgetStore, useItineraryStore } from "@/stores";

export function DisplayArea() {
    const itinInfo = useItineraryStore((state) => state.days);
    const todayDate = new Date();

    const allItin = itinInfo.map((days) => days.activities).flat();
    const completedItin = allItin.filter((itin) => itin.status === "Completed")
    const overdueItin = allItin.filter((itin) => itin.overdue && itin.overdue === true)
    const potentialTodayActivity = itinInfo.filter((days) => `${todayDate.getMonth()} ${todayDate.getDate()}, ${todayDate.getFullYear()}` === days.date)

    const allExpenseItems = useBudgetStore((state) => state.expenses)
    const paidItems = allExpenseItems.filter((item) => item.paymentStatus === "Paid")
    const expenses = paidItems.map((expense) => expense.actualCost ? expense.actualCost : 0)
    const totalExpenses = expenses.reduce((acc, cur) => acc + cur, 0)
    const unpaidItems = allExpenseItems.filter((expense) => expense.paymentStatus === "Unpaid")

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
                    <DashboardItinPreviewArea today={todayDate} itinToday={potentialTodayActivity.length > 0 ? potentialTodayActivity[0].activities : []}></DashboardItinPreviewArea>
                </div>
                <div className="lg:w-3/10">
                    <div className="flex flex-col gap-5">
                        <BudgetPreviewCard></BudgetPreviewCard>
                        <TaskAlertCard numOverdue={overdueItin.length} numUnpaid={unpaidItems.length}></TaskAlertCard>
                    </div>
                </div>
            </div>
        </div>
    )
}