import type { ElementType, ReactNode } from 'react'
import { useReveal } from '@/shared/hooks/useReveal'
import styles from './Reveal.module.css'

interface RevealProps {
  children: ReactNode
  /** Elemento renderizado — mantém a semântica correta de cada contexto. */
  as?: ElementType
  className?: string
  /** Atraso da animação, em milissegundos. */
  delay?: number
  /** Permite usar o bloco como alvo de âncora. */
  id?: string
}

export function Reveal({
  children,
  as: Tag = 'div',
  className,
  delay = 0,
  id,
}: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>()

  const classes = [styles.reveal, isVisible ? styles.visible : null, className]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag
      ref={ref}
      id={id}
      className={classes}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
