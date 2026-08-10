import { useCallback, useState } from 'react'
import { CONTACTS } from '@/shared/lib/contacts'
import { buildWhatsAppLink } from '@/shared/lib/whatsapp'

export interface CoverageRequest {
  nome: string
  email: string
  whatsapp: string
  cep: string
}

export interface CoverageResult {
  firstName: string
  cep: string
  whatsappLink: string
}

/**
 * Consulta de disponibilidade.
 *
 * Sem backend próprio: o pedido é enviado direto para o WhatsApp de vendas,
 * já com os dados preenchidos, abrindo a conversa automaticamente.
 */
export function useCoverageRequest() {
  const [result, setResult] = useState<CoverageResult | null>(null)

  const submit = useCallback((request: CoverageRequest) => {
    const firstName = request.nome.trim().split(' ')[0] ?? ''
    const message = [
      'Olá! Vim pelo site e quero verificar a disponibilidade de fibra.',
      '',
      `Nome: ${request.nome}`,
      `E-mail: ${request.email}`,
      `WhatsApp: ${request.whatsapp}`,
      `CEP: ${request.cep}`,
    ].join('\n')

    const whatsappLink = buildWhatsAppLink(CONTACTS.sales.whatsapp, message)
    window.open(whatsappLink, '_blank', 'noopener,noreferrer')

    setResult({ firstName, cep: request.cep, whatsappLink })
  }, [])

  const reset = useCallback(() => setResult(null), [])

  return { result, submit, reset }
}
