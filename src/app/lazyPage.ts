import { lazy } from 'react'
import type { ComponentType } from 'react'

/**
 * Uma publicação nova troca o hash dos chunks: quem está com o `index.html`
 * antigo pede um arquivo que não existe mais. A flag garante que a falha vire
 * um único reload — se o chunk continuar faltando, o erro sobe para o
 * `errorElement` em vez de entrar em loop.
 */
const RELOAD_FLAG = 'pi:chunk-reload'

function readFlag(): boolean {
  try {
    return sessionStorage.getItem(RELOAD_FLAG) !== null
  } catch {
    return true // sem sessionStorage não dá para evitar o loop — não recarrega.
  }
}

function writeFlag(value: boolean): void {
  try {
    if (value) {
      sessionStorage.setItem(RELOAD_FLAG, '1')
    } else {
      sessionStorage.removeItem(RELOAD_FLAG)
    }
  } catch {
    /* modo privado: seguimos sem a proteção contra loop */
  }
}

/** `React.lazy` para páginas, com recuperação de chunk desatualizado. */
export function lazyPage<K extends string>(
  load: () => Promise<{ [P in K]: ComponentType }>,
  name: K,
) {
  return lazy(() =>
    load().then(
      (module) => {
        writeFlag(false)
        return { default: module[name] }
      },
      (error: unknown) => {
        if (readFlag()) {
          throw error
        }
        writeFlag(true)
        window.location.reload()
        // Nunca resolve: segura o Suspense até a página recarregar.
        return new Promise<never>(() => {})
      },
    ),
  )
}
