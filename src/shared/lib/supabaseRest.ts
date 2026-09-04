/**
 * Chamada de RPC do Supabase por `fetch` puro.
 *
 * O site não instala `@supabase/supabase-js` de propósito: existem só duas
 * chamadas, nenhuma sessão para gerenciar, e o SDK custaria cerca de 35 kB
 * gzip num bundle afinado para 98 de Lighthouse.
 *
 * A chave anon é pública por natureza — ela vai no JavaScript entregue ao
 * navegador. Quem protege os dados é o RLS: esse papel não tem privilégio em
 * tabela nenhuma, apenas permissão de executar duas funções que jamais
 * devolvem dado de cliente.
 */
const URL_BASE = import.meta.env.VITE_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export class RpcError extends Error {
  /** Código do Postgres: P0001 link inválido, P0002 dado inválido. */
  readonly code: string | null

  constructor(message: string, code: string | null) {
    super(message)
    this.name = 'RpcError'
    this.code = code
  }
}

export function supabaseConfigurado(): boolean {
  return Boolean(URL_BASE && ANON_KEY)
}

export async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  if (!supabaseConfigurado()) {
    throw new RpcError('VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não definidos', null)
  }

  const response = await fetch(`${URL_BASE}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  })

  if (!response.ok) {
    const corpo: { message?: string; code?: string } | null = await response
      .json()
      .catch(() => null)
    throw new RpcError(corpo?.message ?? `Falha em ${fn}`, corpo?.code ?? null)
  }

  return (await response.json()) as T
}
