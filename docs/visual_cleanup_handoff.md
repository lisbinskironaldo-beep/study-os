# Plano de retomada - limpeza visual e produto

Data de referencia: 2026-04-27

Este documento existe para retomar o trabalho sem depender do contexto do chat.
Ele deve ser lido antes de qualquer nova limpeza visual, refatoracao da home,
mudanca no PDF Focado ou separacao do Ops/NorthStar.

## Estado atual observado

- A home publica ja foi trocada para uma entrada de estudo mais direta:
  Material, Praticar, Progresso e Foco.
- O PDF Focado foi mantido como fluxo principal de material.
- O limite gratis foi ajustado para 8 paginas, conforme decisao de produto.
- O premium recebeu melhorias de experiencia e deve continuar se comportando
  como uma experiencia superior, nao como gratis ampliado.
- Os botoes dos blocos/modos foram reposicionados para a parte inferior das
  telas fora da home, deixando as laterais mais livres.
- O player de som foi separado antes por risco de quebrar o site, mas ainda
  deixa rastros visuais/de acessibilidade.
- A tabela semanal ainda e um modulo legado/frankenstein e deve ser tratada com
  cuidado, sem remocao brusca.
- O Ops ainda esta dentro do mesmo projeto e rota `/ops`, mas a direcao de
  produto e separar a gestao para NorthStar.
- A marca publica ainda aparece como RotaNota em varios pontos. A futura marca
  esta em decisao entre Papiro Edu, Papiro Labs ou Papiro Tools.

## Estado do repo antes desta nota

- `git status --short` mostrou apenas:
  - `.codex-artifacts/dev-server/vercel-dev.err.log`
- Nenhuma alteracao de codigo de produto apareceu pendente no status local.
- Esse log de dev server pode ser ignorado em uma limpeza de produto, salvo se
  for investigar Vercel dev local.

## Regra de seguranca

Antes de mexer em qualquer UI ou fluxo:

```powershell
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$dir = "restore-points\$stamp-before-visual-cleanup"
New-Item -ItemType Directory -Path $dir -Force | Out-Null
Copy-Item -LiteralPath index.html -Destination $dir
Copy-Item -LiteralPath js -Destination $dir -Recurse
Copy-Item -LiteralPath css -Destination $dir -Recurse
Copy-Item -LiteralPath ambient -Destination $dir -Recurse
Copy-Item -LiteralPath premium-study -Destination $dir -Recurse
Copy-Item -LiteralPath questions -Destination $dir -Recurse
Copy-Item -LiteralPath docs -Destination $dir -Recurse
git rev-parse HEAD | Set-Content -LiteralPath (Join-Path $dir 'git-head.txt')
git status --short | Set-Content -LiteralPath (Join-Path $dir 'git-status.txt')
```

Depois de cada etapa que funcionar, criar novo checkpoint menor:

```powershell
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$dir = "restore-points\$stamp-after-step-name"
New-Item -ItemType Directory -Path $dir -Force | Out-Null
Copy-Item -LiteralPath index.html -Destination $dir
Copy-Item -LiteralPath js -Destination $dir -Recurse
Copy-Item -LiteralPath css -Destination $dir -Recurse
Copy-Item -LiteralPath premium-study -Destination $dir -Recurse
git diff > (Join-Path $dir 'working.diff')
```

## O que nao pode ser desfeito

- Nao voltar o gratis para 12 paginas sem decisao explicita.
- Nao recolocar os botoes dos blocos nas laterais se a nova direcao for base
  inferior.
- Nao tratar premium como apenas "mais paginas"; premium precisa parecer mais
  robusto em material, organizacao, esquemas, revisao, prova e continuidade.
- Nao apagar o player/tabela de uma vez. Primeiro isolar, esconder, rotular e
  validar.
- Nao misturar Ops/NorthStar dentro da experiencia do aluno quando mexer em
  marca ou navegacao.

## Prioridade de execucao

### 1. Validar fluxo atual antes de limpar

Usar `agent-browser`:

```powershell
agent-browser open http://localhost:3000
agent-browser wait --load networkidle
agent-browser snapshot -i
agent-browser errors
agent-browser screenshot .codex-artifacts\visual-cleanup-before.png --full
```

Checar:

- Home abre sem erro.
- Material abre PDF Focado.
- Praticar abre o modulo de questoes.
- Progresso abre estatisticas ou gate de login correto.
- Foco abre Pomodoro.
- Ferramentas secundarias funcionam.
- Mobile 390px nao tem overflow horizontal.

### 2. Acessibilidade e residuos invisiveis

Problema observado:

- Player/ambient e side nav aparecem cedo no snapshot do browser mesmo quando
  invisiveis por `opacity: 0` e `pointer-events: none`.
- Alguns botoes laterais aparecem como `button` sem nome acessivel.

Meta:

- Elemento invisivel para usuario tambem deve sair da arvore acessivel quando
  nao esta ativo.
- Botoes movidos para `sideModules` precisam receber `aria-label`, `title` e
  texto acessivel.
- Player fechado deve aparecer como um unico botao claro, nao como biblioteca
  inteira no snapshot.

Arquivos provaveis:

- `ambient/ambientUI.js`
- `ambient/ambientPlayer.js`
- `css/premium.css`
- `js/app.js`
- `index.html`

Validacao:

```powershell
agent-browser snapshot -i
agent-browser errors
```

O snapshot nao deve listar a biblioteca inteira do player quando fechada.

### 3. Mobile da home

Problema observado:

- Em viewport 390px, a hero ocupa muito espaco antes dos cards principais.
- O primeiro card pode ficar baixo demais, deixando a acao principal menos
  imediata.

Meta:

- A primeira dobra mobile deve mostrar titulo + pelo menos parte do card
  Material.
- Reduzir altura da caixa "Agora" no mobile.
- Manter cards legiveis sem texto esmagado.

Arquivos provaveis:

- `css/premium.css`
- `index.html`

Validacao:

```powershell
agent-browser set viewport 390 844
agent-browser reload
agent-browser wait --load networkidle
agent-browser eval "JSON.stringify({scrollW:document.documentElement.scrollWidth, vw:innerWidth, firstCard:document.querySelector('.home-command-card')?.getBoundingClientRect().toJSON()})"
agent-browser screenshot .codex-artifacts\visual-cleanup-mobile.png --full
```

Aceite:

- `scrollW <= vw`
- primeiro card comecando idealmente antes de `y=560` no mobile.

### 4. Limpeza de CSS legado sem quebrar modulos

Nao apagar em massa. Primeiro classificar:

- usado pela home nova
- usado por PDF Focado
- usado por Questoes
- usado por Pomodoro
- usado por Tabela
- legado morto

Alvos suspeitos:

- `home-launchpad-main`
- `home-launchpad-tools`
- `launchpad-primary-grid`
- `launchpad-card`
- `rotanota-home-band`
- estilos duplicados de `side-modules`

Procedimento seguro:

1. Usar `rg` para cada seletor.
2. Confirmar se ainda existe no DOM.
3. Comentar/remover apenas blocos mortos.
4. Validar home, PDF, questoes, pomodoro e tabela.

Nao remover estilos da tabela sem abrir a tabela e testar.

### 5. PDF Focado: gratis 8 paginas e premium

Objetivo:

- Gratis: ate 8 paginas, com experiencia honesta e util.
- Premium: material robusto, blocos proporcionais ao documento, esquemas,
  comparativos, mnemonicos, checklist, casos e provas melhores.

Checklist:

- Upload gratis acima de 8 paginas mostra bloqueio/upgrade claro.
- Upload gratis com ate 8 paginas gera pelo menos uma experiencia utilizavel.
- Premium com documento grande nao reduz para apontamentos rasos.
- Premium com documento pequeno ou escaneado tenta extracao/OCR e informa
  progresso sem parecer travado.
- Mesmo material deve reaproveitar cache quando possivel.

Arquivos provaveis:

- `premium-study/services/access-control.js`
- `premium-study/services/pdf-validator.js`
- `premium-study/services/ai.js`
- `premium-study/app/index.js`
- `premium-study/ui/views/index.js`
- `api/_lib/handlers/premium/ai-generate.js`
- `api/_lib/handlers/premium/pdf-extract.js`

Validacao minima:

- PDF pequeno textual.
- PDF pequeno escaneado/imagem.
- PDF grande premium.
- Mesmo PDF enviado duas vezes.
- Aprender, Praticar e Prova abrindo sem bloquear indevidamente.

### 6. Botoes inferiores dos modos

Direcao atual:

- Fora da home, os botoes dos blocos/modos ficam embaixo.
- Laterais ficam livres para leitura.

O que validar:

- Desktop: botoes nao cobrem conteudo.
- Mobile: botoes nao ficam pequenos demais nem embolados.
- Fullscreen/leitor: ao clicar "Explicar melhor", a tela deve mover para a
  explicacao correta.
- A barra inferior nao deve competir com o player.

Arquivos provaveis:

- `premium-study/styles/premium-study.css`
- `premium-study/ui/views/index.js`
- `premium-study/app/index.js`

### 7. Tabela semanal

Direcao:

- Manter funcionando, mas tirar protagonismo da home.
- Nao refatorar junto com PDF ou player.

Melhoria futura:

- Transformar em "Planejamento semanal" com linguagem menos tecnica.
- Reduzir controles laterais e excesso visual.
- Criar tela propria, nao dependente do velho relogio.

So mexer nela depois que home + player + PDF estiverem estaveis.

### 8. Ops/NorthStar separado do produto publico

Direcao:

- Produto aluno: futuro Papiro.
- Admin/Ops: NorthStar.
- `/ops` nao deve aparecer como parte da experiencia do aluno.

Etapas:

1. Criar camada de config de marca, sem renomear tudo de uma vez.
2. Separar nomes publicos de nomes internos.
3. Preparar futura extracao do `/ops` para projeto/subdominio separado.
4. Manter APIs existentes funcionando ate a migracao.

Arquivos provaveis:

- `README.md`
- `vercel.json`
- `ops/*`
- `api/ops-router.js`
- `api/northstar-router.js`
- `api/_lib/ops-*`
- `api/_lib/handlers/northstar/*`

### 9. Marca futura

Recomendacao atual:

- Produto principal: Papiro Edu.
- Guarda-chuva/estudio: Papiro Labs.
- Ferramentas internas ou suite: Papiro Tools.

Nao renomear agora se a decisao ainda nao fechou.
Preparar apenas uma camada de marca:

```js
const Brand = {
  publicProduct: "RotaNota",
  futureProductCandidate: "Papiro Edu",
  opsProduct: "NorthStar Ops"
};
```

Depois trocar textos por config.

## Testes de regressao obrigatorios

Rodar antes de dizer que esta pronto:

```powershell
agent-browser open http://localhost:3000
agent-browser wait --load networkidle
agent-browser snapshot -i
agent-browser errors

agent-browser find text "Transformar PDF em estudo" click
agent-browser wait --load networkidle
agent-browser errors

agent-browser open http://localhost:3000
agent-browser find text "Responder questoes" click
agent-browser wait --load networkidle
agent-browser errors

agent-browser open http://localhost:3000
agent-browser set viewport 390 844
agent-browser wait --load networkidle
agent-browser screenshot .codex-artifacts\mobile-final.png --full
```

Tambem verificar manualmente:

- home desktop
- home mobile
- PDF Focado entrada
- carregamento de PDF
- Aprender
- Praticar
- Prova
- Tabela semanal
- Pomodoro
- Player fechado e aberto
- Estatisticas/progresso

## Criterios de pronto

- Sem erro de console.
- Sem overflow horizontal em 390px.
- Snapshot interativo sem biblioteca inteira do player quando player fechado.
- Botoes laterais sem nome acessivel corrigidos ou removidos da arvore.
- Home com prioridade clara: Material, Praticar, Progresso, Foco.
- Gratis limitado a 8 paginas.
- Premium claramente superior ao gratis.
- Botoes inferiores dos modos nao cobrem conteudo.
- Tabela ainda abre e funciona.
- Ops/NorthStar nao ganha mais destaque no produto publico.

## Inteligencia necessaria por tipo de tarefa

Nao precisa usar modelo maximo para tudo.

Use inteligencia alta/maxima quando:

- fizer auditoria ampla do produto
- redesenhar arquitetura da home ou do PDF Focado
- mexer em prompts/estrutura de IA do material
- mexer em OCR/extracao/cache de documento
- separar Ops/NorthStar do produto publico
- decidir arquitetura de marca
- investigar bugs intermitentes ou fluxo premium

Pode usar inteligencia media/alta quando:

- ajustar CSS de uma tela especifica
- corrigir acentos/copy pequena
- mover botoes mantendo comportamento
- limpar seletor morto confirmado
- documentar estado ou atualizar README
- rodar verificacao com agent-browser

Pode usar inteligencia baixa/media quando:

- trocar textos simples
- criar checkpoints
- rodar comandos de validacao
- organizar arquivos de docs

Recomendacao pratica:

- Para a proxima fase de limpeza geral, manter modelo forte no planejamento e
  nas decisoes de corte.
- Depois dividir em etapas pequenas e usar menos inteligencia para ajustes
  mecanicos, sempre com agent-browser validando.

## Proxima acao recomendada

1. Abrir producao e local com agent-browser.
2. Validar se as mudancas recentes do PDF e botoes inferiores estao iguais nos
   dois ambientes.
3. Resolver primeiro acessibilidade/residuos do player e side nav.
4. Depois reduzir altura da home mobile.
5. So entao limpar CSS legado.

