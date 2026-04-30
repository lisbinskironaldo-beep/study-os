# Auditoria editorial de Matemática - 2026-04-30

## Escopo

- Matéria: Matemática.
- Séries: 1ª, 2ª e 3ª séries.
- Arquivos analisados: 20.
- Questões analisadas: 3.410.

## Critérios aplicados

- Acentuação e ortografia exibíveis em enunciados, opções, respostas, comentários, tópicos e metadados textuais.
- Remoção de suspeitas de mojibake e caracteres quebrados.
- Alternativa correta presente nas opções.
- Alternativas duplicadas.
- Comentários mínimos para não exibir apenas conta solta.
- Campos obrigatórios, placeholders e texto bruto.
- Sintaxe dos módulos `index.js`.

## Resultado

- Suspeitas textuais: 0.
- Problemas de integridade: 0.

Relatórios gerados:

- `.codex-artifacts/editorial-audit/todas-series__matematica.md`
- `.codex-artifacts/editorial-audit/integrity__todas-series__matematica.md`

## Correções relevantes

- Corrigida acentuação recorrente em vocabulário matemático e escolar: função, funções, interpretação, análise, relação, triângulo, ângulo, número, gráfico, média, possível, lançamento, reposição e termos relacionados.
- Corrigida a questão `prob_169` de Probabilidade: a resposta correta era incompatível com as opções. A probabilidade correta é `47/66`.
- Expandidos comentários curtos em Probabilidade que exibiam apenas expressões como `1/2 x 1/2` ou `(1/2)^3`.
- O auditor de integridade agora valida a matéria selecionada por `--materia`, em vez de assumir apenas Português.

## Marca persistente

Os índices de Matemática das três séries aplicam `withMathematicsEditorialAudit`, que adiciona `metadados.auditoriaEditorial` com status `AUDITADA`.

Este selo é a referência nova para Matemática auditada. Os selos antigos `VERIFICADA` e `revisada` não devem ser usados como garantia editorial.

## Comandos de validação

```powershell
node scripts\audit-question-bank-text.mjs --materia matematica
node scripts\audit-question-integrity.mjs --materia matematica
Get-ChildItem questions\banks\1-serie\matematica,questions\banks\2-serie\matematica,questions\banks\3-serie\matematica -Recurse -Filter index.js | ForEach-Object { node --check $_.FullName }
```
