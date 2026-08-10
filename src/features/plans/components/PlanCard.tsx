import type { Plan } from '@/shared/types/plan'
import { Button, Chip, Reveal, SpeedBar } from '@/shared/components/ui'
import { splitPrice, speedPercent } from '@/shared/lib/format'
import { buildWhatsAppLink } from '@/shared/lib/whatsapp'
import { MAX_SPEED } from '@/shared/data/plans'
import styles from './PlanCard.module.css'

interface PlanCardProps {
  plan: Plan
}

export function PlanCard({ plan }: PlanCardProps) {
  const { integer, cents } = splitPrice(plan.priceMonthly)
  const percent = speedPercent(plan.speedMega, MAX_SPEED)

  const href = buildWhatsAppLink(
    plan.whatsapp,
    `Olá! Vim pelo site, quero contratar o Plano ${plan.name}`,
  )

  return (
    <Reveal
      as="article"
      id={plan.id}
      className={[styles.card, plan.featured ? styles.featured : null]
        .filter(Boolean)
        .join(' ')}
    >
      {plan.flag ? <span className={styles.flag}>{plan.flag}</span> : null}

      <p className={styles.name}>Plano {plan.name}</p>

      <p className={styles.speed}>
        <b>{plan.speedMega}</b>
        <span>MEGA</span>
      </p>

      <SpeedBar
        percent={percent}
        onDark={plan.featured}
        label={`${plan.speedMega} de ${MAX_SPEED} MEGA`}
      />

      <div className={styles.badges}>
        {plan.badges.map((badge, index) => (
          <Chip
            key={badge}
            variant={index === 0 ? 'default' : 'outline'}
            onDark={plan.featured}
          >
            {badge}
          </Chip>
        ))}
      </div>

      <p className={styles.price}>
        <i>R$</i>
        <b>{integer}</b>
        <em>,{cents}/mês</em>
      </p>

      <p className={styles.forWhom}>{plan.forWhom}</p>

      <ul className={styles.features}>
        {plan.features.map((feature) => (
          <li key={feature}>
            <span className={styles.check} aria-hidden="true">
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <Button
        as="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        variant={plan.featured ? 'vivid' : 'outline'}
        fullWidth
      >
        Contratar plano
      </Button>
    </Reveal>
  )
}

interface PlanGridProps {
  plans: Plan[]
}

export function PlanGrid({ plans }: PlanGridProps) {
  return (
    <>
      <div className={styles.grid} data-count={plans.length}>
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {/* Vale para todos os planos — por isso fica fora dos cards, e não repetido como selo. */}
      <p className={styles.gridNote}>
        <span className={styles.check} aria-hidden="true">
          ✓
        </span>
        Todos os planos são <b>100% fibra óptica</b>, da central até o seu endereço.
      </p>
    </>
  )
}
