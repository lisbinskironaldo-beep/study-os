# Auditoria v5.5 - proximo nivel do produto

Data de referencia: 2026-04-27

Este documento registra a parte que exige mais inteligencia: leitura ampla do
produto, separacao entre decisao de arquitetura e ajuste mecanico, riscos de
regressao e ordem correta de execucao. A proxima fase pode ser feita com
inteligencia menor, desde que siga este roteiro sem reabrir escopo.

## Ponto de restauracao criado

Foi criado um stash local antes da auditoria:

```powershell
stash@{0}: On main: restore-before-v55-audit-2026-04-27
```

Observacao: o arquivo `.codex-artifacts/dev-server/vercel-dev.err.log` estava
travado pelo servidor local, entao o apply do stash avisou que nao sobrescreveria
esse log. O estado util foi reaplicado: o documento
`docs/visual_cleanup_handoff.md` voltou ao workspace e o stash permanece como
restauracao.

Estado esperado depois da auditoria:

```text
 M .codex-artifacts/dev-server/vercel-dev.err.log
?? docs/visual_cleanup_handoff.md
?? docs/v55_site_audit_next_level.md
```

## Referencias externas usadas

- WCAG 2.2 Reflow: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- WCAG 2.2 Target Size Minimum: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WCAG 2.2 Focus Appearance: https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html

Aplicacao pratica: evitar overflow horizontal, garantir alvos clicaveis
confortaveis, manter foco visivel e retirar da arvore acessivel elementos que
estao visualmente fechados/inativos.

## O que foi validado com agent-browser

Versao do CLI:

```text
agent-browser 0.26.0
```

Ambientes verificados:

- `http://localhost:3000`
- `https://papiro-tools.vercel.app`

Resultado:

- local e producao renderizam a mesma home nova.
- nenhum erro de console foi reportado pelo comando `agent-browser errors`.
- nao ha overflow horizontal no mobile de 390px.
- ainda existem problemas de acessibilidade/estrutura no snapshot interativo.

Medida mobile atual em 390 x 844:

```json
{
  "vw": 390,
  "scrollW": 375,
  "firstCardY": 634.40625,
  "heroHeight": 513.40625
}
```

Interpretacao: tecnicamente nao estoura largura, mas a primeira acao principal
aparece tarde demais. A hero mobile precisa ser reduzida.

## Decisoes fechadas desta auditoria

### 1. Player de som nao e so visual

Problema confirmado no snapshot:

- a biblioteca inteira do player aparece como interativa mesmo quando o usuario
  so ve o botao "Som".
- `ambientPanel` fica com `opacity: 0` e `pointer-events: none`, mas sem
  `aria-hidden` e sem `inert`.
- `sideModules` tambem fica invisivel por opacity/pointer-events, mas segue na
  arvore interativa.

Medida local:

```json
{
  "ambientPanel": {
    "display": "flex",
    "opacity": "0",
    "pointerEvents": "none",
    "ariaHidden": null,
    "inert": false
  },
  "sideModules": {
    "display": "flex",
    "opacity": "0",
    "pointerEvents": "none",
    "ariaHidden": null,
    "inert": false
  }
}
```

Decisao: player fechado deve expor apenas `Mostrar player de som`. Biblioteca,
favoritos, categorias, lista de trilhas e side modules fechados precisam sair da
arvore acessivel.

Execucao mecanica depois:

- em `ambient/ambientUI.js`, quando `panelMode !== 0`, aplicar
  `aria-hidden="true"` e `inert = true` em `#ambientPanel`.
- quando `panelMode === 0`, remover `aria-hidden` e `inert`.
- em `#ambientMini.is-hidden`, aplicar tambem `aria-hidden` e `inert`.
- em `js/app.js`, ao recolher/inibir `#sideModules`, aplicar `aria-hidden` e
  `inert`.
- nos botoes `.footer-icon` de `index.html`, adicionar `aria-label` e `title`
  quando hoje so existe `data-label`.

Aceite:

```powershell
agent-browser open http://localhost:3000
agent-browser wait --load networkidle
agent-browser snapshot -i
```

O snapshot inicial nao pode listar as faixas do player nem botoes anonimos.

### 2. Home mobile esta comprida demais na primeira dobra

Problema confirmado:

- `.home-command-hero` tem cerca de 513px de altura em mobile.
- o primeiro card principal comeca em `y=634`.
- a acao principal fica abaixo do que parece ideal para uma entrada de estudo.

Decisao: reduzir a hero mobile, nao criar outra home.

Execucao mecanica depois:

- em `css/premium.css`, ajustar media queries de `.home-command-shell`,
  `.home-command-hero`, `.home-command-now` e `.home-command-grid`.
- meta: primeiro card antes de `y=560`, idealmente entre `y=500` e `y=540`.
- manter `scrollWidth <= innerWidth`.

### 3. "Progresso" esta conceitualmente ambiguo

Teste feito:

```js
document.querySelector('[data-home-action=questions-progress]').click()
```

Resultado:

```json
{
  "mode": "questions",
  "hash": "#questions",
  "visibleModules": ["questionsModule"]
}
```

Hoje o card "PROGRESSO / Ver estatisticas" envia para o modulo de questoes com
target de progresso. Isso explica a sensacao de clique confuso: a home promete
estatisticas gerais, mas o destino e Questions.

Decisao de produto:

- se o card chama "Progresso / Ver estatisticas", ele deve abrir estatisticas
  gerais ou gate de login de estatisticas.
- se a intencao for progresso de questoes, o texto deve mudar para algo como
  "Desempenho em questoes".

Recomendacao: usar o card principal para estatisticas gerais. O progresso de
questoes deve ficar dentro de `Praticar`.

Execucao mecanica depois:

- em `js/app.js`, mudar `handleHomeAction("questions-progress")` para abrir
  stats/gate correto.
- revisar copy do card em `index.html`.
- validar que o clique nao passa por tela intermediaria perceptivel.

### 4. Cache de mesmo material ja existe, mas ainda e local

Encontrado:

- `findReusableMaterialSnapshot(materialHash)`
- `applyReusableMaterialSnapshot(...)`
- `reuseGeneratedStudyForCurrentMaterial(...)`
- `primeMaterialPreparation(...)`
- `saveCachedMaterialText(...)` e `loadCachedMaterialText(...)`

Conclusao: o sistema ja consegue reconhecer mesmo material por `materialHash`
quando a trilha esta no cache/biblioteca local do usuario. Isso responde parte
da sua pergunta: sim, da para buscar algo pronto; em parte ja existe.

Limite atual: nao ha evidencia de cache global/server-side de bundle completo
por hash + tier + promptVersion + localBundleVersion. Se o usuario troca
dispositivo ou a biblioteca local nao tem a trilha, ele pode recomecar.

Decisao:

- manter cache local imediato.
- adicionar depois cache server-side controlado, sem compartilhar dado privado
  entre usuarios sem regra clara.

Modelo recomendado:

```text
document_hash
material_name_normalized
page_count
access_tier
prompt_version
local_bundle_version
bundle_json
extracted_text_quality
created_by_user_id
created_at
last_used_at
```

Regra de uso:

- mesmo usuario: pode reaproveitar bundle completo.
- usuarios diferentes: so reaproveitar se a politica de privacidade permitir,
  ou se for cache anonimo de documento publico/conhecido.

### 5. OCR/extração ruim: arquitetura boa, mas feedback deve ser mais honesto

Encontrado:

- extracao local com PDF.js em `premium-study/services/pdf-text-extractor.js`.
- renderizacao de paginas como imagem para IA visual.
- endpoint `/api/premium/pdf-extract` com PDF inline, asset do Supabase ou
  imagens renderizadas.
- fallback Gemini: `gemini-2.5-flash-lite` e `gemini-2.5-flash`.

Conclusao: nao recomendo instalar OCR pesado agora como primeira resposta. A
arquitetura atual ja usa leitura visual por IA e funcionou nos seus testes,
embora demore. O problema principal agora e continuidade/feedback: o usuario
precisa saber que a pagina nao travou.

Execucao mecanica depois:

- manter overlay ativo ate finalizar ou falhar de verdade.
- quando passar de 30s, trocar texto para "Ainda trabalhando em segundo plano".
- mostrar contador de objetivos real: `1/4`, `2/4`, `3/4`, `4/4`.
- se chegar em 94% e ainda estiver pendente, usar estado "Finalizando" sem
  parecer travado.
- nao fechar modal enquanto `modePreparation.active` estiver true.

### 6. Mojibake ainda existe e pode afetar qualidade da IA

Encontrado em prompt critico: termos como `mnemonico`, `memoria` e `so`
aparecem codificados de forma quebrada no arquivo, com sequencias tipicas de
mojibake.

Arquivo:

```text
api/_lib/handlers/premium/ai-generate.js
```

Impacto: alem de aparecer ruim para usuario quando vaza, isso entra no prompt
da IA e pode reduzir a qualidade dos recursos de memorizacao.

Decisao: corrigir mojibake de codigo e textos visiveis antes de novos grandes
polimentos.

Execucao mecanica depois:

Pesquisar por marcadores de mojibake nos arquivos de runtime, evitando vendor e
restore-points. Se a busca tambem bater neste documento, ignorar esta secao e
corrigir apenas codigo executado pelo produto.

Corrigir primeiro arquivos de runtime:

- `api/_lib/handlers/premium/ai-generate.js`
- `premium-study/ui/components/index.js`
- `premium-study/ui/views/index.js`
- `premium-study/router/index.js`
- `js/app.js`
- `js/stats.js`

Depois corrigir docs se fizer sentido.

### 7. CSS legado precisa de bisturi, nao limpeza em massa

Varredura encontrou muitos seletores suspeitos sem uso direto fora do CSS, por
exemplo:

- `home-shortcuts-shell`
- `home-shortcut-card-*`
- `home-launchpad-main`
- `launchpad-card-*`
- `rotanota-home-brand`
- `ambient-player`
- `ambient-panel-new`
- `premium-block-*`
- `premium-floating-*`
- `premium-detail-grid-learning`

Risco: a busca simples tem falsos positivos, porque algumas classes sao
montadas dinamicamente. Nao apagar em lote.

Decisao: criar um arquivo de quarentena mental por tela:

1. Home atual.
2. PDF Focado.
3. Questions.
4. Pomodoro/foco.
5. Tabela.
6. Ambient player.

So remover seletor depois de:

- `rg` nao encontrar em HTML/JS.
- abrir a tela no navegador.
- confirmar visualmente que nao era classe dinamica.

### 8. Casos do Aprender estao melhores, mas precisam ensinar a interacao

Encontrado:

- `renderCaseStudies(...)` ja renderiza casos estruturados com botao
  `Ver analise`.
- para casos soltos, renderiza `Ver caminho de resposta`.

Decisao: nao mostrar resposta automaticamente. O correto e manter revelacao.
Mas o estado visual precisa deixar claro que existe uma resposta/caminho
clicavel.

Execucao mecanica depois:

- garantir que o botao de revelar fique visivel o suficiente.
- em casos soltos, trocar titulo para "Tente responder antes de revelar".
- no primeiro caso, considerar estado com microcopy "clique para ver o caminho".

### 9. Botoes inferiores dos modos devem continuar

Direcao confirmada pelo usuario:

- fora da home, botoes dos blocos/modos ficam embaixo.
- laterais ficam livres para leitura.

Decisao: preservar. A proxima fase so deve ajustar responsividade, altura,
safe-area e sobreposicao.

Validacao depois:

- Aprender: botoes nao cobrem fim do conteudo.
- Praticar: botoes nao confundem resposta/continuar.
- Prova: gerar/entrar/responder deve ser uma acao primaria clara.
- Mobile: nenhum botao abaixo de 44px de altura visual.

### 10. Marca: preparar camada, nao renomear ainda

Estado:

- produto publico ainda usa Papiro Tools.
- decisao posterior em 2026-04-29: Papiro Tools como marca publica, Papiro como nome curto.
- Ops tende a NorthStar.

Decisao:

- nao trocar marca agora.
- criar depois uma camada central de brand tokens.
- separar nome publico de nome tecnico/storage/API.

Sugestao de taxonomia:

```js
const Brand = {
  currentPublicName: "Papiro Tools",
  candidatePublicName: "Papiro Tools",
  labBrand: "Papiro Labs",
  shortName: "Papiro",
  opsName: "NorthStar"
};
```

### 11. Ops/NorthStar nao deve competir com aluno

Estado:

- `/ops` existe dentro do mesmo deploy.
- `vercel.json` roteia `/api/ops/*` e NorthStar.
- docs de NorthStar ja existem.

Decisao:

- nao remover `/ops` agora.
- nao expor Ops na experiencia publica.
- proxima arquitetura deve preparar separacao por dominio/projeto, mas sem
  quebrar endpoints existentes.

## Ordem de execucao agora que a fase v5.5 terminou

Esta e a ordem para a fase com inteligencia menor:

1. Corrigir acessibilidade do player/sideModules e labels anonimos.
2. Reduzir home mobile para trazer o primeiro card para cima.
3. Corrigir destino/copy do card Progresso.
4. Corrigir mojibake em arquivos de runtime.
5. Validar PDF Focado pequeno, grande e escaneado sem alterar regras de
   Praticar/Prova.
6. Ajustar overlay longo para OCR/IA parecer trabalho em andamento, nao trava.
7. Validar botoes inferiores em Aprender, Praticar e Prova.
8. So depois iniciar limpeza de CSS legado por tela.

## Quando baixar a inteligencia

Pode baixar agora.

O que faltava de v5.5 era:

- entender a arquitetura real do PDF/OCR/cache;
- decidir se precisa instalar OCR externo agora;
- separar bugs visuais de bugs conceituais;
- identificar riscos de cache/privacidade;
- decidir que a marca nao deve ser trocada ainda;
- proteger os pontos que o usuario aprovou.

A proxima rodada e execucao controlada, com checkpoints pequenos e validacao no
browser. Modelo medio/alto e suficiente.
