import type { ReactNode } from 'react'
import styles from './Chip.module.css'

export type ChipVariant = 'default' | 'solid' | 'outline'

interface ChipProps {
  children: ReactNode
  variant?: ChipVariant
  /** Ajusta as cores para superfícies escuras. */
  onDark?: boolean
  className?: string
}

export function Chip({
  children,
  variant = 'default',
  onDark = false,
  className,
}: ChipProps) {
  const classes = [
    styles.chip,
    variant === 'solid' ? styles.solid : null,
    variant === 'outline' ? styles.outline : null,
    onDark ? styles.onDark : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <span className={classes}>{children}</span>
}
