import { useCallback, useState } from 'react'

export type MaskKind = 'tel' | 'cep' | 'cpf' | 'cnpj' | 'date'

/**
 * Insere separadores conforme o usuário digita, sem antecipá-los: com três
 * dígitos de CPF o resultado é "111", não "111.".
 */
function agrupar(digits: string, tamanhos: number[], separadores: string[]): string {
  let resto = digits
  let saida = ''

  for (let i = 0; i < tamanhos.length && resto.length > 0; i += 1) {
    saida += (i === 0 ? '' : separadores[i - 1]) + resto.slice(0, tamanhos[i])
    resto = resto.slice(tamanhos[i])
  }

  return saida
}

const MASKS: Record<MaskKind, (digits: string) => string> = {
  // Fixo (10 dígitos) agrupa 4+4; celular (11) agrupa 5+4.
  tel: (digits) => {
    const value = digits.slice(0, 11)
    if (value.length <= 2) {
      return value ? `(${value}` : ''
    }
    const ddd = value.slice(0, 2)
    const rest = value.slice(2)
    const head = value.length > 10 ? 5 : 4
    return rest.length <= head
      ? `(${ddd}) ${rest}`
      : `(${ddd}) ${rest.slice(0, head)}-${rest.slice(head)}`
  },
  cep: (digits) => digits.slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2'),
  cpf: (digits) => agrupar(digits.slice(0, 11), [3, 3, 3, 2], ['.', '.', '-']),
  cnpj: (digits) => agrupar(digits.slice(0, 14), [2, 3, 3, 4, 2], ['.', '.', '/', '-']),
  date: (digits) => agrupar(digits.slice(0, 8), [2, 2, 4], ['/', '/']),
}

/**
 * Aplica a máscara a um valor cru. Exportada para teste: assim as regras de
 * formatação são verificáveis sem montar componente.
 */
export function applyMask(kind: MaskKind, raw: string): string {
  return MASKS[kind](raw.replace(/\D/g, ''))
}

/**
 * Campo controlado com máscara.
 * Devolve o valor formatado (para exibir) e o valor cru (para enviar).
 */
export function useInputMask(kind: MaskKind, initial = '') {
  const [value, setValue] = useState(initial)

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(applyMask(kind, event.target.value))
    },
    [kind],
  )

  const reset = useCallback(() => setValue(''), [])

  return { value, rawValue: value.replace(/\D/g, ''), onChange, reset }
}
