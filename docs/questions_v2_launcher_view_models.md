# STUDY OS - QUESTIONS V2 - LAUNCHER VIEW MODELS

Documento interno.
Atualizado em 2026-03-28.

---

## Objetivo

Tirar da UI legacy a leitura direta de estado e os resumos de launcher mais usados, preparando a interface para consumir o `v2` sem redesign brusco.

---

## Entrega desta rodada

Novo modulo criado:

- `questions/app/application/launcherViewModels.mjs`

Views cobertas nesta etapa:

- `home`
- `smart_start`
- `smart_subjects`
- `smart`

O modulo passa a concentrar:

- status do banco e notices do launcher
- contagens de runs e blocos salvos
- opcoes e contagem do fluxo inteligente
- resumo do preview final do treino inteligente

---

## Como ficou no runtime atual

`questions.js` agora carrega `launcherViewModels` por import dinamico.

`questions.ui.js` passou a consumir esses modelos primeiro e manter fallback inline se a camada nova falhar.

Isso preserva:

- o HTML atual
- os ids de bind
- o comportamento visual atual

---

## Ganho estrutural

Este passo empurra a Fase 6 sem fazer redesign.

Impacto direto:

- menos regra de leitura espalhada na UI legacy
- menos acoplamento imediato entre renderizacao e stores globais
- caminho mais claro para trocar a interface depois sem reescrever seletores de estado

---

## O que ainda sobra

- levar mais views do launcher para o mesmo padrao
- reduzir chamadas diretas da UI para `QuestionsService`
- continuar transformando `questions.js` em casca de orquestracao
