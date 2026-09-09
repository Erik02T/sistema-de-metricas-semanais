import * as React from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, children }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn('rounded-xl border border-border bg-card text-card-foreground shadow-sm', className)}>{children}</div> }
export function CardHeader({ className, children }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn('flex flex-col gap-2 p-6', className)}>{children}</div> }
export function CardTitle({ className, children }: React.HTMLAttributes<HTMLHeadingElement>) { return <h3 className={cn('font-heading font-semibold leading-none tracking-tight', className)}>{children}</h3> }
export function CardDescription({ className, children }: React.HTMLAttributes<HTMLParagraphElement>) { return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p> }
export function CardContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn('p-6 pt-0', className)}>{children}</div> }
