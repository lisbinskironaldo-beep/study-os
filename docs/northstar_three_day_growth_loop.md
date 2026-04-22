# NorthStar 3-Day Growth Loop

## Objetivo

A cada 3 dias, o NorthStar revisa o ecossistema com foco em crescimento barato, monetizacao do premium e necessidade de melhoria no site.

## Entrada de dados

- overview operacional
- pagamentos e entitlements
- growth overview
- campanhas e promocoes
- snapshots financeiros
- bugs
- backlog e melhorias
- workspace por app

## Saidas minimas

- resumo executivo
- ideias de aquisicao barata
- recomendacoes de manter, pausar, criar ou revisar campanha
- recomendacoes de melhoria de landing, paywall e onboarding
- priorizacao de bugs e melhorias
- notas de confianca e falta de dados

## Fluxo

1. NorthStar coleta o estado atual
2. Gemini gera o pacote de analise
3. o sistema persiste a review run
4. o sistema gera `change requests` para itens acionaveis
5. `/ops` e ChatGPT mostram o pacote
6. a execucao espera aprovacao humana

## Politica de custo

- growth barato primeiro
- evitar gasto pago enquanto o site ainda tiver friccao clara
- so recomendar campanhas externas quando a base de conversao estiver aceitavel
