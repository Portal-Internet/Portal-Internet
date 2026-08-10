export type PlanTier = 'residencial' | 'empresarial' | 'dedicado'

export interface Plan {
  /** Identificador estável, usado em âncoras e no localizador de plano. */
  id: string
  /** Nome comercial, sem o prefixo "Plano". */
  name: string
  tier: PlanTier
  speedMega: number
  /** Mensalidade em reais. */
  priceMonthly: number
  /** Para quem o plano faz sentido — uma linha. */
  forWhom: string
  /** Itens inclusos, como aparecem no material oficial. */
  features: string[]
  /** Selos curtos exibidos acima do preço. */
  badges: string[]
  /** Destaque visual no card. */
  featured?: boolean
  /** Texto da tarja de destaque, quando houver. */
  flag?: string
  /** Número de WhatsApp que atende esse plano. */
  whatsapp: string
}
