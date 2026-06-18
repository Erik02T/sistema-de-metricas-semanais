'use client'

import { motion } from 'framer-motion'
import {
  Compass,
  Gauge,
  CalendarDays,
  Languages,
  Code2,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type SectionId =
  | 'north-star'
  | 'scorecard'
  | 'schedule'
  | 'japanese'
  | 'programming'
  | 'review'

export const NAV: { id: SectionId; label: string; kanji: string; icon: typeof Compass }[] = [
  { id: 'north-star', label: 'North Star', kanji: '北', icon: Compass },
  { id: 'scorecard', label: 'Scorecard', kanji: '点', icon: Gauge },
  { id: 'schedule', label: 'Schedule', kanji: '週', icon: CalendarDays },
  { id: 'japanese', label: 'Japanese', kanji: '語', icon: Languages },
  { id: 'programming', label: 'Programming', kanji: '工', icon: Code2 },
  { id: 'review', label: 'Review', kanji: '省', icon: RefreshCw },
]

export function Sidebar({
  active,
  onChange,
  finalScore,
}: {
  active: SectionId
  onChange: (id: SectionId) => void
  finalScore: number
}) {
  return (
    <aside className="sticky top-0 z-20 hidden h-svh w-72 shrink-0 flex-col border-r border-border glass lg:flex">
      <div className="flex items-center gap-3 px-6 py-7">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary font-jp-serif text-xl font-black text-primary-foreground">
          晶
        </div>
        <div className="leading-tight">
          <p className="font-jp-serif text-lg font-bold tracking-wide">KESSHŌ</p>
          <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Operating System
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {NAV.map((item) => {
          const isActive = active === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl border border-border bg-secondary"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-background/60 font-jp-serif text-base text-primary">
                {item.kanji}
              </span>
              <span className="relative flex items-center gap-2 text-sm font-medium">
                <Icon className="h-4 w-4" strokeWidth={1.6} />
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      <div className="m-4 rounded-2xl border border-border bg-secondary/40 p-4">
        <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Week Score
        </p>
        <div className="mt-1 flex items-end justify-between">
          <span className="font-mono text-3xl font-semibold tabular-nums">{finalScore}%</span>
          <span className="font-jp-serif text-sm text-muted-foreground">合格 85+</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${finalScore}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </aside>
  )
}

export function MobileNav({
  active,
  onChange,
}: {
  active: SectionId
  onChange: (id: SectionId) => void
}) {
  return (
    <nav className="sticky top-0 z-30 flex items-center gap-1 overflow-x-auto border-b border-border glass px-3 py-2 lg:hidden">
      {NAV.map((item) => {
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
              isActive
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground',
            )}
          >
            <span className="font-jp-serif text-primary">{item.kanji}</span>
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
