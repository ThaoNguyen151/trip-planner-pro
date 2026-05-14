import { Card, CardContent } from "../ui/card"
import { MapPin, PlaneTakeoff, AlarmClock } from "lucide-react"
import { Badge } from "../ui/badge"

export default function DashboardItinPreviewCard() {
    return (
        <Card className="pl-6">
            <CardContent>
                <div className="flex flex-row justify-between">
                    <p className="text-2xl font-bold pb-0.5">Flight to Da Nang</p>
                    <Badge variant={"destructive"}>High</Badge>
                </div>
                <div className="flex flex-row space-x-1.5 items-center">
                    <MapPin className="w-5"/>
                    <p className="text-muted-foreground">Danang International Airport</p>
                </div>
                <div className="h-5"></div>
                <div className="flex flex-row space-x-5 items-center">
                    <div className="flex flex-row space-x-1.5 items-center">
                        <PlaneTakeoff className="w-5" />
                        <p className="text-foreground">Transport</p>
                    </div>
                    <div className="flex flex-row space-x-1.5 items-center">
                        <AlarmClock className="w-5"/>
                        <p className="text-foreground">14:30 pm</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}