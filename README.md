# Papiro Tools Workspace

## Estado atual

- localhost validado com `vercel dev`
- `/ops` local funcional com login, overview, copiloto Gemini, growth, promocoes e relatorio semanal
- producao publicada em `https://papiro-tools.vercel.app`
- incidente da retaguarda publicado em 2026-04-20 foi corrigido com novo deploy de producao

## NorthStar

`/ops` e o hub de retaguarda do `NorthStar`, o ponto central para operar o Papiro Tools e preparar o ecossistema para novos apps no mesmo shell administrativo.

O plano atual do hub cobre:

- portfolio de apps e registry operacional
- workspace multi-app com modulos de desenvolvimento, analise, melhorias, promocoes, financas e bugs
- Vercel, Supabase e GitHub como base de deploy, dados e codigo
- Gemini e OpenAI / ChatGPT como trilhas separadas de IA e assistencia autorizada
- Google Ads e Meta Ads como canais externos para growth, promocao e automacao futura
- change requests, auditoria e review recorrente a cada 3 dias
- trilha de app para ChatGPT via `Apps SDK + MCP`

Fase atual:

- o host tecnico publico atual e `https://papiro-tools.vercel.app`
- a migracao do alias antigo `rota-nota.vercel.app` para `papiro-tools.vercel.app` foi executada em 2026-04-30
- a UX e a estrutura de dados ja foram preparadas para a futura topologia `NorthStar + subdominios`

Documento principal de retomada:

- `docs/rotanota_execution_phases.md`
- `docs/rotanota_go_live_status.md`
- `docs/rotanota_2026-04-20_handoff.md`
- `docs/northstar_current_state.md`
- `docs/northstar_go_live_monetization.md`
- `docs/northstar_ai_ops_policy.md`
- `docs/northstar_three_day_growth_loop.md`
- `docs/northstar_chatgpt_app.md`
- `docs/northstar_launch_execution.md`

## Rodar localmente

Para o site publico com APIs `/api/*` no mesmo ambiente, use `vercel dev`.

```powershell
vercel dev
```

Abrir:
- `http://localhost:3000/`
- `http://localhost:3000/ops/`

## Regra de validacao

Sempre que uma tarefa alterar interface, navegacao, estados visuais ou fluxo do usuario, a conclusao precisa incluir validacao real no browser local.

Checklist minimo:

1. subir o ambiente com `vercel dev`
2. abrir a tela ou fluxo afetado no browser
3. confirmar que a tela carrega, que a interacao principal funciona e que nao ha erro relevante bloqueando o fluxo
4. registrar evidencias quando fizer sentido, como screenshot em `.codex-artifacts/visual-audit/`

Nao considerar tarefa de UI/fluxo como encerrada apenas com leitura de codigo.

## Documentos e PDF em Texto

Guia operacional principal:

- `docs/premium_documentos_sync.md`
- `docs/premium_study_mode_contract.md`

Regras atuais do fluxo:

- o upload aceito no premium study e PDF (`.pdf` / `application/pdf`)
- o modo `PDF em Texto` abre uma copia textual extraida do PDF para edicao estavel
- o PDF original continua separado quando houver asset salvo
- a Biblioteca premium sincroniza o snapshot do estudo por conta, incluindo o texto extraido salvo
- o navegador tambem mantem cache local para continuar funcionando mesmo sem sync
- quando `Aprender`, `Praticar` ou `Prova` ainda dependem dessa base, o sistema trava a navegacao e mostra uma mensagem de preparacao antes de abrir a aba

Para conseguir abrir o mesmo documento em outro PC exatamente do mesmo jeito:

1. usar a mesma conta Google no login do site
2. garantir que o schema `docs/supabase_premium_schema.sql` foi aplicado no Supabase
3. abrir o estudo pela Biblioteca premium ou salvar o estudo antes de trocar de maquina
4. usar um PDF textual valido

Observacoes importantes:

- `PDF em Texto` depende de um PDF com camada de texto; PDF escaneado ou imagem pura pode extrair pouco ou nada
- a primeira abertura do PDF usa `pdf.js` carregado da CDN `cdnjs`, entao o navegador e a rede precisam permitir esse carregamento
- se o login Google falhar por `origin_mismatch`, falta cadastrar a origin correta no Google Cloud
- o editor salvo sincroniza o texto do estudo; sem login, o material fica so no navegador atual

## Checagem de prontidao

Antes de testar checkout, premium, Gemini e retaguarda:

```powershell
node scripts/rotanota-readiness-check.js
```

O script verifica:
- envs obrigatorias
- URL canonica `PAPIRO_TOOLS_BASE_URL`
- Gemini
- Supabase
- senha da retaguarda

## Owner premium

Para liberar premium automatico para o dono/admin em qualquer navegador, use uma destas envs:

- `ROTANOTA_OWNER_EMAILS=email1@dominio.com,email2@dominio.com`
- `ROTANOTA_OWNER_USER_IDS=google:123,google:456`

Quando a conta logada bater com uma dessas listas, o backend responde premium por override de owner, sem depender de pagamento no navegador atual.

Observacoes:

- isso libera o premium por conta, nao por navegador
- a Biblioteca premium agora sincroniza por conta quando houver login e schema aplicado no Supabase
- o navegador ainda mantem um cache local para continuar funcionando mesmo sem sync
- a biblioteca ainda nao tem pastas de organizacao

## Login Google no premium

Para o login com Google funcionar no premium:

- configurar `GOOGLE_CLIENT_ID` ou `ROTANOTA_GOOGLE_CLIENT_ID` na Vercel
- cadastrar no Google Cloud as origins exatas usadas no site

Origins mais comuns:

- `https://papiro-tools.vercel.app`
- `http://localhost:3000`
- o dominio preview exato da Vercel, se estiver testando por preview

Sem isso, o premium pode mostrar erro `origin_mismatch`.

## Banco

Aplicar o schema:

```text
docs/supabase_premium_schema.sql
```

## Publicacao atual

Alias oficial:

- `https://papiro-tools.vercel.app`

Retaguarda publicada:

- `https://papiro-tools.vercel.app/ops/`

Status validado em 2026-04-20 apos o deploy corrigido:

- `POST /api/ops/login` funciona
- `GET /api/ops/overview` funciona
- `GET /api/ops/growth/overview` funciona
- `GET /api/ops/reports/weekly` funciona
- `GET /ops/app.js` publica o frontend novo da retaguarda
- `POST /api/premium/ai-generate` responde `200` com bundle real por IA
- rotas antigas do NorthStar Apps/MCP nao estao ativas no codigo atual
- `POST /api/ops/reviews/run` respondeu `200` e persistiu review run

Historico importante:

- antes do deploy corrigido, a producao estava servindo um build intermediario da retaguarda
- o problema nao era senha nem Gemini
- a causa era publicacao/versionamento do `/ops`

## Proximo passo operacional

Com a falha de requisicao resolvida, os proximos passos voltam a ser de evolucao operacional:

- validar um pagamento real completo e monitorar activations
- revisar a trilha externa de registro do NorthStar como app do ChatGPT, porque as rotas antigas `/api/northstar-app-manifest` e `/api/northstar-mcp` foram removidas do codigo atual
- configurar Google Ads e Meta Ads para sair de `not_configured`
- usar `docs/rotanota_execution_phases.md` como trilha oficial de execucao

## Observacao

O nome publico do produto e da marca e `Papiro Tools`. Qualquer ambiente antigo deve migrar para `PAPIRO_TOOLS_BASE_URL`.
