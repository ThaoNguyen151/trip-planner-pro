

interface PackingProgressProps {
  totalItems: number
  packedItems: number
}

export function PackingProgress({ totalItems, packedItems }: PackingProgressProps) {
  const remaining = totalItems - packedItems
  const pct = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100)

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700">Packing Progress</span>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>
            <span className="font-semibold text-sky-600">{pct}%</span> Complete
          </span>
          <span className="text-slate-300">|</span>
          <span>
            <span className="font-semibold text-slate-700">{packedItems}/{totalItems}</span> Packed
          </span>
          <span className="text-slate-300">|</span>
          <span>
            <span className="font-semibold text-slate-700">{remaining}</span> Remaining
          </span>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}