/**
 * Planos oficiais da Portal Internet, extraídos de portalma.com.br.
 *
 * Vive em `shared` porque mais de uma feature consome (`plans` renderiza os
 * cards, `plan-finder` recomenda um deles). Confirmar os valores com o
 * comercial antes de publicar.
 */
import type { Plan } from '@/shared/types/plan'
import { CONTACTS } from '@/shared/lib/contacts'

/** Tudo do Empresarial, mais os diferenciais do link dedicado. */
const DEDICATED_FEATURES = [
  'Velocidade Simétrica',
  'Links backup e redundância',
  'Prioridade no suporte',
  'Banda 100% dedicada, sem compartilhamento',
  'IP fixo dedicado',
  'Conexões simultâneas ilimitadas',
]

export const PLANS: Plan[] = [
  {
    id: 'home-office',
    name: 'Home Office',
    tier: 'residencial',
    speedMega: 300,
    priceMonthly: 120,
    forWhom: 'Para trabalhar em casa e a família usar junto',
    features: ['Wi-Fi Grátis', 'Suporte rápido', 'Velocidade Estável'],
    badges: ['Wi-Fi grátis', 'velocidade estável'],
    whatsapp: CONTACTS.sales.whatsapp,
  },
  {
    id: 'gamer',
    name: 'Gamer',
    tier: 'residencial',
    speedMega: 400,
    priceMonthly: 189.9,
    forWhom: 'Para jogar online sem travar no meio da partida',
    features: ['Wi-Fi Grátis', 'Suporte rápido', 'Menor latência', 'Velocidade Estável'],
    badges: ['Wi-Fi grátis', 'menor latência'],
    featured: true,
    flag: 'Mais procurado',
    whatsapp: CONTACTS.sales.whatsapp,
  },
  {
    id: 'streaming',
    name: 'Streaming',
    tier: 'residencial',
    speedMega: 700,
    priceMonthly: 259,
    forWhom: 'Para quem quer o melhor da casa e do jogo, com suporte prioritário',
    features: [
      'Wi-Fi Grátis',
      'Suporte humanizado',
      'Menor latência',
      'Velocidade Estável',
      'Prioridade no suporte',
    ],
    badges: ['Wi-Fi grátis', 'prioridade no suporte'],
    whatsapp: CONTACTS.sales.whatsapp,
  },
  {
    id: 'empresarial',
    name: 'Empresarial',
    tier: 'empresarial',
    speedMega: 400,
    priceMonthly: 199.9,
    forWhom: 'Para o negócio que não pode ficar fora do ar',
    features: [
      'Wi-Fi Grátis',
      'Prioridade no suporte',
      'Velocidade Simétrica',
      'Links backup e redundância',
    ],
    badges: ['Simétrica', 'link backup'],
    whatsapp: CONTACTS.sales.whatsapp,
  },
  {
    id: 'business',
    name: 'Business',
    tier: 'empresarial',
    speedMega: 500,
    priceMonthly: 269.9,
    forWhom: 'Para operações com muita gente conectada',
    features: [
      'Wi-Fi Grátis',
      'Hipervelocidade estável',
      'Suporte humanizado',
      'Velocidade Simétrica',
      'Links backup e redundância',
      'Prioridade no suporte',
    ],
    badges: ['Simétrica', 'link backup', 'prioridade'],
    featured: true,
    flag: 'Mais buscado',
    whatsapp: CONTACTS.sales.whatsapp,
  },
  {
    id: 'executivo',
    name: 'Executivo',
    tier: 'empresarial',
    speedMega: 600,
    priceMonthly: 399.9,
    forWhom: 'Máxima velocidade e prioridade total',
    features: [
      'Wi-Fi Grátis',
      'Hipervelocidade estável',
      'Suporte humanizado',
      'Velocidade Simétrica',
      'Links backup e redundância',
      'Prioridade no suporte',
    ],
    badges: ['Simétrica', 'link backup', 'prioridade'],
    whatsapp: CONTACTS.support.whatsapp,
  },
  {
    id: 'dedicado-100',
    name: 'Dedicado 100',
    tier: 'dedicado',
    speedMega: 100,
    priceMonthly: 500,
    forWhom: 'Para pequenos negócios que precisam de conexão exclusiva e estável',
    features: DEDICATED_FEATURES,
    badges: ['IP fixo', 'link dedicado'],
    whatsapp: CONTACTS.sales.whatsapp,
  },
  {
    id: 'dedicado-200',
    name: 'Dedicado 200',
    tier: 'dedicado',
    speedMega: 200,
    priceMonthly: 1000,
    forWhom: 'Para empresas com uso intenso de nuvem e videoconferência',
    features: DEDICATED_FEATURES,
    badges: ['IP fixo', 'link dedicado'],
    featured: true,
    flag: 'Mais contratado',
    whatsapp: CONTACTS.sales.whatsapp,
  },
  {
    id: 'dedicado-500',
    name: 'Dedicado 500',
    tier: 'dedicado',
    speedMega: 500,
    priceMonthly: 2500,
    forWhom: 'Para operações que exigem alta disponibilidade constante',
    features: DEDICATED_FEATURES,
    badges: ['IP fixo', 'link dedicado'],
    whatsapp: CONTACTS.sales.whatsapp,
  },
  {
    id: 'dedicado-1000',
    name: 'Dedicado 1 GB',
    tier: 'dedicado',
    speedMega: 1000,
    priceMonthly: 5000,
    forWhom: 'Para grandes operações e data centers corporativos',
    features: DEDICATED_FEATURES,
    badges: ['IP fixo', 'link dedicado'],
    whatsapp: CONTACTS.sales.whatsapp,
  },
]

export const MAX_SPEED = Math.max(...PLANS.map((plan) => plan.speedMega))

export const RESIDENTIAL_PLANS = PLANS.filter((plan) => plan.tier === 'residencial')
export const BUSINESS_PLANS = PLANS.filter((plan) => plan.tier === 'empresarial')
export const DEDICATED_PLANS = PLANS.filter((plan) => plan.tier === 'dedicado')

/** Planos comparados na tabela — os links dedicados têm seção própria de diferenciais. */
export const COMPARABLE_PLANS = [...RESIDENTIAL_PLANS, ...BUSINESS_PLANS]

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((plan) => plan.id === id)
}

/** Menor mensalidade da tabela — usada no selo do hero. */
export const CHEAPEST_PLAN = PLANS.reduce((cheapest, plan) =>
  plan.priceMonthly < cheapest.priceMonthly ? plan : cheapest,
)

/** Recursos comparados na tabela, na ordem em que aparecem. */
export const COMPARED_FEATURES = [
  'Wi-Fi Grátis',
  'Suporte rápido',
  'Velocidade Estável',
  'Menor latência',
  'Velocidade Simétrica',
  'Links backup e redundância',
  'Prioridade no suporte',
  'Hipervelocidade estável',
  'Suporte humanizado',
]
