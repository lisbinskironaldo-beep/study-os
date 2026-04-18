# ROTANOTA - LOG DE ESTABILIZACAO E DIRETRIZ DE REVISAO

Registro interno da rodada de trabalho consolidada em 2026-03-31.

## Objetivo desta rodada

Registrar o que ja foi estabilizado no modulo de questoes, deixar um ponto local de restauracao e separar com clareza o que foi ajuste de interface do que ainda depende de revisao editorial do banco legado.

## O que ja foi feito

- O modulo de questoes foi reestabilizado depois de uma tentativa ampla de correcao textual que acabou afetando arquivos de aplicacao e catalogo.
- Os arquivos centrais de aplicacao e catalogo que ficaram em risco foram restaurados para um estado seguro antes de novas correcoes.
- Os ajustes visuais recentes do fluxo de treino inteligente foram preservados em `questions/questions.css`.
- As strings visiveis mais importantes da interface foram corrigidas com cuidado, sem alterar identificadores, chaves de dados, rotas ou nomes de funcoes.
- Mensagens do launcher, da retomada de sessao, do calendario e do quadro de estudos receberam revisao textual pontual.

## Arquivos com alteracoes intencionais nesta etapa

- `index.html`
- `js/alarm.js`
- `js/calendar.js`
- `js/qts.js`
- `questions/app/application/launcherSelectors.mjs`
- `questions/app/application/legacyRecoveryFallback.mjs`
- `questions/app/application/sessionUseCases.mjs`
- `questions/questions.css`
- `questions/questions.ui.js`

## O que esta fora do escopo desta rodada

- As questoes legadas ja existentes no banco escolar ainda nao passaram por revisao gramatical e ortografica final.
- O inventario atual do catalogo deve ser tratado como fotografia operacional do banco, nao como selo de revisao editorial.
- A presenca de um assunto no catalogo nao significa que o texto das perguntas, alternativas e explicacoes daquele assunto ja foi revisado linguisticamente.

## Regra editorial daqui para frente

- Todo conteudo novo que entrar no banco deve chegar com revisao de ortografia, acentuacao, pontuacao e clareza textual.
- O legado atual permanece marcado como `pendente de revisao gramatical`.
- Quando um assunto legado for revisado, essa mudanca deve ser registrada em documentacao propria ou em checklist editorial.

## Ponto de restauracao

Foi criado um pacote local de restauracao em:

`.codex-backups/restore-points/2026-03-31-questions-stabilization`

Esse pacote guarda:

- uma copia dos arquivos alterados nesta rodada
- um manifesto com a lista dos arquivos incluidos
- um snapshot do `git status`
- um script `restore.ps1` para recolocar esses arquivos no projeto

## Como usar o ponto de restauracao

No PowerShell, a partir da raiz do projeto:

```powershell
powershell -ExecutionPolicy Bypass -File .codex-backups/restore-points/2026-03-31-questions-stabilization/restore.ps1
```

Esse script restaura apenas os arquivos incluidos no pacote dessa rodada.

## Observacao final

O inventario do banco existente foi separado em documento proprio para facilitar o acompanhamento por serie, materia e assunto sem misturar isso com a estabilizacao tecnica do modulo.
