import { useCallback, useState } from 'react'
import { rpc, RpcError } from '@/shared/lib/supabaseRest'
import type { ContratacaoPayload } from './types'

const MENSAGEM_POR_CODIGO: Record<string, string> = {
  P0001:
    'Este link não está mais disponível. Fale com seu consultor para receber um novo.',
  P0002: 'Alguns dados não foram aceitos. Confira e tente de novo.',
}

export function useContratacaoSubmit(token: string) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [concluido, setConcluido] = useState(false)

  const enviar = useCallback(
    async (payload: ContratacaoPayload) => {
      setEnviando(true)
      setErro(null)

      try {
        await rpc<{ ok: boolean }>('submit_contratacao', {
          p_token: token,
          p_dados: payload,
        })
        setConcluido(true)
      } catch (causa) {
        // O formulário não é limpo: quem errou tenta de novo sem redigitar
        // dez campos.
        setErro(
          causa instanceof RpcError && causa.code && MENSAGEM_POR_CODIGO[causa.code]
            ? MENSAGEM_POR_CODIGO[causa.code]
            : 'Não conseguimos enviar agora. Verifique sua conexão e tente de novo.',
        )
      } finally {
        setEnviando(false)
      }
    },
    [token],
  )

  return { enviar, enviando, erro, concluido }
}
