export type ContratacaoLink =
  | {
      valido: true
      prefillNome: string | null
      prefillTelefone: string | null
      planoId: string
    }
  | { valido: false }

/** Corpo que `submit_contratacao` espera. Nomes espelham as colunas. */
export interface ContratacaoPayload {
  nome_completo: string
  tipo: 'fisica' | 'juridica'
  documento: string
  rg: string
  email: string
  /** ISO `AAAA-MM-DD` — o Postgres não entende `DD/MM/AAAA`. */
  data_nascimento: string
  telefone: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
  plano_id: string
  consentimento: boolean
}
