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
            isFiltered && 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20',
          )}
        >
          {value}
          {isFiltered && <span className="size-1.5 rounded-full bg-primary" />}
          <ChevronDown className="size-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((opt, i) => (
          <>
            {i === 1 && <DropdownMenuSeparator key={`sep-${opt}`} />}
            <DropdownMenuItem
              key={opt}
              className={cn(value === opt && 'font-medium text-primary')}
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