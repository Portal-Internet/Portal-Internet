import { useCallback, useMemo, useState } from 'react'
import type { Plan } from '@/shared/types/plan'
import { QUESTIONS, type UsageProfile } from './data/questions'
import { recommendPlan } from './recommend'

interface PlanFinderState {
  /** Índice da pergunta atual. */
  step: number
  /** Resposta escolhida em cada pergunta, por índice. */
  answers: (string | undefined)[]
  /** Plano recomendado, disponível só depois da última resposta. */
  result: Plan | null
  totalSteps: number
  progress: number
  canGoBack: boolean
  answer: (value: string) => void
  goBack: () => void
  restart: () => void
}

export function usePlanFinder(): PlanFinderState {
  const totalSteps = QUESTIONS.length
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(string | undefined)[]>(() =>
    Array<string | undefined>(totalSteps).fill(undefined),
  )
  const [isFinished, setIsFinished] = useState(false)

  const answer = useCallback(
    (value: string) => {
      setAnswers((previous) => {
        const next = [...previous]
        next[step] = value
        return next
      })

      if (step < totalSteps - 1) {
        setStep((current) => current + 1)
      } else {
        setIsFinished(true)
      }
    },
    [step, totalSteps],
  )

  const goBack = useCallback(() => {
    setIsFinished(false)
    setStep((current) => Math.max(0, current - 1))
  }, [])

  const restart = useCallback(() => {
    setAnswers(Array<string | undefined>(totalSteps).fill(undefined))
    setStep(0)
    setIsFinished(false)
  }, [totalSteps])

  const result = useMemo(() => {
    if (!isFinished) return null
    const profile = (answers[0] ?? 'casa') as UsageProfile
    const load = Number(answers[1] ?? 0) + Number(answers[2] ?? 0)
    return recommendPlan(profile, load)
  }, [isFinished, answers])

  const progress = isFinished ? 100 : ((step + 1) / (totalSteps + 1)) * 100

  return {
    step,
    answers,
    result,
    totalSteps,
    progress,
    canGoBack: step > 0 && !isFinished,
    answer,
    goBack,
    restart,
  }
}
