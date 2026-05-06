# Papiro Tools + NorthStar - Execucao por Fases

Atualizado em 2026-04-20.

Este e o documento principal para nao se perder na execucao. Ele separa o trabalho em fases fechadas, com:

- objetivo
- estado atual
- o que ja foi feito
- o que ainda falta
- criterio de pronto

Regra de uso:

```txt
seguir de cima para baixo
nao reabrir escopo no meio
so marcar fase como pronta quando o criterio de pronto estiver fechado
```

## Visao rapida

| Fase | Nome | Estado |
| --- | --- | --- |
| 0 | Base tecnica e ambiente | concluida |
| 1 | IA do PDF | concluida |
| 2 | Checkout e premium | parcialmente concluida |
| 3 | `/ops` e governanca | concluida |
| 4 | App do ChatGPT | backend concluido, registro externo pendente |
| 5 | Google Ads e Meta Ads | bloqueada por credenciais externas |
| 6 | Gate final de go-live | em andamento |

## Fase 0 - Base tecnica e ambiente

### Objetivo

Garantir que ambiente, banco, runtime e health basico estejam coerentes antes de mexer no resto.

### Ja feito

- `docs/supabase_premium_schema.sql` validado contra o projeto Supabase.
- tabelas criticas do premium e do NorthStar responderam `200` por runtime real.
- `scripts/papiro-tools-readiness-check.js` foi ampliado para checar:
  - Supabase real
  - Gemini real
  - Mercado Pago real
  - superficie OpenAI app + MCP
  - sinais de Google Ads e Meta Ads
- `GET /api/premium/status` passou a expor:
  - `aiAvailable`
  - `aiModel`
  - `schemaReady`

### Estado atual

- local: saudavel
- producao: saudavel
- schema: pronto

### Falta

- nada estrutural nesta fase

### Criterio de pronto

- readiness sem pendencia obrigatoria
- schema critico acessivel em runtime
- health backend coerente com o ambiente real

Status: `concluida`

## Fase 1 - IA do PDF

### Objetivo

Fazer a IA do PDF gerar de verdade no fluxo principal, sem depender de fallback enganoso.

### Ja feito

- `api/_lib/gemini.js` agora devolve:
  - `providerStatus`
  - `httpStatus`
  - sinal de retry por indisponibilidade
- `api/premium/ai-generate.js` agora:
  - usa `PAPIRO_TOOLS_AI_MODEL`
  - defaulta para `gemini-2.5-flash-lite`
  - tenta fallback controlado
  - responde com `attemptedModels` e `providerStatus`
- `premium-study/services/ai.js` deixou de fingir que a IA esta sempre configurada.
- `PAPIRO_TOOLS_AI_MODEL` foi definido em `production` como `gemini-2.5-flash-lite`.

### Validacao executada

- smoke local do handler retornou `200 generated`.
- smoke em producao no alias oficial retornou `200`.
- o bundle real foi gerado em producao com `gemini-2.5-flash-lite`.

### Estado atual

- bundle inicial do PDF: funcionando
- fallback local: ainda existe como rede de seguranca, mas nao e mais o caminho nominal

### Falta

- opcional: melhorar UX visual para diferenciar ainda mais bundle por IA e fallback local

### Criterio de pronto

- `POST /api/premium/ai-generate` responde `200` no alias oficial
- `aiModel` refletido corretamente em `premium/status`
- falha do provider cai em fallback explicito e honesto

Status: `concluida`

## Fase 2 - Checkout e premium

### Objetivo

Fechar checkout, webhook, reconciliacao e ativacao premium de ponta a ponta.

### Ja feito

- `POST /api/mercado-pago/checkout` cria preferencia real.
- smoke em producao criou preferencia e retornou `checkoutUrl`.
- o checkout criado apareceu em `/api/ops/payments`.
- `paymentId` continua suportado para reconciliacao.
- o webhook assinado aparece como ativo em producao.
- `premium/status` e `/ops` leem a mesma fonte de verdade.

### Estado atual

- checkout: funcionando
- webhook: ativo em producao
- entitlement: backend pronto
- UI de retorno: pronta

### Falta

- validar um ciclo real completo:
  - pagamento aprovado
  - webhook assinado recebido
  - entitlement ativo
  - premium liberado na UI
- confirmar visualmente o nome publico no comprovante do Mercado Pago

### Criterio de pronto

- existe pelo menos um ciclo real `checkout -> webhook/reconcile -> entitlement -> premium ativo`
- `/api/premium/status` reflete o entitlement correto
- `/ops` mostra o mesmo estado

Status: `parcialmente concluida`

## Fase 3 - `/ops` e governanca

### Objetivo

Fechar a retaguarda operacional e a trilha de governanca do NorthStar.

### Ja feito

- `/ops` autenticado respondeu `200` em producao para:
  - `overview`
  - `payments/status`
  - `apps/check`
  - `apps/workspace`
  - `reviews/run`
  - `reviews`
- a `review run` foi executada em producao e persistiu com status `completed`.
- o health dos apps agora e renovado automaticamente quando estiver vazio ou velho.
- o summary de apps no overview passou a refletir runtime real.

### Estado atual

- `/ops`: funcional
- governanca: funcional
- review de 3 dias: funcional
- webhook Mercado Pago: `active`

### Falta

- apenas validacao visual/manual mais ampla se quiser fechar UX de backoffice

### Criterio de pronto

- `/ops` abre sem erro antes do login
- as abas principais respondem
- `review runs` e governanca persistem em banco

Status: `concluida`

## Fase 4 - App do ChatGPT

### Objetivo

Deixar o NorthStar pronto para operar como app externo via manifest + MCP.

### Ja feito

- `api/northstar-app-manifest` responde `200`.
- `api/northstar-mcp` responde com bearer valido.
- o health de `openai_chatgpt` em producao ficou `healthy`.
- `OPENAI_APP_PUBLIC_URL`, `OPENAI_MCP_SERVER_URL` e `OPENAI_MCP_API_KEY` estao configurados em `production`.

### Estado atual

- backend tecnico: pronto
- MCP: pronto
- manifest: pronto

### Falta

- concluir o registro externo na plataforma OpenAI/ChatGPT

### Criterio de pronto

- app registrado externamente
- manifest e MCP funcionando no cadastro externo
- politica de leitura direta e execucao por `change request` preservada

Status: `backend concluido, registro externo pendente`

## Fase 5 - Google Ads e Meta Ads

### Objetivo

Fechar esses conectores com validacao real, nao so por env.

### Ja feito

- `api/_lib/ops-service.js` foi preparado para:
  - Google Ads: autenticar e ler conta real
  - Meta Ads: ler conta real
- o health agora so marca `healthy` quando houver leitura real bem-sucedida.

### Estado atual

- `google_ads`: `not_configured`
- `meta_ads`: `not_configured`

### Bloqueio real

Faltam credenciais e contas reais em `production`:

- Google Ads:
  - `GOOGLE_ADS_DEVELOPER_TOKEN`
  - `GOOGLE_ADS_MANAGER_CUSTOMER_ID`
  - `GOOGLE_ADS_CUSTOMER_ID`
  - autenticacao valida
- Meta Ads:
  - `META_APP_ID`
  - `META_AD_ACCOUNT_ID`
  - `META_ACCESS_TOKEN`

### Criterio de pronto

- ambos em `healthy` no `/ops`
- ambos com primeira leitura real validada

Status: `bloqueada por credenciais externas`

## Fase 6 - Gate final de go-live

### Objetivo

Fechar tudo o que ainda impede chamar o ecossistema de 100% utilizavel.

### Ja feito

- build passou
- deploy em producao foi publicado no alias oficial
- IA do PDF foi validada em producao
- `/ops` foi validado em producao
- MCP foi validado em producao
- review run foi validada em producao
- checkout smoke foi validado em producao

### Falta

1. validar um pagamento real completo com entitlement ativo
2. registrar externamente o app do ChatGPT
3. configurar Google Ads
4. configurar Meta Ads

### Criterio de pronto

- produto publico funcionando
- IA real funcionando
- checkout e premium validados com transacao real
- `/ops` e governanca funcionando
- app do ChatGPT registrado
- Google Ads `healthy`
- Meta Ads `healthy`

Status: `em andamento`

## Ordem pratica da proxima rodada

1. Fazer um pagamento real controlado e validar entitlement no `/ops`
2. Registrar o app do NorthStar na OpenAI/ChatGPT
3. Configurar Google Ads e validar primeira leitura real
4. Configurar Meta Ads e validar primeira leitura real
5. Rodar o smoke final de tudo no alias oficial

## Documentos que devem ficar sincronizados

- [README.md](C:/dev/study-os/README.md)
- [docs/papiro_tools_go_live_status.md](C:/dev/study-os/docs/papiro_tools_go_live_status.md)
- [docs/papiro_tools_2026-04-20_handoff.md](C:/dev/study-os/docs/papiro_tools_2026-04-20_handoff.md)
- [docs/northstar_current_state.md](C:/dev/study-os/docs/northstar_current_state.md)
