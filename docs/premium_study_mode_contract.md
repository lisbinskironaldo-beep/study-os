# Premium Study: contrato atual das abas

## Objetivo

Este documento registra o comportamento esperado de `Aprender`, `Praticar`, `Prova` e `PDF em Texto`, incluindo o que acontece quando o sistema ainda esta preparando os modos a partir do material.

## Regra global de preparacao

Quando o sistema ainda nao tem base suficiente para abrir `Aprender`, `Praticar` ou `Prova`, ele:

- fica na tela atual
- nao abre a aba de destino antes da hora
- mostra um overlay com a mensagem de preparacao
- monta os modos a partir do texto disponivel em `PDF em Texto`
- so libera a navegacao quando a base terminar de ficar pronta

Isso evita o comportamento ruim de:

- abrir uma tela vazia
- voltar sozinho
- reabrir depois

## Linguagem unica de carregamento

As esperas visiveis do `premium study` devem usar a mesma identidade visual de loading:

- preparacao de modos
- processamento inicial
- sincronizacao da biblioteca premium
- retomada de estudo salvo
- salvamento manual do `PDF em Texto`

Regras:

- evitar tela estatica sem sinal de vida
- usar a mesma assinatura visual de trilha, nao spinner generico
- nao disparar esse overlay para autosaves rapidos em segundo plano

## Papel de cada aba

### Aprender

Objetivo:

- abrir o mapa de assuntos
- permitir entrar em um assunto por vez
- priorizar leitura guiada e explicacao orientada ao resultado

Deve fazer:

- depender de blocos ja montados
- abrir `learn-map` primeiro
- levar para o resumo do bloco sem painel grande competindo com a leitura

Nao deve fazer:

- abrir antes dos blocos existirem
- usar fallback visual confuso enquanto a base ainda esta em preparacao

### Praticar

Objetivo:

- levar para os formatos de treino do bloco atual

Deve fazer:

- abrir a tela de entrada com `Questionario`, `Verdadeiro ou falso` e `Flashcards`
- mostrar progresso por formato
- manter a pratica separada do resumo e da prova

Nao deve fazer:

- exibir painel grande de `Plano em construcao` dentro da tela de pratica
- depender de blocos inexistentes

### Prova

Objetivo:

- gerar prova de nivel premium a partir da trilha montada

Deve fazer:

- exigir a base dos modos pronta antes de gerar questoes
- abrir com seletor de quantidade
- mostrar apenas a prova e o feedback, sem painel lateral de resumo concorrendo
- usar fallback local com base nos blocos ja gerados se a IA especifica da prova falhar naquele momento

Nao deve fazer:

- tentar gerar questoes com trilha vazia
- parecer erro quando ainda esta montando a base

### PDF em Texto

Objetivo:

- abrir uma copia textual editavel do material
- servir de base estavel para regenerar `Aprender`, `Praticar` e `Prova`

Deve fazer:

- abrir gratis quando a extracao local estiver forte o suficiente
- usar premium quando o PDF parecer imagem ou scan e precisar de IA para conversao robusta
- salvar o texto editado para reuso e sincronizacao

Nao deve fazer:

- fingir que o PDF ruim ja virou base completa sem texto suficiente

## PDFs de baixa qualidade

Regra atual:

- o gratis pode conseguir texto parcial para `Aprender`
- `PDF em Texto` gratis so abre quando a extracao local vier forte
- se o arquivo parecer imagem ou scan, o sistema explica que nao e erro e oferece a conversao premium
- depois que o premium converte o texto com sucesso, `Aprender`, `Praticar` e `Prova` devem passar a usar essa base

## Comportamento esperado apos premium em PDF escaneado

1. usuario tenta abrir `PDF em Texto`
2. sistema detecta que o arquivo parece imagem/scan
3. premium e oferecido com mensagem objetiva
4. apos liberar o premium, o sistema converte o texto
5. enquanto prepara, a interface fica travada com overlay
6. quando a base termina:
   - `PDF em Texto` fica disponivel
   - `Aprender`, `Praticar` e `Prova` podem ser regenerados a partir dessa base

## Estado que precisa existir para abrir em outro PC

- mesma conta Google
- schema `docs/supabase_premium_schema.sql` aplicado
- estudo salvo na biblioteca premium
- texto extraido persistido no snapshot

Guia operacional complementar:

- `docs/premium_documentos_sync.md`
