'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { JP_ACTIVE, JP_PASSIVE, type ChecklistItem } from '@/lib/data'
import { usePOS } from '@/lib/store'
import { ProgressRing } from '@/components/progress-ring'
import { SectionHeader } from '@/components/section-header'
import { cn } from '@/lib/utils'

function CheckRow({
  item,
  done,
  onToggle,
  color,
}: {
  item: ChecklistItem
  done: boolean
  onToggle: () => void
  color: string
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
        done ? 'border-border bg-secondary/60' : 'border-border bg-background/40 hover:bg-secondary/30',
      )}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-lg font-jp-serif text-base"
        style={{ color, background: 'var(--background)' }}
      >
        {item.kanji}
      </span>
      <span
        className={cn(
          'flex-1 text-sm font-medium transition-colors',
          done && 'text-muted-foreground line-through',
        )}
      >
        {item.label}
      </span>
      <span
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded-md border transition-colors',
          done ? 'border-transparent text-primary-foreground' : 'border-border',
        )}
        style={done ? { background: color } : undefined}
      >
        {done && <Check className="h-3.5 w-3.5" />}
      </span>
    </button>
  )
}

export function Japanese() {
  const jpActive = usePOS((s) => s.jpActive)
  const jpPassive = usePOS((s) => s.jpPassive)
  const toggleJp = usePOS((s) => s.toggleJp)

  const activeDone = JP_ACTIVE.filter((i) => jpActive[i.id]).length
  const passiveDone = JP_PASSIVE.filter((i) => jpPassive[i.id]).length
  const activePct = Math.round((activeDone / JP_ACTIVE.length) * 100)
  const passivePct = Math.round((passiveDone / JP_PASSIVE.length) * 100)

  return (
    <section>
      <SectionHeader
        kanji="語"
        eyebrow="Japanese Dashboard"
        title="Active study meets daily immersion"
        description="40% deliberate practice, 60% passive input. Minimum one hour of Japanese every single day."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-jp-serif text-lg font-bold text-primary">能動 · Active Study</p>
              <p className="text-sm text-muted-foreground">Deliberate practice — 40%</p>
            </div>
            <ProgressRing value={activePct} size={72} stroke={6} color="var(--primary)" label={`${activePct}`} />
          </div>
          <div className="space-y-2">
            {JP_ACTIVE.map((item) => (
              <CheckRow
                key={item.id}
                item={item}
                done={!!jpActive[item.id]}
                onToggle={() => toggleJp('active', item.id)}
                color="var(--primary)"
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-jp-serif text-lg font-bold text-aoi">受動 · Passive Immersion</p>
              <p className="text-sm text-muted-foreground">Daily input — 60%</p>
            </div>
            <ProgressRing value={passivePct} size={72} stroke={6} color="var(--aoi)" label={`${passivePct}`} />
          </div>
          <div className="space-y-2">
            {JP_PASSIVE.map((item) => (
              <CheckRow
                key={item.id}
                item={item}
                done={!!jpPassive[item.id]}
                onToggle={() => toggleJp('passive', item.id)}
                color="var(--aoi)"
              />
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-aoi/30 bg-aoi/5 p-4">
            <p className="text-sm text-muted-foreground">
              Target: <span className="font-mono font-semibold text-foreground">1 hour / day minimum</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
