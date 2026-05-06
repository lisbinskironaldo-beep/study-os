# PAPIRO_TOOLS - QUESTIONS V2 - SELETORES E FORMATADORES DO LAUNCHER

Documento interno de aplicacao.
Nao deve aparecer na interface do produto.

Atualizado em 2026-03-27.

---

## 1. Objetivo

Registrar a extracao inicial dos seletores e formatadores do launcher para fora de `questions.js`.

Referencia em codigo:

- `questions/app/application/launcherSelectors.mjs`

---

## 2. O que passou para a camada nova

Ja existem na camada nova:

- `getSmartStartOptions`
- `getSelectedSmartSeries`
- `getSmartSubjectOptions`
- `buildSmartProfilePayload`
- `getSuggestedSmartProfileName`
- `buildSavedBlockName`
- `buildRunTitle`

---

## 3. Regra de seguranca adotada

Esta migracao tambem foi feita com fallback.

Regra:

```txt
questions.js continua expondo os metodos
mas tenta resolver pela camada nova primeiro
```

Motivo:

- diminuir a concentracao de leitura e resumo na pagina global
- manter a UI atual funcionando sem troca brusca
- preparar a futura ligacao da interface aos contratos do `v2`

---

## 4. Impacto desta etapa

Com esta extracao:

- a leitura do launcher inteligente fica menos acoplada a `questions.js`
- nomes de runs e blocos deixam de nascer apenas dentro da pagina global
- o mesmo conjunto de seletores fica mais reaproveitavel para a Fase 6

---

## 5. Proximo passo recomendado

Depois desta etapa, a proxima movimentacao segura e:

1. continuar tirando seletores e resumos de `questions.js`
2. fazer a UI ler mais dados pelos contratos do `v2`
3. reduzir ainda mais a necessidade de a pagina global conhecer detalhe de launcher
