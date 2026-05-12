export function BudgetHeader({ totalBudget }: { totalBudget: number }) {
  return (
    <div className="mb-10 flex flex-col gap-2 text-left">
      <div className="flex items-center gap-2 mb-1">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-700" />
        <span className="text-sm font-semibold uppercase tracking-wider text-slate-900">
          Total Budget: $
          {totalBudget.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>
      <h1 className="text-4xl font-bold mb-2 tracking-tight text-slate-900">
        Da Nang Family Trip
      </h1>
      <p className="text-slate-500 text-md">
        Comprehensive budget tracking for the 7-day excursion
      </p>
    </div>
  );
}
