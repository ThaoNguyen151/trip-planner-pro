import type { Expense } from "@/types";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Button } from "../ui/button";
import { budgetUtils } from "@/lib/utils";

const COLORS = [
  "#0ea5e9",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f59e0b",
];

interface PieChartProps {
  expenses: Expense[];
  selectedCategory: string | null;
  onReset: () => void;
}

interface CustomPieLabelProps {
  cx: number;
  cy: number;
  x: number;
  y: number;
  name: string;
  value: number;
}

const renderCustomizedLabel = (props: unknown) => {
  const labelProps = props as CustomPieLabelProps;
  const { cx, value, name, x, y } = labelProps;

  if (
    cx === undefined ||
    x === undefined ||
    y === undefined ||
    value === undefined ||
    name === undefined
  ) {
    return null;
  }

  if (typeof window !== "undefined" && window.innerWidth < 1024) return null;

  const isRightSide = x > cx;

  return (
    <text
      x={x}
      y={y}
      textAnchor={isRightSide ? "start" : "end"}
      dominantBaseline="central"
      className="fill-foreground text-[10px] font-semibold"
    >
      <tspan x={x} dy="-0.2em">
        {name}
      </tspan>
      <tspan x={x} dy="1.2em" className="fill-foreground font-bold text-[9px]">
        ({budgetUtils.formatMoney(value)})
      </tspan>
    </text>
  );
};

export function ExpensePieChart({
  expenses,
  selectedCategory,
  onReset,
}: PieChartProps) {
  const chartData = React.useMemo(() => {
    if (!selectedCategory) {
      const categoryMap: Record<string, number> = {};
      expenses.forEach((exp) => {
        if (exp.actualCost && exp.actualCost > 0) {
          categoryMap[exp.category] =
            (categoryMap[exp.category] ?? 0) + exp.actualCost;
        }
      });
      return Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value,
      }));
    }
    return expenses
      .filter(
        (exp) =>
          exp.category === selectedCategory &&
          exp.actualCost &&
          exp.actualCost > 0,
      )
      .map((exp) => ({ name: exp.name, value: exp.actualCost }));
  }, [expenses, selectedCategory]);

  const totalActual = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-xl border shadow-sm h-full flex flex-col p-4 md:p-6 bg-card min-h-[400px]">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="text-lg md:text-xl font-bold text-foreground">
          {selectedCategory
            ? `${selectedCategory} Breakdown`
            : "Total Spending Structure"}
        </h2>
        {selectedCategory && (
          <Button
            onClick={onReset}
            variant="ghost"
            className="text-[10px] md:text-xs text-foreground hover:underline h-8 px-2"
          >
            View All
          </Button>
        )}
      </div>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          {chartData.length > 0 ? (
            <PieChart margin={{ top: 20, bottom: 20, left: 50, right: 50 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="42%"
                innerRadius="55%"
                outerRadius="70%"
                dataKey="value"
                label={renderCustomizedLabel}
                labelLine={{ stroke: "var(--border)", strokeWidth: 1 }}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <text
                x="50%"
                y="42%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none"
              >
                <tspan
                  x="50%"
                  dy="-0.5em"
                  className="fill-muted-foreground text-[10px] font-medium uppercase tracking-widest"
                >
                  Total Actual
                </tspan>
                <tspan
                  x="50%"
                  dy="1.5em"
                  className="fill-foreground text-sm font-bold"
                >
                  {budgetUtils.formatMoney(totalActual)}
                </tspan>
              </text>
              <Legend
                verticalAlign="bottom"
                align="center"
                layout="horizontal"
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-[11px] text-foreground font-medium">
                    {value}
                  </span>
                )}
                wrapperStyle={{
                  paddingTop: "10px",
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "4px",
                }}
              />
            </PieChart>
          ) : (
            <PieChart>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-sm italic"
              >
                No paid expenses to track spending structure.
              </text>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
