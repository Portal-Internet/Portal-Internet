import { Button, Card } from '@/shared/components/ui'
import { CONTACTS } from '@/shared/lib/contacts'
import { buildWhatsAppLink } from '@/shared/lib/whatsapp'
import styles from './Contratacao.module.css'

const DUVIDAS = buildWhatsAppLink(
  CONTACTS.sales.whatsapp,
  'Oi! Acabei de enviar meu cadastro e tenho uma dúvida.',
)

/**
 * Não repete nenhum dado enviado.
 *
 * O RPC devolve apenas `{ ok }` — nem teríamos o que mostrar — e reexibir CPF
 * numa tela que pode ficar aberta no celular não ajudaria ninguém.
 */
export function SucessoContratacao() {
  return (
    <Card animated={false} className={styles.aviso}>
      <h2 className={styles.avisoTitulo}>Cadastro recebido!</h2>
      <p className={styles.avisoTexto}>
        Nossa equipe vai entrar em contato para combinar o dia da instalação. Lembrando: a
        taxa de instalação e ativação é de R$ 150, e a primeira mensalidade vence 30 dias
        depois que o serviço estiver funcionando.
      </p>
      <div className={styles.avisoAcoes}>
        <Button
          as="a"
          variant="whatsapp"
          href={DUVIDAS}
          target="_blank"
          rel="noopener noreferrer"
        >
          Tirar uma dúvida
        </Button>
        <Button as="route" to="/" variant="outline">
          Ir para a página inicial
        </Button>
      </div>
    </Card>
  )
}
