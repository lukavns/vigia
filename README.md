# Vigia Maceió

Protótipo acadêmico que mostra um índice de criminalidade por bairro de Maceió em um mapa interativo.

**Todos os dados são fictícios.** Os percentuais, ocorrências e chamados foram inventados para a demonstração e não representam estatística oficial.

Site: https://lukavns.github.io/vigia/

## O que tem

- **Início**: resumo do cenário, ranking dos bairros e regiões prioritárias.
- **Mapa**: bairros e zonas monitoradas no Leaflet, com filtros por nível de risco, incidência e busca.
- **Gestão**: fila de validação de ocorrências (aprovar, rejeitar, reabrir).

O site é estático e não tem backend. O login da Gestão é só ilustrativo (`admin@vigia.local` / `admin123`) e as revisões ficam salvas no `localStorage` do navegador.

## Stack

Next.js 16 (export estático), React 19, TypeScript e Leaflet com tiles do OpenStreetMap.

## Rodando localmente

```bash
pnpm install
pnpm dev
```

O app sobe em `http://localhost:3000`.

Outros scripts:

```bash
pnpm build      # gera o site estático em out/
pnpm typecheck  # checagem de tipos
```

## Estrutura

```txt
app/          páginas (início, mapa, admin) e estilos
components/   blocos compartilhados entre as páginas
lib/          dados de exemplo, tipos, rótulos e a fila de ocorrências
```

Os dados ficam em `lib/data.ts`. Os limites dos bairros são retângulos aproximados, não as divisas reais.

## Deploy

Todo push na `main` dispara o workflow em `.github/workflows/deploy.yml`, que gera o build e publica no GitHub Pages. No repositório, a fonte do Pages precisa estar como **GitHub Actions** (Settings → Pages).
