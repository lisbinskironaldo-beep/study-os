# STUDY OS - HANDOFF DE QUESTOES

Documento de retomada.
Atualizado em 2026-04-09.

---

## 1. O que ficou pronto nesta rodada

- etapa `1ª série > Português` revisada em texto
- revisão feita em:
  - `questions/banks/1-serie/portugues/interpretacao-de-texto/index.js`
  - `questions/banks/1-serie/portugues/generos-textuais/index.js`
  - `questions/banks/1-serie/portugues/funcoes-da-linguagem/index.js`
  - `questions/banks/1-serie/portugues/figuras-de-linguagem/index.js`
  - `questions/banks/1-serie/portugues/gramatica-classes-de-palavras/index.js`
  - `questions/banks/1-serie/portugues/ortografia-e-pontuacao/index.js`
  - `questions/banks/1-serie/portugues/literatura-trovadorismo-humanismo-classicismo/index.js`
- critério da revisão:
  - ortografia
  - acentuação
  - pontuação
  - sinais gráficos
  - padronização de enunciados e comentários
- validação feita com `node --check` nos arquivos revisados

---

## 2. Script de apoio já criado

Arquivo:

- `scripts/review-portugues-1-serie.mjs`

Objetivo:

- reconstruir os arquivos da etapa `1ª série > Português` a partir do `HEAD`
- aplicar correções apenas em campos textuais legíveis
- preservar estrutura, `id`, `tags`, `habilidades` e demais campos técnicos

Campos que o script pode revisar:

- `materia`
- `topico`
- `subtopico`
- `eixo`
- `frente`
- `searchAliases`
- `subtopicosBase`
- `habilidadesBase`
- `enunciado`
- `opcoes`
- `correta`
- `comentario`

Regra importante:

- não usar o mesmo script automaticamente no resto do banco sem antes adaptar o dicionário por matéria

---

## 3. Próximas etapas da revisão do banco

### Etapa 2 - Restante da 1ª série

Ordem sugerida:

1. `Matemática`
2. `História`
3. `Geografia`
4. `Biologia`
5. `Química`
6. `Física`
7. `Inglês`
8. `Filosofia`
9. `Sociologia`
10. `Artes`
11. `Educação Física`

Critério de trabalho:

- revisar por matéria inteira
- validar a sintaxe no fim de cada matéria
- não alterar `id`, imports, exports, `tags`, `habilidades` nem estrutura dos objetos

### Etapa 3 - 2ª série

Repetir a mesma estratégia:

- por matéria
- com checkpoints naturais por bloco
- validação sintática ao fim de cada matéria

### Etapa 4 - 3ª série

Mesmo fluxo da etapa 3.

### Etapa 5 - Validação final

Checagens sugeridas:

1. `node --check` em todos os `index.js` de `questions/banks`
2. varredura de palavras ASCII comuns ainda não revisadas
3. teste manual rápido no launcher e em uma sessão real

---

## 4. Cuidados para a próxima conversa

- continuar tratando a revisão como textual, não estrutural
- se criar scripts novos, limitar por matéria ou por etapa
- antes de reescrever arquivos em lote, confirmar se não existem alterações locais manuais nesses arquivos
- quando revisar comentários e enunciados, manter o nível de dificuldade e a intenção pedagógica original

---

## 5. Frente nova já definida

Foi decidido criar uma nova forma de seleção dentro do mesmo launcher:

- `Treino por assunto`

Documento de referência desta frente:

- `docs/questions_topic_training_plan.md`

Resumo rápido:

- entra ao lado de `Treino inteligente`
- fluxo prático e único
- seleção escalonável:
  - matéria
  - assunto
  - dificuldade
  - quantidade
- painel de montagem visível na mesma aba
- possibilidade de incluir mais, alterar e excluir
- consolidação final do treino
- temporizador embutido após consolidar
- visual minimalista e pouco poluído
