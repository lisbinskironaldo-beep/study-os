# Auditoria editorial de Biologia - 2026-04-30

## Escopo

- Matéria: Biologia.
- Séries: 1ª, 2ª e 3ª séries.
- Arquivos analisados: 16.
- Questões analisadas: 2.600.

## Critérios aplicados

- Acentuação e ortografia exibíveis em enunciados, opções, respostas, comentários, tópicos e metadados textuais.
- Remoção de suspeitas de mojibake e caracteres quebrados.
- Termos biológicos e científicos exibíveis.
- Alternativa correta presente nas opções.
- Alternativas duplicadas.
- Campos obrigatórios, placeholders e texto bruto.
- Sintaxe dos módulos `index.js`.

## Resultado

- Suspeitas textuais: 0.
- Problemas de integridade: 0.

Relatórios gerados:

- `.codex-artifacts/editorial-audit/todas-series__biologia.md`
- `.codex-artifacts/editorial-audit/integrity__todas-series__biologia.md`

## Correções relevantes

- Corrigidos termos recorrentes como química, célula, produção, interpretação, formação, relação, equilíbrio, função, características, técnicas, laboratório, observação, frequência, variação e termos relacionados.
- A limpeza concentrou-se em Origem da Vida, Metabolismo Celular, Biotecnologia, Evolução, Ecologia e Impactos Ambientais.
- A auditoria de integridade já estava zerada antes das correções textuais.

## Marca persistente

Os índices de Biologia das três séries aplicam `withBiologyEditorialAudit`, que adiciona `metadados.auditoriaEditorial` com status `AUDITADA`.

Este selo é a referência nova para Biologia auditada. Os selos antigos `VERIFICADA` e `revisada` não devem ser usados como garantia editorial.

## Comandos de validação

```powershell
node scripts\audit-question-bank-text.mjs --materia biologia
node scripts\audit-question-integrity.mjs --materia biologia
Get-ChildItem questions\banks\1-serie\biologia,questions\banks\2-serie\biologia,questions\banks\3-serie\biologia -Recurse -Filter index.js | ForEach-Object { node --check $_.FullName }
```
