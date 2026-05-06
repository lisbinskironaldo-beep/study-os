# PAPIRO_TOOLS - QUESTIONS V2 - CAMADA DE APLICACAO DE PERFIS E GUARDADOS

Documento interno de aplicacao.
Nao deve aparecer na interface do produto.

Atualizado em 2026-03-27.

---

## 1. Objetivo

Registrar a extracao inicial dos fluxos de `smartProfiles` e `savedBlocks` para a camada de aplicacao do `questions v2`.

Referencia em codigo:

- `questions/app/application/libraryUseCases.mjs`

---

## 2. Casos de uso extraidos nesta etapa

Ja existem na camada nova:

- `saveCurrentSmartProfile`
- `applySmartProfile`
- `renameSmartProfile`
- `duplicateSmartProfile`
- `deleteSmartProfile`
- `saveBlockSnapshot`
- `saveCurrentSpecificBlock`
- `saveCurrentSmartBlock`
- `openSavedBlock`
- `startSavedBlock`
- `renameSavedBlock`
- `duplicateSavedBlock`
- `deleteSavedBlock`

---

## 3. Regra de seguranca adotada

Esta migracao tambem foi feita com fallback.

Regra:

```txt
questions.js delega para a camada nova
se a camada nova falhar, o fluxo legado continua existindo
```

Motivo:

- reduzir risco de quebrar perfis e guardados durante a transicao
- permitir migracao incremental sem refazer a UI inteira
- manter o produto usavel enquanto o v2 assume mais responsabilidades

---

## 4. O que saiu de `questions.js`

Ja foram deslocados para a camada nova:

- salvar perfil inteligente
- aplicar perfil inteligente
- renomear, duplicar e apagar perfil inteligente
- salvar bloco especifico
- salvar bloco inteligente
- abrir bloco salvo
- iniciar bloco salvo
- renomear, duplicar e apagar bloco salvo

---

## 5. O que ainda nao terminou

Ainda falta para essa frente ficar madura:

- tirar mais regras de launcher de dentro de `questions.js`
- reduzir o numero de metodos de orquestracao ainda presos na pagina global
- conectar a UI futura direto a esses casos de uso, sem depender da casca legacy
- validar o fluxo completo de perfis e guardados no navegador

---

## 6. Proximo passo recomendado

Depois desta etapa, a proxima movimentacao segura e:

1. continuar esvaziando `questions.js` como ponto de regra
2. comecar a mover a tela de launcher para consumir a camada nova
3. preparar a migracao visual da Fase 6 sem cortar o fallback cedo demais
