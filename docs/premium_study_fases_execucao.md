# STUDY OS - PREMIUM STUDY - FASES OFICIAIS DE EXECUCAO

Documento operacional das fases.

Status:
- vigente
- detalhado
- subordinado a `docs/premium_study_constituicao_produto.md`

Atualizado em 2026-04-15.

---

## 1. Missao deste documento

Transformar a constituicao do produto em trabalho executavel sem retrabalho.

Regra:

```txt
cada fase deve ser entregue completa
com objetivos fechados, criterios de aceite e sem dependencia oculta
```

---

## 2. Escopo destas fases

Este documento cobre agora apenas:
- fluxo de produto
- telas
- UX
- organizacao de modulo
- comportamento do onboarding
- estrutura das proximas telas

As frentes abaixo ficam para depois:
- IA externa final
- billing
- monetizacao
- acesso premium real
- estatisticas premium finais

---

## 3. Ordem oficial de execucao atualizada

1. Fase 0 - Base oficial e congelamento de produto
2. Fase 1 - Shell premium e onboarding guiado
3. Fase 2 - Processamento e escolha do modo inicial
4. Fase 3 - Bloco Aprender
5. Fase 4 - Pratica do bloco
6. Fase 5 - Mini prova do bloco
7. Fase 6 - Trilha geral e retomada
8. Fase 7 - Refino final de UX, responsividade e estabilizacao
9. Fase 8 - Frentes futuras de IA, premium real e operacao

Regra:

```txt
nao pular para a frente comercial ou de IA
antes de o fluxo principal de estudo estar solido
```

---

## 4. Fase 0 - Base oficial e congelamento de produto

### Objetivo

Congelar as decisoes de produto, fluxo, layout e arquitetura antes das proximas implementacoes.

### Esta fase precisa deixar pronto

- documento base oficial
- fases atualizadas
- mapa de telas aprovado
- regras visuais aprovadas
- sequencia de execucao definida
- frentes adiadas explicitamente marcadas

### Entregas da Fase 0

- `docs/premium_study_constituicao_produto.md`
- `docs/premium_study_fases_execucao.md`

### Criterios de aceite

- qualquer novo programador entende o que deve construir
- a ordem das telas esta fechada
- IA e pagamentos nao atrapalham a continuidade do produto

---

## 5. Fase 1 - Shell premium e onboarding guiado

### Objetivo

Entregar o modulo novo, desacoplado, com onboarding de uma decisao por tela.

### Escopo

- card `Estudo Premium` na home
- `#premiumStudyModule`
- bootstrap lazy-load
- shell premium
- router interno
- state interno
- storage local do ultimo estudo
- onboarding visual responsivo

### Telas obrigatorias da Fase 1

1. Entrada
2. Data da prova
3. Meta de nota
4. Tempo diario

### Regras obrigatorias

- uma decisao por tela
- voltar no topo
- fechar no topo
- seta lateral para avancar nas telas guiadas
- sem barra de botoes grandes embaixo onde a seta lateral existir
- conteudo centralizado mesmo com seta lateral
- sem acoplamento com `questions`

### Entregas da Fase 1

- entrada com `Carregar PDF`
- `Retomar estudo` quando houver estudo salvo
- calendario navegavel
- seletor circular de meta
- seletores circulares de horas e minutos
- salvamento automatico local

### Criterios de aceite

- o usuario consegue atravessar todo o onboarding sem redundancia
- as telas cabem nos principais formatos sem quebrar
- o ultimo estudo fica salvo localmente
- o visual ja comunica premium, direcao e individualizacao

---

## 6. Fase 2 - Processamento e escolha do modo inicial

### Objetivo

Conectar o fim do onboarding a uma entrega clara de proximo passo.

### Escopo

- tela de processamento
- modo inicial
- resumo compacto do plano
- comportamento de retorno correto

### Telas obrigatorias

1. `Estamos montando o melhor caminho para voce`
2. `Como voce quer comecar agora?`

### Regras obrigatorias

Processamento:
- barra central estilizada
- frase personalizada com nota e data
- subtarefas curtas
- sem botoes embaixo

Modo inicial:
- `Aprender`, `Praticar` e `Prova`
- tres opcoes lado a lado
- resumo compacto do plano
- `Voltar` no topo
- resumo informativo, sem parecer botao

### Criterios de aceite

- o processamento conecta naturalmente ao modo inicial
- o usuario entende o que fazer depois do plano montado
- o resumo nao compete com a decisao principal

---

## 7. Fase 3 - Bloco Aprender

### Objetivo

Entregar valor real de estudo antes de pratica avancada.

### Escopo

- tela do bloco
- aba `Aprender`
- resumo focado
- pontos quentes
- conceitos-chave
- armadilhas comuns
- botoes de IA guiada

### Telas obrigatorias

1. `Bloco de estudo`
2. `Resumo expandido` do bloco

### Acoes obrigatorias

- `Explicar melhor`
- `Revisao rapida`
- `Ir para pratica`

### Regras obrigatorias

- foco em leitura orientada
- pouco texto corrido
- secoes curtas
- contexto sempre ligado ao bloco atual

### Criterios de aceite

- o aluno entende o bloco sem depender da pratica
- existe percepcao clara de progresso
- o bloco parece pessoal e objetivo

---

## 8. Fase 4 - Pratica do bloco

### Objetivo

Transformar o estudo em treino util.

### Escopo

- hub de pratica
- questionario
- verdadeiro ou falso
- flashcards

### Telas obrigatorias

1. `Pratica do bloco`
2. `Questionario`
3. `Verdadeiro ou falso`
4. `Flashcards`

### Regras obrigatorias

Tela de entrada da pratica:
- tres formatos como cards de acao
- resumo pequeno do bloco

Questionario:
- uma questao por vez
- 4 alternativas
- correcao curta
- botao `Proxima`

Verdadeiro ou falso:
- serie curta de afirmacoes
- correcao clara

Flashcards:
- frente e verso
- marcar `Entendi`
- marcar `Revisar de novo`

### Criterios de aceite

- a pratica parece parte da trilha, nao modulo solto
- os formatos sao curtos e objetivos
- o usuario consegue sair da pratica com direcionamento

---

## 9. Fase 5 - Mini prova do bloco

### Objetivo

Simular pressao e medir rendimento do bloco.

### Escopo

- mini prova
- resultado
- recomendacao de proximo passo

### Telas obrigatorias

1. `Mini prova do bloco`
2. `Resultado da mini prova`

### Regras obrigatorias

Mini prova:
- 8 a 12 questoes
- tempo opcional
- foco no bloco atual

Resultado:
- percentual de acerto
- principal dificuldade
- recomendacao:
  - voltar para aprender
  - praticar mais
  - seguir para proximo bloco

### Criterios de aceite

- a mini prova e curta e util
- o resultado aponta claramente o proximo passo

---

## 10. Fase 6 - Trilha geral e retomada

### Objetivo

Dar ao aluno um lugar claro para continuar depois.

### Escopo

- trilha geral
- lista de blocos
- tela de retomada
- nome editavel do estudo

### Telas obrigatorias

1. `Sua trilha`
2. `Retomar estudo`

### Regras obrigatorias

Trilha geral:
- lista dos blocos gerados
- nome
- tempo estimado
- prioridade
- status
- acao `Continuar`

Retomada:
- mostrar ultimo estudo salvo
- permitir retomar rapidamente
- permitir renomear depois

### Criterios de aceite

- o usuario consegue sair e voltar sem se perder
- a trilha geral funciona como centro de continuidade

---

## 11. Fase 7 - Refino final de UX, responsividade e estabilizacao

### Objetivo

Polir o fluxo inteiro antes das frentes futuras.

### Escopo

- alinhamento visual entre telas
- responsividade final
- ajuste de pesos visuais
- confirmacao de que informacao nao parece acao
- restore points e documentacao final da fase

### Checklist obrigatorio

- nenhuma tela importante com espacamento morto grande
- nenhum controle sobreposto
- nenhuma etapa com rolagem indevida
- setas laterais sem deslocar visualmente o conteudo
- desktop, tablet e mobile com leitura coerente

### Criterios de aceite

- fluxo inteiro consistente
- visual premium estavel
- onboarding e pos-onboarding claros

---

## 12. Fase 8 - Frentes futuras de IA, premium real e operacao

### Esta fase fica adiada por enquanto

Quando for retomada, cobrira:
- IA externa final
- geracao real de conteudo
- billing
- acesso premium real
- estatisticas premium
- monetizacao e paywall

### Regra

```txt
esta fase nao entra enquanto as fases 1 a 7 nao estiverem fechadas e estaveis
```

---

## 13. Sequencia operacional recomendada a partir de agora

Quando a execucao voltar ao codigo, a ordem correta e:

1. consolidar `Processamento`
2. consolidar `Modo inicial`
3. construir `Aprender`
4. construir `Pratica`
5. construir `Mini prova`
6. construir `Trilha geral`
7. construir `Retomada`
8. fazer polimento geral

---

## 14. Regra de entrega por fase

Cada fase deve:
- nascer desacoplada
- ter criterio de aceite claro
- poder ser restaurada por snapshot
- nao empurrar problema de UX para a fase seguinte

Regra:

```txt
nao emendar gambiarra para "chegar logo" na proxima fase
```

