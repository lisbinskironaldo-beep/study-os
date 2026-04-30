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
        why: "suas obras articulavam religião, poder e permanencia"
      },
      {
        lead: "a representação frontal e hierarquizada muito comum no Egito",
        answer: "a lei da frontalidade",
        why: "ela organizava corpos e status sociais nas imagens"
      },
      {
        lead: "a construção funeraria monumental de pedra associada aos faraos",
        answer: "a piramide",
        why: "ela sintetiza poder político e função religiosa"
      },
      {
        lead: "a escrita visual usada em templos e tumbas egipcias",
        answer: "o hieroglifo",
        why: "ele unia linguagem, imagem e memória sagrada"
      },
      {
        lead: "a produção artística ligada a ritos e permanencia após a morte",
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
        lead: "a busca de proporção e ideal de beleza na escultura antiga",
        answer: "a arte grega",
        why: "ela valorizou equilíbrio, corpo humano e harmonia"
      },
      {
        lead: "a escultura de postura equilibrada com apoio em uma perna",
        answer: "o contrapposto",
        why: "ele trouxe naturalidade ao corpo representado"
      },
      {
        lead: "o edificio religioso com colunas e frontao triangular",
        answer: "o templo grego",
        why: "ele se tornou referencia da arquitetura clássica"
      },
      {
        lead: "a ordem arquitetonica de capitel simples e aspecto robusto",
        answer: "a ordem dorica",
        why: "ela é uma das principais ordens da arquitetura grega"
      },
      {
        lead: "a valorizacao do corpo humano como medida de beleza",
        answer: "o ideal classico",
        why: "esse principio marcou escultura e pensamento artístico gregos"
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
        lead: "a representação escultorica mais fiel a feicoes individuais",
        answer: "o retrato romano",
        why: "ele valorizava memória politica e realismo"
      },
      {
        lead: "a grande construção de espetaculos publicos da Roma antiga",
        answer: "o anfiteatro",
        why: "ele articulava arquitetura, politica e vida urbana"
      },
      {
        lead: "o uso de arcos, cupulas e engenharia em edifícios monumentais",
        answer: "a arquitetura romana",
        why: "ela ampliou possibilidades técnicas da construção antiga"
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
        lead: "o movimento artístico que retomou referencias classicas e humanistas",
        answer: "o Renascimento",
        why: "ele valorizou observação, perspectiva e racionalidade"
      },
      {
        lead: "a técnica que organiza profundidade com base matemática",
        answer: "a perspectiva linear",
        why: "ela foi central na pintura renascentista"
      },
      {
        lead: "a valorizacao do ser humano como centro da experiencia cultural",
        answer: "o humanismo",
        why: "ele marcou temas e escolhas formais do periodo"
      },
      {
        lead: "a representação precisa do corpo com estudo anatomico",
        answer: "o naturalismo renascentista",
        why: "ele aproximou arte, ciencia e observação"
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
        lead: "o estilo artístico marcado por dramatizacao e movimento",
        answer: "o Barroco",
        why: "ele intensificou emocao, contraste e teatralidade"
      },
      {
        lead: "a técnica de contraste intenso entre luz e sombra no Barroco",
        answer: "o chiaroscuro",
        why: "ela reforca volume e tensao dramatica"
      },
      {
        lead: "o pintor italiano conhecido por cenas dramaticas e forte luz",
        answer: "Caravaggio",
        why: "ele é uma das referencias centrais do Barroco"
      },
      {
        lead: "a ornamentacao abundante e dinamica em igrejas barrocas",
        answer: "a exuberancia decorativa",
        why: "ela contribui para impacto emocional e visual"
      },
      {
        lead: "a relação entre o Barroco e a afirmacao do catolicismo após a Reforma",
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
        lead: "a valorizacao de ordem, clareza e equilíbrio em oposicao ao excesso",
        answer: "a estética neoclassica",
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
        answer: "a linguagem clássica reatualizada",
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
        lead: "a representação escultorica voltada a proporção e equilíbrio corporal",
        answer: "a escultura clássica",
        why: "ela buscou idealizar o corpo humano"
      },
      {
        lead: "a repeticao de colunas e simetria em edificios clássicos",
        answer: "a composição arquitetonica regular",
        why: "ela reforca ordem e monumentalidade"
      },
      {
        lead: "o uso da pedra e do marmore em obras de prestigio",
        answer: "a materialidade nobre clássica",
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
        answer: "a mitologia clássica",
        why: "ela inspirou grande parte da arte antiga e posterior"
      },
      {
        lead: "a representação de episodios biblicos em pintura e escultura europeias",
        answer: "o tema religioso cristao",
        why: "ele foi central em vários periodos artisticos"
      },
      {
        lead: "o uso da arte para ensinar, celebrar ou reforcar crencas",
        answer: "a função simbólica da imagem",
        why: "muitas obras atuavam para alem do valor decorativo"
      },
      {
        lead: "a cena artística voltada a herois, deuses e feitos exemplares",
        answer: "o tema mitologico",
        why: "ele permitia narrativas de poder, paixao e moralidade"
      },
      {
        lead: "a relação entre patronos, religião e produção artística",
        answer: "o mecenato institucional",
        why: "igreja e elites financiaram muitas obras historicas"
      }
    ]
  },
  {
    subtopico: "Legados da arte clássica",
    habilidade: "avaliar-a-permanencia-da-arte-classica-na-cultura-ocidental",
    tags: ["artes", "legado-classico"],
    fatos: [
      {
        lead: "a permanencia de colunas, frontoes e simetria em edificios posteriores",
        answer: "o legado arquitetonico classico",
        why: "ele reaparece em vários momentos da história da arte"
      },
      {
        lead: "a valorizacao da proporção e do equilíbrio herdada da Antiguidade",
        answer: "um principio classico duradouro",
        why: "ele influenciou pintura, escultura e arquitetura"
      },
      {
        lead: "a retomada periodica de modelos gregos e romanos em outras epocas",
        answer: "a reatualizacao do classico",
        why: "o passado antigo continuou servindo de referencia cultural"
      },
      {
        lead: "a presença de mitos, herois e temas antigos em obras modernas",
        answer: "a sobrevivencia iconografica clássica",
        why: "essas imagens seguem ativas na cultura visual"
      },
      {
        lead: "a influência da arte clássica na formação do olhar ocidental",
        answer: "um legado estetico e historico amplo",
        why: "ela ajudou a definir critérios de beleza, ordem e monumentalidade"
      }
    ]
  }
];

const questoes = buildPlannedQuestions({
  prefix: "hac",
  serie: [1],
  materia: "Artes",
  topico: "História da Arte Clássica",
  blocos,
  stemBuilders: ARTS_STEM_BUILDERS,
  globalMatrix: HUNDRED_QUESTION_MATRIX
});

export const historiaDaArteClassica = {
  id: "artes_historia_da_arte_classica",
  materia: "Artes",
  serie: [1],
  topico: "História da Arte Clássica",
  metadados: {
    disciplinaId: "artes",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Artes",
    frente: "História da arte",
    searchAliases: [
      "história da arte clássica",
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
      "Legados da arte clássica"
    ],
    habilidadesBase: [
      "identificar marcos da arte antiga e clássica",
      "reconhecer características de Grécia, Roma, Renascimento e Barroco",
      "analisar artistas, obras e técnicas de periodos clássicos",
      "interpretar temas religiosos, mitologicos e civicos na arte",
      "avaliar permanencias da arte clássica na cultura visual"
    ],
    auditado: true,
    auditadoEm: "2026-04-11",
    planejamentoQuestoes: ARTS_HUNDRED_PLAN
  },
  questoes
};
