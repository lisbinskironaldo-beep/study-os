# Papiro Tools - Go-live e estado operacional

Atualizado em 2026-04-20.

## Resumo executivo

O Papiro Tools ja esta publicado no alias oficial:

- `https://papiro-tools.vercel.app`

O site publico, o painel `/ops`, as APIs premium e os endpoints NorthStar responderam em producao. A IA do PDF voltou a responder no fluxo real com bundle gerado por modelo. Nao ha pendencia obrigatoria local detectada pelo readiness check, mas ainda existem alertas importantes antes de considerar o go-live comercial completamente fechado.

## Validacoes executadas

- `node scripts/papiro-tools-readiness-check.js`
- Resultado: 0 pendencias obrigatorias e alertas residuais apenas para integracoes externas ainda nao configuradas no ambiente local.
- `GET https://papiro-tools.vercel.app/` respondeu `200 text/html`.
- `GET https://papiro-tools.vercel.app/ops/` respondeu `200 text/html`.
- `GET https://papiro-tools.vercel.app/api/premium/status` respondeu com backend configurado.
- `POST https://papiro-tools.vercel.app/api/premium/ai-generate` respondeu `200` com bundle real.
- `GET https://papiro-tools.vercel.app/api/northstar-app-manifest` respondeu `200 application/json`.
- `POST https://papiro-tools.vercel.app/api/northstar-mcp` respondeu `200` com bearer valido.
- `POST https://papiro-tools.vercel.app/api/ops/reviews/run` respondeu `200` e persistiu uma review run.
- Busca em fonte e docs relevantes nao encontrou mais residuos da marca antiga.

## Feito ate aqui

- Marca publica consolidada como Papiro Tools.
- Home publicada com favicon, logo e copy de Papiro Tools.
- Modulo de PDF focado integrado ao shell principal.
- Abertura do PDF Focado otimizada com preload e tela imediata de carregamento.
- Checkout Mercado Pago criando pagamentos reais.
- Smoke de checkout em producao criando preferencia e refletindo em `/ops/payments`.
- Retorno do checkout tratado na volta ao Papiro Tools.
- Reconciliacao por `paymentId` adicionada para liberar premium quando o webhook ainda nao fechou a confirmacao.
- Upload premium acima de 12 paginas liberado quando o acesso esta ativo.
- Entrada premium ajustada para experiencia de usuario pagante, sem copy de plano gratis como foco principal.
- Supabase definido como fonte de verdade para checkout, entitlements, growth, alertas, promocoes e NorthStar.
- Painel `/ops` publicado com visao operacional, growth, financas, promocoes, apps, alertas e governanca.
- NorthStar publicado como control plane e registrado para uso via app/conector.
- MCP NorthStar adaptado para responder ao cadastro do ChatGPT.
- Readiness script criado para checar variaveis, Supabase, Gemini, ops e Mercado Pago.
- Readiness ampliado para checar runtime real de Supabase, Gemini, Mercado Pago, OpenAI app/MCP e sinais de ads.
- `PAPIRO_TOOLS_AI_MODEL` configurado em producao como `gemini-2.5-flash-lite`.
- Residuos de marca antiga removidos de configuracao, scripts, IndexedDB e docs principais.

## Faltante para go-live comercial fechado

1. Validar um pagamento real completo.

Hoje o checkout cria preferencia real e o webhook esta ativo, mas ainda falta fechar o ciclo completo com entitlement ativo em uma transacao real controlada.

2. Ajustar o nome publico no painel do Mercado Pago.

O comprovante do cartao pode mostrar o nome cadastrado no vendedor/aplicacao do Mercado Pago. Se ainda aparecer nome antigo, isso precisa ser alterado no painel do Mercado Pago, fora do codigo do Papiro Tools.

3. Registrar externamente o app do NorthStar no ChatGPT.

O backend do manifest e do MCP ja esta pronto e saudavel. O ponto pendente agora e o registro externo na plataforma da OpenAI/ChatGPT.

4. Configurar Google Ads e Meta Ads.

Os conectores agora exigem validacao real para ficarem `healthy`. Eles continuam pendentes por falta de credenciais e contas reais em producao.

5. Monitorar primeiro ciclo de usuarios reais.

Verificar eventos de upload, paywall, checkout, premium ativo, erros de webhook e acesso a biblioteca depois dos primeiros testes externos.

## Estado de marca

Produto e marca: `Papiro Tools`.

Nao usar mais a marca antiga em:

- interface publica
- checkout
- documentacao nova
- variaveis de ambiente novas
- storage novo
- comunicacao com usuario

Se algum comprovante externo ainda mostrar nome antigo, a origem provavel e cadastro do provedor de pagamento, nao o frontend publicado.

## Checklist final antes de divulgar

- Confirmar `MERCADO_PAGO_WEBHOOK_SECRET` em producao.
- Confirmar `CRON_SECRET` em producao.
- Fazer um pagamento de teste controlado e validar entitlement no `/ops`.
- Abrir PDF Focado em mobile e desktop.
- Upload de PDF pequeno e PDF com mais de 12 paginas.
- Confirmar que a tela premium aparece como usuario pagante.
- Confirmar que o nome do vendedor no Mercado Pago aparece como Papiro Tools.
- Confirmar registro externo do app do ChatGPT.
- Configurar Google Ads e Meta Ads ate sair de `not_configured`.
- Usar `docs/papiro_tools_execution_phases.md` como checklist oficial de fechamento.
