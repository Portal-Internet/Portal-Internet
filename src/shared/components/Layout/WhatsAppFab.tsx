import { CONTACTS } from '@/shared/lib/contacts'
import { buildWhatsAppLink } from '@/shared/lib/whatsapp'
import styles from './WhatsAppFab.module.css'

const WHATSAPP_PATH =
  'M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.09 3.2 5.07 4.48.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.8h-.02c-1.75 0-3.47-.47-4.97-1.36l-.36-.21-3.7.97.99-3.6-.23-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.13 1.03 7 2.9a9.82 9.82 0 0 1 2.9 6.99c0 5.45-4.44 9.88-9.9 9.88M20.52 3.45A11.78 11.78 0 0 0 12.05 0C5.5 0 .17 5.33.17 11.87c0 2.09.55 4.13 1.59 5.93L.07 24l6.35-1.66a11.86 11.86 0 0 0 5.62 1.43h.01c6.54 0 11.87-5.33 11.87-11.87 0-3.17-1.23-6.15-3.47-8.39'

/** Botão flutuante do WhatsApp — só no desktop; no mobile a barra fixa cumpre o papel. */
export function WhatsAppFab() {
  return (
    <a
      className={styles.fab}
      href={buildWhatsAppLink(
        CONTACTS.sales.whatsapp,
        'Olá! Vim pelo site e quero mais informações',
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={WHATSAPP_PATH} />
      </svg>
    </a>
  )
}
