# Vigia Maceió

MVP acadêmico para visualizar um índice fictício de criminalidade por região em
Maceió, Alagoas.

## Stack

- Next.js 16 + React 19
- Route Handlers com `NextResponse`
- Leaflet para o mapa
- pnpm como gerenciador de pacotes
- Dados em memória/fixtures para o MVP

## Arquitetura

O projeto agora é um app único Next full-stack:

```txt
src/
  app/
    mapa/
    admin/
    api/
  components/
  lib/
  server/
    domain/
    application/
    repositories/
    http/
```

- `src/app`: páginas, layout e rotas HTTP do Next.
- `src/app/api`: camada HTTP usando `NextResponse`.
- `src/server/domain`: tipos e regras de domínio.
- `src/server/application`: casos de uso.
- `src/server/repositories`: persistência em memória para o MVP.
- `src/lib`: fixtures, tipos compartilhados e cliente HTTP usado pelo frontend.

## Rodando localmente

Instale as dependências:

```bash
pnpm install
```

Suba tudo com um comando:

```bash
pnpm dev
```

Abra:

- App: `http://localhost:3000`
- Mapa: `http://localhost:3000/mapa`
- Gestão: `http://localhost:3000/admin`

Credencial administrativa de desenvolvimento:

- E-mail: `admin@asal.local`
- Senha: `admin123`

## Scripts

```bash
pnpm dev        # desenvolvimento
pnpm build      # build de produção
pnpm start      # servidor de produção
pnpm typecheck  # checagem TypeScript
```

## API Interna

Rotas públicas:

- `GET /api/overview`
- `GET /api/neighborhoods`
- `GET /api/incidents`
- `GET /api/incidents/[id]/reports`
- `GET /api/mapping-priorities`

Rotas administrativas:

- `GET /api/admin/auth/me`
- `GET /api/admin/dashboard`
- `GET /api/admin/reports`
- `POST /api/admin/reports/[id]/review`

## Observação

O backend Spring, Docker e a estrutura de monorepo foram removidos nesta fase
para simplificar a apresentação do MVP. A arquitetura interna do Next foi
organizada para permitir trocar os repositories em memória por banco de dados
depois, sem reescrever as telas.
