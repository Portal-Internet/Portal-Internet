import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  /** Ícone, número ou emoji exibido ao lado do título. */
  icon?: ReactNode
  /** Título exibido ao lado do ícone. */
  title?: ReactNode
  onDark?: boolean
  /** Anima a entrada quando o card aparece na tela. */
  animated?: boolean
  className?: string
}

export function Card({
  children,
  icon,
  title,
  onDark = false,
  animated = true,
  className,
}: CardProps) {
  const classes = [styles.card, onDark ? styles.onDark : null, className]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {icon || title ? (
        <div className={styles.header}>
          {icon ? <div className={styles.icon}>{icon}</div> : null}
          {title ? <h3 className={styles.title}>{title}</h3> : null}
        </div>
      ) : null}
      {children}
    </>
  )

  if (!animated) {
    return <article className={classes}>{content}</article>
  }

  return (
    <Reveal as="article" className={classes}>
      {content}
    </Reveal>
  )
}

interface CardGridProps {
  children: ReactNode
  /** Colunas no desktop. Abaixo de 1024px o grid se ajusta sozinho. */
  columns?: 1 | 2 | 3
  className?: string
}

export function CardGrid({ children, columns = 3, className }: CardGridProps) {
  return (
    <div
      className={[styles.grid, className].filter(Boolean).join(' ')}
      data-columns={columns}
    >
      {children}
    </div>
  )
}
