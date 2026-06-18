'use client'

import { motion } from 'framer-motion'

interface ProgressRingProps {
  value: number
  size?: number
  stroke?: number
  color?: string
  label?: string
  sublabel?: string
}

export function ProgressRing({
  value,
  size = 120,
  stroke = 8,
  color = 'var(--primary)',
  label,
  sublabel,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(Math.max(value, 0), 100)
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 6px color-mix(in oklch, ${color} 50%, transparent))` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label && <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">{label}</span>}
        {sublabel && (
          <span className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{sublabel}</span>
        )}
      </div>
    </div>
  )
}
