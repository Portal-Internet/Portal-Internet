import { asset } from './assets'

/**
 * Fonte única dos contatos oficiais da Portal Internet.
 * Extraídos de portalma.com.br — qualquer mudança acontece só aqui.
 */
export const CONTACTS = {
  /** O mesmo número atende vendas e pós-vendas (contrato, fatura, mudanças). */
  sales: {
    label: '(98) 99125-0780',
    whatsapp: '5598991250780',
    tel: '5598991250780',
    role: 'Vendas e pós-vendas',
  },
  support: {
    label: '(98) 98126-8999',
    whatsapp: '5598981268999',
    role: 'Suporte técnico',
  },
} as const

/**
 * String de busca usada nas URLs do Google Maps — não é exibida na interface.
 * Mantém "São Luís - MA" porque é o formato que o geocoder reconhece; o texto
 * visível segue o padrão `ADDRESS.city` ("São Luís/MA").
 */
const ADDRESS_FULL =
  'Planta Tower, Av. Colares Moreira, 02, Qda 01, Ed. Planta Tower, sala 410, Renascença II, São Luís - MA, 65075-441'

export const ADDRESS = {
  building: 'Planta Tower',
  street: 'Av. Colares Moreira, 02, Qda 01, sala 410',
  district: 'Renascença II',
  city: 'São Luís/MA',
  zip: '65075-441',
  mapsUrl: `https://www.google.com.br/maps/place/${encodeURIComponent(ADDRESS_FULL)}`,
  mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_FULL)}&output=embed`,
} as const

export const EXTERNAL_LINKS = {
  subscriberArea: 'https://4732.centralassinante.com.br/#/login',
  instagram: 'https://www.instagram.com/portalma.com.br/',
  facebook: 'https://www.facebook.com/people/Portal-Internet/61576553581894/',
  youtube: 'https://www.youtube.com/@Portalinternetoficial',
  /** Perfil no Google Maps (`cid` do estabelecimento) — abre as avaliações. */
  googleReviews: 'https://www.google.com/maps?cid=9484139846069999747',
  /**
   * Logo em branco: a arte oficial é verde escura e sumiria no cabeçalho e no
   * rodapé. A versão colorida (`Logo-320.webp`) só aparece nos metadados.
   */
  logoLight: asset('Logo-branca.webp'),
} as const

export const SHORT_ADDRESS = `${ADDRESS.building} — ${ADDRESS.street}, ${ADDRESS.district}`
