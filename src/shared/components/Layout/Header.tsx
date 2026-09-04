import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FiLogIn } from 'react-icons/fi'
import { useDisclosure } from '@/shared/hooks/useDisclosure'
import { Button } from '@/shared/components/ui'
import { CONTACTS, EXTERNAL_LINKS, SHORT_ADDRESS } from '@/shared/lib/contacts'
import { imageSrcSet } from '@/shared/lib/assets'
import { buildTelLink } from '@/shared/lib/whatsapp'
import { Container } from './Container'
import styles from './Header.module.css'

const NAV_LINKS = [
  { to: '/', label: 'Início' },
  { to: '/planos', label: 'Planos' },
  { to: '/cobertura', label: 'Cobertura' },
  { to: '/contato', label: 'Contato' },
]

function isLinkActive(pathname: string, to: string, end: boolean) {
  if (end) return pathname === to
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function Header() {
  const menu = useDisclosure()
  const location = useLocation()
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [navThumb, setNavThumb] = useState({ left: 0, width: 0, visible: false })

  const activeIndex = NAV_LINKS.findIndex((link) =>
    isLinkActive(location.pathname, link.to, link.to === '/'),
  )

  useEffect(() => {
    const updateThumb = () => {
      const activeLink = linkRefs.current[activeIndex]
      if (activeLink) {
        setNavThumb({
          left: activeLink.offsetLeft,
          width: activeLink.offsetWidth,
          visible: true,
        })
      } else {
        setNavThumb((prev) => ({ ...prev, visible: false }))
      }
    }

    updateThumb()
    window.addEventListener('resize', updateThumb)
    return () => window.removeEventListener('resize', updateThumb)
  }, [activeIndex])

  return (
    <>
      <div className={styles.topbar}>
        <Container className={styles.topbarInner}>
          <span>📍 {SHORT_ADDRESS}</span>
          <nav className={styles.topbarLinks} aria-label="Acesso rápido">
            <a
              href={EXTERNAL_LINKS.subscriberArea}
              target="_blank"
              rel="noopener noreferrer"
            >
              Central do Assinante
            </a>
            <a href={buildTelLink(CONTACTS.sales.tel)}>{CONTACTS.sales.label}</a>
          </nav>
        </Container>
      </div>

      <header className={styles.header}>
        <Container className={styles.headerInner}>
          <Link
            className={styles.brand}
            to="/"
            aria-label="Portal Internet — página inicial"
          >
            <img
              src={EXTERNAL_LINKS.logoLight}
              srcSet={imageSrcSet('Logo-branca.webp', [180, 320], 816)}
              sizes="96px"
              alt="Portal Internet"
              width={96}
              height={60}
            />
          </Link>

          <nav className={styles.nav} aria-label="Navegação principal">
            <div
              className={styles.navThumb}
              style={{
                transform: `translateX(${navThumb.left}px)`,
                width: `${navThumb.width}px`,
                opacity: navThumb.visible ? 1 : 0,
              }}
            />
            {NAV_LINKS.map((link, index) => (
              <NavLink
                key={link.to}
                ref={(el) => {
                  linkRefs.current[index] = el
                }}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => (isActive ? styles.navActive : undefined)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.actions}>
            <Button
              as="a"
              href={EXTERNAL_LINKS.subscriberArea}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              variant="outline"
              className={styles.headerCta}
            >
              <FiLogIn aria-hidden="true" size={16} />
              Central Assinante
            </Button>
            <Button
              as="route"
              to="/planos"
              size="sm"
              variant="vivid"
              className={styles.headerCta}
            >
              Ver planos
            </Button>
            <button
              className={[styles.burger, menu.isOpen ? styles.burgerOpen : null]
                .filter(Boolean)
                .join(' ')}
              onClick={menu.toggle}
              aria-expanded={menu.isOpen}
              aria-label={menu.isOpen ? 'Fechar menu' : 'Abrir menu'}
              type="button"
            >
              <span />
            </button>
          </div>
        </Container>

        {menu.isOpen ? (
          <div className={styles.mobileMenu}>
            <Container>
              {NAV_LINKS.map((link) => (
                <Link key={link.to} to={link.to} onClick={menu.close}>
                  {link.label} <span>›</span>
                </Link>
              ))}
              <div className={styles.mobileUtility}>
                <a
                  href={EXTERNAL_LINKS.subscriberArea}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Central do Assinante
                </a>
                <a href={buildTelLink(CONTACTS.sales.tel)}>{CONTACTS.sales.label}</a>
              </div>
            </Container>
          </div>
        ) : null}
      </header>
    </>
  )
}
