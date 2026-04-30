# Auditoria editorial de Artes - 2026-04-30

## Escopo

- Matéria: Artes.
- Séries: 1ª, 2ª e 3ª séries.
- Arquivos analisados: 8.
- Questões analisadas: 500.

## Critérios aplicados

- Acentuação e ortografia exibíveis em enunciados, opções, respostas, comentários, tópicos e metadados textuais.
- Remoção de suspeitas de mojibake e caracteres quebrados.
- Termos artísticos, movimentos, obras, técnicas e conceitos exibíveis.
- Alternativa correta presente nas opções.
- Alternativas duplicadas.
- Campos obrigatórios, placeholders e texto bruto.
- Sintaxe dos módulos `index.js`.

## Resultado

- Suspeitas textuais: 0.
- Problemas de integridade: 0.

Relatórios gerados:

- `.codex-artifacts/editorial-audit/todas-series__artes.md`
- `.codex-artifacts/editorial-audit/integrity__todas-series__artes.md`

## Correções relevantes

- Corrigidos termos recorrentes como produção, técnica, técnicas, interpretação, relação, equilíbrio, composição, história, artística, reflexão, ação, espaço, público e termos relacionados.
- A limpeza concentrou-se em Elementos Visuais, História da Arte Clássica, Arte Moderna, Movimentos Artísticos e Arte Contemporânea.
- A auditoria de integridade já estava zerada antes das correções textuais.

## Marca persistente

Os índices de Artes das três séries aplicam `withArtsEditorialAudit`, que adiciona `metadados.auditoriaEditorial` com status `AUDITADA`.

Este selo é a referência nova para Artes auditada. Os selos antigos `VERIFICADA` e `revisada` não devem ser usados como garantia editorial.

## Comandos de validação

```powershell
node scripts\audit-question-bank-text.mjs --materia artes
node scripts\audit-question-integrity.mjs --materia artes
Get-ChildItem questions\banks\1-serie\artes,questions\banks\2-serie\artes,questions\banks\3-serie\artes -Recurse -Filter index.js | ForEach-Object { node --check $_.FullName }
```
