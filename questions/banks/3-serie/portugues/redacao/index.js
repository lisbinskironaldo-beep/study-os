import { createPortugueseTopic } from "../../../_shared/portugueseTopicFactory.js";

const blocos = [
  { subtopico: "Estrutura dissertativo-argumentativa", habilidade: "identificar a organização básica da redação dissertativo-argumentativa", tags: ["redacao", "estrutura"], fatos: [
    { lead: "a introdução de um texto dissertativo-argumentativo", answer: "a parte que apresenta tema, recorte e encaminhamento da tese", why: "ela abre o projeto argumentativo do texto" },
    { lead: "o desenvolvimento da redação", answer: "a parte em que os argumentos são aprofundados e articulados", why: "nela o autor sustenta a tese apresentada" },
    { lead: "a conclusão da redação", answer: "a parte que retoma a discussão e fecha o percurso argumentativo", why: "ela encerra o texto com síntese e encaminhamento" },
    { lead: "a tese em redação", answer: "o posicionamento central que orienta toda a argumentação", why: "sem tese clara o texto perde direção" },
    { lead: "a progressão textual", answer: "o encadeamento coerente das ideias ao longo das partes do texto", why: "ela evita repetição e quebra de raciocínio" }
  ] },
  { subtopico: "Tema e recorte", habilidade: "delimitar tema, problema e ponto de vista", tags: ["tema", "recorte"], fatos: [
    { lead: "o tema da proposta", answer: "o assunto central a ser discutido pelo candidato", why: "ele orienta todo o planejamento da redação" },
    { lead: "o recorte temático", answer: "a delimitação específica do aspecto que será focalizado dentro do tema amplo", why: "ele ajuda a evitar generalidade excessiva" },
    { lead: "a fuga ao tema", answer: "o afastamento do assunto proposto pela coletânea ou comando", why: "esse erro compromete seriamente a avaliação do texto" },
    { lead: "a leitura do comando da proposta", answer: "a etapa que define o que realmente precisa ser respondido e defendido", why: "muitos desvios nascem de interpretação incompleta" },
    { lead: "o ponto de vista na redação", answer: "a posição assumida pelo autor diante do problema proposto", why: "ele precisa aparecer de forma clara e sustentável" }
  ] },
  { subtopico: "Argumentacao", habilidade: "reconhecer tipos de argumento e função persuasiva", tags: ["argumentacao", "tese"], fatos: [
    { lead: "um argumento de causa e consequência", answer: "a justificativa que relaciona um problema a seus efeitos ou origens", why: "essa estratégia organiza encadeamentos lógicos frequentes" },
    { lead: "um argumento por exemplificação", answer: "o recurso de tornar concreta uma ideia abstrata por meio de caso ilustrativo", why: "exemplos fortalecem a defesa da tese" },
    { lead: "um argumento de autoridade", answer: "a referência a voz legitimada para reforçar o ponto defendido", why: "dados, especialistas e pesquisas podem cumprir esse papel" },
    { lead: "a consistência argumentativa", answer: "a coerência entre tese, repertório e desenvolvimento das ideias", why: "argumentos soltos não sustentam um bom texto" },
    { lead: "a progressão dos argumentos", answer: "a organização das justificativas de modo articulado e não repetitivo", why: "isso eleva a qualidade do desenvolvimento" }
  ] },
  { subtopico: "Repertorio sociocultural", habilidade: "avaliar uso de repertório produtivo e pertinente", tags: ["repertorio", "contextualizacao"], fatos: [
    { lead: "o repertório sociocultural", answer: "a referência externa usada para ampliar e sustentar a argumentação", why: "ele pode vir da história, arte, filosofia, ciência ou atualidade" },
    { lead: "um repertório produtivo", answer: "a referência que se integra de fato a tese e aos argumentos do texto", why: "não basta citar, e preciso relacionar" },
    { lead: "um repertório legitimado", answer: "a referência socialmente reconhecida e pertinente ao contexto da discussão", why: "isso fortalece a credibilidade argumentativa" },
    { lead: "a citação desconectada", answer: "o uso de repertório sem articulação com o problema discutido", why: "essa prática enfraquece a funcionalidade do texto" },
    { lead: "a função do repertório", answer: "o apoio a análise e a ampliacao da profundidade argumentativa", why: "ele deve servir ao projeto do texto e não ao exibicionismo" }
  ] },
  { subtopico: "Coesão e articulação", habilidade: "reconhecer mecanismos de conexão em redação", tags: ["coesao", "articulacao"], fatos: [
    { lead: "a coesão textual", answer: "o conjunto de mecanismos que liga partes do texto de forma articulada", why: "ela ajuda a construir continuidade de leitura" },
    { lead: "um conectivo conclusivo", answer: "o elemento que sinaliza fechamento ou consequência do raciocínio", why: "portanto é assim são exemplos comuns" },
    { lead: "a retomada referencial", answer: "o recurso de recuperar informações já mencionadas para evitar repetição excessiva", why: "pronomes e substituições lexicais ajudam nessa tarefa" },
    { lead: "a progressão por conectores", answer: "a articulação das ideias por marcas explícitas de relação lógica", why: "isso orienta o leitor no percurso argumentativo" },
    { lead: "a repetição improdutiva", answer: "o retorno excessivo a mesma formulacao sem avancar a argumentação", why: "esse problema compromete a fluidez do texto" }
  ] },
  { subtopico: "Coerência e projeto de texto", habilidade: "avaliar unidade de sentido e consistência argumentativa", tags: ["coerencia", "projeto"], fatos: [
    { lead: "a coerência textual", answer: "a unidade de sentido produzida pela articulação consistente das ideias", why: "sem coerência o texto perde inteligibilidade" },
    { lead: "a contradição interna", answer: "o conflito entre afirmações do próprio texto que enfraquece a tese", why: "ela rompe a unidade argumentativa" },
    { lead: "o projeto de texto", answer: "o planejamento global que organiza tese, argumentos e encaminhamento final", why: "ele da direção ao processo de escrita" },
    { lead: "a pertinencia de um parágrafo", answer: "a relação efetiva dele com a tese e o recorte temático", why: "todo trecho deve contribuir para o projeto global" },
    { lead: "a unidade argumentativa", answer: "a manutenção do foco temático e do ponto de vista ao longo do texto", why: "desvios e dispersoes comprometem a qualidade da redação" }
  ] },
  { subtopico: "Competencias do ENEM", habilidade: "identificar dimensoes avaliativas da redação do ENEM", tags: ["enem", "competencias"], fatos: [
    { lead: "a competencia 1 do ENEM", answer: "a avaliação do domínio da modalidade escrita formal da língua portuguesa", why: "ela observa norma padrão e uso adequado da escrita" },
    { lead: "a competencia 2 do ENEM", answer: "a avaliação da compreensão da proposta e do desenvolvimento do tema em formato dissertativo-argumentativo", why: "ela verifica aderência ao tema e ao gênero" },
    { lead: "a competencia 3 do ENEM", answer: "a avaliação da seleção, organização e interpretação de argumentos", why: "ela mede a força do projeto argumentativo" },
    { lead: "a competencia 4 do ENEM", answer: "a avaliação do uso de mecanismos linguísticos para articular as partes do texto", why: "ela se relaciona a coesão e articulação" },
    { lead: "a competencia 5 do ENEM", answer: "a avaliação da proposta de intervenção para o problema discutido", why: "ela exige fechamento propositivo e respeito aos direitos humanos" }
  ] },
  { subtopico: "Proposta de intervenção", habilidade: "reconhecer elementos da proposta de intervenção", tags: ["intervencao", "conclusao"], fatos: [
    { lead: "a proposta de intervenção", answer: "a apresentação de encaminhamento para enfrentar o problema discutido", why: "ela fecha o texto de forma propositiva no ENEM" },
    { lead: "o agente da intervenção", answer: "o responsável por executar a ação proposta", why: "ele precisa ser identificado com clareza" },
    { lead: "a ação da intervenção", answer: "o que efetivamente será feito para enfrentar o problema", why: "sem ação a proposta fica vaga" },
    { lead: "o meio da intervenção", answer: "o modo pelo qual a ação será implementada", why: "esse elemento torna a proposta mais concreta" },
    { lead: "o efeito esperado da intervenção", answer: "o resultado pretendido com a medida proposta", why: "ele mostra a finalidade social da conclusão" }
  ] },
  { subtopico: "Planejamento e reescrita", habilidade: "relacionar planejamento, revisao e aprimoramento do texto", tags: ["planejamento", "reescrita"], fatos: [
    { lead: "o planejamento da redação", answer: "a etapa de definir tese, argumentos, repertório e estrutura antes da escrita", why: "planejar reduz dispersão e repetição" },
    { lead: "o esquema de paragrafos", answer: "a organização prévia das partes que sustentarão o texto", why: "ele ajuda a distribuir melhor as ideias" },
    { lead: "a revisao textual", answer: "a releitura voltada a corrigir forma, articulação e clareza argumentativa", why: "ela melhora o desempenho final da redação" },
    { lead: "a reescrita produtiva", answer: "a alteração que aperfeiçoa argumentação, coesão e adequacao linguistica", why: "reescrever e parte do processo de escrever bem" },
    { lead: "a eliminação de generalidades", answer: "o ajuste que torna os argumentos mais específicos e consistentes", why: "afirmações vagas enfraquecem o texto" }
  ] },
  { subtopico: "Desvios frequentes", habilidade: "identificar problemas recorrentes em redacoes", tags: ["desvios", "correcao"], fatos: [
    { lead: "a fuga parcial ao tema", answer: "o desvio em que o texto toca o assunto, mas não enfrenta exatamente o recorte pedido", why: "o autor se aproxima do tema, mas não responde plenamente ao comando" },
    { lead: "a tese vaga", answer: "o posicionamento pouco definido que fragiliza a argumentação", why: "sem clareza de ponto de vista o texto perde direção" },
    { lead: "o repertório improdutivo", answer: "a referência citada sem função real no desenvolvimento", why: "ela não fortalece o argumento nem aprofunda a análise" },
    { lead: "a proposta de intervenção incompleta", answer: "a conclusão que apresenta solução sem detalhar seus elementos essenciais", why: "isso compromete a efetividade da competencia final" },
    { lead: "a revisao crítica do texto", answer: "a leitura final que verifica tema, estrutura, coesão e consistência argumentativa", why: "ela ajuda a detectar e corrigir os erros mais comuns" }
  ] }
];

export const redacao = createPortugueseTopic({
  id: "portugues_redacao",
  serie: 3,
  topico: "Redação",
  prefix: "red",
  base: "ENEM",
  eixo: "Produção textual",
  frente: "Dissertação argumentativa",
  searchAliases: ["redação enem", "dissertação argumentativa", "competencias do enem", "proposta de intervenção", "tese e argumentos"],
  habilidadesBase: [
    "identificar estrutura e projeto de texto dissertativo-argumentativo",
    "delimitar tema, recorte e ponto de vista",
    "organizar argumentos e repertório sociocultural de forma produtiva",
    "avaliar coesão, coerência e competencias do ENEM",
    "construir proposta de intervenção consistente e detalhada"
  ],
  blocos
});
