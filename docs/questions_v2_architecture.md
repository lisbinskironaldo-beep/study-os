# PAPIRO_TOOLS - QUESTIONS V2 - ARQUITETURA ALVO

Documento interno de arquitetura.
Nao deve aparecer na interface do produto.

Atualizado em 2026-03-27.

---

## 1. Principio central

O sistema precisa separar claramente:

- shell
- dominio
- conteudo
- persistencia
- processamento pesado

Regra:

```txt
UI leve
estado previsivel
conteudo sob demanda
persistencia adequada
processamento fora da thread principal quando necessario
```

---

## 2. Problema da arquitetura atual

Hoje o modulo mistura:

- boot do modulo
- montagem de UI
- carregamento do banco
- contexto do launcher
- estado da sessao
- persistencia local
- logica de selecao de questoes

Consequencias:

- qualquer crescimento do banco piora o boot
- falhas de cache ou estado contaminam o modulo inteiro
- manutencao exige entender muitos arquivos acoplados
- persistencia fica pesada e bloqueante

---

## 3. Alvo estrutural

### 3.1. Macro separacao

```txt
PAPIRO_TOOLS shell
  -> navega
  -> hospeda modulos
  -> publica eventos minimos

Questions domain
  -> controla fluxo de treino
  -> consulta indices e conteudo
  -> persiste progresso
  -> conversa com engine

Questions content
  -> manifesto
  -> indices
  -> arquivos de questao

Questions worker
  -> filtragem pesada
  -> selecao de sessao
  -> ranking
```

---

## 4. Estrutura de pastas recomendada

Estrutura alvo recomendada:

```txt
questions/
  app/
    bootstrap/
    application/
    domain/
    infrastructure/
    ui/
    workers/
  content/
    manifest/
    banks/
    generated/
  tests/
  scripts/
```

Detalhamento recomendado:

- `bootstrap/`
  - entrada do modulo
  - ciclo de vida
  - integracao com shell
- `application/`
  - casos de uso
  - iniciar sessao
  - retomar sessao
  - salvar bloco
  - aplicar rota
- `domain/`
  - entidades
  - regras de treino
  - contratos do engine
- `infrastructure/`
  - repositorios
  - persistencia
  - adaptadores de storage
  - carregadores de manifesto e conteudo
- `ui/`
  - launcher
  - sessao
  - feedback
  - guardados
- `workers/`
  - indexacao
  - filtragem
  - selecao
- `content/manifest/`
  - manifesto mestre
  - indices por serie, materia, topico
- `content/banks/`
  - conteudo de questoes
- `content/generated/`
  - artefatos gerados por script

---

## 5. Contratos obrigatorios

### 5.1. Contrato entre shell e questions

O shell nao deve conhecer detalhe interno de `questions`.
Ele so deve saber:

- montar o modulo
- desmontar o modulo
- enviar intents externas
- receber eventos resumidos

Eventos aceitos do shell para `questions`:

- abrir modulo
- aplicar rota externa
- sair do modulo

Eventos devolvidos por `questions`:

- sessao iniciada
- sessao pausada
- sessao concluida
- rota atualizada
- erro de carregamento

### 5.2. Contrato entre dominio e conteudo

O dominio nao deve depender da estrutura crua dos arquivos de banco.
Ele deve consumir repositorios padronizados.

Regra:

```txt
o dominio nao importa arquivos de banco diretamente
ele consulta um repositorio de conteudo
```

### 5.3. Contrato entre UI e engine

A UI nao decide selecao de questoes.
Ela pede uma sessao montada.

Regra:

```txt
UI monta intencao
application valida
engine seleciona
UI apenas executa
```

---

## 6. Estrategia de conteudo

### 6.1. Nao carregar tudo no boot

O navegador nao deve importar o banco completo no inicio.

Primeiro carrega:

- manifesto mestre
- indices leves
- contagens
- status de prontidao

So depois carrega:

- os topicos necessarios para a rota escolhida
- ou os ids necessarios para a sessao atual

### 6.2. Manifesto obrigatorio

O manifesto precisa responder sem abrir o arquivo completo da questao:

- quais series existem
- quais materias existem por serie
- quais topicos existem por materia
- quantas questoes prontas existem
- quais tags e metadados estao disponiveis
- onde o conteudo daquele topico esta

Campos minimos recomendados por topico no manifesto:

- `id`
- `base`
- `serie`
- `materia`
- `topico`
- `status`
- `questionCount`
- `readyQuestionCount`
- `path`
- `updatedAt`

### 6.3. Conteudo por unidade pequena

O arquivo fisico de questao deve continuar pequeno o suficiente para ser carregado sob demanda.

Unidade recomendada:

- por topico

Nao recomendado:

- um arquivo gigante por serie
- um unico indice com todas as questoes embutidas

---

## 7. Persistencia recomendada

### 7.1. `localStorage` fica leve

`localStorage` deve guardar apenas:

- preferencias de UI
- ultimo launcher view
- flags pequenas

### 7.2. `IndexedDB` vira storage principal

`IndexedDB` deve guardar:

- runs
- progresso resumido
- respostas
- blocos salvos
- perfis
- caches de manifesto

### 7.3. O que nao salvar mais

Evitar persistir repetidamente:

- objeto completo de questao em cada resposta
- snapshot inteiro da sessao sem necessidade
- duplicacao do mesmo conteudo em multiplas chaves

Salvar por referencia:

- `questionId`
- `topicId`
- `runId`
- `routeContext` resumido

---

## 8. Engine e performance

### 8.1. Selecao de sessao

O engine precisa aceitar:

- contexto do launcher
- filtros elegiveis
- historico resumido
- objetivo da sessao

E devolver:

- lista de `questionIds`
- justificativa resumida
- distribuicao por topico
- metadados de sessao

### 8.2. Worker

Quando filtro e ranking crescerem, eles devem rodar fora da thread principal.

Mover para worker:

- consulta de manifesto grande
- ranking de topicos
- montagem de sessao adaptativa
- analise de cobertura

Manter na thread principal:

- renderizacao
- interacao do usuario
- eventos simples de estado

---

## 9. Estado recomendado

Separacao minima:

- `ui state`
  - view aberta
  - drawer aberto
  - busca atual
- `route state`
  - serie
  - materia
  - topicos
  - objetivo
- `session state`
  - runId
  - currentIndex
  - answeredIds
  - status
- `content state`
  - manifesto carregado
  - topicos carregados
  - cache local

Regra:

```txt
um estado por responsabilidade
sem store unico informal para tudo
```

---

## 10. Testabilidade

Para a arquitetura se manter, os seguintes pontos precisam ser testaveis sem UI:

- normalizacao de manifesto
- validacao de rota
- montagem de sessao
- persistencia de run
- retomada de sessao
- filtro por serie, materia e topico

---

## 11. Criterios de arquitetura pronta

Esta arquitetura so deve ser considerada pronta quando:

- o boot de `questions` nao depende de importar todo o banco
- a sessao persiste sem snapshots gigantes
- a UI consegue abrir com manifesto parcial
- o engine aceita crescer sem reescrever a UI
- outra pessoa consegue localizar claramente onde mexer

