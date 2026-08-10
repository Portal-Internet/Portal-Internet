import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/shared/components/Layout'
// Import estático de propósito: as páginas de erro precisam funcionar
// justamente quando o carregamento de um chunk falha.
import { ErrorPage, NotFoundPage } from '@/pages/error'
// A home também é estática: é a página de entrada da maioria dos acessos, e
// carregá-la em separado atrasava o LCP e empurrava o rodapé (layout shift).
import { HomePage } from '@/pages/home'
import { ROUTER_BASENAME } from '@/shared/lib/assets'
import { lazyPage } from './lazyPage'
import { RouteActionBar } from './RouteActionBar'

const PlansPage = lazyPage(() => import('@/pages/plans'), 'PlansPage')
const CoveragePage = lazyPage(() => import('@/pages/coverage'), 'CoveragePage')
const ContactPage = lazyPage(() => import('@/pages/contact'), 'ContactPage')

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout actionBar={<RouteActionBar />} />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'planos', element: <PlansPage /> },
        { path: 'cobertura', element: <CoveragePage /> },
        { path: 'contato', element: <ContactPage /> },
        // Dentro do Layout: a 404 mantém cabeçalho, rodapé e barra de ações.
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  // Acompanha a base do build: '/' em dev, '/projetos/PortalInternet' quando
  // o site é publicado numa subpasta.
  { basename: ROUTER_BASENAME },
)
