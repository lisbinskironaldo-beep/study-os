# Auditoria editorial de Física - 2026-04-30

## Escopo

- Matéria: Física.
- Séries: 1ª, 2ª e 3ª séries.
- Arquivos analisados: 14.
- Questões analisadas: 1.650.

## Critérios aplicados

- Acentuação e ortografia exibíveis em enunciados, opções, respostas, comentários, tópicos e metadados textuais.
- Remoção de suspeitas de mojibake e caracteres quebrados.
- Termos técnicos e unidades exibíveis.
- Alternativa correta presente nas opções.
- Alternativas duplicadas.
- Campos obrigatórios, placeholders e texto bruto.
- Sintaxe dos módulos `index.js`.

## Resultado

- Suspeitas textuais: 0.
- Problemas de integridade: 0.

Relatórios gerados:

- `.codex-artifacts/editorial-audit/todas-series__fisica.md`
- `.codex-artifacts/editorial-audit/integrity__todas-series__fisica.md`

## Correções relevantes

- Corrigida acentuação recorrente em textos exibidos de Óptica, Ondulatória, Eletrodinâmica e Magnetismo.
- Padronizados termos como física, interpretação, formação, relação, gráficos, hábitos, ação, possível, laboratório, distância, oscilações, propagação e visíveis.
- Padronizado `NAO` para `NÃO` em enunciados de alternativa incompatível.
- A auditoria de integridade já estava zerada antes das correções textuais.

## Marca persistente

Os índices de Física das três séries aplicam `withPhysicsEditorialAudit`, que adiciona `metadados.auditoriaEditorial` com status `AUDITADA`.

Este selo é a referência nova para Física auditada. Os selos antigos `VERIFICADA` e `revisada` não devem ser usados como garantia editorial.

## Comandos de validação

```powershell
node scripts\audit-question-bank-text.mjs --materia fisica
node scripts\audit-question-integrity.mjs --materia fisica
Get-ChildItem questions\banks\1-serie\fisica,questions\banks\2-serie\fisica,questions\banks\3-serie\fisica -Recurse -Filter index.js | ForEach-Object { node --check $_.FullName }
```
