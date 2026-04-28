# ROTANOTA - PLANO DO NOVO FLUXO DE QUESTOES

Documento interno de arquitetura e execucao.
Baseado na decisao de simplificar a entrada do modulo em dois caminhos:

- `Treino inteligente`
- `Especificar treino`

Atualizado em 2026-03-27.

Atualizacao complementar em 2026-04-09:

- a home passa a considerar tambem a entrada `Treino por assunto`
- esse novo fluxo fica documentado em `docs/questions_topic_training_plan.md`

---

## 1. Direcao fechada

O modulo `questions` deixa de abrir com muitos filtros visiveis.
Ele passa a abrir com uma tela inicial simples, com escolhas claras e linguagem direta.

Elementos principais na home:

- `Treino inteligente`
- `Especificar treino`
- `Guardados`

Elementos secundarios pequenos:

- `Retomar treino`
- `Voltar`

Regra de produto:

```txt
menos decisao no primeiro contato
mais automacao no fluxo principal
controle manual apenas quando o usuario quiser
```

### Direcao visual fechada em 2026-03-27

O launcher atual ainda tem informacao demais.
A nova referencia passa a ser:

- home com 3 botoes grandes
- treino inteligente em sequencia curta de telas
- especificar treino continua abrindo a tela detalhada atual por enquanto
- `Retomar treino` deixa de competir como card principal e pode virar acao secundaria

Regra:

```txt
se o usuario entrou pelo fluxo inteligente
ele nao deve sentir que caiu em um formulario
```

---

## 2. Home enxuta

### O que fica

- botao grande `Treino inteligente`
- botao grande `Especificar treino`
- botao grande `Guardados`

### O que sai da area principal

- painel de panorama
- explicacao longa
- contadores de base
- checklist
- blocos auxiliares visuais

### O que pode continuar existindo em segundo plano

- `Retomar treino`
- `Voltar`

Como regra de UX, isso deve aparecer como link ou acao secundaria, nao como terceiro ou quarto card competindo com os fluxos principais.

### Nome recomendado para a aba de salvos

Opcoes boas:

- `Guardados`
- `Meus treinos`
- `Acervo`

Recomendacao:

- `Guardados`

Motivo:

- curto
- humano
- combina com salvar, consultar e refazer
- nao parece nome tecnico

---

## 3. Novo fluxo do treino inteligente

Esse fluxo deixa de ser um launcher cheio de paineis e passa a ser um `wizard` visual.

### Tela 1 - Bases ou series

Elementos:

- botoes circulares grandes:
  - `1a`
  - `2a`
  - `3a`
  - `ENEM`
- botao central:
  - `Ir`
  - ou `Go`
  - ou `Avancar`

Recomendacao:

- usar `Ir`

Motivo:

- mais natural em portugues
- funciona bem no circulo central
- curto

### Comportamento visual dos botoes circulares

- estado desligado visual, com cara de botao mecanico parado
- ao clicar, o disco muda de profundidade e parece travado em outra posicao
- o movimento deve lembrar peca presa no meio, como um brinquedo de pressao
- estado ativo precisa ser claro mesmo sem texto auxiliar

### Como resolver `Selecionar todas`

Melhor solucao:

- um aro grosso clicavel envolvendo o grupo todo
- texto no aro:
  - `Selecionar todas`

Motivo:

- conversa com a linguagem circular
- evita jogar mais um botao retangular no layout
- deixa claro que a acao vale para o conjunto inteiro

Tambem precisa existir a acao inversa:

- `Limpar`

Ela pode entrar pequena abaixo do grupo ou como texto dentro do mesmo aro em estado ativo.

### Regra do botao central

- se nada estiver selecionado, ele fica morto
- se ao menos uma opcao estiver ativa, ele habilita
- o aro `Selecionar todas` tambem habilita o centro

### Tela 2 - Materias

Mesmo sistema visual:

- botoes circulares grandes por materia
- centro com `Ir`
- aro `Selecionar todas`
- acao secundaria `Voltar`
- acao secundaria `Ir para especificar treino`

As materias exibidas dependem do que foi marcado na tela anterior.

### Tela 3 em diante - Assuntos

Cada materia escolhida entra em uma tela propria de assuntos.

Exemplo:

- usuario marcou `Matematica`, `Fisica` e `Biologia`
- o fluxo mostra:
  - assuntos de Matematica
  - depois assuntos de Fisica
  - depois assuntos de Biologia

### Acoes obrigatorias em cada tela de assuntos

- `Selecionar todas`
- `Limpar`
- `Excluir materia`
- `Voltar`
- `Ir para especificar treino`

### Atalho importante na primeira tela de assuntos

Na primeira tela de assuntos precisa existir:

- `Ir direto para as questoes`

Comportamento:

- nenhuma tela de assuntos vira obrigatoria
- se o usuario usar esse atalho, entram todos os assuntos de todas as materias escolhidas

### Regra para `Excluir materia`

Se o usuario se arrependeu no meio:

- ele pode remover a materia ali mesmo
- o fluxo segue para a proxima materia restante
- se nao restar materia nenhuma, o sistema volta para a tela de materias

### Tela final - Limites da sessao

O usuario define:

- quantidade de questoes
- tempo de treino

Opcoes de quantidade:

- `5`
- `15`
- `30`
- `50`
- `Custom`
- `Infinito`

Opcoes de tempo:

- `15 min`
- `30 min`
- `60 min`
- `Custom`
- `Infinito`

### Regra que precisa ficar explicita

Se quantidade e tempo estiverem preenchidos ao mesmo tempo:

- o treino termina no primeiro limite atingido

Isso evita ambiguidade e deixa o comportamento previsivel.

### Ultima tela - Guardar ou iniciar

A ultima tela precisa oferecer:

- `Iniciar agora`
- `Guardar treino`
- `Guardar e iniciar`

Se o usuario nao quiser nomear:

- o sistema cria um nome automatico curto

Exemplo:

- `Matematica e Fisica - 30 questoes`
- `1a e 2a - treino livre`

---

## 4. Pontos que faltavam e agora ficam fechados

### 1. Indicador de progresso

Cada tela do fluxo inteligente precisa mostrar algo como:

- `1/4`
- `2/4`
- `3/4`

Sem isso, o usuario pode sentir que entrou num labirinto.

### 2. Resumo curto sempre visivel

No topo, uma faixa discreta:

- series escolhidas
- materias escolhidas
- assuntos filtrados ou `todos`

Nao para ocupar a tela, mas para dar seguranca.

### 3. Estado vazio imediato

Se a combinacao atual zerar o banco:

- mostrar isso na hora
- oferecer:
  - `Voltar`
  - `Selecionar todas`
  - `Ir para especificar treino`

### 4. ENEM

Se ENEM ainda nao estiver pronto no banco:

- ele continua aparecendo no circulo
- mas com estado travado e etiqueta `em breve`

Assim o layout continua fiel ao conceito sem prometer algo quebrado.

### 5. Guardados

`Guardados` precisa aceitar os dois tipos:

- treino inteligente
- treino especifico

Cada item salvo deve permitir:

- `Consultar`
- `Refazer`
- `Renomear`
- `Duplicar`
- `Apagar`

### 6. Botao de fuga

Toda tela do fluxo inteligente precisa ter:

- `Voltar`
- `Ir para especificar treino`

Opcionalmente:

- `Fechar`

Isso reduz sensacao de aprisionamento.

---

## 5. Blocos de produto e objetivos

### Bloco A - Entrada do modulo

Objetivo:

- explicar o produto em poucos segundos
- reduzir ansiedade de escolha
- deixar claro que existem dois caminhos diferentes

### Bloco B - Treino inteligente

Objetivo:

- adaptar o estudo ao nivel real do usuario
- pedir o minimo possivel de configuracao
- manter o usuario em fluxo continuo

### Bloco C - Especificar treino

Objetivo:

- dar controle exato sobre o que sera respondido
- manter esse controle sem virar uma tela pesada
- validar a rota para evitar combinacoes quebradas

### Bloco D - Blocos salvos

Objetivo:

- permitir salvar um conjunto de questoes pronto
- permitir renomear, consultar, refazer e reutilizar
- funcionar tanto para treino inteligente quanto para treino especifico

### Bloco E - Runs e retomada

Objetivo:

- continuar uma sessao do ponto onde parou
- diferenciar `bloco salvo` de `sessao em andamento`
- evitar perda de contexto e de progresso

### Bloco F - Evolucao do conhecimento

Objetivo:

- medir desempenho por topico
- ajustar dificuldade, cadencia e reforco
- transformar resultado de sessao em insumo para a proxima

---

## 3. O que o usuario precisa ver na primeira tela

### Bloco principal

- titulo curto
- subtitulo explicando a diferenca entre os dois caminhos
- botao `Treino inteligente`
- botao `Especificar treino`

### Bloco secundario

- botao `Blocos salvos`
- botao `Retomar treino`
- botao `Voltar`

### Regra de UX

- nada de painel de stats grande na abertura
- nada de checklist visivel por padrao
- nada de dezenas de filtros antes de comecar
- a primeira tela precisa levar o usuario para a acao em 1 clique

---

## 4. Friccoes principais e como resolver

### Onde o usuario pode travar

- nao entender a diferenca entre os dois caminhos
- abrir a tela e ver filtro demais logo no inicio
- montar uma selecao que nao gera questoes
- nao saber se esta salvando um perfil, um bloco ou uma sessao
- querer refazer exatamente o mesmo conjunto depois
- ficar inseguro com a adaptacao automatica
- perder progresso ao sair no meio

### Solucoes diretas

- a home precisa usar linguagem simples:
  - `Treino inteligente`: "o sistema monta para voce"
  - `Especificar treino`: "voce escolhe exatamente o que quer responder"
- o treino inteligente deve trabalhar por exclusao, nao por configuracao detalhada
- o treino especifico deve abrir por etapas curtas, nao com tudo expandido de uma vez
- toda selecao precisa mostrar imediatamente:
  - quantas questoes existem
  - quantos assuntos ficaram ativos
  - se a sessao pode comecar
- salvar precisa ser dividido em 3 objetos distintos:
  - perfil
  - bloco salvo
  - run
- todo bloco salvo precisa ter duas acoes explicitas:
  - `Consultar`
  - `Refazer`
- o treino inteligente precisa explicar por que mudou de nivel
- sair da sessao precisa oferecer:
  - `Pausar e retomar depois`
  - `Encerrar`

---

## 5. Fluxo 1 - Treino inteligente

## Objetivo

Deixar o sistema montar e conduzir a sessao quase sozinho.

## O que o usuario faz

- entra em `Treino inteligente`
- remove o que nao quer estudar
- salva esse recorte se quiser
- escolhe se quer montar um bloco agora ou iniciar direto
- inicia

## O que o sistema faz

- detecta um ponto inicial seguro
- comeca em nivel facil ou intermediario leve, dependendo do historico
- observa acerto, erro, tempo e consistencia
- sobe dificuldade aos poucos
- se necessario, desce um pouco
- reinsere questoes faceis de tempos em tempos para fixacao
- reforca topicos fracos
- varia sem perder contexto

## Modelo de comportamento

```txt
introducao
-> consolidacao
-> aumento gradual
-> revisao espacada
-> nova subida
```

## Regra do motor adaptativo

Cada questao recebe peso a partir de:

- dificuldade atual do topico
- taxa recente de erro
- tempo medio de resposta
- recencia
- necessidade de fixacao
- variedade minima para nao repetir de forma burra

## Decisao importante

O treino inteligente nao escolhe topicos positivos.
Ele escolhe exclusoes.

Exemplo:

- remover `3a serie`
- remover `ENEM`
- remover `Quimica`

Todo o resto continua elegivel.

## O que precisa ficar fluido nesse fluxo

- o usuario nao precisa escolher serie, materia e assunto no detalhe
- o sistema mostra um resumo vivo do que ficou elegivel
- se houver historico suficiente, o sistema pode sugerir:
  - `Continuar de onde voce estava ficando melhor`
  - `Reforcar seus pontos fracos`
  - `Misturar para revisar`
- se nao houver historico, o sistema entra em `modo diagnostico leve`
  - 5 a 8 questoes
  - baixa dificuldade
  - variedade controlada

## Escolhas minimas permitidas

- quantidade:
  - `rapido`
  - `medio`
  - `longo`
- objetivo:
  - `continuar`
  - `reforcar`
  - `misturar`
- exclusoes:
  - serie
  - base
  - materia

## O que o sistema decide sozinho

- ordem das questoes
- distribuicao entre topicos elegiveis
- nivel inicial
- quando revisar um item facil
- quando subir ou descer dificuldade
- quando insistir num topico fraco

## Explicabilidade minima durante a sessao

Para o usuario confiar no modo inteligente, a interface precisa justificar as mudancas com frases curtas:

- `Subimos um pouco a dificuldade porque voce manteve consistencia`
- `Voltamos um passo para consolidar esse topico`
- `Revisando um ponto visto antes para fixacao`

---

## 6. Fluxo 2 - Especificar treino

## Objetivo

Dar controle total para quem quer montar a propria sessao.

## O que o usuario faz

- escolhe serie
- escolhe materia
- escolhe assunto
- escolhe exatamente o recorte da sessao
- opcionalmente define quantidade, foco, ordem e criterio de mistura

## Regra de UX

- manter a tela minima
- filtros avancados recolhidos
- botao `Limpar selecao`
- botao `Selecionar tudo`
- botao `Comecar`

## Observacao

Esse fluxo continua existindo, mas deixa de ser o fluxo principal do produto.

## Como evitar travas nesse fluxo

- transformar a selecao em etapas curtas:
  - `Serie`
  - `Materia`
  - `Assuntos`
  - `Ajustes`
- mostrar contagem viva apos cada escolha
- bloquear botao de iniciar apenas quando realmente houver zero questoes
- oferecer atalhos:
  - `Selecionar todos`
  - `Limpar`
  - `Somente assuntos prontos`

## Escolhas detalhadas disponiveis

- serie
- materia
- um ou varios assuntos
- foco principal
- quantidade de questoes
- estrategia de mistura
- ordem:
  - progressiva
  - equilibrada
  - aleatoria
- opcao de salvar como bloco

## Regra importante

O treino especifico deve preservar a sensacao de controle.
Se o usuario escolheu exatamente um bloco de assuntos, o sistema nao deve fugir desse recorte.
Ele pode apenas organizar melhor a ordem interna, nunca expandir silenciosamente a selecao.

---

## 7. Salvos: separar perfil, bloco e run

Essa separacao passa a ser obrigatoria.

Sem isso, o usuario nao entende o que esta salvando e o produto fica confuso.

### 1. Perfil

Significa:

- uma configuracao reutilizavel
- nao e uma lista fixa de questoes
- serve para montar sessao futura

Exemplos:

- `Treino inteligente sem quimica`
- `1a serie matematica focada`

### 2. Bloco salvo

Significa:

- um conjunto nomeado de questoes ou de recorte fechado
- pode ser consultado depois
- pode ser refeito depois
- existe para os dois fluxos

Exemplos:

- `Revisao numeros reais 01`
- `Bloco diagnostico matematica`
- `Mistura de assuntos fracos`

### 3. Run

Significa:

- uma sessao em andamento ou concluida
- guarda progresso, respostas e estado atual
- pode nascer de um perfil, de um bloco salvo ou de uma sessao criada na hora

---

## 8. Onde ficarao os salvos

Precisamos separar 5 tipos de persistencia.

### 1. Perfil de desempenho

Responsavel por stats de topico, acerto, erro e tempo.

Pode continuar em:

```txt
localStorage -> questions_profile_v3
```

### 2. Perfis salvos de treino inteligente

Novo armazenamento.

Sugestao:

```txt
localStorage -> questions_smart_profiles_v1
```

Cada perfil salvo deve guardar:

```ts
{
  id: string,
  name: string,
  createdAt: number,
  updatedAt: number,
  excludedSeries: number[],
  excludedBases: string[],
  excludedSubjects: string[],
  preferredAmount: number | null,
  notes?: string
}
```

### 3. Blocos salvos

Novo armazenamento central.

Sugestao:

```txt
localStorage -> questions_saved_blocks_v1
```

Cada bloco salvo deve guardar:

```ts
{
  id: string,
  name: string,
  mode: "smart" | "specific",
  createdAt: number,
  updatedAt: number,
  sourceProfileId?: string,
  routeSnapshot: object,
  questionIds?: string[],
  generationPolicy: "fixed" | "reroll_same_route",
  totalQuestions: number,
  notes?: string
}
```

Regra:

- `fixed`: refaz exatamente a mesma lista de questoes
- `reroll_same_route`: refaz o mesmo recorte, mas permite sortear outra combinacao equivalente

### 4. Treinos em andamento e concluidos

Novo armazenamento.

Sugestao:

```txt
localStorage -> questions_runs_v1
```

Cada run deve guardar:

```ts
{
  id: string,
  mode: "smart" | "specific",
  status: "in_progress" | "completed" | "abandoned",
  profileId?: string,
  savedBlockId?: string,
  routeSnapshot: object,
  questionIds: string[],
  currentIndex: number,
  answers: [],
  startedAt: number,
  updatedAt: number,
  completedAt?: number
}
```

### 5. Preferencias da interface

Novo armazenamento pequeno para UX.

Sugestao:

```txt
localStorage -> questions_ui_prefs_v1
```

Exemplo:

- ultimo modo aberto
- ultimo perfil inteligente usado
- ultimo bloco salvo usado
- filtros recolhidos ou abertos

---

## 9. Como salvar e refazer sem confundir

### Acoes que precisam existir nos dois fluxos

- `Iniciar agora`
- `Salvar bloco`
- `Salvar bloco e iniciar`

### Acoes que precisam existir em um bloco salvo

- `Abrir`
- `Renomear`
- `Consultar`
- `Refazer`
- `Duplicar`
- `Apagar`

### Diferenca entre consultar e refazer

- `Consultar`: abre resumo, assuntos, criterio e historico daquele bloco
- `Refazer`: inicia nova run a partir dele

### Regra de nomenclatura

Ao salvar, o sistema sugere nome automatico, mas sempre permite editar.

Exemplos:

- `Matematica 1a serie - numeros reais`
- `Treino inteligente - reforco de bases`
- `Bloco 8 questoes - razoes e proporcoes`

### Quando o usuario tenta sair sem nomear

- salvar com nome temporario
- marcar como `sem nome`
- abrir renomeacao rapida depois

---

## 10. O que faltava pensar e agora fica decidido

### Botao `Limpar selecao`

Vai existir em dois lugares:

- no treino inteligente, para remover todas as exclusoes
- no treino especifico, para zerar a selecao manual

### Botao `Salvar perfil`

Vai existir apenas no treino inteligente.

Permite:

- salvar
- renomear
- duplicar
- apagar

### Botao `Salvar bloco`

Vai existir nos dois fluxos.

Permite:

- salvar um conjunto pronto para consulta
- renomear
- refazer depois
- duplicar para criar variacoes

### Biblioteca de blocos

Precisa existir uma area unica chamada `Blocos salvos`.

Essa area lista:

- blocos do treino inteligente
- blocos do treino especifico
- ultima vez usado
- quantidade de questoes
- tipo de reproducao:
  - fixo
  - mesmo recorte com nova mistura

### Tela `Retomar treino`

Precisa dividir:

- `Em andamento`
- `Concluidos`
- `Abandonados` opcional depois

Cada item precisa permitir:

- retomar
- reiniciar
- visualizar resumo
- apagar

### Estado vazio

Se a combinacao removida deixar zero questoes disponiveis:

- mostrar aviso simples
- mostrar o que esta excluido
- oferecer `Limpar exclusoes`

### Estado de progresso

Durante a sessao, mostrar apenas:

- progresso
- assunto atual
- dificuldade
- enunciado
- respostas
- botao de sair ou pausar

Stats detalhadas ficam fora da tela principal.

---

## 11. Estrutura de telas

## Tela A - Entrada

- `Treino inteligente`
- `Especificar treino`
- `Blocos salvos`
- `Retomar treino`
- `Voltar`

## Tela B - Treino inteligente

- secoes de exclusao
  - series
  - bases
  - materias
- resumo da configuracao ativa
- sugestao de objetivo
- quantidade simples
- `Salvar perfil`
- `Salvar bloco`
- `Limpar exclusoes`
- `Comecar treino`

## Tela C - Perfis inteligentes salvos

- lista de perfis
- criar novo
- renomear
- duplicar
- apagar
- iniciar com perfil

## Tela D - Blocos salvos

- lista com busca
- filtro por tipo:
  - inteligente
  - especifico
- renomear
- consultar
- refazer
- duplicar
- apagar

## Tela E - Especificar treino

- serie
- materia
- assunto
- configuracoes opcionais recolhidas
- preview da rota
- `Salvar bloco`
- `Limpar selecao`
- `Comecar`

## Tela F - Retomar treino

- runs em andamento
- runs concluidas
- acoes de cada run

## Tela G - Sessao

- layout limpo
- feedback imediato
- proxima questao
- pausa simples

## Tela H - Consulta de bloco

- nome do bloco
- origem
- resumo da rota
- lista de assuntos
- total de questoes
- historico de execucoes
- `Refazer`

---

## 12. Regras de UX para manter fluidez

### Regra 1

Uma decisao por vez.

### Regra 2

Toda escolha precisa devolver feedback instantaneo:

- quantas questoes sobraram
- o que esta ativo
- se ja da para iniciar

### Regra 3

Nao mostrar campos avancados antes da hora.

### Regra 4

Tudo que puder virar botao de atalho deve virar:

- `Continuar`
- `Refazer`
- `Reforcar fracos`
- `Mesma rota`

### Regra 5

O usuario nunca deve perder algo por confundir conceito de produto.
Por isso:

- perfil configura
- bloco preserva
- run executa

---

## 13. Mapa executivo por blocos

### Bloco 1 - Fundacao tecnica

Objetivo:

- garantir que perfis, blocos e runs existam como base reutilizavel antes do refino visual

Status:

- [x] concluido

Feito:

- perfis inteligentes
- biblioteca de blocos
- runs com pausa e retomada
- persistencia local separada por tipo

### Bloco 2 - Entrada enxuta

Objetivo:

- reduzir a home para 3 caminhos visuais principais

Status:

- [ ] pendente no redesign

Feito antes:

- a home ja foi separada dos launchers internos

Falta agora:

- remover excesso de informacao visual
- deixar apenas `Treino inteligente`, `Especificar treino` e `Guardados` como botoes principais
- empurrar `Retomar treino` para acao secundaria

### Bloco 3 - Treino inteligente v2

Objetivo:

- trocar o launcher inteligente atual por telas em sequencia

Status:

- [ ] pendente

Etapas internas:

- [ ] Tela 1 - series e ENEM em circulos
- [ ] Tela 2 - materias em circulos
- [ ] Tela 3+ - assuntos por materia
- [ ] Tela final - quantidade, tempo e iniciar/guardar

### Bloco 4 - Especificar treino

Objetivo:

- manter o fluxo manual funcionando enquanto o novo inteligente entra

Status:

- [x] base pronta
- [ ] refino futuro

Feito:

- launcher detalhado ja esta isolado dentro de `Especificar treino`

Falta depois:

- simplificar os paines internos
- recolher configuracoes avancadas

### Bloco 5 - Guardados

Objetivo:

- centralizar consulta e reuso de blocos

Status:

- [x] base pronta
- [ ] consulta dedicada pendente

Feito:

- salvar
- renomear
- duplicar
- apagar
- refazer

Falta:

- tela propria de consulta detalhada do bloco

### Bloco 6 - Retomada

Objetivo:

- continuar sessoes interrompidas sem perda

Status:

- [x] concluido

Feito:

- runs em andamento
- runs concluidas
- pausar
- retomar
- reiniciar

### Bloco 7 - Motor adaptativo real

Objetivo:

- fazer o treino inteligente reagir de verdade ao desempenho

Status:

- [ ] pendente

### Bloco 8 - Refino visual e motion

Objetivo:

- dar personalidade ao fluxo circular e sensacao mecanica dos botoes

Status:

- [ ] pendente

---

## 14. Etapas de implementacao com check

### Etapa 1 - Estruturar os 3 conceitos do produto

Objetivo:

- separar `perfil`, `bloco salvo` e `run`

Status:

- [x] concluido

### Etapa 2 - Mover o fluxo manual para `Especificar treino`

Objetivo:

- impedir que a experiencia abra direto no modo detalhado

Status:

- [x] concluido

### Etapa 3 - Criar a persistencia reutilizavel

Objetivo:

- salvar o que precisa continuar existindo entre sessoes

Status:

- [x] concluido

Inclui:

- [x] perfis inteligentes
- [x] blocos salvos
- [x] runs

### Etapa 4 - Simplificar a home

Objetivo:

- deixar a abertura quase sem leitura

Status:

- [x] concluido

Entregas:

- [x] 3 botoes grandes
- [x] `Retomar treino` como acao secundaria
- [x] reduzir textos e remover cards informativos
- [x] mover `Busca direta por assunto` para dentro do fluxo `Rapido`

### Etapa 5 - Construir o wizard do treino inteligente

Objetivo:

- fazer o fluxo principal virar sequencia de decisoes curtas

Status:

- [ ] pendente

Entregas:

- [ ] tela de series/base
- [ ] tela de materias
- [ ] telas de assuntos por materia
- [ ] atalho `Ir direto para as questoes`
- [ ] acao `Excluir materia`

### Etapa 6 - Fechar os limites da sessao

Objetivo:

- permitir quantidade e tempo sem ambiguidade

Status:

- [~] parcialmente pronto

Entregas:

- [x] botoes 5, 15, 30, 50
- [x] tempo 15, 30, 60
- [x] campo digitavel
- [x] modo infinito
- [ ] regra do primeiro limite atingido

### Etapa 7 - Guardar e consultar melhor

Objetivo:

- fechar o ciclo do treino guardado

Status:

- [ ] parcialmente pronto

Entregas:

- [x] guardar bloco
- [x] renomear
- [x] refazer
- [ ] consulta detalhada
- [ ] guardar e iniciar na mesma acao

### Etapa 8 - Motion e polimento

Objetivo:

- fazer a interface parecer produto final e nao painel tecnico

Status:

- [ ] pendente

---

## 15. Checklist operacional atual

- [x] Criar home separada dos launchers internos
- [x] Mover o launcher detalhado para `Especificar treino`
- [x] Implementar a primeira versao do treino inteligente
- [x] Adicionar `Salvar perfil`
- [x] Criar a biblioteca `Blocos salvos`
- [x] Adicionar `Salvar bloco` no treino inteligente
- [x] Adicionar `Salvar bloco` no treino especifico
- [x] Adicionar acoes `Consultar`, `Refazer`, `Renomear` e `Duplicar`
- [x] Criar persistencia de `runs`
- [x] Criar a tela `Retomar treino`
- [x] Persistir sessoes em andamento
- [x] Simplificar a home para 3 botoes principais
- [ ] Implementar o wizard circular do treino inteligente
- [ ] Criar a tela dedicada de consulta de bloco
- [~] Implementar tempo e quantidade no novo fluxo inteligente
- [ ] Implementar o motor adaptativo por dificuldade e revisao
- [ ] Refinar a tela da sessao para ficar mais limpa

---

## 16. Criterio de pronto da proxima versao

A proxima versao passa a ser considerada boa quando:

- o usuario entra em `questions`
- ve apenas 3 escolhas principais
- entende o que fazer sem ler muito
- consegue atravessar o fluxo inteligente tela por tela
- consegue pular assuntos e ir direto para as questoes
- consegue guardar o treino antes de iniciar
- consegue achar esse treino depois em `Guardados`
- consegue refazer o mesmo treino
- consegue sair do fluxo inteligente para `Especificar treino` em qualquer etapa

---

## 17. Decisao operacional atual

```txt
Base tecnica pronta
Home seca concluida
Proxima entrega = concluir o wizard inteligente e fechar tempo/quantidade
```
