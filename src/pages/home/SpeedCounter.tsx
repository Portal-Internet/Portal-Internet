import { useEffect, useState } from 'react'
import styles from './SpeedCounter.module.css'

const TARGET = 1000
const DURATION_MS = 1400

interface SpeedCounterProps {
  className?: string
}

/**
 * Selo decorativo do hero: "Conexão até 1000 MB", com o número subindo de 0
 * ao total quando a página abre.
 */
export function SpeedCounter({ className }: SpeedCounterProps) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(TARGET)
      return
    }

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const ratio = Math.min((now - start) / DURATION_MS, 1)
      // easeOutCubic: dispara rápido e estabiliza no fim, como um teste de velocidade.
      const eased = 1 - (1 - ratio) ** 3
      setValue(Math.round((eased * TARGET) / 5) * 5)
      if (ratio < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        setValue(TARGET)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <p className={[styles.counter, className].filter(Boolean).join(' ')}>
      {/* O leitor de tela recebe a frase pronta; o número animado é decorativo. */}
      <span className="sr-only">Conexão de até {TARGET} MB</span>
      <span aria-hidden="true">Conexão de até</span>
      <b aria-hidden="true">{value}</b>
      <em aria-hidden="true">MB</em>
    </p>
  )
}
