import type { Expense } from "@/types";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Button } from "../ui/button";
import { budgetUtils } from "@/lib/utils";
import type { PieLabelRenderProps } from "recharts";

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

interface PieLabelProps extends PieLabelRenderProps {
  name: string;
  value: number;
}

const renderCustomizedLabel = (props: PieLabelRenderProps) => {
  const { cx, cy, midAngle, outerRadius, name, value } = props as PieLabelProps;
  if (
    cx === undefined ||
    cy === undefined ||
    midAngle === undefined ||
    outerRadius === undefined
  ) {
    return null;
  }
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-[10px] font-medium"
    >
      {`${name} (${budgetUtils.formatMoney(value)})`}
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
    <div className="rounded-xl border shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-900">
          {selectedCategory
            ? `${selectedCategory} Breakdown`
            : "Total Spending Structure"}
        </h2>
        {selectedCategory && (
          <Button
            onClick={onReset}
            className="text-xs text-blue-600 hover:underline"
          >
            View All
          </Button>
        )}
      </div>

      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
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
              y="45%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none"
            >
              <tspan
                x="50%"
                dy="-0.5em"
                className="fill-gray-400 text-[10px] font-medium uppercase tracking-widest"
              >
                Total Actual
              </tspan>
              <tspan
                x="50%"
                dy="1.5em"
                className="fill-slate-400 text-sm font-bold"
              >
                {budgetUtils.formatMoney(totalActual)}
              </tspan>
            </text>
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
