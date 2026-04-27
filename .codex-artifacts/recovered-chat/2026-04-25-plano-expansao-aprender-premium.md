# Plano Recuperado - Expansão Aprender Premium

Fonte: 2026-04-25-retomar-conversa-anterior.md

Ponto de restauração criado:

`.codex-backups/restore-points/20260425-192635-before-premium-learn-expansion`

Arquivos salvos:

- `api/_lib/handlers/premium/ai-generate.js`
- `premium-study/app/index.js`
- `premium-study/state/store.js`
- `premium-study/ui/views/index.js`
- `premium-study/styles/premium-study.css`

**Plano De Expansão**

**1. Granularidade Premium**
Ajustar o planejador para material grande não virar 3 blocos. Para PDFs longos, especialmente acima de 80-120 páginas:

- premium deve gerar mais blocos;
- cada bloco deve ser uma frente real do material;
- cada bloco pode ter subaulas;
- grátis continua compacto.

Meta: CF completa não deveria virar 3 blocos; deve virar uma trilha mais próxima de 10-14 blocos, conforme extração e tamanho.

**2. Cobertura Do Material**
Adicionar uma visão de cobertura:

- material detectado;
- quantidade de páginas;
- quantidade de blocos;
- principais frentes cobertas;
- aviso quando houver possível recorte ou texto insuficiente.

Isso evita a sensação de “cadê o resto?”.

**3. Abas Inteligentes**
Corrigir abas do Aprender:

- não truncar `Aula`, `Esquemas`, `Comparativos`, etc.;
- não mostrar aba vazia como ativa normal;
- abas com `0` devem ficar desativadas, ocultas ou com estado discreto;
- em tela menor, trocar para menu/segmentos compactos legíveis.

**4. Aula Mais Forte**
Transformar `Aula` em conteúdo premium de verdade:

- subtópicos;
- explicação mais longa;
- exemplos;
- pontos de atenção;
- “o que isso resolve na prova”;
- índice interno se houver muitas subaulas.

**5. Esquemas Reais**
Melhorar esquemas para não parecerem listas em caixas:

- fluxo vertical para processos;
- árvore para hierarquia;
- sequência para etapas;
- matriz para relações;
- cards conectados quando fizer sentido.

Sem SVG complexo por enquanto; dá para fazer com HTML/CSS bem melhor.

**6. Mnemônicos Interativos**
Criar uma área própria de memorização:

- card com frente/verso;
- revelar resposta;
- marcar como dominado;
- dica curta;
- mnemônicos só quando úteis.

**7. Checklist Interativo**
Checklist precisa permitir ação:

- marcar item;
- progresso do checklist;
- estado salvo localmente se possível;
- separar “sei explicar”, “sei aplicar”, “sei diferenciar”.

**8. Casos Com Revelação**
Casos devem ser mais parecidos com treino aplicado:

- cenário;
- botão “ver análise”;
- lição final;
- possível pegadinha.

**9. Layout E Contraste**
Polir o visual:

- reduzir vazios grandes;
- melhorar contraste do subtítulo;
- melhorar legibilidade dos cards escuros;
- impedir botões cortados;
- suavizar scrollbar;
- estabilizar diferença entre fullscreen e modo normal.

**10. Navegação Lateral**
A lateral é útil, mas precisa ficar mais eficiente:

- título menor ou menos repetitivo;
- lista mais compacta;
- mostrar progresso do bloco;
- talvez separar “blocos” e “ferramentas”.

**11. Prompt E Normalização**
Atualizar backend para pedir explicitamente:

- mais blocos em material premium extenso;
- subaulas por bloco;
- ferramentas separadas por tipo;
- cobertura declarada;
- não compactar conteúdo grande em blocos genéricos.

**12. Validação**
Testar com:

- CF completa;
- Código Penal;
- material curto grátis;
- material não jurídico;
- PDF ruim/texto incompleto.

Sem implementar ainda além do ponto de restauração.
