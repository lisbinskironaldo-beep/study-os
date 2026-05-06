# PAPIRO_TOOLS - PREMIUM STUDY - CONSTITUICAO DO PRODUTO

Documento oficial e autoritativo do modulo `Premium Study`.

Status:
- vigente
- imutavel como base de produto
- referencia obrigatoria para qualquer GPT, programador ou agente que atue nesta frente

Atualizado em 2026-04-16.

---

## 1. Natureza deste documento

Este documento funciona como a lei principal do produto.

Se houver conflito entre:
- conversa antiga
- implementacao improvisada
- preferencia local
- atalho visual
- atalho tecnico

vence este documento, salvo quando existir revisao oficial escrita que o substitua.

Regra operacional:

```txt
nenhuma fase de execucao pode contrariar esta constituicao
sem criar uma revisao oficial deste mesmo documento
```

---

## 2. Missao do produto

O `Premium Study` existe para transformar um material de estudo em uma trilha pessoal, clara e recompensadora.

O estudante deve sentir que:
- o ambiente foi preparado para ele
- o sistema entendeu seu material
- existe um caminho objetivo
- cada escolha constroi algo real
- estudar ali e mais organizado, mais leve e mais valioso

Missao em uma frase:

```txt
receber um PDF valido, entender o objetivo do estudante
e devolver uma trilha pessoal de estudo com foco em resultado
```

---

## 3. Pilares obrigatorios

### 3.1 Direcionamento

Cada tela deve responder:
- onde estou?
- o que ja foi decidido?
- qual e o proximo passo?

### 3.2 Individualizacao percebida

O aluno deve sentir que o espaco e dele.

Isso precisa aparecer em:
- nome do estudo
- mensagens de progresso
- data da prova
- meta de nota
- tempo diario
- bloco recomendado
- retomada de estudo

### 3.3 Recompensa visual madura

O produto deve ser satisfatorio sem parecer infantil.

Nao usar:
- confetes
- medalhas caricatas
- mascotes
- linguagem excessivamente fofa

Usar:
- progresso visivel
- preenchimento elegante
- confirmacoes suaves
- profundidade visual discreta
- estados de conclusao claros

### 3.4 Leveza e desacoplamento

Nada desta frente deve nascer preso ao modulo `questions`.

O modulo precisa:
- carregar sozinho
- salvar sozinho
- evoluir sozinho
- poder mudar sem quebrar o restante do site

### 3.5 Excelencia com custo controlado

Regra:

```txt
usar IA apenas onde a IA muda o resultado
todo o resto deve ser local, cacheado ou simplificado
```

### 3.6 Uma decisao por tela

Regra central de UX:

```txt
uma tela deve conduzir uma decisao principal
sem competir com blocos redundantes ou explicacoes desnecessarias
```

---

## 4. Escopo oficial

O produto recebe:
- PDF textual valido
- data da prova
- meta de nota
- tempo diario disponivel

O produto devolve:
- trilha inicial
- modos de entrada no conteudo
- mapa de assuntos clicaveis
- estudo por bloco
- pratica por bloco
- mini prova por bloco
- documento com marcador de texto
- exportacao em PDF do marcador no premium
- retomada de estudo
- biblioteca premium de materiais

O produto nao precisa ter neste momento:
- chat livre
- podcast
- OCR completo
- importacao de imagem
- multiplos arquivos em um unico plano
- estatisticas avancadas
- IA, billing e acesso premium finalizados

As frentes de IA externa, pagamentos e monetizacao ficam para etapa posterior.

---

## 5. Regra de nao acoplamento

O `Premium Study` nao deve nascer dentro de `questions`.

Ele deve existir como modulo proprio, com:
- `bootstrap`
- `app`
- `router`
- `state`
- `storage`
- `services`
- `ui`
- `styles`

Separacoes obrigatorias:
- parser de PDF nao conhece billing
- billing nao conhece UI
- UI nao chama IA direto
- motor de questoes nao depende do motor de flashcards
- storage nao depende do layout

Regra:

```txt
nenhum arquivo central gigantesco deve acumular regra, UI e persistencia ao mesmo tempo
```

---

## 6. Lugar oficial no site

Decisao fechada:
- entra como card proprio na home principal
- nao fica dentro de `questions`
- usa container proprio no `moduleArea`
- carrega por lazy-load

Estrutura recomendada:
- card na home: `PDF Focado`
- container dedicado: `#premiumStudyModule`

---

## 7. Protocolo de consulta obrigatoria

Qualquer agente que atuar nesta frente deve ler primeiro:
1. `docs/premium_study_constituicao_produto.md`
2. `docs/premium_study_fases_execucao.md`

O documento `docs/premium_study_operacao_ai_pagamentos.md` volta a ser obrigatorio apenas quando a execucao entrar em IA, billing, monetizacao e acesso premium.

Regra:

```txt
ninguem implementa nada nesta frente sem consultar estes documentos oficiais
```

---

## 8. Fluxo oficial do produto

Fluxo principal fechado:

1. entrada do modulo
2. carregar PDF
3. definir data da prova
4. definir nota desejada
5. definir horas e minutos por dia
6. processamento do plano
7. escolha do modo inicial
8. escolher entre aprender, praticar, prova ou marcar
9. mapa de assuntos
10. resumo focado do assunto
11. pratica por bloco
12. mini prova do bloco
13. trilha geral, retomada e biblioteca premium

Regra:

```txt
o usuario nao deve configurar a mesma coisa em duas telas diferentes
```

Exemplos de redundancia proibida:
- pedir materia manual depois do PDF
- pedir prazo novamente dentro do bloco
- mostrar dois paineis grandes competindo com a acao principal

---

## 9. Entrada oficial do fluxo

### 9.1 Primeira vez

A primeira tela nao e uma landing explicativa.

Ela deve mostrar:
- `Carregar PDF`

### 9.2 Depois que o usuario ja usou uma vez

A primeira tela passa a mostrar:
- `Carregar PDF`
- `Retomar ultimo estudo`
- `Biblioteca premium`

### 9.3 Salvamento

O sistema salva automaticamente o ultimo estudo localmente.

Campos minimos salvos:
- nome do arquivo
- nome do estudo
- data da prova
- meta de nota
- horas por dia
- minutos por dia
- etapa atual
- ultimo acesso
- bloco ativo
- sessoes de pratica
- estrutura dos assuntos
- estado do documento marcado quando existir

---

## 10. Telas oficiais do onboarding

### 10.1 Tela 1 - Entrada

Objetivo:
- iniciar novo estudo
- retomar o ultimo estudo salvo

Elementos obrigatorios:
- card `Carregar PDF`
- card `Retomar ultimo estudo` quando existir estudo salvo
- card `Biblioteca premium`
- nota discreta sobre limites do plano gratis

Regras:
- `Biblioteca premium` pode aparecer bloqueada visualmente quando o plano nao estiver ativo
- a entrada nao deve parecer landing explicativa
- a prioridade visual continua sendo `Carregar PDF`

### 10.2 Tela 2 - Data da prova

Pergunta oficial:

```txt
Qual a data da prova?
```

Regras:
- calendario navegavel por mes e ano
- navegacao de mes em posicao fixa
- dia selecionado com destaque forte
- dias ate a prova com a mesma familia de cor, mais suave
- sem painel grande competindo com a acao
- avancar por seta lateral
- voltar so no topo

### 10.3 Tela 3 - Meta de nota

Pergunta oficial:

```txt
Qual nota voce quer tirar?
```

Regras:
- seletor circular arrastavel
- anel com tamanho proporcional a cada breakpoint
- numero central proporcional ao anel
- sem botoes `+` e `-`
- avancar por seta lateral
- voltar so no topo

### 10.4 Tela 4 - Tempo diario

Pergunta oficial:

```txt
Quanto tempo por dia voce vai ter para estudar?
```

Regras:
- dois seletores circulares
- um para horas
- um para minutos
- os dois devem ficar lado a lado
- devem reduzir proporcionalmente em telas menores
- sem botoes `+` e `-`
- avancar por seta lateral
- voltar so no topo

### 10.5 Tela 5 - Processamento

Objetivo:
- mostrar que o sistema esta trabalhando

Elementos obrigatorios:
- barra central estilizada
- frase personalizada com meta e data
- etapas curtas de processamento
- sem botoes embaixo
- apenas `fechar` no topo

### 10.6 Tela 6 - Modo inicial

Pergunta oficial:

```txt
Como voce quer comecar agora?
```

Elementos obrigatorios:
- quatro opcoes lado a lado:
  - `Aprender`
  - `Praticar`
  - `Prova`
  - `Marcar`
- resumo compacto do plano
- botao `Voltar` no topo

Regras:
- as quatro opcoes continuam legiveis e clicaveis sem perder hierarquia
- o resumo e informativo, nao pode parecer botao
- no desktop o resumo pode aparecer mais aberto
- em telas menores o resumo deve ser compacto

---

## 11. Telas oficiais depois do onboarding

### 11.1 Aprender

Elementos obrigatorios:
- mapa de assuntos clicaveis
- abertura de um assunto por vez
- modo full-screen de leitura
- rolagem liberada
- coluna central de leitura
- resumo focado em resultado
- conceitos-chave, pontos quentes e armadilhas comuns dentro do proprio assunto
- acao contextual para:
  - `Explicar melhor este assunto`
  - `Revisar este assunto em 5 pontos`
  - `Mini prova deste assunto`
  - `Proximo assunto`

Regra:
- a tela `Aprender` nao deve carregar paineis informativos grandes competindo com o conteudo
- o foco principal e leitura guiada do assunto atual

### 11.2 Praticar

Tela de entrada da pratica:
- `Questionario`
- `Verdadeiro ou falso`
- `Flashcards`

Cada formato deve abrir sua propria tela.

Regras:
- nao usar painel `Plano em construcao` dentro da pratica
- os tres formatos entram como cards simples
- cada card mostra preenchimento visual de progresso no estilo `copo enchendo`
- o sistema calcula quantidade base necessaria para concluir o treino do assunto
- formatos podem oferecer `Gerar mais no premium`

Flashcards:
- devem priorizar mnemônicos, gatilhos, contraste e memorizacao ativa
- nao devem parecer simples lista do que estudar

### 11.3 Prova

Mini prova do bloco com:
- titulo do bloco
- geracao base de `10 questoes`
- tempo opcional
- resultado final

Regra:
- gerar acima do pacote base fica reservado ao premium

### 11.4 Trilha geral

Lista dos blocos gerados com:
- nome
- tempo estimado
- prioridade
- status
- acao principal `Continuar`

### 11.5 Retomada

Tela para retomar estudos salvos.

Regras:
- gratis retoma o ultimo estudo local
- premium retoma historico expandido pela biblioteca
- retomar deve abrir no ponto salvo, e nao reiniciar o fluxo

### 11.6 Biblioteca premium

Tela para listar PDFs e estudos ja carregados.

Regras:
- mostra lista de materiais salvos
- permite abrir um material salvo
- pode ficar bloqueada visualmente fora do premium
- funciona como centro de historico, nao como entrada principal

---

## 12. Regras visuais obrigatorias

### 12.1 Topo padrao

Cada tela guiada deve manter:
- voltar no topo quando fizer sentido
- progresso ou label no topo
- fechar no topo

### 12.2 Base limpa

Regra:

```txt
nao deixar barra de botoes grandes embaixo nas etapas guiadas
quando a tela usar seta lateral de avancar
```

### 12.3 Centralizacao com seta lateral

Quando houver seta lateral de avancar:
- o conteudo principal deve permanecer visualmente centralizado
- a seta nao pode empurrar o conteudo para a esquerda

### 12.4 Responsividade

Regra:

```txt
se a tela diminuir
blocos, tipografia e controles precisam diminuir juntos
sem quebrar, sobrepor ou exigir rolagem desnecessaria
```

### 12.5 Informacao x acao

Contexto informativo:
- menor peso visual
- menos contraste
- menos altura
- sem cara de botao

Acao principal:
- destaque claro
- leitura imediata
- prioridade visual absoluta

---

## 13. Persistencia oficial

O que deve ser salvo automaticamente:
- material
- data da prova
- meta de nota
- horas e minutos diarios
- etapa atual
- bloco ativo
- modo selecionado
- ultimo acesso
- biblioteca local de estudos
- sessoes de pratica e mini prova
- estrutura enriquecida dos blocos
- documento marcado quando ja tiver sido gerado

O que pode ficar para depois:
- historico multiestudo em nuvem
- sincronizacao entre dispositivos
- estatisticas premium

---

## 14. Regra de continuidade

Esta frente esta autorizada a seguir para as proximas fases de produto e UX.

As frentes abaixo ficam deliberadamente adiadas:
- IA externa final
- monetizacao
- billing
- acesso premium real
- analytics avancado

Regra:

```txt
primeiro consolidar fluxo, telas, blocos e experiencia
depois entrar nas frentes operacionais e comerciais
```

---

## 15. Mudancas consolidadas em 2026-04-16

As mudancas abaixo ja passaram a fazer parte do produto e devem ser consideradas oficiais:

- entrada com `Carregar PDF`, `Retomar ultimo estudo` e `Biblioteca premium`
- modo inicial com quarta opcao `Marcar`
- modo `Documento com marcador de texto`
- exportacao em PDF dos destaques no premium
- mapa de assuntos clicaveis antes do resumo focado
- `Aprender` em full-screen, com rolagem liberada e leitura central
- pratica sem painel informativo grande, com progresso visual por formato
- flashcards orientados a mnemônicos e gatilhos
- mini prova com geracao base de 10 questoes
- biblioteca premium separada da retomada simples do ultimo estudo
