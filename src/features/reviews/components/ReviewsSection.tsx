import { Section } from '@/shared/components/Layout'
import { Button, Reveal, SectionHead } from '@/shared/components/ui'
import { GOOGLE_RATING, GOOGLE_REVIEWS } from '@/shared/data/reviews'
import styles from './ReviewsSection.module.css'

function Stars({ rating }: { rating: number }) {
  return (
    <span className={styles.stars} aria-label={`${rating} de 5 estrelas`}>
      {'★'.repeat(rating)}
    </span>
  )
}

/** Prova social: avaliações públicas do perfil da empresa no Google. */
export function ReviewsSection() {
  return (
    <Section tone="mint" id="avaliacoes">
      <SectionHead
        centered
        kicker="Avaliações no Google"
        title={`Nota ${GOOGLE_RATING.score.toFixed(1).replace('.', ',')} de quem já é cliente`}
        description={`${GOOGLE_RATING.count} avaliações no perfil da Portal Internet no Google — o que aparece aqui foi escrito por clientes, não pela gente.`}
      />

      <div className={styles.grid}>
        {GOOGLE_REVIEWS.map((review, index) => (
          <Reveal
            as="blockquote"
            key={review.id}
            className={styles.card}
            delay={index * 60}
          >
            <Stars rating={review.rating} />
            <p className={styles.text}>{review.text}</p>
            <footer className={styles.author}>
              {review.author}
              <span>via Google</span>
            </footer>
          </Reveal>
        ))}
      </div>

      <div className={styles.action}>
        <Button
          as="a"
          variant="outline"
          size="sm"
          href={GOOGLE_RATING.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver todas as avaliações no Google ↗
        </Button>
      </div>
    </Section>
  )
}
