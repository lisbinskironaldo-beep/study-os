import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  PHILOSOPHY_HUNDRED_MATRIX,
  PHILOSOPHY_HUNDRED_PLAN,
  PHILOSOPHY_STEM_BUILDERS
} from "../../../_shared/philosophyTopicPresets.js";

const blocos = [
  {
    subtopico: "Etica, moral e valores",
    habilidade:
      "diferenciar etica, moral e valor na reflexao filosofica",
    tags: ["etica", "moral", "valores"],
    fatos: [
      {
        lead: "a etica",
        answer: "a reflexao filosofica sobre os criterios que orientam a acao humana",
        why: "ela examina fundamentos do agir e nao apenas costumes dados"
      },
      {
        lead: "a moral",
        answer: "o conjunto de normas e habitos que uma sociedade considera adequados",
        why: "ela expressa praticas e expectativas de um grupo"
      },
      {
        lead: "os valores morais",
        answer: "os criterios usados para julgar condutas como boas, justas ou desejaveis",
        why: "eles orientam escolhas e avaliacoes"
      },
      {
        lead: "a diferenca entre etica e moral",
        answer: "o fato de a etica refletir criticamente sobre aquilo que a moral prescreve",
        why: "uma pergunta por fundamentos, a outra indica costumes e normas"
      },
      {
        lead: "o juizo moral",
        answer: "a avaliacao de uma acao a partir de valores e criterios compartilhados",
        why: "ele faz parte da vida social e pessoal"
      }
    ]
  },
  {
    subtopico: "Virtude e carater",
    habilidade:
      "compreender modelos classicos de reflexao etica sobre virtude e carater",
    tags: ["virtude", "carater", "formacao moral"],
    fatos: [
      {
        lead: "a virtude",
        answer: "a disposicao estavel para agir bem de modo excelente",
        why: "na tradicao classica, ela se forma por habitos e escolhas"
      },
      {
        lead: "o carater moral",
        answer: "o modo relativamente duradouro como a pessoa se inclina a agir",
        why: "ele resulta de educacao, habitos e decisoes"
      },
      {
        lead: "a prudencia",
        answer: "a capacidade de deliberar adequadamente sobre como agir",
        why: "ela ajuda a escolher meios corretos diante de situacoes concretas"
      },
      {
        lead: "a justa medida",
        answer: "o equilibrio virtuoso entre extremos de excesso e falta",
        why: "esse conceito organiza parte importante da etica antiga"
      },
      {
        lead: "a formacao do habito virtuoso",
        answer: "a repeticao orientada de boas acoes ate consolidar disposicoes morais",
        why: "a virtude nao surge pronta, mas se aprende"
      }
    ]
  },
  {
    subtopico: "Dever e etica kantiana",
    habilidade:
      "identificar correntes eticas baseadas em dever, consequencias e responsabilidade",
    tags: ["kant", "dever", "imperativo categorico"],
    fatos: [
      {
        lead: "o dever em Kant",
        answer: "a obrigacao moral de agir por respeito a lei racional",
        why: "a moralidade nao depende apenas de inclinacoes ou vantagens"
      },
      {
        lead: "o imperativo categorico",
        answer: "o principio que manda agir apenas segundo maximas universalizaveis",
        why: "ele busca criterio racional valido para todos"
      },
      {
        lead: "a boa vontade",
        answer: "a disposicao de agir moralmente por dever e nao por interesse",
        why: "Kant a considera o unico bem sem restricoes"
      },
      {
        lead: "a autonomia moral em Kant",
        answer: "a capacidade racional de dar a si mesmo a lei do agir",
        why: "o sujeito moral nao deve ser guiado apenas por comandos externos"
      },
      {
        lead: "o respeito a pessoa como fim",
        answer: "a exigencia de nunca tratar alguem apenas como meio",
        why: "a dignidade humana limita usos instrumentais do outro"
      }
    ]
  },
  {
    subtopico: "Utilitarismo e consequencialismo",
    habilidade:
      "identificar correntes eticas baseadas em dever, consequencias e responsabilidade",
    tags: ["utilitarismo", "consequencialismo", "felicidade"],
    fatos: [
      {
        lead: "o utilitarismo",
        answer: "a corrente que avalia acoes por suas consequencias para o bem-estar geral",
        why: "o melhor ato seria o que produz maior beneficio coletivo"
      },
      {
        lead: "o consequencialismo",
        answer: "a perspectiva moral que julga acoes principalmente por seus resultados",
        why: "ela contrasta com eticas centradas no dever em si"
      },
      {
        lead: "a utilidade moral",
        answer: "o criterio de maximizar prazer, felicidade ou bem-estar",
        why: "no utilitarismo, a moralidade depende do saldo das consequencias"
      },
      {
        lead: "o calculo consequencial",
        answer: "a tentativa de comparar efeitos positivos e negativos de uma acao",
        why: "esse calculo orienta decisoes utilitaristas"
      },
      {
        lead: "a tensao entre dever e consequencia",
        answer: "o conflito entre agir por principio e agir visando melhores resultados",
        why: "essa oposicao estrutura varios debates eticos"
      }
    ]
  },
  {
    subtopico: "Liberdade, responsabilidade e dilema moral",
    habilidade:
      "analisar dilemas morais envolvendo liberdade, responsabilidade e decisao",
    tags: ["liberdade", "responsabilidade", "dilema moral"],
    fatos: [
      {
        lead: "a responsabilidade moral",
        answer: "a possibilidade de responder por escolhas e efeitos de atos praticados",
        why: "ela esta ligada a liberdade e consciencia da acao"
      },
      {
        lead: "o dilema moral",
        answer: "a situacao em que valores importantes entram em conflito na decisao",
        why: "esses casos exigem ponderacao e justificativa"
      },
      {
        lead: "a liberdade moral",
        answer: "a capacidade de escolher entre cursos de acao avaliando criterios eticos",
        why: "sem alguma liberdade, responsabilidade se enfraquece"
      },
      {
        lead: "a intencao da acao",
        answer: "o proposito com que alguem realiza determinado ato",
        why: "muitas teorias eticas consideram intencao relevante para o julgamento"
      },
      {
        lead: "a deliberacao moral",
        answer: "o processo de pensar antes de agir em situacoes de conflito etico",
        why: "ela procura integrar principios, contexto e consequencias"
      }
    ]
  },
  {
    subtopico: "Etica e cidadania",
    habilidade:
      "relacionar etica a cidadania, direitos humanos e vida publica",
    tags: ["cidadania", "justica", "vida publica"],
    fatos: [
      {
        lead: "a cidadania etica",
        answer: "a participacao na vida publica com respeito a direitos e deveres comuns",
        why: "agir eticamente tambem envolve conviver responsavelmente"
      },
      {
        lead: "o bem comum",
        answer: "o conjunto de condicoes que favorece vida digna para todos na coletividade",
        why: "ele orienta debates eticos e politicos"
      },
      {
        lead: "a justica social",
        answer: "a busca por relacoes mais equitativas na distribuicao de oportunidades e direitos",
        why: "ela aproxima etica e politica"
      },
      {
        lead: "a participacao cidada",
        answer: "o envolvimento do individuo nas decisoes e debates da vida coletiva",
        why: "cidadania nao se reduz a receber beneficios, mas implica agir publicamente"
      },
      {
        lead: "a corrupcao como problema etico",
        answer: "a violacao do interesse publico por uso indevido de posicoes e recursos",
        why: "ela enfraquece confianca e justica na vida social"
      }
    ]
  },
  {
    subtopico: "Direitos humanos",
    habilidade:
      "relacionar etica a cidadania, direitos humanos e vida publica",
    tags: ["direitos humanos", "dignidade", "igualdade"],
    fatos: [
      {
        lead: "os direitos humanos",
        answer: "as garantias basicas reconhecidas a toda pessoa por sua dignidade",
        why: "eles protegem liberdade, integridade e igualdade"
      },
      {
        lead: "a dignidade humana",
        answer: "o valor intrinseco atribuido a cada pessoa independentemente de condicao social",
        why: "esse principio fundamenta os direitos humanos"
      },
      {
        lead: "a universalidade dos direitos",
        answer: "a ideia de que certas garantias valem para todos os seres humanos",
        why: "ela combate exclusoes arbitrarias"
      },
      {
        lead: "a indivisibilidade dos direitos",
        answer: "a compreensao de que direitos civis, politicos e sociais se articulam",
        why: "nao faz sentido defender uns e negar outros completamente"
      },
      {
        lead: "a violacao de direitos humanos",
        answer: "o desrespeito a garantias fundamentais de pessoas e grupos",
        why: "ela exige denuncia, memoria e reparacao"
      }
    ]
  },
  {
    subtopico: "Bioetica",
    habilidade:
      "analisar aplicacoes da etica em temas contemporaneos como bioetica e tecnologia",
    tags: ["bioetica", "vida", "saude"],
    fatos: [
      {
        lead: "a bioetica",
        answer: "o campo que discute criterios eticos em questoes ligadas a vida, saude e biotecnologia",
        why: "ela trata de problemas trazidos pela medicina e pela ciencia"
      },
      {
        lead: "o consentimento informado",
        answer: "a autorizacao dada com conhecimento claro sobre procedimentos e riscos",
        why: "ele protege autonomia do paciente ou participante"
      },
      {
        lead: "o principio da beneficencia",
        answer: "a orientacao de agir buscando promover bem e evitar dano",
        why: "esse principio e central em discussoes bioeticas"
      },
      {
        lead: "a autonomia em bioetica",
        answer: "o respeito a capacidade da pessoa decidir sobre seu proprio corpo e tratamento",
        why: "ela limita paternalismos injustificados"
      },
      {
        lead: "o dilema bioetico",
        answer: "o conflito entre valores como vida, autonomia, cuidado e justica",
        why: "decisoes biomedicas frequentemente envolvem ponderacao dificil"
      }
    ]
  },
  {
    subtopico: "Etica profissional e digital",
    habilidade:
      "analisar aplicacoes da etica em temas contemporaneos como bioetica e tecnologia",
    tags: ["etica profissional", "etica digital", "tecnologia"],
    fatos: [
      {
        lead: "a etica profissional",
        answer: "o conjunto de principios que orienta conduta responsavel no exercicio de uma funcao",
        why: "ela relaciona competencia tecnica e compromisso moral"
      },
      {
        lead: "o sigilo profissional",
        answer: "o dever de proteger informacoes confiadas no exercicio de uma atividade",
        why: "ele preserva confianca e respeito ao outro"
      },
      {
        lead: "a etica digital",
        answer: "a reflexao sobre condutas adequadas no uso de tecnologias, dados e redes",
        why: "novos ambientes exigem novos cuidados morais"
      },
      {
        lead: "a privacidade digital",
        answer: "o direito de controle sobre informacoes pessoais em meios tecnologicos",
        why: "ela e cada vez mais ameacada por vigilancia e coleta de dados"
      },
      {
        lead: "a responsabilidade no ambiente virtual",
        answer: "o dever de responder por falas, compartilhamentos e impactos no uso das redes",
        why: "o mundo digital nao elimina compromisso etico"
      }
    ]
  },
  {
    subtopico: "Desafios eticos contemporaneos",
    habilidade:
      "analisar dilemas morais envolvendo liberdade, responsabilidade e decisao",
    tags: ["desafios eticos", "contemporaneidade", "sociedade"],
    fatos: [
      {
        lead: "o desafio etico contemporaneo",
        answer: "o problema de decidir em cenarios complexos marcados por tecnologia, desigualdade e pluralidade",
        why: "o presente produz conflitos morais novos e intensos"
      },
      {
        lead: "a tolerancia democratica",
        answer: "a disposicao de conviver com diferencas sem abrir mao de principios de dignidade e respeito",
        why: "sociedades plurais exigem esse equilibrio"
      },
      {
        lead: "a desinformacao como problema etico",
        answer: "a circulacao irresponsavel de falsidades que afetam pessoas e coletividades",
        why: "ela compromete verdade, confianca e deliberacao publica"
      },
      {
        lead: "o consumo responsavel",
        answer: "a escolha de praticas considerando impactos sociais e ambientais",
        why: "etica contemporanea tambem envolve estilo de vida e mercado"
      },
      {
        lead: "a atualidade da etica",
        answer: "a necessidade permanente de refletir criticamente sobre o que fazemos e por que fazemos",
        why: "nenhuma sociedade deixa de precisar de criterios para o agir"
      }
    ]
  }
];

export const etica = {
  id: "filosofia_etica",
  materia: "Filosofia",
  serie: [3],
  topico: "Etica",
  metadados: {
    disciplinaId: "filosofia",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Filosofia",
    frente: "Reflexao moral e dilemas do agir",
    searchAliases: [
      "etica",
      "moral e valores",
      "kant utilitarismo",
      "bioetica",
      "direitos humanos"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "diferenciar etica, moral e valor na reflexao filosofica",
      "compreender modelos classicos de reflexao etica sobre virtude e carater",
      "identificar correntes eticas baseadas em dever, consequencias e responsabilidade",
      "relacionar etica a cidadania, direitos humanos e vida publica",
      "analisar aplicacoes da etica em temas contemporaneos como bioetica e tecnologia"
    ],
    planejamentoQuestoes: PHILOSOPHY_HUNDRED_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "et",
    serie: 3,
    materia: "Filosofia",
    topico: "Etica",
    blocos,
    stemBuilders: PHILOSOPHY_STEM_BUILDERS,
    globalMatrix: PHILOSOPHY_HUNDRED_MATRIX
  })
};
