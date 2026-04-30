# Auditoria editorial de História - 2026-04-30

## Escopo

- Matéria: História.
- Séries: 1ª, 2ª e 3ª séries.
- Arquivos analisados: 13.
- Questões analisadas: 2.000.

## Critérios aplicados

- Acentuação e ortografia exibíveis em enunciados, opções, respostas, comentários, tópicos e metadados textuais.
- Remoção de suspeitas de mojibake e caracteres quebrados.
- Termos históricos, períodos, processos e conceitos exibíveis.
- Alternativa correta presente nas opções.
- Alternativas duplicadas.
- Campos obrigatórios, placeholders e texto bruto.
- Sintaxe dos módulos `index.js`.

## Resultado

- Suspeitas textuais: 0.
- Problemas de integridade: 0.

Relatórios gerados:

- `.codex-artifacts/editorial-audit/todas-series__historia.md`
- `.codex-artifacts/editorial-audit/integrity__todas-series__historia.md`

## Correções relevantes

- Corrigidos termos recorrentes como história, formação, relação, relações, produção, Idade Média, política, período, revolução, expansão, português, inglês, técnicas, avaliação e termos relacionados.
- A limpeza concentrou-se em Feudalismo, Formação dos Estados Modernos, Expansão Marítima, Independência do Brasil, Antiguidade, Revoluções Industrial e Francesa, República no Brasil, Ditadura Militar, História Contemporânea e Período Imperial.
- A auditoria de integridade já estava zerada antes das correções textuais.

## Marca persistente

Os índices de História das três séries aplicam `withHistoryEditorialAudit`, que adiciona `metadados.auditoriaEditorial` com status `AUDITADA`.

Este selo é a referência nova para História auditada. Os selos antigos `VERIFICADA` e `revisada` não devem ser usados como garantia editorial.

## Comandos de validação

```powershell
node scripts\audit-question-bank-text.mjs --materia historia
node scripts\audit-question-integrity.mjs --materia historia
Get-ChildItem questions\banks\1-serie\historia,questions\banks\2-serie\historia,questions\banks\3-serie\historia -Recurse -Filter index.js | ForEach-Object { node --check $_.FullName }
```
