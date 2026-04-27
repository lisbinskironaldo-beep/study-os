# RotaNota Ops Runbook

## Regra fixa para fechamento de tarefa

- toda mudanca em UI, navegacao, estados visuais ou fluxo do `premium-study` deve terminar com validacao no browser local
- a validacao minima inclui abrir a rota afetada, exercitar a interacao principal e verificar ausencia de erro bloqueante
- quando a mudanca for relevante para produto, salvar screenshot em `.codex-artifacts/visual-audit/`
- nao marcar tarefa como concluida apenas com diff aprovado ou `node --check`

## Thresholds congelados
- aviso: `500/dia`
- critico: `600/dia`
- pausa automatica da free lane: `650/dia`

## Quando bater 500 no dia
- confirmar se o volume veio de crescimento real ou pico anomalo
- abrir `/ops` e revisar `Growth` + `Alertas`
- verificar taxa de erro do copiloto e do bundle gratis
- preparar mensagem operacional caso o ritmo siga subindo

## Quando bater 600 no dia
- tratar como estado critico
- revisar cota do Gemini, retry rate e fila
- avaliar se a free lane deve continuar aberta ate `650`
- monitorar paywall e premium para garantir que o crescimento nao degrade a conversao

## Quando bater 650 no dia
- `freeLanePaused = true` automaticamente
- manter `premiumLanePaused = false`, salvo problema na lane paga
- comunicar no produto que a experiencia gratis esta temporariamente pausada
- revisar crescimento, abuso e necessidade de ampliar cota ou migrar de tier

## Se o Gemini retornar limite ou indisponibilidade
- registrar alerta em `premium_study_ops_alerts`
- executar `recheck_provider_status`
- manter cache antigo acessivel
- pausar novas geracoes apenas na lane afetada

## Se webhook falhar
- verificar evento em `Alertas`
- conferir `paymentId` em `Financeiro`
- rodar `resync_payment`
- validar se `premium_entitlements` foi atualizado

## Se o premium precisar ser pausado
- usar `pause_premium_lane`
- manter conteudo ja cacheado acessivel
- bloquear apenas novas geracoes
- acompanhar tickets de pagamento e alertas do provider

## Para retomar uma lane
- checar provider, fila e budget
- confirmar que os alertas criticos foram entendidos
- usar `resume_free_lane` ou `resume_premium_lane`
- registrar a retomada com motivo operacional

## Incidente: producao servindo build intermediario da ops

### Sintoma

Na producao, o `/ops` pode mostrar `Falha na requisicao` antes mesmo do login.

### O que isso significa

Em 2026-04-20, esse sintoma nao indicava:

- senha errada
- Gemini fora do ar

Ele indicava que a producao estava servindo uma versao intermediaria do frontend/API da retaguarda.

### Checagens obrigatorias

Validar no alias oficial `https://rota-nota.vercel.app`:

1. `POST /api/ops/login`
2. `GET /api/ops/overview`
3. `GET /api/ops/growth/overview`
4. `GET /api/ops/reports/weekly`
5. `GET /ops/app.js`

Interpretacao:

- se `login` e `overview` responderem
- e `growth/overview` mais `reports/weekly` responderem `404`

entao a producao ainda esta no build intermediario.

### Correcao esperada

Publicar o build correto com rewrite corrigido:

```powershell
vercel deploy --prebuilt --prod
```

### Arquivos que definem o estado correto

- `api/ops-router.js`
- `vercel.json`
- `api/_lib/ops-auth.js`
- `ops/app.js`

### Confirmacao de recuperacao

Depois do deploy:

- `GET /api/ops/growth/overview` deve sair de `404`
- `GET /api/ops/reports/weekly` deve sair de `404`
- `GET /ops/app.js` deve conter a mensagem `Use a senha da retaguarda para liberar a operacao.`
- a tela `/ops` nao deve mais abrir com erro vermelho antes da autenticacao

### Status do incidente

Incidente resolvido em 2026-04-20 apos deploy corretivo em producao.
