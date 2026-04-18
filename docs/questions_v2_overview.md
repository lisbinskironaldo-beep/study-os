# ROTANOTA - QUESTIONS V2 - VISAO E PROPOSITO

Documento interno de direcionamento.
Nao deve aparecer na interface do produto.

Atualizado em 2026-03-27.

---

## 1. Motivo desta etapa

O modulo `questions` deixou de ser apenas uma aba complementar de um projeto que nasceu como relogio.
Hoje ele concentra banco de questoes, fluxo de treino, sessao, retomada, guardados, perfis e logica pedagogica.

O problema atual nao e apenas bug ou travamento isolado.
O problema passou a ser estrutural:

- o modulo cresceu acima da base original
- o carregamento atual puxa informacao demais para a thread principal
- o estado ficou espalhado em globais e persistencia local pesada
- a arquitetura atual nao foi desenhada para sustentar um banco muito maior

Regra desta etapa:

```txt
nao fazer mais remendo para suportar escala
redefinir a base do modulo para crescer com seguranca
```

---

## 2. Proposito do `questions v2`

O `questions v2` existe para transformar o modulo em uma camada sustentavel de longo prazo.

Ele precisa permitir:

- crescimento grande do banco escolar sem travar a interface
- entrada futura de banco ENEM sem colidir com treino escolar
- sessoes longas e retomada sem depender de snapshots pesados
- filtros, ranking e selecao inteligente sem bloquear a UI
- continuidade de manutencao por outras pessoas sem precisar reinterpretar tudo

---

## 3. Objetivo de produto

O produto continua com a mesma intencao central:

```txt
nao e um sistema para responder perguntas
e um sistema para evolucao mensuravel por dominio
```

O `questions v2` deve sustentar quatro frentes sem improviso:

- treino especifico
- treino inteligente
- guardados e retomada
- readiness real para ENEM e simulado separado

---

## 4. O que esta fora do escopo desta etapa

Esta rodada nao existe para:

- redesenhar toda a interface imediatamente
- criar o modulo ENEM agora
- reescrever o produto inteiro de uma vez
- mover tudo para framework so porque cresceu

Esta rodada existe para definir a base correta e a ordem segura de migracao.

---

## 5. Decisao estrutural fechada

O modulo `questions` deixa de ser tratado como extensao incidental do relogio.
Ele passa a ser tratado como um dominio proprio dentro do projeto.

Regra:

```txt
o shell continua sendo o ROTANOTA
questions passa a ser um dominio isolado
```

Isso significa:

- bootstrap proprio
- estado proprio
- persistencia propria
- servicos proprios
- contrato claro com o shell

---

## 6. Resultado esperado ao final da migracao

Quando a migracao estiver madura, o sistema deve operar assim:

- o app principal carrega rapido
- `questions` entra sem importar o banco inteiro de uma vez
- o manifesto do banco responde o que existe
- o conteudo detalhado entra sob demanda
- a sessao salva progresso leve por ids
- a interface nao depende de `localStorage` pesado para continuar funcionando
- o crescimento do banco passa a ser problema de conteudo, nao de arquitetura

---

## 7. Documentos desta fase

Este pacote documental fica dividido assim:

- `docs/questions_v2_overview.md`
- `docs/questions_v2_architecture.md`
- `docs/questions_v2_execution_master_plan.md`
- `docs/questions_v2_migration_plan.md`
- `docs/questions_v2_handoff_checklist.md`

Uso recomendado:

- ler `overview` para entender o por que
- ler `architecture` para entender o alvo
- ler `execution_master_plan` para entender a sequencia operacional ate o fim
- executar `migration_plan` por fase
- usar `handoff_checklist` no dia a dia de continuacao
