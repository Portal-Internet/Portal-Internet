import { Button } from '@/shared/components/ui'
import { formatPrice } from '@/shared/lib/format'
import { buildWhatsAppLink } from '@/shared/lib/whatsapp'
import { QUESTIONS } from './data/questions'
import { usePlanFinder } from './usePlanFinder'
import styles from './PlanFinder.module.css'

/** Três perguntas que indicam o plano — sem cadastro e sem envio de dados. */
export function PlanFinder() {
  const finder = usePlanFinder()
  const question = QUESTIONS[finder.step]

  return (
    <div className={styles.finder}>
      <div className={styles.bar}>
        <div className={styles.track}>
          <div className={styles.progress} style={{ width: `${finder.progress}%` }} />
        </div>
        <span className={styles.stepLabel}>
          {finder.result ? 'Pronto' : `${finder.step + 1} de ${finder.totalSteps}`}
        </span>
      </div>

      {finder.result ? (
        <div className={styles.result}>
          <span className={styles.badge}>Plano indicado para você</span>
          <p className={styles.speed}>{finder.result.speedMega} MEGA</p>
          <p className={styles.planName}>
            Plano {finder.result.name} · {formatPrice(finder.result.priceMonthly)}/mês
          </p>
          <p className={styles.why}>{finder.result.forWhom}</p>

          <div className={styles.actions}>
            <Button
              as="a"
              href={buildWhatsAppLink(
                finder.result.whatsapp,
                `Olá! Vim pelo site, quero contratar o Plano ${finder.result.name} de ${finder.result.speedMega} MEGA`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Contratar esse plano
            </Button>
            <Button variant="outline" onClick={finder.restart}>
              Refazer
            </Button>
          </div>
        </div>
      ) : (
        question && (
          <div key={question.id}>
            <p className={styles.question}>{question.question}</p>
            <div className={styles.options}>
              {question.options.map((option) => {
                const isSelected = finder.answers[finder.step] === option.value
                return (
                  <button
                    key={`${option.label}-${option.value}`}
                    type="button"
                    className={[styles.option, isSelected ? styles.selected : null]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => finder.answer(option.value)}
                  >
                    <b>{option.label}</b>
                    <span>{option.hint}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      )}

      <div className={styles.nav}>
        {finder.canGoBack ? (
          <button type="button" className={styles.back} onClick={finder.goBack}>
            ‹ Voltar
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}
