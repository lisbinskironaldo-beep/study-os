# Auditoria editorial de Sociologia - 2026-04-30

## Escopo

- Matéria: Sociologia.
- Séries: 1ª, 2ª e 3ª séries.
- Arquivos analisados: 12.
- Questões analisadas: 1.350.

## Critérios aplicados

- Acentuação e ortografia exibíveis em enunciados, opções, respostas, comentários, tópicos e metadados textuais.
- Remoção de suspeitas de mojibake e caracteres quebrados.
- Termos sociológicos, conceitos sociais e políticos exibíveis.
- Alternativa correta presente nas opções.
- Alternativas duplicadas.
- Campos obrigatórios, placeholders e texto bruto.
- Sintaxe dos módulos `index.js`.

## Resultado

- Suspeitas textuais: 0.
- Problemas de integridade: 0.

Relatórios gerados:

- `.codex-artifacts/editorial-audit/todas-series__sociologia.md`
- `.codex-artifacts/editorial-audit/integrity__todas-series__sociologia.md`

## Correções relevantes

- Corrigidos termos recorrentes como ação, ações, situação, organização, relação, relações, produção, função, funções, política, decisão, decisões, formação, gênero, identidade, cidadania, representação, mediação, participação e termos relacionados.
- A limpeza concentrou-se em Cultura e Sociedade, Socialização, Identidade, Estrutura Social, Classes Sociais, Trabalho, Cidadania, Movimentos Sociais e Política.
- A auditoria de integridade já estava zerada antes das correções textuais.
- O auditor textual foi ajustado para não tratar `mediação` como ocorrência de `media` sem acento.

## Marca persistente

Os índices de Sociologia das três séries aplicam `withSociologyEditorialAudit`, que adiciona `metadados.auditoriaEditorial` com status `AUDITADA`.

Este selo é a referência nova para Sociologia auditada. Os selos antigos `VERIFICADA` e `revisada` não devem ser usados como garantia editorial.

## Comandos de validação

```powershell
node scripts\audit-question-bank-text.mjs --materia sociologia
node scripts\audit-question-integrity.mjs --materia sociologia
Get-ChildItem questions\banks\1-serie\sociologia,questions\banks\2-serie\sociologia,questions\banks\3-serie\sociologia -Recurse -Filter index.js | ForEach-Object { node --check $_.FullName }
```
