# PortalInternet

Site institucional/portal para uma provedora de internet (ISP): planos, cobertura,
contato e área do cliente.

## Stack

- **React 19** + **TypeScript** (strict)
- **Vite** — build e dev server
- **react-router-dom** (`createBrowserRouter`) — roteamento
- **CSS Modules** — estilos por componente (`*.module.css`) + variáveis globais em
  `src/shared/styles/variables.css`
- **oxlint** — lint (`npm run lint`)
- **Prettier** — formatação (`npm run format`)

## Scripts

```bash
npm run dev              # servidor de desenvolvimento
npm run build             # typecheck (tsc -b) + build de produção (base "/")
npm run build:hostgator   # build para a subpasta /projetos/PortalInternet/
npm run preview           # preview do build
npm run images            # regera as versões reduzidas das imagens (sharp)
npm run lint              # oxlint
npm run format            # formata com prettier
npm run format:check      # verifica formatação sem alterar
```

## Publicação (HostGator)

O site é uma SPA estática: o `dist/` gerado pelo build é servido por Apache comum, sem
Node no servidor.

- **Caminho base.** `npm run build:hostgator` passa `--base=/projetos/PortalInternet/`.
  O `basename` do router e o helper `asset()` (`shared/lib/assets.ts`) leem
  `import.meta.env.BASE_URL`, então acompanham a base sozinhos — em dev continua `/`.
  Para publicar na raiz de um domínio, use `npm run build` normal.
- **Nunca escreva caminho de asset absoluto no JSX** (`src="/img/foo.webp"`): o Vite não
  reescreve strings e o arquivo quebra em subpasta. Use `asset('img/foo.webp')`.
- **`public/.htaccess`** entra no `dist` e faz o Apache entregar o `index.html` em
  qualquer rota (senão `/planos` dá 404). As regras são relativas à pasta, então
  funcionam na raiz ou em subpasta sem alteração.
- **Upload**: os nomes dos assets têm hash e mudam a cada build, então a fila do
  publicador (`C:\Prospector\fila-publicacao.txt`) precisa ser regerada a partir do
  conteúdo de `dist/` a cada publicação.

## Arquitetura: feature-based

Organização por **o que o código faz**, não por tipo de arquivo. Evita pastas gigantes
de `components/`, `hooks/`, etc. desacopladas do domínio.

```
src/
  app/                 # bootstrap da aplicação: App.tsx, rotas, providers globais
    App.tsx
    routes.tsx
  pages/               # componentes de página (nível de rota)
    home/
      HomePage.tsx
      HomePage.module.css
      index.ts         # barrel export
  features/            # módulos de negócio (lógica + UI própria de um domínio)
                        # ex: features/plans, features/coverage-checker
  shared/              # código reaproveitável entre features/páginas
    components/        # UI genérica (Layout, botões, cards, inputs)
    hooks/              # hooks reutilizáveis
    lib/                 # utilitários puros, clients de API, formatadores
    types/               # tipos TS compartilhados
    styles/              # global.css, variables.css (design tokens)
```

**Regra de dependência:** `pages` e `features` podem importar de `shared`; `shared`
nunca importa de `pages` ou `features`. Uma `feature` não deve importar de outra
`feature` diretamente — se precisar compartilhar algo, o código sobe para `shared`.

### Quando usar `features/` vs `pages/`

- `pages/`: componente simples que só compõe UI para uma rota (ex: página de
  Contato com um formulário).
- `features/`: quando existe lógica de negócio própria (fetch de dados, estado,
  regras) que poderia, em teoria, ser reutilizada em mais de um lugar (ex: um
  "verificador de cobertura por CEP" usado tanto na home quanto na página de
  planos).

## Convenções

- **Um componente por arquivo**, nome do arquivo = nome do componente
  (`Header.tsx` exporta `Header`). Sem `default export` em componentes — usar
  named exports para facilitar refactors e imports consistentes.
- **Barrel exports** (`index.ts`) em pastas de feature/página para expor apenas a
  API pública do módulo.
- **Estilos**: CSS Modules colocados junto ao componente (`Componente.module.css`).
  Tokens de cor/espaçamento/tipografia vivem em `shared/styles/variables.css` como
  custom properties — nunca hardcode cores/spacing direto nos módulos.
- **Import alias**: usar `@/` para caminhos absolutos a partir de `src/`
  (ex: `@/shared/components/Layout`) em vez de `../../../`.
- **SOLID aplicado a componentes:**
  - *SRP*: um componente faz uma coisa (renderizar UI). Lógica de dados/estado
    complexa vai para hooks (`use[Algo]`) na própria feature ou em `shared/hooks`.
  - *OCP*: prefira composição (`children`, slots, props de render) a componentes
    com múltiplas flags booleanas que mudam o comportamento internamente.
  - *ISP*: props específicas e enxutas por componente; não force um componente a
    receber um objeto gigante quando usa só 2 campos.
  - Não aplicar os princípios de forma mecânica — o objetivo é manter componentes
    fáceis de entender e trocar, não seguir regras à risca.

## Notas de segurança

- `react-router-dom` está com um advisory (GHSA-qwww-vcr4-c8h2) referente ao modo
  RSC, que este projeto **não usa** (SPA client-side com `createBrowserRouter`).
  Ainda não há versão corrigida publicada; revisar com `npm audit` periodicamente
  e atualizar assim que uma correção sair.

## Domínio: Portal Internet

Reformulação do site oficial [portalma.com.br](https://portalma.com.br/) — provedor de
internet fibra em São Luís/MA.

- **Identidade**: verde institucional `#0f7a22` (do logo) + verde vívido `#35c02a` (do
  mascote). Tokens em `shared/styles/variables.css` com o prefixo `--pi-*`.
- **Dados de negócio**: `shared/data/plans.ts` (10 planos: residencial, empresarial e
  dedicado) e `shared/lib/contacts.ts` (telefones, endereço, links externos). Ficam em
  `shared` porque mais de uma feature consome — respeitando a regra de features não
  importarem umas das outras.
- **Mascotes**: `public/img/garoto-fone.webp` e `garoto-note.webp`, já com fundo
  transparente.
- **Protótipo HTML de referência**: `design/prototipo/` (não entra no build).

## SEO e IA

- SPA sem SSR — cada página chama `<Seo title description path />`
  (`shared/components/Seo.tsx`) para atualizar `title`, `description`, canonical e
  Open Graph/Twitter via JS. O `index.html` mantém uma versão estática desses
  mesmos metadados (dados da home) como fallback para crawlers que não executam
  JavaScript.
- Dados estruturados (`schema.org` `InternetServiceProvider`) ficam hardcoded no
  `<head>` do `index.html` — atualizar manualmente se os dados em `contacts.ts`
  mudarem (endereço, telefone, redes sociais).
- `public/robots.txt`, `public/sitemap.xml` e `public/llms.txt` (resumo do site
  para agentes de IA, convenção [llmstxt.org](https://llmstxt.org)) — atualizar
  junto se novas rotas/planos forem adicionados.
- `SITE_URL` em `shared/lib/seo.ts` é a fonte da URL canônica do site.

## Desempenho

Lighthouse mobile do build de produção (`npm run build` + `vite preview`):
**98 performance / 100 acessibilidade / 100 boas práticas / 100 SEO**. Meça sempre
no build — no dev server o Vite serve os módulos crus e o número não significa nada.

- **Imagens derivadas**: `scripts/generate-image-sizes.mjs` (`npm run images`) gera,
  com `sharp` (devDependency), as variantes de largura das fotos e do logo, além da
  `Logo-branca.webp`, da `og-image.webp` e do `favicon.png`. No JSX, `imageSrcSet()`
  (`shared/lib/assets.ts`) monta o `srcset`. Rode o script sempre que trocar
  `public/Logo.webp` ou uma foto original — os derivados são versionados junto.
- **Logo**: a arte oficial é verde escura e sumiria no cabeçalho e no rodapé, que têm
  fundo verde; por isso o script deriva a versão branca, exposta em
  `EXTERNAL_LINKS.logoLight`. Use `logo` (colorida) só em fundo claro.
- O `index.html` faz `preload` da imagem do hero da home (o elemento de LCP) e
  carrega as fontes do Google sem bloquear a renderização (`media="print"` +
  `onload`).

## Loading

- As páginas internas são `React.lazy` em `app/routes.tsx`; o `Layout` envolve o
  `<Outlet>` num `<Suspense fallback={<PageLoader />}>`. **A home é import
  estático**: ela é a entrada da maioria dos acessos, e carregá-la em separado
  atrasava o LCP e empurrava o rodapé (CLS de 0,92).
- O `PageLoader` ocupa o espaço da página no fluxo (`min-height`) em vez de ser um
  overlay fixo — é isso que evita o rodapé subir e descer.
- `PageLoader` (`shared/components/ui/PageLoader.tsx`) mostra um spinner CSS
  instantâneo e só troca para a animação Lottie (`public/loader.json`, via
  `lottie-react`) se a espera passar de 600 ms — em conexão rápida os 316 kB da
  lib nunca são baixados. A lib `lottie-react`/`lottie-web` é
  isolada em `LottieAnimation.tsx`, carregado sob demanda (`React.lazy`) para não
  inflar o bundle principal — nunca importe `lottie-react` fora desse arquivo.

## Páginas de erro

- `pages/error/` tem duas variantes (`not-found` e `crash`) sobre o mesmo
  `ErrorContent`: uma `Section` verde com o código, o título, os botões e nada
  mais — deliberadamente simples, só reaproveitando os componentes existentes.
- `NotFoundPage` é a rota `*`, dentro do `Layout` (mantém header/rodapé).
  `ErrorPage` é o `errorElement` da rota raiz e, como substitui o `Layout`, monta
  `Header`/`Footer` por conta própria.
- **Import estático de propósito**: as páginas de erro entram no chunk principal,
  porque precisam funcionar exatamente quando um chunk falha ao carregar.
- `app/lazyPage.ts` envolve o `React.lazy` das páginas: falha de import (hash de
  chunk antigo depois de uma publicação) vira um reload único, protegido por flag
  no `sessionStorage` para não virar loop.

### Pendências conhecidas

- `useCoverageRequest` não tem backend próprio: em vez de um POST, monta a mensagem e
  abre o WhatsApp de vendas com os dados preenchidos (`window.open`). Funciona de
  verdade, mas se um sistema de viabilidade/CRM entrar depois, trocar o corpo do
  `submit` para um POST real.
- Preços extraídos do site oficial em agosto de 2026: confirmar com o comercial.
- As avaliações em `shared/data/reviews.ts` foram copiadas à mão do perfil no Google
  Maps (agosto de 2026). Não há integração com a API do Places: nota, contagem e
  textos são atualizados manualmente.
