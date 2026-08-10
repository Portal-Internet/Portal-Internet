import type { ElementType, ReactNode } from 'react'
import styles from './Layout.module.css'

interface ContainerProps {
  children: ReactNode
  as?: ElementType
  className?: string
}

/** Largura máxima e respiro lateral padrão do site. */
export function Container({ children, as: Tag = 'div', className }: ContainerProps) {
  return (
    <Tag className={[styles.container, className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  )
}

export type SectionTone = 'default' | 'paper' | 'mint' | 'green'

interface SectionProps {
  children: ReactNode
  tone?: SectionTone
  /** Reduz o respiro vertical. */
  tight?: boolean
  id?: string
  className?: string
}

/** Bloco de página com o ritmo vertical e o fundo padronizados. */
export function Section({
  children,
  tone = 'default',
  tight = false,
  id,
  className,
}: SectionProps) {
  const classes = [
    styles.section,
    tight ? styles.sectionTight : null,
    tone === 'paper' ? styles.paper : null,
    tone === 'mint' ? styles.mint : null,
    tone === 'green' ? styles.green : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section id={id} className={classes}>
      <Container>{children}</Container>
    </section>
  )
}
