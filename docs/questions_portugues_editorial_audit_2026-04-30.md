# Auditoria editorial de Português - 2026-04-30

## Escopo

Auditoria concluída para a matéria `Português` nas três séries:

- `questions/banks/1-serie/portugues`
- `questions/banks/2-serie/portugues`
- `questions/banks/3-serie/portugues`

Total auditado:

- 19 arquivos de tópico
- 3.200 questões

## Critérios aplicados

- Acentuação e ortografia em textos exibidos ao aluno.
- Mojibake e caracteres quebrados.
- Alternativa correta presente nas opções.
- Alternativas duplicadas.
- Campos vazios, placeholders e texto bruto.
- Sintaxe dos módulos `index.js`.

## Resultado final

Relatórios finais gerados:

- `.codex-artifacts/editorial-audit/todas-series__portugues.md`
- `.codex-artifacts/editorial-audit/integrity__todas-series__portugues.md`

Resultado dos relatórios:

- Auditoria textual: 0 suspeitas.
- Auditoria de integridade: 0 problemas.
- `node --check` nos arquivos de Português: sem erros.

## Aviso no banco

Foi adicionado um metadado novo de auditoria editorial em:

- `questions/banks/_shared/editorialAuditMetadata.js`

Os exports da matéria nas três séries agora aplicam:

- `withPortugueseEditorialAudit(...)`

Arquivos que carregam o aviso:

- `questions/banks/1-serie/portugues/index.js`
- `questions/banks/2-serie/portugues/index.js`
- `questions/banks/3-serie/portugues/index.js`

O novo selo é:

```js
auditoriaEditorial: {
  status: "AUDITADA",
  auditadoEm: "2026-04-30",
  escopo: "Português - 1ª, 2ª e 3ª séries"
}
```

Este selo substitui o uso de `seloEditorial: "VERIFICADA"` e `status: "revisada"` como garantia editorial para Português.

## Scripts usados

- `scripts/audit-question-bank-text.mjs`
- `scripts/audit-question-integrity.mjs`
- `scripts/fix-portugues-editorial-text.mjs`
- `scripts/fix-ortografia-options.mjs`

Comandos principais:

```bash
node scripts/audit-question-bank-text.mjs --materia portugues
node scripts/audit-question-integrity.mjs --materia portugues
```

Validação sintática:

```powershell
Get-ChildItem -Path questions\banks\1-serie\portugues,questions\banks\2-serie\portugues,questions\banks\3-serie\portugues -Recurse -Filter index.js | ForEach-Object { node --check $_.FullName }
```

## Observação importante

A auditoria feita é objetiva e automatizável, com correções assistidas. Ela cobre problemas visíveis de texto e integridade básica das questões. Uma revisão pedagógica humana mais fina ainda pode melhorar enunciados, distratores e qualidade didática, mas Português agora não deve voltar para a fila de limpeza de acentuação, mojibake ou integridade estrutural.
