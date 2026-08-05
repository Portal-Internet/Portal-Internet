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
npm run dev           # servidor de desenvolvimento
npm run build          # typecheck (tsc -b) + build de produção
npm run preview        # preview do build
npm run lint            # oxlint
npm run format          # formata com prettier
npm run format:check    # verifica formatação sem alterar
```

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

## Próximos passos sugeridos

- Definir identidade visual (cores, tipografia) e atualizar
  `shared/styles/variables.css`.
- Criar páginas: Planos, Cobertura, Contato.
- Definir se haverá backend/CMS para planos e formulário de contato.
