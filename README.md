# RotaNota Workspace

## Estado atual

- localhost validado com `vercel dev`
- `/ops` local funcional com login, overview, copiloto Gemini, growth, promocoes e relatorio semanal
- producao publicada em `https://rota-nota.vercel.app`
- incidente da retaguarda publicado em 2026-04-20 foi corrigido com novo deploy de producao

## NorthStar

`/ops` e o hub de retaguarda do `NorthStar`, o ponto central para operar o RotaNota e preparar o ecossistema para novos apps no mesmo shell administrativo.

O plano atual do hub cobre:

- portfolio de apps e registry operacional
- workspace multi-app com modulos de desenvolvimento, analise, melhorias, promocoes, financas e bugs
- Vercel, Supabase e GitHub como base de deploy, dados e codigo
- Gemini e OpenAI / ChatGPT como trilhas separadas de IA e assistencia autorizada
- Google Ads e Meta Ads como canais externos para growth, promocao e automacao futura
- change requests, auditoria e review recorrente a cada 3 dias
- trilha de app para ChatGPT via `Apps SDK + MCP`

Fase atual:

- o host tecnico continua no RotaNota
- nao houve migracao de dominio ou subdominios ainda
- a UX e a estrutura de dados ja foram preparadas para a futura topologia `NorthStar + subdominios`

Documento principal de retomada:

- `docs/rotanota_execution_phases.md`
- `docs/rotanota_go_live_status.md`
- `docs/rotanota_2026-04-20_handoff.md`
- `docs/northstar_current_state.md`
- `docs/northstar_go_live_monetization.md`
- `docs/northstar_ai_ops_policy.md`
- `docs/northstar_three_day_growth_loop.md`
- `docs/northstar_chatgpt_app.md`
- `docs/northstar_launch_execution.md`

## Rodar localmente

Para o site publico com APIs `/api/*` no mesmo ambiente, use `vercel dev`.

```powershell
vercel dev
```

Abrir:
- `http://localhost:3000/`
- `http://localhost:3000/ops/`

## Checagem de prontidao

Antes de testar checkout, premium, Gemini e retaguarda:

```powershell
node scripts/rotanota-readiness-check.js
```

O script verifica:
- envs obrigatorias
- URL canonica `ROTANOTA_BASE_URL`
- Gemini
- Supabase
- senha da retaguarda

## Banco

Aplicar o schema:

```text
docs/supabase_premium_schema.sql
```

## Publicacao atual

Alias oficial:

- `https://rota-nota.vercel.app`

Retaguarda publicada:

- `https://rota-nota.vercel.app/ops/`

Status validado em 2026-04-20 apos o deploy corrigido:

- `POST /api/ops/login` funciona
- `GET /api/ops/overview` funciona
- `GET /api/ops/growth/overview` funciona
- `GET /api/ops/reports/weekly` funciona
- `GET /ops/app.js` publica o frontend novo da retaguarda
- `POST /api/premium/ai-generate` responde `200` com bundle real por IA
- `GET /api/northstar-app-manifest` responde `200`
- `POST /api/northstar-mcp` responde `200` com bearer valido
- `POST /api/ops/reviews/run` respondeu `200` e persistiu review run

Historico importante:

- antes do deploy corrigido, a producao estava servindo um build intermediario da retaguarda
- o problema nao era senha nem Gemini
- a causa era publicacao/versionamento do `/ops`

## Proximo passo operacional

Com a falha de requisicao resolvida, os proximos passos voltam a ser de evolucao operacional:

- validar um pagamento real completo e monitorar activations
- fechar a trilha externa de registro do NorthStar como app do ChatGPT
- configurar Google Ads e Meta Ads para sair de `not_configured`
- usar `docs/rotanota_execution_phases.md` como trilha oficial de execucao

## Observacao

O nome do produto e da marca e `RotaNota`. Qualquer ambiente antigo deve migrar para `ROTANOTA_BASE_URL`.
