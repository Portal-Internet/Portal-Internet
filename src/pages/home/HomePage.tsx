import styles from './HomePage.module.css'

export function HomePage() {
  return (
    <section className={styles.hero}>
      <h1>Internet rápida para a sua casa e empresa</h1>
      <p>
        Planos de fibra óptica com instalação rápida e suporte dedicado. Confira a
        cobertura disponível na sua região.
      </p>
    </section>
  )
}
