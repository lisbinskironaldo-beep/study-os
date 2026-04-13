import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  PHILOSOPHY_HUNDRED_MATRIX,
  PHILOSOPHY_HUNDRED_PLAN,
  PHILOSOPHY_STEM_BUILDERS
} from "../../../_shared/philosophyTopicPresets.js";

const blocos = [
  {
    subtopico: "Contexto da filosofia contemporanea",
    habilidade:
      "compreender o contexto historico e intelectual da filosofia contemporanea",
    tags: ["filosofia contemporanea", "modernidade tardia", "crise"],
    fatos: [
      {
        lead: "a filosofia contemporanea",
        answer: "o conjunto de correntes que responde aos impasses politicos, cientificos e culturais do mundo recente",
        why: "ela nasce em contexto de industrializacao, massas e crises da modernidade"
      },
      {
        lead: "a crise de fundamentos no pensamento contemporaneo",
        answer: "a desconfianca diante de certezas absolutas sobre sujeito, historia e verdade",
        why: "muitas correntes passam a revisar bases da filosofia moderna"
      },
      {
        lead: "a pluralidade contemporanea",
        answer: "a coexistencia de diferentes escolas e problemas filosoficos sem unidade unica",
        why: "o pensamento contemporaneo e marcado por diversidade de abordagens"
      },
      {
        lead: "o impacto das transformacoes sociais modernas",
        answer: "a influencia de capitalismo, tecnica e politica de massas sobre a reflexao filosofica",
        why: "esses processos alteram temas e urgencias do pensamento"
      },
      {
        lead: "a critica filosofica do presente",
        answer: "a tentativa de compreender formas atuais de poder, subjetividade e vida social",
        why: "a filosofia contemporanea interroga o proprio tempo"
      }
    ]
  },
  {
    subtopico: "Marx e a critica da sociedade",
    habilidade:
      "identificar conceitos de critica social presentes na filosofia contemporanea",
    tags: ["marx", "critica social", "trabalho"],
    fatos: [
      {
        lead: "a critica marxiana do capitalismo",
        answer: "a analise das desigualdades e exploracoes produzidas pela sociedade capitalista",
        why: "Marx liga economia, classes e alienacao"
      },
      {
        lead: "a alienacao em Marx",
        answer: "a separacao do trabalhador em relacao ao produto, ao processo e a si mesmo",
        why: "o trabalho deixa de ser realizacao humana e vira imposicao externa"
      },
      {
        lead: "a luta de classes",
        answer: "o conflito entre grupos sociais com interesses economicos opostos",
        why: "essa luta impulsiona transformacoes historicas"
      },
      {
        lead: "a ideologia em Marx",
        answer: "o conjunto de ideias que oculta e legitima relacoes de dominacao",
        why: "ela faz parecer natural o que e historicamente construido"
      },
      {
        lead: "o materialismo historico",
        answer: "a interpretacao da historia a partir das condicoes materiais e das relacoes de producao",
        why: "ela destaca o papel da economia na vida social"
      }
    ]
  },
  {
    subtopico: "Nietzsche e a genealogia",
    habilidade:
      "identificar conceitos de critica social presentes na filosofia contemporanea",
    tags: ["nietzsche", "genealogia", "moral"],
    fatos: [
      {
        lead: "a genealogia em Nietzsche",
        answer: "o metodo de investigar a origem historica dos valores e conceitos",
        why: "ele busca mostrar que valores nao sao eternos nem neutros"
      },
      {
        lead: "a critica nietzschiana a moral tradicional",
        answer: "a denuncia de valores que enfraquecem a afirmacao da vida",
        why: "Nietzsche questiona fundamentos da moral dominante"
      },
      {
        lead: "o niilismo",
        answer: "a experiencia de perda ou esvaziamento de valores supremos",
        why: "ela marca a crise cultural do Ocidente segundo Nietzsche"
      },
      {
        lead: "a vontade de potencia",
        answer: "a forca afirmativa de expansao e criacao presente na vida",
        why: "o conceito expressa dinamismo e superacao"
      },
      {
        lead: "o alem-do-homem",
        answer: "a imagem de superacao de valores decadentes por criacao de novos modos de viver",
        why: "ela simboliza autotransformacao afirmativa"
      }
    ]
  },
  {
    subtopico: "Fenomenologia",
    habilidade:
      "compreender correntes contemporaneas voltadas a experiencia, linguagem e subjetividade",
    tags: ["fenomenologia", "experiencia", "consciencia"],
    fatos: [
      {
        lead: "a fenomenologia",
        answer: "a corrente que descreve a experiencia tal como ela aparece a consciencia",
        why: "ela busca voltar aos fenomenos antes de explicacoes precipitadas"
      },
      {
        lead: "a intencionalidade da consciencia",
        answer: "a ideia de que toda consciencia e consciencia de algo",
        why: "a experiencia esta sempre orientada para um objeto"
      },
      {
        lead: "a descricao fenomenologica",
        answer: "o metodo de analisar como algo se manifesta a experiencia",
        why: "ela privilegia descricao rigorosa do vivido"
      },
      {
        lead: "o fenomeno",
        answer: "aquilo que se mostra a consciencia na experiencia",
        why: "a fenomenologia parte do aparecer das coisas"
      },
      {
        lead: "a suspensao de juizos na fenomenologia",
        answer: "o cuidado de nao pressupor explicacoes prontas sobre a realidade",
        why: "isso ajuda a examinar a experiencia de modo mais atento"
      }
    ]
  },
  {
    subtopico: "Filosofia da linguagem",
    habilidade:
      "compreender correntes contemporaneas voltadas a experiencia, linguagem e subjetividade",
    tags: ["linguagem", "significado", "filosofia analitica"],
    fatos: [
      {
        lead: "a filosofia da linguagem",
        answer: "o campo que investiga sentido, referencia e uso das palavras",
        why: "muitos problemas filosoficos passam a ser pensados a partir da linguagem"
      },
      {
        lead: "o significado linguistico",
        answer: "o modo como palavras e enunciados produzem sentido em contextos de uso",
        why: "na filosofia contemporanea, linguagem nao e mero espelho transparente do mundo"
      },
      {
        lead: "o uso da linguagem",
        answer: "a pratica concreta em que expressoes ganham funcao e sentido",
        why: "o contexto de uso pode alterar interpretacao"
      },
      {
        lead: "a analise conceitual",
        answer: "o exame cuidadoso dos termos empregados em argumentos e teorias",
        why: "ela evita ambiguidades e confusoes conceituais"
      },
      {
        lead: "o problema da referencia",
        answer: "a questao de como palavras se relacionam com objetos e estados de coisas",
        why: "esse debate tornou-se central em parte da filosofia contemporanea"
      }
    ]
  },
  {
    subtopico: "Escola de Frankfurt",
    habilidade:
      "identificar conceitos de critica social presentes na filosofia contemporanea",
    tags: ["frankfurt", "teoria critica", "industria cultural"],
    fatos: [
      {
        lead: "a Escola de Frankfurt",
        answer: "o grupo de pensadores que desenvolveu a teoria critica da sociedade moderna",
        why: "eles investigaram dominacao, cultura e racionalidade instrumental"
      },
      {
        lead: "a teoria critica",
        answer: "a abordagem que analisa sociedade para revelar formas de dominacao e possibilidades de emancipacao",
        why: "ela une filosofia e critica social"
      },
      {
        lead: "a industria cultural",
        answer: "a producao massificada de cultura como mercadoria e instrumento de conformismo",
        why: "o conceito foi usado para criticar padronizacao cultural"
      },
      {
        lead: "a racionalidade instrumental",
        answer: "o uso da razao apenas como calculo de eficiencia e controle",
        why: "a Escola de Frankfurt critica a reducao da razao a utilidade tecnica"
      },
      {
        lead: "a emancipacao na teoria critica",
        answer: "a superacao de formas de alienacao e dominacao social",
        why: "a critica busca transformar e nao apenas descrever o mundo"
      }
    ]
  },
  {
    subtopico: "Estruturalismo e pos-estruturalismo",
    habilidade:
      "compreender correntes contemporaneas voltadas a experiencia, linguagem e subjetividade",
    tags: ["estruturalismo", "pos-estruturalismo", "estrutura"],
    fatos: [
      {
        lead: "o estruturalismo",
        answer: "a perspectiva que busca compreender fenomenos a partir de estruturas subjacentes",
        why: "ela privilegia relacoes e sistemas mais do que elementos isolados"
      },
      {
        lead: "a estrutura",
        answer: "o conjunto organizado de relacoes que produz sentido em um sistema",
        why: "esse conceito e central para o estruturalismo"
      },
      {
        lead: "o pos-estruturalismo",
        answer: "a tendencia que critica fixidez de estruturas e enfatiza diferenca e historicidade",
        why: "ela desestabiliza totalidades fechadas"
      },
      {
        lead: "a instabilidade do sentido",
        answer: "a tese de que significados nao sao totalmente fixos e imutaveis",
        why: "ela aparece em diversas leituras pos-estruturalistas"
      },
      {
        lead: "a critica a essencias fixas",
        answer: "a recusa de identidades totalmente estaveis e universais",
        why: "o pensamento contemporaneo problematiza naturalizacoes"
      }
    ]
  },
  {
    subtopico: "Poder e subjetividade",
    habilidade:
      "analisar relacoes entre poder, subjetividade e sociedade no pensamento recente",
    tags: ["poder", "subjetividade", "controle social"],
    fatos: [
      {
        lead: "o poder como relacao",
        answer: "a ideia de que poder circula em praticas, instituicoes e discursos",
        why: "ele nao se reduz apenas ao Estado ou a um soberano"
      },
      {
        lead: "a subjetividade",
        answer: "o modo como os individuos se constituem e se compreendem",
        why: "ela e historicamente produzida e nao puramente natural"
      },
      {
        lead: "a disciplina social",
        answer: "o conjunto de tecnicas que organizam corpos e comportamentos",
        why: "instituicoes modernas podem moldar condutas de forma difusa"
      },
      {
        lead: "o discurso",
        answer: "a forma socialmente organizada de produzir saber e verdade sobre algo",
        why: "discursos tambem participam de relacoes de poder"
      },
      {
        lead: "a critica contemporanea da normalizacao",
        answer: "a analise de mecanismos que definem padroes e excluem diferencas",
        why: "essa critica observa como sociedade produz conformidade"
      }
    ]
  },
  {
    subtopico: "Tecnica e sociedade de massas",
    habilidade:
      "analisar relacoes entre poder, subjetividade e sociedade no pensamento recente",
    tags: ["tecnica", "massas", "tecnologia"],
    fatos: [
      {
        lead: "a tecnica moderna",
        answer: "o conjunto de meios e procedimentos que ampliam controle e producao na sociedade",
        why: "ela influencia trabalho, politica e vida cotidiana"
      },
      {
        lead: "a sociedade de massas",
        answer: "o contexto em que producao, cultura e politica alcancam escala ampliada de populacoes",
        why: "isso gera novos problemas de manipulacao e participacao"
      },
      {
        lead: "a massificacao cultural",
        answer: "a circulacao padronizada de bens simbolicos para grande publico",
        why: "esse processo pode simplificar experiencias e gostos"
      },
      {
        lead: "o impacto filosofico da tecnologia",
        answer: "a necessidade de pensar como tecnicas alteram relacoes humanas e visao de mundo",
        why: "tecnologia nao e apenas instrumento neutro"
      },
      {
        lead: "a critica da alienacao tecnologica",
        answer: "a preocupacao com usos da tecnica que reduzem autonomia humana",
        why: "pensadores contemporaneos problematizam dependencia e controle"
      }
    ]
  },
  {
    subtopico: "Legados e desafios contemporaneos",
    habilidade:
      "avaliar a atualidade dos problemas filosoficos contemporaneos",
    tags: ["atualidade", "desafios contemporaneos", "legado"],
    fatos: [
      {
        lead: "o legado da filosofia contemporanea",
        answer: "a ampliacao da critica sobre poder, linguagem, historia e subjetividade",
        why: "ela diversificou fortemente os temas filosoficos"
      },
      {
        lead: "a atualidade da critica social",
        answer: "a permanencia de desigualdades e mecanismos de dominacao como problema filosofico",
        why: "o presente ainda exige diagnostico e reflexao"
      },
      {
        lead: "o desafio da pluralidade",
        answer: "a necessidade de pensar diferencas culturais e identitarias sem reduzi-las a um modelo unico",
        why: "esse tema ganhou grande peso no pensamento recente"
      },
      {
        lead: "a reflexao sobre democracia e verdade",
        answer: "o exame de como sociedades lidam com informacao, poder e decisao coletiva",
        why: "esses problemas se intensificam no mundo atual"
      },
      {
        lead: "a funcao critica da filosofia hoje",
        answer: "interrogar discursos, instituicoes e habitos do presente",
        why: "a filosofia continua relevante quando questiona o que parece natural"
      }
    ]
  }
];

export const filosofiaContemporanea = {
  id: "filosofia_filosofia_contemporanea",
  materia: "Filosofia",
  serie: [3],
  topico: "Filosofia Contemporanea",
  metadados: {
    disciplinaId: "filosofia",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Filosofia",
    frente: "Critica social, linguagem e subjetividade",
    searchAliases: [
      "filosofia contemporanea",
      "marx nietzsche",
      "fenomenologia",
      "escola de frankfurt",
      "poder e subjetividade"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "compreender o contexto historico e intelectual da filosofia contemporanea",
      "identificar conceitos de critica social presentes na filosofia contemporanea",
      "compreender correntes contemporaneas voltadas a experiencia, linguagem e subjetividade",
      "analisar relacoes entre poder, subjetividade e sociedade no pensamento recente",
      "avaliar a atualidade dos problemas filosoficos contemporaneos"
    ],
    planejamentoQuestoes: PHILOSOPHY_HUNDRED_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "fc",
    serie: 3,
    materia: "Filosofia",
    topico: "Filosofia Contemporanea",
    blocos,
    stemBuilders: PHILOSOPHY_STEM_BUILDERS,
    globalMatrix: PHILOSOPHY_HUNDRED_MATRIX
  })
};
