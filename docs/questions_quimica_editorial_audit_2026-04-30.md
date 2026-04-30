# Auditoria editorial de Química - 2026-04-30

## Escopo

- Matéria: Química.
- Séries: 1ª, 2ª e 3ª séries.
- Arquivos analisados: 15.
- Questões analisadas: 1.800.

## Critérios aplicados

- Acentuação e ortografia exibíveis em enunciados, opções, respostas, comentários, tópicos e metadados textuais.
- Remoção de suspeitas de mojibake e caracteres quebrados.
- Termos químicos, unidades, fórmulas, cargas e notações exibíveis.
- Alternativa correta presente nas opções.
- Alternativas duplicadas.
- Campos obrigatórios, placeholders e texto bruto.
- Sintaxe dos módulos `index.js`.

## Resultado

- Suspeitas textuais: 0.
- Problemas de integridade: 0.

Relatórios gerados:

- `.codex-artifacts/editorial-audit/todas-series__quimica.md`
- `.codex-artifacts/editorial-audit/integrity__todas-series__quimica.md`

## Correções relevantes

- Corrigidos termos recorrentes como química, função, funções, reação, características, número, formação, relação, equilíbrio, frequência, avaliação, técnica, física, educação e termos relacionados.
- A limpeza concentrou-se em Funções Inorgânicas, Tabela Periódica, Reações Químicas, Estequiometria, Soluções, Termoquímica, Química Orgânica, Funções Orgânicas e Polímeros.
- A auditoria de integridade já estava zerada antes das correções textuais.

## Marca persistente

Os índices de Química das três séries aplicam `withChemistryEditorialAudit`, que adiciona `metadados.auditoriaEditorial` com status `AUDITADA`.

Este selo é a referência nova para Química auditada. Os selos antigos `VERIFICADA` e `revisada` não devem ser usados como garantia editorial.

## Comandos de validação

```powershell
node scripts\audit-question-bank-text.mjs --materia quimica
node scripts\audit-question-integrity.mjs --materia quimica
Get-ChildItem questions\banks\1-serie\quimica,questions\banks\2-serie\quimica,questions\banks\3-serie\quimica -Recurse -Filter index.js | ForEach-Object { node --check $_.FullName }
```
