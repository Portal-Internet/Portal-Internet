const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/** Formata um valor mensal em reais: 189.9 → "R$ 189,90". */
export function formatPrice(value: number): string {
  return BRL.format(value)
}

/** Separa o preço em partes, para montar o card com tipografia diferente. */
export function splitPrice(value: number): { integer: string; cents: string } {
  const [integer, cents = '00'] = value.toFixed(2).split('.')
  return { integer, cents }
}

/** Percentual da barra comparativa, tendo o plano mais rápido como 100%. */
export function speedPercent(speedMega: number, maxMega: number): number {
  if (maxMega <= 0) return 0
  return Math.round((speedMega / maxMega) * 100)
}
