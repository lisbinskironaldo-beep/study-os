# ROTANOTA - QUESTIONS V2 - SCHEMA INICIAL DE INDEXEDDB

Documento interno de persistencia.
Nao deve aparecer na interface do produto.

Atualizado em 2026-03-27.

---

## 1. Objetivo

Registrar o primeiro schema proposto de `IndexedDB` para o `questions v2`.

Referencia em codigo:

- `questions/app/infrastructure/storage/indexedDbSchema.mjs`

---

## 2. Banco proposto

Nome:

- `study_os_questions_v2`

Versao inicial:

- `1`

---

## 3. Object stores propostos

### `runs`

Responsabilidade:
- runs em andamento e concluidas

Chave:
- `id`

Indices:
- `status`
- `mode`
- `updatedAt`
- `completedAt`

### `profileState`

Responsabilidade:
- ponte de migracao para o bloco hoje guardado em `questions_profile_v3`

Chave:
- `scope`

Indice:
- `updatedAt`

### `topicStats`

Responsabilidade:
- desempenho por topico

Chave:
- `key`

Indices:
- `baseKey`
- `subjectKey`
- `topicKey`
- `lastSeen`

### `sessions`

Responsabilidade:
- sessoes resumidas

Chave:
- `id`

Indices:
- `baseKey`
- `subjectKey`
- `createdAt`

### `smartProfiles`

Responsabilidade:
- perfis inteligentes

Chave:
- `id`

Indices:
- `updatedAt`
- `lastUsedAt`

### `savedBlocks`

Responsabilidade:
- blocos guardados

Chave:
- `id`

Indices:
- `updatedAt`
- `lastUsedAt`
- `mode`

---

## 4. Decisao importante

O store `profileState` existe como ponte de migracao.
Ele nao precisa ser permanente se a normalizacao em stores separados ficar madura.

Regra:

```txt
primeiro migrar sem perder dados
depois separar melhor
```

---

## 5. Estado desta etapa

- [x] schema inicial definido
- [x] stores principais identificados
- [x] indices iniciais registrados
- [x] helper de abertura de `IndexedDB`
- [ ] migracao real de dados para `IndexedDB`

Observacao de andamento:

- `profileState` ja conta com repositorio em `IndexedDB`
- `runs` ja contam com repositorio em `IndexedDB`
- `smartProfiles` ja contam com repositorio em `IndexedDB`
- `savedBlocks` ja contam com repositorio em `IndexedDB`
- o bootstrap atual prefere `IndexedDB` para `runs`
- o bootstrap atual tambem prefere `IndexedDB` para `smartProfiles` e `savedBlocks`
- o bootstrap atual tambem prefere `IndexedDB` para `profileState`
- quando o banco novo estiver vazio, o bootstrap importa os dados legados de `localStorage`
- se `IndexedDB` falhar ou nao existir, o fallback continua em `localStorage`
- durante a transicao, as writes de `runs` tambem espelham no legado para manter o fallback atualizado
- durante a transicao, as writes de `profileState`, `smartProfiles` e `savedBlocks` tambem espelham no legado para manter o fallback atualizado
