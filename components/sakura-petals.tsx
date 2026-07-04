'use client'

import { useMemo } from 'react'

// Lightweight CSS-only cherry blossom petals drifting down the whole screen.
export function SakuraPetals({ count = 14 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 8 + Math.random() * 10,
        duration: 10 + Math.random() * 12,
        delay: Math.random() * 12,
        sway: 0.4 + Math.random() * 0.6,
      })),
    [count],
  )

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.id}
          className="animate-petal absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.85,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            background: `radial-gradient(circle at 30% 30%, var(--sakura-soft), var(--sakura))`,
            borderRadius: '100% 0 100% 0',
            opacity: 0.5,
            filter: 'blur(0.3px)',
          }}
        />
      ))}
    </div>
  )
}
