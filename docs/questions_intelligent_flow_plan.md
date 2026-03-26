# STUDY OS - PLANO DO NOVO FLUXO DE QUESTOES

Documento interno de arquitetura e execucao.
Baseado na decisao de simplificar a entrada do modulo em dois caminhos:

- `Treino inteligente`
- `Especificar treino`

Atualizado em 2026-03-26.

---

## 1. Direcao fechada

O modulo `questions` deixa de abrir com muitos filtros visiveis.
Ele passa a abrir com uma tela inicial simples, com duas escolhas principais:

- `Treino inteligente`
- `Especificar treino`

Elementos secundarios:

- `Retomar treino`
- `Voltar`

Regra de produto:

```txt
menos decisao no primeiro contato
mais automacao no fluxo principal
controle manual apenas quando o usuario quiser
```

---

## 2. O que o usuario precisa ver na primeira tela

### Bloco principal

- titulo curto
- subtitulo explicando a diferenca entre os dois caminhos
- botao `Treino inteligente`
- botao `Especificar treino`

### Bloco secundario

- botao `Retomar treino`
- botao `Voltar`

### Regra de UX

- nada de painel de stats grande na abertura
- nada de checklist visivel por padrao
- nada de dezenas de filtros antes de comecar
- a primeira tela precisa levar o usuario para a acao em 1 clique

---

## 3. Fluxo 1 - Treino inteligente

## Objetivo

Deixar o sistema montar e conduzir a sessao quase sozinho.

## O que o usuario faz

- entra em `Treino inteligente`
- remove o que nao quer estudar
- salva esse recorte se quiser
- inicia

## O que o sistema faz

- comeca em nivel facil
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
-> revisao espaçada
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

---

## 4. Fluxo 2 - Especificar treino

## Objetivo

Dar controle total para quem quer montar a propria sessao.

## O que o usuario faz

- escolhe serie
- escolhe materia
- escolhe assunto
- opcionalmente define quantidade de questoes e foco

## Regra de UX

- manter a tela minima
- filtros avancados recolhidos
- botao `Limpar selecao`
- botao `Selecionar tudo`
- botao `Comecar`

## Observacao

Esse fluxo continua existindo, mas deixa de ser o fluxo principal do produto.

---

## 5. Onde ficarao os salvos

Precisamos separar 4 tipos de persistencia.

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

### 3. Treinos em andamento e concluidos

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
  routeSnapshot: object,
  questionIds: string[],
  currentIndex: number,
  answers: [],
  startedAt: number,
  updatedAt: number,
  completedAt?: number
}
```

### 4. Preferencias da interface

Novo armazenamento pequeno para UX.

Sugestao:

```txt
localStorage -> questions_ui_prefs_v1
```

Exemplo:

- ultimo modo aberto
- ultimo perfil inteligente usado
- filtros recolhidos ou abertos

---

## 6. O que faltava pensar e agora fica decidido

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

## 7. Estrutura de telas

## Tela A - Entrada

- `Treino inteligente`
- `Especificar treino`
- `Retomar treino`
- `Voltar`

## Tela B - Treino inteligente

- secoes de exclusao
  - series
  - bases
  - materias
- resumo da configuracao ativa
- `Salvar perfil`
- `Limpar exclusoes`
- `Comecar treino`

## Tela C - Perfis inteligentes salvos

- lista de perfis
- criar novo
- renomear
- duplicar
- apagar
- iniciar com perfil

## Tela D - Especificar treino

- serie
- materia
- assunto
- configuracoes opcionais recolhidas
- `Limpar selecao`
- `Comecar`

## Tela E - Retomar treino

- runs em andamento
- runs concluidas
- acoes de cada run

## Tela F - Sessao

- layout limpo
- feedback imediato
- proxima questao

---

## 8. Etapas de implementacao

### Etapa 1 - Reestruturar a entrada

Objetivo:

- substituir o launcher atual por uma home de 2 caminhos

Entregas:

- tela inicial nova
- botoes `Treino inteligente`, `Especificar treino`, `Retomar treino`, `Voltar`
- esconder stats pesadas da abertura

### Etapa 2 - Implementar o configurador de treino inteligente

Objetivo:

- permitir exclusao por serie, base e materia

Entregas:

- botao `Limpar exclusoes`
- resumo do recorte ativo
- validacao para nao deixar zero questoes

### Etapa 3 - Salvar perfis inteligentes

Objetivo:

- deixar recortes reutilizaveis

Entregas:

- salvar perfil
- renomear
- duplicar
- apagar
- iniciar perfil salvo

### Etapa 4 - Runs e retomada

Objetivo:

- permitir pausar, voltar e continuar depois

Entregas:

- persistencia de runs
- tela `Retomar treino`
- status `em andamento` e `concluido`

### Etapa 5 - Motor adaptativo real

Objetivo:

- fazer o treino inteligente agir como progressao orientada por desempenho

Entregas:

- entrada em dificuldade baixa
- subida gradual
- revisao espaçada
- reinjecao de itens faceis
- foco em topicos fracos

### Etapa 6 - Refino de UX

Objetivo:

- deixar tudo mais leve e confiavel

Entregas:

- microanimacoes discretas
- feedback de selecao limpo
- tela de sessao ainda mais enxuta

---

## 9. Checklist operacional

- [ ] Criar a nova tela de entrada com 2 caminhos
- [ ] Mover o launcher detalhado para `Especificar treino`
- [ ] Implementar a tela de exclusoes do treino inteligente
- [ ] Adicionar `Limpar exclusoes`
- [ ] Adicionar `Salvar perfil`
- [ ] Criar o storage `questions_smart_profiles_v1`
- [ ] Criar o storage `questions_runs_v1`
- [ ] Criar a tela `Retomar treino`
- [ ] Persistir sessoes em andamento
- [ ] Implementar o motor adaptativo por dificuldade e revisao
- [ ] Refinar a tela da sessao para ficar mais limpa

---

## 10. Criterio de pronto da primeira versao boa

A versao passa a ser considerada boa quando:

- o usuario entra em `questions`
- entende as 2 opcoes em menos de 3 segundos
- consegue iniciar um treino inteligente em no maximo 2 a 3 cliques
- consegue salvar um perfil de treino
- consegue retomar uma sessao inacabada
- o treino sobe dificuldade sem parecer aleatorio

---

## 11. Decisao final desta etapa

```txt
Fluxo principal = Treino inteligente
Fluxo secundario = Especificar treino
```

Essa passa a ser a base da proxima implementacao.
