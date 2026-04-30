import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  ARTS_STEM_BUILDERS,
  HUNDRED_QUESTION_MATRIX,
  ARTS_HUNDRED_PLAN
} from "../../../_shared/artsTopicPresets.js";

const blocos = [
  {
    subtopico: "Contexto da modernidade artística",
    habilidade: "identificar-contextos-e-rupturas-da-arte-moderna",
    tags: ["artes", "arte-moderna"],
    fatos: [
      { lead: "o periodo de intensas transformacoes urbanas e técnicas entre séculos XIX e XX", answer: "a modernidade", why: "ela alterou temas, ritmos e linguagens da arte" },
      { lead: "a recusa de copiar fielmente modelos academicos do passado", answer: "a ruptura moderna", why: "ela abriu espaco para novas pesquisas formais" },
      { lead: "a valorizacao da experiencia individual do artista", answer: "a subjetividade moderna", why: "ela ganhou destaque em varias linguagens do periodo" },
      { lead: "a presença de cidade, industria e velocidade no imaginario artístico", answer: "o tema da vida moderna", why: "ele se tornou frequente nas vanguardas" },
      { lead: "a experimentacao formal em lugar da mera imitacao da natureza", answer: "a pesquisa de linguagem", why: "ela é central para compreender a arte moderna" }
    ]
  },
  {
    subtopico: "Impressionismo",
    habilidade: "reconhecer-caracteristicas-e-artistas-do-impressionismo",
    tags: ["artes", "impressionismo"],
    fatos: [
      { lead: "o movimento que buscou registrar luz e instante visual", answer: "o Impressionismo", why: "ele privilegiou percepcao momentanea e pincelada solta" },
      { lead: "a pintura realizada ao ar livre para captar variacoes de luz", answer: "a pintura en plein air", why: "ela aproximou o artista da experiencia imediata da paisagem" },
      { lead: "o artista ligado a serie Impressao nascer do sol", answer: "Claude Monet", why: "ele se tornou nome central do impressionismo" },
      { lead: "a pincelada curta e visível característica do movimento", answer: "a pincelada fragmentada", why: "ela ajuda a construir vibracao luminosa na tela" },
      { lead: "o interesse por cenas cotidianas, lazer e paisagem urbana", answer: "o olhar sobre a vida moderna", why: "esse repertorio diferenciou os impressionistas do academismo" }
    ]
  },
  {
    subtopico: "Pos-impressionismo",
    habilidade: "comparar-dobras-e-desdobramentos-do-impressionismo",
    tags: ["artes", "pos-impressionismo"],
    fatos: [
      { lead: "o conjunto de pesquisas que ampliou ou tensionou o impressionismo", answer: "o Pos-impressionismo", why: "ele não foi um bloco único, mas um campo de desdobramentos" },
      { lead: "o uso expressivo e emocional de cor intensa nas obras de Van Gogh", answer: "a cor subjetiva", why: "ela rompe com a mera observação objetiva do visível" },
      { lead: "a construção da forma por planos e estrutura em Cezanne", answer: "a sintese geometrica", why: "ela influenciou fortemente movimentos posteriores" },
      { lead: "a pintura de Gauguin marcada por areas planas e simbolismo", answer: "o sintetismo", why: "ela buscou simplificacao formal e valor simbolico" },
      { lead: "a pesquisa de pontos cromaticos de Seurat", answer: "o pontilhismo", why: "ela combinou cor e método de observação óptica" }
    ]
  },
  {
    subtopico: "Expressionismo e Fauvismo",
    habilidade: "analisar-caminhos-modernos-de-cor-e-expressividade",
    tags: ["artes", "expressionismo"],
    fatos: [
      { lead: "o movimento que deformou formas para intensificar emocao e tensao", answer: "o Expressionismo", why: "ele priorizou interioridade e dramaticidade" },
      { lead: "o grupo que explorou cor intensa e arbitraria no inicio do seculo XX", answer: "o Fauvismo", why: "ele libertou a cor de função puramente naturalista" },
      { lead: "a obra O grito associada a angustia existencial moderna", answer: "Edvard Munch", why: "sua produção se tornou referencia expressionista" },
      { lead: "o artista ligado ao uso decorativo e vibrante da cor no Fauvismo", answer: "Henri Matisse", why: "ele se destacou por simplificacao formal e cromatismo livre" },
      { lead: "a distorcao intencional de forma e cor para expressar sentimentos", answer: "a expressividade moderna", why: "ela diferencia esses movimentos de uma arte apenas descritiva" }
    ]
  },
  {
    subtopico: "Cubismo",
    habilidade: "identificar-principios-do-cubismo-e-suas-inovacoes",
    tags: ["artes", "cubismo"],
    fatos: [
      { lead: "o movimento que fragmentou objetos em multiplos pontos de vista", answer: "o Cubismo", why: "ele questionou a perspectiva tradicional unica" },
      { lead: "a fase inicial mais contida e analitica do movimento", answer: "o Cubismo analitico", why: "ela decompoe formas em estruturas complexas" },
      { lead: "a fase com colagens e planos mais sinteticos e decorativos", answer: "o Cubismo sintetico", why: "ela simplifica e recombina elementos visuais" },
      { lead: "o artista associado a Les Demoiselles d Avignon", answer: "Pablo Picasso", why: "ele é uma das figuras centrais do cubismo" },
      { lead: "a exploracao de formas geometricas na representação de objetos", answer: "a geometrizacao da forma", why: "ela é um principio essencial do movimento" }
    ]
  },
  {
    subtopico: "Futurismo, Dadaismo e ruptura",
    habilidade: "compreender-vanguardas-de-choque-e-ruptura-cultural",
    tags: ["artes", "vanguardas"],
    fatos: [
      { lead: "o movimento que exaltou velocidade, maquina e dinamismo urbano", answer: "o Futurismo", why: "ele celebrou energia e movimento da vida moderna" },
      { lead: "o movimento de provocacao que ironizou a ideia tradicional de arte", answer: "o Dadaismo", why: "ele reagiu ao absurdo historico da guerra e da cultura burguesa" },
      { lead: "o uso de objetos cotidianos deslocados para o campo artístico", answer: "o ready-made", why: "ele ampliou radicalmente a nocao de obra de arte" },
      { lead: "o artista associado a Fonte e aos ready-mades", answer: "Marcel Duchamp", why: "sua produção redefiniu os limites da arte moderna" },
      { lead: "a intencao de escandalizar e interromper expectativas do público", answer: "a provocacao vanguardista", why: "ela foi um recurso importante desses movimentos" }
    ]
  },
  {
    subtopico: "Surrealismo",
    habilidade: "interpretar-relacoes-entre-imaginacao-inconsciente-e-imagem",
    tags: ["artes", "surrealismo"],
    fatos: [
      { lead: "o movimento que explorou sonho, automatismo e inconsciente", answer: "o Surrealismo", why: "ele buscou superar a logica racional da representação" },
      { lead: "a influência das ideias de Freud sobre desejos e inconsciente", answer: "a base psiquica do surrealismo", why: "ela ajudou a orientar imagens estranhas e oniricas" },
      { lead: "o artista de imagens delirantes como relogios derretidos", answer: "Salvador Dali", why: "ele se tornou um dos nomes mais conhecidos do movimento" },
      { lead: "a criação de imagens improvaveis e ilogicas em uma mesma cena", answer: "a associacao onirica", why: "ela rompe com o funcionamento comum da realidade visual" },
      { lead: "a pratica de deixar imagens surgirem sem controle racional total", answer: "o automatismo", why: "ele procurava aproximar arte e inconsciente" }
    ]
  },
  {
    subtopico: "Abstracionismo",
    habilidade: "diferenciar-caminhos-nao-figurativos-da-arte-moderna",
    tags: ["artes", "abstracionismo"],
    fatos: [
      { lead: "a arte que não depende de representar objetos reconheciveis", answer: "o Abstracionismo", why: "ela organiza formas, cores e linhas como valores autonomos" },
      { lead: "a vertente ligada a emocao e liberdade do gesto e da cor", answer: "a abstracao lirica", why: "ela privilegia expressividade e subjetividade" },
      { lead: "a vertente baseada em ordem, geometria e construção racional", answer: "a abstracao geometrica", why: "ela valoriza regularidade e estrutura" },
      { lead: "o artista frequentemente lembrado como pioneiro da abstracao", answer: "Kandinsky", why: "ele associou musica, espiritualidade e linguagem não figurativa" },
      { lead: "a organização da obra por relações de forma e cor independentes do objeto", answer: "a autonomia visual", why: "ela é central para compreender a pintura abstrata" }
    ]
  },
  {
    subtopico: "Modernismo brasileiro",
    habilidade: "reconhecer-especificidades-da-modernidade-artistica-no-brasil",
    tags: ["artes", "modernismo-brasileiro"],
    fatos: [
      { lead: "o evento simbolico de renovação artística ocorrido em 1922", answer: "a Semana de Arte Moderna", why: "ela se tornou marco do modernismo brasileiro" },
      { lead: "a artista ligada a Abaporu e a experimentacao modernista", answer: "Tarsila do Amaral", why: "sua obra e central para a arte moderna no Brasil" },
      { lead: "a proposta de devorar referencias externas e recria-las localmente", answer: "a antropofagia", why: "ela formulou uma leitura crítica da cultura brasileira" },
      { lead: "a valorizacao de temas nacionais e linguagem renovada", answer: "o projeto modernista brasileiro", why: "ele buscou reinterpretar identidade e cultura do país" },
      { lead: "a ruptura com modelos academicos em favor de experimentacao", answer: "a renovação estética de 1922", why: "ela ampliou repertorios artístico e cultural no Brasil" }
    ]
  },
  {
    subtopico: "Arquitetura e design modernos",
    habilidade: "relacionar-funcao-forma-e-modernizacao-em-arquitetura-e-design",
    tags: ["artes", "arquitetura-moderna"],
    fatos: [
      { lead: "a arquitetura que valorizou funcionalidade, linhas simples e novos materiais", answer: "a arquitetura moderna", why: "ela redefiniu relação entre forma, uso e técnica" },
      { lead: "a escola alema associada a design, arte e industria", answer: "a Bauhaus", why: "ela aproximou criação artística e produção moderna" },
      { lead: "o uso de concreto armado, vidro e aco em projetos modernos", answer: "a linguagem construtiva moderna", why: "ela favoreceu limpeza formal e novas solucoes espaciais" },
      { lead: "o arquiteto frequentemente ligado a lema menos e mais", answer: "Mies van der Rohe", why: "ele é referencia de sintese formal moderna" },
      { lead: "a aproximacao entre estética, função e vida cotidiana no design", answer: "o design moderno", why: "ele buscou integrar beleza, uso e reproducao industrial" }
    ]
  }
];

const questoes = buildPlannedQuestions({
  prefix: "am",
  serie: [2],
  materia: "Artes",
  topico: "Arte Moderna",
  blocos,
  stemBuilders: ARTS_STEM_BUILDERS,
  globalMatrix: HUNDRED_QUESTION_MATRIX
});

export const arteModerna = {
  id: "artes_arte_moderna",
  materia: "Artes",
  serie: [2],
  topico: "Arte Moderna",
  metadados: {
    disciplinaId: "artes",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Artes",
    frente: "Rupturas e vanguardas da modernidade",
    searchAliases: ["arte moderna", "vanguardas europeias", "modernismo", "cubismo e surrealismo", "semana de 22"],
    subtopicosBase: [
      "Contexto da modernidade artística",
      "Impressionismo",
      "Pos-impressionismo",
      "Expressionismo e Fauvismo",
      "Cubismo",
      "Futurismo, Dadaismo e ruptura",
      "Surrealismo",
      "Abstracionismo",
      "Modernismo brasileiro",
      "Arquitetura e design modernos"
    ],
    habilidadesBase: [
      "identificar contextos e rupturas da arte moderna",
      "reconhecer características e artistas das principais vanguardas",
      "comparar diferentes caminhos da pintura e da escultura modernas",
      "relacionar modernismo brasileiro a debates de identidade cultural",
      "analisar a presença da modernidade em arquitetura e design"
    ],
    auditado: true,
    auditadoEm: "2026-04-11",
    planejamentoQuestoes: ARTS_HUNDRED_PLAN
  },
  questoes
};
