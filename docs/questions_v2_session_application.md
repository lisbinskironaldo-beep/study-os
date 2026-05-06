# PAPIRO_TOOLS - QUESTIONS V2 - CAMADA DE APLICACAO DE SESSAO

Documento interno de aplicacao.
Nao deve aparecer na interface do produto.

Atualizado em 2026-03-27.

---

## 1. Objetivo

Registrar a extracao inicial da logica de sessao para uma camada de aplicacao do `questions v2`.

Referencia em codigo:

- `questions/app/application/sessionUseCases.mjs`
- `questions/app/application/sessionPlanner.mjs`
- `questions/app/application/sessionEngine.mjs`

---

## 2. Casos de uso extraidos nesta etapa

Ja existem na camada nova:

- `createRunFromSession`
- `persistActiveRun`
- `startSession`
- `pauseSession`
- `resumeRun`
- `restartRun`
- `continueSession`
- `buildSmartRoutePreview`
- `startSmartSession`
- `startFollowUp`

Tambem passou a existir uma engine dedicada para selecao:

- validacao de rota
- plano de sessao
- preview inteligente
- follow-up de sessao

Tambem passou a existir a ponte inicial de sessao por ids:

- reconstituicao de run por `questionIds`
- fallback para `sessionSnapshot` apenas quando a reconstituicao por ids falhar
- repositorio de conteudo indexado em memoria para o catalogo carregado
- compactacao de `sessionSnapshot` em runs novas quando `questionIds` ja existem
- compactacao equivalente nos blocos salvos novos

---

## 3. Regra de seguranca adotada

Esta migracao foi feita com fallback.

Regra:

```txt
questions.js delega para a camada nova
se a camada nova falhar, o fluxo legado continua existindo
```

Motivo:

- reduzir risco de quebrar o projeto inteiro durante a transicao
- permitir validacao incremental
- manter o produto funcionando enquanto a arquitetura nova amadurece

---

## 4. O que ja saiu de `questions.js`

Na pratica, `questions.js` agora passou a funcionar mais como casca de orquestracao para a sessao.

Ja foram extraidos:

- abertura e retomada de run
- persistencia de run ativa
- conclusao de sessao
- inicio de sessao com validacao
- selecao inteligente de rota
- follow-up de sessao
- ranking inicial de grupos elegiveis
- reconstituicao de lista de questoes por ids
- reducao do snapshot persistido em runs e blocos novos

---

## 5. O que ainda nao terminou

Ainda falta para a Fase 4 ficar madura:

- mover mais validacoes para a camada de aplicacao
- desacoplar completamente a sessao da store/global antiga
- reduzir o snapshot legado para compatibilidade temporaria e nao mais como fonte principal

Observacao:

Mesmo com a engine nova, esta etapa ainda preserva o algoritmo legado de selecao por baixo para reduzir risco. O ganho aqui e estrutural: a UI deixou de carregar essa regra diretamente em `questions.js`.

Mesmo apos a compactacao, o legado continua conseguindo retomar e reiniciar porque `questions.js` passou a reconstruir a lista por ids antes de depender do snapshot completo.

---

## 6. Proximo passo recomendado

Depois desta etapa, a proxima movimentacao segura e:

1. estabilizar a camada de aplicacao de sessao
2. mover a selecao de perguntas para um contrato mais formal
3. reduzir o uso de snapshots completos dentro das runs
