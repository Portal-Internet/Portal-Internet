import { Suspense, useEffect, type ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { PageLoader } from '@/shared/components/ui'
import { Header } from './Header'
import { Footer } from './Footer'
import { WhatsAppFab } from './WhatsAppFab'
import { FiberBackground } from './FiberBackground'
import styles from './Layout.module.css'

/**
 * Sobe a página a cada troca de rota e, quando a URL tem hash,
 * rola até a âncora depois que o conteúdo montou.
 */
function useRouteScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 })
      return
    }

    // O hash vem da URL: pode não ser um seletor CSS válido (ex.: "#1").
    let target: Element | null = null
    try {
      target = document.querySelector(hash)
    } catch {
      target = null
    }

    if (target) {
      requestAnimationFrame(() =>
        target.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      )
    }
  }, [pathname, hash])
}

interface LayoutProps {
  /**
   * Barra de ação fixa do mobile. Vem de fora porque as ações dependem
   * da rota — assim o Layout continua sem conhecer as páginas.
   */
  actionBar?: ReactNode
}

/**
 * Rotas onde o botão flutuante do WhatsApp sai de cena.
 *
 * Ele existe para empurrar quem está navegando em direção a vendas. No meio
 * de um cadastro a pessoa já é cliente e já decidiu — ali ele só oferece uma
 * saída no momento errado.
 */
const SEM_BOTAO_FLUTUANTE = ['/contratar']

export function Layout({ actionBar }: LayoutProps) {
  useRouteScroll()
  const { pathname } = useLocation()
  const mostrarFab = !SEM_BOTAO_FLUTUANTE.some((rota) => pathname.startsWith(rota))

  return (
    <>
      <FiberBackground />
      <Header />
      <main className={styles.main}>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      {actionBar}
      {mostrarFab ? <WhatsAppFab /> : null}
    </>
  )
}
