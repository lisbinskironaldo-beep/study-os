# Handoff mestre - auditoria editorial dos bancos de questões

Atualizado em 2026-04-30.

## Objetivo

Limpar os bancos de questões matéria por matéria, nas três séries, com validação objetiva antes de marcar qualquer matéria como auditada.

O objetivo é evitar retrabalho: uma matéria só sai da fila quando tiver relatório textual, relatório de integridade e selo novo no próprio banco.

## Status atual

### Concluído

#### Português - 1ª, 2ª e 3ª séries

- Escopo: `questions/banks/*-serie/portugues`
- Arquivos de tópico auditados: 19
- Questões analisadas: 3.200
- Auditoria textual: 0 suspeitas
- Auditoria de integridade: 0 problemas
- Sintaxe: `node --check` sem erros
- Selo aplicado: `metadados.auditoriaEditorial.status = "AUDITADA"`
- Documento detalhado: `docs/questions_portugues_editorial_audit_2026-04-30.md`
- Relatórios:
  - `.codex-artifacts/editorial-audit/todas-series__portugues.md`
  - `.codex-artifacts/editorial-audit/integrity__todas-series__portugues.md`

Observação: os selos antigos `seloEditorial: "VERIFICADA"` e `status: "revisada"` não devem ser tratados como garantia editorial.

#### Matemática - 1ª, 2ª e 3ª séries

- Escopo: `questions/banks/*-serie/matematica`
- Arquivos de tópico auditados: 20
- Questões analisadas: 3.410
- Auditoria textual: 0 suspeitas
- Auditoria de integridade: 0 problemas
- Sintaxe: `node --check` sem erros
- Selo aplicado: `metadados.auditoriaEditorial.status = "AUDITADA"`
- Documento detalhado: `docs/questions_matematica_editorial_audit_2026-04-30.md`
- Relatórios:
  - `.codex-artifacts/editorial-audit/todas-series__matematica.md`
  - `.codex-artifacts/editorial-audit/integrity__todas-series__matematica.md`

Observação: foi corrigida uma inconsistência real em `prob_169`, cuja resposta correta não estava nas opções.

#### Física - 1ª, 2ª e 3ª séries

- Escopo: `questions/banks/*-serie/fisica`
- Arquivos de tópico auditados: 14
- Questões analisadas: 1.650
- Auditoria textual: 0 suspeitas
- Auditoria de integridade: 0 problemas
- Sintaxe: `node --check` sem erros
- Selo aplicado: `metadados.auditoriaEditorial.status = "AUDITADA"`
- Documento detalhado: `docs/questions_fisica_editorial_audit_2026-04-30.md`
- Relatórios:
  - `.codex-artifacts/editorial-audit/todas-series__fisica.md`
  - `.codex-artifacts/editorial-audit/integrity__todas-series__fisica.md`

Observação: a limpeza concentrou-se nos tópicos de 3ª série, especialmente Óptica, Ondulatória, Eletrodinâmica e Magnetismo.

#### Inglês - 1ª, 2ª e 3ª séries

- Escopo: `questions/banks/*-serie/ingles`
- Arquivos de tópico auditados: 12
- Questões analisadas: 1.800
- Auditoria textual: 0 suspeitas
- Auditoria de integridade: 0 problemas
- Sintaxe: `node --check` sem erros
- Selo aplicado: `metadados.auditoriaEditorial.status = "AUDITADA"`
- Documento detalhado: `docs/questions_ingles_editorial_audit_2026-04-30.md`
- Relatórios:
  - `.codex-artifacts/editorial-audit/todas-series__ingles.md`
  - `.codex-artifacts/editorial-audit/integrity__todas-series__ingles.md`

Observação: a auditoria preservou termos legítimos em inglês, como `media` em `Technology and media`.

#### Biologia - 1ª, 2ª e 3ª séries

- Escopo: `questions/banks/*-serie/biologia`
- Arquivos de tópico auditados: 16
- Questões analisadas: 2.600
- Auditoria textual: 0 suspeitas
- Auditoria de integridade: 0 problemas
- Sintaxe: `node --check` sem erros
- Selo aplicado: `metadados.auditoriaEditorial.status = "AUDITADA"`
- Documento detalhado: `docs/questions_biologia_editorial_audit_2026-04-30.md`
- Relatórios:
  - `.codex-artifacts/editorial-audit/todas-series__biologia.md`
  - `.codex-artifacts/editorial-audit/integrity__todas-series__biologia.md`

Observação: a limpeza concentrou-se em Origem da Vida, Metabolismo Celular, Biotecnologia, Evolução, Ecologia e Impactos Ambientais.

#### Química - 1ª, 2ª e 3ª séries

- Escopo: `questions/banks/*-serie/quimica`
- Arquivos de tópico auditados: 15
- Questões analisadas: 1.800
- Auditoria textual: 0 suspeitas
- Auditoria de integridade: 0 problemas
- Sintaxe: `node --check` sem erros
- Selo aplicado: `metadados.auditoriaEditorial.status = "AUDITADA"`
- Documento detalhado: `docs/questions_quimica_editorial_audit_2026-04-30.md`
- Relatórios:
  - `.codex-artifacts/editorial-audit/todas-series__quimica.md`
  - `.codex-artifacts/editorial-audit/integrity__todas-series__quimica.md`

Observação: a limpeza concentrou-se em Funções Inorgânicas, Tabela Periódica, Reações Químicas, Estequiometria, Soluções, Termoquímica, Química Orgânica, Funções Orgânicas e Polímeros.

#### Filosofia - 1ª, 2ª e 3ª séries

- Escopo: `questions/banks/*-serie/filosofia`
- Arquivos de tópico auditados: 11
- Questões analisadas: 800
- Auditoria textual: 0 suspeitas
- Auditoria de integridade: 0 problemas
- Sintaxe: `node --check` sem erros
- Selo aplicado: `metadados.auditoriaEditorial.status = "AUDITADA"`
- Documento detalhado: `docs/questions_filosofia_editorial_audit_2026-04-30.md`
- Relatórios:
  - `.codex-artifacts/editorial-audit/todas-series__filosofia.md`
  - `.codex-artifacts/editorial-audit/integrity__todas-series__filosofia.md`

Observação: a limpeza concentrou-se em Introdução à Filosofia, Pré-socráticos, Sócrates/Platão/Aristóteles, Filosofia Moderna, Iluminismo, Ética, Existencialismo e Filosofia Contemporânea.

#### Sociologia - 1ª, 2ª e 3ª séries

- Escopo: `questions/banks/*-serie/sociologia`
- Arquivos de tópico auditados: 12
- Questões analisadas: 1.350
- Auditoria textual: 0 suspeitas
- Auditoria de integridade: 0 problemas
- Sintaxe: `node --check` sem erros
- Selo aplicado: `metadados.auditoriaEditorial.status = "AUDITADA"`
- Documento detalhado: `docs/questions_sociologia_editorial_audit_2026-04-30.md`
- Relatórios:
  - `.codex-artifacts/editorial-audit/todas-series__sociologia.md`
  - `.codex-artifacts/editorial-audit/integrity__todas-series__sociologia.md`

Observação: a limpeza concentrou-se em Cultura e Sociedade, Socialização, Identidade, Estrutura Social, Classes Sociais, Trabalho, Cidadania, Movimentos Sociais e Política.

#### História - 1ª, 2ª e 3ª séries

- Escopo: `questions/banks/*-serie/historia`
- Arquivos de tópico auditados: 13
- Questões analisadas: 2.000
- Auditoria textual: 0 suspeitas
- Auditoria de integridade: 0 problemas
- Sintaxe: `node --check` sem erros
- Selo aplicado: `metadados.auditoriaEditorial.status = "AUDITADA"`
- Documento detalhado: `docs/questions_historia_editorial_audit_2026-04-30.md`
- Relatórios:
  - `.codex-artifacts/editorial-audit/todas-series__historia.md`
  - `.codex-artifacts/editorial-audit/integrity__todas-series__historia.md`

Observação: a limpeza concentrou-se em Feudalismo, Formação dos Estados Modernos, Expansão Marítima, Independência do Brasil, Antiguidade, Revoluções Industrial e Francesa, República no Brasil, Ditadura Militar, História Contemporânea e Período Imperial.

#### Geografia - 1ª, 2ª e 3ª séries

- Escopo: `questions/banks/*-serie/geografia`
- Arquivos de tópico auditados: 15
- Questões analisadas: 2.400
- Auditoria textual: 0 suspeitas
- Auditoria de integridade: 0 problemas
- Sintaxe: `node --check` sem erros
- Selo aplicado: `metadados.auditoriaEditorial.status = "AUDITADA"`
- Documento detalhado: `docs/questions_geografia_editorial_audit_2026-04-30.md`
- Relatórios:
  - `.codex-artifacts/editorial-audit/todas-series__geografia.md`
  - `.codex-artifacts/editorial-audit/integrity__todas-series__geografia.md`

Observação: a limpeza concentrou-se em Cartografia, Clima e Relevo, População, Estrutura da Terra, Economia Mundial, Globalização, Industrialização, Urbanização, Brasil Atual, Energia, Geopolítica e Meio Ambiente.

#### Artes - 1ª, 2ª e 3ª séries

- Escopo: `questions/banks/*-serie/artes`
- Arquivos de tópico auditados: 8
- Questões analisadas: 500
- Auditoria textual: 0 suspeitas
- Auditoria de integridade: 0 problemas
- Sintaxe: `node --check` sem erros
- Selo aplicado: `metadados.auditoriaEditorial.status = "AUDITADA"`
- Documento detalhado: `docs/questions_artes_editorial_audit_2026-04-30.md`
- Relatórios:
  - `.codex-artifacts/editorial-audit/todas-series__artes.md`
  - `.codex-artifacts/editorial-audit/integrity__todas-series__artes.md`

Observação: a limpeza concentrou-se em Elementos Visuais, História da Arte Clássica, Arte Moderna, Movimentos Artísticos e Arte Contemporânea.

#### Educação Física - 1ª, 2ª e 3ª séries

- Escopo: `questions/banks/*-serie/educacao-fisica`
- Arquivos de tópico auditados: 8
- Questões analisadas: 500
- Auditoria textual: 0 suspeitas
- Auditoria de integridade: 0 problemas
- Sintaxe: `node --check` sem erros
- Selo aplicado: `metadados.auditoriaEditorial.status = "AUDITADA"`
- Documento detalhado: `docs/questions_educacao_fisica_editorial_audit_2026-04-30.md`
- Relatórios:
  - `.codex-artifacts/editorial-audit/todas-series__educacao-fisica.md`
  - `.codex-artifacts/editorial-audit/integrity__todas-series__educacao-fisica.md`

Observação: a limpeza concentrou-se em Cultura Corporal, Esportes Básicos, Esportes Coletivos, Saúde e Corpo e Qualidade de Vida.

## Critério para chamar uma matéria de limpa

Uma matéria só pode receber selo novo de auditoria quando todos os itens abaixo passarem:

1. Auditoria textual zerada:

```bash
node scripts/audit-question-bank-text.mjs --materia <materia>
```

Resultado exigido:

- `Arquivos com suspeitas: 0`
- `Suspeitas totais: 0`

2. Auditoria de integridade zerada:

```bash
node scripts/audit-question-integrity.mjs --materia <materia>
```

Resultado exigido:

- `Arquivos com problemas: 0`
- `Problemas totais: 0`

3. Sintaxe válida nos arquivos da matéria:

```powershell
Get-ChildItem -Path questions\banks\1-serie\<materia>,questions\banks\2-serie\<materia>,questions\banks\3-serie\<materia> -Recurse -Filter index.js | ForEach-Object { node --check $_.FullName }
```

4. Selo novo aplicado no export da matéria:

- criar ou ampliar metadado em `questions/banks/_shared/editorialAuditMetadata.js`
- aplicar helper nos `index.js` da matéria nas três séries
- confirmar por import que todos os tópicos exportados têm `metadados.auditoriaEditorial.status === "AUDITADA"`

5. Documento de auditoria criado:

Formato sugerido:

```text
docs/questions_<materia>_editorial_audit_YYYY-MM-DD.md
```

## Scripts disponíveis

- `scripts/audit-question-bank-text.mjs`
- `scripts/audit-question-integrity.mjs`
- `scripts/fix-portugues-editorial-text.mjs`
- `scripts/fix-matematica-editorial-text.mjs`
- `scripts/fix-fisica-editorial-text.mjs`
- `scripts/fix-ingles-editorial-text.mjs`
- `scripts/fix-biologia-editorial-text.mjs`
- `scripts/fix-quimica-editorial-text.mjs`
- `scripts/fix-filosofia-editorial-text.mjs`
- `scripts/fix-sociologia-editorial-text.mjs`
- `scripts/fix-historia-editorial-text.mjs`
- `scripts/fix-geografia-editorial-text.mjs`
- `scripts/fix-artes-editorial-text.mjs`
- `scripts/fix-educacao-fisica-editorial-text.mjs`
- `scripts/fix-ortografia-options.mjs`

Os dois primeiros são reutilizáveis para qualquer matéria.

Os scripts de correção existentes são específicos de Português, Matemática, Física, Inglês, Biologia, Química, Filosofia, Sociologia, História, Geografia, Artes e Educação Física.

## Fila sugerida por matéria

Ordem recomendada considerando volume, impacto no uso e risco de texto exibido:

Nenhuma matéria pendente nesta fila.

Português, Matemática, Física, Inglês, Biologia, Química, Filosofia, Sociologia, História, Geografia, Artes e Educação Física já estão concluídos e não devem voltar para a fila de limpeza textual/integridade.

## Plano por matéria

### 1. Matemática

Status: concluída em 2026-04-30.

Escopo:

- `questions/banks/1-serie/matematica`
- `questions/banks/2-serie/matematica`
- `questions/banks/3-serie/matematica`

Foco:

- acentuação em enunciados e comentários
- símbolos matemáticos quebrados
- alternativas duplicadas
- correta presente nas opções
- unidades, porcentagem, notação científica, funções e geometria
- enunciados que peçam cálculo mas não forneçam dados suficientes

Resultado esperado:

- relatório textual zerado: concluído
- relatório de integridade zerado: concluído
- selo `Matemática - 1ª, 2ª e 3ª séries`: aplicado

### 2. Física

Status: concluída em 2026-04-30.

Escopo:

- `questions/banks/1-serie/fisica`
- `questions/banks/2-serie/fisica`
- `questions/banks/3-serie/fisica`

Foco:

- acentuação e termos técnicos
- grandezas, unidades e coerência dimensional
- alternativas duplicadas
- correta presente nas opções
- evitar confusão entre Dinâmica, Eletrodinâmica, Cinemática e Energia

Resultado esperado:

- relatório textual zerado: concluído
- relatório de integridade zerado: concluído
- selo `Física - 1ª, 2ª e 3ª séries`: aplicado

### 3. Inglês

Status: concluída em 2026-04-30.

Escopo:

- `questions/banks/1-serie/ingles`
- `questions/banks/2-serie/ingles`
- `questions/banks/3-serie/ingles`

Foco:

- português exibido nos metadados/comentários
- inglês correto nos textos e alternativas
- tradução ou explicação sem texto bruto
- alternativa correta presente nas opções
- evitar distratores idênticos

Resultado esperado:

- relatório textual zerado: concluído
- relatório de integridade zerado: concluído
- selo `Inglês - 1ª, 2ª e 3ª séries`: aplicado

### 4. Biologia

Status: concluída em 2026-04-30.

Escopo:

- `questions/banks/1-serie/biologia`
- `questions/banks/2-serie/biologia`
- `questions/banks/3-serie/biologia`

Foco:

- acentuação de termos como célula, citologia, genética, ecologia
- conceitos corretos
- alternativas duplicadas
- comentários que não contradigam a correta
- nomes científicos e processos biológicos

Resultado esperado:

- relatório textual zerado: concluído
- relatório de integridade zerado: concluído
- selo `Biologia - 1ª, 2ª e 3ª séries`: aplicado

### 5. Química

Status: concluída em 2026-04-30.

Escopo:

- `questions/banks/1-serie/quimica`
- `questions/banks/2-serie/quimica`
- `questions/banks/3-serie/quimica`

Foco:

- acentuação e símbolos
- fórmulas, unidades, cargas e nomenclatura
- coerência entre enunciado, alternativa correta e comentário
- evitar alternativas duplicadas ou impossíveis

Resultado esperado:

- relatório textual zerado: concluído
- relatório de integridade zerado: concluído
- selo `Química - 1ª, 2ª e 3ª séries`: aplicado

### 6. Filosofia

Status: concluída em 2026-04-30.

Escopo:

- `questions/banks/1-serie/filosofia`
- `questions/banks/2-serie/filosofia`
- `questions/banks/3-serie/filosofia`

Foco:

- acentuação de ética, juízo, reflexão, filosófico
- coerência conceitual entre autor, corrente e definição
- alternativa correta presente nas opções
- comentários sem simplificação enganosa

Resultado esperado:

- relatório textual zerado: concluído
- relatório de integridade zerado: concluído
- selo `Filosofia - 1ª, 2ª e 3ª séries`: aplicado

### 7. Sociologia

Status: concluída em 2026-04-30.

Escopo:

- `questions/banks/1-serie/sociologia`
- `questions/banks/2-serie/sociologia`
- `questions/banks/3-serie/sociologia`

Foco:

- acentuação e português exibido
- conceitos como sociedade, cultura, desigualdade, cidadania
- coerência entre teoria, autor e exemplo
- alternativas duplicadas

Resultado esperado:

- relatório textual zerado: concluído
- relatório de integridade zerado: concluído
- selo `Sociologia - 1ª, 2ª e 3ª séries`: aplicado

### 8. História

Status: concluída em 2026-04-30.

Escopo:

- `questions/banks/1-serie/historia`
- `questions/banks/2-serie/historia`
- `questions/banks/3-serie/historia`

Foco:

- acentuação de história, política, econômico, período
- cronologia básica
- nomes de processos históricos
- correta presente nas opções
- comentários sem anacronismo óbvio

Resultado esperado:

- relatório textual zerado: concluído
- relatório de integridade zerado: concluído
- selo `História - 1ª, 2ª e 3ª séries`: aplicado

### 9. Geografia

Status: concluída em 2026-04-30.

Escopo:

- `questions/banks/1-serie/geografia`
- `questions/banks/2-serie/geografia`
- `questions/banks/3-serie/geografia`

Foco:

- acentuação e termos técnicos
- clima, relevo, cartografia, urbanização, população
- coerência entre conceito e exemplo
- alternativas duplicadas

Resultado esperado:

- relatório textual zerado: concluído
- relatório de integridade zerado: concluído
- selo `Geografia - 1ª, 2ª e 3ª séries`: aplicado

### 10. Artes

Status: concluída em 2026-04-30.

Escopo:

- `questions/banks/1-serie/artes`
- `questions/banks/2-serie/artes`
- `questions/banks/3-serie/artes`

Foco:

- acentuação e nomes de movimentos
- relação correta entre obra, período, linguagem e conceito
- alternativas duplicadas
- texto exibido sem bruto ou placeholder

Resultado esperado:

- relatório textual zerado: concluído
- relatório de integridade zerado: concluído
- selo `Artes - 1ª, 2ª e 3ª séries`: aplicado

### 11. Educação Física

Status: concluída em 2026-04-30.

Escopo:

- `questions/banks/1-serie/educacao-fisica`
- `questions/banks/2-serie/educacao-fisica`
- `questions/banks/3-serie/educacao-fisica`

Foco:

- acentuação de Educação Física e termos corporais
- conceitos de esporte, cultura corporal, saúde e regras
- alternativas duplicadas
- comentário coerente com a correta

Resultado esperado:

- relatório textual zerado: concluído
- relatório de integridade zerado: concluído
- selo `Educação Física - 1ª, 2ª e 3ª séries`: aplicado

## Pendências atuais

### Auditoria editorial textual/integridade

Status: concluída para todas as matérias da fila.

Não há matéria pendente para continuar nesta frente.

Matérias concluídas:

- Português
- Matemática
- Física
- Inglês
- Biologia
- Química
- Filosofia
- Sociologia
- História
- Geografia
- Artes
- Educação Física

Evidências:

- cada matéria tem documento próprio em `docs/questions_<materia>_editorial_audit_2026-04-30.md`
- cada matéria tem relatório textual e relatório de integridade em `.codex-artifacts/editorial-audit/`
- os índices das três séries aplicam o helper de auditoria editorial da matéria
- os tópicos exportados carregam `metadados.auditoriaEditorial.status === "AUDITADA"`

Verificação consolidada em 2026-04-30:

- auditoria textual: 0 suspeitas em Português, Matemática, Física, Inglês, Biologia, Química, Filosofia, Sociologia, História, Geografia, Artes e Educação Física
- auditoria de integridade: 0 problemas em Português, Matemática, Física, Inglês, Biologia, Química, Filosofia, Sociologia, História, Geografia, Artes e Educação Física

Observação sobre documentos antigos:

- `docs/questions_2026-03-31_inventory_snapshot.md` ainda contém menções históricas a `Legado pendente de revisao gramatical`.
- Essas menções pertencem ao snapshot antigo e não representam a situação atual da auditoria editorial de 2026-04-30.
- A fonte atual de verdade para esta frente é este handoff mestre mais os documentos `docs/questions_*_editorial_audit_2026-04-30.md`.

### Pendências para seguir

1. Consolidar as mudanças em commit/release.
2. Opcional: fazer revisão pedagógica humana por amostragem, focada em qualidade didática, distratores e profundidade conceitual.
3. Opcional: atualizar ou arquivar snapshots antigos que ainda mencionam legado pendente, para evitar confusão futura.
4. Opcional: rodar uma verificação global de produto/fluxo visual se essas mudanças forem entrar em release público.

## Checklist modelo ao finalizar cada matéria

- [ ] Rodar auditoria textual.
- [ ] Corrigir textos e rodar novamente até zerar.
- [ ] Rodar auditoria de integridade.
- [ ] Corrigir problemas estruturais até zerar.
- [ ] Rodar `node --check` nos arquivos da matéria.
- [ ] Criar documento da matéria em `docs/`.
- [ ] Adicionar selo novo em `editorialAuditMetadata.js`.
- [ ] Aplicar helper nos `index.js` da matéria nas três séries.
- [ ] Importar os exports e confirmar que todos os tópicos têm `auditoriaEditorial.status === "AUDITADA"`.
- [ ] Não alterar ou confiar em `seloEditorial: "VERIFICADA"` como selo final.

## Próxima ação sugerida

Fila de auditoria editorial textual/integridade concluída para todas as matérias listadas. Próxima etapa sugerida: consolidar commit/release ou iniciar uma revisão pedagógica humana por amostragem.
