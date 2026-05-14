import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { FilterDropdownProps } from '@/types/package'

export default function FilterDropdown({ options, value, onChange }: FilterDropdownProps) {
  const isFiltered = value !== options[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'gap-1.5 text-xs font-normal',
            isFiltered && 'border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100',
          )}
        >
          {value}
          {isFiltered && <span className="size-1.5 rounded-full bg-sky-500" />}
          <ChevronDown className="size-3 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((opt, i) => (
          <>
            {i === 1 && <DropdownMenuSeparator key={`sep-${opt}`} />}
            <DropdownMenuItem
              key={opt}
              className={cn(value === opt && 'font-medium text-sky-700')}
              onSelect={() => onChange(opt)}
            >
              {opt}
            </DropdownMenuItem>
          </>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}