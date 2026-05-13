import { type ChartConfig } from "@/components/ui/chart"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Label } from "recharts"

export function ProgressChart() {
    const chartData = [
        {status: "past", items: 4, fill: "var(--color-past)"},
        {status: "standby", items: 12, fill: "var(--color-standby)"},
    ]

    const chartConfig = {
        past: {
            label: "past",
            color: "#2563eb"     //Change to accent color once theme is finalized
        },

        standby: {
            label: "standby",
            color: "#B2BEB5"
        }
    } satisfies ChartConfig

    const sumItems = chartData.reduce((acc, curr) => acc + curr.items, 0)

    return (

        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-20 w-20">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="items" nameKey="status" innerRadius={20} strokeWidth={5} outerRadius={30}><Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle"fontWeight={"bold"} color="muted-foreground">
                          {(chartData[0].items / sumItems * 100).toLocaleString()}%
                      </text>
                    )
                  }
                }}
              /></Pie>
            </PieChart>
        </ChartContainer>

    )
}