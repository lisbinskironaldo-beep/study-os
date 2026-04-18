# ROTANOTA - QUESTIONS V2 - CONTEXT SYNCHRONIZATION

Documento interno.
Atualizado em 2026-03-27.

---

## Objetivo

Tirar a normalizacao de contexto e a reconstituicao leve de listas de questoes do corpo principal de `questions.js`, sem cortar o fallback legado durante a migracao.

---

## Entrega desta rodada

Novo modulo criado:

- `questions/app/application/contextSynchronization.mjs`

Responsabilidades movidas para a camada nova:

- sincronizar `serie`, `materia`, `topicos`, `focoPrincipal`, `pesos`, `quantidadeQuestoes` e `estrategiaMistura`
- priorizar materias e topicos prontos ao normalizar o contexto
- reconstituir listas de questoes por `questionIds` usando o repositrio de conteudo
- manter fallback para `sessionSnapshot` quando os ids ainda nao forem suficientes

---

## Como ficou no runtime atual

`questions.js` agora:

- carrega `contextSynchronization` por import dinamico
- delega `syncContext()`
- delega `resolveQuestionList()`
- preserva a implementacao antiga se a camada nova falhar

---

## Ganho estrutural

Este passo reduz um dos maiores blocos de regra ainda presos na pagina global.

Impacto direto:

- menos regra de consistencia espalhada no runtime legado
- melhor base para a UI nova consumir contratos do `v2`
- menor risco de duplicar normalizacao em varios pontos diferentes

---

## O que ainda sobra neste eixo

- mover mais montagem de fluxo por view para a camada de aplicacao
- reduzir mais leituras diretas de globais dentro de `questions.js`
- continuar diminuindo a dependencia de objetos completos de questao em trilhas novas
