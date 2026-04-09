# STUDY OS - PLANO DO TREINO POR ASSUNTO

Documento de produto e execução.
Atualizado em 2026-04-09.

---

## 1. Direção fechada

Além do `Treino inteligente`, o launcher passa a ter uma nova entrada:

- `Treino por assunto`

Objetivo:

- permitir montagem rápida e visual de um treino sem cair no formulário completo do `Especificar treino`

Regra:

```txt
mais direto que o especificar treino
mais controlado que o treino inteligente
```

---

## 2. Posição no launcher

O `Treino por assunto` deve aparecer no mesmo local dos modos principais.

Estrutura recomendada da home:

- `Treino inteligente`
- `Treino por assunto`
- `Especificar treino`
- `Guardados`

Se o espaço visual ficar carregado:

- manter `Guardados` e `Retomar treino` como ações secundárias
- priorizar visualmente `Treino inteligente` e `Treino por assunto`

---

## 3. Fluxo principal

Tudo acontece na mesma aba, com layout dividido verticalmente.

### Lado esquerdo

Área de seleção guiada:

1. escolher `matéria`
2. escolher `assunto`
3. escolher `dificuldade`
4. escolher `quantidade`
5. clicar em `Aplicar`

Essa área deve ser escalonável:

- começa simples
- libera o próximo passo somente depois da escolha anterior

### Lado direito

Área de montagem do treino:

- lista das seleções já aplicadas
- cada item mostra:
  - matéria
  - assunto
  - dificuldade
  - quantidade
- ações por item:
  - `Alterar`
  - `Excluir`

Ao final da lista:

- botão `Incluir mais`
- botão `Consolidar treino`

---

## 4. Regra de uso

### Primeiro bloco

O usuário escolhe:

- matéria
- assunto
- dificuldade
- quantidade

Depois clica:

- `Aplicar`

Resultado:

- o bloco entra na lista lateral de montagem
- a área de seleção continua disponível para incluir outro bloco

### Inclusão de mais blocos

O usuário pode repetir o processo quantas vezes quiser.

Exemplo:

- Português > Interpretação de Texto > médio > 15
- Matemática > Razão e Proporção > difícil > 10
- História > Brasil Colônia > fácil > 8

### Edição

Cada item incluído precisa permitir:

- `Alterar assunto`
- `Excluir assunto`

Recomendação:

- ao clicar em `Alterar`, reabrir o seletor do lado esquerdo já preenchido com os dados daquele item
- ao clicar em `Excluir`, remover diretamente com feedback visual leve

---

## 5. Consolidação do treino

Quando o usuário terminar a montagem:

- clica em `Consolidar treino`

Ao consolidar:

- trava a composição da lista
- abre a etapa final de sessão
- permite adicionar temporizador

Opções recomendadas:

- `Sem temporizador`
- `5 min`
- `10 min`
- `15 min`
- `25 min`
- `30 min`
- `Personalizado`

Depois:

- `Começar treino`

---

## 6. Layout recomendado

Direção visual obrigatória:

- usar o layout já existente
- manter linguagem minimalista
- evitar poluição visual
- evitar excesso de bordas, textos auxiliares e painéis pesados

### Estrutura visual sugerida

- tela dividida ao meio na vertical
- lado esquerdo com o seletor escalonado
- lado direito com a composição do treino

### Princípios de interface

- poucos campos visíveis por vez
- botões pequenos e claros
- feedback visual discreto
- tipografia e espaçamento coerentes com o launcher atual
- nada de aparência de formulário corporativo

### Comportamento visual

- seleção precisa parecer leve e progressiva
- a pessoa deve enxergar tudo o que está montando sem trocar de tela
- os botões de ação devem ser minimalistas:
  - `Aplicar`
  - `Incluir mais`
  - `Alterar`
  - `Excluir`
  - `Consolidar treino`

---

## 7. Regras funcionais

### Matéria

- só mostrar matérias com questões prontas

### Assunto

- depende da matéria escolhida
- só mostrar assuntos válidos e com questões prontas

### Dificuldade

Faixas sugeridas:

- `Fácil`
- `Médio`
- `Difícil`
- `Misturar`

### Quantidade

Opções sugeridas:

- `5`
- `10`
- `15`
- `20`
- `30`
- `50`

### Aplicação

`Aplicar` só habilita quando os quatro pontos estiverem definidos:

- matéria
- assunto
- dificuldade
- quantidade

### Consolidação

`Consolidar treino` só habilita se houver pelo menos um item montado.

---

## 8. Relação com os modos já existentes

### Treino inteligente

- continua sendo o modo de automação principal

### Treino por assunto

- entra como modo intermediário
- atende quem quer escolher foco sem abrir filtros avançados

### Especificar treino

- continua existindo como modo completo e manual

Regra de produto:

```txt
inteligente = o sistema decide mais
por assunto = o usuário escolhe o foco rápido
especificar = o usuário controla tudo
```

---

## 9. Direção técnica sugerida

Implementar em blocos curtos:

### Bloco 1

- adicionar entrada `Treino por assunto` no launcher
- criar rota e estado base
- renderizar layout dividido ao meio

### Bloco 2

- implementar seletor escalonado:
  - matéria
  - assunto
  - dificuldade
  - quantidade

### Bloco 3

- implementar painel de composição:
  - aplicar item
  - incluir mais
  - excluir
  - alterar

### Bloco 4

- implementar `Consolidar treino`
- montar preview final
- acoplar temporizador embutido

### Bloco 5

- integrar com guardados e runs
- validar consistência com `resume` e `saved`

---

## 10. Arquivos que provavelmente serão tocados

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

- criar módulo próprio para o novo fluxo em vez de concentrar tudo em `questions.js`

---

## 11. Próximo passo recomendado

Quando retomar esta frente:

1. encaixar o card `Treino por assunto` no launcher sem quebrar o visual atual
2. criar apenas a estrutura visual dividida ao meio
3. fazer primeiro a montagem local sem temporizador
4. só depois ligar `Consolidar treino` e o timer
