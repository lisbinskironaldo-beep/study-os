# ROTANOTA - STATUS DO MODULO DE QUESTOES

Documento interno de acompanhamento.
Atualizado em 2026-03-28.

---

## Checklist de etapas

- [x] Revisar a estrutura atual do banco escolar por serie, materia e categoria
- [x] Confirmar que `questions` e `simulado` devem seguir fluxos separados
- [x] Preparar a aba `questions` para exibir a base atual e o botao de ENEM
- [x] Melhorar a descoberta de assuntos com busca local
- [x] Adicionar controle para ocultar assuntos vazios e deixar o launcher mais intuitivo
- [x] Atualizar o schema recomendado das questoes para crescimento futuro
- [x] Editar um arquivo real do banco como referencia de preenchimento
- [x] Gerar snapshot interno com series, materias e categorias atuais
- [ ] Criar o modulo separado de treino ENEM
- [ ] Criar o modulo separado de simulado ENEM
- [ ] Conectar `sourceYear`, `sourceExam` e `competencies` aos filtros da interface
- [ ] Criar ingestao guiada para lote de questoes revisadas
- [x] Revisar `1ª série > Português` em texto
- [ ] Revisar o restante da `1ª série` em texto
- [ ] Implementar `Montar simulado`

Documentos mais recentes desta frente:

- `docs/questions_2026-04-09_handoff.md`
- `docs/questions_topic_training_plan.md`
- `docs/questions_modes_expansion_plan.md`

---

## Decisoes fechadas nesta etapa

- `questions` continua como treino escolar personalizavel
- `ENEM` fica preparado na interface, mas separado de `questions`
- a hierarquia principal continua `serie -> materia -> assunto`
- o crescimento futuro deve acontecer por metadados da questao, nao so por novas pastas
- filtros que passam a ser oficiais no schema:
  - `base`
  - `subtopico`
  - `tags`
  - `habilidades`
  - `sourceType`
  - `collections`
  - `status`

---

## Arquivo de referencia editado

- `questions/banks/1-serie/matematica/notacao-cientifica/index.js`

Esse arquivo agora serve como exemplo de preenchimento com:

- `metadados.base`
- `metadados.frente`
- `metadados.searchAliases`
- `metadados.habilidadesBase`
- `habilidades`
- `collections`
- `sourceType`
- `sourceExam`
- `sourceYear`
- `competencies`
- `status`

---

## Proxima etapa sugerida

Direcao estrutural oficial desta fase:

- `docs/questions_v2_overview.md`
- `docs/questions_v2_architecture.md`
- `docs/questions_v2_execution_master_plan.md`
- `docs/questions_v2_migration_plan.md`
- `docs/questions_v2_handoff_checklist.md`

No modulo `questions`, a etapa visual atual ficou assim:

- [x] simplificar a home para `Treino inteligente` e acessos mais diretos ao estudo
- [x] subir `Rapido` como modo principal
- [x] subir `Simulado` para a home principal
- [ ] separar `Progresso` como hub de estatisticas
- [x] manter a entrada circular do `Treino inteligente`
- [x] reduzir a tela final do treino inteligente para uma revisao curta com `objetivo`, `quantidade`, `guardar` e `comecar`

Proxima rodada sugerida:

- [~] transformar a etapa de materias em uma selecao ainda mais direta, com menos leitura auxiliar
- [ ] trocar a etapa atual de assuntos por um fluxo por materia, uma aberta por vez
- [~] adicionar a tela curta de limites da sessao com quantidade e tempo
- [x] absorver `Guardados` e `Retomar treino` de forma definitiva dentro do `Rapido`
- [x] manter o mini player fechado por padrao e evitar flashes de tela ao abrir `questions`

Base ja pronta para sustentar essa etapa:

- [x] perfis inteligentes
- [x] blocos salvos
- [x] runs com pausa e retomada

Nova frente oficial aberta em 2026-03-31:

- `docs/questions_modes_expansion_plan.md`

Essa frente fecha a proxima reorganizacao do produto:

- [x] subir `Rapido` como modo principal
- [ ] manter `Inteligente` como fluxo adaptativo com etapa de assuntos
- [ ] mover `Por assunto` para dentro de `Simulado > Montar simulado`
- [x] subir `Simulado` para a home como modo oficial
- [ ] separar `Progresso` como hub de estatisticas, e nao como modo de treino
- [x] rebaixar `Guardados` e `Retomar treino` para dentro do `Rapido`
- [ ] executar a melhoria em blocos, sem misturar todos os modos ao mesmo tempo

---

## Reorientacao estrutural fechada em 2026-03-27

O modulo atual deixou de ser tratado apenas como extensao do relogio.

Direcao fechada:

- `questions` passa a ser tratado como dominio proprio
- crescimento do banco deve migrar para manifesto + carregamento sob demanda
- persistencia pesada deve sair de `localStorage`
- a continuidade oficial desta frente passa a seguir o pacote `questions_v2`

Primeira entrega estrutural iniciada nesta direcao:

- [x] fundacao inicial de manifesto em `questions/app/infrastructure/content/catalogManifest.mjs`
- [x] script gerador em `questions/scripts/generate-manifest.mjs`
- [x] manifesto atual gerado em `questions/content/generated/catalog-manifest.json`
- [x] bootstrap isolado iniciado em `questions/app/bootstrap/questionsModuleBootstrap.mjs`
- [x] contratos iniciais definidos em `questions/app/domain/contracts.mjs`
- [x] repositorio de catalogo iniciado em `questions/app/infrastructure/content/catalogRepository.mjs`
- [x] repositorio inicial de runs iniciado em `questions/app/infrastructure/runs/localStorageRunsRepository.mjs`
- [x] chaves de storage centralizadas em `questions/app/infrastructure/storage/storageKeys.mjs`
- [x] auditoria inicial de storage registrada em `docs/questions_v2_storage_audit.md`
- [x] schema inicial de `IndexedDB` registrado em `docs/questions_v2_indexeddb_schema.md`
- [x] repositorio inicial de profile state iniciado em `questions/app/infrastructure/profile/localStorageProfileStateRepository.mjs`
- [x] camada de aplicacao de sessao iniciada em `questions/app/application/sessionUseCases.mjs`
- [x] engine inicial de selecao e preview inteligente iniciada em `questions/app/application/sessionEngine.mjs`
- [x] reconstituicao inicial de runs por `questionIds` iniciada no bootstrap e nos use cases
- [x] compactacao inicial de snapshots em runs e blocos salvos iniciada
- [x] repositorio de `runs` em `IndexedDB` iniciado com fallback seguro para `localStorage`
- [x] repositorios de `smartProfiles` e `savedBlocks` em `IndexedDB` iniciados e ligados na store
- [x] repositorio de `profileState` em `IndexedDB` iniciado para `topics` e `sessions`
- [x] camada de aplicacao para perfis inteligentes e guardados iniciada em `questions/app/application/libraryUseCases.mjs`
- [x] camada de aplicacao para rota e launcher iniciada em `questions/app/application/routeUseCases.mjs`
- [x] seletores e formatadores do launcher iniciados em `questions/app/application/launcherSelectors.mjs`
- [x] sincronizacao de contexto e resolucao leve por ids iniciadas em `questions/app/application/contextSynchronization.mjs`
- [x] view models do launcher iniciados em `questions/app/application/launcherViewModels.mjs`
- [x] launcher legacy ajustado para priorizar materias com questoes prontas
- [x] aba de materias do fluxo inteligente corrigida para voltar a listar materias prontas
- [x] etapa final do fluxo inteligente simplificada para visual mais minimalista
- [x] preview local corrigido para servir `.mjs` e validar o `questions v2` no navegador
- [x] launcher ajustado para operar pelo manifesto mesmo sem `schoolCatalog` carregado no boot
- [x] bootstrap ajustado para adiar o catalogo detalhado e carregar sob demanda ao iniciar sessao ou retomar bloco
- [x] repositorio ajustado para carregar apenas os topicos da rota antes da sessao, mantendo fallback seguro para o catalogo completo
- [x] smoke local no Edge confirmou boot com `schoolCatalog` vazio e sessao entrando com apenas `1` topico carregado no recorte validado
- [x] manifesto enriquecido com indice leve `questionId -> topicId` para reduzir fallback ao catalogo completo
- [x] smoke local no Edge confirmou `resume` e `saved` reconstruindo sessoes por ids com apenas `1` topico carregado no recorte validado
- [x] fluxos degradados de `resume` e `saved` agora exibem mensagens especificas para ids ausentes e snapshot de compatibilidade
- [x] smoke local confirmou `resume` por snapshot no mesmo ciclo da pagina e falha segura quando nao ha snapshot valido
- [x] recuperacao legacy de `resume`, `restart` e `saved` iniciou extracao de `questions.js` para modulo dedicado
- [x] fallback legacy de sessao e guardados tambem foi modularizado fora de `questions.js`, preservando compatibilidade inline como ultima rede de seguranca
- [x] bateria local do bloco 2 validou `specific`, `smart`, `pause`, `resume`, `restart`, `saved` e `follow-up`
- [x] caminho feliz do bloco 2 permaneceu com carga parcial do catalogo no navegador, sem reabrir o banco completo
- [x] cenarios degradados criticos de `resume` e `saved` seguiram funcionando por snapshot de compatibilidade apos as extracoes do bloco 1
