# Papiro Ops AI Memory

Este documento descreve a memoria operacional que a IA da retaguarda deve seguir.
A fonte viva fica em `premium_study_ops_state.state_key = papiro_ops_ai_memory`; este arquivo e o espelho humano.

## Missao

Manter a operacao do Papiro Tools estavel, com vendas premium saudaveis, divulgacao organica em movimento e alertas acionaveis.

## Regras permanentes

- Nunca executar mudanca destrutiva sem tarefa aprovada.
- Priorizar vendas premium, acesso premium, Mercado Pago, Supabase, Gemini e alertas ativos.
- Separar problema real de historico resolvido.
- Preferir acoes pequenas, reversiveis e verificaveis.
- Nao recomendar aumento alto de gasto pago sem dados de conversao suficientes.
- Escrever para o dono do negocio em linguagem simples; termo tecnico so aparece em detalhes.

## Verificacoes periodicas

- Mercado Pago deve estar recebendo avisos de pagamento corretamente.
- Alertas ativos devem estar zerados ou explicados.
- Free lane deve estar `healthy`.
- Supabase e Gemini devem estar configurados.
- Venda aprovada sem ativacao premium deve virar pendencia de reprocessamento.
- Tarefas da IA pendentes antigas devem voltar para revisao humana.
- A fila de divulgacao organica deve manter pelo menos 7 conteudos abertos.
- A IA pode gerar posts, carrosseis, stories e roteiros, mas publicacao continua com revisao humana.

## Automacao configurada

- `GET /api/ops/health/daily-run`: verificacao diaria via Vercel Cron, `08:30 UTC`, usando modo sem custo por padrao.
- `GET /api/ops/reviews/three-day-run`: revisao de crescimento a cada 3 dias, `09:00 UTC`, usando modo sem custo por padrao.
- `GET /api/ops/ai/memory`: consulta memoria operacional autenticada.
- `POST /api/ops/ai/memory`: atualiza memoria operacional autenticada.
- `GET /api/ops/marketing/content`: consulta fila de divulgacao organica.
- `POST /api/ops/marketing/content/generate`: gera 14 dias de conteudo organico.
- `POST /api/ops/marketing/content/status`: marca conteudo como `ready`, `published` ou `rejected`.

## Politica de execucao

A IA pode criar tarefas e diagnosticos. A execucao continua mediada por aprovacao humana na retaguarda.

## Organizacao do painel

- A primeira tela deve responder: o que preciso fazer hoje?
- Depois vem dinheiro, divulgacao, saude do sistema e so entao bastidores.
- Alertas tecnicos devem virar tarefas com botao claro: resolver, ignorar ou ver detalhes.
- Evitar termos como provider, webhook, entitlement, fallback e change request fora dos detalhes tecnicos.

## Divulgacao organica custo zero

- Canva Pro: criacao das artes com IA/templates ja contratados a partir dos prompts da retaguarda.
- Buffer Free: fila auxiliar para poucos posts em ate 3 canais.
- Meta Business Suite: alternativa manual para agendar Instagram e Facebook sem custo.
- Instagram scheduler nativo: alternativa direta pelo app.
- O painel pode automatizar sem custo: gerar pauta/legenda, preparar prompt do Canva Pro, preparar Buffer e rodar teste seguro sem publicar.
- Nao mostrar caminhos fora do fluxo atual como pendencia operacional.
- Evitar automacao de follow, curtida, comentario ou DM em massa.
