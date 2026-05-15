import { CircleAlert, CircleCheck } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"

export default function TaskAlertCard() {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Task Alert</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-center gap-3 rounded-lg border p-3 bg-muted">
                    <CircleCheck className="w-5 h-5 shrink-0 text-muted-foreground" />
                    <span className="text-sm flex-1">Overdue Activities</span>
                    <span className="text-sm font-semibold">5</span>
                </div>
                <div className="flex items-center justify-center gap-3 rounded-lg border p-3 bg-destructive/10">
                    <CircleAlert className="w-5 h-5 shrink-0 text-destructive" />
                    <span className="text-sm flex-1">Unpaid Items</span>
                    <span className="text-sm font-semibold">3</span>
                </div>
            </CardContent>
      </Card>
    )
}