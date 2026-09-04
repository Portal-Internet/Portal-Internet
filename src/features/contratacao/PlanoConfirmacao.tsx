import { useState } from 'react'
import { PLANS } from '@/shared/data/plans'
import { formatPrice } from '@/shared/lib/format'
import { Field, Select } from '@/shared/components/ui'
import styles from './PlanoConfirmacao.module.css'

interface PlanoConfirmacaoProps {
  planoId: string
  onTrocar: (novo: string) => void
}

/**
 * Confirma o plano que já foi negociado no telefone, em vez de pedir para
 * escolher de novo. A troca existe para quem mudou de ideia na hora — sem
 * ela, a pessoa teria que voltar ao vendedor e pedir outro link.
 */
export function PlanoConfirmacao({ planoId, onTrocar }: PlanoConfirmacaoProps) {
  const plano = PLANS.find((item) => item.id === planoId)
  // Plano descontinuado depois do link gerado: abre já no seletor, senão a
  // pessoa ficaria olhando um card vazio sem entender o que fazer.
  const [trocando, setTrocando] = useState(!plano)

  return (
    <div className={styles.bloco}>
      {plano && !trocando ? (
        <>
          <div className={styles.resumo}>
            <div>
              <p className={styles.rotulo}>Plano escolhido</p>
              <p className={styles.nome}>{plano.name}</p>
              <p className={styles.detalhe}>
                {plano.speedMega} Mbps · {formatPrice(plano.priceMonthly)}/mês
              </p>
            </div>
            <button
              type="button"
              className={styles.trocar}
              onClick={() => setTrocando(true)}
            >
              Trocar plano
            </button>
          </div>
        </>
      ) : (
        <Field id="plano-escolha" label="Plano">
          <Select
            id="plano-escolha"
            value={planoId}
            onChange={(event) => {
              onTrocar(event.target.value)
              setTrocando(false)
            }}
          >
            {PLANS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} — {item.speedMega} Mbps — {formatPrice(item.priceMonthly)}/mês
              </option>
            ))}
          </Select>
        </Field>
      )}
    </div>
  )
}
