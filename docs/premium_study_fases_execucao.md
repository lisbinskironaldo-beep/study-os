# STUDY OS - PREMIUM STUDY - FASES OFICIAIS DE EXECUÇÃO

Documento operacional das fases.

Status:
- vigente
- detalhado
- subordinado a `docs/premium_study_constituicao_produto.md`

Atualizado em 2026-04-14.

---

## 1. Missão deste documento

Transformar a constituição do produto em trabalho executável sem retrabalho.

Regra:

```txt
cada fase deve ser entregue completa
com objetivos fechados, critérios de aceite e sem dependência oculta
```

---

## 2. Ordem oficial de execução

1. Fase 0 - Contrato e base estrutural
2. Fase 1 - Casca do módulo premium
3. Fase 2 - Intake do PDF e validação
4. Fase 3 - Análise do material e plano em blocos
5. Fase 4 - Estudo por bloco
6. Fase 5 - Prática, flashcards e mini prova
7. Fase 6 - Conta, assinatura e acesso
8. Fase 7 - Hardening, performance e observabilidade
9. Fase 8 - Crescimento controlado

Regra:

```txt
não pular de fase por ansiedade de feature
antes do fluxo principal estar sólido
```

---

## 3. Fase 0 - Contrato e base estrutural

### Objetivo

Congelar as decisões de produto, UX, IA, layout, acessos e arquitetura antes da implementação.

### Esta fase precisa deixar pronto

- documentos oficiais publicados
- estrutura de pastas definida
- nome do módulo fechado
- contratos de dados definidos
- regras de acesso definidas
- limites de PDF definidos
- lista de telas aprovada
- estados do usuário definidos
- estratégia de IA de baixo custo definida

### Entregas da Fase 0

- `docs/premium_study_constituicao_produto.md`
- `docs/premium_study_fases_execucao.md`
- `docs/premium_study_operacao_ai_pagamentos.md`

### Estrutura oficial de pastas aprovada

```txt
premium-study/
  bootstrap/
  app/
  router/
  state/
  storage/
  services/
    ai/
    content/
    pdf/
    billing/
    auth/
  ui/
    views/
    components/
    tokens/
  styles/
  workers/
  assets/
```

### Contratos mínimos da Fase 0

Entidades obrigatórias:

- `PremiumUser`
- `PremiumPlan`
- `PremiumMaterial`
- `PremiumTopic`
- `PremiumStudyPlan`
- `PremiumBlock`
- `PremiumBlockProgress`
- `PremiumQuestionSet`
- `PremiumFlashcardDeck`
- `PremiumMiniExam`
- `PremiumAccessGrant`

### Critérios de aceite da Fase 0

- as decisões principais estão documentadas
- a arquitetura está desacoplada
- as fases seguintes podem ser executadas sem rediscutir fundamentos
- qualquer novo programador consegue assumir a frente lendo os docs

### Saída formal da Fase 0

A Fase 0 só conta como concluída quando:

- os documentos estiverem salvos no repositório
- os três documentos apontarem uns para os outros
- a Fase 1 puder ser executada sem reabrir produto, monetização ou IA

---

## 4. Fase 1 - Casca do módulo premium

### Objetivo

Criar o módulo novo no site, com carregamento próprio, layout base e navegação interna.

### Escopo

- adicionar card `Estudo Premium` na home
- criar `#premiumStudyModule`
- bootstrap lazy-load
- CSS isolado
- router interno
- estado interno
- navegação entre telas vazias reais

### Tarefas obrigatórias

- criar pasta `premium-study/`
- criar ponto de entrada do módulo
- registrar o módulo na home principal
- montar o shell do premium
- montar tokens visuais
- montar componentes base:
  - `PremiumShell`
  - `PremiumStepHeader`
  - `PremiumProgressBar`
  - `PremiumCard`
  - `PremiumActionBar`
  - `PremiumStatPill`
- montar views base:
  - landing
  - novo plano
  - configuração da prova
  - análise
  - tópicos
  - plano
  - bloco

### Layout e direção visual obrigatórios

- fundo escuro sofisticado
- progresso no topo
- painel de resumo do plano em construção
- confirmação visual a cada escolha
- nada infantil

### Mapa obrigatório de ações da Fase 1

Landing:

- botão principal abre `novo plano`
- botão secundário abre `ver exemplo`
- botão terciário abre `planos`

Novo plano:

- `Selecionar PDF`
- `Usar exemplo`
- `Voltar`
- `Continuar`

Configuração:

- `Voltar`
- `Analisar material`

Análise:

- `Cancelar`

Plano:

- `Começar pelo recomendado`
- `Salvar`
- `Regerar plano`

### Critérios de aceite

- o módulo abre sem carregar os outros sistemas
- o shell premium é acessível pela home
- a navegação entre telas existe
- a barra de progresso reage
- a base visual premium está definida

---

## 5. Fase 2 - Intake do PDF e validação

### Objetivo

Receber material válido e rejeitar cedo o que não serve.

### Escopo

- upload de PDF
- validação de extensão
- validação de tamanho
- leitura de páginas
- validação de texto selecionável
- rejeição de PDF escaneado ou ruim

### Tarefas obrigatórias

- implementar drag-and-drop
- implementar seletor de arquivo
- extrair texto do PDF no cliente
- medir densidade de texto por página
- validar limite por plano
- mostrar feedback de motivo de recusa
- salvar metadados do material

### Critérios de aceite

- PDF textual válido entra
- PDF ruim é recusado com clareza
- páginas e tamanho são controlados
- metadados do material ficam salvos

---

## 6. Fase 3 - Análise do material e plano em blocos

### Objetivo

Transformar o material em uma trilha útil.

### Escopo

- limpeza do texto
- detecção de títulos
- detecção de tópicos
- revisão manual dos tópicos
- priorização pelo prazo
- geração do plano em blocos

### Tarefas obrigatórias

- criar `material-parser`
- criar `plan-engine`
- construir heurísticas de prioridade
- gerar tópicos detectados
- permitir editar, excluir e adicionar tópicos
- montar blocos do plano
- marcar bloco recomendado

### Estrutura oficial de um bloco

Campos mínimos:

- `id`
- `title`
- `priority`
- `estimatedMinutes`
- `summaryMode`
- `hotPoints`
- `keyConcepts`
- `questionStatus`
- `flashcardStatus`
- `miniExamStatus`

### Critérios de aceite

- o sistema transforma um PDF válido em tópicos
- o usuário consegue revisar os tópicos
- o plano gerado tem ordem compreensível
- existe um bloco recomendado

---

## 7. Fase 4 - Estudo por bloco

### Objetivo

Entregar valor real mesmo antes da prática avançada.

### Escopo

- tela do bloco
- aba `Aprender`
- resumo principal
- botão `Explicar melhor`
- botão `Revisão rápida`
- progresso do bloco

### Tarefas obrigatórias

- construir view do bloco
- construir componente de resumo
- construir componente de pontos quentes
- construir componente de conceitos-chave
- salvar progresso de leitura
- destacar próximo passo

### Layout obrigatório do bloco

- cabeçalho com nome do bloco
- justificativa curta do porquê ele está ali
- barra de progresso do bloco
- abas fixas no topo da área principal
- ação principal clara em cada aba

### Critérios de aceite

- o aluno consegue estudar o bloco
- o sistema salva progresso
- `Explicar melhor` e `Revisão rápida` funcionam

---

## 8. Fase 5 - Prática, flashcards e mini prova

### Objetivo

Completar o ciclo aprender -> praticar -> testar.

### Escopo

- aba `Praticar`
- geração de 3 questões
- decks de flashcards
- aba `Prova`
- mini prova do bloco
- resultado com gabarito comentado

### Tarefas obrigatórias

- criar `question-engine`
- criar `flashcard-engine`
- criar `mini-exam-engine`
- construir renderer de questões
- construir renderer de flashcards
- construir tela de resultado

### Formatos oficiais

- questões: múltipla escolha e verdadeiro/falso
- flashcards: frente e verso objetivos
- mini prova: 8 a 12 questões

### Critérios de aceite

- o aluno pratica sem sair do bloco
- o sistema registra desempenho
- a mini prova funciona no desktop e no mobile

---

## 9. Fase 6 - Conta, assinatura e acesso

### Objetivo

Ligar valor percebido com liberação real do produto.

### Escopo

- autenticação
- status de plano
- trial
- assinatura
- acesso premium
- limites do plano grátis

### Tarefas obrigatórias

- criar camada de auth
- criar camada de access-control
- criar página de planos
- criar fluxo de checkout
- receber webhook
- ativar entitlements
- refletir o status no frontend

### Critérios de aceite

- usuário grátis tem limites reais
- usuário premium libera recursos reais
- assinaturas e estados são consistentes

---

## 10. Fase 7 - Hardening, performance e observabilidade

### Objetivo

Preparar o produto para beta com estabilidade.

### Escopo

- cache
- reuso de gerações
- telemetria
- tratamento de erro
- limites de uso
- limpeza de dados temporários

### Tarefas obrigatórias

- instrumentar eventos essenciais
- criar logs mínimos
- implementar rate limits
- implementar cache de respostas por bloco
- medir tempo de tela e custo de geração
- revisar render no mobile

### Critérios de aceite

- o fluxo não pesa
- custos ficam rastreáveis
- problemas viram eventos observáveis

---

## 11. Fase 8 - Crescimento controlado

### Objetivo

Expandir sem reabrir a base.

### Escopo permitido

- materiais maiores
- mais formatos de questões
- melhor motor de recomendação
- OCR seletivo
- tutor contextual futuro

### Escopo proibido antes de hora

- podcast
- chat livre
- várias features sociais sem base de retenção

---

## 12. Padrões oficiais de layout

### Estrutura

Toda tela deve nascer com:

- cabeçalho de etapa
- barra de progresso
- área principal
- área de apoio resumida
- ação principal

### Componentes base

Obrigatórios:

- `step-header`
- `progress-bar`
- `context-card`
- `primary-cta`
- `secondary-cta`
- `status-pill`
- `plan-summary-panel`

### Tokens

Obrigatórios:

- cor
- espaço
- raio
- sombra
- tipografia
- duração de animação
- opacidade

---

## 13. Padrões oficiais de responsividade

### Regra geral

Se a largura diminuir:

- o texto precisa reduzir com elegância
- os blocos precisam reduzir juntos
- o CTA não pode sumir
- os cards não podem quebrar visualmente

### Obrigações

- sem largura fixa de card como regra principal
- sem títulos que escapem do container
- sem barra superior inutilizável no celular
- sem bloco lateral obrigatório em viewport pequena

### App e webview

Deve funcionar bem em:

- toque
- teclado virtual
- scroll vertical
- safe area

---

## 14. Padrões oficiais de arquitetura

- `ui` só renderiza e emite eventos
- `state` concentra estado local
- `services` executam regras
- `storage` persiste
- `router` troca telas
- `workers` processam peso

Proibições:

- service chamando DOM
- view falando direto com IA
- storage decidindo fluxo de UX
- CSS global mandando no premium
- `app.js` virando arquivo gigante

---

## 15. Definição de pronto por fase

Cada fase só pode ser considerada pronta quando:

- objetivo da fase foi fechado
- critérios de aceite passaram
- mobile não quebra
- ortografia foi revisada
- não surgiu acoplamento impróprio
- a fase seguinte consegue começar sem remendo temporário

---

## 16. Como executar quando o usuário pedir uma fase

Regra oficial:

```txt
ao receber "execute a fase X"
entregar a fase inteira com todos os objetivos concluidos
repensando cada objetivo internamente sem interromper para pedir confirmacao
salvo quando surgir risco real de produto, custo ou integracao externa
```

---

## 17. Checklist final da Fase 0

- [x] constituição do produto documentada
- [x] fases oficiais documentadas
- [x] frente operacional documentada
- [x] decisão de sem chat livre congelada
- [x] direção visual premium congelada
- [x] regras de mobile e leveza congeladas
- [x] estrutura desacoplada congelada
- [x] Fase 1 pronta para execução
