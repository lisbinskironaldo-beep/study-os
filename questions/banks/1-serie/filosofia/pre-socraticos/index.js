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
        answer: "o espaco político e cultural em que debate e vida publica ganharam relevancia",
        why: "a vida na polis favoreceu argumentacao e participacao racional"
      },
      {
        lead: "o surgimento da filosofia na Grecia",
        answer: "o aparecimento de explicações racionais sobre natureza e realidade",
        why: "pensadores passaram a buscar causas naturais para o cosmo"
      },
      {
        lead: "a importância da escrita e do comercio",
        answer: "a ampliacao de trocas culturais que favoreceu comparacao de ideias e conhecimentos",
        why: "circulacao de informacoes estimula investigação e crítica"
      },
      {
        lead: "a cidade de Mileto",
        answer: "um centro importante para os primeiros filosofos da natureza",
        why: "ali atuaram Tales, Anaximandro e Anaximenes"
      },
      {
        lead: "a busca racional pelo princípio das coisas",
        answer: "a tentativa de encontrar uma explicação natural para a origem do cosmo",
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
        answer: "a natureza entendida como princípio de surgimento e transformacao das coisas",
        why: "os pre-socraticos investigavam a realidade natural como ordem racional"
      },
      {
        lead: "o cosmo",
        answer: "o universo concebido como totalidade ordenada",
        why: "a ideia de cosmo supoe regularidade e inteligibilidade"
      },
      {
        lead: "a arche",
        answer: "o princípio originario de que todas as coisas derivam",
        why: "cada pensador buscou definir qual seria esse fundamento"
      },
      {
        lead: "a unidade por tras da multiplicidade",
        answer: "a tentativa de explicar a diversidade do real por um princípio comum",
        why: "essa questao orienta muitas doutrinas pre-socraticas"
      },
      {
        lead: "a explicação cosmologica",
        answer: "a interpretação racional da estrutura e origem do universo",
        why: "ela substitui genealogias divinas por princípios naturais"
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
        answer: "o conjunto de pensadores que buscou explicar a natureza por princípios materiais",
        why: "ela inaugura investigação racional sobre a physis"
      },
      {
        lead: "o interesse dos jonicos",
        answer: "a explicação da origem e da composicao do mundo natural",
        why: "seu foco estava no cosmo e não em narrativas miticas"
      },
      {
        lead: "a observação da natureza",
        answer: "um recurso intelectual importante para formular hipoteses sobre o real",
        why: "os jonicos ligavam reflexão a fenômenos do mundo"
      },
      {
        lead: "o monismo jonico",
        answer: "a ideia de que um unico princípio explica a totalidade das coisas",
        why: "muitos primeiros filosofos procuravam uma arche unica"
      },
      {
        lead: "a investigação cosmologica inicial",
        answer: "o momento em que a filosofia se volta a ordem natural do universo",
        why: "ela marca a ruptura com explicações sagradas tradicionais"
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
        answer: "o princípio originario escolhido para explicar a origem de todas as coisas",
        why: "Tales via na agua a base vital e material do cosmo"
      },
      {
        lead: "o apeiron em Anaximandro",
        answer: "o princípio indefinido e ilimitado de que surgem os seres",
        why: "ele considerava insuficiente reduzir tudo a um elemento conhecido"
      },
      {
        lead: "o ar em Anaximenes",
        answer: "a arche material da qual derivam os seres por rarefacao e condensacao",
        why: "o filosofo explica mudancas por transformacoes do ar"
      },
      {
        lead: "a rarefacao é a condensacao",
        answer: "processos usados por Anaximenes para explicar mudancas da materia",
        why: "esses movimentos dariam origem a diferentes formas do real"
      },
      {
        lead: "a busca de princípio material pelos milesios",
        answer: "a tentativa de explicar o cosmo a partir de um elemento originario",
        why: "Tales, Anaximandro e Anaximenes compartilham esse problema central"
      }
    ]
  },
  {
    subtopico: "Heraclito",
    habilidade:
      "analisar concepcoes de mudança e permanencia entre os pre-socraticos",
    tags: ["heraclito", "devir", "logos"],
    fatos: [
      {
        lead: "o devir em Heraclito",
        answer: "a ideia de que a realidade esta em constante transformacao",
        why: "para ele, nada permanece identico de modo absoluto"
      },
      {
        lead: "o logos em Heraclito",
        answer: "a razão ou ordem que estrutura o movimento do mundo",
        why: "a mudança não é caos puro, mas possui inteligibilidade"
      },
      {
        lead: "o fogo em Heraclito",
        answer: "um simbolo do dinamismo e da transformacao da realidade",
        why: "o fogo representa movimento e mutabilidade"
      },
      {
        lead: "a unidade dos contrarios",
        answer: "a relação pela qual opostos participam de uma mesma ordem do real",
        why: "Heraclito pensava tensao e harmonia como inseparaveis"
      },
      {
        lead: "a frase sobre o rio em Heraclito",
        answer: "a imagem usada para mostrar que tudo flui e se transforma",
        why: "ela expressa o caráter movente da existência"
      }
    ]
  },
  {
    subtopico: "Parmenides e escola eleatica",
    habilidade:
      "analisar concepcoes de mudança e permanencia entre os pre-socraticos",
    tags: ["parmenides", "eleatas", "ser"],
    fatos: [
      {
        lead: "o ser em Parmenides",
        answer: "o que e uno, eterno e imutavel",
        why: "para ele, o verdadeiro ser não pode nascer nem perecer"
      },
      {
        lead: "a crítica de Parmenides a mudança",
        answer: "a ideia de que transformacao pertence ao mundo enganoso das aparencias",
        why: "o pensamento rigoroso deveria afirmar a identidade do ser"
      },
      {
        lead: "a via da verdade",
        answer: "o caminho racional que afirma o ser como necessario e uno",
        why: "ela se opoe ao caminho da opinião"
      },
      {
        lead: "a via da opinião",
        answer: "o nivel das aparencias sensiveis e das percepcoes enganosas",
        why: "Parmenides considera insuficiente confiar nos sentidos"
      },
      {
        lead: "a escola eleatica",
        answer: "a corrente filosófica que enfatizou unidade e imobilidade do ser",
        why: "ela radicalizou a busca por consistencia lógica no pensamento"
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
        answer: "o grupo que atribuiu aos números papel fundamental na estrutura do real",
        why: "para eles, ordem e proporcao explicam o cosmo"
      },
      {
        lead: "o número como princípio",
        answer: "a ideia de que a realidade pode ser compreendida por relações numericas",
        why: "a matematizacao do cosmo marca essa escola"
      },
      {
        lead: "a harmonia cosmica",
        answer: "a ordem do universo entendida como proporcao entre elementos",
        why: "musica e matemática serviam de modelo para pensar o real"
      },
      {
        lead: "a comunidade pitagorica",
        answer: "um modo de vida que combinava filosofia, disciplina e simbolismo",
        why: "os pitagoricos eram também uma fraternidade com regras próprias"
      },
      {
        lead: "a importância da matemática nos pitagoricos",
        answer: "o uso de relações numericas para explicar estrutura e ordem do mundo",
        why: "isso ampliou a ligacao entre razão e medida"
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
        why: "ele defende que tudo contém partes de tudo"
      },
      {
        lead: "o nous em Anaxagoras",
        answer: "a inteligencia ordenadora que organiza o cosmo",
        why: "esse princípio racional inicia o movimento do universo"
      },
      {
        lead: "o pluralismo pre-socratico",
        answer: "a tese de que mais de um princípio compoe a realidade",
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
        why: "ela explica mudança pela combinacao e separacao de unidades indivisiveis"
      },
      {
        lead: "os atomos",
        answer: "particulas indivisiveis e eternas que constituem os seres",
        why: "no atomismo, diferencas resultam de arranjos entre atomos"
      },
      {
        lead: "o vazio no atomismo",
        answer: "o espaco necessario para movimento e rearranjo dos atomos",
        why: "sem vazio, não haveria deslocamento nem transformacao"
      },
      {
        lead: "Democrito",
        answer: "um dos principais representantes da explicação atomista da natureza",
        why: "ele desenvolveu uma visao mecanica do cosmo"
      },
      {
        lead: "a explicação mecanica do mundo",
        answer: "a ideia de que fenômenos decorrem de movimento e combinacao materiais",
        why: "isso dispensa causas miticas para explicar a realidade"
      }
    ]
  },
  {
    subtopico: "Legado dos pre-socraticos",
    habilidade:
      "avaliar a importância dos pre-socraticos para a história da filosofia",
    tags: ["legado", "história da filosofia", "cosmologia"],
    fatos: [
      {
        lead: "o legado dos pre-socraticos",
        answer: "a inauguracao da investigação racional sobre natureza e princípio das coisas",
        why: "eles abriram caminho para a filosofia ocidental"
      },
      {
        lead: "a importância da cosmologia pre-socratica",
        answer: "o esforco de compreender o universo por meio de causas naturais",
        why: "isso influenciou filosofia e ciência posteriores"
      },
      {
        lead: "a pluralidade de respostas pre-socraticas",
        answer: "a diversidade de teorias sobre arche, mudança e composicao do real",
        why: "essa variedade mostra a riqueza do debate inicial"
      },
      {
        lead: "a valorizacao do argumento racional",
        answer: "a substituicao gradual da autoridade da tradição pelo exame conceitual",
        why: "esse gesto marca a identidade da filosofia"
      },
      {
        lead: "a influência sobre filosofos posteriores",
        answer: "a permanencia de problemas sobre ser, mudança e conhecimento na tradição filosófica",
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
    frente: "Origem da cosmologia filosófica",
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
      "analisar concepcoes de mudança e permanencia entre os pre-socraticos",
      "avaliar a importância dos pre-socraticos para a história da filosofia"
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
