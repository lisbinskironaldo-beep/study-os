# Questions - Handoff operacional de continuidade

Data: 2026-04-28

Objetivo deste arquivo:

- permitir que outro chat continue sem reabrir investigacao
- registrar o estado local real desta rodada
- fixar a ordem exata da trilha seguinte

---

## 1. Estado atual que deve ser assumido

O trabalho mais recente desta frente esta local no workspace e ainda nao foi enviado para a web nem para o GitHub.

Arquivos modificados nesta rodada:

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

Itens auxiliares locais:

- `tools/browser-agent/`
- `restore-points/20260428-150805-before-next-pass/`
- `.codex-artifacts/visual-audit/...`

Observacao:

- `.codex-artifacts/dev-server/vercel-dev.err.log` continua sujo localmente e deve ser tratado como log descartavel.

---

## 2. O que ja foi fechado de verdade nesta passada

### 2.1 Mini player no Questions

Fechado:

- ao entrar em `Questions` com a biblioteca do player aberta, o modulo agora recolhe o player para modo oculto
- durante `Questions`, ele nao deve reaparecer sozinho
- ao sair de `Questions`, o estado anterior do player pode voltar fora da sessao

Arquivos:

- `ambient/ambientState.js`
- `ambient/ambientUI.js`
- `js/app.js`

Validacao real no browser:

- abrir home
- abrir player
- abrir biblioteca
- entrar em `Questions`
- confirmar `ambientPanel` fechado e `ambientMini` oculto
- sair de `Questions`
- confirmar restauracao fora da sessao

Evidencia:

- `.codex-artifacts/visual-audit/questions-mini-hidden-check.png`

### 2.2 Home do Questions mais seca

Fechado:

- `Retomar treino` e `Guardados` sairam da home
- ambos continuam acessiveis dentro do fluxo `Rapido`
- `Rapido` virou o hub real de continuidade

Arquivos:

- `questions/questions.ui.js`
- `questions/questions.css`

Evidencias:

- `.codex-artifacts/visual-audit/questions-home-quick-absorbed.png`
- `.codex-artifacts/visual-audit/questions-quick-absorbed.png`

### 2.3 Etapa de materias mais direta

Fechado parcialmente:

- a etapa ganhou um resumo curto no topo
- menos texto corrido
- a revisao por materia continua em sequencia
- a acao `Excluir materia` foi exposta dentro da revisao da materia atual

Arquivos:

- `questions/questions.ui.js`
- `docs/questions_status_checklist.md`
- `docs/questions_intelligent_flow_plan.md`

Evidencias:

- `.codex-artifacts/visual-audit/questions-smart-subjects-compact.png`
- `.codex-artifacts/visual-audit/questions-smart-review-excluir-materia.png`

---

## 3. O que NAO deve ser refeito

Nao reabrir estas investigacoes:

- home com 3 botoes principais
- `Busca direta por assunto` dentro de `Rapido`
- etapa final com `Quantidade` e `Tempo`
- revisao por materia em vez de lista gigante
- `Guardar e comecar`
- mini player fechado ao abrir `Questions`

Esses pontos ja existem no produto local e ja foram validados.

---

## 4. Trilha exata a seguir

Seguir nesta ordem. Nao trocar a ordem sem motivo forte.

### Passo 1 - Fechar o wizard inteligente

Meta:

- concluir o que falta do fluxo principal sem abrir outro escopo

Fazer:

1. implementar o atalho `Ir direto para as questoes` no wizard inteligente
2. definir a regra do primeiro limite atingido quando houver `tempo` e `quantidade`
3. revisar se a transicao `materias -> revisao -> etapa final` ficou sem telas redundantes

Aceite:

- o usuario atravessa `series -> materias -> revisao -> limite -> sessao`
- o fluxo tem saida clara para `comecar agora`
- o fluxo tem saida clara para `guardar e comecar`

### Passo 2 - Consulta detalhada de bloco salvo

Meta:

- fechar o ciclo de `Guardados`

Fazer:

1. criar a tela dedicada de consulta do bloco salvo
2. mostrar resumo da rota, materias, assuntos e contagem
3. manter `Refazer`, `Renomear`, `Duplicar` e `Apagar` sem perder contexto

Aceite:

- o usuario entra em `Guardados`
- entende o que ha dentro do bloco antes de reabrir
- consegue decidir sem cair direto numa sessao

### Passo 3 - Limpar a tela da sessao

Meta:

- deixar a sessao menos tecnica e mais legivel

Fazer:

1. reduzir ruido visual do topo
2. checar se o mini player e o trilho inferior nao competem com a sessao
3. revisar o mini player fechado por padrao tambem no fluxo de sessao, nao so na entrada

Aceite:

- a sessao parece uma tela de uso continuo e nao um painel carregado

### Passo 4 - So depois disso pensar em motor adaptativo

Meta:

- nao misturar arquitetura nova com polimento inacabado

Fazer depois:

1. motor adaptativo por dificuldade
2. motor adaptativo por revisao
3. sugestoes automáticas a partir de historico

Regra:

- nao iniciar esse passo antes de os tres passos anteriores estarem estaveis

---

## 5. Como validar a proxima passada

Usar o browser local ja instalado em:

- `tools/browser-agent/`

Fluxos minimos a validar:

1. home do `Questions`
2. `Rapido`
3. `Inteligente` completo
4. `Guardados`
5. entrar e sair de `Questions` com player aberto antes

Se rodar script inline com Playwright, reutilizar:

- `./tools/browser-agent/node_modules/playwright`

---

## 6. O que ainda nao foi feito nesta rodada

- `commit`
- `push`
- deploy para producao desta passada

Entao o proximo chat deve assumir:

- a web ainda pode estar atrasada em relacao ao estado local
- antes de publicar, precisa validar o conjunto inteiro do `Questions`

---

## 7. Regra de seguranca para a proxima conversa

Antes de mexer em algo novo:

1. ler este arquivo
2. ler `docs/questions_status_checklist.md`
3. rodar `git status --short`
4. validar no browser o ultimo comportamento fechado

Se estiver tudo certo, seguir pela ordem:

`wizard inteligente -> guardados detalhados -> limpeza da sessao -> motor adaptativo`
