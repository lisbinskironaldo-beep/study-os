# ROTANOTA - QUESTIONS V2 - CAMADA DE APLICACAO DE ROTA E LAUNCHER

Documento interno de aplicacao.
Nao deve aparecer na interface do produto.

Atualizado em 2026-03-27.

---

## 1. Objetivo

Registrar a extracao inicial das mutacoes de rota e dos fluxos principais do launcher para a camada de aplicacao do `questions v2`.

Referencia em codigo:

- `questions/app/application/routeUseCases.mjs`

---

## 2. Casos de uso extraidos nesta etapa

Ja existem na camada nova:

- `queueExternalRoute`
- `applyExternalRoute`
- `updateContext`
- `setBase`
- `toggleTopic`
- `setFocusPrincipal`
- `selectAllTopics`
- `clearTopics`
- `setSmartConfig`
- `setSmartGoal`
- `toggleSmartSeriesExclusion`
- `toggleSmartBaseExclusion`
- `toggleSmartSubjectExclusion`
- `toggleSmartStartOption`
- `selectAllSmartStartOptions`
- `continueSmartStart`
- `toggleSmartSubjectOption`
- `selectAllSmartSubjectOptions`
- `continueSmartSubjects`
- `clearSmartExclusions`

---

## 3. Regra de seguranca adotada

Esta migracao tambem foi feita com fallback.

Regra:

```txt
questions.js delega para a camada nova
se a camada nova falhar, o fluxo legado continua existindo
```

Motivo:

- reduzir risco de quebrar a navegacao atual
- diminuir a concentracao de regra em `questions.js`
- preparar a Fase 6 sem exigir troca completa de UI na mesma rodada

---

## 4. O que saiu de `questions.js`

Ja foram deslocados para a camada nova:

- aplicacao de rota externa
- mutacao de contexto da rota
- selecao e limpeza de topicos
- configuracao do launcher inteligente
- avancos `smart_start` e `smart_subjects`
- toggles de series, materias e bases do fluxo inteligente

---

## 5. O que ainda nao terminou

Ainda falta para essa frente ficar madura:

- tirar mais seletores e resumos de launcher de dentro de `questions.js`
- reduzir a dependencia direta de globais na leitura da UI
- ligar a interface futura diretamente a esses casos de uso
- validar o fluxo completo no navegador com a camada nova carregada

---

## 6. Proximo passo recomendado

Depois desta etapa, a proxima movimentacao segura e:

1. continuar esvaziando `questions.js` como ponto de regra
2. mover a montagem de launcher para consumir contratos do v2
3. iniciar a migracao visual da Fase 6 por partes pequenas e verificaveis
