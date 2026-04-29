# Handoff: sites utilitários/isca para o futuro Papiro

Data: 2026-04-29

## Contexto

O site principal ainda se chama RotaNota, mas a marca futura será `Papiro + algo` (nome final ainda aberto). O usuário quer criar sites separados, úteis de verdade, com layout próprio, para servir como ferramentas gratuitas/isca e apontar para o futuro Papiro.

Já existe um projeto separado:

- `C:\dev\planejador-semanal`
- Produção: `https://planejador-semanal.vercel.app`
- Marca do site: `Planejador Semanal`
- Papiro só aparece no anúncio/link de saída.

No RotaNota (`C:\dev\study-os`), a cópia antiga `/tabela-classica/` foi removida e republicada. A rota antiga deve dar `404`.

## Decisão de produto

Criar uma família de ferramentas gratuitas, cada uma com SEO e layout próprios, mas com anúncio discreto para o futuro Papiro.

Prioridade sugerida:

1. `Planejador Semanal` - já feito.
2. `Timer Pomodoro Online` - próximo melhor candidato.
3. `Cronômetro Online`.
4. `Timer Online`.
5. `Calculadoras de Estudo`.
6. `Questões por Assunto`.
7. `Sons para Estudar`.

PDF ficou fora por enquanto. Motivo: envolve custo, upload, expectativa alta e risco de virar um produto maior. Melhor não usar como isca simples agora.

## Pomodoro

Próximo site recomendado:

- Nome: `Timer Pomodoro`
- Título SEO: `Timer Pomodoro Online | Foco para estudar`
- H1: `Timer Pomodoro para estudar com foco`
- Funções grátis:
  - 25/5
  - 50/10
  - pausa longa
  - som discreto
  - modo foco
  - tela cheia
  - tema claro/escuro
- Anúncio:
  - `Continue estudando com Papiro`
  - `PDFs, questões, rotina e foco em um só lugar.`

Origem provável no RotaNota:

- `js/pomodoro.js`
- CSS relacionado em `css/premium.css`
- procurar por `pomodoro`, `timer`, `cycle`, `focus-mode`.

Importante: extrair só o essencial. Não levar o app inteiro.

## Calculadoras

Melhor abordagem inicial: um site único chamado `Calculadoras de Estudo`, com várias calculadoras em cards/abas, em vez de vários sites separados no começo.

Ideia do usuário: várias calculadoras lado a lado com campos já definidos para fazer a conta certa. Sim, essa é a melhor abordagem.

Exemplos de calculadoras:

- Média de notas.
- Nota necessária na prova final.
- Porcentagem de acertos.
- Regra de três.
- Tempo de estudo necessário.
- Divisão de carga horária por dias.
- Meta semanal de horas.
- Conversão questões/acertos/percentual.

SEO:

- Site guarda-chuva: `calculadoras-de-estudo.vercel.app`
- Título: `Calculadoras de Estudo | Média, porcentagem e nota necessária`
- Depois, se uma calculadora performar bem, criar página própria:
  - `/media-de-notas/`
  - `/nota-necessaria/`
  - `/porcentagem-de-acertos/`

Não começar com vários sites de calculadora separados, porque dilui esforço e layout. Começar com um hub forte.

## Questões por Assunto

Muito valioso, mas exige mais cuidado.

Possível formato de isca:

- Campo de busca: assunto.
- Mostra uma amostra gratuita de questões.
- Limite claro.
- CTA para continuar no Papiro.

Não prometer banco gigante se a experiência não estiver polida.

## Sons para Estudar

O usuário informou que o player já é focado em sons de ambiente de estudo. Vale olhar o módulo atual antes de decidir.

Origem provável:

- pasta `ambient/`
- `css/ambient.css`
- procurar por `ambient`, `player`, `sound`, `rain`, `focus`.

Formato recomendado:

- Nome: `Sons para Estudar`
- Título SEO: `Sons para Estudar | Ambiente de foco online`
- Funções:
  - chuva
  - café/biblioteca
  - ruído branco
  - foco profundo
  - timer opcional
  - modo escuro

Esse site pode ser mais visual/imersivo do que os outros.

## Sobreposição em outros sites

Websites comuns não conseguem ficar por cima de outros sites de forma confiável/permitida. Opções reais:

1. `window.open` com janela pequena/flutuante:
   - funciona como mini janela separada;
   - o navegador/sistema decide se fica por cima;
   - não garante always-on-top.

2. PWA instalada:
   - abre como app separado;
   - melhor para timer/pomodoro;
   - ainda não garante sobrepor todos os apps.

3. Browser extension:
   - melhor opção para overlay real em cima de páginas;
   - mais trabalho;
   - pode injetar timer/calculadora sobre qualquer site.

4. Picture-in-Picture:
   - possível para alguns casos com vídeo/canvas, mas é gambiarra para ferramentas gerais.

Recomendação: para MVP, criar botão `Abrir mini janela` nos utilitários. Futuramente, se houver tração, criar extensão `Papiro Tools`.

## Padrão visual e marca

Cada ferramenta deve ter nome próprio e não se chamar Papiro, exceto no anúncio.

Exemplo:

- Site: `Planejador Semanal`
- Anúncio: `Conhecer Papiro`

Para futuros sites:

- `Timer Pomodoro`
- `Cronômetro Online`
- `Calculadoras de Estudo`
- `Sons para Estudar`

O anúncio deve apontar para o site principal, que hoje ainda é:

- `https://rota-nota.vercel.app/`

Mas o texto deve usar `Papiro`, porque o RotaNota será renomeado.

## Marca Papiro Tools: referências de logo

Decisão atual do usuário em 2026-04-29:

- usar `Papiro Tools` como marca pública principal;
- descartar, por enquanto, as direções `Papiro Edu`, pergaminho institucional, cérebro/rede, montanha, coruja, pilar e versões genéricas;
- manter no repositório apenas as referências que ajudam a executar a direção escolhida.

Referências mantidas:

- `docs/brand/reference/papiro-tools-p-path-reference-2026-04-29.png`
- `docs/brand/reference/papiro-tools-wordmark-reference-2026-04-29.png`

Preferência visual atual:

1. A direção escolhida é `Papiro Tools`, com símbolo `P` e caminho/seta.
2. O ícone principal deve partir de `papiro-tools-p-path-reference-2026-04-29.png`.
3. A wordmark/tipografia pode aproveitar a maturidade de `papiro-tools-wordmark-reference-2026-04-29.png`.
4. Evitar logos com `Edu`, pergaminho institucional, livro literal demais, cérebro/rede, globo, tocha, pilar clássico, montanha, cristal/gelo, neon/gamer ou aparência turística.
5. O visual final deve ser mais limpo que os mockups: versão vetorial/flat, alto contraste, sem brilho pesado e sem depender de fundo escuro.
6. A identidade precisa funcionar em:
   - topo do site principal;
   - favicon/app icon;
   - modo claro;
   - modo escuro;
   - anúncios nos sites utilitários.

Prompt de refinamento sugerido:

```text
Refine a logo "Papiro Tools" baseada em um monograma P moderno com caminho/seta de progresso.
O símbolo deve funcionar sozinho como favicon e ícone de app em tamanho pequeno.
Use azul petróleo profundo, creme/branco e dourado discreto.
Evite pergaminho institucional, livro literal demais, cérebro/rede, globo, tocha, pilar clássico, montanha, cristal, elementos gamer, neon excessivo e sombras pesadas.
Texto "Papiro Tools" com presença elegante, leitura alta e aparência de produto digital premium.
Criar versão horizontal, versão empilhada, ícone isolado, versão para fundo claro e versão para fundo azul petróleo escuro.
Estilo limpo, vetorial, sofisticado, sem mockup.
```

## Próximos passos recomendados

1. Criar `C:\dev\timer-pomodoro` como projeto separado.
2. Extrair/adaptar o essencial do Pomodoro do RotaNota.
3. Criar layout próprio, mais focado e menos dashboard.
4. Adicionar anúncio para Papiro.
5. Validar no browser em claro/escuro/mobile.
6. Publicar em Vercel como projeto separado.
7. Depois criar `calculadoras-de-estudo`.

## Estado atual importante

Repositórios/pastas:

- RotaNota atual: `C:\dev\study-os`
- Planejador Semanal separado: `C:\dev\planejador-semanal`

Produções:

- RotaNota atual: `https://rota-nota.vercel.app`
- Planejador Semanal: `https://planejador-semanal.vercel.app`

Últimas validações:

- `https://planejador-semanal.vercel.app` respondeu `200`.
- `https://rota-nota.vercel.app` respondeu `200`.
- `/tabela-classica/` no RotaNota foi removida e deve responder `404`.

Atualização 2026-04-29:

- decisão de marca consolidada como `Papiro Tools`, com `Papiro` como nome curto;
- referências `Papiro Edu` removidas do repositório;
- referências mantidas apenas para `Papiro Tools`;
- base visual aplicada no projeto principal:
  - `assets/papiro-tools-mark.svg`
  - `assets/papiro-tools-logo-light.svg`
  - `assets/papiro-tools-logo-dark.svg`
  - `manifest.webmanifest`
- próximo site-isca recomendado continua sendo `Timer Pomodoro`.
