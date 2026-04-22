# NorthStar ChatGPT App

## Objetivo

Expor o `NorthStar` ao ChatGPT pelo caminho oficial `Apps SDK + MCP`, mantendo governanca server-side e aprovacao humana para execucao.

## Endpoints preparados nesta fase

- manifest local do app: `/api/northstar-app-manifest`
- servidor MCP/bridge: `/api/northstar-mcp`

## Autenticacao

- bearer token via `OPENAI_MCP_API_KEY`
- o app publico e o MCP usam:
  - `OPENAI_APP_PUBLIC_URL`
  - `OPENAI_MCP_SERVER_URL`

## Tools v1

- `get_ecosystem_overview`
- `get_ops_overview`
- `get_payments_status`
- `get_growth_overview`
- `get_apps_workspace`
- `get_alerts`
- `get_site_improvements`
- `create_change_request`
- `list_change_requests`
- `approve_change_request`
- `reject_change_request`
- `execute_approved_change_request`

## Politica de execucao

- leitura: direta
- preparo: direto
- execucao: sempre mediada por `change request`

## Observacao

O registro final do app no ChatGPT ainda depende da configuracao externa na plataforma OpenAI depois que o backend estiver publicado com as URLs finais.
