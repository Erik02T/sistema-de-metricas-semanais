'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useOS } from '@/lib/store'
import { formatRange, shiftWeek, weekNumber, weekOptions, currentWeekId } from '@/lib/week'
import { Select } from '@/components/ui/primitives'

export function WeekSwitcher() {
  const activeWeek = useOS((s) => s.activeWeek)
  const setActiveWeek = useOS((s) => s.setActiveWeek)
  const options = weekOptions(activeWeek, 12)
  const isCurrent = activeWeek === currentWeekId()

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card/80 p-3 backdrop-blur-sm">
      <button
        onClick={() => setActiveWeek(shiftWeek(activeWeek, -1))}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Previous week"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex min-w-0 flex-1 flex-col items-center text-center sm:flex-none sm:items-start sm:text-left">
        <div className="flex items-center gap-2">
          <span className="font-heading text-lg font-bold">Week {weekNumber(activeWeek)}</span>
          {isCurrent && (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              Now
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{formatRange(activeWeek)}</span>
      </div>

      <button
        onClick={() => setActiveWeek(shiftWeek(activeWeek, 1))}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Next week"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <Select
        value={activeWeek}
        onChange={(e) => setActiveWeek(e.target.value)}
        className="ml-auto w-auto min-w-40"
      >
        {options.map((id) => (
          <option key={id} value={id}>
            Week {weekNumber(id)} · {formatRange(id)}
          </option>
        ))}
      </Select>

      {!isCurrent && (
        <button
          onClick={() => setActiveWeek(currentWeekId())}
          className="rounded-lg border border-border bg-background/60 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Today
        </button>
      )}
    </div>
  )
}
