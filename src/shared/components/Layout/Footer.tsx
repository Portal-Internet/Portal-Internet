import { Link } from 'react-router-dom'
import { ADDRESS, CONTACTS, EXTERNAL_LINKS } from '@/shared/lib/contacts'
import { imageSrcSet } from '@/shared/lib/assets'
import { buildWhatsAppLink } from '@/shared/lib/whatsapp'
import { Container } from './Container'
import { SocialLinks } from './SocialLinks'
import styles from './Footer.module.css'

const DEFAULT_MESSAGE = 'Olá! Vim através do site e gostaria de mais informações'
const SUPPORT_MESSAGE = 'Olá! Vim através do site e preciso de suporte'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div>
            <img
              className={styles.logo}
              src={EXTERNAL_LINKS.logoLight}
              srcSet={imageSrcSet('Logo-branca.webp', [180, 320], 816)}
              sizes="115px"
              alt="Portal Internet"
              width={115}
              height={72}
            />
            <p className={styles.tagline}>
              Provedor de internet 100% fibra óptica em {ADDRESS.city}.
            </p>
            <SocialLinks className={styles.social} />
          </div>

          <div>
            <h2 className={styles.columnTitle}>Navegue</h2>
            <ul>
              <li>
                <Link to="/">Início</Link>
              </li>
              <li>
                <Link to="/planos">Planos</Link>
              </li>
              <li>
                <Link to="/cobertura">Cobertura</Link>
              </li>
              <li>
                <Link to="/contato">Contato</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={styles.columnTitle}>Cliente</h2>
            <ul>
              <li>
                <a
                  href={EXTERNAL_LINKS.subscriberArea}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Central do Assinante
                </a>
              </li>
              <li>
                <a
                  href={EXTERNAL_LINKS.subscriberArea}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  2ª via de fatura
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppLink(CONTACTS.support.whatsapp, SUPPORT_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Suporte técnico
                </a>
              </li>
              <li>
                <Link to="/#escolher">Qual plano é o meu?</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={styles.columnTitle}>Contatos</h2>
            <ul className={styles.contact}>
              <li>
                <a
                  href={buildWhatsAppLink(CONTACTS.sales.whatsapp, DEFAULT_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <b>{CONTACTS.sales.label}</b>
                  <span>{CONTACTS.sales.role}</span>
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppLink(CONTACTS.support.whatsapp, SUPPORT_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <b>{CONTACTS.support.label}</b>
                  <span>{CONTACTS.support.role}</span>
                </a>
              </li>
              <li className={styles.address}>
                <a href={ADDRESS.mapsUrl} target="_blank" rel="noopener noreferrer">
                  {ADDRESS.building} — {ADDRESS.street}, {ADDRESS.district}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {year} Portal MA. Todos os direitos reservados.</span>
        </div>
      </Container>
    </footer>
  )
}
