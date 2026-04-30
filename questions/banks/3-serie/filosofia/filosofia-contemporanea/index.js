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
        answer: "a desconfianca diante de certezas absolutas sobre sujeito, história e verdade",
        why: "muitas correntes passam a revisar bases da filosofia moderna"
      },
      {
        lead: "a pluralidade contemporanea",
        answer: "a coexistencia de diferentes escolas e problemas filosoficos sem unidade unica",
        why: "o pensamento contemporaneo e marcado por diversidade de abordagens"
      },
      {
        lead: "o impacto das transformacoes sociais modernas",
        answer: "a influência de capitalismo, técnica e política de massas sobre a reflexão filosófica",
        why: "esses processos alteram temas e urgencias do pensamento"
      },
      {
        lead: "a crítica filosófica do presente",
        answer: "a tentativa de compreender formas atuais de poder, subjetividade e vida social",
        why: "a filosofia contemporanea interroga o próprio tempo"
      }
    ]
  },
  {
    subtopico: "Marx é a crítica da sociedade",
    habilidade:
      "identificar conceitos de crítica social presentes na filosofia contemporanea",
    tags: ["marx", "crítica social", "trabalho"],
    fatos: [
      {
        lead: "a crítica marxiana do capitalismo",
        answer: "a análise das desigualdades e explorações produzidas pela sociedade capitalista",
        why: "Marx liga economia, classes e alienacao"
      },
      {
        lead: "a alienacao em Marx",
        answer: "a separacao do trabalhador em relação ao produto, ao processo é a si mesmo",
        why: "o trabalho deixa de ser realizacao humana e vira imposicao externa"
      },
      {
        lead: "a luta de classes",
        answer: "o conflito entre grupos sociais com interesses economicos opostos",
        why: "essa luta impulsiona transformacoes historicas"
      },
      {
        lead: "a ideologia em Marx",
        answer: "o conjunto de ideias que oculta e legitima relações de dominacao",
        why: "ela faz parecer natural o que é historicamente construido"
      },
      {
        lead: "o materialismo historico",
        answer: "a interpretação da história a partir das condicoes materiais e das relações de produção",
        why: "ela destaca o papel da economia na vida social"
      }
    ]
  },
  {
    subtopico: "Nietzsche é a genealogia",
    habilidade:
      "identificar conceitos de crítica social presentes na filosofia contemporanea",
    tags: ["nietzsche", "genealogia", "moral"],
    fatos: [
      {
        lead: "a genealogia em Nietzsche",
        answer: "o metodo de investigar a origem historica dos valores e conceitos",
        why: "ele busca mostrar que valores não são eternos nem neutros"
      },
      {
        lead: "a crítica nietzschiana a moral tradicional",
        answer: "a denuncia de valores que enfraquecem a afirmacao da vida",
        why: "Nietzsche questiona fundamentos da moral dominante"
      },
      {
        lead: "o niilismo",
        answer: "a experiência de perda ou esvaziamento de valores supremos",
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
      "compreender correntes contemporaneas voltadas a experiência, linguagem e subjetividade",
    tags: ["fenomenologia", "experiencia", "consciencia"],
    fatos: [
      {
        lead: "a fenomenologia",
        answer: "a corrente que descreve a experiência tal como ela aparece a consciência",
        why: "ela busca voltar aos fenômenos antes de explicações precipitadas"
      },
      {
        lead: "a intencionalidade da consciência",
        answer: "a ideia de que toda consciência e consciência de algo",
        why: "a experiência esta sempre orientada para um objeto"
      },
      {
        lead: "a descricao fenomenologica",
        answer: "o metodo de analisar como algo se manifesta a experiência",
        why: "ela privilegia descricao rigorosa do vivido"
      },
      {
        lead: "o fenomeno",
        answer: "aquilo que se mostra a consciência na experiência",
        why: "a fenomenologia parte do aparecer das coisas"
      },
      {
        lead: "a suspensao de juizos na fenomenologia",
        answer: "o cuidado de não pressupor explicações prontas sobre a realidade",
        why: "isso ajuda a examinar a experiência de modo mais atento"
      }
    ]
  },
  {
    subtopico: "Filosofia da linguagem",
    habilidade:
      "compreender correntes contemporaneas voltadas a experiência, linguagem e subjetividade",
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
        why: "na filosofia contemporanea, linguagem não é mero espelho transparente do mundo"
      },
      {
        lead: "o uso da linguagem",
        answer: "a prática concreta em que expressoes ganham função e sentido",
        why: "o contexto de uso pode alterar interpretação"
      },
      {
        lead: "a análise conceitual",
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
      "identificar conceitos de crítica social presentes na filosofia contemporanea",
    tags: ["frankfurt", "teoria crítica", "industria cultural"],
    fatos: [
      {
        lead: "a Escola de Frankfurt",
        answer: "o grupo de pensadores que desenvolveu a teoria crítica da sociedade moderna",
        why: "eles investigaram dominacao, cultura e racionalidade instrumental"
      },
      {
        lead: "a teoria crítica",
        answer: "a abordagem que analisa sociedade para revelar formas de dominacao e possibilidades de emancipacao",
        why: "ela une filosofia e crítica social"
      },
      {
        lead: "a industria cultural",
        answer: "a produção massificada de cultura como mercadoria e instrumento de conformismo",
        why: "o conceito foi usado para criticar padronizacao cultural"
      },
      {
        lead: "a racionalidade instrumental",
        answer: "o uso da razão apenas como calculo de eficiencia e controle",
        why: "a Escola de Frankfurt crítica a reducao da razão a utilidade técnica"
      },
      {
        lead: "a emancipacao na teoria crítica",
        answer: "a superacao de formas de alienacao e dominacao social",
        why: "a crítica busca transformar e não apenas descrever o mundo"
      }
    ]
  },
  {
    subtopico: "Estruturalismo e pos-estruturalismo",
    habilidade:
      "compreender correntes contemporaneas voltadas a experiência, linguagem e subjetividade",
    tags: ["estruturalismo", "pos-estruturalismo", "estrutura"],
    fatos: [
      {
        lead: "o estruturalismo",
        answer: "a perspectiva que busca compreender fenômenos a partir de estruturas subjacentes",
        why: "ela privilegia relações e sistemas mais do que elementos isolados"
      },
      {
        lead: "a estrutura",
        answer: "o conjunto organizado de relações que produz sentido em um sistema",
        why: "esse conceito é central para o estruturalismo"
      },
      {
        lead: "o pos-estruturalismo",
        answer: "a tendencia que crítica fixidez de estruturas e enfatiza diferenca e historicidade",
        why: "ela desestabiliza totalidades fechadas"
      },
      {
        lead: "a instabilidade do sentido",
        answer: "a tese de que significados não são totalmente fixos e imutaveis",
        why: "ela aparece em diversas leituras pos-estruturalistas"
      },
      {
        lead: "a crítica a essencias fixas",
        answer: "a recusa de identidades totalmente estaveis e universais",
        why: "o pensamento contemporaneo problematiza naturalizacoes"
      }
    ]
  },
  {
    subtopico: "Poder e subjetividade",
    habilidade:
      "analisar relações entre poder, subjetividade e sociedade no pensamento recente",
    tags: ["poder", "subjetividade", "controle social"],
    fatos: [
      {
        lead: "o poder como relação",
        answer: "a ideia de que poder circula em praticas, instituicoes e discursos",
        why: "ele não se reduz apenas ao Estado ou a um soberano"
      },
      {
        lead: "a subjetividade",
        answer: "o modo como os individuos se constituem e se compreendem",
        why: "ela é historicamente produzida e não puramente natural"
      },
      {
        lead: "a disciplina social",
        answer: "o conjunto de técnicas que organizam corpos e comportamentos",
        why: "instituicoes modernas podem moldar condutas de forma difusa"
      },
      {
        lead: "o discurso",
        answer: "a forma socialmente organizada de produzir saber e verdade sobre algo",
        why: "discursos também participam de relações de poder"
      },
      {
        lead: "a crítica contemporanea da normalizacao",
        answer: "a análise de mecanismos que definem padroes e excluem diferencas",
        why: "essa crítica observa como sociedade produz conformidade"
      }
    ]
  },
  {
    subtopico: "Técnica e sociedade de massas",
    habilidade:
      "analisar relações entre poder, subjetividade e sociedade no pensamento recente",
    tags: ["tecnica", "massas", "tecnologia"],
    fatos: [
      {
        lead: "a técnica moderna",
        answer: "o conjunto de meios e procedimentos que ampliam controle e produção na sociedade",
        why: "ela influência trabalho, política e vida cotidiana"
      },
      {
        lead: "a sociedade de massas",
        answer: "o contexto em que produção, cultura e política alcancam escala ampliada de populacoes",
        why: "isso gera novos problemas de manipulacao e participacao"
      },
      {
        lead: "a massificacao cultural",
        answer: "a circulacao padronizada de bens simbolicos para grande publico",
        why: "esse processo pode simplificar experiencias e gostos"
      },
      {
        lead: "o impacto filosófico da tecnologia",
        answer: "a necessidade de pensar como técnicas alteram relações humanas e visao de mundo",
        why: "tecnologia não é apenas instrumento neutro"
      },
      {
        lead: "a crítica da alienacao tecnologica",
        answer: "a preocupacao com usos da técnica que reduzem autonomia humana",
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
        answer: "a ampliacao da crítica sobre poder, linguagem, história e subjetividade",
        why: "ela diversificou fortemente os temas filosoficos"
      },
      {
        lead: "a atualidade da crítica social",
        answer: "a permanencia de desigualdades e mecanismos de dominacao como problema filosófico",
        why: "o presente ainda exige diagnostico e reflexão"
      },
      {
        lead: "o desafio da pluralidade",
        answer: "a necessidade de pensar diferencas culturais e identitarias sem reduzi-las a um modelo unico",
        why: "esse tema ganhou grande peso no pensamento recente"
      },
      {
        lead: "a reflexão sobre democracia e verdade",
        answer: "o exame de como sociedades lidam com informacao, poder e decisão coletiva",
        why: "esses problemas se intensificam no mundo atual"
      },
      {
        lead: "a função crítica da filosofia hoje",
        answer: "interrogar discursos, instituicoes e hábitos do presente",
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
    frente: "Crítica social, linguagem e subjetividade",
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
      "identificar conceitos de crítica social presentes na filosofia contemporanea",
      "compreender correntes contemporaneas voltadas a experiência, linguagem e subjetividade",
      "analisar relações entre poder, subjetividade e sociedade no pensamento recente",
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
