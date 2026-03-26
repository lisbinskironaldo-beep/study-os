# STUDY OS - STATUS DO MODULO DE QUESTOES

Documento interno de acompanhamento.
Atualizado em 2026-03-26.

---

## Checklist de etapas

- [x] Revisar a estrutura atual do banco escolar por serie, materia e categoria
- [x] Confirmar que `questions` e `simulado` devem seguir fluxos separados
- [x] Preparar a aba `questions` para exibir a base atual e o botao de ENEM
- [x] Melhorar a descoberta de assuntos com busca local
- [x] Adicionar controle para ocultar assuntos vazios e deixar o launcher mais intuitivo
- [x] Atualizar o schema recomendado das questoes para crescimento futuro
- [x] Editar um arquivo real do banco como referencia de preenchimento
- [x] Gerar snapshot interno com series, materias e categorias atuais
- [ ] Criar o modulo separado de treino ENEM
- [ ] Criar o modulo separado de simulado ENEM
- [ ] Conectar `sourceYear`, `sourceExam` e `competencies` aos filtros da interface
- [ ] Criar ingestao guiada para lote de questoes revisadas

---

## Decisoes fechadas nesta etapa

- `questions` continua como treino escolar personalizavel
- `ENEM` fica preparado na interface, mas separado de `questions`
- a hierarquia principal continua `serie -> materia -> assunto`
- o crescimento futuro deve acontecer por metadados da questao, nao so por novas pastas
- filtros que passam a ser oficiais no schema:
  - `base`
  - `subtopico`
  - `tags`
  - `habilidades`
  - `sourceType`
  - `collections`
  - `status`

---

## Arquivo de referencia editado

- `questions/banks/1-serie/matematica/notacao-cientifica/index.js`

Esse arquivo agora serve como exemplo de preenchimento com:

- `metadados.base`
- `metadados.frente`
- `metadados.searchAliases`
- `metadados.habilidadesBase`
- `habilidades`
- `collections`
- `sourceType`
- `sourceExam`
- `sourceYear`
- `competencies`
- `status`

---

## Proxima etapa sugerida

Aplicar o mesmo padrao do arquivo de referencia nas categorias que ja possuem questoes reais, antes de expandir ENEM e simulado.
