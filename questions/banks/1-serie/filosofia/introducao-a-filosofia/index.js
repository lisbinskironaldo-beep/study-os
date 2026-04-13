import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  PHILOSOPHY_HUNDRED_MATRIX,
  PHILOSOPHY_HUNDRED_PLAN,
  PHILOSOPHY_STEM_BUILDERS
} from "../../../_shared/philosophyTopicPresets.js";

const blocos = [
  {
    subtopico: "O que e filosofia",
    habilidade:
      "identificar o sentido geral da filosofia e suas perguntas fundamentais",
    tags: ["filosofia", "conceito", "pergunta"],
    fatos: [
      {
        lead: "a filosofia",
        answer: "uma atividade racional de investigacao sobre realidade, conhecimento e valores",
        why: "ela busca compreender problemas fundamentais por meio de conceitos e argumentos"
      },
      {
        lead: "o filosofar",
        answer: "o exercicio de questionar, refletir e argumentar sobre problemas humanos",
        why: "filosofia nao e apenas decorar autores, mas pensar criticamente"
      },
      {
        lead: "a atitude filosofica",
        answer: "a disposicao de nao aceitar respostas prontas sem exame racional",
        why: "ela envolve duvida, curiosidade e investigacao"
      },
      {
        lead: "uma questao filosofica",
        answer: "um problema amplo sobre ser, saber, agir ou viver em sociedade",
        why: "essas questoes ultrapassam respostas imediatas do cotidiano"
      },
      {
        lead: "o espanto filosofico",
        answer: "a admiracao diante do mundo que impulsiona a busca por explicacoes",
        why: "muitos pensadores antigos ligavam o inicio da filosofia ao espanto"
      }
    ]
  },
  {
    subtopico: "Mito e logos",
    habilidade:
      "diferenciar explicacoes miticas e filosoficas na formacao do pensamento ocidental",
    tags: ["mito", "logos", "origem da filosofia"],
    fatos: [
      {
        lead: "o mito",
        answer: "uma narrativa simbolica que explica a realidade por meio de deuses e herois",
        why: "ele organiza sentidos coletivos sem depender de demonstracao racional"
      },
      {
        lead: "o logos",
        answer: "a explicacao racional baseada em argumentos e investigacao conceitual",
        why: "com o logos, a realidade passa a ser pensada por razoes discutiveis"
      },
      {
        lead: "a passagem do mito ao logos",
        answer: "a mudanca de explicacoes predominantemente narrativas para analises racionais",
        why: "essa transicao marca o nascimento da filosofia grega"
      },
      {
        lead: "a narrativa mitica",
        answer: "um modo de contar a origem das coisas com base em tradicao e simbolismo",
        why: "ela cumpre funcao cultural e identitaria em muitas sociedades"
      },
      {
        lead: "a explicacao racional",
        answer: "a tentativa de justificar ideias por argumentos criticaveis e coerentes",
        why: "ela abre espaco para debate e revisao das respostas"
      }
    ]
  },
  {
    subtopico: "Senso comum e pensamento critico",
    habilidade:
      "reconhecer a diferenca entre senso comum, opiniao e pensamento critico",
    tags: ["senso comum", "pensamento critico", "opiniao"],
    fatos: [
      {
        lead: "o senso comum",
        answer: "o conjunto de opinioes e crencas aceitas sem analise aprofundada",
        why: "ele orienta a vida cotidiana, mas nem sempre examina fundamentos"
      },
      {
        lead: "o pensamento critico",
        answer: "a avaliacao reflexiva de ideias, argumentos e evidencias",
        why: "ele procura distinguir opiniao, justificativa e conclusao"
      },
      {
        lead: "a opiniao",
        answer: "um juizo formulado sem necessariamente passar por demonstracao rigorosa",
        why: "ela pode ser valida, mas precisa de exame para ganhar consistencia"
      },
      {
        lead: "a reflexao critica",
        answer: "o ato de questionar pressupostos e analisar razoes antes de aceitar uma ideia",
        why: "isso impede adesao irrefletida a preconceitos e aparencias"
      },
      {
        lead: "o preconceito",
        answer: "um julgamento previo que dispensa investigacao adequada do assunto",
        why: "ele se fortalece quando o pensamento critico nao e exercido"
      }
    ]
  },
  {
    subtopico: "Perguntas filosoficas",
    habilidade:
      "identificar o sentido geral da filosofia e suas perguntas fundamentais",
    tags: ["perguntas filosoficas", "ser", "conhecimento"],
    fatos: [
      {
        lead: "a pergunta sobre o ser",
        answer: "a investigacao sobre o que existe e como a realidade se constitui",
        why: "essa pergunta orienta a metafisica e a ontologia"
      },
      {
        lead: "a pergunta sobre o conhecimento",
        answer: "a investigacao sobre como sabemos e quais sao os limites do saber",
        why: "ela e central para a teoria do conhecimento"
      },
      {
        lead: "a pergunta sobre o agir",
        answer: "a reflexao sobre o que e correto, justo ou bom fazer",
        why: "ela fundamenta problemas eticos e politicos"
      },
      {
        lead: "a pergunta sobre a verdade",
        answer: "a busca por criterios que permitam distinguir erro e conhecimento valido",
        why: "filosofos discutem o que torna uma afirmacao verdadeira"
      },
      {
        lead: "a pergunta sobre o sentido da vida",
        answer: "a reflexao sobre finalidade, valores e orientacao da existencia humana",
        why: "ela aparece em diferentes tradicoes filosoficas"
      }
    ]
  },
  {
    subtopico: "Campos da filosofia",
    habilidade:
      "relacionar campos filosoficos basicos a seus problemas centrais",
    tags: ["metafisica", "etica", "politica"],
    fatos: [
      {
        lead: "a metafisica",
        answer: "o campo que investiga ser, realidade e principios ultimos",
        why: "ela pergunta o que existe e de que modo existe"
      },
      {
        lead: "a epistemologia",
        answer: "o campo que estuda conhecimento, verdade e justificacao",
        why: "ela examina como sabemos e o que torna um saber valido"
      },
      {
        lead: "a etica",
        answer: "o campo filosofico que reflete sobre valores e criterios do agir",
        why: "ela discute bem, dever, virtude e responsabilidade"
      },
      {
        lead: "a filosofia politica",
        answer: "o campo que analisa poder, Estado, justica e vida coletiva",
        why: "ela trata da organizacao da convivencia humana"
      },
      {
        lead: "a estetica",
        answer: "o campo que investiga arte, beleza e experiencia sensivel",
        why: "ele pensa o valor e o sentido das obras e percepcoes"
      }
    ]
  },
  {
    subtopico: "Filosofia e ciencia",
    habilidade:
      "analisar relacoes e diferencas entre filosofia, ciencia e outras formas de saber",
    tags: ["filosofia e ciencia", "metodo", "conhecimento"],
    fatos: [
      {
        lead: "a ciencia",
        answer: "um saber sistematico voltado a explicar fenomenos com metodos especificos",
        why: "ela depende de investigacao controlada e criterios proprios de validacao"
      },
      {
        lead: "a diferenca entre filosofia e ciencia",
        answer: "o fato de que a filosofia problematiza fundamentos enquanto a ciencia investiga objetos delimitados",
        why: "as duas se relacionam, mas nao fazem exatamente a mesma coisa"
      },
      {
        lead: "o metodo cientifico",
        answer: "um conjunto de procedimentos para formular e testar explicacoes sobre fenomenos",
        why: "ele ajuda a produzir conhecimento verificavel"
      },
      {
        lead: "a reflexao filosofica sobre a ciencia",
        answer: "a analise critica dos pressupostos, limites e criterios do saber cientifico",
        why: "a filosofia pergunta o que conta como evidencia e explicacao"
      },
      {
        lead: "a complementaridade entre filosofia e ciencia",
        answer: "a relacao em que uma investiga fundamentos e a outra desenvolve explicacoes especializadas",
        why: "ambas contribuem para compreensao mais ampla da realidade"
      }
    ]
  },
  {
    subtopico: "Filosofia e politica",
    habilidade:
      "relacionar campos filosoficos basicos a seus problemas centrais",
    tags: ["politica", "justica", "convivencia"],
    fatos: [
      {
        lead: "a filosofia politica",
        answer: "a reflexao sobre poder, leis, justica e organizacao social",
        why: "ela busca compreender como devemos viver em comum"
      },
      {
        lead: "a justica",
        answer: "um criterio para avaliar distribuicao de direitos, deveres e reconhecimentos",
        why: "o tema da justica e central em debates politicos"
      },
      {
        lead: "o poder",
        answer: "a capacidade de influenciar condutas e ordenar a vida coletiva",
        why: "filosoficamente, ele e analisado quanto a legitimidade e limites"
      },
      {
        lead: "a cidadania",
        answer: "a condicao de participacao em uma comunidade de direitos e deveres",
        why: "ela conecta individuo e vida publica"
      },
      {
        lead: "o debate publico",
        answer: "a discussao coletiva de ideias e interesses em sociedade",
        why: "ele e importante para a formacao de decisoes legitimas"
      }
    ]
  },
  {
    subtopico: "Filosofia e etica",
    habilidade:
      "relacionar campos filosoficos basicos a seus problemas centrais",
    tags: ["etica", "moral", "valores"],
    fatos: [
      {
        lead: "a moral",
        answer: "o conjunto de normas e costumes que orienta condutas em um grupo",
        why: "ela expressa habitos e expectativas compartilhadas"
      },
      {
        lead: "a reflexao etica",
        answer: "a analise critica dos valores e criterios que orientam a acao",
        why: "ela vai alem de repetir costumes e pergunta por fundamentos"
      },
      {
        lead: "o bem",
        answer: "uma nocao que remete ao valor positivo atribuido a certos fins e acoes",
        why: "a etica busca compreender o que significa agir bem"
      },
      {
        lead: "a responsabilidade",
        answer: "a capacidade de responder por escolhas e consequencias de atos",
        why: "ela e central em discussoes sobre liberdade e dever"
      },
      {
        lead: "o dilema moral",
        answer: "uma situacao em que diferentes valores entram em conflito na decisao",
        why: "esses conflitos exigem ponderacao e justificativa"
      }
    ]
  },
  {
    subtopico: "Argumentacao e dialogo",
    habilidade:
      "identificar a importancia do argumento, do conceito e do dialogo filosofico",
    tags: ["argumentacao", "dialogo", "conceito"],
    fatos: [
      {
        lead: "o argumento",
        answer: "um conjunto de razoes apresentado para sustentar uma conclusao",
        why: "na filosofia, ideias precisam ser justificadas e discutidas"
      },
      {
        lead: "a conclusao argumentativa",
        answer: "a afirmacao que se busca sustentar com premissas e razoes",
        why: "ela depende da coerencia do percurso argumentativo"
      },
      {
        lead: "a premissa",
        answer: "uma proposicao usada como base para apoiar uma conclusao",
        why: "premissas consistentes fortalecem o argumento"
      },
      {
        lead: "o dialogo filosofico",
        answer: "a troca racional de ideias voltada ao exame critico de conceitos",
        why: "ele permite revisar opinioes e aprofundar problemas"
      },
      {
        lead: "a coerencia conceitual",
        answer: "a articulacao logica entre ideias usadas em uma explicacao",
        why: "sem coerencia, o argumento perde forca"
      }
    ]
  },
  {
    subtopico: "Filosofia no cotidiano",
    habilidade:
      "analisar aplicacoes da filosofia no cotidiano e na vida social",
    tags: ["cotidiano", "reflexao", "vida social"],
    fatos: [
      {
        lead: "a filosofia no cotidiano",
        answer: "a presenca da reflexao critica nas escolhas e interpretacoes da vida comum",
        why: "pensar filosoficamente ajuda a avaliar habitos e decisoes"
      },
      {
        lead: "a analise de valores do dia a dia",
        answer: "o exame dos criterios usados para julgar pessoas, acoes e situacoes",
        why: "muitas praticas cotidianas envolvem juizos morais e politicos"
      },
      {
        lead: "a autonomia intelectual",
        answer: "a capacidade de pensar com criterio proprio e justificavel",
        why: "ela se fortalece quando exercitamos questionamento e argumento"
      },
      {
        lead: "a leitura critica da realidade",
        answer: "a interpretacao do mundo com atencao a causas, valores e interesses",
        why: "essa leitura evita aceitar aparencias de forma passiva"
      },
      {
        lead: "a utilidade formativa da filosofia",
        answer: "o desenvolvimento de pensamento reflexivo, argumentativo e etico",
        why: "filosofia contribui para formacao humana e cidada"
      }
    ]
  }
];

export const introducaoAFilosofia = {
  id: "filosofia_introducao_a_filosofia",
  materia: "Filosofia",
  serie: [1],
  topico: "Introducao a Filosofia",
  metadados: {
    disciplinaId: "filosofia",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Filosofia",
    frente: "Fundamentos do pensamento filosofico",
    searchAliases: [
      "introducao a filosofia",
      "o que e filosofia",
      "mito e logos",
      "pensamento critico",
      "argumentacao filosofica"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar o sentido geral da filosofia e suas perguntas fundamentais",
      "diferenciar explicacoes miticas e filosoficas na formacao do pensamento ocidental",
      "reconhecer a diferenca entre senso comum, opiniao e pensamento critico",
      "relacionar campos filosoficos basicos a seus problemas centrais",
      "identificar a importancia do argumento, do conceito e do dialogo filosofico"
    ],
    planejamentoQuestoes: PHILOSOPHY_HUNDRED_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "if",
    serie: 1,
    materia: "Filosofia",
    topico: "Introducao a Filosofia",
    blocos,
    stemBuilders: PHILOSOPHY_STEM_BUILDERS,
    globalMatrix: PHILOSOPHY_HUNDRED_MATRIX
  })
};
