# Papiro Tools Handoff - 2026-04-20

## Objetivo

Este documento e o ponto principal de retomada operacional do projeto. Ele registra:

- o que ja foi feito
- o que esta funcionando localmente
- o que esta quebrado/publicado
- qual e o proximo passo exato
- quais decisoes ja estao congeladas

Leitura operacional mais direta por fases:

- `docs/papiro_tools_execution_phases.md`

## Estado atual do produto

O Papiro Tools ja tem:

- fluxo premium com status consultado no backend
- checkout Mercado Pago criando preferencia
- retaguarda `/ops` com overview, financeiro, growth, copiloto Gemini, promocoes e alertas
- Supabase como persistencia para premium, growth, spend, alertas e promocoes

Estado em 2026-04-20:

- localhost esta saudavel
- producao esta publicada e a falha de requisicao da retaguarda foi corrigida no deploy de 2026-04-20
- bundle de IA do PDF esta respondendo em producao com modelo real
- review run do NorthStar foi executada com persistencia real em producao

URLs oficiais:

- local: `http://localhost:3000/ops/`
- producao: `https://papiro-tools.vercel.app/ops/`

## Integracoes ja configuradas

Infra e acesso:

- projeto Vercel `papiro-tools` criado e linkado
- alias oficial de producao: `https://papiro-tools.vercel.app`
- projeto Supabase ja conectado
- schema SQL ja aplicado em `docs/supabase_premium_schema.sql`
- Gemini ja configurado por env

Backend e pagamento:

- `/api/premium/status` funciona em local e producao
- `/api/mercado-pago/checkout` cria preferencia
- `/api/mercado-pago/webhook` existe e esta preparado
- `MERCADO_PAGO_WEBHOOK_SECRET` ja foi configurado
- a verificacao mais recente em producao rejeitou chamada sem assinatura com `invalid_signature`, sinal de que a validacao de assinatura esta ativa
- NorthStar agora tambem publica:
  - `/api/northstar-app-manifest`
  - `/api/northstar-mcp`

Retaguarda:

- `OPS_PANEL_PASSWORD` configurado
- `OPS_SESSION_SECRET` configurado
- sessao ops via cookie `HttpOnly`
- `CRON_SECRET` configurado em `production`
- `OPENAI_APP_PUBLIC_URL` configurado em `production`
- `OPENAI_MCP_SERVER_URL` configurado em `production`
- `OPENAI_MCP_API_KEY` configurado em `production`
- `PAPIRO_TOOLS_AI_MODEL` configurado em `production` como `gemini-2.5-flash-lite`

## Validacoes feitas localmente

Fluxos validados em localhost:

- login da retaguarda em `/ops/`
- `GET /api/premium/status`
- `POST /api/premium/growth-event`
- `POST /api/ops/login`
- `GET /api/ops/overview`
- `POST /api/ops/copilot/analyze`
- `POST /api/ops/promotions/generate`
- `GET /api/ops/reports/weekly`
- `POST /api/mercado-pago/checkout`

Conclusoes fechadas:

- a senha da retaguarda funciona
- a Gemini funciona
- Supabase e Mercado Pago respondem no ambiente local

## Estado atual em producao / Vercel

Alias oficial:

- `https://papiro-tools.vercel.app`

Importante:

- usar o alias oficial acima
- nao usar o URL cru do deployment protegido da Vercel como referencia funcional do produto

Comportamento atual em producao:

- `POST /api/ops/login` funciona
- `GET /api/ops/overview` funciona
- `GET /api/ops/growth/overview` funciona
- `GET /api/ops/reports/weekly` funciona
- `GET /ops/app.js` serve o frontend novo da retaguarda
- `GET /api/northstar-app-manifest` responde `200`
- `GET /api/northstar-mcp` responde `401 unauthorized` sem bearer, sinal de rota publicada e protegida

Historico do incidente:

- a tela publicada do `/ops` mostrava `Falha na requisicao` antes mesmo do login
- o problema nao era senha
- o problema nao era Gemini
- a causa era um build intermediario da retaguarda em producao
- esse incidente foi corrigido no deploy de 2026-04-20

## Diagnostico fechado do bug da retaguarda

Diagnostico consolidado:

- a versao publicada em producao ainda corresponde a um estado intermediario da ops
- esse estado antigo continua com comportamento equivalente ao antigo `api/ops/[...slug]`
- o codigo local mais novo ja foi migrado para `api/ops-router.js`
- o roteamento novo depende de `vercel.json`

Arquivos corretos no codigo local:

- `api/ops-router.js`
- `vercel.json`
- `api/_lib/ops-auth.js`

Detalhes importantes:

- houve uma primeira tentativa de rewrite que falhava no `vercel build`
- o rewrite foi corrigido para a sintaxe atual valida
- `vercel build` local passou com o rewrite corrigido

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

Frontend local ja corrigido:

- `ops/app.js` agora mostra a mensagem neutra `Use a senha da retaguarda para liberar a operacao.`
- isso evita o falso sinal de erro antes da autenticacao

Conclusao do incidente:

- o login aparentava falhar em producao porque o build publicado da retaguarda estava desatualizado/intermediario
- o backend principal e a senha nao eram a causa raiz
- depois do deploy novo, `overview`, `growth` e `weekly report` voltaram a responder corretamente em producao

## Proximos passos operacionais imediatos

O deploy corretivo ja foi concluido em 2026-04-20.

Checklist de validacao ja confirmado:

1. `https://papiro-tools.vercel.app/ops/app.js` contem a mensagem `Use a senha da retaguarda para liberar a operacao.`
2. `POST /api/ops/login` funciona
3. `GET /api/ops/overview` funciona
4. `GET /api/ops/growth/overview` funciona
5. `GET /api/ops/reports/weekly` funciona

Proximos passos de produto/operacao:

1. validar um pagamento real completo e confirmar entitlement ativo
2. registrar o app do `NorthStar` no fluxo externo da OpenAI/ChatGPT usando o manifest e o MCP ja publicados
3. configurar Google Ads para primeira leitura real
4. configurar Meta Ads para primeira leitura real
5. seguir `docs/papiro_tools_execution_phases.md` como trilha de fechamento

## Credenciais e segredos existentes

Nao expor valores neste documento. Estado atual apenas por nome:

- `SUPABASE_URL`: configurado
- `SUPABASE_SERVICE_ROLE_KEY`: configurado
- `GEMINI_API_KEY`: configurado
- `MERCADO_PAGO_ACCESS_TOKEN`: configurado
- `MERCADO_PAGO_MONTHLY_PRICE`: configurado
- `MERCADO_PAGO_ANNUAL_PRICE`: configurado
- `PAPIRO_TOOLS_BASE_URL`: configurado
- `OPS_PANEL_PASSWORD`: configurado
- `OPS_SESSION_SECRET`: configurado
- `MERCADO_PAGO_WEBHOOK_SECRET`: configurado
- `CRON_SECRET`: configurado
- `OPENAI_APP_PUBLIC_URL`: configurado
- `OPENAI_MCP_SERVER_URL`: configurado
- `OPENAI_MCP_API_KEY`: configurado
- `PAPIRO_TOOLS_AI_MODEL`: configurado

## Decisoes congeladas

- o alias oficial do produto e `https://papiro-tools.vercel.app`
- a retaguarda continua no mesmo projeto e mesmo dominio
- a retaguarda local correta usa `api/ops-router.js` + `vercel.json`
- o backend continua como fonte da verdade para premium
- senha e Gemini nao foram a causa do incidente da producao

## Riscos e observacoes

- o incidente de build intermediario ja foi corrigido, mas vale manter este registro para evitar diagnostico errado em caso de regressao
- o webhook do Mercado Pago ja valida assinatura, mas ainda deve ser acompanhado com transacao real no fluxo completo

## Arquivos e documentos para manter sincronizados

Arquivos tecnicos principais:

- `api/ops-router.js`
- `vercel.json`
- `api/_lib/ops-auth.js`
- `ops/app.js`

Documentos de referencia:

- `README.md`
- `docs/premium_study_operacao_ai_pagamentos.md`
- `docs/premium_study_ops_console.md`
- `docs/premium_study_ops_runbook.md`
- `docs/papiro_tools_2026-04-20_handoff.md`

## Encerramento

Se outro chat assumir daqui, ele nao deve voltar para a hipotese de senha incorreta ou Gemini fora do ar. O estado correto ao fim de 2026-04-20 e:

- localhost funcionando
- senha funcionando
- Gemini funcionando
- producao publicada com retaguarda corrigida
- MCP e manifest do NorthStar publicados em producao
- IA do PDF funcionando em producao com bundle real
- review run persistida em producao
- proximo passo objetivo: pagamento real, registro externo do app do ChatGPT e fechamento de Google Ads / Meta Ads
