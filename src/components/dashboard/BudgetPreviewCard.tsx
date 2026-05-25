import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActiveTripMeta } from "@/hooks/useActiveTripMeta";
import { budgetUtils } from "@/lib/utils";

export default function BudgetPreviewCard() {
  const {
    totalBudget,
    totalActual,
    remainingBudget,
    budgetUsagePercent,
  } = useActiveTripMeta();

  const usageWidth = Math.min(100, budgetUsagePercent);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Budget Usage</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-1">
        <div className="flex flex-row justify-between">
          <p className="text-4xl font-bold">
            {budgetUtils.formatMoney(totalActual)}
          </p>
        </div>

        <div className="pt-2.5">
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden mb-5 mt-1">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${usageWidth}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Card className="bg-primary w-[50%]">
            <CardContent>
              <p className="text-sm font-semibold text-primary-foreground">
                {budgetUtils.formatMoney(remainingBudget)}
              </p>
              <p className="text-xs text-primary-foreground uppercase tracking-wide">
                Remaining
              </p>
            </CardContent>
          </Card>
          <div>
            <p className="text-sm font-semibold">
              {budgetUtils.formatMoney(totalBudget)}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Total
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
