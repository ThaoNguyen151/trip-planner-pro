import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DisplayArea } from "@/components/dashboard/DisplayArea";
import { useTripStore } from "@/stores";
// import { ProgressCard } from "@/components/dashboard/ProgressCard";
/** Dashboard — nội dung sẽ bổ sung sau. */
export default function DashboardPage() {
  const allTrips = useTripStore.getState().trips;
  const handleAddTrip = useTripStore.getState().addTrip;
  if (allTrips.length === 0) {
    return (
      <div>
        <h1>No trips found</h1>
        <p>No trip details to display</p>
        <button className="bg-amber-500" onClick={() => handleAddTrip("Da Nang Family Trip")}>Add Trip</button>
      </div>
    )
  } else {
    return (
    <div>
      <DashboardHeader></DashboardHeader>
      <DisplayArea></DisplayArea>
    </div>)
  }
  
}
