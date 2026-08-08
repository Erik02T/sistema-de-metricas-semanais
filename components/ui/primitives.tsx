'use client'

import { forwardRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* ---------------- Input ---------------- */
export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20',
          className,
        )}
        {...props}
      />
    )
  },
)

/* ---------------- Textarea ---------------- */
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full resize-y rounded-lg border border-border bg-background/60 px-3 py-2 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20',
        className,
      )}
      {...props}
    />
  )
})

/* ---------------- Select ---------------- */
export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        'w-full cursor-pointer appearance-none rounded-lg border border-border bg-background/60 px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
})

/* ---------------- Field wrapper ---------------- */
export function Field({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}

/* ---------------- Badge ---------------- */
export function Badge({
  children,
  color,
  className,
}: {
  children: ReactNode
  color?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium',
        className,
      )}
      style={
        color
          ? { color, borderColor: `color-mix(in oklch, ${color} 40%, transparent)`, background: `color-mix(in oklch, ${color} 12%, transparent)` }
          : undefined
      }
    >
      {children}
    </span>
  )
}

/* ---------------- Card ---------------- */
export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm',
        onClick && 'cursor-pointer transition-colors hover:border-primary/40',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ---------------- Tags input (comma separated) ---------------- */
export function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}) {
  return (
    <Input
      value={value.join(', ')}
      placeholder={placeholder ?? 'tag1, tag2'}
      onChange={(e) =>
        onChange(
          e.target.value
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        )
      }
    />
  )
}
