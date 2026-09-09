import * as React from 'react'
import { cn } from '@/lib/utils'

export function Badge({ className, variant = 'secondary', children }: { className?: string; variant?: 'default' | 'secondary' | 'outline'; children: React.ReactNode }) {
  return <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium', variant === 'default' ? 'border-primary bg-primary text-primary-foreground' : variant === 'outline' ? 'border-border bg-transparent text-foreground' : 'border-transparent bg-muted text-muted-foreground', className)}>{children}</span>
}
