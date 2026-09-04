import { Button, Card, Reveal, SectionHead } from '@/shared/components/ui'
import { ADDRESS } from '@/shared/lib/contacts'
import { Section } from './Container'
import styles from './LocationSection.module.css'

export function LocationSection() {
  return (
    <Section tone="paper" tight>
      <SectionHead
        centered
        kicker="Onde estamos"
        title="Venha nos visitar"
        description="Atendimento presencial no endereço abaixo, em São Luís."
      />

      <Reveal className={styles.mapGrid}>
        <iframe
          className={styles.map}
          src={ADDRESS.mapEmbedUrl}
          title="Localização da Portal Internet no mapa"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        <Card icon="📍" title="Endereço">
          <p>
            {ADDRESS.building}
            <br />
            {ADDRESS.street}
            <br />
            {ADDRESS.district} — {ADDRESS.city}
            <br />
            CEP {ADDRESS.zip}
          </p>
          {/* Discreto de propósito: o próprio mapa já leva ao Google Maps. */}
          <Button
            as="a"
            variant="outline"
            size="sm"
            className={styles.mapsLink}
            href={ADDRESS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir no Google Maps ↗
          </Button>
        </Card>
      </Reveal>
    </Section>
  )
}
