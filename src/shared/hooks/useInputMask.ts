import { useCallback, useState } from 'react'

export type MaskKind = 'tel' | 'cep'

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
}

/**
 * Campo controlado com máscara de telefone ou CEP.
 * Devolve o valor formatado (para exibir) e o valor cru (para enviar).
 */
export function useInputMask(kind: MaskKind, initial = '') {
  const [value, setValue] = useState(initial)

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const digits = event.target.value.replace(/\D/g, '')
      setValue(MASKS[kind](digits))
    },
    [kind],
  )

  const reset = useCallback(() => setValue(''), [])

  return { value, rawValue: value.replace(/\D/g, ''), onChange, reset }
}
