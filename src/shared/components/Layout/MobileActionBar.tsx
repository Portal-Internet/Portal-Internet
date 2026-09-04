import type { ReactNode } from 'react'
import styles from './MobileActionBar.module.css'

interface MobileActionBarProps {
  /** Dois botões, normalmente uma ação secundária e a principal. */
  children: ReactNode
}

/** Barra fixa de ação no rodapé — só aparece abaixo de 1024px. */
export function MobileActionBar({ children }: MobileActionBarProps) {
  return <div className={styles.bar}>{children}</div>
}
