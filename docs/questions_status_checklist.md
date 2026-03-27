# STUDY OS - STATUS DO MODULO DE QUESTOES

Documento interno de acompanhamento.
Atualizado em 2026-03-27.

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

No modulo `questions`, a etapa visual atual ficou assim:

- [x] simplificar a home para `Treino inteligente`, `Especificar treino` e `Guardados`
- [x] rebaixar `Retomar treino` para acao secundaria
- [x] manter `Especificar treino` abrindo a tela detalhada atual
- [x] manter a entrada circular do `Treino inteligente`
- [x] reduzir a tela final do treino inteligente para uma revisao curta com `objetivo`, `quantidade`, `guardar` e `comecar`

Proxima rodada sugerida:

- [ ] transformar a etapa de materias em uma selecao ainda mais direta, com menos leitura auxiliar
- [ ] trocar a etapa atual de assuntos por um fluxo por materia, uma aberta por vez
- [ ] adicionar a tela curta de limites da sessao com quantidade e tempo
- [ ] refinar `Guardados` e `Retomar treino` para consulta, duplicacao e reinicio mais rapidos
- [ ] manter o mini player fechado por padrao e evitar flashes de tela ao abrir `questions`

Base ja pronta para sustentar essa etapa:

- [x] perfis inteligentes
- [x] blocos salvos
- [x] runs com pausa e retomada
