# Papiro - plano mestre de execucao da marca

Data de referencia: 2026-04-28

Objetivo desta fase:

- consolidar `Papiro` como marca publica do produto do aluno;
- manter o complemento em aberto por enquanto;
- mapear todos os pontos onde nome, logo, favicon e mensagens precisam mudar;
- preparar o site para comportamento de app em Android e iPhone;
- definir slots elegantes para divulgacao de outro site, campanha ou produto sem poluir a interface;
- separar claramente `Papiro` do `NorthStar`.

## Decisao de marca desta fase

Decisao atual:

- marca publica: `Papiro Tools`
- nome curto: `Papiro`
- retaguarda/admin: `NorthStar`

Regra importante:

- o aluno deve ver `Papiro Tools` ou `Papiro`, conforme espaco da interface
- o operador/admin deve ver `NorthStar`
- nomes tecnicos internos com prefixo `RotaNota` podem continuar temporariamente se a troca impactar codigo, storage, envs ou integracoes

## O que muda agora e o que nao muda agora

### Muda agora

- titulo da pagina
- meta description
- favicon e lockups
- copy publica do aluno
- textos de premium, PDF, provas, viewer e login gate
- paginas standalone publicas
- mensagens publicas no checkout e no funil premium

### Nao muda agora, salvo fase tecnica dedicada

- nomes de variaveis globais como `window.RotaNotaCore`
- nomes de envs como `ROTANOTA_*`
- nomes internos de scripts operacionais
- textos e docs historicos que sao apenas arquivo de referencia
- `NorthStar` dentro de `/ops`

Motivo:

trocar tudo de uma vez mistura rebrand visual com risco tecnico desnecessario.

## Mapa de troca de nome e logo

### Camada publica principal

1. [index.html](/c:/dev/study-os/index.html)
- trocar `<title>RotaNota</title>` para `Papiro`
- trocar meta description com mencao a `RotaNota`
- trocar favicon `assets/rotanota-mark.svg`
- trocar lockup do topo:
  - `assets/rotanota-mark.svg`
  - `assets/rotanota-logo-light.svg`
  - `assets/rotanota-logo-dark.svg`
- trocar frase do rodape:
  - `RotaNota livre de anúncios e pop-ups.`
- revisar microcopy com encoding quebrado ao mesmo tempo da troca

2. [questions-standalone.html](/c:/dev/study-os/questions-standalone.html)
- trocar `Questions Solo | RotaNota`
- decidir se vira:
  - `Questoes | Papiro`
  - ou `Papiro Questoes`

3. [qts-lab.html](/c:/dev/study-os/qts-lab.html)
- trocar `RotaNota - QTS Lab`
- recomendacao:
  - `Papiro - QTS Lab` enquanto o nome do modulo nao for revisado

4. [premium-study/pdf-workbench/viewer.html](/c:/dev/study-os/premium-study/pdf-workbench/viewer.html)
- trocar `RotaNota PDF Integral`
- recomendacao:
  - `Papiro PDF Integral`
  - ou `Papiro Documento Integral`

### Fluxo premium e PDF Focado

5. [premium-study/router/index.js](/c:/dev/study-os/premium-study/router/index.js)
- trocar copy de processamento:
  - `RotaNota esta montando o melhor caminho para voce.`
  - linha editorial com `RotaNota`
- revisar naming dos steps visiveis
- padronizar para linguagem da nova marca sem soar cursinho

6. [premium-study/app/index.js](/c:/dev/study-os/premium-study/app/index.js)
- trocar `RotaNota Premium`
- revisar eyebrow, checkout notes e mensagens de retorno
- decidir se premium usa:
  - `Papiro Premium`
  - ou nome mais neutro como `Plano premium do Papiro`

7. [premium-study/ui/components/index.js](/c:/dev/study-os/premium-study/ui/components/index.js)
- trocar nota visivel:
  - `o RotaNota continua trabalhando...`
- esta area e importante para consolidar a nova voz da marca

8. [premium-study/state/store.js](/c:/dev/study-os/premium-study/state/store.js)
- trocar titulos default de prova:
  - `Prova de nivel RotaNota`
- recomendacao:
  - `Prova de nivel Papiro`

9. [api/_lib/handlers/premium/ai-generate.js](/c:/dev/study-os/api/_lib/handlers/premium/ai-generate.js)
- prompt ainda fala:
  - `Voce e a IA pedagogica do RotaNota`
- trocar para `Papiro`
- isso afeta consistencia da geracao e deve entrar na fase de texto oficial

### Logos e assets

10. [assets/rotanota-mark.svg](/c:/dev/study-os/assets/rotanota-mark.svg)
11. [assets/rotanota-logo-light.svg](/c:/dev/study-os/assets/rotanota-logo-light.svg)
12. [assets/rotanota-logo-dark.svg](/c:/dev/study-os/assets/rotanota-logo-dark.svg)

Plano:

- criar novos assets paralelos primeiro:
  - `assets/papiro-tools-mark.svg`
  - `assets/papiro-tools-logo-light.svg`
  - `assets/papiro-tools-logo-dark.svg`
- so depois trocar referencias
- nao sobrescrever os antigos logo de cara

### Login gate e pontos auxiliares de marca

13. [js/app.js](/c:/dev/study-os/js/app.js)
- existe logo do gate:
  - `assets/rotanota-logo-dark.svg`
- trocar classe e asset quando a marca nova entrar

14. [css/premium.css](/c:/dev/study-os/css/premium.css)
- classes de marca antigas:
  - `home-login-gate-brand-rotanota-logo`
- fase visual deve renomear para algo neutro:
  - `home-login-gate-brand-logo`

### Pagamentos e checkout

15. [api/_lib/handlers/mercado-pago/checkout.js](/c:/dev/study-os/api/_lib/handlers/mercado-pago/checkout.js)
- titulos:
  - `RotaNota Premium mensal`
  - `RotaNota Premium anual`
- statement descriptor:
  - `ROTANOTA`

Observacao:

- esse ponto e publico/comercial e precisa mudar depois da decisao final da marca comercial no Mercado Pago
- talvez `PAPIRO` puro seja melhor que `PAPIRO PREMIUM`

### Pontos que devem ficar em NorthStar

16. [ops/index.html](/c:/dev/study-os/ops/index.html)
17. [ops/app.js](/c:/dev/study-os/ops/app.js)
18. [api/_lib/ops-defaults.js](/c:/dev/study-os/api/_lib/ops-defaults.js)
19. [api/_lib/ops-service.js](/c:/dev/study-os/api/_lib/ops-service.js)
20. [api/_lib/handlers/northstar/*](/c:/dev/study-os/api/_lib/handlers/northstar)

Regra:

- `NorthStar` continua aqui
- onde aparecer `RotaNota` como produto operado, trocar futuramente para `Papiro`
- onde aparecer `NorthStar` como hub, manter

## Mapa por prioridade de troca

### Fase 1 - troca publica visivel sem risco estrutural

- `index.html`
- `questions-standalone.html`
- `qts-lab.html`
- `premium-study/pdf-workbench/viewer.html`
- `premium-study/router/index.js`
- `premium-study/app/index.js`
- `premium-study/ui/components/index.js`
- `premium-study/state/store.js`
- novos assets `papiro-*`

Resultado esperado:

- usuario comum praticamente nao ve mais `RotaNota`

### Fase 2 - copy publica mais profunda

- `api/_lib/handlers/premium/ai-generate.js`
- mensagens premium e de prova
- textos de login gate
- labels em pages auxiliares

Resultado esperado:

- IA, viewer, PDF e premium falam a mesma lingua da marca

### Fase 3 - camada tecnica e comercial

- `ROTANOTA_*` envs
- `window.RotaNota*`
- readiness scripts
- Mercado Pago titles / descriptor
- nomes de projeto, alias, docs tecnicos principais

Resultado esperado:

- o codigo tambem reflete a marca nova, sem quebrar integracoes

## Onde adicionar logos pequenos ou frases de consolidacao

Objetivo:

- reforcar `Papiro` sem entupir a interface
- parecer produto premium e coerente, nao propaganda interna

### Locais recomendados

1. Topbar principal
- manter o lockup principal apenas aqui
- este e o lugar mais forte da marca

2. Login gate de estatisticas
- pequeno mark + nome
- frase curta:
  - `Sua rotina continua no Papiro.`

3. Tela de processamento do PDF
- mark pequeno no canto do card
- frase curta:
  - `Papiro organiza o material enquanto voce espera.`

4. Biblioteca premium
- pequena assinatura visual no cabecalho:
  - `Biblioteca Papiro`

5. Viewer textual / PDF workbench
- mark pequeno no header superior
- sem repetir lockup grande

6. Tela de resultado de prova
- frase curta no rodape do bloco:
  - `Feito para continuar do ponto certo.`

7. Rodape principal
- trocar a frase antiga de anti-anuncio por algo mais de marca:
  - `Papiro, foco no estudo sem ruido.`

### Locais onde eu evitaria reforco de marca

- dentro de cada card da home
- em cada bloco de aprender
- dentro de questoes
- em botoes pequenos
- repetido no sidebar

Se repetir demais, o produto parece inseguro com a propria identidade.

## Frases curtas candidatas para consolidar a marca

Sem complemento ainda:

- `Papiro organiza o caminho do estudo.`
- `Papiro transforma material em progresso.`
- `Papiro, estudo claro sem ruido.`
- `Papiro monta a rota e voce avanca.`
- `Papiro trabalha o material para voce estudar melhor.`

Minha recomendacao:

- institucional curta: `Papiro transforma material em progresso.`
- operacional curta: `Papiro organiza o caminho do estudo.`

## Modo app Android e iPhone

Esta fase deve entrar no plano oficial, mesmo antes da publicacao nas lojas.

### Objetivo

Fazer o produto parecer app nativo quando aberto:

- como PWA no Android
- como web app adicionada a tela inicial no iPhone
- em webview futura de app wrapper, se quiserem publicar depois

### Execucao prevista

1. Manifesto e identidade app
- criar `manifest.webmanifest`
- nome curto: `Papiro`
- icones adaptados para Android
- theme color e background color coerentes com o produto

2. Meta tags iOS
- `apple-mobile-web-app-capable`
- `apple-mobile-web-app-status-bar-style`
- `apple-mobile-web-app-title`
- icones apple touch

3. Safe areas
- revisar topbar e rodape para `env(safe-area-inset-top)` e `env(safe-area-inset-bottom)`
- evitar botao colado no notch ou no home indicator

4. Navegacao app mode
- definir comportamento quando em modo standalone:
  - topbar mais compacta
  - menos chrome visual
  - foco no modulo ativo

5. Splash e loading
- preparar loading inicial da marca para app mode
- sem efeito marketing; so identidade limpa

6. Instalacao discreta
- nao usar pop-up agressivo
- usar convite elegante:
  - card pequeno na home
  - ou linha compacta no rodape da home premium

### Locais do codigo onde isso provavelmente entrara

- [index.html](/c:/dev/study-os/index.html)
- novo `manifest.webmanifest`
- novos icones em `assets/`
- `css/premium.css`
- possivelmente `service.js`

## Locais definidos para divulgacao de outro site, parceiro ou campanha

Objetivo:

- abrir espaco comercial ou de cross-promo
- sem parecer banner aleatorio
- mantendo linguagem premium e integrada

### Formatos recomendados

1. Spotlight integrado
- card editorial dentro da home, abaixo da area principal
- uso:
  - divulgar outro site seu
  - divulgar parceria
  - divulgar plano premium
- visual:
  - mesmo padrao do produto
  - sem cores gritantes

2. Slot de continuidade no PDF Focado
- pequeno painel entre blocos ou ao fim da biblioteca
- uso:
  - `Conheca tambem`
  - `Ferramenta complementar`
  - `Site parceiro`

3. Rodape institucional
- area pequena com 1 link institucional curado
- ex:
  - `Explorar outra frente`
  - `Ver plataforma parceira`

4. Paywall lateral leve
- na area premium, um bloco secundario discreto para cross-promo
- nunca acima do CTA principal

5. Tela de resultado / fim de fluxo
- apos prova ou ao concluir material, mostrar proximo produto recomendado
- isso parece parte da jornada, nao anuncio

### Locais recomendados no site atual

1. Home publica
- abaixo de `home-command-bottom`
- um unico slot editorial

2. Biblioteca premium
- abaixo da lista principal ou na lateral superior

3. Fim da tela de resultado de prova
- bloco de proximo passo

4. Rodape publico
- link institucional unico

### Locais que eu evitaria

- topo da home
- dentro da grade principal de 4 cards
- dentro do meio das questoes
- no miolo do bloco aprender
- sobrepondo processamento/loading

## Estrutura recomendada desses slots

Padrao:

- selo pequeno: `Destaque`
- titulo curto
- uma linha de explicacao
- CTA unico
- opcionalmente um mark pequeno do site divulgado

Nao usar:

- carrossel de anuncios
- mais de 1 promocao simultanea por tela
- bloco piscando
- CTA duplicado

## Regras de arquitetura da marca

### Publico do aluno
- nome visivel: `Papiro`
- complemento: so depois da decisao
- tom: claro, forte, sem cara escolar

### Hub operacional
- nome visivel: `NorthStar`
- relacao textual:
  - `NorthStar opera o ecossistema`
  - `Papiro e um produto operado pelo NorthStar`

### Tecnico
- pode ficar temporariamente como `RotaNota` internamente
- criar backlog para migracao progressiva sem quebrar sessao, localStorage, env e APIs

## Ordem de execucao recomendada

1. [x] criar assets novos de `Papiro Tools`
2. [x] trocar marca publica no front principal
3. [x] trocar marca nos fluxos premium e viewer nos pontos publicos diretos
4. [~] revisar frases curtas de consolidacao
5. [x] adicionar base de app mode Android/iPhone
6. inserir 1 slot editorial na home e 1 slot no premium
7. validar browser desktop/mobile
8. so depois migrar nomenclatura tecnica e comercial

## Criterio de sucesso

- usuario comum nao encontra `RotaNota` no fluxo principal
- `NorthStar` aparece apenas onde e administracao
- `Papiro` aparece de forma limpa e consistente
- app mode fica preparado para Android e iPhone
- existe espaco de divulgacao integrado sem poluicao
- a marca parece produto real, nao remendo em cima do nome antigo

## Proxima decisao que ainda falta

Transformar a referencia escolhida em assets finais de `Papiro Tools`.

A recomendacao desta fase:

- implementar tudo com base em `Papiro Tools`
- usar `Papiro` apenas como nome curto quando faltar espaco
- criar primeiro os assets finais paralelos antes de trocar as referencias no front

Atualizacao 2026-04-29:

- assets base criados:
  - `assets/papiro-tools-mark.svg`
  - `assets/papiro-tools-logo-light.svg`
  - `assets/papiro-tools-logo-dark.svg`
- `manifest.webmanifest` criado com nome `Papiro Tools` e nome curto `Papiro`
- `index.html` passou a usar favicon, manifest e lockups de `Papiro Tools`
- titulos publicos de `questions-standalone.html`, `qts-lab.html` e viewer PDF foram ajustados
- textos publicos diretos do premium/checkout/IA foram ajustados
- nomes tecnicos `RotaNota*`, storage keys e cookies continuam preservados por seguranca
- validacao local com Playwright em `http://127.0.0.1:4173/`:
  - home desktop carregou com titulo, favicon, manifest e lockups `Papiro Tools`
  - home mobile 390px carregou sem overflow horizontal
  - `questions-standalone.html`, `qts-lab.html` e viewer PDF exibiram titulos novos
  - screenshots salvos em `.codex-artifacts/papiro-tools-home-desktop.png` e `.codex-artifacts/papiro-tools-home-mobile.png`
  - 404s observados no servidor estatico local foram `/api/auth/session` e thumbnails externas do YouTube, nao causados pela troca da marca
