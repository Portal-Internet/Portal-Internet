# Portal Internet

Site institucional da **Portal Internet**, provedora de internet fibra óptica em
São Luís/MA: planos, cobertura, contato e acesso à Central do Assinante.

SPA em React 19 + TypeScript, empacotada com Vite. Sem backend: a contratação e a
consulta de viabilidade acontecem pelo WhatsApp.

## Rodando

```bash
npm install
npm run dev
```

## Scripts

| Script                    | O que faz                                                                   |
| ------------------------- | --------------------------------------------------------------------------- |
| `npm run dev`             | Servidor de desenvolvimento                                                 |
| `npm run build`           | Typecheck + build de produção (base `/`)                                    |
| `npm run build:hostgator` | Build para a subpasta `/projetos/PortalInternet/`                           |
| `npm run preview`         | Serve o `dist/` gerado                                                      |
| `npm run images`          | Regera os derivados das imagens (variantes, logo branca, og-image, favicon) |
| `npm run lint`            | oxlint                                                                      |
| `npm run format`          | Prettier                                                                    |

## Publicação

O `dist/` é estático e vai para um Apache comum (HostGator), sem Node no servidor.
O `public/.htaccess` entra no build e faz qualquer rota cair no `index.html` — sem
ele, abrir `/planos` direto dá 404.

Para publicar na raiz de um domínio use `npm run build`; para a subpasta atual,
`npm run build:hostgator`. Os nomes dos assets têm hash e mudam a cada build, então
**envie todo o conteúdo de `dist/`**.

## Estrutura

```
design/     arte original da marca (não entra no build)
public/     arquivos servidos como estão + imagens derivadas
scripts/    utilitários de build (geração de imagens)
src/
  app/      bootstrap: rotas, providers
  pages/    uma pasta por rota
  features/ módulos de negócio (planos, cobertura, avaliações…)
  shared/   UI, hooks, dados e utilitários reaproveitados
```

Detalhes de arquitetura, convenções e decisões estão em `CLAUDE.md`.
