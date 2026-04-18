# ROTANOTA - QUESTIONS V2 - AUDITORIA DE STORAGE

Documento interno de persistencia.
Nao deve aparecer na interface do produto.

Atualizado em 2026-03-27.

---

## 1. Objetivo

Mapear o que hoje o modulo `questions` grava em `localStorage` e decidir o destino de cada chave no `questions v2`.

Regra:

```txt
localStorage fica para preferencia leve
persistencia estrutural vai para camada propria
```

---

## 2. Chaves atuais mapeadas

### `questions_context_v3`

Origem:
- `questions/questions.context.js`

Conteudo atual:
- contexto de launcher
- filtros
- selecao de series
- selecao de materias
- estado de recorte

Destino recomendado:
- manter parcialmente em `localStorage`

Regra:
- o que for preferencia de launcher pode ficar leve
- o que for estado temporario de sessao nao deve crescer aqui

### `questions_profile_v3`

Origem:
- `questions/questions.store.js`

Conteudo atual:
- stats por topico
- sessoes recentes
- perfis inteligentes
- blocos salvos

Destino recomendado:
- migrar para persistencia estrutural

Motivo:
- guarda dados pedagogicos e historico
- tende a crescer com o uso

### `questions_runs_v1`

Origem:
- `questions/questions.store.js`

Conteudo atual:
- runs em andamento
- runs concluidas
- snapshots de sessao
- respostas

Destino recomendado:
- migrar primeiro

Motivo:
- e a parte mais pesada
- e a mais sensivel a travamento

### `questions_ui_coach_v1`

Origem:
- `questions/questions.js`

Conteudo atual:
- contagem e exibicao de dicas visuais do coach

Destino recomendado:
- manter em `localStorage`

Motivo:
- dado pequeno
- preferencia de UX
- sem impacto estrutural

---

## 3. Classificacao oficial

Pode continuar em `localStorage`:

- `questions_ui_coach_v1`
- parte leve de `questions_context_v3`

Deve sair de `localStorage`:

- `questions_profile_v3`
- `questions_runs_v1`

---

## 4. Prioridade de migracao

Ordem recomendada:

1. `questions_runs_v1`
2. `questions_profile_v3`
3. reducao controlada de `questions_context_v3`

---

## 5. Entregas ja iniciadas

- [x] chaves atuais mapeadas
- [x] classificacao inicial definida
- [x] chave de `runs` centralizada em `questions/app/infrastructure/storage/storageKeys.mjs`
- [x] repositorio inicial de `runs` criado
- [x] repositorio inicial de `profile state` criado
- [x] ponte inicial para `smartProfiles` e `savedBlocks` criada
- [x] schema inicial de `IndexedDB` documentado

---

## 6. Proximo passo operacional

Criar a ponte do runtime atual para o repositorio de `runs`, de forma que o legado deixe de escrever diretamente no ponto mais pesado sem quebrar a interface atual.

---

## 7. Atualizacao desta rodada

- runs novas ja priorizam `questionIds` como fonte de retomada
- blocos salvos novos seguem a mesma direcao
- `sessionSnapshot` fica preservado apenas como compatibilidade quando nao houver ids suficientes
- o runtime legado agora tenta reconstruir listas por ids antes de depender do snapshot completo
- `runs` agora tambem preferem repositorio em `IndexedDB`
- quando o store novo estiver vazio, a base atual de `runs` e importada do `localStorage`
- durante a transicao, as writes de `runs` tambem espelham no storage legado para manter o fallback atualizado
- `topics` e `sessions` agora tambem podem sair do bloco monolitico e seguir para `profileState` em `IndexedDB`
- `smartProfiles` agora tambem podem sair do bloco monolitico e seguir para store proprio em `IndexedDB`
- `savedBlocks` agora tambem podem sair do bloco monolitico e seguir para store proprio em `IndexedDB`
- a store atual ja foi ligada para carregar e salvar esses dois conjuntos pelos repositorios dedicados
- o bootstrap atual ja prefere o repositorio de `profileState` em `IndexedDB` quando ele estiver disponivel
