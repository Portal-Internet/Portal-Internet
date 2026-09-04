import type { Plan } from '@/shared/types/plan'
import { getPlanById, PLANS } from '@/shared/data/plans'
import type { UsageProfile } from './data/questions'

/**
 * Regra de recomendação — função pura, fácil de testar isoladamente.
 *
 * O perfil define a família do plano; a carga (soma das duas últimas
 * respostas, de 0 a 6) decide se sobe de degrau.
 */
export function recommendPlan(profile: UsageProfile, load: number): Plan {
  const fallback = PLANS[0]

  if (profile === 'gamer') {
    return getPlanById(load >= 4 ? 'streaming' : 'gamer') ?? fallback
  }

  if (profile === 'empresa') {
    if (load >= 4) return getPlanById('executivo') ?? fallback
    if (load >= 2) return getPlanById('business') ?? fallback
    return getPlanById('empresarial') ?? fallback
  }

  // Perfil "casa": sobe dentro da linha residencial, nunca para a empresarial.
  if (load >= 4) return getPlanById('streaming') ?? fallback
  if (load >= 2) return getPlanById('gamer') ?? fallback
  return getPlanById('home-office') ?? fallback
}
