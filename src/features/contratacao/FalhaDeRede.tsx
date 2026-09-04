import { Button, Card } from '@/shared/components/ui'
import styles from './Contratacao.module.css'

/** Distinta de `LinkInvalido`: aqui o link pode estar ótimo. */
export function FalhaDeRede({ onTentarDeNovo }: { onTentarDeNovo: () => void }) {
  return (
    <Card animated={false} className={styles.aviso}>
      <h2 className={styles.avisoTitulo}>Não conseguimos carregar</h2>
      <p className={styles.avisoTexto}>
        Verifique sua conexão e tente de novo. Seu link continua válido.
      </p>
      <div className={styles.avisoAcoes}>
        <Button onClick={onTentarDeNovo}>Tentar de novo</Button>
      </div>
    </Card>
  )
}
