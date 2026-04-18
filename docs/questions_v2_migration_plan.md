# ROTANOTA - QUESTIONS V2 - PLANO DE MIGRACAO

Documento interno de execucao.
Nao deve aparecer na interface do produto.

Atualizado em 2026-03-28.

---

## 1. Regra desta migracao

```txt
parar de adicionar complexidade em cima da base antiga
criar a base nova por camadas
migrar com o produto ainda funcionando
```

Nao fazer:

- reescrita cega em uma tacada
- mistura de migracao estrutural com redesign total
- aumento do banco antes de preparar manifesto e persistencia

Documento companheiro de execucao:

- `docs/questions_v2_execution_master_plan.md`

---

## 2. Fases oficiais

### Fase 0. Congelamento de risco

Objetivo:
- parar de aprofundar acoplamentos da arquitetura atual

Checklist:
- [ ] nao adicionar novos fluxos pesados diretamente em `questions.js`
- [ ] nao criar novas chaves grandes em `localStorage`
- [ ] nao ampliar `questions/banks/index.js` como agregador definitivo
- [ ] documentar toda nova necessidade antes de implementar no v1

### Fase 1. Fundacao do `questions v2`

Objetivo:
- criar esqueleto de pastas e contratos do dominio novo

Checklist:
- [x] criar estrutura `questions/app`
- [x] definir `bootstrap` isolado do shell
- [x] definir contratos de eventos entre shell e modulo
- [x] definir interfaces de repositorio de conteudo
- [x] definir interfaces de repositorio de runs
- [x] separar tipos e entidades centrais

Entregas esperadas:
- estrutura de pastas criada
- contratos documentados
- modulo novo convivendo com o atual sem assumir tudo ainda

### Fase 2. Manifesto e pipeline de conteudo

Objetivo:
- fazer o banco crescer sem boot pesado

Checklist:
- [x] definir schema do manifesto mestre
- [x] definir schema do manifesto por topico
- [x] criar script para gerar manifesto a partir dos bancos atuais
- [x] validar contagem de questoes por serie, materia e topico
- [x] registrar caminho fisico de cada topico no manifesto
- [x] prever campo `updatedAt` para invalidacao futura de cache

Entregas esperadas:
- manifesto gerado
- indice navegavel sem abrir questoes completas
- banco pronto para lazy loading

Observacao de andamento:

- o manifesto agora tambem carrega um indice leve `questionId -> topicId`
- a resolucao por ids passa a conseguir inferir o topico necessario mesmo sem `routeSnapshot.context.topicos`

### Fase 3. Persistencia nova

Objetivo:
- trocar dependencia de `localStorage` pesado por persistencia adequada

Checklist:
- [x] mapear tudo que hoje vai para `localStorage`
- [x] classificar o que fica em `localStorage`
- [x] desenhar schema de `IndexedDB`
- [x] criar repositorio de runs
- [x] criar repositorio de perfis
- [x] criar repositorio de blocos salvos
- [x] migrar leitura da arquitetura atual para a nova sem perder dados essenciais

Entregas esperadas:
- runs persistidas por ids e dados resumidos
- sessao retomavel sem snapshots gigantes
- preferencia visual isolada do progresso

Observacao de andamento:

- `runs` ja preferem `IndexedDB` com importacao inicial a partir do `localStorage`
- `smartProfiles` e `savedBlocks` tambem ja podem operar por stores proprios em `IndexedDB`
- `topics` e `sessions` tambem ja contam com repositorio de `profileState` em `IndexedDB`
- o item passa a depender mais de validacao operacional no navegador do que de lacuna estrutural de persistencia

### Fase 4. Engine e sessao

Objetivo:
- tirar a montagem de sessao da UI e preparar escala

Checklist:
- [x] criar caso de uso `startSession`
- [x] criar caso de uso `resumeSession`
- [x] criar caso de uso `pauseSession`
- [x] criar caso de uso `completeSession`
- [x] mover validacao de rota para camada de aplicacao
- [x] mover ranking e selecao para engine dedicado
- [ ] devolver sessao montada por ids e metadados

Entregas esperadas:
- UI sem decidir regra pedagogica
- retomada consistente
- sessoes reproduziveis

Observacao de andamento:

- a retomada de run ja prioriza `questionIds`
- `sessionSnapshot` continua mantido apenas como compatibilidade temporaria
- `smartProfiles` e `savedBlocks` ja contam com camada de aplicacao dedicada
- `questions.js` passa a delegar esses fluxos com fallback legado
- mutacoes principais de rota e launcher inteligente tambem ja contam com camada de aplicacao dedicada
- sincronizacao de contexto e resolucao leve por ids tambem ja contam com camada dedicada
- o bootstrap local do modulo ja pode subir com manifesto sem carregar o banco inteiro no primeiro frame
- o carregamento detalhado do catalogo agora entra sob demanda antes de iniciar sessao, retomar run ou abrir bloco salvo
- a validacao local no navegador confirmou `launcher` operando com manifesto e sessao iniciando depois do carregamento detalhado
- o repositorio de conteudo agora tambem consegue carregar apenas os topicos da rota antes da sessao
- a validacao local no navegador confirmou boot com `0` topicos carregados e sessao entrando com apenas `1` topico em memoria no recorte validado
- `resume` e `saved` tambem passaram a reconstruir sessoes por ids carregando apenas o topico necessario no recorte validado

### Fase 5. Worker de processamento

Objetivo:
- retirar trabalho pesado da thread principal

Checklist:
- [ ] mapear operacoes que mais pesam hoje
- [ ] mover consulta de manifesto grande para worker
- [ ] mover montagem de sessao adaptativa para worker
- [ ] medir tempo de resposta em cenarios com banco ampliado
- [ ] criar fallback simples para ambiente sem worker

Entregas esperadas:
- UI responsiva com banco maior
- selecao de sessao desacoplada da renderizacao

Observacao de andamento:

- a bateria local de estabilidade validou `specific`, `smart`, `pause`, `resume`, `restart`, `saved` e `follow-up` no navegador
- no caminho feliz validado, o modulo continuou operando com carga parcial do catalogo e sem reabrir o banco completo
- os cenarios degradados criticos de `resume` e `saved` tambem seguiram funcionando via snapshot de compatibilidade

### Fase 6. Migracao de UI

Objetivo:
- fazer a UI consumir a nova arquitetura sem depender do legado

Checklist:
- [ ] criar launcher conectado ao manifesto
- [ ] criar tela de sessao conectada a run por ids
- [ ] criar guardados conectados ao novo repositorio
- [ ] criar retomar treino conectado ao novo repositorio
- [ ] remover dependencia direta de globais antigas
- [ ] manter compatibilidade visual minima durante a transicao

Entregas esperadas:
- UI nova operando sobre estado e repositorios novos
- menor risco de estado contaminado

Observacao de andamento:

- perfis inteligentes e guardados ja contam com camada de aplicacao
- a UI ainda nao foi trocada, mas a orquestracao ja comeca a sair de `questions.js`
- rota externa e launcher inteligente tambem comecam a sair de `questions.js`
- a etapa de materias do fluxo inteligente foi estabilizada
- a etapa final do fluxo inteligente recebeu uma primeira simplificacao visual
- seletores e formatadores principais do launcher tambem ja contam com camada dedicada
- a sincronizacao de contexto tambem ja comeca a sair de `questions.js`
- `home`, `smart_start`, `smart_subjects` e `smart` agora ja contam com view models dedicados para leitura de estado
- series, materias e topicos do launcher agora ja preferem o manifesto mesmo sem catalogo detalhado em memoria
- o launcher continua lendo topicos pelo manifesto mesmo depois de uma sessao carregar apenas um subconjunto do catalogo detalhado
- `resume` e `saved` agora tambem exibem mensagens mais precisas para ids ausentes, snapshot de compatibilidade e registros degradados
- os cenarios degradados seguem com fallback seguro para o catalogo completo quando o indice leve nao consegue localizar um `questionId`
- o fallback legado de `resume`, `restart` e `saved` comecou a sair de `questions.js` para um modulo dedicado, sem cortar a ultima compatibilidade inline
- fallback legado de sessao e guardados tambem passou a contar com modulos dedicados, deixando `questions.js` mais focado em orquestracao

### Fase 7. Desligamento do legado

Objetivo:
- apos a validacao, retirar o v1 sem deixar codigo zumbi

Checklist:
- [ ] identificar tudo que o v2 ja cobre
- [ ] remover carregamento encadeado legado
- [ ] remover stores antigas que ficaram sem uso
- [ ] remover chaves antigas de persistencia que nao servem mais
- [ ] atualizar toda a documentacao final
- [ ] registrar decisao de corte do legado

Entregas esperadas:
- uma unica arquitetura ativa
- menos superficie de bug

---

## 3. Ordem recomendada de execucao

Ordem recomendada:

1. Fase 0
2. Fase 1
3. Fase 2
4. Fase 3
5. Fase 4
6. Fase 6
7. Fase 5
8. Fase 7

Observacao:

O worker pode entrar depois do dominio e da persistencia, porque primeiro precisamos acertar o contrato do que sera processado.

---

## 4. Dependencias entre fases

- Fase 2 depende da Fase 1
- Fase 3 depende da Fase 1
- Fase 4 depende da Fase 1 e da Fase 3
- Fase 5 depende da Fase 2 e da Fase 4
- Fase 6 depende da Fase 2, da Fase 3 e da Fase 4
- Fase 7 depende da Fase 6

---

## 5. Definicao de pronto por fase

Uma fase so conta como concluida quando:

- o documento correspondente foi atualizado
- a checklist foi revisada
- o codigo novo passou a ter responsabilidade clara
- nao houve aumento de acoplamento no legado para compensar atraso

---

## 6. Riscos conhecidos

Riscos principais:

- tentar migrar UI antes de fechar contratos
- levar o banco inteiro para o v2 sem manifesto pronto
- copiar o modelo de globais do v1 para dentro do v2
- manter snapshot pesado por comodidade
- trocar storage sem plano de migracao de dados existentes

---

## 7. Marco de sucesso

O marco real de sucesso nao e apenas o modulo abrir.

O marco correto e:

```txt
conseguir aumentar bastante o banco sem reabrir o mesmo tipo de travamento estrutural
```
