import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PageHero, Section } from '@/shared/components/Layout'
import { Seo } from '@/shared/components/Seo'
import { Button, Card, CardGrid, SectionHead } from '@/shared/components/ui'
import { PlanCompareTable, PlanGrid, PlanTypeToggle } from '@/features/plans'
import { DEDICATED_PLANS, BUSINESS_PLANS, RESIDENTIAL_PLANS } from '@/shared/data/plans'
import type { PlanTier } from '@/shared/types/plan'
import styles from './PlansPage.module.css'

const BUSINESS_HIGHLIGHTS = [
  {
    title: 'Banda garantida e simétrica',
    text: 'Upload igual ao download — o que faz diferença para câmeras, sistemas na nuvem, backup e videochamada.',
  },
  {
    title: 'Links de backup e redundância',
    text: 'Caminhos alternativos de rede para o negócio não parar quando um enlace falha.',
  },
  {
    title: 'Prioridade no suporte',
    text: 'Chamados de planos empresariais entram na frente na fila do atendimento técnico.',
  },
]

const DEDICATED_HIGHLIGHTS = [
  {
    title: 'Tudo do Empresarial',
    text: 'Velocidade simétrica, links de backup e redundância e prioridade no suporte — os mesmos benefícios dos planos empresariais, de fábrica.',
  },
  {
    title: 'Prioridade no tráfego',
    text: 'Seu link atravessa a rede na frente dos demais, com estabilidade garantida mesmo nos horários de pico.',
  },
  {
    title: 'Mais conexões simultâneas',
    text: 'Banda dedicada suporta um número muito maior de dispositivos e usuários ao mesmo tempo, sem perder desempenho.',
  },
  {
    title: 'IP fixo',
    text: 'Endereço IP exclusivo, ideal para servidores, câmeras, VPN e sistemas com acesso remoto.',
  },
  {
    title: 'Acesso exclusivo',
    text: 'Banda 100% sua, sem compartilhamento com outros clientes — desempenho garantido em contrato.',
  },
]

/** Só um dos tiers fica montado por vez, então a âncora precisa abrir a aba certa. */
const TIER_BY_HASH: Record<string, PlanTier> = {
  '#residencial': 'residencial',
  '#empresarial': 'empresarial',
  '#dedicado': 'dedicado',
}

export function PlansPage() {
  const { hash } = useLocation()
  const [tier, setTier] = useState<PlanTier>(() => TIER_BY_HASH[hash] ?? 'residencial')

  useEffect(() => {
    const fromHash = TIER_BY_HASH[hash]
    if (fromHash) {
      setTier(fromHash)
    }
  }, [hash])

  return (
    <>
      <Seo
        title="Planos de Internet Fibra"
        description="Dez planos de internet fibra óptica em São Luís/MA: residencial, empresarial e links dedicados, de 100 a 1000 MEGA. Compare preços e benefícios."
        path="/planos"
      />

      <PageHero
        breadcrumb="Planos"
        title="Escolha seu plano ideal"
        description="Dez planos 100% fibra óptica, de 100 a 1000 MEGA. Do home office ao link dedicado corporativo."
      >
        <PlanTypeToggle value={tier} onChange={setTier} className={styles.toggleWrap} />
      </PageHero>

      {tier === 'residencial' ? (
        <Section id="residencial">
          <SectionHead
            centered
            kicker="Planos Residenciais"
            title="Fibra para a casa toda, sem travar"
            description="De trabalhar em casa a jogar online e assistir em 4K: Wi-Fi grátis, velocidade estável e suporte que resolve na primeira conversa."
          />
          <PlanGrid plans={RESIDENTIAL_PLANS} />
          <p className={styles.centerNote}>
            Precisa de mais banda para empresa?{' '}
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => setTier('empresarial')}
            >
              Ver planos Empresariais →
            </button>{' '}
            ou veja os{' '}
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => setTier('dedicado')}
            >
              Links Dedicados →
            </button>
          </p>
        </Section>
      ) : tier === 'empresarial' ? (
        <Section id="empresarial">
          <SectionHead
            centered
            kicker="Planos Empresariais"
            title="Velocidade simétrica e redundância"
            description="Para empresas e condomínios: upload igual ao download, links de backup e prioridade na fila do suporte."
          />
          <PlanGrid plans={BUSINESS_PLANS} />

          <CardGrid className={styles.highlights}>
            {BUSINESS_HIGHLIGHTS.map((highlight) => (
              <Card key={highlight.title}>
                <h3>{highlight.title}</h3>
                <p style={{ marginBottom: 0 }}>{highlight.text}</p>
              </Card>
            ))}
          </CardGrid>
        </Section>
      ) : (
        <Section id="dedicado">
          <SectionHead
            centered
            kicker="Links Dedicados"
            title="Banda garantida, só para você"
            description="Todos os benefícios dos planos Empresariais — velocidade simétrica, links de backup e prioridade no suporte — mais banda exclusiva, IP fixo e conexões ilimitadas."
          />
          <PlanGrid plans={DEDICATED_PLANS} />
        </Section>
      )}

      {tier === 'dedicado' ? (
        <Section tight>
          <SectionHead
            centered
            kicker="Link Dedicado"
            title="Por que contratar um link dedicado"
            description="Banda exclusiva e sem concorrência com outros clientes — ideal para operações que não podem parar."
          />
          <CardGrid>
            {DEDICATED_HIGHLIGHTS.map((highlight) => (
              <Card key={highlight.title}>
                <h3>{highlight.title}</h3>
                <p style={{ marginBottom: 0 }}>{highlight.text}</p>
              </Card>
            ))}
          </CardGrid>
        </Section>
      ) : (
        <Section tone="paper" tight>
          <SectionHead
            centered
            kicker="Comparativo"
            title="Os seis planos lado a lado"
            description="Tudo que está incluso em cada plano, sem asterisco escondido."
          />
          <PlanCompareTable />
        </Section>
      )}

      <Section tone="green">
        <div className={styles.ctaBlock}>
          <h2>Ainda em dúvida sobre a velocidade?</h2>
          <p style={{ color: 'var(--color-text-on-dark-muted)' }}>
            Responda 3 perguntas e veja qual plano faz sentido, ou confirme a
            disponibilidade no seu endereço.
          </p>
          <div className={styles.ctaActions}>
            <Button as="route" to="/#escolher" variant="vivid">
              Descobrir meu plano
            </Button>
            <Button as="route" to="/cobertura" variant="ghost">
              Consultar disponibilidade
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
