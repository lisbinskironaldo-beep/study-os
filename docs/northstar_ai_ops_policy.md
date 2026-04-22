# NorthStar AI Ops Policy

## Papel do Gemini

- provider de analise, fiscalizacao e preparo
- free tier com caps, cache e fallback
- nunca como dependencia unica para operacoes criticas de receita ou seguranca

## Papel do ChatGPT

- operador conversacional do NorthStar
- acesso via `Apps SDK + MCP`
- leitura ampla
- preparo amplo
- execucao final apenas com aprovacao

## Niveis de acao

### 1. Read

- overview
- pagamentos
- growth
- apps workspace
- alertas
- melhorias de site

Executa direto.

### 2. Prepare

- rascunho de campanha
- critica de landing e paywall
- classificacao de bugs e melhorias
- change request

Executa direto e grava auditoria.

### 3. Execute

- qualquer acao estrutural
- qualquer acao de producao
- qualquer acao relacionada a pagamento
- qualquer acao de campanha com potencial de custo

Nunca executa sem aprovacao explicita.

## Politica de governanca

- toda recomendacao de IA gera trilha de auditoria
- toda aprovacao humana gera trilha de auditoria
- toda execucao gera resultado e resumo persistidos
