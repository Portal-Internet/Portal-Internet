import { useEffect } from 'react'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/shared/lib/seo'

interface SeoProps {
  title: string
  description: string
  /** Caminho a partir da raiz, ex: "/planos". Use "/" para a home. */
  path: string
  /** Pede aos buscadores que não indexem — usado nas páginas de erro. */
  noIndex?: boolean
}

/**
 * Atualiza title, description, canonical e Open Graph/Twitter do documento.
 * O site é uma SPA sem SSR — isso cobre navegadores e crawlers que executam
 * JS (Google, Bing). O `index.html` mantém metadados estáticos como
 * fallback para bots que não executam JavaScript.
 */
export function Seo({ title, description, path, noIndex = false }: SeoProps) {
  useEffect(() => {
    const fullTitle = path === '/' ? title : `${title} | ${SITE_NAME}`
    const url = `${SITE_URL}${path}`

    document.title = fullTitle

    setMeta('description', description)
    setMeta('og:title', fullTitle, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', url, 'property')
    setMeta('og:image', DEFAULT_OG_IMAGE, 'property')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description)

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, path])

  useEffect(() => {
    if (!noIndex) {
      return
    }

    // Vale só enquanto a página de erro estiver montada: ao sair, o valor
    // original do index.html volta (ou a meta some, se ela não existia).
    const previous = document
      .querySelector<HTMLMetaElement>('meta[name="robots"]')
      ?.getAttribute('content')

    setMeta('robots', 'noindex')

    return () => {
      if (previous === null || previous === undefined) {
        document.querySelector('meta[name="robots"]')?.remove()
      } else {
        setMeta('robots', previous)
      }
    }
  }, [noIndex])

  return null
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
