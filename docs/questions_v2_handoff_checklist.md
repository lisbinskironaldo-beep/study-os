# STUDY OS - QUESTIONS V2 - CHECKLIST DE CONTINUIDADE

Documento interno de handoff.
Nao deve aparecer na interface do produto.

Atualizado em 2026-03-28.

---

## 0. Estado atual da entrega

Fechamento desta rodada:

- [x] o modulo `questions` abre com manifesto sem depender do banco inteiro no boot
- [x] a sessao passa a carregar o catalogo detalhado sob demanda, por topico
- [x] `resume` e `saved` conseguem reconstruir por `questionIds` usando indice leve do manifesto
- [x] os cenarios degradados de `resume` e `saved` seguem com fallback seguro por snapshot de compatibilidade
- [x] os fallbacks legados criticos de sessao, guardados e recuperacao foram modularizados fora de `questions.js`
- [x] a bateria local no navegador validou `specific`, `smart`, `pause`, `resume`, `restart`, `saved` e `follow-up`
- [ ] worker de processamento ainda nao entrou
- [ ] desligamento final do legado ainda nao aconteceu

Leitura correta deste estado:

- a entrega atual ja pode ser tratada como base estavel para uso local e continuidade
- o que ficou pendente agora e continuidade estrutural de pos-entrega, nao bloqueio imediato do modulo

---

## 1. Como usar este documento

Se outra pessoa continuar esse trabalho, a ordem minima recomendada e:

1. ler `docs/questions_v2_overview.md`
2. ler `docs/questions_v2_architecture.md`
3. ler `docs/questions_v2_execution_master_plan.md`
4. escolher a fase ativa em `docs/questions_v2_migration_plan.md`
5. atualizar esta checklist ao final de cada bloco

---

## 2. Checklist de entrada para quem assumir

- [ ] entender que o problema atual e estrutural e nao apenas de bug
- [ ] nao tratar `questions v2` como retoque visual do `questions` atual
- [ ] revisar a separacao entre shell, dominio, conteudo e persistencia
- [ ] revisar a lista de chaves atuais usadas em storage
- [ ] revisar como o banco esta organizado hoje em `questions/banks`
- [ ] validar qual fase do plano esta oficialmente ativa

---

## 3. Checklist antes de codar

- [ ] registrar em qual fase do plano a tarefa se encaixa
- [ ] verificar se a mudanca cria mais acoplamento no legado
- [ ] preferir criar camada nova em vez de engrossar `questions.js`
- [ ] confirmar se o dado novo precisa mesmo ser persistido
- [ ] confirmar se o dado novo precisa mesmo ser carregado no boot
- [ ] confirmar se a responsabilidade esta no lugar certo

---

## 4. Checklist por area

### Conteudo

- [ ] nenhuma tarefa nova deve depender de importar o banco inteiro no boot
- [ ] toda expansao de banco deve considerar manifesto e indice
- [ ] novos campos de conteudo precisam entrar no schema documentado
- [ ] o caminho fisico do conteudo precisa continuar previsivel

### Persistencia

- [ ] nao salvar objeto completo de questao sem necessidade forte
- [ ] preferir ids e referencias
- [ ] separar preferencia visual de progresso pedagogico
- [ ] revisar impacto de tamanho antes de criar nova colecao persistida

### Sessao e engine

- [ ] UI nao deve montar regra pedagogica por conta propria
- [ ] regras de validacao devem ficar fora da renderizacao
- [ ] retomar sessao deve depender de contrato formal
- [ ] conclusao de sessao deve produzir resumo reaproveitavel

### UI

- [ ] UI deve consumir contratos claros do dominio
- [ ] a abertura do modulo nao deve depender de todo o banco
- [ ] erros de conteudo devem falhar com degradacao controlada
- [ ] o modulo deve conseguir reiniciar limpo

---

## 5. Checklist de encerramento por tarefa

- [ ] documentacao relevante foi atualizada
- [ ] a fase correspondente foi marcada ou refinada
- [ ] a decisao tomada ficou registrada
- [ ] o codigo novo nao aumentou dependencia de globais antigas
- [ ] o passo seguinte ficou evidente para quem pegar depois

Fechamento desta rodada em 2026-03-28:

- [x] documentacao relevante foi atualizada
- [x] a fase correspondente foi marcada ou refinada
- [x] a decisao tomada ficou registrada
- [x] o codigo novo reduziu dependencia direta de `questions.js`
- [x] o passo seguinte ficou evidente para continuidade futura

---

## 6. Proximo ciclo depois da entrega

Se esta frente continuar depois desta entrega, a ordem mais segura e:

1. medir gargalos reais e decidir se `worker` entra mesmo
2. revisar o que ainda sobra de legado inline em `questions.js`
3. planejar corte oficial do legado so depois de nova rodada de validacao

Regra:

- nao reabrir boot pesado como atalho
- nao cortar compatibilidade antiga antes de validar de novo no navegador
- nao misturar continuidade estrutural com redesign amplo

---

## 7. Perguntas que precisam ser respondidas antes de mudar rumo

Perguntas obrigatorias:

- isso ajuda o modulo a escalar ou so mascara o sintoma atual?
- essa mudanca reduz acoplamento ou so move a complexidade de lugar?
- essa decisao faz sentido com milhares de questoes?
- outra pessoa conseguiria entender onde continuar depois desta entrega?

Se a resposta for "nao" para qualquer uma delas, a tarefa precisa ser revista antes de entrar.
