# HS Design

Ambiente de design com IA para a **HS Marketing**, baseado no
[Open Design](https://github.com/nexu-io/open-design) (nexu-io), licenciado sob
Apache-2.0.

Este repositório é um **fork mergeável** do Open Design: a customização da HS é
mantida em uma camada mínima (marca, cor de destaque, atribuição e docs) para
permitir rebase periódico do upstream sem dor.

## O que muda em relação ao upstream

- **Marca:** o app exibe "HS Design" (chave i18n `app.brand` em todos os locales).
- **Cor de destaque:** laranja HS (`#F26522`) como `--accent` padrão
  (`apps/web/src/state/appearance.ts` + script de tema em `apps/web/app/layout.tsx`).
  Placeholder — trocar pelos valores oficiais da HS quando disponíveis.
- **Design system da HS:** `design-systems/hs-marketing/DESIGN.md` (laranja/preto).
- **Atribuição:** `NOTICE` declara a base no Open Design e preserva a Apache-2.0.

## Desenvolvimento local

Requisitos: Node.js 24, pnpm 10.33.x. (Docker é opcional — não usado neste setup.)

```bash
pnpm install
# Sobe daemon + web no fluxo de dev nativo (sem Docker):
pnpm tools-dev run web --daemon-port 17456 --web-port 17573
```

Consulte o `AGENTS.md` (na raiz) para as convenções do projeto e o
`QUICKSTART.md` para o setup a partir do source.

## Arquitetura de deploy

O web é um **export estático servido pelo próprio daemon** (mesma origem) — não
é um SPA na Vercel que faz proxy para um daemon remoto. O deploy de produção da
HS usa o **modelo nativo**: o container do daemon (que já serve o web com a marca
HS) publicado em um host com URL pública. Detalhes e decisões em
`BUILD-LOOP.md` (no repositório de planejamento da HS).

## Licença

Apache-2.0 — ver `LICENSE` e `NOTICE`.
