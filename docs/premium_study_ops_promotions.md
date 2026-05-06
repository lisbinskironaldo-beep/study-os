# Papiro Tools Ops Promotions

## Objetivo
As promocoes do paywall passam a ser geradas e geridas pelo `/ops`, com trilha pronta para automacao futura.

## Modos
- `suggest`
  Gera apenas drafts e sugestoes.
- `approval_required`
  Permite gerar e aplicar somente depois de aprovacao manual.
- `auto_rules`
  Deixa o sistema pronto para automatizar apenas superficies aprovadas.

## Canal v1
- `internal_site`

## Canais preparados para expansao
- `meta_ads`
- `google_ads`

## Tabelas
- `premium_study_promotion_campaigns`
  Guarda headline, lead, beneficios, CTA, recommended plan e ids externos futuros.
- `premium_study_promotion_actions`
  Registra auditoria de gerar, ativar, pausar e arquivar.
- `premium_study_promotion_rules`
  Reserva a base para regras automatizadas e integracao futura.

## Fluxo v1
1. gerar draft em `/ops`
2. revisar copy e recomendacao de plano
3. ativar para `premium_checkout`
4. o frontend publico consulta `GET /api/premium/promotions`
5. `PremiumStudyPromotions` mistura a oferta ativa ao paywall existente

## Integracao no front
- `PremiumStudyApp.openPremiumOffer(...)`
- `PremiumStudyBilling.startCheckout(...)`
- `premium-study/ui/views/index.js`

## Campos prontos para ads
- `external_platform`
- `campaign_id`
- `adset_id`
- `ad_id`
- `creative_id`

## Limite desta fase
Nao ha publicacao automatica externa em Meta ou Google na v1.
