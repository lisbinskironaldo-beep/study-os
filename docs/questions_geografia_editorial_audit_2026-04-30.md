# Auditoria editorial de Geografia - 2026-04-30

## Escopo

- Matéria: Geografia.
- Séries: 1ª, 2ª e 3ª séries.
- Arquivos analisados: 15.
- Questões analisadas: 2.400.

## Critérios aplicados

- Acentuação e ortografia exibíveis em enunciados, opções, respostas, comentários, tópicos e metadados textuais.
- Remoção de suspeitas de mojibake e caracteres quebrados.
- Termos geográficos, mapas, escalas, indicadores, unidades e conceitos exibíveis.
- Alternativa correta presente nas opções.
- Alternativas duplicadas.
- Campos obrigatórios, placeholders e texto bruto.
- Sintaxe dos módulos `index.js`.

## Resultado

- Suspeitas textuais: 0.
- Problemas de integridade: 0.

Relatórios gerados:

- `.codex-artifacts/editorial-audit/todas-series__geografia.md`
- `.codex-artifacts/editorial-audit/integrity__todas-series__geografia.md`

## Correções relevantes

- Corrigidos termos recorrentes como interpretação, situação, representação, espaço, distância, relação, escala, população, região, produção, transformação, geográfico, cartográfico, superfície, tectônicas, econômico, globalização e termos relacionados.
- A limpeza concentrou-se em Cartografia, Clima e Relevo, População, Estrutura da Terra, Economia Mundial, Globalização, Industrialização, Urbanização, Brasil Atual, Energia, Geopolítica e Meio Ambiente.
- A auditoria de integridade já estava zerada antes das correções textuais.
- Foram revisadas manualmente frases em que a correção automática poderia trocar a conjunção `e` pelo verbo `é`.

## Marca persistente

Os índices de Geografia das três séries aplicam `withGeographyEditorialAudit`, que adiciona `metadados.auditoriaEditorial` com status `AUDITADA`.

Este selo é a referência nova para Geografia auditada. Os selos antigos `VERIFICADA` e `revisada` não devem ser usados como garantia editorial.

## Comandos de validação

```powershell
node scripts\audit-question-bank-text.mjs --materia geografia
node scripts\audit-question-integrity.mjs --materia geografia
Get-ChildItem questions\banks\1-serie\geografia,questions\banks\2-serie\geografia,questions\banks\3-serie\geografia -Recurse -Filter index.js | ForEach-Object { node --check $_.FullName }
```
