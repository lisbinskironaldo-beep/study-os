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
        answer: "uma atividade racional de investigação sobre realidade, conhecimento e valores",
        why: "ela busca compreender problemas fundamentais por meio de conceitos e argumentos"
      },
      {
        lead: "o filosofar",
        answer: "o exercicio de questionar, refletir e argumentar sobre problemas humanos",
        why: "filosofia não é apenas decorar autores, mas pensar criticamente"
      },
      {
        lead: "a atitude filosófica",
        answer: "a disposição de não aceitar respostas prontas sem exame racional",
        why: "ela envolve duvida, curiosidade e investigação"
      },
      {
        lead: "uma questao filosófica",
        answer: "um problema amplo sobre ser, saber, agir ou viver em sociedade",
        why: "essas questoes ultrapassam respostas imediatas do cotidiano"
      },
      {
        lead: "o espanto filosófico",
        answer: "a admiracao diante do mundo que impulsiona a busca por explicações",
        why: "muitos pensadores antigos ligavam o inicio da filosofia ao espanto"
      }
    ]
  },
  {
    subtopico: "Mito e logos",
    habilidade:
      "diferenciar explicações miticas e filosóficas na formação do pensamento ocidental",
    tags: ["mito", "logos", "origem da filosofia"],
    fatos: [
      {
        lead: "o mito",
        answer: "uma narrativa simbolica que explica a realidade por meio de deuses e herois",
        why: "ele organiza sentidos coletivos sem depender de demonstração racional"
      },
      {
        lead: "o logos",
        answer: "a explicação racional baseada em argumentos e investigação conceitual",
        why: "com o logos, a realidade passa a ser pensada por razoes discutiveis"
      },
      {
        lead: "a passagem do mito ao logos",
        answer: "a mudança de explicações predominantemente narrativas para analises racionais",
        why: "essa transicao marca o nascimento da filosofia grega"
      },
      {
        lead: "a narrativa mitica",
        answer: "um modo de contar a origem das coisas com base em tradição e simbolismo",
        why: "ela cumpre função cultural e identitária em muitas sociedades"
      },
      {
        lead: "a explicação racional",
        answer: "a tentativa de justificar ideias por argumentos criticaveis e coerentes",
        why: "ela abre espaco para debate e revisao das respostas"
      }
    ]
  },
  {
    subtopico: "Senso comum e pensamento crítico",
    habilidade:
      "reconhecer a diferenca entre senso comum, opinião e pensamento crítico",
    tags: ["senso comum", "pensamento crítico", "opiniao"],
    fatos: [
      {
        lead: "o senso comum",
        answer: "o conjunto de opiniões e crencas aceitas sem análise aprofundada",
        why: "ele orienta a vida cotidiana, mas nem sempre examina fundamentos"
      },
      {
        lead: "o pensamento crítico",
        answer: "a avaliação reflexiva de ideias, argumentos e evidencias",
        why: "ele procura distinguir opinião, justificativa e conclusao"
      },
      {
        lead: "a opinião",
        answer: "um juízo formulado sem necessariamente passar por demonstração rigorosa",
        why: "ela pode ser valida, mas precisa de exame para ganhar consistencia"
      },
      {
        lead: "a reflexão crítica",
        answer: "o ato de questionar pressupostos e analisar razoes antes de aceitar uma ideia",
        why: "isso impede adesao irrefletida a preconceitos e aparencias"
      },
      {
        lead: "o preconceito",
        answer: "um julgamento previo que dispensa investigação adequada do assunto",
        why: "ele se fortalece quando o pensamento crítico não é exercido"
      }
    ]
  },
  {
    subtopico: "Perguntas filosóficas",
    habilidade:
      "identificar o sentido geral da filosofia e suas perguntas fundamentais",
    tags: ["perguntas filosóficas", "ser", "conhecimento"],
    fatos: [
      {
        lead: "a pergunta sobre o ser",
        answer: "a investigação sobre o que existe e como a realidade se constitui",
        why: "essa pergunta orienta a metafisica é a ontologia"
      },
      {
        lead: "a pergunta sobre o conhecimento",
        answer: "a investigação sobre como sabemos e quais são os limites do saber",
        why: "ela é central para a teoria do conhecimento"
      },
      {
        lead: "a pergunta sobre o agir",
        answer: "a reflexão sobre o que é correto, justo ou bom fazer",
        why: "ela fundamenta problemas eticos e politicos"
      },
      {
        lead: "a pergunta sobre a verdade",
        answer: "a busca por critérios que permitam distinguir erro e conhecimento valido",
        why: "filosofos discutem o que torna uma afirmacao verdadeira"
      },
      {
        lead: "a pergunta sobre o sentido da vida",
        answer: "a reflexão sobre finalidade, valores e orientação da existência humana",
        why: "ela aparece em diferentes tradicoes filosóficas"
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
        answer: "o campo que investiga ser, realidade e princípios ultimos",
        why: "ela pergunta o que existe e de que modo existe"
      },
      {
        lead: "a epistemologia",
        answer: "o campo que estuda conhecimento, verdade e justificacao",
        why: "ela examina como sabemos é o que torna um saber valido"
      },
      {
        lead: "a ética",
        answer: "o campo filosófico que reflete sobre valores e critérios do agir",
        why: "ela discute bem, dever, virtude e responsabilidade"
      },
      {
        lead: "a filosofia política",
        answer: "o campo que analisa poder, Estado, justiça e vida coletiva",
        why: "ela trata da organizacao da convivencia humana"
      },
      {
        lead: "a estetica",
        answer: "o campo que investiga arte, beleza e experiência sensivel",
        why: "ele pensa o valor é o sentido das obras e percepcoes"
      }
    ]
  },
  {
    subtopico: "Filosofia e ciência",
    habilidade:
      "analisar relações e diferencas entre filosofia, ciência e outras formas de saber",
    tags: ["filosofia e ciência", "metodo", "conhecimento"],
    fatos: [
      {
        lead: "a ciência",
        answer: "um saber sistematico voltado a explicar fenômenos com metodos especificos",
        why: "ela depende de investigação controlada e critérios próprios de validação"
      },
      {
        lead: "a diferenca entre filosofia e ciência",
        answer: "o fato de que a filosofia problematiza fundamentos enquanto a ciência investiga objetos delimitados",
        why: "as duas se relacionam, mas não fazem exatamente a mesma coisa"
      },
      {
        lead: "o metodo cientifico",
        answer: "um conjunto de procedimentos para formular e testar explicações sobre fenômenos",
        why: "ele ajuda a produzir conhecimento verificavel"
      },
      {
        lead: "a reflexão filosófica sobre a ciência",
        answer: "a análise crítica dos pressupostos, limites e critérios do saber cientifico",
        why: "a filosofia pergunta o que conta como evidencia e explicação"
      },
      {
        lead: "a complementaridade entre filosofia e ciência",
        answer: "a relação em que uma investiga fundamentos é a outra desenvolve explicações especializadas",
        why: "ambas contribuem para compreensao mais ampla da realidade"
      }
    ]
  },
  {
    subtopico: "Filosofia e política",
    habilidade:
      "relacionar campos filosoficos basicos a seus problemas centrais",
    tags: ["politica", "justica", "convivencia"],
    fatos: [
      {
        lead: "a filosofia política",
        answer: "a reflexão sobre poder, leis, justiça e organizacao social",
        why: "ela busca compreender como devemos viver em comum"
      },
      {
        lead: "a justiça",
        answer: "um critério para avaliar distribuicao de direitos, deveres e reconhecimentos",
        why: "o tema da justiça é central em debates politicos"
      },
      {
        lead: "o poder",
        answer: "a capacidade de influenciar condutas e ordenar a vida coletiva",
        why: "filosoficamente, ele é analisado quanto a legitimidade e limites"
      },
      {
        lead: "a cidadania",
        answer: "a condição de participacao em uma comunidade de direitos e deveres",
        why: "ela conecta individuo e vida publica"
      },
      {
        lead: "o debate publico",
        answer: "a discussao coletiva de ideias e interesses em sociedade",
        why: "ele é importante para a formação de decisões legitimas"
      }
    ]
  },
  {
    subtopico: "Filosofia e ética",
    habilidade:
      "relacionar campos filosoficos basicos a seus problemas centrais",
    tags: ["etica", "moral", "valores"],
    fatos: [
      {
        lead: "a moral",
        answer: "o conjunto de normas e costumes que orienta condutas em um grupo",
        why: "ela expressa hábitos e expectativas compartilhadas"
      },
      {
        lead: "a reflexão ética",
        answer: "a análise crítica dos valores e critérios que orientam a ação",
        why: "ela vai alem de repetir costumes e pergunta por fundamentos"
      },
      {
        lead: "o bem",
        answer: "uma nocao que remete ao valor positivo atribuido a certos fins é ações",
        why: "a ética busca compreender o que significa agir bem"
      },
      {
        lead: "a responsabilidade",
        answer: "a capacidade de responder por escolhas e consequências de atos",
        why: "ela é central em discussoes sobre liberdade e dever"
      },
      {
        lead: "o dilema moral",
        answer: "uma situação em que diferentes valores entram em conflito na decisão",
        why: "esses conflitos exigem ponderacao e justificativa"
      }
    ]
  },
  {
    subtopico: "Argumentacao e dialogo",
    habilidade:
      "identificar a importância do argumento, do conceito e do dialogo filosófico",
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
        lead: "o dialogo filosófico",
        answer: "a troca racional de ideias voltada ao exame crítico de conceitos",
        why: "ele permite revisar opiniões e aprofundar problemas"
      },
      {
        lead: "a coerencia conceitual",
        answer: "a articulacao lógica entre ideias usadas em uma explicação",
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
        answer: "a presenca da reflexão crítica nas escolhas e interpretacoes da vida comum",
        why: "pensar filosoficamente ajuda a avaliar hábitos e decisões"
      },
      {
        lead: "a análise de valores do dia a dia",
        answer: "o exame dos critérios usados para julgar pessoas, ações e situações",
        why: "muitas praticas cotidianas envolvem juizos morais e politicos"
      },
      {
        lead: "a autonomia intelectual",
        answer: "a capacidade de pensar com critério próprio e justificavel",
        why: "ela se fortalece quando exercitamos questionamento e argumento"
      },
      {
        lead: "a leitura crítica da realidade",
        answer: "a interpretação do mundo com atenção a causas, valores e interesses",
        why: "essa leitura evita aceitar aparencias de forma passiva"
      },
      {
        lead: "a utilidade formativa da filosofia",
        answer: "o desenvolvimento de pensamento reflexivo, argumentativo e etico",
        why: "filosofia contribui para formação humana e cidada"
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
    frente: "Fundamentos do pensamento filosófico",
    searchAliases: [
      "introducao a filosofia",
      "o que e filosofia",
      "mito e logos",
      "pensamento crítico",
      "argumentacao filosófica"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar o sentido geral da filosofia e suas perguntas fundamentais",
      "diferenciar explicações miticas e filosóficas na formação do pensamento ocidental",
      "reconhecer a diferenca entre senso comum, opinião e pensamento crítico",
      "relacionar campos filosoficos basicos a seus problemas centrais",
      "identificar a importância do argumento, do conceito e do dialogo filosófico"
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
