import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  ARTS_STEM_BUILDERS,
  HUNDRED_QUESTION_MATRIX,
  ARTS_HUNDRED_PLAN
} from "../../../_shared/artsTopicPresets.js";

const blocos = [
  {
    subtopico: "Arte da Antiguidade Oriental",
    habilidade: "identificar-marcos-da-arte-antiga-e-classica",
    tags: ["artes", "antiguidade-oriental"],
    fatos: [
      {
        lead: "a civilizacao conhecida por piramides e arte funeraria monumental",
        answer: "o Egito antigo",
        why: "suas obras articulavam religiao, poder e permanencia"
      },
      {
        lead: "a representacao frontal e hierarquizada muito comum no Egito",
        answer: "a lei da frontalidade",
        why: "ela organizava corpos e status sociais nas imagens"
      },
      {
        lead: "a construcao funeraria monumental de pedra associada aos faraos",
        answer: "a piramide",
        why: "ela sintetiza poder politico e funcao religiosa"
      },
      {
        lead: "a escrita visual usada em templos e tumbas egipcias",
        answer: "o hieroglifo",
        why: "ele unia linguagem, imagem e memoria sagrada"
      },
      {
        lead: "a producao artistica ligada a ritos e permanencia apos a morte",
        answer: "a arte funeraria",
        why: "ela orientava grande parte da arte egipcia"
      }
    ]
  },
  {
    subtopico: "Arte Grega",
    habilidade: "identificar-marcos-da-arte-antiga-e-classica",
    tags: ["artes", "grecia"],
    fatos: [
      {
        lead: "a busca de proporcao e ideal de beleza na escultura antiga",
        answer: "a arte grega",
        why: "ela valorizou equilibrio, corpo humano e harmonia"
      },
      {
        lead: "a escultura de postura equilibrada com apoio em uma perna",
        answer: "o contrapposto",
        why: "ele trouxe naturalidade ao corpo representado"
      },
      {
        lead: "o edificio religioso com colunas e frontao triangular",
        answer: "o templo grego",
        why: "ele se tornou referencia da arquitetura classica"
      },
      {
        lead: "a ordem arquitetonica de capitel simples e aspecto robusto",
        answer: "a ordem dorica",
        why: "ela e uma das principais ordens da arquitetura grega"
      },
      {
        lead: "a valorizacao do corpo humano como medida de beleza",
        answer: "o ideal classico",
        why: "esse principio marcou escultura e pensamento artistico gregos"
      }
    ]
  },
  {
    subtopico: "Arte Romana",
    habilidade: "reconhecer-diferencas-e-continuidade-entre-grecia-e-roma",
    tags: ["artes", "roma"],
    fatos: [
      {
        lead: "a civilizacao que absorveu e adaptou referencias gregas em larga escala",
        answer: "Roma",
        why: "sua arte combinou heranca grega e pragmatismo imperial"
      },
      {
        lead: "a representacao escultorica mais fiel a feicoes individuais",
        answer: "o retrato romano",
        why: "ele valorizava memoria politica e realismo"
      },
      {
        lead: "a grande construcao de espetaculos publicos da Roma antiga",
        answer: "o anfiteatro",
        why: "ele articulava arquitetura, politica e vida urbana"
      },
      {
        lead: "o uso de arcos, cupulas e engenharia em edifícios monumentais",
        answer: "a arquitetura romana",
        why: "ela ampliou possibilidades tecnicas da construcao antiga"
      },
      {
        lead: "a pintura mural preservada em cidades como Pompeia",
        answer: "o afresco romano",
        why: "ele revela cotidiano, ilusao espacial e decoracao domestica"
      }
    ]
  },
  {
    subtopico: "Renascimento Italiano",
    habilidade: "compreender-caracteristicas-do-renascimento-nas-artes",
    tags: ["artes", "renascimento"],
    fatos: [
      {
        lead: "o movimento artistico que retomou referencias classicas e humanistas",
        answer: "o Renascimento",
        why: "ele valorizou observacao, perspectiva e racionalidade"
      },
      {
        lead: "a tecnica que organiza profundidade com base matematica",
        answer: "a perspectiva linear",
        why: "ela foi central na pintura renascentista"
      },
      {
        lead: "a valorizacao do ser humano como centro da experiencia cultural",
        answer: "o humanismo",
        why: "ele marcou temas e escolhas formais do periodo"
      },
      {
        lead: "a representacao precisa do corpo com estudo anatomico",
        answer: "o naturalismo renascentista",
        why: "ele aproximou arte, ciencia e observacao"
      },
      {
        lead: "a cidade italiana frequentemente associada ao inicio do movimento",
        answer: "Florença",
        why: "ela concentrou mecenas, artistas e inovacoes artisticas"
      }
    ]
  },
  {
    subtopico: "Grandes Artistas do Renascimento",
    habilidade: "identificar-artistas-obras-e-contribuicoes-do-renascimento",
    tags: ["artes", "artistas-renascentistas"],
    fatos: [
      {
        lead: "o artista associado a Mona Lisa e A Ultima Ceia",
        answer: "Leonardo da Vinci",
        why: "ele reuniu pintura, ciencia e investigacao visual"
      },
      {
        lead: "o artista de David e do teto da Capela Sistina",
        answer: "Michelangelo",
        why: "sua obra marcou pintura, escultura e monumentalidade"
      },
      {
        lead: "o pintor lembrado por composicoes equilibradas e Madonas",
        answer: "Rafael",
        why: "ele se destacou pela harmonia e clareza formal"
      },
      {
        lead: "a obra de Leonardo conhecida pelo sorriso enigmatico",
        answer: "a Mona Lisa",
        why: "ela se tornou uma das pinturas mais reconhecidas do mundo"
      },
      {
        lead: "a escultura de heroi biblico esculpida por Michelangelo",
        answer: "o David",
        why: "ela sintetiza virtuosismo anatomico e ideal classico"
      }
    ]
  },
  {
    subtopico: "Barroco Europeu",
    habilidade: "analisar-dramaticidade-e-efeitos-visuais-do-barroco",
    tags: ["artes", "barroco"],
    fatos: [
      {
        lead: "o estilo artistico marcado por dramatizacao e movimento",
        answer: "o Barroco",
        why: "ele intensificou emocao, contraste e teatralidade"
      },
      {
        lead: "a tecnica de contraste intenso entre luz e sombra no Barroco",
        answer: "o chiaroscuro",
        why: "ela reforca volume e tensao dramatica"
      },
      {
        lead: "o pintor italiano conhecido por cenas dramaticas e forte luz",
        answer: "Caravaggio",
        why: "ele e uma das referencias centrais do Barroco"
      },
      {
        lead: "a ornamentacao abundante e dinamica em igrejas barrocas",
        answer: "a exuberancia decorativa",
        why: "ela contribui para impacto emocional e visual"
      },
      {
        lead: "a relacao entre o Barroco e a afirmacao do catolicismo apos a Reforma",
        answer: "a Contrarreforma",
        why: "ela ajudou a orientar usos e sentidos da arte barroca"
      }
    ]
  },
  {
    subtopico: "Neoclassicismo e retorno ao antigo",
    habilidade: "relacionar-retomadas-classicas-a-diferentes-periodos",
    tags: ["artes", "neoclassicismo"],
    fatos: [
      {
        lead: "o movimento que retomou sobriedade e referencia greco-romana no seculo XVIII",
        answer: "o Neoclassicismo",
        why: "ele reagiu aos excessos ornamentais do Rococo"
      },
      {
        lead: "a valorizacao de ordem, clareza e equilibrio em oposicao ao excesso",
        answer: "a estetica neoclassica",
        why: "ela se aproxima de principios da Antiguidade"
      },
      {
        lead: "o pintor associado a composicoes historicas e civicas no Neoclassicismo",
        answer: "Jacques-Louis David",
        why: "ele uniu arte, politica e rigor formal"
      },
      {
        lead: "o tema heroico e moralizante frequente no Neoclassicismo",
        answer: "a virtude civica",
        why: "ela se conectava a valores iluministas e republicanos"
      },
      {
        lead: "a retomada de colunas, simetria e frontoes na arquitetura posterior",
        answer: "a linguagem classica reatualizada",
        why: "ela mostra a permanencia dos modelos antigos"
      }
    ]
  },
  {
    subtopico: "Arquitetura e escultura classicas",
    habilidade: "identificar-elementos-da-arquitetura-e-da-escultura-classicas",
    tags: ["artes", "arquitetura-classica"],
    fatos: [
      {
        lead: "a ordem de capitel com volutas em espiral",
        answer: "a ordem ionica",
        why: "ela se diferencia das demais por elegancia e detalhe"
      },
      {
        lead: "a ordem arquitetonica mais ornamentada do repertorio grego",
        answer: "a ordem corintia",
        why: "seu capitel decorado tornou-se bastante reconhecivel"
      },
      {
        lead: "a representacao escultorica voltada a proporcao e equilibrio corporal",
        answer: "a escultura classica",
        why: "ela buscou idealizar o corpo humano"
      },
      {
        lead: "a repeticao de colunas e simetria em edificios classicos",
        answer: "a composicao arquitetonica regular",
        why: "ela reforca ordem e monumentalidade"
      },
      {
        lead: "o uso da pedra e do marmore em obras de prestigio",
        answer: "a materialidade nobre classica",
        why: "esses materiais foram valorizados pela durabilidade e acabamento"
      }
    ]
  },
  {
    subtopico: "Temas religiosos e mitologicos",
    habilidade: "interpretar-temas-e-funcoes-da-arte-em-periodos-classicos",
    tags: ["artes", "temas-classicos"],
    fatos: [
      {
        lead: "o conjunto de narrativas sobre deuses e herois da cultura grega e romana",
        answer: "a mitologia classica",
        why: "ela inspirou grande parte da arte antiga e posterior"
      },
      {
        lead: "a representacao de episodios biblicos em pintura e escultura europeias",
        answer: "o tema religioso cristao",
        why: "ele foi central em varios periodos artisticos"
      },
      {
        lead: "o uso da arte para ensinar, celebrar ou reforcar crencas",
        answer: "a funcao simbolica da imagem",
        why: "muitas obras atuavam para alem do valor decorativo"
      },
      {
        lead: "a cena artistica voltada a herois, deuses e feitos exemplares",
        answer: "o tema mitologico",
        why: "ele permitia narrativas de poder, paixao e moralidade"
      },
      {
        lead: "a relacao entre patronos, religiao e producao artistica",
        answer: "o mecenato institucional",
        why: "igreja e elites financiaram muitas obras historicas"
      }
    ]
  },
  {
    subtopico: "Legados da arte classica",
    habilidade: "avaliar-a-permanencia-da-arte-classica-na-cultura-ocidental",
    tags: ["artes", "legado-classico"],
    fatos: [
      {
        lead: "a permanencia de colunas, frontoes e simetria em edificios posteriores",
        answer: "o legado arquitetonico classico",
        why: "ele reaparece em varios momentos da historia da arte"
      },
      {
        lead: "a valorizacao da proporcao e do equilibrio herdada da Antiguidade",
        answer: "um principio classico duradouro",
        why: "ele influenciou pintura, escultura e arquitetura"
      },
      {
        lead: "a retomada periodica de modelos gregos e romanos em outras epocas",
        answer: "a reatualizacao do classico",
        why: "o passado antigo continuou servindo de referencia cultural"
      },
      {
        lead: "a presenca de mitos, herois e temas antigos em obras modernas",
        answer: "a sobrevivencia iconografica classica",
        why: "essas imagens seguem ativas na cultura visual"
      },
      {
        lead: "a influencia da arte classica na formacao do olhar ocidental",
        answer: "um legado estetico e historico amplo",
        why: "ela ajudou a definir criterios de beleza, ordem e monumentalidade"
      }
    ]
  }
];

const questoes = buildPlannedQuestions({
  prefix: "hac",
  serie: [1],
  materia: "Artes",
  topico: "Historia da Arte Classica",
  blocos,
  stemBuilders: ARTS_STEM_BUILDERS,
  globalMatrix: HUNDRED_QUESTION_MATRIX
});

export const historiaDaArteClassica = {
  id: "artes_historia_da_arte_classica",
  materia: "Artes",
  serie: [1],
  topico: "Historia da Arte Classica",
  metadados: {
    disciplinaId: "artes",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Artes",
    frente: "Historia da arte",
    searchAliases: [
      "historia da arte classica",
      "arte antiga",
      "arte grega e romana",
      "renascimento",
      "barroco"
    ],
    subtopicosBase: [
      "Arte da Antiguidade Oriental",
      "Arte Grega",
      "Arte Romana",
      "Renascimento Italiano",
      "Grandes Artistas do Renascimento",
      "Barroco Europeu",
      "Neoclassicismo e retorno ao antigo",
      "Arquitetura e escultura classicas",
      "Temas religiosos e mitologicos",
      "Legados da arte classica"
    ],
    habilidadesBase: [
      "identificar marcos da arte antiga e classica",
      "reconhecer caracteristicas de Grecia, Roma, Renascimento e Barroco",
      "analisar artistas, obras e tecnicas de periodos classicos",
      "interpretar temas religiosos, mitologicos e civicos na arte",
      "avaliar permanencias da arte classica na cultura visual"
    ],
    auditado: true,
    auditadoEm: "2026-04-11",
    planejamentoQuestoes: ARTS_HUNDRED_PLAN
  },
  questoes
};
