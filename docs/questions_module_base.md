# ROTANOTA - DOCUMENTO BASE DO MODULO DE QUESTOES

Documento interno de consulta.
Nao deve aparecer na interface do produto.

---

## Blocos de implantacao

### Bloco 1. Fundacao do modulo

Objetivo:
- Separar claramente `questions`, `simulado`, `stats` e `engine`.
- Garantir que o treino seja rapido, direto e mensuravel.
- Preparar a base para escalar sem retrabalho.

Entregas:
- arquitetura global definida
- ciclo de execucao validado
- sessao de treino basica
- stats minimos por topico

---

### Bloco 2. Banco escolar

Objetivo:
- Estruturar apenas Ensino Medio primeiro.
- Organizar por serie, materia, unidade e topico.
- Definir padrao unico para entrada de questoes.

Entregas:
- modelo de dados da questao
- tipos de questao obrigatorios
- padrao de conteudo
- template operacional para ingestao

---

### Bloco 3. Inteligencia pedagogica

Objetivo:
- Fazer o sistema decidir a proxima questao com base em erro, recencia e dificuldade.
- Medir dominio por topico em vez de usar so acerto bruto.
- Alimentar progresso real do usuario.

Entregas:
- engine de selecao inteligente
- sistema de stats por topico
- nivel de dominio
- feedback e progressao por topico

---

### Bloco 4. Retencao e continuidade

Objetivo:
- Criar continuidade de estudo sem transformar em joguinho vazio.
- Reforcar revisao, meta diaria e progresso concreto.

Entregas:
- notificacoes
- revisao automatica
- reforco de topicos fracos
- progresso visivel por dominio

---

### Bloco 5. Readiness para simulado e ENEM

Objetivo:
- Manter `questions` e `simulado` como fluxos diferentes.
- Deixar o schema pronto para receber questoes ENEM depois.
- Evitar retrabalho quando a camada oficial entrar.

Entregas:
- arquitetura separada de simulado
- integracao do simulado com stats
- campos `sourceType`, `sourceYear` e `competencies`
- estrutura pronta para ingestao futura de ENEM

---

# 1. PRINCIPIO CENTRAL

```txt
O sistema NAO e sobre responder perguntas.
E sobre evolucao mensuravel por dominio de conteudo.
```

- foco: dominio real
- nao: entretenimento vazio
- experiencia: direta, rapida, progressiva

---

# 2. ARQUITETURA GLOBAL

```txt
QUESTIONS (treino)
SIMULADO (ENEM / prova)
STATS (inteligencia)
ENGINE (decisao)
```

Separacao obrigatoria:

- `/questions` -> treino adaptativo
- `/simulado` -> prova realista (isolado)
- `/stats` -> dados do usuario
- `/engine` -> selecao inteligente

---

# 2.1. DIRETRIZ DE PRODUTO PARA TREINO PERSONALIZADO

O modulo de questoes precisa atender, de forma estrutural, quatro comportamentos de estudo:

- treino por assunto unico
- treino por multiplos assuntos
- treino com reforco em assunto prioritario
- treino para prova

Esses comportamentos nao devem ser tratados como filtro visual solto.
Devem ser tratados como parte formal do motor de treino, do contexto de sessao e da logica de selecao do `ENGINE`.

Regra estrutural:

```txt
launcher define o contexto
ENGINE interpreta o modo
QUESTIONS executa a sessao
STATS registra o comportamento
```

---

# 3. MODELO DE DADOS (QUESTAO)

```ts
{
  id: string,

  // organizacao
  base: "ESCOLAR" | "ENEM",
  serie: 1 | 2 | 3,
  materia: string,
  unidade: string,
  topico: string,
  subtopico?: string,

  // controle pedagogico
  dificuldade: 1 | 2 | 3,
  cognicao: "calculo" | "interpretacao" | "estrategia",

  // tipo de interacao
  tipo: "multipla_escolha" | "input" | "ordenacao" | "comparacao" | "vf",

  enunciado: string,
  opcoes?: string[],
  respostaCorreta: any,

  explicacao: string,

  // metadados
  tempoEsperado: number,
  tags: string[],
  habilidades?: string[],
  collections?: string[],
  status?: "rascunho" | "revisada",

  // ENEM ready
  sourceType?: "original" | "enem_oficial" | "enem_autoral",
  sourceExam?: "enem",
  sourceYear?: number,
  competencies?: string[]
}
```

---

# 4. TIPOS DE QUESTAO (OBRIGATORIO)

### 1. multipla escolha

- base do sistema

### 2. input

- elimina chute
- exige dominio

### 3. ordenacao

- ideal para numeros reais, cronologia, processos

### 4. comparacao

- "qual maior", "qual menor"

### 5. verdadeiro/falso

- valida conceito

---

# 5. CICLO DE EXECUCAO (CORE LOOP)

```txt
carregar questao
↓
resposta do usuario
↓
feedback imediato
↓
explicacao curta
↓
proxima questao
```

Regras:

- sem telas extras
- sem delay desnecessario
- fluxo continuo

---

# 6. SESSAO DE TREINO

```txt
3 / 5 / 8 questoes
```

Config base:

```ts
{
  mode: "ASSUNTO_UNICO" | "ASSUNTOS_COMBINADOS" | "REFORCO_DIRECIONADO" | "TREINO_PARA_PROVA",
  base: "ESCOLAR",
  serie: 1,
  materia: string,
  topicos: [],
  focoPrincipal: null,
  pesos: {},
  quantidadeQuestoes: 5,
  estrategiaMistura: "equilibrada" | "foco_principal" | "alternada" | "adaptativa"
}
```

Finalidade dos campos:

- `mode`: define o comportamento pedagogico da sessao
- `base`: define a origem curricular ativa
- `serie`: restringe o recorte escolar da sessao
- `materia`: ancora a sessao na disciplina correta
- `topicos`: lista de assuntos selecionados para o treino
- `focoPrincipal`: topico com prioridade maior quando o modo exigir reforco
- `pesos`: permite peso manual por topico
- `quantidadeQuestoes`: controla o tamanho da sessao
- `estrategiaMistura`: orienta o `ENGINE` sobre como distribuir a selecao

Regra de arquitetura:

```txt
o contexto de sessao nao e opcional
ele e o contrato entre launcher, engine, stats e fluxo de treino
```

---

# 6.1. MODOS DE TREINO

### ASSUNTO_UNICO

Objetivo pedagogico:

- aprofundar um unico assunto com repeticao controlada
- consolidar base
- reduzir dispersao

Comportamento esperado:

- usuario escolhe 1 topico
- sessao usa somente esse topico
- progressao e stats ficam centrados nesse dominio

### ASSUNTOS_COMBINADOS

Objetivo pedagogico:

- treinar variedade sem perder controle
- revisar dois ou mais assuntos dentro da mesma materia
- construir flexibilidade cognitiva

Comportamento esperado:

- usuario escolhe 2 ou mais topicos
- sistema alterna entre eles segundo estrategia definida
- distribuicao evita concentracao burra em um unico assunto

### REFORCO_DIRECIONADO

Objetivo pedagogico:

- manter revisao de varios assuntos
- dar peso maior ao assunto com maior necessidade
- acelerar correcao de fraqueza especifica

Comportamento esperado:

- usuario escolhe 2 ou mais topicos
- define um foco principal
- `ENGINE` aplica peso maior ao foco sem eliminar os demais

### TREINO_PARA_PROVA

Objetivo pedagogico:

- simular revisao misturada
- preparar o usuario para troca de contexto entre assuntos
- gerar pressao leve de sessao sem virar simulado completo

Comportamento esperado:

- usuario escolhe materia e conjunto de topicos
- sistema distribui questoes com mistura equilibrada
- sessao privilegia revisao global e ritmo

---

# 7. ENGINE (SELECAO INTELIGENTE)

Entrada:

```ts
{
  contexto,
  historicoUsuario,
  bancoQuestoes
}
```

Saida:

```ts
proximaQuestao
```

## LOGICA

Peso por topico:

```txt
peso = erro + recencia + dificuldade
```

Criterios:

- priorizar erro recente
- variar dificuldade
- evitar repeticao imediata
- incluir revisao automatica

---

# 7.1. REGRAS DO ENGINE POR MODO

### ASSUNTO_UNICO

Regra:

- selecionar somente questoes do topico escolhido

Prioridades:

- historico de erro
- recencia
- necessidade de revisao
- variacao interna de dificuldade

### ASSUNTOS_COMBINADOS

Regra:

- distribuir questoes entre os topicos selecionados

Prioridades:

- equilibrio entre assuntos
- alternancia coerente
- evitar concentracao acidental em um unico topico
- combinar erro e recencia sem destruir a mistura

### REFORCO_DIRECIONADO

Regra:

- aplicar peso maior ao foco principal

Prioridades:

- foco principal acima dos demais
- manutencao de revisao secundaria
- possibilidade de peso manual do usuario
- reforco sem eliminar diversidade minima

### TREINO_PARA_PROVA

Regra:

- misturar topicos com diversidade e cobertura

Prioridades:

- distribuicao equilibrada
- revisao global
- dificuldade moderadamente variada
- evitar feedback excessivamente fragmentado

O `ENGINE` pode combinar estes fatores em qualquer modo:

- historico de erro
- recencia
- dificuldade
- peso manual do usuario
- necessidade de revisao

---

# 7.2. FUNCAO ESTRUTURAL DO ENGINE

```txt
contexto da sessao
+ historico do usuario
+ banco de questoes
= proxima questao
```

O `ENGINE` nao deve agir apenas como sorteio.
Ele precisa decidir com base em contexto declarado, estado pedagogico e intencao da sessao.

---

# 8. SISTEMA DE STATS

```ts
{
  topico: {
    acertos: number,
    erros: number,
    tempoMedio: number,
    ultimaInteracao: timestamp,
    nivelDominio: number
  }
}
```

## NIVEL DE DOMINIO

```txt
0 -> desconhecido
1 -> iniciante
2 -> basico
3 -> intermediario
4 -> avancado
5 -> dominado
```

Calculo:

- precisao (70%)
- tempo (30%)

---

# 8.1. STATS POR RECORTE DE ESTUDO

Os `STATS` precisam registrar desempenho:

- por materia
- por topico
- por modo de treino
- por sessao focada

Isso deve permitir leituras como:

- assunto mais fraco
- assunto mais treinado
- desempenho em treino para prova
- melhora apos reforco direcionado

Regra estrutural:

```txt
nao basta registrar resposta isolada
o sistema precisa registrar contexto da sessao em que a resposta aconteceu
```

# 9. FEEDBACK

### correto

- direto
- reforco leve

### incorreto

- mostrar erro
- explicacao objetiva

Formato:

```txt
Passo 1
Passo 2
Resultado
```

---

# 10. UX DA QUESTAO

- enunciado curto
- foco visual
- sem poluicao
- resposta em 1 acao

---

# 10.1. UX PREVISTA PARA O LAUNCHER DE TREINO

O launcher de treino deve prever, como parte da arquitetura oficial:

- selecionar materia
- selecionar 1 ou mais assuntos
- definir foco principal opcional
- escolher quantidade de questoes
- iniciar treino

Isso nao e detalhe visual solto.
E parte do contrato funcional do modulo `QUESTIONS`.

Regra:

```txt
launcher simples
contexto rico
sessao controlada
```

# 11. PROGRESSAO

Nao usar XP generico apenas.

Usar:

```txt
dominio por topico
```

Exibir:

- "Algebra: 72% dominado"
- "Voce melhorou em Funcoes"

---

# 12. NOTIFICACOES (SISTEMA)

## TIPOS

### 1. continuidade

- "Voce esta ha 2 dias sem estudar"

### 2. reforco de erro

- "Voce errou fracoes ontem - revisar?"

### 3. meta diaria

- "Faltam 3 questoes para fechar o dia"

### 4. progresso

- "Voce subiu nivel em trigonometria"

## MOTOR

```ts
{
  ultimoAcesso,
  topicosFracos,
  streak,
  metaDiaria
}
```

---

# 13. SIMULADO (ARQUITETURA)

## REGRA PRINCIPAL

```txt
SIMULADO E UM SISTEMA SEPARADO
```

## POR QUE SEPARADO

- comportamento diferente
- sem feedback imediato
- tempo continuo
- pressao real

## ESTRUTURA

```ts
{
  id,
  tipo: "enem",
  tempoTotal: 180 | 300,
  questoes: [],
  inicio,
  fim
}
```

## COMPORTAMENTO

Durante:

- sem explicacao
- sem feedback
- bloqueio de retorno opcional

Final:

- nota
- analise por area
- erros por competencia

## INTEGRACAO COM STATS

Apos simulado:

- atualizar stats
- marcar erros como prioridade
- alimentar engine

## RELACAO FORMAL COM QUESTIONS

Distincao obrigatoria:

- `QUESTIONS` = treino controlado e personalizavel
- `SIMULADO` = prova separada, fluxo isolado

Integracao indireta prevista:

- erros do simulado alimentam reforco direcionado
- stats do treino podem sugerir topicos de revisao antes do simulado

---

# 14. BANCO DE QUESTOES

Organizacao:

```txt
serie
 -> materia
   -> unidade
     -> topico
       -> questoes
```

---

# 15. PADRAO DE CONTEUDO

Regras:

- enunciado curto
- sem texto inutil
- foco direto no problema
- alternativa plausivel (sem obvia)

---

# 16. ROADMAP INTERNO

### Fase 1

- motor de questoes funcional
- stats funcionando
- sessao basica

### Fase 2

- adaptacao inteligente
- revisao automatica

### Fase 3

- progressao visual

### Fase 4

- notificacoes

### Fase 5

- simulado ENEM

---

# 17. ERROS CRITICOS A EVITAR

- transformar em joguinho
- excesso de animacao
- perguntas longas
- falta de tracking
- repeticao burra de questoes

---

# 18. DIRETRIZ FINAL

```txt
Rapido
Direto
Mensuravel
Adaptativo
```

---

# 19. DECISAO ESTRATEGICA

```txt
Treino (QUESTIONS) = evolucao continua
Simulado (SIMULADO) = validacao real
```

Nunca misturar os dois fluxos.

---

Se seguir este documento, o sistema escala sem retrabalho.
