import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  ARTS_STEM_BUILDERS,
  HUNDRED_QUESTION_MATRIX,
  ARTS_HUNDRED_PLAN
} from "../../../_shared/artsTopicPresets.js";

const blocos = [
  {
    subtopico: "Renascimento e Humanismo",
    habilidade: "identificar-movimentos-artisticos-e-seus-principios-centrais",
    tags: ["artes", "movimentos-artisticos"],
    fatos: [
      { lead: "o movimento que retomou o mundo classico e o valor do humano", answer: "o Renascimento", why: "ele uniu racionalidade, observacao e referencias antigas" },
      { lead: "a valorizacao do ser humano e da experiencia terrena nas artes", answer: "o Humanismo", why: "ele redefiniu temas e enfoques da representacao" },
      { lead: "a tecnica de profundidade matematica tipica do periodo", answer: "a perspectiva linear", why: "ela ampliou a ilusao espacial da pintura" },
      { lead: "a busca por equilibrio e proporcao nas obras", answer: "a harmonia classica", why: "ela foi central para o ideal renascentista" },
      { lead: "a articulacao entre arte, ciencia e anatomia na imagem", answer: "o naturalismo renascentista", why: "ele aproximou observacao e representacao" }
    ]
  },
  {
    subtopico: "Barroco",
    habilidade: "identificar-movimentos-artisticos-e-seus-principios-centrais",
    tags: ["artes", "barroco"],
    fatos: [
      { lead: "o movimento de dramaticidade, contraste e exuberancia visual", answer: "o Barroco", why: "ele valorizou emocao e teatralidade" },
      { lead: "o contraste intenso entre luz e sombra em pinturas barrocas", answer: "o chiaroscuro", why: "ele intensifica drama e modelagem" },
      { lead: "a composicao repleta de movimento e diagonais", answer: "o dinamismo barroco", why: "ele rompeu com a serenidade classica" },
      { lead: "a ornamentacao rica em igrejas e espacos religiosos", answer: "a exuberancia decorativa", why: "ela reforca impacto sensorial e simbolico" },
      { lead: "a associacao historica do estilo a defesa do catolicismo", answer: "a Contrarreforma", why: "ela ajudou a orientar usos politicos e religiosos da arte" }
    ]
  },
  {
    subtopico: "Romantismo",
    habilidade: "comparar-diferentes-movimentos-pelo-tema-e-pela-expressao",
    tags: ["artes", "romantismo"],
    fatos: [
      { lead: "o movimento que valorizou emocao, imaginacao e subjetividade", answer: "o Romantismo", why: "ele se opos a rigidez racional de outras correntes" },
      { lead: "a preferencia por cenas dramaticas, historicas e da natureza", answer: "a sensibilidade romantica", why: "ela buscou intensidade emocional e imaginativa" },
      { lead: "a exaltacao do individuo e da experiencia interior", answer: "o subjetivismo romantico", why: "ele e uma marca importante do movimento" },
      { lead: "a natureza apresentada como grandiosa e emocionalmente carregada", answer: "o sublime romantico", why: "ele combina beleza, medo e vastidao" },
      { lead: "a ligacao entre arte e afirmacao de identidades nacionais no seculo XIX", answer: "o nacionalismo romantico", why: "ele aparece em muitos contextos culturais do periodo" }
    ]
  },
  {
    subtopico: "Realismo",
    habilidade: "comparar-diferentes-movimentos-pelo-tema-e-pela-expressao",
    tags: ["artes", "realismo"],
    fatos: [
      { lead: "o movimento que voltou a olhar criticamente para o cotidiano social", answer: "o Realismo", why: "ele buscou representar a vida concreta sem idealizacao" },
      { lead: "a atencao a trabalhadores, pobreza e cenas comuns", answer: "o tema social realista", why: "ele aproximou a arte de questoes historicas e materiais" },
      { lead: "a recusa do sentimentalismo excessivo do romantismo", answer: "a objetividade realista", why: "ela buscou observacao mais direta da realidade" },
      { lead: "a representacao de pessoas comuns como assunto digno de arte", answer: "a valorizacao do cotidiano", why: "ela ampliou o repertorio de temas artisticos" },
      { lead: "a relacao entre arte e critica da sociedade burguesa", answer: "a perspectiva realista", why: "ela tornou a obra um campo de observacao social" }
    ]
  },
  {
    subtopico: "Impressionismo e Pos-impressionismo",
    habilidade: "comparar-diferentes-movimentos-pelo-tema-e-pela-expressao",
    tags: ["artes", "impressionismo"],
    fatos: [
      { lead: "o movimento interessado em luz instantanea e percepcao visual", answer: "o Impressionismo", why: "ele renovou cor, pincelada e relacao com o tempo" },
      { lead: "o conjunto de pesquisas que ampliou e tensionou o impressionismo", answer: "o Pos-impressionismo", why: "ele abriu caminhos para novas linguagens modernas" },
      { lead: "a pintura ao ar livre para captar mudancas atmosfericas", answer: "o en plein air", why: "ele ajudou a consolidar a experiencia impressionista" },
      { lead: "a utilizacao emotiva e intensa da cor por Van Gogh", answer: "a subjetividade cromatica", why: "ela e uma marca pos-impressionista" },
      { lead: "a construcao estrutural da forma investigada por Cezanne", answer: "a organizacao geometrica da pintura", why: "ela influenciou fortemente o cubismo" }
    ]
  },
  {
    subtopico: "Expressionismo e Fauvismo",
    habilidade: "comparar-diferentes-movimentos-pelo-tema-e-pela-expressao",
    tags: ["artes", "expressionismo"],
    fatos: [
      { lead: "o movimento que enfatizou tensao emocional e deformacao expressiva", answer: "o Expressionismo", why: "ele intensificou estados interiores e dramaticidade" },
      { lead: "o movimento de cor pura e intensa sem compromisso naturalista", answer: "o Fauvismo", why: "ele libertou a cor como valor autonomo" },
      { lead: "a distorcao das formas para expressar sofrimento ou inquietacao", answer: "a expressividade moderna", why: "ela foi central ao expressionismo" },
      { lead: "a cor usada por sua forca emotiva mais que por fidelidade ao visivel", answer: "a cor arbitraria", why: "ela e um recurso marcante do Fauvismo" },
      { lead: "a atmosfera de ansiedade social e existencial do periodo", answer: "o clima expressionista", why: "ele ajudou a moldar temas e estilos do movimento" }
    ]
  },
  {
    subtopico: "Cubismo e Futurismo",
    habilidade: "reconhecer-vanguardas-do-inicio-do-seculo-xx",
    tags: ["artes", "cubismo-futurismo"],
    fatos: [
      { lead: "o movimento que fragmentou a forma em varios pontos de vista", answer: "o Cubismo", why: "ele modificou profundamente a representacao do espaco" },
      { lead: "o movimento que exaltou velocidade, maquina e energia urbana", answer: "o Futurismo", why: "ele celebrou dinamismo e modernizacao" },
      { lead: "a decomposicao analitica do objeto em planos", answer: "a forma cubista", why: "ela rompe a unidade tradicional da perspectiva" },
      { lead: "a tentativa de sugerir deslocamento e repeticao de gesto", answer: "o dinamismo futurista", why: "ele traduz visualmente a ideia de velocidade" },
      { lead: "a relacao desses movimentos com a ideia de ruptura e vanguarda", answer: "a experimentacao radical", why: "ela define o papel historico dessas correntes" }
    ]
  },
  {
    subtopico: "Dadaismo e Surrealismo",
    habilidade: "reconhecer-vanguardas-do-inicio-do-seculo-xx",
    tags: ["artes", "dadaismo-surrealismo"],
    fatos: [
      { lead: "o movimento que ironizou a arte e atacou convencoes culturais", answer: "o Dadaismo", why: "ele usou provocacao e nonsense como estrategia" },
      { lead: "o movimento que explorou sonho e inconsciente", answer: "o Surrealismo", why: "ele aproximou arte, desejo e imaginacao" },
      { lead: "o objeto cotidiano deslocado para o campo artistico", answer: "o ready-made", why: "ele redefiniu a nocao de autoria e obra" },
      { lead: "a criacao de imagens improvaveis e ilogicas", answer: "a associacao surreal", why: "ela rompe com a ordem racional do visivel" },
      { lead: "a vontade de desmontar certezas sobre o que pode ser arte", answer: "a critica de linguagem", why: "ela une Dadaismo e varias pesquisas modernas" }
    ]
  },
  {
    subtopico: "Abstracionismo e construtivismo",
    habilidade: "diferenciar-correntes-abstratas-e-construtivas",
    tags: ["artes", "abstracao"],
    fatos: [
      { lead: "a arte que se organiza sem depender de figuras reconheciveis", answer: "o Abstracionismo", why: "ela prioriza cor, linha, ritmo e estrutura" },
      { lead: "a corrente abstrata de base racional e geometrica", answer: "a abstracao geometrica", why: "ela valoriza construcao e regularidade formal" },
      { lead: "a corrente abstrata ligada a gesto, cor e emocao", answer: "a abstracao lirica", why: "ela enfatiza liberdade expressiva e subjetividade" },
      { lead: "a arte orientada por organizacao racional e funcao social da forma", answer: "o construtivismo", why: "ele aproximou arte, projeto e sociedade" },
      { lead: "a autonomia de linha, cor e plano sem referencia figurativa", answer: "a linguagem nao figurativa", why: "ela esta na base de varias vertentes abstratas" }
    ]
  },
  {
    subtopico: "Modernismo brasileiro e desdobramentos",
    habilidade: "relacionar-movimentos-internacionais-a-leituras-brasileiras",
    tags: ["artes", "modernismo-brasileiro"],
    fatos: [
      { lead: "o marco de renovacao artistica realizado em Sao Paulo em 1922", answer: "a Semana de Arte Moderna", why: "ela consolidou simbolicamente o modernismo no Brasil" },
      { lead: "a proposta de reelaborar referencias estrangeiras a partir da cultura local", answer: "a antropofagia", why: "ela formulou estrategia critica de criacao brasileira" },
      { lead: "a relacao entre vanguardas europeias e temas nacionais no Brasil", answer: "a adaptacao modernista brasileira", why: "ela nao copiou modelos externos de forma passiva" },
      { lead: "a busca de identidade cultural por meio da experimentacao formal", answer: "o projeto modernista", why: "ele articulou arte, linguagem e interpretacao do pais" },
      { lead: "a sobrevivencia de principios modernos em varias linguagens posteriores", answer: "o legado das vanguardas", why: "ele continua influenciando artistas contemporaneos" }
    ]
  }
];

const questoes = buildPlannedQuestions({
  prefix: "mva",
  serie: [2],
  materia: "Artes",
  topico: "Movimentos Artisticos",
  blocos,
  stemBuilders: ARTS_STEM_BUILDERS,
  globalMatrix: HUNDRED_QUESTION_MATRIX
});

export const movimentosArtisticos = {
  id: "artes_movimentos_artisticos",
  materia: "Artes",
  serie: [2],
  topico: "Movimentos Artisticos",
  metadados: {
    disciplinaId: "artes",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Artes",
    frente: "Panorama historico de movimentos artisticos",
    searchAliases: ["movimentos artisticos", "estilos artisticos", "vanguardas", "barroco e romantismo", "surrealismo e cubismo"],
    subtopicosBase: [
      "Renascimento e Humanismo",
      "Barroco",
      "Romantismo",
      "Realismo",
      "Impressionismo e Pos-impressionismo",
      "Expressionismo e Fauvismo",
      "Cubismo e Futurismo",
      "Dadaismo e Surrealismo",
      "Abstracionismo e construtivismo",
      "Modernismo brasileiro e desdobramentos"
    ],
    habilidadesBase: [
      "identificar movimentos artisticos e seus principios centrais",
      "comparar estilos por linguagem, tema e contexto historico",
      "reconhecer vanguardas do seculo XX e suas rupturas",
      "relacionar movimentos internacionais a desdobramentos brasileiros",
      "interpretar permanencias e mudancas na historia da arte"
    ],
    auditado: true,
    auditadoEm: "2026-04-11",
    planejamentoQuestoes: ARTS_HUNDRED_PLAN
  },
  questoes
};
