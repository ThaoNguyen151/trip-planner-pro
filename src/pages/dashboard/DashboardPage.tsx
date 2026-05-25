import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DisplayArea } from "@/components/dashboard/DisplayArea";
/** Dashboard — nội dung sẽ bổ sung sau. */
export default function DashboardPage() {
    return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 rounded-xl bg-muted/40 px-2 py-4 sm:px-4 sm:gap-5 md:px-6 md:py-6 md:gap-6">
      <DashboardHeader></DashboardHeader>
      <DisplayArea></DisplayArea>
    </div>)
  
}
