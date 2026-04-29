# Questions - Handoff operacional de continuidade

Data: 2026-04-28

Objetivo deste arquivo:

- permitir continuidade em outro computador sem reabrir investigacao
- registrar o estado validado no browser local
- fixar a ordem exata dos proximos passos

---

## 1. Estado que deve ser assumido

O modulo `Questions` foi validado localmente com o browser agent em `tools/browser-agent/`.

Frentes fechadas nesta rodada:

- mini player recolhido ao entrar em `Questions` e restaurado ao sair
- home de `Questions` mais seca, com `Rapido` absorvendo continuidade
- revisao por materia no fluxo `Inteligente`
- atalho `Ir direto para as questoes`
- etapa final com `quantidade` + `tempo`
- regra explicita de `primeiro limite atingido`
- acao `Guardar e comecar` corrigida para realmente salvar o bloco antes de abrir a sessao

Arquivos centrais desta rodada:

- `ambient/ambientState.js`
- `ambient/ambientUI.js`
- `js/app.js`
- `questions/questions.ui.js`
- `questions/questions.css`
- `questions/questions.js`
- `questions/questions.service.js`
- `questions/app/application/sessionEngine.mjs`
- `docs/questions_status_checklist.md`
- `docs/questions_intelligent_flow_plan.md`

Itens auxiliares versionados nesta frente:

- `tools/browser-agent/`
- `restore-points/20260428-150805-before-next-pass/`
- `restore-points/20260428-162403-before-web-publish/`
- `.codex-artifacts/visual-audit/...`

Observacao:

- `.codex-artifacts/dev-server/vercel-dev.err.log` continua sujo localmente como log de ambiente

---

## 2. O que foi validado de verdade no browser

Validacao feita com Playwright usando o pacote local em:

- `tools/browser-agent/node_modules/playwright`

Servidor local usado na rodada:

- `http://127.0.0.1:4173/index.html`

Fluxos validados:

1. entrada em `Questions`
2. home principal
3. `Rapido`
4. `Inteligente` completo ate a sessao
5. `Guardar e comecar`

Resultado observado:

- `Rapido` exibe `Retomar treino`, `Guardados`, `Pontos fracos` e `Busca direta por assunto`
- a revisao por materia mostra `Excluir materia`
- o atalho `Ir direto para as questoes` segue presente na revisao
- a etapa final mostra `Quantidade de questoes` e `Tempo disponivel` ao mesmo tempo
- a mensagem `A sessao fecha no primeiro limite atingido.` aparece corretamente
- ao escolher `15 questoes` + `30 min`, o preview mostra `Primeiro limite: 15 questoes ou 30 min`
- `Comecar agora` abre sessao com metadados coerentes
- `Guardar e comecar` agora salva bloco e depois inicia a sessao

Correcao importante encontrada nesta validacao:

- antes do ajuste final, `Guardar e comecar` abria a sessao mas podia nao persistir o bloco
- causa: o snapshot do bloco era montado antes de garantir carga do catalogo da rota
- correcao aplicada: `saveSmartPresetAndStart()` agora chama `ensureRouteCatalogLoaded(preview.patch)` antes de gerar o bloco e aborta a acao se o salvamento falhar

---

## 3. Evidencias geradas

Screenshots de apoio:

- `.codex-artifacts/visual-audit/questions-mini-hidden-check.png`
- `.codex-artifacts/visual-audit/questions-home-quick-absorbed.png`
- `.codex-artifacts/visual-audit/questions-quick-absorbed.png`
- `.codex-artifacts/visual-audit/questions-smart-subjects-compact.png`
- `.codex-artifacts/visual-audit/questions-smart-review-excluir-materia.png`
- `.codex-artifacts/visual-audit/questions-smart-final-dual-limit.png`
- `.codex-artifacts/visual-audit/questions-browser-check-home.png`
- `.codex-artifacts/visual-audit/questions-browser-check-quick.png`
- `.codex-artifacts/visual-audit/questions-browser-check-smart-final.png`
- `.codex-artifacts/visual-audit/questions-browser-check-smart-session.png`

Leituras confirmadas no browser agent:

- `trainingModeLabel: "Primeiro limite"`
- `trainingValueLabel: "15 questoes ou 30 min"`
- `smartTimeLimitMinutes: 30`
- bloco salvo criado com `mode: "smart"` apos `Guardar e comecar`

---

## 4. O que NAO deve ser refeito

Nao reabrir estas investigacoes:

- home com 3 botoes principais
- `Busca direta por assunto` dentro de `Rapido`
- revisao por materia em vez de lista gigante
- atalho `Ir direto para as questoes`
- etapa final com `Quantidade` e `Tempo`
- regra do `primeiro limite`
- `Guardar e comecar`
- mini player fechado ao abrir `Questions`

Esses pontos ja existem no produto local e ja foram validados.

---

## 5. Trilha exata a seguir

Seguir nesta ordem.

### Passo 1 - Consulta detalhada de bloco salvo

Meta:

- fechar o ciclo de `Guardados`

Status:

- executado nesta continuidade: `Consultar` agora abre uma tela dedicada de detalhe do bloco salvo antes de refazer

Fazer:

1. criar a tela dedicada de consulta do bloco salvo
2. mostrar resumo da rota, materias, assuntos e contagem
3. manter `Refazer`, `Renomear`, `Duplicar` e `Apagar` sem perder contexto

Aceite:

- o usuario entra em `Guardados`
- entende o que ha dentro do bloco antes de reabrir
- consegue decidir sem cair direto numa sessao

### Passo 2 - Limpar a tela da sessao

Meta:

- deixar a sessao menos tecnica e mais legivel

Status:

- executado nesta continuidade: a sessao agora usa uma barra compacta de foco, deixa detalhes da rota recolhidos e reforca o player ambiente oculto ao iniciar/retomar sessao

Fazer:

1. reduzir ruido visual do topo
2. checar se o mini player e o trilho inferior nao competem com a sessao
3. revisar o mini player fechado por padrao tambem no fluxo de sessao, nao so na entrada

Aceite:

- a sessao parece uma tela de uso continuo e nao um painel carregado

### Passo 3 - Progresso como hub proprio

Meta:

- separar melhor `Progresso` do fluxo de treino

Status:

- executado nesta continuidade: `progress` agora renderiza o hub proprio, `specific` volta para a montagem controlada e a home mostra `Ver progresso` como acao secundaria

Fazer:

1. revisar a entrada de estatisticas sem competir com a home principal
2. confirmar o login gate e a navegacao para o painel completo

### Passo 4 - So depois disso pensar em motor adaptativo

Meta:

- nao misturar arquitetura nova com polimento inacabado
- evitar que adaptacao vire punicao por acerto

Fazer depois:

1. validar o motor adaptativo com historico real no browser
2. definir guardrails de experiencia para nao desanimar o usuario
3. expor explicabilidade curta durante a sessao
4. sugestoes automaticas a partir de historico

Regra de produto:

- o motor nao deve simplesmente aumentar a dificuldade quando o usuario acerta
- acerto recente primeiro libera consolidacao e variedade, nao obrigatoriamente questao mais dificil
- subida de dificuldade so acontece com evidencia minima: sequencia de acertos, boa acuracia e sem erro recente no mesmo topico
- erro recente deve puxar uma questao mais acessivel ou uma revisao curta, sem fazer o usuario sentir que regrediu
- toda sessao deve manter mistura saudavel: algumas questoes de confianca, algumas de consolidacao e poucas de desafio
- se o usuario errar duas vezes seguidas no mesmo topico, o proximo contato deve reduzir pressao e explicar que e reforco, nao castigo

Regra:

- nao iniciar esse passo antes de os tres passos anteriores estarem estaveis

---

## 6. Como retomar em outro computador

Sequencia minima:

1. `git pull origin main`
2. ler este arquivo
3. ler `docs/questions_status_checklist.md`
4. ler `docs/questions_intelligent_flow_plan.md`
5. rodar `git status --short`
6. subir servidor local na raiz do repo
7. validar os fluxos abaixo com o browser agent

Comandos uteis:

```powershell
cd C:\dev\study-os\tools\browser-agent
node doctor.cjs
```

Se quiser snapshot rapido:

```powershell
cd C:\dev\study-os\tools\browser-agent
npm run snapshot -- http://127.0.0.1:4173
```

Fluxos minimos para confirmar antes de mexer:

1. home do `Questions`
2. `Rapido`
3. `Inteligente` completo
4. `Guardar e comecar`
5. `Guardados`

---

## 7. Regra operacional para a proxima conversa

Antes de mexer em algo novo:

1. validar o ultimo comportamento fechado no browser
2. confirmar que `Guardar e comecar` ainda cria bloco salvo
3. so depois abrir a frente de `Guardados`

Ordem oficial a partir daqui:

`guardados detalhados -> limpeza da sessao -> progresso como hub -> motor adaptativo`

Estado desta continuidade:

- `guardados detalhados`: executado e validado
- `limpeza da sessao`: executado e validado
- `progresso como hub`: executado e validado
- `motor adaptativo`: primeira fatia executada e validada no browser com historico realista; o perfil agora guarda `lastCorrect`, `lastErrorAt`, `consecutiveHits` e `consecutiveErrors`
- guardrail implementado: a sessao nao vira escada infinita de dificuldade; ela preserva mistura de confianca, consolidacao e desafio
- explicabilidade curta implementada na sessao com frases sem tom punitivo
- proxima frente liberada: testar com uso real prolongado e ajustar os limiares do motor se a cadencia parecer facil ou pesada demais
