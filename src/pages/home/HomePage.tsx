import { Link } from 'react-router-dom'
import { Container, LocationSection, Section } from '@/shared/components/Layout'
import { Seo } from '@/shared/components/Seo'
import { asset, imageSrcSet } from '@/shared/lib/assets'
import {
  Button,
  Card,
  Chip,
  Faq,
  FibraPattern,
  Reveal,
  SectionHead,
} from '@/shared/components/ui'
import { PlanGrid } from '@/features/plans'
import { PlanFinder } from '@/features/plan-finder'
import { CoverageChecker } from '@/features/coverage-checker'
import { ReviewsSection } from '@/features/reviews'
import { RESIDENTIAL_PLANS } from '@/shared/data/plans'
import { CONTACTS } from '@/shared/lib/contacts'
import { buildWhatsAppLink } from '@/shared/lib/whatsapp'
import { HOME_FAQ } from './faq'
import { SpeedCounter } from './SpeedCounter'
import styles from './HomePage.module.css'

const PILLARS = ['Internet 100% fibra óptica', 'Suporte humanizado', 'Planos acessíveis']

const ADVANTAGES = [
  {
    title: 'Velocidade e desempenho superiores',
    text: 'A fibra entrega velocidades muito maiores que outras tecnologias: download rápido, streaming em alta definição e jogos online sem atraso.',
  },
  {
    title: 'Conexão confiável',
    text: 'A fibra é altamente resistente a interferências eletromagnéticas — o que significa menos quedas e menos interrupção de serviço.',
  },
  {
    title: 'Mais largura de banda',
    text: 'Capacidade maior para transmitir muitos dados ao mesmo tempo, suportando vários dispositivos conectados sem congestionar a rede.',
  },
]

// Home mostra só os planos residenciais; os empresariais ficam na página de planos.
const HIGHLIGHTED_PLANS = RESIDENTIAL_PLANS

export function HomePage() {
  return (
    <>
      <Seo
        title="Portal Internet — Internet 100% fibra óptica em São Luís/MA"
        description="Provedor de internet 100% fibra óptica em São Luís/MA. Dez planos residenciais, empresariais e links dedicados, de 100 a 1000 MEGA, com Wi-Fi grátis e suporte humanizado."
        path="/"
      />

      {/* ---------- Hero ---------- */}
      <div className={styles.heroWrap}>
        <section className={styles.hero}>
          <FibraPattern />
          <Container className={styles.heroInner}>
            <div>
              <Chip onDark>100% fibra óptica · São Luís/MA</Chip>
              <h1 style={{ marginTop: 'var(--space-5)' }}>
                Internet rápida <em>pra toda a família</em>
              </h1>
              <p className={styles.heroSub}>
                Fibra óptica de ponta a ponta, Wi-Fi grátis em todos os planos e um
                suporte que atende como gente — não como robô.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <Button variant="vivid" as="a" href="#planos">
                  Ver planos e preços
                </Button>
                <Button variant="ghost" as="a" href="#cobertura">
                  Consultar meu endereço
                </Button>
              </div>

              <ul className={styles.pillars}>
                {PILLARS.map((pillar, index) => (
                  <li key={pillar}>
                    <Chip variant="solid">{String(index + 1).padStart(2, '0')}</Chip>
                    {pillar}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.heroAside}>
              <SpeedCounter className={styles.speed} />
              <div className={styles.mascot}>
                <img
                  src={asset('img/garoto-fone.webp')}
                  srcSet={imageSrcSet('img/garoto-fone.webp', [480, 720], 1033)}
                  sizes="(min-width: 1024px) 420px, 90vw"
                  alt="Atendente da Portal Internet com fone de ouvido"
                  width={1033}
                  height={900}
                  fetchPriority="high"
                />
              </div>
            </div>
          </Container>
        </section>

        {/* ---------- Faixa de garantias ---------- */}
        <div className={styles.waveDivider} aria-hidden="true">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,32 C240,60 480,0 720,18 C960,36 1200,4 1440,26 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      <div className={styles.strip}>
        <Container className={styles.stripInner}>
          <span>✓ Internet 100% Fibra</span>
          <span>✓ Suporte Humanizado</span>
          <span>✓ Planos Acessíveis</span>
          <span>✓ Wi-Fi grátis em todos os planos</span>
        </Container>
      </div>

      {/* ---------- Planos ---------- */}
      <Section id="planos">
        <SectionHead
          centered
          kicker="Escolha seu plano ideal"
          title="Planos que cabem no seu dia"
          description="Todos com fibra óptica de ponta a ponta e Wi-Fi grátis. Fale com o time de vendas e contrate pelo WhatsApp."
        />
        <PlanGrid plans={HIGHLIGHTED_PLANS} />
        <p className={styles.centerNote}>
          Precisa de mais banda?{' '}
          <Link className={styles.link} to="/planos#empresarial">
            Veja os planos Empresariais: Business 500 e Executivo 600 MEGA →
          </Link>
        </p>
      </Section>

      {/* ---------- Localizador ---------- */}
      <Section id="escolher" tone="mint">
        <SectionHead
          centered
          kicker="Na dúvida?"
          title="Responda 3 perguntas e descubra o plano ideal para você"
          description="Sem cadastro e sem e-mail — a indicação aparece na hora, aqui mesmo."
        />
        <Reveal>
          <PlanFinder />
        </Reveal>
      </Section>

      {/* ---------- Vantagens da fibra ---------- */}
      <Section id="vantagens">
        <div className={styles.splitMedia}>
          <Reveal className={styles.splitImage}>
            <img
              src={asset('img/garoto-note.webp')}
              srcSet={imageSrcSet('img/garoto-note.webp', [480, 720], 1024)}
              sizes="(min-width: 768px) 460px, 90vw"
              alt="Mascote da Portal Internet com notebook, aprovando a conexão"
              width={1024}
              height={1024}
              loading="lazy"
            />
          </Reveal>

          <div>
            <SectionHead
              kicker="Vantagens da fibra óptica"
              title="Por que a fibra da Portal muda a sua conexão"
              description="Três motivos técnicos que aparecem no uso do dia a dia — não só na propaganda."
            />
            <div className={styles.advantages}>
              {ADVANTAGES.map((advantage) => (
                <Card key={advantage.title}>
                  <h3>{advantage.title}</h3>
                  <p style={{ marginBottom: 0 }}>{advantage.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- Avaliações ---------- */}
      <ReviewsSection />

      {/* ---------- Cobertura ---------- */}
      <Section id="cobertura" tone="paper">
        <SectionHead
          centered
          kicker="Disponibilidade"
          title="Veja se tem sinal na sua região"
          description="Deixe seus dados e a nossa equipe confirma a viabilidade no seu endereço, com o plano sob medida para você."
        />
        <Reveal>
          <CoverageChecker idPrefix="home" />
        </Reveal>
      </Section>

      <LocationSection />

      {/* ---------- FAQ ---------- */}
      <Section>
        <div style={{ maxWidth: 820, marginInline: 'auto' }}>
          <SectionHead centered kicker="Dúvidas" title="Perguntas frequentes" />
          <Faq items={HOME_FAQ} />
        </div>
      </Section>

      {/* ---------- CTA final ---------- */}
      <Section tone="green">
        <div className={styles.ctaBlock}>
          <h2>Pronto para trocar de internet?</h2>
          <p style={{ color: 'var(--color-text-on-dark-muted)' }}>
            Escolha o plano, confirme a disponibilidade no seu endereço e fale com o time
            de vendas pelo WhatsApp.
          </p>
          <div className={styles.ctaActions}>
            <Button as="a" variant="vivid" href="#planos">
              Ver planos e preços
            </Button>
            <Button
              as="a"
              variant="ghost"
              href={buildWhatsAppLink(
                CONTACTS.sales.whatsapp,
                'Olá! Vim através do site e gostaria de mais informações',
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar com vendas
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
