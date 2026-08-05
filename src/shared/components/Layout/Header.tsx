import { NavLink } from 'react-router-dom'
import styles from './Header.module.css'

const NAV_LINKS = [
  { to: '/', label: 'Início' },
  { to: '/planos', label: 'Planos' },
  { to: '/cobertura', label: 'Cobertura' },
  { to: '/contato', label: 'Contato' },
]

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand}>
          PortalInternet
        </NavLink>
        <nav className={styles.nav} aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.linkActive}` : styles.link
              }
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
