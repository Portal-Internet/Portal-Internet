import { useRef, type FormEvent } from 'react'
import { Button, Field, FieldRow, Input } from '@/shared/components/ui'
import { useInputMask } from '@/shared/hooks/useInputMask'
import { CONTACTS } from '@/shared/lib/contacts'
import { buildWhatsAppLink } from '@/shared/lib/whatsapp'
import { useCoverageRequest, type CoverageRequest } from './useCoverageRequest'
import styles from './CoverageChecker.module.css'

interface CoverageCheckerProps {
  /** Prefixo dos ids dos campos — evita colisão quando há dois formulários na página. */
  idPrefix?: string
  children?: React.ReactNode
}

export function CoverageChecker({
  idPrefix = 'cobertura',
  children,
}: CoverageCheckerProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const phone = useInputMask('tel')
  const cep = useInputMask('cep')
  const { result, submit } = useCoverageRequest()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    const request: CoverageRequest = {
      nome: String(data.get('nome') ?? ''),
      email: String(data.get('email') ?? ''),
      whatsapp: phone.value,
      cep: cep.value,
    }

    submit(request)
    formRef.current?.reset()
    phone.reset()
    cep.reset()
  }

  return (
    <div className={styles.box}>
      {children}

      <form ref={formRef} onSubmit={handleSubmit}>
        <FieldRow>
          <Field id={`${idPrefix}-nome`} label="Nome">
            <Input
              id={`${idPrefix}-nome`}
              name="nome"
              type="text"
              autoComplete="name"
              required
            />
          </Field>
          <Field id={`${idPrefix}-email`} label="E-mail">
            <Input
              id={`${idPrefix}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </Field>
        </FieldRow>

        <FieldRow>
          <Field id={`${idPrefix}-whatsapp`} label="WhatsApp">
            <Input
              id={`${idPrefix}-whatsapp`}
              name="whatsapp"
              type="tel"
              inputMode="numeric"
              placeholder="(98) 90000-0000"
              value={phone.value}
              onChange={phone.onChange}
              // 14 caracteres = fixo com máscara; celular tem 15.
              minLength={14}
              required
            />
          </Field>
          <Field id={`${idPrefix}-cep`} label="CEP">
            <Input
              id={`${idPrefix}-cep`}
              name="cep"
              type="text"
              inputMode="numeric"
              placeholder="65000-000"
              value={cep.value}
              onChange={cep.onChange}
              minLength={9}
              required
            />
          </Field>
        </FieldRow>

        <Button type="submit" fullWidth>
          Verificar disponibilidade
        </Button>
      </form>

      {result ? (
        <div className={styles.result}>
          <h3>Consulta enviada, {result.firstName}!</h3>
          <p>
            Abrimos o WhatsApp com seus dados e o CEP <strong>{result.cep}</strong> já
            preenchidos. Se a conversa não abriu sozinha, use o botão abaixo.
          </p>
          <Button
            as="a"
            variant="whatsapp"
            href={result.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir WhatsApp
          </Button>
        </div>
      ) : null}

      <p className={styles.note}>
        Prefere resolver agora?{' '}
        <a
          className={styles.link}
          href={buildWhatsAppLink(
            CONTACTS.sales.whatsapp,
            'Olá! Vim através do site e gostaria de mais informações',
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          Fale com o time de vendas no WhatsApp →
        </a>
      </p>
    </div>
  )
}
