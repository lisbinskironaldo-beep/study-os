# NorthStar Current State

Atualizado em 2026-04-20.

## Estado confirmado

- host publico atual: `https://papiro-tools.vercel.app`
- retaguarda NorthStar publicada em `/ops/`
- checkout Mercado Pago cria preferencias reais em producao
- webhook publico Mercado Pago existe e responde
- assinatura do webhook agora esta configurada em producao
- validacao runtime mais recente retornou `invalid_signature` quando enviada requisicao sem assinatura, sinal de que a verificacao de assinatura esta ativa
- Gemini ja opera como copiloto da retaguarda
- trilha `OpenAI / ChatGPT` ja foi publicada nesta fase via `Apps SDK + MCP`
- manifest publico do app responde em `/api/northstar-app-manifest`
- bridge MCP publica responde em `/api/northstar-mcp` e exige bearer token
- cron de 3 dias ja esta configurado em `vercel.json` e protegido por `CRON_SECRET`

## O que ja existe no codigo

- painel `/ops` com overview, financeiro, growth, copiloto, promocoes, apps e alertas
- registry multi-app do NorthStar
- persistencia premium, growth, spend, promocoes e workspace por app no Supabase
- health checks de Vercel, Supabase, Mercado Pago, Gemini, GitHub e conectores planejados
- governanca por `change requests`
- `review runs` do ciclo de 3 dias
- trilha de auditoria
- manifest do app e servidor MCP do NorthStar

## Bloqueios de go-live do ecossistema

- confirmar que o schema SQL novo foi aplicado no Supabase
- registrar o NorthStar como app do ChatGPT ainda depende de configuracao externa apos a publicacao do manifest e do servidor MCP
- Google Ads e Meta Ads seguem em discovery; nao ha automacao de gasto ativo
- o ciclo automatico de 3 dias ja existe, mas ainda precisa de validacao funcional com dados reais do painel

## Leitura operacional

- Mercado Pago e a trilha primaria de receita
- `/ops` e o centro humano de aprovacao e governanca
- Gemini fica no free tier com caps e fallback
- ChatGPT entra como operador conversacional autorizado, mas sem bypass de aprovacao
