# Handoff: Papiro Tools ops, conectores e site isca

Data: 2026-04-30

## Estado atual do projeto principal

Projeto local: `c:\dev\study-os`

Projeto Vercel principal:

- Nome: `papiro-tools`
- Project ID: `prj_j41hJqzskhVjlFUX433LuXevzOFE`
- Team/Org ID: `team_lOvkqSJQyF9tdt3DlCXqfCd6`
- Produção: `https://papiro-tools.vercel.app`
- Domínio antigo `https://rota-nota.vercel.app` foi removido e retorna `404 DEPLOYMENT_NOT_FOUND`.

Arquivos alterados nesta rodada:

- `.env.example`
- `api/_lib/ops-service.js`
- `api/ops-router.js`
- `ops/app.js`
- `ops/index.html`
- `README.md`
- `api/_lib/handlers/mercado-pago/checkout.js`
- `scripts/rotanota-readiness-check.js`

Observação: a árvore git já estava suja antes de parte das alterações. Não usar `git reset --hard` nem reverter arquivos sem revisar.

## Correções já feitas

1. Branding/domínio:
   - `PAPIRO_TOOLS_BASE_URL` atualizado na Vercel.
   - `OPENAI_APP_PUBLIC_URL` e `OPENAI_MCP_SERVER_URL` apontam para `papiro-tools.vercel.app`.
   - `ROTANOTA_BASE_URL` removido do `.env.example`.

2. `/ops` carregando sem CSS/JS:
   - `ops/index.html` agora usa `/ops/style.css` e `/ops/app.js`.
   - Verificado em produção com `curl -I https://papiro-tools.vercel.app/ops/` e `curl -I https://papiro-tools.vercel.app/ops/app.js`, ambos `200`.

3. Rascunhos de marketing sem acentos:
   - `api/_lib/ops-service.js` ganhou `polishMarketingPortuguese`.
   - Seeds determinísticas foram acentuadas.
   - Prompt da IA pede português do Brasil com acentuação correta.
   - Normalização também corrige campos salvos.

## Conectores adicionados no retaguarda

Rotas novas:

- `GET /api/ops/marketing/integrations`
- `POST /api/ops/marketing/content/prepare`
- `POST /api/ops/marketing/content/schedule-buffer`
- `GET /api/ops/marketing/buffer/channels`
- `POST /api/ops/marketing/content/publish-instagram`

UI nova em `/ops`:

- Card de conectores: Canva Pro, Buffer, Publer, Meta Business e Instagram.
- Botão `Preparar Canva`: gera briefing manual para arte.
- Botão `Preparar Buffer`: gera rascunho de post/agendamento.
- Botão `Agendar Buffer`: tenta criar posts via API real do Buffer.
- Botão `Ver canais Buffer`: consulta organizações/canais do Buffer e mostra IDs.
- Botão `Publicar Instagram`: pede URL pública HTTPS de uma arte e publica via Meta Graph API.

Variáveis necessárias:

- `BUFFER_API_KEY`
- `BUFFER_ORGANIZATION_ID` opcional
- `BUFFER_PROFILE_IDS`
- `META_ACCESS_TOKEN`
- `META_GRAPH_API_VERSION`, padrão documentado `v23.0`
- `INSTAGRAM_BUSINESS_ACCOUNT_ID`
- `CANVA_CONNECT_CLIENT_ID`
- `CANVA_CONNECT_CLIENT_SECRET`
- `CANVA_BRAND_TEMPLATE_ID`
- `CANVA_BRAND_KIT_ID`
- `PUBLER_API_KEY`
- `PUBLER_WORKSPACE_ID`

Situação das credenciais em produção no último check:

- Buffer está configurado em produção:
  - `BUFFER_API_KEY`
  - `BUFFER_ORGANIZATION_ID`
  - `BUFFER_PROFILE_IDS`
- Canal Buffer salvo: `estudacompapiro - Instagram`
- ID do canal salvo em `BUFFER_PROFILE_IDS`: `69f3d8475c4c051afaf986df`
- Organização Buffer salva em `BUFFER_ORGANIZATION_ID`: `69f3ccbe237ef02c98a1cdb9`
- Ainda não estavam configuradas: Canva Connect, Publer, Instagram Business direto pela Meta.
- Já existem várias credenciais antigas do projeto, mas não mostrar valores em chat.
- Usar `vercel env ls` para conferir nomes, sem revelar segredos.

## Próximo passo recomendado para outro chat

1. Entrar em `https://papiro-tools.vercel.app/ops/`.
2. Dar `Ctrl + F5` para garantir JS/CSS novos.
3. Confirmar se o card Buffer aparece como `pronto`.
4. Gerar ou escolher um rascunho simples de marketing.
5. Clicar `Preparar Buffer`.
6. Clicar `Agendar Buffer`.
7. Conferir no Buffer se o post entrou na fila do Instagram `estudacompapiro`.
8. Se o agendamento falhar, ler a mensagem dentro do proprio rascunho e checar logs com `vercel logs papiro-tools.vercel.app`.
9. Só depois configurar Meta/Instagram:
   - `INSTAGRAM_BUSINESS_ACCOUNT_ID`
   - `META_ACCESS_TOKEN` com permissões de publicação.

## O que falta para deixar o retaguarda funcionando a todo vapor

Prioridade 1: testar Buffer ponta a ponta

- Testar `Preparar Buffer` + `Agendar Buffer` com um rascunho de baixo risco.
- Confirmar no Buffer se o post foi para fila, rascunho ou recusado.
- Se a mutação GraphQL falhar, ajustar `createBufferPost` em `api/_lib/ops-service.js`.
- Confirmar se o Buffer aceita post somente texto para Instagram; se exigir mídia, adaptar o fluxo para exigir imagem/arte antes de agendar.

Prioridade 2: Meta/Instagram direto

- Configurar `INSTAGRAM_BUSINESS_ACCOUNT_ID`.
- Configurar `META_ACCESS_TOKEN` com permissões de publicação.
- Testar `Publicar Instagram` somente com imagem HTTPS pública.
- Validar fluxo `media` + `media_publish`.
- Se o usuário preferir operar tudo via Buffer, Meta direto pode ficar como fallback.

Prioridade 3: Canva

- Continuar usando `Preparar Canva` como briefing manual.
- Se houver app Canva Connect aprovado, configurar:
  - `CANVA_CONNECT_CLIENT_ID`
  - `CANVA_CONNECT_CLIENT_SECRET`
  - `CANVA_BRAND_TEMPLATE_ID`
  - `CANVA_BRAND_KIT_ID`
- Não prometer Autofill total apenas com Canva Pro; validar permissões oficiais antes.

Prioridade 4: Publer

- Só conectar se o plano do Publer liberar API.
- Configurar:
  - `PUBLER_API_KEY`
  - `PUBLER_WORKSPACE_ID`
- Implementar endpoint real depois de confirmar contrato/API disponível.

Prioridade 5: acabamento operacional

- Criar logs/auditoria mais explícitos para cada conector.
- Mostrar `lastResults` de Buffer com linguagem mais amigável.
- Criar botão para copiar legenda/briefing.
- Criar alerta quando Buffer/Meta estiverem sem credenciais.
- Criar um modo de teste para agendar post em horário futuro controlado.

## Ultimos deploys relevantes

- `papiro-tools` production atual apos Buffer: `https://papiro-tools.vercel.app`
- Deploy Buffer/profile final: `dpl_BK5vFugE18usDacayG1jXkGSoFg7`
- Deploy visual do bloco Buffer dentro do card: `dpl_EwKJapKhrhaAptkzXSG6yM3ZEEMg`
- Site isca separado: `https://papiro-relogio-isca.vercel.app`

## Canva Pro

Canva Pro ajuda muito no processo manual e templates, mas a automação oficial de Autofill/Connect pode exigir permissões, app aprovado ou plano Enterprise dependendo do recurso. Por isso o retaguarda foi implementado honestamente como briefing operacional primeiro, não como promessa de criar designs automaticamente.

## Fontes consultadas

- Buffer posts/scheduling: `https://developers.buffer.com/guides/posts-and-scheduling.html`
- Buffer channel examples: `https://developers.buffer.com/examples/get-channel.html`
- Canva Autofill: `https://www.canva.dev/docs/connect/autofill-guide/`
- Web Audio API MDN: `https://developer.mozilla.org/docs/Web/API/Web_Audio_API`
- OscillatorNode MDN: `https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode`
- Vercel CLI docs: `https://vercel.com/docs/cli`
- Vercel deployment methods: `https://vercel.com/docs/deployments/deployment-methods`

## Pedido atual do usuário

O usuário não pode configurar credenciais agora. Ele pediu:

- Documentar tudo para outro chat seguir depois.
- Montar um projeto de site separado, tipo "site isca", com anúncio do Papiro Tools.
- Não tirar nada do projeto principal.
- Site bem básico, endereço próprio, sem vínculo com o app principal.
- Conteúdo: relógio com player e anúncio para o Papiro.

Decisão tomada:

- Criar projeto separado fora de `study-os`, em `c:\dev\papiro-relogio-isca`.
- Site estático puro, sem build e sem backend.
- Player usa Web Audio API gerada no navegador, sem arquivo de música externo e sem risco de copyright.
- CTA aponta para `https://papiro-tools.vercel.app`.

## Site isca criado

Projeto local separado: `c:\dev\papiro-relogio-isca`

Projeto Vercel separado:

- Nome: `papiro-relogio-isca`
- Produção: `https://papiro-relogio-isca.vercel.app`
- Deployment verificado: `dpl_FBUTz5AUiAG9u4PURdacq37QCVBx`
- Status: `Ready`

Arquivos do site:

- `index.html`
- `styles.css`
- `app.js`
- `vercel.json`
- `README.md`

Validações feitas:

- `node --check app.js`
- `curl -I https://papiro-relogio-isca.vercel.app` retornou `200`
- HTML publicado contém `Relógio`, `Papiro Tools` e CTA `Abrir Papiro Tools`

Observação: o deploy do site isca criou `.vercel` e atualizou `.gitignore` dentro de `c:\dev\papiro-relogio-isca`, não dentro do projeto principal.
