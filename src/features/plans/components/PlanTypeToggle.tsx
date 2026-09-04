import { useEffect, useRef, useState } from 'react'
import type { PlanTier } from '@/shared/types/plan'
import styles from './PlanTypeToggle.module.css'

const OPTIONS: { value: PlanTier; label: string }[] = [
  { value: 'residencial', label: 'Residencial' },
  { value: 'empresarial', label: 'Empresarial' },
  { value: 'dedicado', label: 'Links Dedicados' },
]

interface PlanTypeToggleProps {
  value: PlanTier
  onChange: (tier: PlanTier) => void
  className?: string
}

export function PlanTypeToggle({ value, onChange, className }: PlanTypeToggleProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [thumbRect, setThumbRect] = useState({ left: 0, width: 0 })

  const activeIndex = OPTIONS.findIndex((option) => option.value === value)

  useEffect(() => {
    const updateThumb = () => {
      const activeButton = buttonRefs.current[activeIndex]
      if (activeButton) {
        setThumbRect({ left: activeButton.offsetLeft, width: activeButton.offsetWidth })
      }
    }

    updateThumb()

    window.addEventListener('resize', updateThumb)
    return () => window.removeEventListener('resize', updateThumb)
  }, [activeIndex])

  return (
    <div
      className={[styles.toggle, className].filter(Boolean).join(' ')}
      role="tablist"
      aria-label="Tipo de plano"
    >
      <div
        className={styles.thumb}
        style={{
          transform: `translateX(${thumbRect.left}px)`,
          width: `${thumbRect.width}px`,
        }}
      />
      {OPTIONS.map((option, index) => (
        <button
          key={option.value}
          ref={(el) => {
            buttonRefs.current[index] = el
          }}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          className={value === option.value ? styles.active : undefined}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
