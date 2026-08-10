import { PageHero, Section } from '@/shared/components/Layout'
import { Button, Card, CardGrid, Faq, Reveal, SectionHead } from '@/shared/components/ui'
import { Seo } from '@/shared/components/Seo'
import { CoverageChecker } from '@/features/coverage-checker'
import { CONTACTS } from '@/shared/lib/contacts'
import styles from './CoveragePage.module.css'

const STEPS = [
  {
    icon: '1',
    title: 'Consulta de viabilidade',
    text: 'Você envia o CEP e o contato. A equipe confere no mapa da rede se o endereço já está atendido pela fibra.',
  },
  {
    icon: '2',
    title: 'Escolha do plano',
    text: 'Com a viabilidade confirmada, você escolhe entre os dez planos — de 100 a 1000 MEGA, residencial, empresarial ou link dedicado.',
  },
  {
    icon: '3',
    title: 'Contratação pelo WhatsApp',
    text: 'Todo o cadastro é feito pelo WhatsApp de vendas, com um atendente humano do começo ao fim.',
  },
  {
    icon: '4',
    title: 'Instalação e Wi-Fi ligado',
    text: 'O técnico instala a fibra e configura o Wi-Fi, incluso nos planos residenciais e empresariais, sem custo adicional.',
  },
]

const COVERAGE_FAQ = [
  {
    question: 'Em quais cidades a Portal Internet atende?',
    answer: `O atendimento é em São Luís/MA. Como a cobertura de fibra avança por região, a forma mais segura de saber é consultar pelo CEP aqui em cima ou falar com vendas no WhatsApp ${CONTACTS.sales.label}.`,
  },
  {
    question: 'Meu CEP não tem cobertura ainda. E agora?',
    answer:
      'Deixe seu contato mesmo assim. A rede está sempre em expansão e, quando chegar à sua região, a equipe avisa — sem custo e sem compromisso.',
  },
  {
    question: 'Moro em condomínio. Precisa de autorização?',
    answer:
      'Sim, a passagem de cabo em áreas comuns depende de autorização da administração ou do síndico. Informe isso no contato que a equipe conduz essa conversa junto com você.',
  },
  {
    question: 'Posso contratar plano empresarial no mesmo endereço?',
    answer:
      'Pode. Os planos Empresarial, Business e Executivo têm velocidade simétrica, links de backup e prioridade no suporte. Consulte a viabilidade informando que o uso é empresarial.',
  },
]

export function CoveragePage() {
  return (
    <>
      <Seo
        title="Cobertura de Fibra Óptica"
        description="Consulte a disponibilidade de internet fibra óptica no seu endereço em São Luís/MA. Confirme a viabilidade em menos de um minuto, sem compromisso."
        path="/cobertura"
      />

      <PageHero
        breadcrumb="Cobertura"
        title="Tem sinal no seu endereço?"
        description="Informe seu CEP e a nossa equipe confirma a viabilidade técnica — e já indica o plano sob medida para o seu uso."
      />

      <Section>
        <Reveal>
          <CoverageChecker idPrefix="cobertura">
            <SectionHead
              kicker="Consulta de disponibilidade"
              title="Preencha e a gente confere"
              description="Leva menos de um minuto. Sem compromisso de contratar."
              as="h3"
              className={styles.formHead}
            />
          </CoverageChecker>
        </Reveal>
      </Section>

      <Section tone="mint" tight>
        <SectionHead
          centered
          kicker="Passo a passo"
          title="Da consulta à internet ligada"
          description="O caminho da contratação, do jeito que acontece de verdade."
        />
        <CardGrid columns={2}>
          {STEPS.map((step) => (
            <Card key={step.title} icon={step.icon}>
              <h3>{step.title}</h3>
              <p style={{ marginBottom: 0 }}>{step.text}</p>
            </Card>
          ))}
        </CardGrid>
      </Section>

      <Section>
        <div className={styles.narrow}>
          <SectionHead
            centered
            kicker="Dúvidas de cobertura"
            title="Perguntas frequentes"
          />
          <Faq items={COVERAGE_FAQ} />
        </div>
      </Section>

      <Section tone="green">
        <div className={styles.ctaBlock}>
          <h2>Com viabilidade confirmada, é só escolher</h2>
          <p style={{ color: 'var(--color-text-on-dark-muted)' }}>
            Dez planos de 100 a 1000 MEGA, 100% fibra — residencial, empresarial ou link
            dedicado.
          </p>
          <div className={styles.ctaActions}>
            <Button as="route" to="/planos" variant="vivid">
              Ver planos e preços
            </Button>
            <Button as="route" to="/contato" variant="ghost">
              Falar com a Portal
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
