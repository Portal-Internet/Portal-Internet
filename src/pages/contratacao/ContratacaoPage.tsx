import { useParams } from 'react-router-dom'
import { PageHero } from '@/shared/components/Layout/PageHero'
import { Container } from '@/shared/components/Layout/Container'
import { Seo } from '@/shared/components/Seo'
import { PageLoader } from '@/shared/components/ui'
import { FalhaDeRede, LinkInvalido, useContratacaoLink } from '@/features/contratacao'
import styles from './ContratacaoPage.module.css'

export function ContratacaoPage() {
  const { token } = useParams()
  const { link, carregando, falhaDeRede, tentarDeNovo } = useContratacaoLink(token)

  return (
    <>
      {/* Fora do índice dos buscadores: a URL carrega um token de uso único
          e a página só faz sentido para quem recebeu o link. */}
      <Seo
        title="Contratação"
        description="Finalize sua contratação da Portal Internet."
        path={`/contratar/${token ?? ''}`}
        noIndex
      />

      {/* O herói acompanha o estado: prometer "preencha seus dados" acima de
          um aviso de link expirado seria contraditório. */}
      {link?.valido === false ? (
        <PageHero title="Cadastro" />
      ) : (
        <PageHero
          title="Quase lá!"
          description="Preencha seus dados para agendarmos a instalação. Leva 2 minutos."
        />
      )}

      <section className={styles.secao}>
        <Container>
          {carregando ? (
            <PageLoader />
          ) : falhaDeRede ? (
            <FalhaDeRede onTentarDeNovo={tentarDeNovo} />
          ) : link?.valido ? (
            <p className={styles.provisorio}>
              Formulário em construção — plano {link.planoId}
              {link.prefillNome ? `, para ${link.prefillNome}` : ''}.
            </p>
          ) : (
            <LinkInvalido />
          )}
        </Container>
      </section>
    </>
  )
}
