import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { MobileActionBar } from '@/shared/components/Layout/MobileActionBar'
import { Button } from '@/shared/components/ui'
import { CONTACTS } from '@/shared/lib/contacts'
import { buildTelLink, buildWhatsAppLink } from '@/shared/lib/whatsapp'

const SALES_LINK = buildWhatsAppLink(
  CONTACTS.sales.whatsapp,
  'Olá! Vim através do site e gostaria de mais informações',
)

/** Ações da barra fixa, por rota. */
const ACTIONS: Record<string, ReactNode> = {
  '/': (
    <>
      <Button as="a" href="#cobertura" variant="outline">
        Cobertura
      </Button>
      <Button as="a" href="#planos">
        Ver planos
      </Button>
    </>
  ),
  '/planos': (
    <>
      <Button as="route" to="/cobertura" variant="outline">
        Cobertura
      </Button>
      <Button as="a" href={SALES_LINK} target="_blank" rel="noopener noreferrer">
        Contratar
      </Button>
    </>
  ),
  '/cobertura': (
    <>
      <Button as="route" to="/planos" variant="outline">
        Planos
      </Button>
      <Button as="a" href={SALES_LINK} target="_blank" rel="noopener noreferrer">
        Falar com vendas
      </Button>
    </>
  ),
  '/contato': (
    <>
      <Button as="a" href={buildTelLink(CONTACTS.sales.tel)} variant="outline">
        Ligar
      </Button>
      <Button
        as="a"
        href={SALES_LINK}
        variant="whatsapp"
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp
      </Button>
    </>
  ),
}

/* Rotas fora do mapa (a 404, por exemplo) não têm as âncoras da home. */
const DEFAULT_ACTIONS = (
  <>
    <Button as="route" to="/planos" variant="outline">
      Planos
    </Button>
    <Button as="a" href={SALES_LINK} target="_blank" rel="noopener noreferrer">
      Falar com vendas
    </Button>
  </>
)

/** Barra de ação fixa do mobile. Fica no `app` porque depende das rotas. */
export function RouteActionBar() {
  const { pathname } = useLocation()
  return <MobileActionBar>{ACTIONS[pathname] ?? DEFAULT_ACTIONS}</MobileActionBar>
}
