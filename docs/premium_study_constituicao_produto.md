# STUDY OS - PREMIUM STUDY - CONSTITUIÇÃO DO PRODUTO

Documento oficial e autoritativo do módulo `Premium Study`.

Status:
- vigente
- imutável como base de produto
- referência obrigatória para qualquer GPT, programador ou agente que atue nesta frente

Atualizado em 2026-04-14.

---

## 1. Natureza deste documento

Este documento funciona como a lei principal do produto.

Se houver conflito entre:

- conversa antiga
- preferência local de implementação
- sugestão improvisada
- decisão visual isolada
- atalho técnico

vence este documento, salvo quando existir uma atualização oficial escrita que o substitua.

Regra operacional:

```txt
nenhuma fase de execução pode contrariar esta constituição
sem criar uma revisao oficial deste mesmo documento
```

---

## 2. Missao do produto

O `Premium Study` existe para transformar um material de estudo em um plano pessoal, dirigido e recompensador.

Ele deve fazer o estudante sentir que:

- o ambiente foi preparado para ele
- o sistema entendeu seu material
- existe um caminho claro
- cada escolha constrói algo real
- estudar ali é mais organizado, mais leve e mais valioso

Missao em uma frase:

```txt
receber um PDF válido, entender o que importa para a prova e devolver um plano pessoal de estudo com foco em resultado
```

---

## 3. Pilares obrigatórios do produto

### 3.1 Direcionamento

O sistema deve dizer ao estudante onde ele está, o que já foi feito e qual é o próximo passo.

Perguntas que cada tela deve responder:

- onde estou?
- o que já concluímos?
- o que falta para avançar?

### 3.2 Individualização percebida

O aluno deve sentir que o espaco e dele.

Isso precisa aparecer em:

- textos de apoio
- nome do plano
- seleção de tópicos
- recomendação de próximo bloco
- retomada do progresso
- justificativas curtas do sistema

### 3.3 Recompensa visual madura

O produto deve ser satisfatorio de usar sem parecer infantil.

Nao usar:

- confetes
- medalhas caricatas
- excesso de mascotes
- linguagem exageradamente fofa

Usar:

- progressão visível
- preenchimento elegante
- confirmacoes suaves
- profundidade visual discreta
- estados de conclusao claros

### 3.4 Leveza e desacoplamento

Nada desta frente deve nascer preso ao módulo `questions`.

O modulo precisa:

- carregar sozinho
- salvar sozinho
- evoluir sozinho
- poder mudar sem quebrar o restante do site

### 3.5 Excelência com custo controlado

O produto deve entregar excelencia percebida sem depender de IA cara o tempo todo.

Regra:

```txt
usar IA apenas onde a IA muda o resultado
todo o resto deve ser local, cacheado ou simplificado
```

---

## 4. Escopo oficial do Premium Study

O produto recebera:

- PDF textual e nitido
- prazo até a prova
- objetivo do estudante

O produto devolvera:

- tópicos detectados
- plano em blocos
- resumos focados
- revisao rapida
- questões geradas
- flashcards
- mini prova por bloco

O produto nao precisa ter no MVP:

- chat livre
- podcast
- OCR completo
- importação de imagem
- importação de vários arquivos em um único plano

---

## 5. Regra de não acoplamento

O `Premium Study` não deve nascer dentro de `questions`.

Ele deve existir como módulo próprio, com:

- `bootstrap`
- `state`
- `storage`
- `router`
- `services`
- `ui`
- `styles`

Separacoes obrigatorias:

- parser de PDF não conhece billing
- billing não conhece UI
- UI não chama IA direto
- motor de questões não depende do motor de flashcards
- plano do material não depende do módulo `questions`
- storage não depende de layout

Regra:

```txt
nenhum arquivo central gigantesco deve acumular regra, UI e persistência ao mesmo tempo
```

---

## 6. Lugar oficial no site

O `Premium Study` será um módulo próprio no `Study OS`.

Decisao fechada:

- ele entra como card proprio na home principal
- ele não fica escondido dentro de `questions`
- ele terá área própria no `moduleArea`

Estrutura recomendada:

- card na home: `Estudo Premium`
- container dedicado: `#premiumStudyModule`
- carregamento lazy-load

### 6.1 Protocolo de consulta obrigatória

Qualquer agente que atuar nesta frente deve ler primeiro:

1. `docs/premium_study_constituicao_produto.md`
2. `docs/premium_study_fases_execucao.md`
3. `docs/premium_study_operacao_ai_pagamentos.md`

Regra:

```txt
ninguém implementa nada nesta frente sem consultar estes três documentos
```

---

## 7. Fluxo oficial do produto

Fluxo principal fechado:

1. landing premium
2. novo plano
3. upload do PDF
4. configuração da prova
5. análise do material
6. revisão dos tópicos
7. geração do plano
8. estudo por blocos
9. pratica por bloco
10. mini prova do bloco
11. progresso e retomada

Regra:

```txt
o usuário não deve configurar a mesma coisa em duas telas diferentes
```

Exemplos de redundância proibida:

- pedir matéria manual depois de o PDF já ter definido o recorte
- pedir prazo novamente dentro do bloco
- criar dois lugares diferentes para editar os mesmos tópicos

---

## 8. Telas obrigatórias

### 8.1 Landing premium

Elementos obrigatorios:

- título forte
- subtítulo curto
- CTA `Experimentar gratis`
- CTA `Ver exemplo`
- CTA `Assinar Premium`

Comportamento obrigatório:

- o CTA principal deve abrir o fluxo de novo plano
- o CTA secundário deve abrir um exemplo guiado sem custo
- o CTA de assinatura deve abrir a tela de planos

### 8.2 Tela de novo plano

Elementos obrigatorios:

- área de upload
- botão `Selecionar PDF`
- botão `Usar exemplo`
- botão `Voltar`
- botão `Continuar`

Regra visual:

- a barra de progresso deve avançar assim que o material válido for reconhecido
- o resumo lateral ou inferior deve mostrar nome do arquivo, páginas e status

### 8.3 Tela de configuração da prova

Elementos obrigatorios:

- campo `Data da prova`
- opção `Faltam X dias`
- escolha de objetivo:
  - `Reta final`
  - `Equilibrado`
  - `Aprofundado`
- campo opcional `Tempo de estudo por dia`
- botoes `Voltar` e `Analisar material`

Comportamento obrigatório:

- cada escolha deve atualizar a sensação de personalização do plano
- a barra superior deve preencher mais um trecho
- a interface deve mostrar uma leitura do tipo `Plano orientado ao seu prazo`

### 8.4 Tela de análise

Elementos obrigatorios:

- loader premium
- etapas visíveis:
  - `Lendo PDF`
  - `Detectando topicos`
  - `Priorizando o conteúdo`
  - `Montando seu plano`
- botão `Cancelar`

### 8.5 Tela de revisão dos tópicos

Elementos obrigatorios:

- cards de tópicos
- editar tópico
- excluir tópico
- adicionar tópico
- botão `Voltar`
- botão `Gerar plano`

### 8.6 Tela do plano gerado

Elementos obrigatorios:

- lista ou grid de blocos
- destaque do bloco recomendado
- progresso geral
- justificativa curta da ordem
- botões:
  - `Começar pelo recomendado`
  - `Salvar`
  - `Regerar plano`

Cada card de bloco deve mostrar:

- título
- prioridade
- tempo estimado
- status
- ação principal

### 8.7 Tela do bloco

Abas obrigatórias:

- `Aprender`
- `Praticar`
- `Prova`

---

## 9. Interação com IA

Decisao fechada:

- não existe chat livre
- não existe campo aberto de conversa geral no MVP

Interações oficiais com IA no bloco:

- `Explicar melhor`
- `Criar 3 questões`
- `Revisão rapida`

Distribuicao:

- aba `Aprender`
  - `Explicar melhor`
  - `Revisao rapida`
- aba `Praticar`
  - `Criar 3 questões`

Regra:

```txt
os três botões existem porque cobrem entender, praticar e revisar
nenhum quarto botão deve entrar se repetir uma dessas funções
```

---

## 10. Formatos oficiais de conteúdo

### 10.1 Resumos

Formatos autorizados:

- `Express`
- `Padrao`
- `Reta final`

### 10.2 Questões

Formatos do MVP:

- multipla escolha com 4 alternativas
- verdadeiro ou falso em lista curta

### 10.3 Flashcards

Estrutura:

- frente curta
- verso objetivo
- dica opcional

### 10.4 Mini prova

Estrutura:

- 8 a 12 questoes por bloco
- mistura equilibrada
- temporizador opcional
- gabarito comentado

---

## 11. Regras do PDF

O MVP aceita somente:

- arquivo `.pdf`
- PDF textual
- PDF nítido
- PDF com texto selecionável

O MVP recusa:

- PDF escaneado sem texto real
- PDF de imagem pura
- PDF com extração corrompida

Limites recomendados:

- gratis: ate 12 paginas
- premium inicial: ate 60 paginas
- tamanho do arquivo: ate 10 MB no MVP

Mensagem oficial de recusa:

```txt
Este arquivo parece escaneado ou sem texto selecionável.
Envie um PDF textual, nítido e com texto copiável.
```

---

## 12. Regras de personalização do plano

O plano precisa mudar de acordo com o prazo.

### Se a prova estiver muito próxima

O sistema deve:

- reduzir profundidade
- priorizar pontos quentes
- diminuir blocos
- aumentar revisão ativa

### Se houver prazo medio

O sistema deve:

- equilibrar cobertura e pratica
- manter resumos objetivos

### Se houver prazo longo

O sistema deve:

- permitir aprofundamento
- ampliar contexto
- organizar revisões mais distribuídas

---

## 13. Estado salvo do usuário

Deve ficar salvo:

- conta
- status da assinatura
- plano ativo
- metadados do PDF
- texto extraído
- tópicos detectados
- edições manuais
- blocos do plano
- progresso por bloco
- histórico de geração
- questões geradas
- flashcards gerados
- mini provas
- resultados

---

## 14. Regras de experiência premium

### 14.1 Tom visual

O produto deve parecer:

- sofisticado
- calmo
- pessoal
- focado
- valioso

Nao deve parecer:

- infantil
- carnavalesco
- baguncado

### 14.2 Sensação de conclusão

Toda escolha importante deve produzir:

- avanço de barra
- confirmação visual
- atualização do resumo do plano
- sensação de construção

### 14.3 Sensação de exclusividade

O aluno deve ver textos como:

- `Seu material foi carregado`
- `Seu plano está tomando forma`
- `Seu próximo bloco recomendado`
- `Organizado para o seu prazo`

---

## 15. Sistema visual oficial

### 15.1 Direção

Tema principal:

- escuro elegante
- contraste alto
- brilho controlado
- profundidade leve

### 15.2 Paleta base recomendada

- fundo principal: `#0A0D14`
- fundo secundario: `#111622`
- superficie principal: `#161C2B`
- superficie elevada: `#1B2335`
- texto principal: `#F5F7FB`
- texto secundario: `#A9B3C7`
- linha suave: `rgba(255,255,255,0.08)`
- acento primario: `#5B7CFA`
- acento secundario: `#3DD6B0`
- acento de recompensa: `#F4C86A`
- erro: `#FF6B6B`

### 15.3 Animação

Permitido:

- preenchimento de progresso
- fade curto
- elevação leve de card
- transição de estado

Proibido:

- bounce infantil
- efeitos longos
- animacao sem funcao

---

## 16. Responsividade oficial

O módulo deve funcionar bem em:

- desktop grande
- notebook
- tablet
- celular
- app webview

Regra de responsividade:

```txt
se a tela encolher
os blocos, textos e espacos devem se adaptar juntos
sem quebra visual e sem dependencia de largura fixa
```

Obrigacoes tecnicas:

- usar tokens de espaco e tamanho
- evitar largura fixa dura
- usar `clamp` quando fizer sentido
- cards devem reduzir de forma proporcional
- labels longas devem quebrar com elegancia

Breakpoints recomendados:

- `>= 1440px`
- `>= 1200px`
- `>= 992px`
- `>= 768px`
- `>= 560px`
- `< 560px`

---

## 17. Performance oficial

Obrigacoes:

- lazy-load do modulo
- parser local quando possivel
- processamento pesado fora da thread principal quando necessario
- geracao sob demanda
- cache de resultados
- limite de tamanho e paginas

---

## 18. Modelo de acesso

Planos autorizados:

- gratis
- premium

O plano gratis deve provar valor sem destruir margem.

O premium deve liberar:

- mais paginas
- mais materiais
- mais blocos
- mais geracoes
- historico e continuidade

---

## 19. Regras que nao podem ser quebradas

- nao acoplar ao `questions`
- nao criar chat livre no MVP
- nao aceitar PDF ruim no MVP
- nao prometer OCR no MVP
- nao colocar podcast no MVP
- nao transformar cada tela em formulario
- nao repetir perguntas ao usuario
- nao criar um arquivo central gigantesco
- nao depender de IA para tudo
- nao sacrificar mobile

---

## 20. Definicao de excelencia

O produto sera considerado excelente quando:

- carregar leve
- parecer premium
- dar sensacao de trilha pessoal
- reduzir decisao desnecessaria
- orientar o aluno de forma clara
- gerar conteudo util e focado
- funcionar bem no celular
- manter custo baixo por usuario

Definicao final:

```txt
excelencia aqui nao e excesso de features
excelencia aqui e clareza, foco, personalizacao percebida e utilidade real
```
