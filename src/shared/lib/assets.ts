/**
 * Resolve o caminho de um arquivo da pasta `public/` respeitando a base do build.
 *
 * Em desenvolvimento a base é `/`; num build para subpasta
 * (`vite build --base=/projetos/PortalInternet/`) ela muda, e caminhos
 * absolutos escritos à mão no JSX quebrariam — o Vite não reescreve strings.
 *
 * @example asset('img/garoto-fone.webp') // → '/projetos/PortalInternet/img/garoto-fone.webp'
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\//, '')}`
}

/**
 * Monta o `srcset` das variantes geradas por `scripts/generate-image-sizes.mjs`
 * (`garoto-fone.webp` → `garoto-fone-480.webp`), somadas à imagem original.
 */
export function imageSrcSet(
  file: string,
  widths: number[],
  originalWidth: number,
): string {
  const variants = widths.map(
    (width) => `${asset(file.replace(/\.webp$/, `-${width}.webp`))} ${width}w`,
  )
  return [...variants, `${asset(file)} ${originalWidth}w`].join(', ')
}

/** Base do site sem a barra final — formato esperado pelo `basename` do router. */
export const ROUTER_BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'
