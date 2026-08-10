import { LocationSection, PageHero, Section } from '@/shared/components/Layout'
import { asset, imageSrcSet } from '@/shared/lib/assets'
import { Seo } from '@/shared/components/Seo'
import {
  Button,
  Card,
  CardGrid,
  Chip,
  Faq,
  Reveal,
  SectionHead,
} from '@/shared/components/ui'
import { CONTACTS, EXTERNAL_LINKS } from '@/shared/lib/contacts'
import { buildTelLink, buildWhatsAppLink } from '@/shared/lib/whatsapp'
import styles from './ContactPage.module.css'

const SUPPORT_FAQ = [
  {
    question: 'A internet caiu. O que testar primeiro?',
    answer:
      'Confira as luzes da caixinha de fibra (ONU). Se a luz vermelha de perda de sinal estiver acesa ou piscando, provavelmente há rompimento no cabo — chame o suporte. Se estiver tudo normal, tire o roteador da tomada por 30 segundos e ligue de novo.',
  },
  {
    question: 'A velocidade no Wi-Fi está menor que a contratada',
    answer:
      'Aproxime-se do roteador, use a rede 5 GHz e evite deixar o aparelho dentro de armário ou atrás da TV. Se o problema continuar, chame o suporte técnico para verificar o link.',
  },
  {
    question: 'Preciso da 2ª via da fatura',
    answer: `Acesse a Central do Assinante com seu login e senha. Se não lembrar os dados de acesso, fale com o pós-vendas no ${CONTACTS.sales.label}.`,
  },
]

export function ContactPage() {
  return (
    <>
      <Seo
        title="Contato"
        description="Fale com a Portal Internet: vendas, suporte técnico e pós-vendas pelo WhatsApp. Veja também nosso endereço em São Luís/MA."
        path="/contato"
      />

      <PageHero
        breadcrumb="Contato"
        title="Fale com a Portal Internet"
        description="Cada assunto tem um canal certo — assim você não espera na fila errada. Atendimento com gente de São Luís."
      />

      {/* ---------- Canais ---------- */}
      <Section>
        <SectionHead
          centered
          kicker="Canais de atendimento"
          title="Escolha o caminho mais rápido"
        />

        <CardGrid columns={2}>
          <Card icon="📱" title={CONTACTS.sales.label}>
            <Chip className={styles.cardChip}>Vendas e pós-vendas</Chip>
            <p>
              Contratar plano, dúvida de preço e disponibilidade no seu endereço — e
              também contrato, fatura, mudança de endereço e alteração de plano.
            </p>
            <div className={styles.cardActions}>
              <Button
                as="a"
                variant="whatsapp"
                fullWidth
                href={buildWhatsAppLink(
                  CONTACTS.sales.whatsapp,
                  'Olá! Vim através do site e gostaria de mais informações',
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chamar no WhatsApp
              </Button>
              <Button
                as="a"
                variant="outline"
                fullWidth
                href={buildTelLink(CONTACTS.sales.tel)}
              >
                Ligar agora
              </Button>
            </div>
          </Card>

          <Card icon="🛠️" title={CONTACTS.support.label}>
            <Chip className={styles.cardChip}>Suporte</Chip>
            <p>
              Internet oscilando, lenta ou fora do ar? Chame o suporte técnico direto pelo
              WhatsApp.
            </p>
            <Button
              as="a"
              variant="whatsapp"
              fullWidth
              href={buildWhatsAppLink(
                CONTACTS.support.whatsapp,
                'Olá! Vim através do site e preciso de suporte',
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chamar o suporte
            </Button>
          </Card>
        </CardGrid>
      </Section>

      {/* ---------- Área do cliente ---------- */}
      <Section id="cliente" tone="green">
        <div className={styles.splitMedia}>
          <Reveal className={styles.splitImage}>
            <img
              src={asset('img/garoto-note.webp')}
              srcSet={imageSrcSet('img/garoto-note.webp', [480, 720], 1024)}
              sizes="(min-width: 768px) 460px, 90vw"
              alt="Mascote da Portal Internet com notebook"
              width={1024}
              height={1024}
              loading="lazy"
            />
          </Reveal>

          <div>
            <SectionHead
              onDark
              kicker="Já é cliente"
              title="Resolva sozinho, na Central do Assinante"
              description="Faturas, histórico de pagamento e dados do contrato ficam todos em um lugar só — e funcionam no celular, sem instalar nada."
            />

            <div className={styles.selfService}>
              <Card onDark>
                <h3>Central do Assinante</h3>
                <p>
                  Acesse com seu login e senha para ver faturas, 2ª via e dados do
                  contrato.
                </p>
                <Button
                  as="a"
                  variant="vivid"
                  size="sm"
                  href={EXTERNAL_LINKS.subscriberArea}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Entrar na Central
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      <LocationSection />

      {/* ---------- FAQ de suporte ---------- */}
      <Section tone="mint" tight>
        <div className={styles.narrow}>
          <SectionHead
            centered
            kicker="Antes de abrir chamado"
            title="Três checagens que resolvem a maioria dos casos"
          />
          <Faq items={SUPPORT_FAQ} />
        </div>
      </Section>

      <Section tone="green">
        <div className={styles.ctaBlock}>
          <h2>Ainda não é cliente?</h2>
          <p style={{ color: 'var(--color-text-on-dark-muted)' }}>
            Dez planos de 100 a 1000 MEGA, 100% fibra óptica — residencial, empresarial ou
            link dedicado.
          </p>
          <div className={styles.ctaActions}>
            <Button as="route" to="/planos" variant="vivid">
              Ver planos e preços
            </Button>
            <Button as="route" to="/cobertura" variant="ghost">
              Consultar cobertura
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
