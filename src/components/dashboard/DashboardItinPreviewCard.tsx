import { Card, CardContent } from "../ui/card"
import { MapPin, AlarmClock } from "lucide-react"
import { Badge } from "../ui/badge"

interface ItinPreviewCardProps {
  name: string;
  location: string;
  category: "Transport" | "Food" | "Sightseeing" | "Shopping"| "Hotel" | "Other";
  time: string;
  priority: "Low" | "Medium" | "High";
  icon: React.ReactNode;
}

const BadgeVariantDict = {
    High: "destructive",
    Medium: "default",
    Low: "secondary"
} as const

export default function DashboardItinPreviewCard(props: ItinPreviewCardProps) {
    return (
        <Card className="pl-6">
            <CardContent>
                <div className="flex flex-row justify-between items-center">
                    <p className="text-2xl font-bold pb-0.5">{props.name}</p>
                    <Badge variant={BadgeVariantDict[props.priority]} className="self-start mt-1.5">{props.priority}</Badge>
                </div>
                <div className="flex flex-row space-x-1.5 items-center">
                    <MapPin className="w-5"/>
                    <p className="text-muted-foreground">{props.location}</p>
                </div>
                <div className="h-5"></div>
                <div className="flex flex-row space-x-5 items-center">
                    <div className="flex flex-row space-x-1.5 items-center">
                        <div className="w-5">{props.icon}</div>
                        <p className="text-foreground">{props.category}</p>
                    </div>
                    <div className="flex flex-row space-x-1.5 items-center">
                        <AlarmClock className="w-5"/>
                        <p className="text-foreground">{props.time}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}