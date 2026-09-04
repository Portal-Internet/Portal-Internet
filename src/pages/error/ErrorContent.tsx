import { Section } from '@/shared/components/Layout'
import { Button } from '@/shared/components/ui'
import { CONTACTS } from '@/shared/lib/contacts'
import { buildWhatsAppLink } from '@/shared/lib/whatsapp'
import styles from './ErrorContent.module.css'

export type ErrorVariant = 'not-found' | 'crash'

const COPY: Record<ErrorVariant, { code: string; title: string; text: string }> = {
  'not-found': {
    code: '404',
    title: 'Essa página não existe',
    text: 'O endereço pode ter mudado de lugar. Veja os planos, consulte a cobertura ou fale com a gente.',
  },
  crash: {
    code: 'Erro',
    title: 'A página não carregou',
    text: 'Algo falhou ao abrir esta parte do site. Recarregar costuma resolver — se insistir, chame a gente no WhatsApp.',
  },
}

interface ErrorContentProps {
  variant: ErrorVariant
  /** Detalhe técnico do erro, exibido em letra miúda. */
  detail?: string
}

/** Miolo das páginas de erro: o verde das seções do site, sem mais nada. */
export function ErrorContent({ variant, detail }: ErrorContentProps) {
  const copy = COPY[variant]

  return (
    <Section tone="green" className={styles.wrap}>
      <p className={styles.code} aria-hidden="true">
        {copy.code}
      </p>

      <h1 className={styles.title}>{copy.title}</h1>
      <p className={styles.lead}>{copy.text}</p>

      <div className={styles.actions}>
        {variant === 'crash' ? (
          <Button variant="vivid" onClick={() => window.location.reload()}>
            Recarregar página
          </Button>
        ) : (
          <Button as="route" to="/" variant="vivid">
            Ir para a home
          </Button>
        )}
        <Button as="route" to="/planos" variant="ghost">
          Ver planos
        </Button>
        <Button
          as="a"
          variant="whatsapp"
          href={buildWhatsAppLink(
            CONTACTS.support.whatsapp,
            'Olá! Tive um problema para abrir uma página do site.',
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          Falar com o suporte
        </Button>
      </div>

      {detail ? <p className={styles.detail}>{detail}</p> : null}
    </Section>
  )
}
