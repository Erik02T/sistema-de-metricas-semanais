'use client'

import { useState } from 'react'
import { AdaptiveOS } from '@/components/adaptive-os'
import { AdaptiveNext } from '@/components/adaptive-next'

export default function Page() {
  const [nextPhase, setNextPhase] = useState(true)
  return nextPhase ? <AdaptiveNext onBack={() => setNextPhase(false)} /> : <AdaptiveOS />
}
