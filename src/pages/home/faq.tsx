import type { FaqEntry } from '@/shared/components/ui'
import type { Plan } from '@/shared/types/plan'
import { CONTACTS } from '@/shared/lib/contacts'
import { formatPrice } from '@/shared/lib/format'
import { BUSINESS_PLANS, DEDICATED_PLANS, PLANS, RESIDENTIAL_PLANS } from '@/shared/data/plans'

/** "300 a 700 MEGA, a partir de R$ 120,00" — resumo de um grupo de planos. */
function summarize(plans: Plan[]): string {
  const speeds = plans.map((plan) => plan.speedMega)
  const cheapest = Math.min(...plans.map((plan) => plan.priceMonthly))
  return `${Math.min(...speeds)} a ${Math.max(...speeds)} MEGA, a partir de ${formatPrice(cheapest)}`
}

export const HOME_FAQ: FaqEntry[] = [
  {
    question: 'Quais são os planos e os preços?',
    answer: `São ${PLANS.length} planos em três linhas: residencial (${summarize(RESIDENTIAL_PLANS)}), empresarial (${summarize(BUSINESS_PLANS)}) e link dedicado (${summarize(DEDICATED_PLANS)}). A tabela completa está na página de Planos.`,
  },
  {
    question: 'Como faço para contratar?',
    answer: `Pelo WhatsApp de vendas, no ${CONTACTS.sales.label}. Você também pode preencher o formulário de disponibilidade aqui do site que a equipe entra em contato para confirmar a viabilidade no seu endereço.`,
  },
  {
    question: 'Qual a diferença entre o plano Gamer e o Home Office?',
    answer:
      'Além da velocidade maior (400 contra 300 MEGA), o plano Gamer é entregue com foco em menor latência — o que reduz o atraso de resposta em jogos online.',
  },
  {
    question: 'O que significa velocidade simétrica nos planos empresariais?',
    answer:
      'Significa que a velocidade de envio (upload) é igual à de recebimento (download). Isso faz diferença para quem usa câmeras, sistemas na nuvem, backup e videochamada. Os planos Empresarial, Business e Executivo têm velocidade simétrica, além de links de backup e redundância.',
  },
  {
    question: 'Já sou cliente. Onde vejo minha fatura?',
    answer: `Na Central do Assinante, com seu login e senha. Por lá você acessa faturas, histórico e dados do contrato. Para suporte técnico, chame no WhatsApp ${CONTACTS.support.label}; para pós-vendas (contrato, fatura, mudança de plano), fale no ${CONTACTS.sales.label}.`,
  },
]
