import { EXTERNAL_LINKS } from '@/shared/lib/contacts'

export interface Review {
  id: string
  /** Nome do autor como aparece no Google, com o sobrenome abreviado. */
  author: string
  /** Texto literal da avaliação. */
  text: string
  rating: number
}

/**
 * Avaliações públicas do perfil da Portal Internet no Google Maps, copiadas
 * manualmente do perfil em 07/08/2026 (nota 5,0 com 19 avaliações).
 *
 * Não há integração com a API do Google Places: se a nota ou a contagem
 * mudarem, atualize `GOOGLE_RATING` aqui. O perfil também tem avaliações que
 * falam de outro serviço no mesmo endereço — essas ficaram de fora.
 */
export const GOOGLE_RATING = {
  score: 5.0,
  count: 19,
  url: EXTERNAL_LINKS.googleReviews,
} as const

export const GOOGLE_REVIEWS: Review[] = [
  {
    id: 'jessica-m',
    author: 'Jéssica M.',
    text: 'Internet de qualidade, sempre me atendem muito bem, suporte humanizado e rápido em resolver qualquer intercorrência. Super indico!',
    rating: 5,
  },
  {
    id: 'fernanda-f',
    author: 'Fernanda F.',
    text: 'Recomendo a Portal a todos com total confiança! Tem um excelente atendimento e ótimo serviço prestado! Estão de parabéns!',
    rating: 5,
  },
  {
    id: 'kaio-h',
    author: 'Kaio H.',
    text: 'Internet de qualidade e excelente atendimento!',
    rating: 5,
  },
  {
    id: 'eduardo-n',
    author: 'Eduardo N.',
    text: 'Atendimento nota 1000... Impecável!',
    rating: 5,
  },
  {
    id: 'jaquelline-j',
    author: 'Jaquelline J.',
    text: 'Excelente atendimento, recomendo a todos.',
    rating: 5,
  },
  {
    id: 'italo-f',
    author: 'Ítalo F.',
    text: 'O melhor!',
    rating: 5,
  },
]
