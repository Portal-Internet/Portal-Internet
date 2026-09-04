import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Footer, Header } from '@/shared/components/Layout'
import { Seo } from '@/shared/components/Seo'
import { ErrorContent, type ErrorVariant } from './ErrorContent'

function describe(error: unknown): { variant: ErrorVariant; detail?: string } {
  if (isRouteErrorResponse(error)) {
    return error.status === 404
      ? { variant: 'not-found', detail: error.statusText }
      : { variant: 'crash', detail: `${error.status} ${error.statusText}` }
  }

  return { variant: 'crash', detail: error instanceof Error ? error.message : undefined }
}

/**
 * `errorElement` da rota raiz. Como ele substitui o `Layout`, o cabeçalho e o
 * rodapé são montados aqui para o visitante continuar navegando.
 */
export function ErrorPage() {
  const { variant, detail } = describe(useRouteError())

  return (
    <>
      <Seo
        title="Erro ao carregar a página"
        description="Algo deu errado ao abrir esta página do site da Portal Internet."
        path="/erro"
        noIndex
      />
      <Header />
      <main>
        <ErrorContent variant={variant} detail={detail} />
      </main>
      <Footer />
    </>
  )
}
