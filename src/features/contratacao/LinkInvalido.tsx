import { Button, Card } from '@/shared/components/ui'
import { CONTACTS } from '@/shared/lib/contacts'
import { buildWhatsAppLink } from '@/shared/lib/whatsapp'
import styles from './Contratacao.module.css'

const PEDIR_NOVO = buildWhatsAppLink(
  CONTACTS.sales.whatsapp,
  'Oi! Meu link de cadastro não está funcionando, pode gerar outro?',
)

/**
 * Token inexistente, expirado ou já preenchido caem todos aqui.
 *
 * O servidor não distingue os três casos de propósito — quem estiver
 * sondando não aprende nada com a diferença — então o texto também não pode
 * prometer saber qual foi.
 */
export function LinkInvalido() {
  return (
    <Card animated={false} className={styles.aviso}>
      <h2 className={styles.avisoTitulo}>Este link não está mais disponível</h2>
      <p className={styles.avisoTexto}>
        Cada link de cadastro vale por 72 horas e pode ser preenchido uma única vez. Se o
        seu passou do prazo ou já foi usado, é só pedir um novo ao consultor que te
        atendeu.
      </p>
      <div className={styles.avisoAcoes}>
        <Button
          as="a"
          variant="whatsapp"
          href={PEDIR_NOVO}
          target="_blank"
          rel="noopener noreferrer"
        >
          Pedir um link novo
        </Button>
        <Button as="route" to="/" variant="outline">
          Ir para a página inicial
        </Button>
      </div>
    </Card>
  )
}
