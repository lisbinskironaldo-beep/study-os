# Auditoria editorial de Filosofia - 2026-04-30

## Escopo

- Matéria: Filosofia.
- Séries: 1ª, 2ª e 3ª séries.
- Arquivos analisados: 11.
- Questões analisadas: 800.

## Critérios aplicados

- Acentuação e ortografia exibíveis em enunciados, opções, respostas, comentários, tópicos e metadados textuais.
- Remoção de suspeitas de mojibake e caracteres quebrados.
- Termos filosóficos, autores, correntes e conceitos exibíveis.
- Alternativa correta presente nas opções.
- Alternativas duplicadas.
- Campos obrigatórios, placeholders e texto bruto.
- Sintaxe dos módulos `index.js`.

## Resultado

- Suspeitas textuais: 0.
- Problemas de integridade: 0.

Relatórios gerados:

- `.codex-artifacts/editorial-audit/todas-series__filosofia.md`
- `.codex-artifacts/editorial-audit/integrity__todas-series__filosofia.md`

## Correções relevantes

- Corrigidos termos recorrentes como ética, reflexão, filosófica, juízo, caráter, formação, educação, razão, política, história, existência, consciência, relação, ação, ações, técnica e termos relacionados.
- A limpeza concentrou-se em Introdução à Filosofia, Pré-socráticos, Sócrates/Platão/Aristóteles, Filosofia Moderna, Iluminismo, Ética, Existencialismo e Filosofia Contemporânea.
- A auditoria de integridade já estava zerada antes das correções textuais.

## Marca persistente

Os índices de Filosofia das três séries aplicam `withPhilosophyEditorialAudit`, que adiciona `metadados.auditoriaEditorial` com status `AUDITADA`.

Este selo é a referência nova para Filosofia auditada. Os selos antigos `VERIFICADA` e `revisada` não devem ser usados como garantia editorial.

## Comandos de validação

```powershell
node scripts\audit-question-bank-text.mjs --materia filosofia
node scripts\audit-question-integrity.mjs --materia filosofia
Get-ChildItem questions\banks\1-serie\filosofia,questions\banks\2-serie\filosofia,questions\banks\3-serie\filosofia -Recurse -Filter index.js | ForEach-Object { node --check $_.FullName }
```
