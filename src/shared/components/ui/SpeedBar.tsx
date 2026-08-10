import { useReveal } from '@/shared/hooks/useReveal'
import styles from './SpeedBar.module.css'

interface SpeedBarProps {
  /** Preenchimento de 0 a 100, relativo ao plano mais rápido. */
  percent: number
  onDark?: boolean
  label?: string
}

export function SpeedBar({ percent, onDark = false, label }: SpeedBarProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>()
  const value = Math.max(0, Math.min(100, percent))

  return (
    <div
      ref={ref}
      className={[styles.track, onDark ? styles.onDark : null].filter(Boolean).join(' ')}
      role="img"
      aria-label={label ?? `Velocidade relativa: ${value}%`}
    >
      <span className={styles.fill} style={{ width: isVisible ? `${value}%` : 0 }} />
    </div>
  )
}
