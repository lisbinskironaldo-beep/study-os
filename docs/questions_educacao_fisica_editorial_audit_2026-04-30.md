# Auditoria editorial de Educação Física - 2026-04-30

## Escopo

- Matéria: Educação Física.
- Séries: 1ª, 2ª e 3ª séries.
- Arquivos analisados: 8.
- Questões analisadas: 500.

## Critérios aplicados

- Acentuação e ortografia exibíveis em enunciados, opções, respostas, comentários, tópicos e metadados textuais.
- Remoção de suspeitas de mojibake e caracteres quebrados.
- Termos corporais, esportivos, saúde e qualidade de vida exibíveis.
- Alternativa correta presente nas opções.
- Alternativas duplicadas.
- Campos obrigatórios, placeholders e texto bruto.
- Sintaxe dos módulos `index.js`.

## Resultado

- Suspeitas textuais: 0.
- Problemas de integridade: 0.

Relatórios gerados:

- `.codex-artifacts/editorial-audit/todas-series__educacao-fisica.md`
- `.codex-artifacts/editorial-audit/integrity__todas-series__educacao-fisica.md`

## Correções relevantes

- Corrigidos termos recorrentes como Educação Física, saúde, técnica, tática, decisão, relação, equilíbrio, prática, reposição, hábito, alimentação, atividade física e termos relacionados.
- A limpeza concentrou-se em Cultura Corporal, Esportes Básicos, Esportes Coletivos, Saúde e Corpo e Qualidade de Vida.
- A auditoria de integridade já estava zerada antes das correções textuais.

## Marca persistente

Os índices de Educação Física das três séries aplicam `withPhysicalEducationEditorialAudit`, que adiciona `metadados.auditoriaEditorial` com status `AUDITADA`.

Este selo é a referência nova para Educação Física auditada. Os selos antigos `VERIFICADA` e `revisada` não devem ser usados como garantia editorial.

## Comandos de validação

```powershell
node scripts\audit-question-bank-text.mjs --materia educacao-fisica
node scripts\audit-question-integrity.mjs --materia educacao-fisica
Get-ChildItem questions\banks\1-serie\educacao-fisica,questions\banks\2-serie\educacao-fisica,questions\banks\3-serie\educacao-fisica -Recurse -Filter index.js | ForEach-Object { node --check $_.FullName }
```
