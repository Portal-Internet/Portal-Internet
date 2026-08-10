import styles from './FiberBackground.module.css'

const STRANDS = [
  { top: '6%', rotate: -16, duration: 3.8 },
  { top: '24%', rotate: 10, duration: 5 },
  { top: '46%', rotate: -10, duration: 4.2 },
  { top: '68%', rotate: 14, duration: 5.6 },
  { top: '88%', rotate: -13, duration: 4 },
]

/**
 * Fundo fixo e decorativo que sugere cabos de fibra com pulsos de luz
 * passando. Fica atrás do conteúdo (z-index negativo) e só aparece nas
 * áreas sem fundo opaco. Some sozinho com `prefers-reduced-motion`.
 */
export function FiberBackground() {
  return (
    <div className={styles.stage} aria-hidden="true">
      {STRANDS.map((strand, index) => (
        <span
          key={index}
          className={styles.strand}
          style={{
            top: strand.top,
            transform: `rotate(${strand.rotate}deg)`,
            animationDuration: `${strand.duration}s`,
            animationDelay: `${index * -0.8}s`,
          }}
        />
      ))}
    </div>
  )
}
