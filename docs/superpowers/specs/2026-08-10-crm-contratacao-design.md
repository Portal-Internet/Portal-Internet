# CRM Portal Internet — v1: link de contratação e lista de clientes

**Data:** 2026-08-10
**Status:** aprovado, aguardando plano de implementação

## Problema

O script de vendas da Portal Internet resolve bem os passos de abordagem, sondagem,
oferta e fechamento — tudo isso é conversa humana no WhatsApp e continua sendo.

O gargalo está no passo 6/7, a coleta de cadastro. Hoje o vendedor cola no chat a
lista crua de campos (nome, CPF/CNPJ, RG, e-mail, data de nascimento, endereço, CEP,
telefone), o cliente responde em texto solto e o vendedor relê a conversa e transcreve
tudo à mão. Consequências:

- CPF e CEP digitados errado, campos faltando;
- foto de documento perdida no meio do rolo de conversa;
- nenhum registro de quem recebeu link e não preencheu;
- nada mostra quantos contratos estão com instalação pendente.

A v1 substitui essa coleta manual por um formulário online gerado sob demanda pelo
vendedor, e dá à equipe uma lista de clientes com status.

## Objetivos

1. O vendedor gera, em um clique, um link de contratação e uma mensagem pronta para
   colar no WhatsApp.
2. O cliente preenche seus dados uma única vez, com validação, em uma página que
   parece a Portal Internet.
3. O cadastro cai automaticamente numa lista, com status inicial
   "plano contratado, instalação pendente".
4. A equipe vê, filtra e movimenta esses clientes por um painel com login.

## Não-objetivos da v1

Upload de foto de documento, captura dos leads dos formulários do site, dashboard de
métricas, e-mail automático, integração com o sistema do provedor e agendamento de
instalação com data marcada. O schema já nasce preparado para o segundo item
(coluna `origem`), mas nenhum código o exercita agora.

## Restrição que define a arquitetura

O site institucional é uma SPA estática servida por Apache na HostGator, sem Node no
servidor (ver seção "Publicação" do `CLAUDE.md`). Como o formulário mora nesse site,
não existe lugar para guardar segredo: o navegador conversa com o Supabase
diretamente.

Isso descarta um backend próprio por construção. A pergunta real passa a ser como o
navegador escreve com segurança, e a resposta adotada é uma função RPC no Postgres
com `security definer`. O navegador nunca toca em tabela: chama uma função que valida
o token, insere o cliente e consome o token dentro de uma única transação.

Ganhos concretos:

- a chave `anon`, que é pública por natureza, não lê nada — RLS nega tudo;
- a forma das tabelas não aparece no bundle do site;
- o consumo do token é atômico, então duplo envio e corrida não têm brecha.

Se abuso aparecer, a saída é uma Edge Function no próprio Supabase (com rate limit e
captcha), sem host novo e sem mexer no resto do sistema.

## Arquitetura

Três peças, nenhuma delas um servidor novo:

| Peça | O que é | Onde roda |
| --- | --- | --- |
| Site PortalInternet | repositório existente, ganha a rota `/contratar/:token` | HostGator (como hoje) |
| CRM | repositório novo, Vite SPA | Vercel |
| Supabase | Postgres, Auth, RLS e três RPCs | Supabase |

### Fluxo de dados

```
CRM (vendedor logado)
  |  rpc create_contract_link(nome, telefone, plano_id)
  v
contract_links: token, prefill, plano, expira_em, gerado_por
  |  devolve token
  v
CRM monta URL + mensagem -> vendedor copia -> WhatsApp
  v
Cliente abre portalma.com.br/contratar/<token>
  |  rpc get_contract_link(token)            [anon]
  |    devolve so prefill + plano + valido
  v
Cliente confere o plano, preenche, envia
  |  rpc submit_contratacao(token, dados)    [anon]
  |    valida token -> insere cliente -> consome token -> grava historico
  |    tudo numa transacao
  v
clientes.status = 'aguardando_instalacao'
  v
CRM: lista, filtra, abre a ficha, muda o status
```

## Modelo de dados

### Enums

```sql
create type link_status    as enum ('pendente','preenchido','expirado','cancelado');
create type cliente_status as enum ('aguardando_instalacao','instalacao_agendada','instalado','cancelado');
create type origem_lead    as enum ('link_vendedor','site','manual');
create type pessoa_tipo    as enum ('fisica','juridica');
```

`aguardando_instalacao` é o status inicial e significa "plano contratado, instalação
pendente".

### `contract_links`

| Coluna | Tipo | Notas |
| --- | --- | --- |
| `id` | `uuid` pk | `gen_random_uuid()` |
| `token` | `text` unique not null | 22 caracteres, base64url de `gen_random_bytes(16)` |
| `status` | `link_status` | default `pendente` |
| `prefill_nome` | `text` | o que o vendedor digitou ao gerar |
| `prefill_telefone` | `text` | só dígitos |
| `plano_id` | `text` not null | espelha os ids de `shared/data/plans.ts` |
| `gerado_por` | `uuid` → `auth.users` | quem gerou |
| `expira_em` | `timestamptz` not null | default `now() + interval '7 days'` |
| `criado_em` | `timestamptz` | default `now()` |
| `consumido_em` | `timestamptz` | preenchido no envio |

Índice em `token`.

### `clientes`

`nome_completo`, `tipo` (`pessoa_tipo`), `documento` (CPF ou CNPJ, só dígitos), `rg`,
`email`, `data_nascimento`, `telefone`, `cep`, `logradouro`, `numero`, `complemento`,
`bairro`, `cidade`, `uf`, `plano_id`, `status` (default `aguardando_instalacao`),
`origem` (default `link_vendedor`), `link_id` → `contract_links`, `criado_por` →
`auth.users`, `consentimento_em`, `observacoes`, `criado_em`, `atualizado_em`.

`criado_por` é herdado de `contract_links.gerado_por` no momento do envio — o
formulário é anônimo, mas o cadastro tem dono.

Índices em `status` e em `criado_em desc`. Índice não-único em `documento`, para a
checagem de duplicado.

### `cliente_historico`

`id`, `cliente_id` → `clientes` `on delete cascade`, `de` (`cliente_status`, nulo na
criação), `para` (`cliente_status`), `nota`, `autor` → `auth.users`, `criado_em`.

Um trigger em `clientes` grava a linha a cada mudança de `status`, com
`autor = auth.uid()`. O histórico não depende do front lembrar de escrever.

Um segundo trigger mantém `atualizado_em`.

### RLS

- `contract_links`, `clientes`, `cliente_historico`: `anon` sem nenhuma permissão.
- `authenticated`: `select` em tudo, `update` em `clientes`, `insert` em
  `cliente_historico`.
- Nenhuma escrita direta de `anon` em tabela. O papel `anon` recebe apenas
  `execute` em `get_contract_link` e `submit_contratacao`.
- `create_contract_link` recebe `execute` só para `authenticated`.

## Funções RPC

Todas `security definer` com `search_path` fixo.

| Função | Chamador | Entrada | Saída |
| --- | --- | --- | --- |
| `create_contract_link` | `authenticated` | nome, telefone, `plano_id` | token |
| `get_contract_link` | `anon` | token | `{ valido, prefill_nome, prefill_telefone, plano_id }` |
| `submit_contratacao` | `anon` | token, payload `jsonb` | `{ ok, duplicado }` |

`get_contract_link` devolve `valido: false` sem detalhar o motivo quando o token não
existe, expirou ou já foi consumido — a página trata os três casos igual e não dá
pista a quem estiver sondando.

`submit_contratacao` revalida o token (existe, `status = 'pendente'`,
`expira_em > now()`), valida o payload no servidor, insere o cliente, marca o link
como `preenchido` com `consumido_em = now()` e grava a linha inicial de histórico.
Devolve apenas `{ ok: true, duplicado: bool }` — nunca id, nunca dados do cliente. O
campo `duplicado` indica que já existe outro cliente com o mesmo `documento`.

Validação no servidor é a que vale. A validação no cliente é conveniência.

## Site — rota `/contratar/:token`

### Organização de arquivos

Segue as convenções do `CLAUDE.md`: arquitetura feature-based, um componente por
arquivo com named export, barrel `index.ts`, CSS Modules colocado ao lado do
componente e alias `@/`.

```
src/
  pages/contratacao/
    ContratacaoPage.tsx          # rota; decide qual estado renderizar
    ContratacaoPage.module.css
    index.ts
  features/contratacao/
    ContratacaoForm.tsx          # o formulario em si
    ContratacaoForm.module.css
    PlanoConfirmacao.tsx         # card do plano + acao "trocar plano"
    PlanoConfirmacao.module.css
    LinkInvalido.tsx             # expirado / usado / inexistente
    SucessoContratacao.tsx
    useContratacaoLink.ts        # busca o link pelo token
    useContratacaoSubmit.ts      # valida e envia
    validation.ts                # puro: CPF, CNPJ, email, CEP, idade
    types.ts
    index.ts
  shared/
    lib/supabaseRest.ts          # fetch cru para RPC
    hooks/useInputMask.ts        # ganha os kinds 'cpf' | 'cnpj' | 'date'
```

O código vai para `features/` e não apenas para `pages/` porque tem lógica de negócio
própria — busca de dados, validação e estado de envio. É o critério que o próprio
`CLAUDE.md` estabelece.

### Decisões que protegem o que já está bom no site

- **Sem `@supabase/supabase-js`.** O site faz só duas chamadas RPC; `fetch` no
  endpoint REST com o header `apikey` resolve. O SDK custaria cerca de 35 kB gzip num
  bundle afinado para 98 de Lighthouse. O CRM usa o SDK, porque precisa gerenciar
  sessão; o site não precisa.
- **`lazyPage` obrigatório** na rota, como as demais páginas internas. A home não pode
  baixar um byte disso.
- **Reaproveitar** `Field`/`Input`/`Select`, `Button`, `Card` e os tokens `--pi-*`. O
  formulário nasce parecendo Portal Internet sem CSS novo de identidade.
- **Nada de caminho de asset absoluto no JSX** — usar `asset()`, como manda o
  `CLAUDE.md`, para a rota sobreviver ao build em subpasta.

### Roteamento e visibilidade

- `public/.htaccess` já reescreve qualquer rota para o `index.html`, então
  `/contratar/abc123` não dá 404 e nenhuma mudança de infraestrutura é necessária.
- A página usa `<Seo noIndex />` — a prop já existe em `shared/components/Seo.tsx`.
- `public/robots.txt` ganha `Disallow: /contratar/`.
- A rota fica fora do `public/sitemap.xml`.
- Renderiza dentro do `Layout` (cabeçalho e rodapé dão a garantia visual de que é
  mesmo a Portal), porém sem `actionBar`: uma barra de WhatsApp flutuando tira as
  pessoas do meio do formulário.

### Comportamento do formulário

- O plano vem travado pelo link e aparece em destaque como confirmação do que foi
  negociado, com uma ação discreta "trocar plano" para quem mudar de ideia na hora.
- Campos: nome completo, tipo de pessoa, CPF ou CNPJ, RG, e-mail, data de nascimento,
  telefone, CEP, endereço completo.
- O CEP autopreenche o endereço via ViaCEP (sem chave, uma requisição). Os campos
  seguem editáveis depois.
- Máscaras de CPF, CNPJ, telefone, CEP e data pelo `useInputMask`.
- Validação de dígito verificador de CPF e CNPJ, formato de e-mail, CEP de 8 dígitos e
  idade mínima de 18 anos.
- Checkbox de consentimento LGPD obrigatório, com texto curto declarando a finalidade.
  Grava `consentimento_em`.

## CRM — repositório novo

### Organização de arquivos

Mesma arquitetura do site, para quem conhece um conhecer o outro.

```
portalinternet-crm/
  src/
    app/          App.tsx, routes.tsx, ProtectedRoute.tsx, lazyPage.ts
    pages/        login/, clientes/, cliente-detalhe/
    features/
      auth/          useSession.ts, LoginForm.tsx
      clientes/      ClientesTable, ClientesFilters, StatusBadge,
                     StatusSelect, HistoricoTimeline,
                     useClientes.ts, useClienteStatus.ts
      gerar-link/    GerarLinkButton, GerarLinkModal, LinkGerado,
                     mensagem.ts, useGerarLink.ts
    shared/
      components/ui/   Button, Card, Field, Chip (copiados do site)
      lib/             supabase.ts, plans.ts, format.ts
      styles/          variables.css (tokens --pi-*), global.css
      types/           database.ts (gerado por `supabase gen types typescript`)
  supabase/
    migrations/   0001_schema.sql, 0002_rls.sql, 0003_rpc.sql
    config.toml
  .env.example
  vercel.json     # rewrite de SPA
  CLAUDE.md
```

As migrations moram aqui: o CRM é o dono do banco, e o site apenas consome.

### Telas da v1

1. **`/login`** — e-mail e senha. Sem cadastro público; usuário novo é criado no painel
   do Supabase pelo responsável.
2. **`/`** — lista de clientes. Contadores por status no topo, busca por nome, telefone
   ou documento, filtro por status, ordenação por data, e o botão
   **Gerar link de contratação** em destaque.
3. **`/clientes/:id`** — ficha completa, troca de status, observações, timeline do
   histórico e botão de WhatsApp para o cliente.
4. **Modal Gerar link** — três campos (nome, telefone, plano). Ao confirmar, mostra a
   URL e a mensagem pronta, com um botão de copiar para cada.

A proteção de rota no cliente é conveniência de navegação. A fronteira real de
segurança é o RLS no banco.

### Mensagem gerada

Montada por `mensagem.ts`, função pura e testável, e editável antes de copiar:

```
Oi, {nome}! Aqui é o {vendedor}, da Portal Internet.

Fechamos o plano {plano} — {velocidade} Mbps por R$ {preco}/mês.

Para agilizar a instalação, é só preencher seus dados neste
link (leva 2 minutos):
{url}

Taxa de instalação e ativação: R$ 150. A primeira mensalidade
vence 30 dias após a instalação. Os equipamentos ficam em
comodato enquanto o contrato estiver vigente.

Qualquer dúvida, é só chamar por aqui.
```

Taxa, vencimento e comodato saem direto do script de vendas — o vendedor para de
reescrever isso à mão a cada cliente.

## Tratamento de erros

| Situação | Comportamento |
| --- | --- |
| Token inválido, expirado ou já usado | Tela `LinkInvalido`, com botão de WhatsApp para falar com o vendedor |
| Falha de rede no envio | Os dados preenchidos permanecem no formulário e aparece "tentar de novo" |
| Duplo envio | O token de uso único resolve no banco; a segunda tentativa recebe "link já usado" |
| CPF ou CNPJ já cadastrado | O cadastro é inserido assim mesmo e a ficha recebe um selo "possível duplicado" no CRM |
| ViaCEP fora do ar | O endereço vira preenchimento manual, sem bloquear o envio |

## Testes

O repositório não tem framework de teste hoje. A v1 adiciona **Vitest** e cobre apenas
as funções puras que falham em silêncio:

- `validation.ts` — dígito verificador de CPF e CNPJ, e-mail, CEP, idade mínima;
- `mensagem.ts` — montagem do texto do WhatsApp;
- `useInputMask` — as máscaras novas (CPF, CNPJ, data).

Nada de end-to-end nesta etapa. As RPCs são testadas à mão contra o Supabase local
(`supabase start`), cobrindo explicitamente token válido, expirado, já consumido,
inexistente e dois envios concorrentes com o mesmo token.

## Configuração de ambiente

### Supabase

1. Criar projeto novo (região `sa-east-1`, São Paulo — menor latência para São Luís).
2. Guardar `Project URL`, chave `anon` e chave `service_role`.
3. `supabase link --project-ref <ref>` no repositório do CRM.
4. `supabase db push` aplica as migrations.
5. Em Authentication → Providers, deixar apenas Email ativo e **desligar**
   "Enable email signups". Usuários são criados à mão em Authentication → Users.
6. `supabase gen types typescript --linked > src/shared/types/database.ts`.

### Vercel

1. Importar o repositório `portalinternet-crm`. O preset Vite é detectado sozinho.
2. Variáveis de ambiente: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
   `VITE_SITE_URL` (base do link de contratação).
3. `vercel.json` com rewrite de todas as rotas para `/index.html` — sem isso, um
   refresh em `/clientes/123` dá 404.
4. A chave `service_role` **não** entra na Vercel. Nada no CRM precisa dela.

### Site

Adicionar ao `.env` (e ao `.env.example` versionado): `VITE_SUPABASE_URL` e
`VITE_SUPABASE_ANON_KEY`. São públicas por natureza — o RLS é a fronteira, não o
segredo da chave. `.env.local` fica no `.gitignore`.

## Riscos em aberto

- **LGPD.** O sistema passa a guardar CPF, RG e data de nascimento. Precisa de política
  de retenção acordada com o cliente e de controle de quem tem login. Não é trabalho de
  código, mas trava a publicação.
- **Queima de token.** Quem interceptar um link ativo pode enviar um cadastro falso
  naquele token. A expiração de 7 dias e o uso único limitam o estrago. Se virar
  problema real, a saída é a Edge Function com captcha, sem mexer no resto.
- **Preços em dois lugares.** `plans.ts` existe no site e será copiado no CRM;
  divergência silenciosa é questão de tempo. A v1 aceita a duplicação com um comentário
  apontando a origem. Se incomodar, os planos sobem para uma tabela no Supabase.

## Sequência sugerida de implementação

1. Projeto Supabase, migrations de schema, RLS e RPCs, testadas localmente.
2. CRM: scaffold, autenticação e rota protegida.
3. CRM: gerar link (modal, RPC, mensagem, copiar).
4. Site: rota `/contratar/:token`, validação e envio.
5. CRM: lista, filtros, ficha e mudança de status.
6. Deploy na Vercel, publicação do site e teste ponta a ponta com um link real.
