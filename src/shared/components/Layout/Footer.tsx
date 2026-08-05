import styles from './Footer.module.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>&copy; {year} PortalInternet. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
