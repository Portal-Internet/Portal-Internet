import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { FibraPattern } from '@/shared/components/ui'
import { Container } from './Container'
import styles from './Layout.module.css'

interface PageHeroProps {
  title: string
  description?: ReactNode
  /** Nome da página atual, exibido após "Início ›". */
  breadcrumb?: string
  children?: ReactNode
}

/** Cabeçalho verde das páginas internas. */
export function PageHero({ title, description, breadcrumb, children }: PageHeroProps) {
  return (
    <section className={styles.pageHero}>
      <FibraPattern />
      <Container className={styles.pageHeroInner}>
        {breadcrumb ? (
          <p className={styles.breadcrumb}>
            <Link to="/">Início</Link> › {breadcrumb}
          </p>
        ) : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
        {children}
      </Container>
    </section>
  )
}
