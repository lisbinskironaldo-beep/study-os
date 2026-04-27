import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  PHILOSOPHY_HUNDRED_MATRIX,
  PHILOSOPHY_HUNDRED_PLAN,
  PHILOSOPHY_STEM_BUILDERS
} from "../../../_shared/philosophyTopicPresets.js";

const blocos = [
  {
    subtopico: "Contexto do surgimento da filosofia grega",
    habilidade:
      "compreender o contexto historico e cultural do surgimento da filosofia grega",
    tags: ["grecia antiga", "origem da filosofia", "polis"],
    fatos: [
      {
        lead: "a polis grega",
        answer: "o espaco politico e cultural em que debate e vida publica ganharam relevancia",
        why: "a vida na polis favoreceu argumentacao e participacao racional"
      },
      {
        lead: "o surgimento da filosofia na Grecia",
        answer: "o aparecimento de explicacoes racionais sobre natureza e realidade",
        why: "pensadores passaram a buscar causas naturais para o cosmo"
      },
      {
        lead: "a importancia da escrita e do comercio",
        answer: "a ampliacao de trocas culturais que favoreceu comparacao de ideias e conhecimentos",
        why: "circulacao de informacoes estimula investigacao e critica"
      },
      {
        lead: "a cidade de Mileto",
        answer: "um centro importante para os primeiros filosofos da natureza",
        why: "ali atuaram Tales, Anaximandro e Anaximenes"
      },
      {
        lead: "a busca racional pelo principio das coisas",
        answer: "a tentativa de encontrar uma explicacao natural para a origem do cosmo",
        why: "essa busca substitui narrativas exclusivamente miticas"
      }
    ]
  },
  {
    subtopico: "Physis, cosmo e arche",
    habilidade:
      "identificar conceitos basicos da filosofia pre-socratica",
    tags: ["physis", "cosmo", "arche"],
    fatos: [
      {
        lead: "a physis",
        answer: "a natureza entendida como principio de surgimento e transformacao das coisas",
        why: "os pre-socraticos investigavam a realidade natural como ordem racional"
      },
      {
        lead: "o cosmo",
        answer: "o universo concebido como totalidade ordenada",
        why: "a ideia de cosmo supoe regularidade e inteligibilidade"
      },
      {
        lead: "a arche",
        answer: "o principio originario de que todas as coisas derivam",
        why: "cada pensador buscou definir qual seria esse fundamento"
      },
      {
        lead: "a unidade por tras da multiplicidade",
        answer: "a tentativa de explicar a diversidade do real por um principio comum",
        why: "essa questao orienta muitas doutrinas pre-socraticas"
      },
      {
        lead: "a explicacao cosmologica",
        answer: "a interpretacao racional da estrutura e origem do universo",
        why: "ela substitui genealogias divinas por principios naturais"
      }
    ]
  },
  {
    subtopico: "Escola jonica",
    habilidade:
      "reconhecer propostas fundamentais dos filosofos da escola jonica",
    tags: ["jonicos", "mileto", "natureza"],
    fatos: [
      {
        lead: "a escola jonica",
        answer: "o conjunto de pensadores que buscou explicar a natureza por principios materiais",
        why: "ela inaugura investigacao racional sobre a physis"
      },
      {
        lead: "o interesse dos jonicos",
        answer: "a explicacao da origem e da composicao do mundo natural",
        why: "seu foco estava no cosmo e nao em narrativas miticas"
      },
      {
        lead: "a observacao da natureza",
        answer: "um recurso intelectual importante para formular hipoteses sobre o real",
        why: "os jonicos ligavam reflexao a fenomenos do mundo"
      },
      {
        lead: "o monismo jonico",
        answer: "a ideia de que um unico principio explica a totalidade das coisas",
        why: "muitos primeiros filosofos procuravam uma arche unica"
      },
      {
        lead: "a investigacao cosmologica inicial",
        answer: "o momento em que a filosofia se volta a ordem natural do universo",
        why: "ela marca a ruptura com explicacoes sagradas tradicionais"
      }
    ]
  },
  {
    subtopico: "Tales, Anaximandro e Anaximenes",
    habilidade:
      "reconhecer propostas fundamentais dos filosofos da escola jonica",
    tags: ["tales", "anaximandro", "anaximenes"],
    fatos: [
      {
        lead: "a agua em Tales",
        answer: "o principio originario escolhido para explicar a origem de todas as coisas",
        why: "Tales via na agua a base vital e material do cosmo"
      },
      {
        lead: "o apeiron em Anaximandro",
        answer: "o principio indefinido e ilimitado de que surgem os seres",
        why: "ele considerava insuficiente reduzir tudo a um elemento conhecido"
      },
      {
        lead: "o ar em Anaximenes",
        answer: "a arche material da qual derivam os seres por rarefacao e condensacao",
        why: "o filosofo explica mudancas por transformacoes do ar"
      },
      {
        lead: "a rarefacao e a condensacao",
        answer: "processos usados por Anaximenes para explicar mudancas da materia",
        why: "esses movimentos dariam origem a diferentes formas do real"
      },
      {
        lead: "a busca de principio material pelos milesios",
        answer: "a tentativa de explicar o cosmo a partir de um elemento originario",
        why: "Tales, Anaximandro e Anaximenes compartilham esse problema central"
      }
    ]
  },
  {
    subtopico: "Heraclito",
    habilidade:
      "analisar concepcoes de mudanca e permanencia entre os pre-socraticos",
    tags: ["heraclito", "devir", "logos"],
    fatos: [
      {
        lead: "o devir em Heraclito",
        answer: "a ideia de que a realidade esta em constante transformacao",
        why: "para ele, nada permanece identico de modo absoluto"
      },
      {
        lead: "o logos em Heraclito",
        answer: "a razao ou ordem que estrutura o movimento do mundo",
        why: "a mudanca nao e caos puro, mas possui inteligibilidade"
      },
      {
        lead: "o fogo em Heraclito",
        answer: "um simbolo do dinamismo e da transformacao da realidade",
        why: "o fogo representa movimento e mutabilidade"
      },
      {
        lead: "a unidade dos contrarios",
        answer: "a relacao pela qual opostos participam de uma mesma ordem do real",
        why: "Heraclito pensava tensao e harmonia como inseparaveis"
      },
      {
        lead: "a frase sobre o rio em Heraclito",
        answer: "a imagem usada para mostrar que tudo flui e se transforma",
        why: "ela expressa o carater movente da existencia"
      }
    ]
  },
  {
    subtopico: "Parmenides e escola eleatica",
    habilidade:
      "analisar concepcoes de mudanca e permanencia entre os pre-socraticos",
    tags: ["parmenides", "eleatas", "ser"],
    fatos: [
      {
        lead: "o ser em Parmenides",
        answer: "o que e uno, eterno e imutavel",
        why: "para ele, o verdadeiro ser nao pode nascer nem perecer"
      },
      {
        lead: "a critica de Parmenides a mudanca",
        answer: "a ideia de que transformacao pertence ao mundo enganoso das aparencias",
        why: "o pensamento rigoroso deveria afirmar a identidade do ser"
      },
      {
        lead: "a via da verdade",
        answer: "o caminho racional que afirma o ser como necessario e uno",
        why: "ela se opoe ao caminho da opiniao"
      },
      {
        lead: "a via da opiniao",
        answer: "o nivel das aparencias sensiveis e das percepcoes enganosas",
        why: "Parmenides considera insuficiente confiar nos sentidos"
      },
      {
        lead: "a escola eleatica",
        answer: "a corrente filosofica que enfatizou unidade e imobilidade do ser",
        why: "ela radicalizou a busca por consistencia logica no pensamento"
      }
    ]
  },
  {
    subtopico: "Pitagoricos",
    habilidade:
      "identificar conceitos basicos da filosofia pre-socratica",
    tags: ["pitagoricos", "numero", "harmonia"],
    fatos: [
      {
        lead: "os pitagoricos",
        answer: "o grupo que atribuiu aos numeros papel fundamental na estrutura do real",
        why: "para eles, ordem e proporcao explicam o cosmo"
      },
      {
        lead: "o numero como principio",
        answer: "a ideia de que a realidade pode ser compreendida por relacoes numericas",
        why: "a matematizacao do cosmo marca essa escola"
      },
      {
        lead: "a harmonia cosmica",
        answer: "a ordem do universo entendida como proporcao entre elementos",
        why: "musica e matematica serviam de modelo para pensar o real"
      },
      {
        lead: "a comunidade pitagorica",
        answer: "um modo de vida que combinava filosofia, disciplina e simbolismo",
        why: "os pitagoricos eram tambem uma fraternidade com regras proprias"
      },
      {
        lead: "a importancia da matematica nos pitagoricos",
        answer: "o uso de relacoes numericas para explicar estrutura e ordem do mundo",
        why: "isso ampliou a ligacao entre razao e medida"
      }
    ]
  },
  {
    subtopico: "Empedocles e Anaxagoras",
    habilidade:
      "reconhecer diferentes solucoes pre-socraticas para a composicao da realidade",
    tags: ["empedocles", "anaxagoras", "pluralismo"],
    fatos: [
      {
        lead: "os quatro elementos de Empedocles",
        answer: "terra, agua, ar e fogo como componentes basicos do real",
        why: "a combinacao desses elementos explicaria a diversidade das coisas"
      },
      {
        lead: "amor e discordia em Empedocles",
        answer: "as forcas que unem e separam os elementos no cosmo",
        why: "elas explicam movimento e transformacao sem destruir os elementos"
      },
      {
        lead: "as homeomerias em Anaxagoras",
        answer: "as sementes de todas as coisas presentes na composicao do mundo",
        why: "ele defende que tudo contem partes de tudo"
      },
      {
        lead: "o nous em Anaxagoras",
        answer: "a inteligencia ordenadora que organiza o cosmo",
        why: "esse principio racional inicia o movimento do universo"
      },
      {
        lead: "o pluralismo pre-socratico",
        answer: "a tese de que mais de um principio compoe a realidade",
        why: "Empedocles e Anaxagoras ampliam a busca por fundamentos"
      }
    ]
  },
  {
    subtopico: "Atomistas",
    habilidade:
      "reconhecer diferentes solucoes pre-socraticas para a composicao da realidade",
    tags: ["atomistas", "democrito", "leucipo"],
    fatos: [
      {
        lead: "o atomismo",
        answer: "a doutrina segundo a qual a realidade e composta por atomos e vazio",
        why: "ela explica mudanca pela combinacao e separacao de unidades indivisiveis"
      },
      {
        lead: "os atomos",
        answer: "particulas indivisiveis e eternas que constituem os seres",
        why: "no atomismo, diferencas resultam de arranjos entre atomos"
      },
      {
        lead: "o vazio no atomismo",
        answer: "o espaco necessario para movimento e rearranjo dos atomos",
        why: "sem vazio, nao haveria deslocamento nem transformacao"
      },
      {
        lead: "Democrito",
        answer: "um dos principais representantes da explicacao atomista da natureza",
        why: "ele desenvolveu uma visao mecanica do cosmo"
      },
      {
        lead: "a explicacao mecanica do mundo",
        answer: "a ideia de que fenomenos decorrem de movimento e combinacao materiais",
        why: "isso dispensa causas miticas para explicar a realidade"
      }
    ]
  },
  {
    subtopico: "Legado dos pre-socraticos",
    habilidade:
      "avaliar a importancia dos pre-socraticos para a historia da filosofia",
    tags: ["legado", "historia da filosofia", "cosmologia"],
    fatos: [
      {
        lead: "o legado dos pre-socraticos",
        answer: "a inauguracao da investigacao racional sobre natureza e principio das coisas",
        why: "eles abriram caminho para a filosofia ocidental"
      },
      {
        lead: "a importancia da cosmologia pre-socratica",
        answer: "o esforco de compreender o universo por meio de causas naturais",
        why: "isso influenciou filosofia e ciencia posteriores"
      },
      {
        lead: "a pluralidade de respostas pre-socraticas",
        answer: "a diversidade de teorias sobre arche, mudanca e composicao do real",
        why: "essa variedade mostra a riqueza do debate inicial"
      },
      {
        lead: "a valorizacao do argumento racional",
        answer: "a substituicao gradual da autoridade da tradicao pelo exame conceitual",
        why: "esse gesto marca a identidade da filosofia"
      },
      {
        lead: "a influencia sobre filosofos posteriores",
        answer: "a permanencia de problemas sobre ser, mudanca e conhecimento na tradicao filosofica",
        why: "Socrates, Platao e Aristoteles herdam e reelaboram essas questoes"
      }
    ]
  }
];

export const preSocraticos = {
  id: "filosofia_pre_socraticos",
  materia: "Filosofia",
  serie: [1],
  topico: "Pre Socraticos",
  metadados: {
    disciplinaId: "filosofia",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Filosofia",
    frente: "Origem da cosmologia filosofica",
    searchAliases: [
      "pre socraticos",
      "physis e arche",
      "heraclito e parmenides",
      "atomistas",
      "filosofia grega antiga"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "compreender o contexto historico e cultural do surgimento da filosofia grega",
      "identificar conceitos basicos da filosofia pre-socratica",
      "reconhecer propostas fundamentais dos filosofos da escola jonica",
      "analisar concepcoes de mudanca e permanencia entre os pre-socraticos",
      "avaliar a importancia dos pre-socraticos para a historia da filosofia"
    ],
    planejamentoQuestoes: PHILOSOPHY_HUNDRED_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "ps",
    serie: 1,
    materia: "Filosofia",
    topico: "Pre Socraticos",
    blocos,
    stemBuilders: PHILOSOPHY_STEM_BUILDERS,
    globalMatrix: PHILOSOPHY_HUNDRED_MATRIX
  })
};
