import { createPortugueseTopic } from "../../../_shared/portugueseTopicFactory.js";

const blocos = [
  { subtopico: "Estrutura dissertativo-argumentativa", habilidade: "identificar a organizacao basica da redacao dissertativo-argumentativa", tags: ["redacao", "estrutura"], fatos: [
    { lead: "a introducao de um texto dissertativo-argumentativo", answer: "a parte que apresenta tema, recorte e encaminhamento da tese", why: "ela abre o projeto argumentativo do texto" },
    { lead: "o desenvolvimento da redacao", answer: "a parte em que os argumentos sao aprofundados e articulados", why: "nela o autor sustenta a tese apresentada" },
    { lead: "a conclusao da redacao", answer: "a parte que retoma a discussao e fecha o percurso argumentativo", why: "ela encerra o texto com sintese e encaminhamento" },
    { lead: "a tese em redacao", answer: "o posicionamento central que orienta toda a argumentacao", why: "sem tese clara o texto perde direcao" },
    { lead: "a progressao textual", answer: "o encadeamento coerente das ideias ao longo das partes do texto", why: "ela evita repeticao e quebra de raciocinio" }
  ] },
  { subtopico: "Tema e recorte", habilidade: "delimitar tema, problema e ponto de vista", tags: ["tema", "recorte"], fatos: [
    { lead: "o tema da proposta", answer: "o assunto central a ser discutido pelo candidato", why: "ele orienta todo o planejamento da redacao" },
    { lead: "o recorte tematico", answer: "a delimitacao especifica do aspecto que sera focalizado dentro do tema amplo", why: "ele ajuda a evitar generalidade excessiva" },
    { lead: "a fuga ao tema", answer: "o afastamento do assunto proposto pela coletanea ou comando", why: "esse erro compromete seriamente a avaliacao do texto" },
    { lead: "a leitura do comando da proposta", answer: "a etapa que define o que realmente precisa ser respondido e defendido", why: "muitos desvios nascem de interpretacao incompleta" },
    { lead: "o ponto de vista na redacao", answer: "a posicao assumida pelo autor diante do problema proposto", why: "ele precisa aparecer de forma clara e sustentavel" }
  ] },
  { subtopico: "Argumentacao", habilidade: "reconhecer tipos de argumento e funcao persuasiva", tags: ["argumentacao", "tese"], fatos: [
    { lead: "um argumento de causa e consequencia", answer: "a justificativa que relaciona um problema a seus efeitos ou origens", why: "essa estrategia organiza encadeamentos logicos frequentes" },
    { lead: "um argumento por exemplificacao", answer: "o recurso de tornar concreta uma ideia abstrata por meio de caso ilustrativo", why: "exemplos fortalecem a defesa da tese" },
    { lead: "um argumento de autoridade", answer: "a referencia a voz legitimada para reforcar o ponto defendido", why: "dados, especialistas e pesquisas podem cumprir esse papel" },
    { lead: "a consistencia argumentativa", answer: "a coerencia entre tese, repertorio e desenvolvimento das ideias", why: "argumentos soltos nao sustentam um bom texto" },
    { lead: "a progressao dos argumentos", answer: "a organizacao das justificativas de modo articulado e nao repetitivo", why: "isso eleva a qualidade do desenvolvimento" }
  ] },
  { subtopico: "Repertorio sociocultural", habilidade: "avaliar uso de repertorio produtivo e pertinente", tags: ["repertorio", "contextualizacao"], fatos: [
    { lead: "o repertorio sociocultural", answer: "a referencia externa usada para ampliar e sustentar a argumentacao", why: "ele pode vir da historia, arte, filosofia, ciencia ou atualidade" },
    { lead: "um repertorio produtivo", answer: "a referencia que se integra de fato a tese e aos argumentos do texto", why: "nao basta citar, e preciso relacionar" },
    { lead: "um repertorio legitimado", answer: "a referencia socialmente reconhecida e pertinente ao contexto da discussao", why: "isso fortalece a credibilidade argumentativa" },
    { lead: "a citacao desconectada", answer: "o uso de repertorio sem articulacao com o problema discutido", why: "essa pratica enfraquece a funcionalidade do texto" },
    { lead: "a funcao do repertorio", answer: "o apoio a analise e a ampliacao da profundidade argumentativa", why: "ele deve servir ao projeto do texto e nao ao exibicionismo" }
  ] },
  { subtopico: "Coesao e articulacao", habilidade: "reconhecer mecanismos de conexao em redacao", tags: ["coesao", "articulacao"], fatos: [
    { lead: "a coesao textual", answer: "o conjunto de mecanismos que liga partes do texto de forma articulada", why: "ela ajuda a construir continuidade de leitura" },
    { lead: "um conectivo conclusivo", answer: "o elemento que sinaliza fechamento ou consequencia do raciocinio", why: "portanto e assim sao exemplos comuns" },
    { lead: "a retomada referencial", answer: "o recurso de recuperar informacoes ja mencionadas para evitar repeticao excessiva", why: "pronomes e substituicoes lexicais ajudam nessa tarefa" },
    { lead: "a progressao por conectores", answer: "a articulacao das ideias por marcas explicitas de relacao logica", why: "isso orienta o leitor no percurso argumentativo" },
    { lead: "a repeticao improdutiva", answer: "o retorno excessivo a mesma formulacao sem avancar a argumentacao", why: "esse problema compromete a fluidez do texto" }
  ] },
  { subtopico: "Coerencia e projeto de texto", habilidade: "avaliar unidade de sentido e consistencia argumentativa", tags: ["coerencia", "projeto"], fatos: [
    { lead: "a coerencia textual", answer: "a unidade de sentido produzida pela articulacao consistente das ideias", why: "sem coerencia o texto perde inteligibilidade" },
    { lead: "a contradicao interna", answer: "o conflito entre afirmacoes do proprio texto que enfraquece a tese", why: "ela rompe a unidade argumentativa" },
    { lead: "o projeto de texto", answer: "o planejamento global que organiza tese, argumentos e encaminhamento final", why: "ele da direcao ao processo de escrita" },
    { lead: "a pertinencia de um paragrafo", answer: "a relacao efetiva dele com a tese e o recorte tematico", why: "todo trecho deve contribuir para o projeto global" },
    { lead: "a unidade argumentativa", answer: "a manutencao do foco tematico e do ponto de vista ao longo do texto", why: "desvios e dispersoes comprometem a qualidade da redacao" }
  ] },
  { subtopico: "Competencias do ENEM", habilidade: "identificar dimensoes avaliativas da redacao do ENEM", tags: ["enem", "competencias"], fatos: [
    { lead: "a competencia 1 do ENEM", answer: "a avaliacao do dominio da modalidade escrita formal da lingua portuguesa", why: "ela observa norma padrao e uso adequado da escrita" },
    { lead: "a competencia 2 do ENEM", answer: "a avaliacao da compreensao da proposta e do desenvolvimento do tema em formato dissertativo-argumentativo", why: "ela verifica aderencia ao tema e ao genero" },
    { lead: "a competencia 3 do ENEM", answer: "a avaliacao da selecao, organizacao e interpretacao de argumentos", why: "ela mede a forca do projeto argumentativo" },
    { lead: "a competencia 4 do ENEM", answer: "a avaliacao do uso de mecanismos linguisticos para articular as partes do texto", why: "ela se relaciona a coesao e articulacao" },
    { lead: "a competencia 5 do ENEM", answer: "a avaliacao da proposta de intervencao para o problema discutido", why: "ela exige fechamento propositivo e respeito aos direitos humanos" }
  ] },
  { subtopico: "Proposta de intervencao", habilidade: "reconhecer elementos da proposta de intervencao", tags: ["intervencao", "conclusao"], fatos: [
    { lead: "a proposta de intervencao", answer: "a apresentacao de encaminhamento para enfrentar o problema discutido", why: "ela fecha o texto de forma propositiva no ENEM" },
    { lead: "o agente da intervencao", answer: "o responsavel por executar a acao proposta", why: "ele precisa ser identificado com clareza" },
    { lead: "a acao da intervencao", answer: "o que efetivamente sera feito para enfrentar o problema", why: "sem acao a proposta fica vaga" },
    { lead: "o meio da intervencao", answer: "o modo pelo qual a acao sera implementada", why: "esse elemento torna a proposta mais concreta" },
    { lead: "o efeito esperado da intervencao", answer: "o resultado pretendido com a medida proposta", why: "ele mostra a finalidade social da conclusao" }
  ] },
  { subtopico: "Planejamento e reescrita", habilidade: "relacionar planejamento, revisao e aprimoramento do texto", tags: ["planejamento", "reescrita"], fatos: [
    { lead: "o planejamento da redacao", answer: "a etapa de definir tese, argumentos, repertorio e estrutura antes da escrita", why: "planejar reduz dispersao e repeticao" },
    { lead: "o esquema de paragrafos", answer: "a organizacao previa das partes que sustentarao o texto", why: "ele ajuda a distribuir melhor as ideias" },
    { lead: "a revisao textual", answer: "a releitura voltada a corrigir forma, articulacao e clareza argumentativa", why: "ela melhora o desempenho final da redacao" },
    { lead: "a reescrita produtiva", answer: "a alteracao que aperfeicoa argumentacao, coesao e adequacao linguistica", why: "reescrever e parte do processo de escrever bem" },
    { lead: "a eliminacao de generalidades", answer: "o ajuste que torna os argumentos mais especificos e consistentes", why: "afirmacoes vagas enfraquecem o texto" }
  ] },
  { subtopico: "Desvios frequentes", habilidade: "identificar problemas recorrentes em redacoes", tags: ["desvios", "correcao"], fatos: [
    { lead: "a fuga parcial ao tema", answer: "o desvio em que o texto toca o assunto, mas nao enfrenta exatamente o recorte pedido", why: "o autor se aproxima do tema, mas nao responde plenamente ao comando" },
    { lead: "a tese vaga", answer: "o posicionamento pouco definido que fragiliza a argumentacao", why: "sem clareza de ponto de vista o texto perde direcao" },
    { lead: "o repertorio improdutivo", answer: "a referencia citada sem funcao real no desenvolvimento", why: "ela nao fortalece o argumento nem aprofunda a analise" },
    { lead: "a proposta de intervencao incompleta", answer: "a conclusao que apresenta solucao sem detalhar seus elementos essenciais", why: "isso compromete a efetividade da competencia final" },
    { lead: "a revisao critica do texto", answer: "a leitura final que verifica tema, estrutura, coesao e consistencia argumentativa", why: "ela ajuda a detectar e corrigir os erros mais comuns" }
  ] }
];

export const redacao = createPortugueseTopic({
  id: "portugues_redacao",
  serie: 3,
  topico: "Redacao",
  prefix: "red",
  base: "ENEM",
  eixo: "Producao textual",
  frente: "Dissertacao argumentativa",
  searchAliases: ["redacao enem", "dissertacao argumentativa", "competencias do enem", "proposta de intervencao", "tese e argumentos"],
  habilidadesBase: [
    "identificar estrutura e projeto de texto dissertativo-argumentativo",
    "delimitar tema, recorte e ponto de vista",
    "organizar argumentos e repertorio sociocultural de forma produtiva",
    "avaliar coesao, coerencia e competencias do ENEM",
    "construir proposta de intervencao consistente e detalhada"
  ],
  blocos
});
