# PAPIRO_TOOLS - EXPANSAO DOS MODOS DE QUESTOES

Documento interno de produto e execucao.
Nao deve aparecer na interface do produto.

Atualizado em 2026-04-09.

---

## 1. Missao desta melhoria

Reorganizar a entrada do modulo `questions` para reduzir decisao inicial, acelerar o primeiro clique e criar um caminho de estudo mais natural.

Missao em uma frase:

```txt
fazer o usuario entrar no treino certo sem precisar pensar demais antes de comecar
```

---

## 2. Principio central

Regra de ouro:

```txt
o sistema nao deve obrigar o usuario a pensar antes de comecar
```

Tudo precisa favorecer:

- rapidez
- clareza
- direcionamento
- progressao natural

O modulo deixa de parecer uma tela de filtros e passa a parecer um motor de estudo guiado.

---

## 3. Estrutura oficial de modos

### Modos principais de estudo

Estes passam a ser os 3 caminhos centrais:

- `Rapido`
- `Inteligente`
- `Simulado`

### Acoes secundarias

Estas continuam existindo, mas nao devem competir com o inicio do treino:

- `Progresso`
- `Guardados`
- `Retomar treino`

### Hierarquia real de uso esperada

Ordem de uso mais provavel:

1. `Rapido`
2. `Inteligente`
3. `Simulado`

Leitura de produto:

- `Rapido` vira o core do modulo
- `Inteligente` vira o fluxo adaptativo principal
- `Simulado` fica como modo estruturado de avaliacao
- `Progresso` vira hub de estatisticas
- `Guardados` e `Retomar treino` passam a viver dentro do `Rapido`

---

## 4. Mapeamento com o estado atual

### O que ja existe

- `Treino inteligente`
- `Guardados`
- `Retomar treino`
- hub de `Progresso`
- base arquitetural separando `questions` e `simulado`

### O que muda

- `Rapido` entra como novo launcher principal
- `Simulado` sobe para a home principal como modo oficial
- `Por assunto` deixa de ser modo principal e vira o fluxo de montagem dentro de `Simulado`
- `Guardados` e `Retomar treino` passam a morar dentro do `Rapido`
- `Progresso` fica isolado como leitura estatistica

### Decisao de nomenclatura

Home principal recomendada:

- `Rapido`
- `Inteligente`
- `Simulado`

Area secundaria:

- `Progresso`
- voltar

---

## 5. Definicao oficial de cada modo

### 5.1. Modo Rapido

Objetivo:

- colocar o usuario para estudar em segundos

Regra principal:

- usa somente conteudo que o usuario ja viu

Fontes permitidas:

- materias estudadas
- assuntos estudados
- erros recentes
- ultima sessao
- desempenho por assunto

Entradas oficiais do modo rapido:

1. `Continuar de onde parou`
2. `Guardados`
3. `Revisar erros`
4. `Foco no ponto fraco`

Regras obrigatorias:

- cada card precisa mostrar contexto
- nenhum card deve puxar assunto totalmente novo
- a escolha deve ser instantanea

Exemplos de copy:

- `Voce parou aqui`
- `Seus blocos guardados`
- `Voce errou 5 nesse assunto`
- `Seu ponto mais fraco`

Leitura tecnica:

- o modo rapido depende principalmente de `runs`, `resume`, `follow-up`, `topicStats` e contexto de launcher
- este modo aproveita bem a base de persistencia e stats ja iniciada no `v2`

### 5.2. Modo Inteligente

Objetivo:

- treino adaptativo progressivo

Fluxo oficial:

1. base ou serie
2. materia
3. assunto
4. quantidade ou tempo
5. iniciar ou guardar

Regra nova:

- a etapa `assunto` passa a ser oficial
- pode escolher `todos`
- pode pular para inicio rapido quando fizer sentido

Diferenca para o modo rapido:

- aqui o sistema pode introduzir conteudo novo

### 5.3. Por Assunto dentro do Simulado

Objetivo:

- montagem direta de blocos dentro do simulado

Fluxo oficial:

1. buscar assunto
2. selecionar assunto
3. escolher dificuldade
4. escolher quantidade
5. iniciar

Melhorias obrigatorias:

- autocomplete
- recentes do usuario
- assuntos populares
- sugestoes por historico

Leitura tecnica:

- este fluxo deixa de competir como modo principal da home
- ele passa a existir como subfluxo de `Montar simulado`

### 5.4. Modo Simulado

Objetivo:

- avaliacao estruturada

Submodos oficiais:

- `Montar simulado`
- `Prova pronta`

#### Montar simulado

Fluxo:

1. adicionar bloco
2. escolher materia
3. escolher assunto
4. escolher dificuldade
5. escolher quantidade
6. repetir blocos
7. revisar total e tempo
8. nomear
9. iniciar

#### Prova pronta

Escopo previsto:

- ENEM anteriores
- vestibulares
- concursos no futuro

Filtros previstos:

- ano
- banca
- nivel

Regra arquitetural:

- `simulado` continua separado de `questions`
- a home de `questions` pode apontar para esse fluxo sem fundir os modulos
- `Montar simulado` absorve a logica de `por assunto`

---

## 6. Decisoes fechadas para UX

### Home de entrada

Texto principal recomendado:

```txt
Escolha como quer estudar
```

Cards principais:

- `Rapido`
- `Inteligente`
- `Por assunto`
- `Simulado`

Area secundaria discreta:

- `Guardados`
- `Progresso`
- `Retomar treino`
- `Voltar`

### Regra visual

- os modos principais devem ser os maiores cards
- `Rapido` deve receber o maior destaque de produto
- `Guardados` e `Progresso` nao devem parecer caminhos principais de inicio

### Regra de friccao

- nenhuma tela inicial deve parecer formulario
- o usuario precisa entender o proximo clique sem ler muito

---

## 7. Blocos oficiais de implementacao

### Bloco 1. Reestruturar a home do launcher

Objetivo:

- trocar a home atual para a nova hierarquia de modos

Entregas:

- card `Rapido`
- card `Inteligente`
- card `Por assunto`
- card `Simulado`
- rebaixamento visual de `Guardados`
- rebaixamento visual de `Progresso`
- `Retomar treino` como acao secundaria

Nao fazer neste bloco:

- engine completa do rapido
- simulado completo

Condicao de conclusao:

- a home nova comunica os 4 modos sem confusao

### Bloco 2. Implementar o Modo Rapido

Objetivo:

- criar o principal caminho de estudo do produto

Entregas:

- algoritmo de recomendacao dos 4 cards
- resumo contextual em cada card
- inicio imediato de sessao
- regras para continuar, revisar, foco fraco e misto

Dependencias:

- leitura de historico por topico
- leitura de erros recentes
- leitura de ultima sessao

Condicao de conclusao:

- usuario consegue abrir e iniciar em poucos segundos

### Bloco 3. Fechar o fluxo completo do Inteligente

Objetivo:

- inserir a etapa oficial de `assuntos`

Entregas:

- etapa por materia
- `Selecionar todas`
- `Limpar`
- `Excluir materia`
- `Ir direto para as questoes`
- etapa final curta de limites

Condicao de conclusao:

- o inteligente deixa de pular de materia direto para inicio

### Bloco 4. Converter Especificar treino em Por Assunto

Objetivo:

- transformar o fluxo manual atual em busca direta por topico

Entregas:

- renomear oficialmente para `Por assunto`
- tela centrada em busca
- autocomplete
- recentes
- populares
- dificuldade e quantidade

Condicao de conclusao:

- o usuario consegue achar assunto com pouco atrito

### Bloco 5. Subir o Simulado para a home

Objetivo:

- tornar o caminho de avaliacao visivel e oficial

Entregas minimas iniciais:

- card `Simulado`
- pagina inicial do simulado
- escolha entre `Montar simulado` e `Prova pronta`
- estado claro de `em preparacao` se algum subfluxo ainda nao estiver completo

Condicao de conclusao:

- o usuario entende que existe um caminho proprio para prova

### Bloco 6. Reorganizar secundarias

Objetivo:

- tirar `Guardados` e `Progresso` do centro da decisao inicial

Entregas:

- `Guardados` como biblioteca secundaria
- `Progresso` como hub de acompanhamento
- `Retomar treino` como atalho leve

Condicao de conclusao:

- a home deixa de parecer misturada entre iniciar, consultar e analisar

---

## 8. Ordem oficial de execucao

Ordem recomendada:

1. Bloco 1 - Home
2. Bloco 2 - Rapido
3. Bloco 3 - Inteligente
4. Bloco 4 - Por assunto
5. Bloco 5 - Simulado
6. Bloco 6 - Secundarias

Regra:

```txt
nao iniciar simulado completo antes de o modo rapido estar forte
```

Justificativa:

- `Rapido` aumenta retencao
- `Rapido` cria habito
- `Rapido` reduz abandono
- `Rapido` vira o uso diario

---

## 9. Etapas praticas por desenvolvimento

### Etapa A - Congelar as decisoes de produto

Checklist:

- [x] confirmar os 4 modos principais
- [x] confirmar `Rapido` como core
- [x] confirmar `Por assunto` como nome oficial do manual
- [x] confirmar `Simulado` como fluxo separado

### Etapa B - Ajustar a home

Checklist:

- [ ] substituir os cards atuais
- [ ] reposicionar `Guardados`
- [ ] reposicionar `Progresso`
- [ ] reposicionar `Retomar treino`
- [ ] validar leitura visual da home

### Etapa C - Construir o Modo Rapido

Checklist:

- [ ] definir contrato dos cards recomendados
- [ ] mapear fontes de dados por card
- [ ] montar heuristicas iniciais
- [ ] renderizar os cards com contexto
- [ ] iniciar sessao real por clique
- [ ] validar comportamento sem historico suficiente

### Etapa D - Fechar Assuntos no Inteligente

Checklist:

- [ ] criar estado `smartSelectedTopicsBySubject`
- [ ] criar telas por materia
- [ ] criar acoes `todos`, `limpar`, `excluir`
- [ ] criar atalho `ir direto para as questoes`
- [ ] revisar etapa final do fluxo

### Etapa E - Transformar Specific em Por Assunto

Checklist:

- [ ] trocar naming da UI
- [ ] simplificar a entrada
- [ ] adicionar busca e autocomplete
- [ ] adicionar recentes e populares
- [ ] manter compatibilidade com contexto atual

### Etapa F - Integrar Simulado na home

Checklist:

- [ ] card principal na home
- [ ] tela inicial de simulado
- [ ] rota para `montar`
- [ ] rota para `prova pronta`
- [ ] estado de preparo progressivo

---

## 10. Impactos tecnicos esperados

### `questions.js`

Vai precisar:

- novos tipos de launcher view
- novos caminhos de home
- novo fluxo para `Rapido`
- etapa extra em `Inteligente`
- renomeacao de `specific`

### `questions.ui.js`

Vai precisar:

- nova home
- cards contextuais do `Rapido`
- nova etapa `Assuntos`
- nova tela de `Por assunto`
- entrada para `Simulado`

### `questions.service.js` e camada `v2`

Vai precisar:

- heuristicas do `Rapido`
- leitura de historico por topico
- consolidacao de erros recentes
- selecao por ponto fraco
- mistura limitada a conteudo visto

### Persistencia e stats

Precisam sustentar:

- ultima sessao relevante
- topicos estudados
- topicos errados recentemente
- ranking de topicos fracos
- frequencia por materia e assunto

---

## 11. Regras tecnicas obrigatorias

### Regra 1 - Modo Rapido

- nao pode puxar conteudo novo

### Regra 2 - Inteligente

- pode puxar conteudo novo

### Regra 3 - Por assunto

- deve privilegiar busca e sugestao

### Regra 4 - Simulado

- nao deve contaminar o fluxo rapido de treino

### Regra 5 - Progresso

- e hub de acompanhamento, nao launcher principal

---

## 12. Riscos e cuidados

### Risco 1

- tentar implementar os 4 modos ao mesmo tempo

Mitigacao:

- seguir a ordem oficial por blocos

### Risco 2

- misturar `Rapido` e `Inteligente`

Mitigacao:

- manter a diferenca pedagogica explicita

### Risco 3

- transformar a home em excesso de cards de novo

Mitigacao:

- secundarios fora do foco principal

### Risco 4

- criar `Simulado` cedo demais e atrasar o core

Mitigacao:

- subir a entrada visual antes da implementacao completa

---

## 13. Criterios de conclusao desta frente

Esta melhoria so conta como fechada quando:

- a home mostra os 4 modos oficiais
- `Rapido` inicia sessao recomendada real
- `Inteligente` inclui `Assunto`
- `Por assunto` substitui `Especificar treino`
- `Simulado` aparece como caminho proprio
- `Guardados` e `Progresso` deixam de competir com o inicio

---

## 14. Proximo passo recomendado

Primeira execucao sugerida a partir deste documento:

1. atualizar a home do launcher
2. reservar a arquitetura do `Rapido`
3. nao mexer ainda no `Simulado` completo

Leitura final:

```txt
se tiver que acertar uma coisa primeiro,
acertar o modo rapido
```
