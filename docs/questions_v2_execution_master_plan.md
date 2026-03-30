# STUDY OS - QUESTIONS V2 - BLOCO MESTRE DE EXECUCAO

Documento interno de execucao.
Nao deve aparecer na interface do produto.

Atualizado em 2026-03-28.

---

## 1. Missao desta frente

Terminar a separacao estrutural do modulo `questions` para que o banco possa crescer sem reabrir o mesmo tipo de travamento.

Missao em uma frase:

```txt
tirar o modulo de questoes da base improvisada do relogio
e levar para uma arquitetura capaz de crescer sem congelar a interface
```

---

## 2. O que significa concluir esta tarefa

Esta tarefa so conta como concluida quando estas condicoes forem verdadeiras ao mesmo tempo:

- o modulo abre sem depender do banco inteiro no boot
- a persistencia pesada deixa de depender de `localStorage` como trilha principal
- sessao, guardados e retomada operam principalmente por ids e metadados leves
- a UI usa a camada nova como fluxo principal
- o legado vira compatibilidade residual e pode ser desligado
- aumentar o numero de questoes deixa de ser um risco estrutural imediato

---

## 3. Problema raiz que estamos atacando

O problema atual nao e apenas um bug.

Os travamentos vieram da soma destes fatores:

- estado espalhado em globais
- banco carregado de forma pesada
- persistencia local sincrona e volumosa
- regras de sessao e launcher misturadas com renderizacao
- modulo crescendo em cima de uma base que nasceu para ser muito menor

Regra de execucao:

```txt
nao otimizar a gambiarra como solucao final
substituir as responsabilidades da base antiga por camadas novas
```

---

## 4. Estado estrutural atual

Ja existe base concreta para seguir:

- manifesto de conteudo
- bootstrap isolado
- contratos do dominio
- repositorio de conteudo indexado
- persistencia nova em `IndexedDB` para `runs`
- persistencia nova em `IndexedDB` para `profileState`
- persistencia nova em `IndexedDB` para `smartProfiles`
- persistencia nova em `IndexedDB` para `savedBlocks`
- camada de aplicacao de sessao
- camada de aplicacao de perfis e guardados
- camada de aplicacao de rota e launcher
- fallback legado preservado nos pontos criticos
- boot local validado no navegador com manifesto sem carregar o banco inteiro no primeiro frame
- carga detalhada do catalogo adiada para sessao, retomada e guardados
- indice leve `questionId -> topicId` no manifesto para `resume` e `saved`
- fluxos degradados de `resume` e `saved` com aviso especifico e fallback seguro por snapshot
- parte critica do legado extraida de `questions.js` para modulos dedicados
- bateria local de estabilidade fechada para `specific`, `smart`, `pause`, `resume`, `restart`, `saved` e `follow-up`

O que ainda nao esta terminado:

- a UI ainda depende demais de `questions.js` em alguns pontos de orquestracao
- o corte final do legado ainda nao foi feito
- o worker de processamento ainda nao entrou
- a migracao completa de UI ainda nao terminou

Leitura correta deste estado:

- o ciclo atual de estabilizacao e entrega local pode ser tratado como fechado
- o que sobra agora e continuidade estrutural de medio prazo, nao mais destravamento imediato do modulo

---

## 5. Blocos oficiais de execucao ate o fim

### Bloco A. Fechar a sessao como trilha nova principal

Objetivo:
- encerrar de vez a dependencia estrutural de snapshots pesados e de regra espalhada na pagina global

Checklist:
- [ ] reduzir ainda mais a necessidade de `sessionSnapshot`
- [ ] garantir que `start`, `resume`, `restart`, `complete` e `follow-up` trafeguem por ids e metadados
- [ ] empurrar mais validacoes de sessao para a camada de aplicacao
- [ ] diminuir o numero de caminhos de sessao ainda duplicados em `questions.js`
- [ ] validar no navegador pausa, retomada, reinicio e conclusao

Critico porque:
- sessao e o nucleo do travamento e da persistencia pesada

### Bloco B. Esvaziar `questions.js` como centro de regra

Objetivo:
- transformar `questions.js` em casca de orquestracao em vez de concentrador de regra

Checklist:
- [x] extrair mais seletores e resumos de launcher
- [x] extrair sincronizacao de contexto e resolucao leve por ids
- [ ] extrair o que ainda sobrou de montagem de fluxo por view
- [ ] reduzir leitura direta de globais na pagina principal
- [ ] consolidar fallback onde ainda existir duplicacao grande
- [ ] deixar claro em documento o que ainda pertence ao legado

Critico porque:
- enquanto `questions.js` continuar concentrando regra, a UI nova fica amarrada ao v1

### Bloco C. Migrar a UI para o `v2`

Objetivo:
- fazer a interface consumir a camada nova como caminho principal

Checklist:
- [x] iniciar view models do launcher para `home`, `smart_start`, `smart_subjects` e `smart`
- [ ] conectar launcher ao manifesto e aos contratos do `v2`
- [ ] conectar sessao ao repositrio novo como trilha principal
- [ ] conectar guardados ao repositrio novo como trilha principal
- [ ] conectar retomada ao repositrio novo como trilha principal
- [ ] reduzir dependencia direta da UI em `QuestionsService`
- [ ] validar visualmente `home`, `smart`, `specific`, `saved`, `resume` e sessao

Critico porque:
- sem isso o sistema continua com espinha nova, mas pele velha acoplada

### Bloco D. Medir gargalos reais e mover peso para worker

Objetivo:
- impedir que crescimento de banco continue bloqueando a thread principal

Checklist:
- [ ] mapear operacoes mais lentas no runtime atual
- [ ] medir busca, filtro e montagem de sessao em cenarios maiores
- [ ] mover ranking e selecao pesados para worker
- [ ] criar fallback sem worker
- [ ] documentar limites observados antes e depois

Critico porque:
- o ganho estrutural precisa aparecer tambem sob carga real

### Bloco E. Desligar o legado com seguranca

Objetivo:
- remover codigo zumbi e fechar a migracao

Checklist:
- [ ] identificar tudo que o `v2` ja cobre
- [ ] remover caminhos antigos substituidos
- [ ] remover persistencia velha sem uso
- [ ] limpar chaves antigas quando a migracao estiver validada
- [ ] atualizar documentacao final
- [ ] registrar corte oficial do legado

Critico porque:
- manter duas arquiteturas por muito tempo recria fragilidade

---

## 6. Ordem de execucao recomendada

Ordem oficial daqui para frente:

1. Bloco A
2. Bloco B
3. Bloco C
4. Bloco D
5. Bloco E

Regra:

```txt
nao adiantar worker ou corte final
antes da sessao e da UI estarem maduras no caminho novo
```

---

## 7. O que pode seguir sem pedir confirmacao

Estas frentes podem continuar sozinhas:

- extracoes incrementais para camada de aplicacao
- reorganizacao interna com fallback
- migracao de persistencia com compatibilidade
- documentacao, checklists e plano de continuidade
- validacao local de sintaxe e coerencia estrutural
- simplificacoes visuais pequenas sem alterar o produto de forma radical

---

## 8. O que precisa de pausa antes de seguir

Estas frentes devem ser pausadas para alinhamento:

- mudanca perceptivel de fluxo do usuario
- corte definitivo do legado
- remocao de compatibilidade com dados antigos
- alteracao de schema de conteudo que afete o banco existente
- redesign grande de interface

---

## 9. Definicao de pronto por bloco

Um bloco so fica marcado como fechado quando:

- o codigo novo assumiu a responsabilidade principal
- o fallback antigo nao precisou ser engrossado para compensar falha
- os documentos foram atualizados
- a checklist correspondente foi marcada
- ficou evidente qual e o proximo passo

---

## 10. Riscos operacionais que nao podem ser esquecidos

- migrar UI cedo demais pode esconder acoplamento ainda nao resolvido
- manter snapshot pesado por comodidade pode reabrir o gargalo
- validar apenas por sintaxe nao substitui validacao real no navegador
- crescer o banco antes do worker pode mascarar ganho parcial
- deixar o legado viver demais pode atrasar o corte definitivo

---

## 11. Proxima execucao imediata

A partir deste documento, o ciclo atual pode ser considerado fechado para entrega local.

Se a frente continuar depois desta entrega, o proximo ciclo recomendado e:

1. abrir o Bloco D e medir gargalos reais antes de introduzir `worker`
2. revisar o que ainda resta de legado inline em `questions.js`
3. preparar o Bloco E so depois de nova rodada de validacao no navegador

Objetivos imediatos:

- confirmar se ainda existe gargalo real que justifique `worker`
- manter a abertura por manifesto e a carga parcial como padrao
- evitar reintroduzir regra pesada em `questions.js`
- planejar o corte final do legado so quando a validacao estiver novamente fechada

---

## 12. Documentos que devem andar junto com este

- `docs/questions_v2_migration_plan.md`
- `docs/questions_v2_session_application.md`
- `docs/questions_v2_library_application.md`
- `docs/questions_v2_route_application.md`
- `docs/questions_v2_indexeddb_schema.md`
- `docs/questions_v2_storage_audit.md`
- `docs/questions_status_checklist.md`

---

## 13. Marco final real

O marco final nao e so "o modulo abriu".

O marco final correto e:

```txt
o banco pode crescer bastante
e o modulo continua abrindo, filtrando, salvando e retomando
sem travar por causa da arquitetura
```
