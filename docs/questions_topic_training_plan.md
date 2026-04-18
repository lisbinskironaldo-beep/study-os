# ROTANOTA - PLANO DO MONTAR SIMULADO

Documento de produto e execucao.
Atualizado em 2026-04-09.

---

## 1. Direcao fechada

O antigo fluxo de `Treino por assunto` deixa de ser tratado como modo principal da home.

Ele passa a ser a base de montagem dentro de:

- `Simulado > Montar simulado`

Objetivo:

- permitir montagem rapida e visual de blocos de simulado sem cair num configurador pesado

Regra:

```txt
mais direto que um configurador completo
mais controlado que o treino inteligente
```

---

## 2. Posicao no produto

Estrutura recomendada:

- `Home`
  - `Rapido`
  - `Inteligente`
  - `Simulado`
  - `Progresso`
- `Simulado`
  - `Montar simulado`
  - `Prova pronta (em breve)`

Dentro de `Montar simulado`, entra a logica deste documento.

---

## 3. Fluxo principal

Tudo acontece na mesma aba, com layout dividido verticalmente.

### Lado esquerdo

Area de selecao guiada:

1. escolher `materia`
2. escolher `assunto`
3. escolher `dificuldade`
4. escolher `quantidade`
5. clicar em `Aplicar`

Essa area deve ser escalonavel:

- comeca simples
- libera o proximo passo somente depois da escolha anterior

### Lado direito

Area de montagem do simulado:

- lista das selecoes ja aplicadas
- cada item mostra:
  - materia
  - assunto
  - dificuldade
  - quantidade
- acoes por item:
  - `Alterar`
  - `Excluir`

Ao final da lista:

- botao `Incluir mais`
- botao `Consolidar simulado`

---

## 4. Regra de uso

### Primeiro bloco

O usuario escolhe:

- materia
- assunto
- dificuldade
- quantidade

Depois clica:

- `Aplicar`

Resultado:

- o bloco entra na lista lateral de montagem
- a area de selecao continua disponivel para incluir outro bloco

### Inclusao de mais blocos

O usuario pode repetir o processo quantas vezes quiser.

Exemplo:

- Portugues > Interpretacao de Texto > medio > 15
- Matematica > Razao e Proporcao > dificil > 10
- Historia > Brasil Colonia > facil > 8

### Edicao

Cada item incluido precisa permitir:

- `Alterar assunto`
- `Excluir assunto`

Recomendacao:

- ao clicar em `Alterar`, reabrir o seletor do lado esquerdo ja preenchido com os dados daquele item
- ao clicar em `Excluir`, remover diretamente com feedback visual leve

---

## 5. Consolidacao do simulado

Quando o usuario terminar a montagem:

- clica em `Consolidar simulado`

Ao consolidar:

- trava a composicao da lista
- abre a etapa final de sessao
- permite adicionar temporizador

Opcoes recomendadas:

- `Sem temporizador`
- `5 min`
- `10 min`
- `15 min`
- `25 min`
- `30 min`
- `Personalizado`

Depois:

- `Comecar simulado`

---

## 6. Layout recomendado

Direcao visual obrigatoria:

- usar o layout ja existente
- manter linguagem minimalista
- evitar poluicao visual
- evitar excesso de bordas, textos auxiliares e paineis pesados

### Estrutura visual sugerida

- tela dividida ao meio na vertical
- lado esquerdo com o seletor escalonado
- lado direito com a composicao do simulado

### Principios de interface

- poucos campos visiveis por vez
- botoes pequenos e claros
- feedback visual discreto
- tipografia e espacamento coerentes com o launcher atual
- nada de aparencia de formulario corporativo

### Comportamento visual

- a selecao precisa parecer leve e progressiva
- a pessoa deve enxergar tudo o que esta montando sem trocar de tela
- os botoes de acao devem ser minimalistas:
  - `Aplicar`
  - `Incluir mais`
  - `Alterar`
  - `Excluir`
  - `Consolidar simulado`

---

## 7. Regras funcionais

### Materia

- so mostrar materias com questoes prontas

### Assunto

- depende da materia escolhida
- so mostrar assuntos validos e com questoes prontas

### Dificuldade

Faixas sugeridas:

- `Facil`
- `Medio`
- `Dificil`
- `Misturar`

### Quantidade

Opcoes sugeridas:

- `5`
- `10`
- `15`
- `20`
- `30`
- `50`

### Aplicacao

`Aplicar` so habilita quando os quatro pontos estiverem definidos:

- materia
- assunto
- dificuldade
- quantidade

### Consolidacao

`Consolidar simulado` so habilita se houver pelo menos um item montado.

---

## 8. Relacao com os modos principais

### Rapido

- continua sendo a entrada mais curta do produto

### Inteligente

- continua sendo o modo de automacao principal

### Simulado

- vira o lugar oficial da montagem manual por assunto
- concentra `Montar simulado` e `Prova pronta`

### Progresso

- fica como hub de estatisticas
- nao compete com o inicio de treino

---

## 9. Direcao tecnica sugerida

Implementar em blocos curtos:

### Bloco 1

- adicionar entrada `Simulado` no launcher
- criar tela inicial com `Montar simulado` e `Prova pronta (em breve)`
- criar rota e estado base do builder

### Bloco 2

- implementar seletor escalonado:
  - materia
  - assunto
  - dificuldade
  - quantidade

### Bloco 3

- implementar painel de composicao:
  - aplicar item
  - incluir mais
  - excluir
  - alterar

### Bloco 4

- implementar `Consolidar simulado`
- montar preview final
- acoplar temporizador embutido

### Bloco 5

- integrar com guardados e runs
- validar consistencia com `resume` e `saved`

---

## 10. Arquivos que provavelmente serao tocados

- `questions/questions.js`
- `questions/questions.ui.js`
- `questions/questions.css`
- `questions/questions.context.js`
- `questions/questions.service.js`
- `questions/app/application/routeUseCases.mjs`
- `questions/app/application/launcherSelectors.mjs`
- `questions/app/application/launcherViewModels.mjs`
- `questions/app/application/libraryUseCases.mjs`

Se a frente crescer:

- criar modulo proprio para o novo fluxo em vez de concentrar tudo em `questions.js`

---

## 11. Proximo passo recomendado

Quando retomar esta frente:

1. encaixar o card `Simulado` no launcher sem quebrar o visual atual
2. criar a estrutura visual dividida ao meio para `Montar simulado`
3. fazer primeiro a montagem local sem temporizador
4. so depois ligar `Consolidar simulado` e o timer
