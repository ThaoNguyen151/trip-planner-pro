import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
}

export interface FilterSelectionProps<T extends string = string> {
  label: string;
  options: FilterOption<T>[];
  value: T | T[];
  onChange: (value: T | T[]) => void;
  multi?: boolean;
}

function FilterSelection<T extends string = string>({
  label,
  options,
  value,
  onChange,
  multi = false,
}: FilterSelectionProps<T>) {
  if (options.length === 0) return null;

  const isSelected = (opt: FilterOption<T>) => {
    if (multi && Array.isArray(value)) {
      return value.includes(opt.value);
    }
    return value === opt.value;
  };

  const handleClick = (opt: FilterOption<T>) => {
    if (multi && Array.isArray(value)) {
      const next = value.includes(opt.value)
        ? value.filter((v) => v !== opt.value)
        : [...value, opt.value];
      onChange(next);
    } else {
      onChange(opt.value);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = isSelected(opt);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleClick(opt)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-muted",
              )}
            >
              {multi && active && <Check className="size-3.5" />}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterSelection;
