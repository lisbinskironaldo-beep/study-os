# Auditoria editorial de Inglês - 2026-04-30

## Escopo

- Matéria: Inglês.
- Séries: 1ª, 2ª e 3ª séries.
- Arquivos analisados: 12.
- Questões analisadas: 1.800.

## Critérios aplicados

- Acentuação e ortografia exibíveis no português de apoio em enunciados, opções, respostas, comentários, tópicos e metadados.
- Preservação de termos legítimos em inglês, como `media` em `Technology and media`.
- Remoção de suspeitas de mojibake e caracteres quebrados.
- Alternativa correta presente nas opções.
- Alternativas duplicadas.
- Campos obrigatórios, placeholders e texto bruto.
- Sintaxe dos módulos `index.js`.

## Resultado

- Suspeitas textuais: 0.
- Problemas de integridade: 0.

Relatórios gerados:

- `.codex-artifacts/editorial-audit/todas-series__ingles.md`
- `.codex-artifacts/editorial-audit/integrity__todas-series__ingles.md`

## Correções relevantes

- Corrigido o português exibido em tópicos e comentários: Inglês, interpretação, vocabulário, comunicação, compreensão, informações, saudações, apresentações, situação, ação, função, avaliação, afirmação, conclusão e termos relacionados.
- Padronizado `NAO` para `NÃO` nos enunciados de alternativa incompatível/incorreta.
- Ajustada a auditoria para não tratar `media`, quando usado como palavra inglesa, como erro de acentuação.
- A auditoria de integridade já estava zerada antes das correções textuais.

## Marca persistente

Os índices de Inglês das três séries aplicam `withEnglishEditorialAudit`, que adiciona `metadados.auditoriaEditorial` com status `AUDITADA`.

Este selo é a referência nova para Inglês auditado. Os selos antigos `VERIFICADA` e `revisada` não devem ser usados como garantia editorial.

## Comandos de validação

```powershell
node scripts\audit-question-bank-text.mjs --materia ingles
node scripts\audit-question-integrity.mjs --materia ingles
Get-ChildItem questions\banks\1-serie\ingles,questions\banks\2-serie\ingles,questions\banks\3-serie\ingles -Recurse -Filter index.js | ForEach-Object { node --check $_.FullName }
```
