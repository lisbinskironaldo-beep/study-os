# RotaNota Ops Copilot

## Stack
- provider: Gemini
- modelo padrao: `OPS_COPILOT_DEFAULT_MODEL` com fallback previsto para `gemini-2.5-flash-lite`
- modelo estrategico: `OPS_COPILOT_STRATEGY_MODEL` com fallback previsto para `gemini-2.5-flash`

## Objetivo
O copiloto da retaguarda le apenas dados consolidados do backend para responder:
- diagnostico operacional
- diagnostico de growth
- onde investir agora
- onde nao investir agora
- como promover agora
- plano semanal
- sinais de risco

## Regras de uso
- `1 digest diario` cacheado por dia
- `1 estrategia semanal` cacheada por semana
- `ate 3 consultas manuais por dia`
- `hard cap de 300 chamadas por mes`
- se Gemini nao estiver configurado ou falhar, o backend cai para `fallback` deterministico

## Entradas de dados
- overview operacional
- growth overview com UTMs e spend manual
- relatorio semanal
- busca manual opcional do operador

## Saida padrao
JSON com:
- `summary`
- `opsFindings`
- `growthFindings`
- `investmentRecommendations`
- `promotionRecommendations`
- `weeklyPlan`
- `confidence`
- `insufficientData`

## Boas praticas
- nao usar dumps brutos de PDF
- nao inventar ROI quando faltar spend ou volume
- tratar recomendacao como consultiva, nao como execucao automatica
