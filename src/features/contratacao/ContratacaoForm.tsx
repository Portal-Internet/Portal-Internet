import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button, Field, FieldRow, Input, Select } from '@/shared/components/ui'
import { applyMask } from '@/shared/hooks/useInputMask'
import { PlanoConfirmacao } from './PlanoConfirmacao'
import { useCep } from './useCep'
import { useContratacaoSubmit } from './useContratacaoSubmit'
import { isAdult, isValidCep, isValidCnpj, isValidCpf, isValidEmail } from './validation'
import type { ContratacaoLink, ContratacaoPayload } from './types'
import styles from './ContratacaoForm.module.css'

interface ContratacaoFormProps {
  link: Extract<ContratacaoLink, { valido: true }>
  token: string
  onConcluir: () => void
}

type Campos = Omit<ContratacaoPayload, 'plano_id'> & { plano_id: string }
type Erros = Partial<Record<keyof Campos, string>>

/** `DD/MM/AAAA` da máscara vira o ISO que o Postgres espera. */
function dataParaIso(mascarada: string): string {
  const [dia, mes, ano] = mascarada.split('/')
  return dia && mes && ano ? `${ano}-${mes}-${dia}` : ''
}

/**
 * Mensagem de erro do campo, abaixo do controle.
 *
 * Não usa o `hint` do `Field` de propósito: aquele slot é cinza discreto, e
 * um erro que parece dica passa despercebido justamente quando importa.
 */
function ErroCampo({ mensagem }: { mensagem?: string }) {
  if (!mensagem) return null
  return (
    <p className={styles.erroCampo} role="alert">
      {mensagem}
    </p>
  )
}

export function ContratacaoForm({ link, token, onConcluir }: ContratacaoFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const { buscar, buscando } = useCep()
  const { enviar, enviando, erro, concluido } = useContratacaoSubmit(token)

  const [campos, setCampos] = useState<Campos>({
    nome_completo: link.prefillNome ?? '',
    tipo: 'fisica',
    documento: '',
    rg: '',
    email: '',
    data_nascimento: '',
    telefone: link.prefillTelefone ? applyMask('tel', link.prefillTelefone) : '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    plano_id: link.planoId,
    consentimento: false,
  })
  const [erros, setErros] = useState<Erros>({})

  // Em efeito, e não durante o render: avisar o pai enquanto este componente
  // renderiza dispara atualização de estado no meio da renderização dele.
  useEffect(() => {
    if (concluido) {
      onConcluir()
    }
  }, [concluido, onConcluir])

  function set<K extends keyof Campos>(chave: K, valor: Campos[K]) {
    setCampos((atual) => ({ ...atual, [chave]: valor }))
    setErros((atual) => ({ ...atual, [chave]: undefined }))
  }

  async function aoSairDoCep() {
    if (!isValidCep(campos.cep)) return

    const endereco = await buscar(campos.cep)
    if (!endereco) return

    // Só preenche o que está vazio: quem já corrigiu à mão não perde a edição
    // se voltar ao campo de CEP.
    setCampos((atual) => ({
      ...atual,
      logradouro: atual.logradouro || endereco.logradouro,
      bairro: atual.bairro || endereco.bairro,
      cidade: atual.cidade || endereco.cidade,
      uf: atual.uf || endereco.uf,
    }))
  }

  function validar(): Erros {
    const novos: Erros = {}
    const pessoaFisica = campos.tipo === 'fisica'

    if (campos.nome_completo.trim().length < 3) {
      novos.nome_completo = 'Informe o nome completo.'
    }
    if (pessoaFisica && !isValidCpf(campos.documento)) {
      novos.documento = 'CPF inválido. Confira os números.'
    }
    if (!pessoaFisica && !isValidCnpj(campos.documento)) {
      novos.documento = 'CNPJ inválido. Confira os números.'
    }
    if (!isValidEmail(campos.email)) {
      novos.email = 'Informe um e-mail válido.'
    }
    if (campos.telefone.replace(/\D/g, '').length < 10) {
      novos.telefone = 'Informe o telefone com DDD.'
    }
    if (pessoaFisica && !isAdult(dataParaIso(campos.data_nascimento))) {
      novos.data_nascimento = 'O titular precisa ter 18 anos ou mais.'
    }
    if (!isValidCep(campos.cep)) {
      novos.cep = 'CEP inválido.'
    }
    for (const chave of ['logradouro', 'numero', 'bairro', 'cidade'] as const) {
      if (!campos[chave].trim()) {
        novos[chave] = 'Campo obrigatório.'
      }
    }
    if (campos.uf.trim().length !== 2) {
      novos.uf = 'UF com 2 letras.'
    }
    if (!campos.consentimento) {
      novos.consentimento = 'É preciso concordar para continuar.'
    }

    return novos
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()

    const novos = validar()
    setErros(novos)

    const primeiro = Object.keys(novos)[0]
    if (primeiro) {
      // Leva a pessoa até o erro em vez de deixá-la procurar numa página
      // que pode estar rolada bem abaixo do primeiro campo inválido.
      const alvo = formRef.current?.querySelector<HTMLElement>(`[name="${primeiro}"]`)
      alvo?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      alvo?.focus({ preventScroll: true })
      return
    }

    await enviar({
      ...campos,
      documento: campos.documento.replace(/\D/g, ''),
      telefone: campos.telefone.replace(/\D/g, ''),
      cep: campos.cep.replace(/\D/g, ''),
      data_nascimento: dataParaIso(campos.data_nascimento),
      uf: campos.uf.toUpperCase(),
    })
  }

  const pessoaFisica = campos.tipo === 'fisica'
  const mascaraDocumento = pessoaFisica ? 'cpf' : 'cnpj'

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
      <PlanoConfirmacao
        planoId={campos.plano_id}
        onTrocar={(novo) => set('plano_id', novo)}
      />

      <fieldset className={styles.grupo}>
        <legend className={styles.legenda}>Seus dados</legend>

        <Field id="tipo" label="Tipo de cadastro">
          <Select
            id="tipo"
            name="tipo"
            value={campos.tipo}
            onChange={(event) => {
              set('tipo', event.target.value as 'fisica' | 'juridica')
              set('documento', '')
            }}
          >
            <option value="fisica">Pessoa física (CPF)</option>
            <option value="juridica">Pessoa jurídica (CNPJ)</option>
          </Select>
        </Field>

        <Field id="nome_completo" label={pessoaFisica ? 'Nome completo' : 'Razão social'}>
          <Input
            id="nome_completo"
            name="nome_completo"
            autoComplete="name"
            aria-invalid={Boolean(erros.nome_completo)}
            value={campos.nome_completo}
            onChange={(event) => set('nome_completo', event.target.value)}
          />
          <ErroCampo mensagem={erros.nome_completo} />
        </Field>

        <FieldRow>
          <Field id="documento" label={pessoaFisica ? 'CPF' : 'CNPJ'}>
            <Input
              id="documento"
              name="documento"
              inputMode="numeric"
              aria-invalid={Boolean(erros.documento)}
              value={campos.documento}
              onChange={(event) =>
                set('documento', applyMask(mascaraDocumento, event.target.value))
              }
            />
            <ErroCampo mensagem={erros.documento} />
          </Field>

          {pessoaFisica ? (
            <Field id="rg" label="RG" hint="Opcional.">
              <Input
                id="rg"
                name="rg"
                value={campos.rg}
                onChange={(event) => set('rg', event.target.value)}
              />
            </Field>
          ) : null}
        </FieldRow>

        <FieldRow>
          <Field id="email" label="E-mail">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(erros.email)}
              value={campos.email}
              onChange={(event) => set('email', event.target.value)}
            />
            <ErroCampo mensagem={erros.email} />
          </Field>

          <Field id="telefone" label="Telefone com DDD">
            <Input
              id="telefone"
              name="telefone"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={Boolean(erros.telefone)}
              value={campos.telefone}
              onChange={(event) => set('telefone', applyMask('tel', event.target.value))}
            />
            <ErroCampo mensagem={erros.telefone} />
          </Field>
        </FieldRow>

        {pessoaFisica ? (
          <Field id="data_nascimento" label="Data de nascimento">
            <Input
              id="data_nascimento"
              name="data_nascimento"
              inputMode="numeric"
              placeholder="DD/MM/AAAA"
              aria-invalid={Boolean(erros.data_nascimento)}
              value={campos.data_nascimento}
              onChange={(event) =>
                set('data_nascimento', applyMask('date', event.target.value))
              }
            />
            <ErroCampo mensagem={erros.data_nascimento} />
          </Field>
        ) : null}
      </fieldset>

      <fieldset className={styles.grupo}>
        <legend className={styles.legenda}>Endereço da instalação</legend>

        <Field id="cep" label="CEP" hint={buscando ? 'Buscando endereço…' : undefined}>
          <Input
            id="cep"
            name="cep"
            inputMode="numeric"
            autoComplete="postal-code"
            aria-invalid={Boolean(erros.cep)}
            value={campos.cep}
            onChange={(event) => set('cep', applyMask('cep', event.target.value))}
            onBlur={() => void aoSairDoCep()}
          />
          <ErroCampo mensagem={erros.cep} />
        </Field>

        <FieldRow>
          <Field id="logradouro" label="Rua">
            <Input
              id="logradouro"
              name="logradouro"
              autoComplete="address-line1"
              aria-invalid={Boolean(erros.logradouro)}
              value={campos.logradouro}
              onChange={(event) => set('logradouro', event.target.value)}
            />
            <ErroCampo mensagem={erros.logradouro} />
          </Field>

          <Field id="numero" label="Número">
            <Input
              id="numero"
              name="numero"
              aria-invalid={Boolean(erros.numero)}
              value={campos.numero}
              onChange={(event) => set('numero', event.target.value)}
            />
            <ErroCampo mensagem={erros.numero} />
          </Field>
        </FieldRow>

        <FieldRow>
          <Field id="complemento" label="Complemento" hint="Opcional.">
            <Input
              id="complemento"
              name="complemento"
              value={campos.complemento}
              onChange={(event) => set('complemento', event.target.value)}
            />
          </Field>

          <Field id="bairro" label="Bairro">
            <Input
              id="bairro"
              name="bairro"
              aria-invalid={Boolean(erros.bairro)}
              value={campos.bairro}
              onChange={(event) => set('bairro', event.target.value)}
            />
            <ErroCampo mensagem={erros.bairro} />
          </Field>
        </FieldRow>

        <FieldRow>
          <Field id="cidade" label="Cidade">
            <Input
              id="cidade"
              name="cidade"
              aria-invalid={Boolean(erros.cidade)}
              value={campos.cidade}
              onChange={(event) => set('cidade', event.target.value)}
            />
            <ErroCampo mensagem={erros.cidade} />
          </Field>

          <Field id="uf" label="UF">
            <Input
              id="uf"
              name="uf"
              maxLength={2}
              aria-invalid={Boolean(erros.uf)}
              value={campos.uf}
              onChange={(event) =>
                set('uf', event.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase())
              }
            />
            <ErroCampo mensagem={erros.uf} />
          </Field>
        </FieldRow>
      </fieldset>

      <label className={styles.consentimento}>
        <input
          type="checkbox"
          name="consentimento"
          checked={campos.consentimento}
          onChange={(event) => set('consentimento', event.target.checked)}
        />
        <span>
          Autorizo a Portal Internet a usar meus dados para contratação, instalação e
          cobrança do serviço. Cadastros de clientes ativos são guardados enquanto o
          contrato durar, mais o prazo legal de 5 anos; cadastros cancelados são
          anonimizados após 12 meses.
        </span>
      </label>
      {erros.consentimento ? (
        <p className={styles.erroCampo}>{erros.consentimento}</p>
      ) : null}

      <div className={styles.condicoes}>
        <p>
          Taxa de instalação e ativação: <strong>R$ 150</strong>. A primeira mensalidade
          vence 30 dias após a instalação. Os equipamentos ficam em comodato enquanto o
          contrato estiver vigente.
        </p>
      </div>

      {erro ? (
        <p className={styles.erroEnvio} role="alert">
          {erro}
        </p>
      ) : null}

      <Button type="submit" fullWidth disabled={enviando}>
        {enviando ? 'Enviando…' : 'Enviar cadastro'}
      </Button>
    </form>
  )
}
