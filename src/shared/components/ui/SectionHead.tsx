import type { ReactNode } from 'react'
import styles from './SectionHead.module.css'

interface SectionHeadProps {
  kicker?: string
  title: ReactNode
  description?: ReactNode
  centered?: boolean
  onDark?: boolean
  /** Nível do heading — a home usa h2, mas o bloco pode ser secundário. */
  as?: 'h2' | 'h3'
  className?: string
}

export function SectionHead({
  kicker,
  title,
  description,
  centered = false,
  onDark = false,
  as: Heading = 'h2',
  className,
}: SectionHeadProps) {
  const classes = [
    styles.head,
    centered ? styles.centered : null,
    onDark ? styles.onDark : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      {kicker ? <span className={styles.kicker}>{kicker}</span> : null}
      <Heading className={styles.title}>{title}</Heading>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  )
}
