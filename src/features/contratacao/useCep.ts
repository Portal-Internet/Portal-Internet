import { useCallback, useState } from 'react'

export interface EnderecoViaCep {
  logradouro: string
  bairro: string
  cidade: string
  uf: string
}

interface RespostaViaCep {
  erro?: boolean | string
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
}

/**
 * Preenchimento de endereço pelo CEP, via ViaCEP (sem chave).
 *
 * Nunca lança e nunca bloqueia o envio: se o serviço estiver fora do ar ou o
 * CEP não existir na base, o endereço vira preenchimento manual. Conveniência
 * não pode virar dependência num formulário que precisa ser concluído.
 */
export function useCep() {
  const [buscando, setBuscando] = useState(false)

  const buscar = useCallback(async (cep: string): Promise<EnderecoViaCep | null> => {
    const digitos = cep.replace(/\D/g, '')
    if (digitos.length !== 8) {
      return null
    }

    setBuscando(true)
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${digitos}/json/`)
      if (!resposta.ok) {
        return null
      }

      const dados = (await resposta.json()) as RespostaViaCep
      if (dados.erro) {
        return null
      }

      return {
        logradouro: dados.logradouro ?? '',
        bairro: dados.bairro ?? '',
        cidade: dados.localidade ?? '',
        uf: dados.uf ?? '',
      }
    } catch {
      return null
    } finally {
      setBuscando(false)
    }
  }, [])

  return { buscar, buscando }
}
