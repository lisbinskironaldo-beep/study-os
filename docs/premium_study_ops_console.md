# RotaNota Ops Console

## Objetivo
O painel `/ops` concentra operacao, financeiro, growth, copiloto Gemini, promocoes internas e o registry de apps do `NorthStar` no mesmo deploy do site.

## Acesso
- Rota: `/ops/`
- Login: `POST /api/ops/login`
- Logout: `POST /api/ops/logout`
- Seguranca v1: senha simples via `OPS_PANEL_PASSWORD` e cookie de sessao `HttpOnly`

## Areas do painel
- `Overview`
  Mostra counters da free lane, lanes pausadas, thresholds `500/600/650` e busca operacional.
- `Financeiro`
  Lista checkouts recentes, webhooks refletidos em `premium_checkout_sessions` e entitlements ativos.
- `Growth`
  Consolida UTMs, eventos do funil, spend manual e canais com melhor ou pior sinal.
- `Copiloto`
  Usa Gemini embutido para digest diario, estrategia semanal e analise manual com base em dados consolidados.
- `Promocoes`
  Gera drafts, troca o modo global `suggest|approval_required|auto_rules` e ativa/pausa campanhas internas.
- `Apps`
  Centraliza o portfolio do NorthStar com produtos, infraestrutura, IA, codigo e canais externos como Google Ads e Meta Ads.
  Agora tambem prepara o workspace multi-app com modulos por app:
  `dev`, `analytics`, `improvements`, `promotions_internal`, `promotions_external`, `finance`, `bugs`.
- `Alertas`
  Centraliza eventos operacionais como quota, webhook falho, pausa automatica e fallback do copiloto.

## Endpoints principais
- `GET /api/ops/overview`
- `GET /api/ops/payments`
- `GET /api/ops/alerts`
- `GET /api/ops/search?query=...`
- `GET /api/ops/growth/overview`
- `POST /api/ops/growth/spend`
- `POST /api/ops/copilot/analyze`
- `GET /api/ops/reports/weekly`
- `GET /api/ops/promotions`
- `POST /api/ops/promotions/generate`
- `POST /api/ops/promotions/apply`
- `POST /api/ops/promotions/mode`
- `GET /api/ops/payments/status`
- `GET /api/ops/change-requests`
- `POST /api/ops/change-requests`
- `POST /api/ops/change-requests/approve`
- `POST /api/ops/change-requests/reject`
- `POST /api/ops/change-requests/execute`
- `GET /api/ops/reviews`
- `POST /api/ops/reviews/run`
- `GET /api/ops/site-improvements`
- `GET /api/ops/apps/workspace`
- `POST /api/ops/apps/work-items`
- `POST /api/ops/apps/bugs`
- `POST /api/ops/apps/finance`
- `POST /api/ops/actions`

## Estado operacional central
O backend persiste a configuracao principal em `premium_study_ops_state`, incluindo:
- `lanes.freeLanePaused`
- `lanes.premiumLanePaused`
- `thresholds.dailyWarnThreshold = 500`
- `thresholds.dailyCriticalThreshold = 600`
- `thresholds.dailyHardStopThreshold = 650`
- `promotionMode`
- `promotionChannels`
- configuracao do copiloto Gemini e caches diarios/semanais

## Expansao prevista
- manter o painel no mesmo projeto e mesmo dominio
- deixar `meta_ads`, `google_ads` e `openai_chatgpt` prontos no registry operacional e nos checks de ambiente
- manter o host tecnico no `RotaNota` nesta fase, mas com marca e UX do `NorthStar`
- evoluir de spend manual para importacao CSV ou API sem remodelar as tabelas
- migrar dominio e subdominios apenas numa fase posterior, sem mexer novamente no modelo de workspace por app
- operar aprovacoes humanas por `change requests`
- expor o NorthStar ao ChatGPT por `Apps SDK + MCP`
- rodar review automatica a cada 3 dias via `Vercel Cron`

## Estado real da publicacao em 2026-04-20

Versao local correta:

- `api/ops-router.js`
- `vercel.json`
- `api/_lib/ops-auth.js`
- `ops/app.js` com mensagem neutra antes do login

Versao atualmente servida em producao:

- ja esta alinhada com o build corrigido da ops publicado em 2026-04-20

Validacao concreta em producao apos a correcao:

- `POST /api/ops/login` responde `200`
- `GET /api/ops/overview` responde `200`
- `GET /api/ops/growth/overview` responde `200` com sessao valida
- `GET /api/ops/reports/weekly` responde `200` com sessao valida
- `GET /ops/app.js` serve o frontend novo da retaguarda

Historico do frontend publicado:

- a tela `/ops` mostrava `Falha na requisicao` antes do login
- esse erro inicial nao indicava senha errada
- esse erro inicial nao indicava Gemini indisponivel
- esse comportamento foi resolvido com o deploy corretivo de 2026-04-20

Diagnostico fechado:

- a causa raiz era um build intermediario em producao
- o `vercel.json` foi ajustado para sintaxe de wildcard compativel com a Vercel
- o deploy corretivo colocou a retaguarda nova no alias oficial

Rewrite valido atual:

```json
{
  "rewrites": [
    {
      "source": "/api/ops",
      "destination": "/api/ops-router"
    },
    {
      "source": "/api/ops/:route*",
      "destination": "/api/ops-router?route=:route"
    }
  ]
}
```

Proximos passos:

- manter `api/ops-router.js` e `vercel.json` como base atual da retaguarda
- seguir com testes funcionais do `/ops`
- monitorar webhook do Mercado Pago ja com assinatura ativa
