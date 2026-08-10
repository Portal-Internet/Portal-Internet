import { formatPrice } from '@/shared/lib/format'
import { COMPARABLE_PLANS, COMPARED_FEATURES } from '@/shared/data/plans'
import styles from './PlanCompareTable.module.css'

export function PlanCompareTable() {
  return (
    <>
      <div className={styles.wrap}>
        <table className={styles.table}>
          <caption className="sr-only">Comparativo dos planos da Portal Internet</caption>
          <thead>
            <tr>
              <th scope="col">Recurso</th>
              {COMPARABLE_PLANS.map((plan) => (
                <th key={plan.id} scope="col">
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Velocidade</th>
              {COMPARABLE_PLANS.map((plan) => (
                <td key={plan.id}>{plan.speedMega} MEGA</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Mensalidade</th>
              {COMPARABLE_PLANS.map((plan) => (
                <td key={plan.id}>{formatPrice(plan.priceMonthly)}</td>
              ))}
            </tr>
            {COMPARED_FEATURES.map((feature) => (
              <tr key={feature}>
                <th scope="row">{feature}</th>
                {COMPARABLE_PLANS.map((plan) => {
                  const included = plan.features.includes(feature)
                  return (
                    <td key={plan.id} className={included ? styles.yes : styles.no}>
                      {included ? 'Sim' : '—'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.hint}>Role a tabela para o lado no celular.</p>
    </>
  )
}
