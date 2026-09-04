import type { ReactNode } from 'react'
import styles from './Faq.module.css'

export interface FaqEntry {
  question: string
  answer: ReactNode
}

interface FaqProps {
  items: FaqEntry[]
  /** Índice que já nasce aberto. Use `null` para começar tudo fechado. */
  defaultOpenIndex?: number | null
}

export function Faq({ items, defaultOpenIndex = 0 }: FaqProps) {
  return (
    <div className={styles.list}>
      {items.map((item, index) => (
        <details
          key={item.question}
          className={styles.item}
          open={index === defaultOpenIndex}
        >
          <summary className={styles.summary}>{item.question}</summary>
          <div className={styles.body}>{item.answer}</div>
        </details>
      ))}
    </div>
  )
}
