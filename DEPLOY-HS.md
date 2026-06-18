# Deploy HS Design — Railway (modelo nativo)

O daemon serve o web (com branding HS) num único processo. O `deploy/Dockerfile`
builda do source (`pnpm --filter @open-design/web build` → `apps/web/out`) e a
imagem final serve esse web + `/api` + artifacts na mesma origem. Porta interna
`7456`, dados em `/app/.od` (precisa de volume persistente), exige `OD_API_TOKEN`.

`railway.json` (na raiz) já fixa o builder Dockerfile e o caminho
`deploy/Dockerfile` — não é preciso configurar isso no dashboard.

## Pré-requisito: push do fork

O Railway faz deploy a partir do GitHub. Suba os commits `hs/`:

```bash
git push origin main
```

## Opção A — Dashboard (recomendado)

1. **New Project → Deploy from GitHub repo** → selecione `CaianToaldo/hs-design`.
2. O Railway lê `railway.json` e usa `deploy/Dockerfile` (contexto = raiz do repo).
3. **Variables** — adicione:
   - `OD_API_TOKEN` = gere com `openssl rand -hex 32` (obrigatório).
   - `OD_BIND_HOST` = `0.0.0.0`
   - `OD_PORT` = `7456`
   - `OPEN_DESIGN_ALLOWED_ORIGINS` = a URL pública do serviço
     (preencha depois de gerar o domínio, ex.: `https://hs-design.up.railway.app`).
   - `NODE_OPTIONS` = `--max-old-space-size=192` (opcional; cap de heap).
4. **Volumes** — crie um volume e monte em `/app/.od`
   (persiste projetos, SQLite, config, artifacts entre restarts).
5. **Settings → Networking** — **Generate Domain**; defina **Target Port = 7456**.
6. **Deploy**. O primeiro build leva alguns minutos (compila better-sqlite3 +
   build do web). Acompanhe em **Deployments → Build Logs**.

## Opção B — CLI

```bash
npm i -g @railway/cli
railway login                 # interativo (rode no terminal: ! railway login)
railway init                  # cria/conecta o projeto
railway up                    # builda o Dockerfile e faz deploy
railway volume add --mount-path /app/.od
railway variables --set OD_API_TOKEN=$(openssl rand -hex 32) \
                   --set OD_BIND_HOST=0.0.0.0 --set OD_PORT=7456
railway domain                # gera URL pública (depois setar ALLOWED_ORIGINS)
```

## Verificação (fecha o render da Fase 0/1)

Abra a URL pública e confirme:
- [ ] Título da aba: **HS Design**
- [ ] Accent **laranja** (`#F26522`) nos botões/elementos ativos
- [ ] `hs-marketing` aparece no seletor de design systems
- [ ] Gerar 1 artefato funciona (requer uma chave de provedor de IA configurada
      em Settings → BYOK — a chave vai por requisição, ver BUILD-LOOP.md)

## Notas

- **Branding:** vem do nosso build (não da imagem `ghcr.io/nexu-io/od` do upstream).
- **Fase 3 (auth + chave por colaborador):** como o web é estático servido pelo
  daemon (sem server Next em produção), injetar a chave por colaborador "fora do
  browser" exigirá um proxy injetor na frente do daemon. Ver decision log no
  `BUILD-LOOP.md`.
