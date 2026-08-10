import { Seo } from '@/shared/components/Seo'
import { ErrorContent } from './ErrorContent'

/** Rota curinga: qualquer endereço que não existe cai aqui, dentro do Layout. */
export function NotFoundPage() {
  return (
    <>
      <Seo
        title="Página não encontrada"
        description="O endereço que você tentou abrir não existe no site da Portal Internet. Veja os planos, consulte a cobertura ou fale com a gente."
        path="/404"
        noIndex
      />
      <ErrorContent variant="not-found" detail={window.location.pathname} />
    </>
  )
}
