import { useCallback, useEffect, useState } from 'react'
import { rpc } from '@/shared/lib/supabaseRest'
import type { ContratacaoLink } from './types'

interface RespostaBruta {
  valido: boolean
  prefill_nome: string | null
  prefill_telefone: string | null
  plano_id: string
}

export function useContratacaoLink(token: string | undefined) {
  const [link, setLink] = useState<ContratacaoLink | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [falhaDeRede, setFalhaDeRede] = useState(false)

  const carregar = useCallback(() => {
    if (!token) {
      setLink({ valido: false })
      setCarregando(false)
      return () => {}
    }

    let ativo = true
    setCarregando(true)
    setFalhaDeRede(false)

    rpc<RespostaBruta>('get_contract_link', { p_token: token })
      .then((resposta) => {
        if (!ativo) return
        setLink(
          resposta.valido
            ? {
                valido: true,
                prefillNome: resposta.prefill_nome,
                prefillTelefone: resposta.prefill_telefone,
                planoId: resposta.plano_id,
              }
            : { valido: false },
        )
      })
      .catch(() => {
        // Falha de rede não é o mesmo que link ruim. Mandar alguém para a
        // tela de "link inválido" porque o Wi-Fi caiu seria mentir, e ainda
        // faria a pessoa pedir um link novo sem precisar.
        if (ativo) setFalhaDeRede(true)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [token])

  useEffect(() => carregar(), [carregar])

  return { link, carregando, falhaDeRede, tentarDeNovo: carregar }
}
