# STUDY OS - PREMIUM STUDY - FASES OFICIAIS DE EXECUCAO

Documento operacional das fases.

Status:
- vigente
- detalhado
- subordinado a `docs/premium_study_constituicao_produto.md`

Atualizado em 2026-04-16.

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
- conexao final com IA externa paga
- checkout real com provedor
- monetizacao ativa
- estatisticas premium finais
- novos modulos do ecossistema, como `Teste seu QI` e `Teste vocacional`

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

Documento relacionado para ideias futuras fora deste modulo:

- `docs/future_modules_qi_vocacional.md`

Regra:

```txt
nao pular para a frente comercial ou de IA
antes de o fluxo principal de estudo estar solido
```

---

## 3.1 Estado atual consolidado

Status real do modulo em 2026-04-16:

- Fase 0: concluida
- Fase 1: concluida
- Fase 2: concluida
- Fase 3: concluida, com escopo ampliado
- Fase 4: concluida
- Fase 5: concluida
- Fase 6: concluida
- Fase 7: concluida para a fase de produto atual
- Fase 8: iniciada como base operacional local

Mudancas ja implementadas fora da documentacao anterior:
- `Biblioteca premium` na entrada
- quarta opcao `Marcar` no modo inicial
- documento com marcador de texto
- exportacao em PDF do marcador
- mapa de assuntos clicaveis
- `Aprender` em full-screen
- pratica com progresso visual por formato
- mini prova com geracao base de 10 questoes

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
- `Aprender`, `Praticar`, `Prova` e `Marcar`
- quatro opcoes lado a lado
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

- mapa de assuntos clicaveis
- leitura por assunto
- modo full-screen
- resumo focado
- secoes internas do assunto
- acoes contextuais dentro do proprio assunto

### Telas obrigatorias

1. `Mapa de assuntos`
2. `Resumo focado do assunto`

### Acoes obrigatorias

- `Explicar melhor este assunto`
- `Revisar este assunto em 5 pontos`
- `Mini prova deste assunto`
- `Proximo assunto`

### Regras obrigatorias

- mapa de assuntos mostra assuntos do PDF, nao funcoes diferentes
- todos os cards do mapa abrem o mesmo tipo de resumo focado
- quanto mais assuntos o PDF tiver, mais cards o mapa tera
- grade responsiva: ate 3 cards por linha em desktop quando houver espaco, 2 em telas medias/pequenas e 1 apenas quando necessario
- cards do mapa devem ser baixos, com foco no titulo do assunto
- cada card deve mostrar status visual: novo, iniciado ou concluido
- usar arredondamento leve nos cards, evitando cantos muito redondos com cara de template pronto
- foco em leitura orientada
- tela cheia com coluna central de leitura
- rolagem liberada
- pouco ruido visual
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
- sem painel `Plano em construcao`
- progresso visual por formato no estilo `copo enchendo`
- cada formato tem 3 rodadas gratis por assunto
- o card principal abre sempre a proxima rodada gratis pendente
- pote vazio abre aquela rodada
- pote cheio abre a rodada ja concluida para revisao ou refazer
- quando as 3 rodadas gratis acabam, extras ficam bloqueados no premium
- `Refazer questionario`, `Refazer V ou F` e `Refazer flashcards` limpam as 3 rodadas daquele formato e recomecam com as mesmas questoes/cards

Questionario:
- uma questao por vez
- 4 alternativas
- correcao curta
- botao `Proxima`
- opcao `Gerar mais no premium`

Verdadeiro ou falso:
- serie curta de afirmacoes
- correcao clara

Flashcards:
- frente e verso
- marcar `Entendi`
- marcar `Revisar de novo`
- usar mnemônicos, gatilhos e fixacao real

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
- geracao base de 10 questoes
- tempo opcional
- foco no bloco atual
- `Gerar mais no premium` como acao separada

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
- retomada do ultimo estudo
- biblioteca premium
- nome editavel do estudo
- restauracao do ponto salvo
- navegacao correta ao fechar telas internas

### Telas obrigatorias

1. `Sua trilha`
2. `Retomar estudo`
3. `Biblioteca premium`

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
- retomar no passo salvo

Biblioteca premium:
- listar materiais e estudos salvos
- abrir um estudo salvo
- ficar visualmente bloqueada fora do premium

### Criterios de aceite

- o usuario consegue sair e voltar sem se perder
- a trilha geral funciona como centro de continuidade
- `Retomar estudo` nao joga o usuario para o inicio nem para um passo errado

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
- limpeza de textos e encoding
- revisao do comportamento de fechar e voltar
- validacao real do fluxo em browser

### Checklist obrigatorio

- nenhuma tela importante com espacamento morto grande
- nenhum controle sobreposto
- nenhuma etapa com rolagem indevida
- setas laterais sem deslocar visualmente o conteudo
- desktop, tablet e mobile com leitura coerente
- sem textos quebrados por encoding
- sem placeholder de fase futura aparecendo no produto
- sem diferenca entre comportamento documentado e comportamento real

### Regra visual de cantos premium

O modo premium deve seguir a escala de raios definida em `premium-study/styles/premium-study.css`.

- shell principal: `--premium-radius-shell`, usado apenas no container externo e leitores amplos
- paineis grandes: `--premium-radius-panel`, usado em calendario, paywall e blocos de destaque
- cards comuns: `--premium-radius-card`, usado em cards clicaveis, perguntas, resumos e componentes de acao
- detalhes internos: `--premium-radius-tight` e `--premium-radius-chip`, usados em alternativas, tags, badges e listas
- elementos realmente circulares: `--premium-radius-pill`, reservado para voltar, fechar, progresso, controles circulares, trilhas e botoes que precisam parecer circulares por funcao

Nao voltar a usar cantos grandes como `24px`, `28px`, `30px` ou `36px` em cards e paineis do modo premium. O visual esperado e maduro, preciso e levemente arredondado, semelhante aos cards compactos de `Retomar ultimo estudo`, `Biblioteca premium` e aos cards pequenos do mapa de assuntos.

### Criterios de aceite

- fluxo inteiro consistente
- visual premium estavel
- onboarding e pos-onboarding claros

---

## 12. Fase 8 - Frentes de IA, premium real e operacao

### Status atual

A Fase 8 foi iniciada em 2026-04-16 como base operacional local.

O objetivo desta primeira entrega nao e cobrar nem chamar IA real ainda.
O objetivo e criar contratos pequenos para o produto ja saber:

- quem pode usar cada recurso
- onde o checkout sera conectado
- onde a IA real sera conectada
- quais prompts serao versionados
- quais limites continuam gratis
- quais recursos ficam premium

### Entregas da Fase 8.1

- `premium-study/services/access-control.js`
- `premium-study/services/pdf-validator.js`
- `premium-study/services/billing.js`
- `premium-study/services/ai.js`
- `premium-study/services/ai/prompts/plan.md`
- `premium-study/services/ai/prompts/explain.md`
- `premium-study/services/ai/prompts/review.md`
- `premium-study/services/ai/prompts/questions.md`
- `premium-study/services/ai/prompts/flashcards.md`
- `premium-study/services/ai/prompts/mini_exam.md`

### Entregas da Fase 8.2

- rota `premium-checkout`
- tela visual de oferta premium
- cards de planos mensal e anual preparados
- cliques premium levando para paywall em vez de ficarem mortos
- biblioteca premium, exportacao e extras usando a mesma tela de conversao
- botao de checkout chamando `PremiumStudyBilling.startCheckout`
- mensagem clara quando o provedor real ainda nao estiver conectado
- trava real no upload para PDF acima do limite gratis
- oferta premium contextual para PDF maior que 12 paginas
- premium preparado para materiais longos sem trava fixa de paginas no navegador
- regra de custo: dividir o material antes de qualquer chamada de IA

### Regras desta fase

- nao chamar provedor externo direto da UI
- nao espalhar regra de premium nas telas
- nao misturar billing com renderizacao
- nao chamar IA sem backend, cache e limite
- manter o ultimo estudo gratis
- manter tres series gratis por formato de pratica
- bloquear biblioteca completa, extras, PDF maior e estatisticas no premium
- nao mostrar preco definitivo antes de a operacao de pagamento estar definida
- validar PDF antes de `setMaterial`
- vender `PDFs longos com divisao inteligente`, nao `IA ilimitada sem controle`

### Regra

```txt
servico externo so entra depois que o contrato local estiver estavel
```

---

## 13. Sequencia operacional recomendada a partir de agora

Com a fase de produto principal fechada, a proxima frente recomendada passa a ser:

1. consolidar a camada `access-control`
2. conectar paywall visual ao contrato `billing`
3. conectar checkout real ao contrato `billing`
4. criar fonte de verdade de assinatura no backend
5. conectar extras premium a assinatura real
6. conectar IA externa com cache e prompts versionados
7. adicionar estatisticas premium

---

## 14. Plano objetivo da proxima frente

### Fase 8 - Execucao operacional

Vai mudar ou implementar agora:
- paywall premium usando `access-control`
- checkout real usando `billing`
- liberacao real de extras premium depois da assinatura
- IA externa real usando `PremiumStudyAI`
- cache por material, bloco e acao
- estatisticas premium depois da fonte de dados de progresso estar estavel

### Fase 8.3 - Proxima etapa externa

Antes de conectar pagamento real, sera necessario:

- criar ou acessar conta Mercado Pago
- definir se a assinatura inicial sera mensal, anual ou as duas
- definir preco publico
- obter credenciais de teste
- configurar URL de retorno e webhook
- decidir onde o backend salvará o status real da assinatura

---

## 15. Regra de entrega por fase

Cada fase deve:
- nascer desacoplada
- ter criterio de aceite claro
- poder ser restaurada por snapshot
- nao empurrar problema de UX para a fase seguinte

Regra:

```txt
nao emendar gambiarra para "chegar logo" na proxima fase
```
