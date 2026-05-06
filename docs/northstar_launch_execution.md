# NorthStar Launch Execution

Atualizado em 2026-04-20.

Este e o documento principal para colocar o `NorthStar` no ar nesta fase, sem perder o contexto do `Papiro Tools`.

## 1. O que ja esta feito

### Produto e operacao

- `Papiro Tools` publicado em `https://papiro-tools.vercel.app`
- `/ops/` ja funciona como shell do `NorthStar`
- checkout Mercado Pago criando preferencias reais em producao
- webhook publico Mercado Pago publicado
- verificacao de assinatura do webhook ativa em producao
- `Gemini` integrado ao copiloto operacional
- `CRON_SECRET`, `OPENAI_APP_PUBLIC_URL`, `OPENAI_MCP_SERVER_URL` e `OPENAI_MCP_API_KEY` configurados em `production`

### NorthStar

- registry multi-app
- workspace por app
- health checks dos conectores
- governanca por `change requests`
- `review runs` do ciclo de 3 dias
- trilha de auditoria
- bridge MCP para o ChatGPT
- manifest local do app do `NorthStar`
- deploy publicado no alias oficial com MCP e manifest ativos

### Validacao tecnica ja feita

- parse dos arquivos backend/frontend novos passou
- `vercel build` passou
- o alias oficial continua apontando para deployment `Ready`
- `GET /api/northstar-app-manifest` responde `200`
- `GET /api/northstar-mcp` responde `401 unauthorized` sem bearer, sinal de rota ativa e protegida
- `POST /api/mercado-pago/webhook` sem assinatura responde `invalid_signature`

## 2. O que ainda falta

### Etapas suas

1. confirmar ou aplicar o schema SQL atualizado no Supabase
2. registrar externamente o app do `NorthStar` no fluxo da OpenAI/ChatGPT
3. validar em browser autenticado o `/ops/` com a aba `Governanca`
4. opcionalmente disparar um review de 3 dias manual com dados reais

### Etapas minhas ou automatizaveis

1. manter a documentacao sincronizada com o estado publicado
2. apoiar a validacao do `/ops` com as novas areas de governanca
3. apoiar o registro externo do app do ChatGPT
4. apoiar a validacao do cron e do endpoint do ciclo de 3 dias

## 3. Ordem exata de execucao

### Passo 1. Sua vez: confirmar o schema no Supabase

Abra o projeto no Supabase e rode o SQL inteiro de:

- `docs/supabase_premium_schema.sql`

Isso e obrigatorio porque agora existem tabelas novas:

- `northstar_change_requests`
- `northstar_review_runs`
- `northstar_audit_log`

#### Passo exato

1. abrir `Supabase`
2. abrir o projeto certo
3. entrar em `SQL Editor`
4. colar o conteudo completo de `docs/supabase_premium_schema.sql`
5. clicar em `Run`

Quando terminar, me avise com:

```txt
schema aplicado
```

### Passo 2. Sua vez: registro externo do app no ChatGPT

Depois do deploy publicado e validado, entra a etapa externa da OpenAI.

Voce vai usar:

- app/manifeste: `https://papiro-tools.vercel.app/api/northstar-app-manifest`
- MCP: `https://papiro-tools.vercel.app/api/northstar-mcp`

#### Passo exato

1. abrir a plataforma da OpenAI para Apps SDK / ChatGPT app
2. criar ou atualizar o app `NorthStar`
3. informar a URL publica do app
4. informar a URL do MCP server
5. configurar o bearer token do MCP com o mesmo valor de `OPENAI_MCP_API_KEY`
6. concluir a publicacao/teste do app

Quando chegar nessa etapa, eu te acompanho nos campos exatos porque isso depende da tela atual da OpenAI.

### Passo 3. Sua vez: validar o painel `/ops/`

Depois de confirmar o schema, faca login em:

- `https://papiro-tools.vercel.app/ops/`

E valide:

1. a aba `Governanca` aparece
2. existe bloco de `Review de 3 dias`
3. existe lista de `Change requests`
4. existe bloco de `Site improvements`
5. o card de pagamentos mostra Mercado Pago com webhook assinado ativo

Se alguma dessas partes nao aparecer, me mande a tela e eu sigo do meu lado.

## 4. O que eu ja validei nesta publicacao

### Operacao humana

- alias oficial aponta para deployment `Ready`
- manifest do app responde em producao
- MCP responde em producao com protecao bearer
- webhook Mercado Pago continua exigindo assinatura valida

### Pagamento

- webhook assinado continua ativo
- checkout continua com a implementacao publicada

### IA

- MCP e manifest do app do ChatGPT respondem em producao

## 5. Estado de documentacao

Documentos principais desta fase:

- `docs/northstar_current_state.md`
- `docs/northstar_go_live_monetization.md`
- `docs/northstar_ai_ops_policy.md`
- `docs/northstar_three_day_growth_loop.md`
- `docs/northstar_chatgpt_app.md`
- `docs/papiro_tools_2026-04-20_handoff.md`
- `docs/northstar_launch_execution.md`

## 6. Proximo comando que importa

O proximo passo real e seu:

1. confirmar/aplicar o schema no Supabase
2. abrir `https://papiro-tools.vercel.app/ops/` e validar a aba `Governanca`
3. depois seguir para o registro externo do app no ChatGPT

Assim que voce fizer isso, eu continuo do meu lado sem te fazer reorganizar tudo de novo.
