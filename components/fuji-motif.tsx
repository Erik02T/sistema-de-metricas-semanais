'use client'

import { cn } from '@/lib/utils'

/**
 * Mount Fuji beneath the Hinomaru (red sun of the Japanese flag).
 * White snow cap = Fuji + flag field, red circle = the sun.
 * Simple geometric silhouette, used as brand art in headers/dashboard.
 */
export function FujiMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 160"
      className={cn('h-auto w-full', className)}
      role="img"
      aria-label="Mount Fuji beneath the red sun of Japan"
    >
      {/* Hinomaru — the red sun */}
      <circle cx="120" cy="48" r="30" fill="var(--primary)" />

      {/* Mount Fuji body */}
      <path
        d="M20 150 L96 44 Q120 14 144 44 L220 150 Z"
        fill="color-mix(in oklch, var(--foreground) 92%, transparent)"
      />
      {/* Snow cap */}
      <path
        d="M96 60 Q108 52 120 60 Q132 52 144 60 L120 30 Z"
        fill="var(--background)"
        opacity="0.85"
      />
      {/* Base mist line */}
      <rect x="20" y="146" width="200" height="4" rx="2" fill="var(--sakura)" opacity="0.5" />
    </svg>
  )
}
