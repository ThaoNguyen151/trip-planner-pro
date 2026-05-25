import { type ChartConfig } from "@/components/ui/chart"
import { ChartContainer } from "@/components/ui/chart"
import { Pie, PieChart, Label } from "recharts"

type ChartProps = {
    pastC: number,
    totalC: number
}

export function ProgressChart(props: ChartProps) {
    const chartData = [
        {status: "past", items: props.pastC, fill: "var(--color-past)"},
        {status: "standby", items: props.totalC - props.pastC, fill: "var(--color-standby)"},
    ]

    const chartConfig = {
        past: {
            label: "past",
            color: "var(--color-primary)"     //Change to accent color once theme is finalized
        },

        standby: {
            label: "standby",
            color: "var(--color-muted)"
        }
    } satisfies ChartConfig

    const sumItems = chartData.reduce((acc, curr) => acc + curr.items, 0)

    return (

        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-20 w-20">
          <PieChart>
            <Pie data={chartData} dataKey="items" nameKey="status" innerRadius={20} strokeWidth={5} outerRadius={30}><Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle"fontWeight={"bold"} color="foreground">
                          {(Math.round(chartData[0].items / sumItems * 100)).toLocaleString()}%
                      </text>
                    )
                  }
                }}
              /></Pie>
            </PieChart>
        </ChartContainer>

    )
}