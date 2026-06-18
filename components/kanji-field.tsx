'use client'

import { motion } from 'framer-motion'

const GLYPHS = [
  { c: '集', top: '8%', left: '6%', size: 'text-[8rem]', delay: 0 },
  { c: '中', top: '54%', left: '2%', size: 'text-[11rem]', delay: 1.2 },
  { c: '道', top: '18%', left: '82%', size: 'text-[9rem]', delay: 0.6 },
  { c: '集', top: '70%', left: '74%', size: 'text-[7rem]', delay: 1.8 },
  { c: '力', top: '40%', left: '46%', size: 'text-[13rem]', delay: 0.9 },
]

export function KanjiField() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 grain opacity-40" />
      {GLYPHS.map((g, i) => (
        <motion.span
          key={i}
          className={`absolute select-none font-jp-serif ${g.size} font-black text-foreground/[0.025]`}
          style={{ top: g.top, left: g.left }}
          animate={{ y: [0, -16, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 12, delay: g.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {g.c}
        </motion.span>
      ))}
      <div
        className="absolute -top-40 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: 'var(--primary)' }}
      />
    </div>
  )
}
