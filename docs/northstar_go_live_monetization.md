# NorthStar Go-Live and Monetization

## Objetivo

Colocar o `RotaNota Premium` no centro da monetizacao imediata, com o `NorthStar` operando pagamento, observabilidade, recomendacoes e governanca.

## Fonte primaria de receita

- `Mercado Pago`
- preferencia criada no backend
- premium ativado via webhook + entitlement no backend

## Checklist de go-live

1. manter `https://rota-nota.vercel.app` como host canonico nesta fase
2. manter `/ops/` como painel humano do NorthStar
3. validar diariamente:
   - checkout criado
   - webhook recebido
   - entitlement atualizado
   - premium refletido em `/api/premium/status`
4. revisar a cada 3 dias:
   - funnel de conversao
   - friccao do paywall
   - campanhas internas
   - recomendacoes de baixo custo

## Leitura do funil que deve aparecer no NorthStar

- `paywall_viewed`
- `checkout_click`
- `checkout_created`
- `webhook_received`
- `premium_activated`

## Politica de promocao

- `internal_site` primeiro
- midia paga apenas por recomendacao e aprovacao manual
- campanhas externas seguem em modo `recommendation-first`

## Alavancas de monetizacao imediata

- melhor copy do paywall
- reforco de continuidade premium
- share cards como `meu plano ficou pronto`
- incentivo de retorno ao estudo
- criativos de baixo custo para WhatsApp, Instagram Reels, TikTok e comunidades de estudo
