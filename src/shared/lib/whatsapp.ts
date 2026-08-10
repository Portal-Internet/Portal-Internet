/**
 * Monta um link do WhatsApp com mensagem pré-preenchida.
 *
 * @param phone número no formato internacional sem símbolos (55 + DDD + número)
 * @param message texto que já aparece digitado para o visitante
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`
}

/** Link do telefone fixo, para o atributo href de um `<a>`. */
export function buildTelLink(tel: string): string {
  return `tel:${tel}`
}
