# NorthStar Architecture

## Objetivo

O `NorthStar` e a marca-mae e a retaguarda central do ecossistema. Hoje ele continua hospedado tecnicamente dentro do projeto do `RotaNota`, mas o papel dele e maior que um unico app: portfolio, conectores, automacao, dados, IA de fiscalizacao e operacao assistida.

## O que ja existe no codigo

- Hub operacional publicado em `/ops`
- Registry de apps em `premium_study_ops_state`
- Checks de saude para conectores principais
- Tabelas de growth, promocoes, alertas e estado operacional
- Produto principal `RotaNota` ja conectado ao hub

Arquivos-base:

- `ops/index.html`
- `ops/app.js`
- `api/ops-router.js`
- `api/_lib/ops-service.js`
- `api/_lib/ops-defaults.js`

## Mapa do ecossistema

Camada central:

- `NorthStar`: control plane, registry, alertas, governanca e autorizacao operacional

Produtos:

- `RotaNota`: operacao premium, growth, promocoes e acompanhamento do funil

Infraestrutura e codigo:

- `Vercel`: deploy, runtime, dominio, logs e integracoes MCP
- `Supabase`: banco, estado operacional, dados premium e futuro auth
- `GitHub`: repositorio, issues, actions, sincronismos e automacoes externas

IA e assistencia:

- `Gemini`: fiscalizacao, analise, copiloto operacional e rascunhos
- `OpenAI / ChatGPT`: assistencia autorizada sobre o ecossistema via Apps SDK + MCP

Growth externo e automacao futura:

- `Google Ads`: campanhas, relatorios, budget e automacao
- `Meta Ads`: campanhas, insights, criativos e operacao externa

## Caminho oficial por integracao

### OpenAI / ChatGPT

O caminho oficial para dar acesso do ChatGPT a uma aplicacao propria e o `Apps SDK`, com um `MCP server` exposto pelo seu backend. A documentacao da OpenAI descreve o fluxo em que o ChatGPT chama uma tool MCP, seu servidor busca os dados autoritativos e devolve `structuredContent` para a interface do app. A propria pagina do Apps SDK tambem registra que apps aprovados podem ser distribuidos no ChatGPT e que a distribuicao por plugin para Codex nasce desse fluxo aprovado.

Implicacao pratica para o NorthStar:

- ChatGPT nao deve falar direto com banco, Vercel ou GitHub sem a sua camada de controle
- o acesso autorizado deve passar por tools MCP desenhadas por voce
- cada tool deve ter escopo claro, validacao server-side e trilha de auditoria
- operacoes estruturais devem exigir autorizacao explicita, mesmo com o app conectado

Links oficiais:

- https://developers.openai.com/apps-sdk
- https://developers.openai.com/apps-sdk/build/mcp-server

### Vercel

A Vercel hoje ja tem `MCP server` oficial em `https://mcp.vercel.com`, com OAuth e suporte documentado para ChatGPT. Isso encaixa bem no NorthStar para deploy, ambiente, projeto e logs. A recomendacao aqui e tratar a Vercel como conector oficial externo e o NorthStar como orquestrador interno.

Links oficiais:

- https://vercel.com/docs/mcp/vercel-mcp
- https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel

### Supabase

O caminho oficial para gestao segura e a `Management API`, com `PAT` ou `OAuth2`. A documentacao tambem define scopes especificos para OAuth apps. Para o NorthStar, a inferencia recomendada e usar OAuth com escopo minimo quando o objetivo for administracao multi-projeto ou delegada; PAT fica melhor para operacao interna controlada por voce.

Links oficiais:

- https://supabase.com/docs/reference/api/introduction
- https://supabase.com/docs/guides/integrations/build-a-supabase-oauth-integration/oauth-scopes

### GitHub

Para uma integracao duradoura e com governanca melhor, a documentacao do GitHub recomenda `GitHub Apps` em vez de OAuth apps em muitos cenarios. GitHub Apps podem agir em nome do usuario ou independentemente dele. Para automacoes de repositorio, CI e disparos externos, `GitHub Actions` entram como runtime complementar; workflows podem ser disparados tambem por eventos externos como `repository_dispatch`.

Implicacao pratica:

- `GitHub App` para autenticacao e permissoes granulares
- `Actions` para rotinas de CI/CD, sincronismos e jobs reativos
- `NorthStar` como camada que decide quando disparar e o que pode ser alterado

Links oficiais:

- https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/deciding-when-to-build-a-github-app
- https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows

### Gemini

A documentacao oficial do Gemini API segue como trilha de provider para copiloto, fiscalizacao e analise. Como o hub ja usa Gemini hoje, o melhor papel dele aqui e continuar como motor analitico, separado das automacoes estruturais.

Link oficial:

- https://ai.google.dev/gemini-api/docs

### Google Ads

O caminho oficial da Google exige `developer token`, conta manager, conta cliente e autenticacao OAuth 2.0. A propria documentacao de quickstart tambem contempla service account e chave JSON para chamadas API. Isso significa que o NorthStar consegue centralizar relatorio e operacao, mas precisa de credenciais e permissoes bem fechadas por conta.

Links oficiais:

- https://developers.google.com/google-ads/api/docs/get-started/introduction
- https://developers.google.com/google-ads/api/docs/get-started/make-first-call

### Meta Ads

A documentacao oficial da `Marketing API` descreve a trilha para criar apps, comecar o uso e atender os requisitos de acesso. Na pratica, isso costuma envolver app review, tokens e permissoes por negocio/conta. Para o NorthStar, a recomendacao e tratar Meta Ads como conector de crescimento externo com rollout posterior, nao como dependencia do primeiro corte do hub.

Links oficiais:

- https://developers.facebook.com/docs/marketing-api/
- https://developers.facebook.com/docs/marketing-api/get-started/

## Regras de seguranca recomendadas

- Menor privilegio por conector e por tool
- Credenciais so no servidor, nunca no frontend
- Operacoes destrutivas ou estruturais sempre com confirmacao explicita
- Log de auditoria para toda acao sensivel
- Separar leitura, recomendacao e execucao automatica em niveis diferentes
- Fallback seguro quando provider externo falhar

## Arquitetura recomendada

1. `NorthStar` continua como painel central em `/ops`
2. O backend do hub vira a fonte de verdade para autorizacao, politicas e auditoria
3. Cada integracao externa ganha um adaptador proprio no backend
4. O acesso do ChatGPT entra por `Apps SDK + MCP`, falando so com tools autorizadas do hub
5. Automacoes futuras de ads e workflows so avancam depois que leitura, observabilidade e aprovacao manual estiverem estaveis

## Ordem de rollout recomendada

1. Consolidar `NorthStar` como nome e hub unico
2. Fechar `Vercel`, `Supabase` e `GitHub` como base estrutural
3. Publicar a trilha `OpenAI / ChatGPT` com app + MCP + autorizacao server-side
4. Manter `Gemini` como copiloto de fiscalizacao e analise
5. Adicionar leitura operacional de `Google Ads` e `Meta Ads`
6. So depois liberar automacoes parciais ou totais de campanhas

## Observacao importante

Ter o ChatGPT "com acesso a toda a aplicacao" deve ser entendido como acesso autorizado e mediado pelo seu backend, nao como acesso irrestrito a tudo. Isso nao e uma limitacao do projeto; e a forma correta de manter seguranca, governanca e previsibilidade quando o ecossistema crescer.

## Estado da fase atual

- `NorthStar` segue hospedado tecnicamente no deploy do `RotaNota`
- `Gemini` opera no free tier com caps e fallback
- `ChatGPT` entra nesta fase por `Apps SDK + MCP`
- execucao final fica approval-gated por `change requests`
- um ciclo recorrente de 3 dias passa a revisar growth barato, melhorias do site e recomendacoes acionaveis
