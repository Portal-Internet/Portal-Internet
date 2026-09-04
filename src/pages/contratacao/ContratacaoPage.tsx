import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHero } from '@/shared/components/Layout/PageHero'
import { Container } from '@/shared/components/Layout/Container'
import { Seo } from '@/shared/components/Seo'
import { PageLoader } from '@/shared/components/ui'
import {
  ContratacaoForm,
  FalhaDeRede,
  LinkInvalido,
  SucessoContratacao,
  useContratacaoLink,
} from '@/features/contratacao'
import styles from './ContratacaoPage.module.css'

export function ContratacaoPage() {
  const { token } = useParams()
  const { link, carregando, falhaDeRede, tentarDeNovo } = useContratacaoLink(token)
  const [enviado, setEnviado] = useState(false)

  const heroiDeAviso = enviado || link?.valido === false

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
          um aviso de link expirado, ou depois do envio, seria contraditório. */}
      {heroiDeAviso ? (
        <PageHero title={enviado ? 'Tudo certo!' : 'Cadastro'} />
      ) : (
        <PageHero
          title="Quase lá!"
          description="Preencha seus dados para agendarmos a instalação. Leva 2 minutos."
        />
      )}

      <section className={styles.secao}>
        <Container>
          {enviado ? (
            <SucessoContratacao />
          ) : carregando ? (
            <PageLoader />
          ) : falhaDeRede ? (
            <FalhaDeRede onTentarDeNovo={tentarDeNovo} />
          ) : link?.valido ? (
            <ContratacaoForm
              link={link}
              token={token ?? ''}
              onConcluir={() => setEnviado(true)}
            />
          ) : (
            <LinkInvalido />
          )}
        </Container>
      </section>
    </>
  )
}
