import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  CHEMISTRY_HUNDRED_FIFTY_MATRIX,
  CHEMISTRY_HUNDRED_FIFTY_PLAN,
  CHEMISTRY_STEM_BUILDERS
} from "../../../_shared/chemistryTopicPresets.js";

const blocos = [
  {
    subtopico: "Modelos atomicos iniciais",
    habilidade:
      "identificar a evolucao historica dos modelos atomicos",
    tags: ["modelos atomicos", "dalton", "thomson"],
    fatos: [
      {
        lead: "o modelo atomico de Dalton",
        answer: "a representacao do atomo como esfera macica, indivisivel e neutra",
        why: "Dalton explicava as substancias por atomos sem estrutura interna"
      },
      {
        lead: "o modelo atomico de Thomson",
        answer: "a proposta de uma esfera positiva com eletrons incrustados",
        why: "Thomson introduziu particulas subatomicas negativas no atomo"
      },
      {
        lead: "a superacao do modelo de Dalton",
        answer: "a descoberta de que o atomo possui estrutura interna e particulas menores",
        why: "experimentos posteriores mostraram que o atomo nao era indivisivel"
      },
      {
        lead: "o papel dos modelos atomicos",
        answer: "a tentativa de explicar propriedades da materia com base na estrutura do atomo",
        why: "modelos servem para interpretar dados e fenomenos quimicos"
      },
      {
        lead: "a contribuicao de Thomson",
        answer: "a evidencia de que o atomo contem eletrons",
        why: "isso alterou profundamente a concepcao de estrutura atomica"
      }
    ]
  },
  {
    subtopico: "Modelo de Rutherford",
    habilidade:
      "interpretar experimentos que levaram aos modelos nucleares do atomo",
    tags: ["rutherford", "nucleo", "lamina de ouro"],
    fatos: [
      {
        lead: "o experimento da lamina de ouro",
        answer: "o bombardeamento de uma folha metalica por particulas alfa",
        why: "ele revelou concentracao de massa e carga positiva em pequena regiao"
      },
      {
        lead: "o modelo de Rutherford",
        answer: "a proposta de um nucleo pequeno e positivo com eletrosfera ao redor",
        why: "o atomo passou a ser visto como majoritariamente espaco vazio"
      },
      {
        lead: "o nucleo atomico",
        answer: "a regiao central do atomo que concentra quase toda a massa",
        why: "protons e neutrons localizam-se nessa parte"
      },
      {
        lead: "a eletrosfera",
        answer: "a regiao externa do atomo onde se encontram os eletrons",
        why: "ela circunda o nucleo e participa das interacoes quimicas"
      },
      {
        lead: "o desvio de algumas particulas alfa",
        answer: "a evidencia de repulsao por uma regiao pequena e positiva no atomo",
        why: "isso apoiou a ideia de nucleo concentrado"
      }
    ]
  },
  {
    subtopico: "Modelo de Bohr",
    habilidade:
      "relacionar niveis de energia e transicoes eletronicas ao modelo de Bohr",
    tags: ["bohr", "niveis de energia", "salto quantico"],
    fatos: [
      {
        lead: "o modelo de Bohr",
        answer: "a proposta de eletrons distribuidos em niveis de energia quantizados",
        why: "Bohr explicou estabilidade e emissao de luz pelo atomo"
      },
      {
        lead: "os niveis de energia",
        answer: "as camadas discretas em que os eletrons podem ocupar posicoes ao redor do nucleo",
        why: "nem toda energia e permitida para o eletron"
      },
      {
        lead: "o salto quantico",
        answer: "a mudanca de um eletron entre niveis energeticos diferentes",
        why: "essa transicao envolve absorcao ou emissao de energia"
      },
      {
        lead: "a emissao de luz no modelo de Bohr",
        answer: "a liberacao de energia quando o eletron retorna a um nivel mais baixo",
        why: "o excesso energetico e emitido em forma de radiacao"
      },
      {
        lead: "a absorcao de energia",
        answer: "o ganho energetico que permite ao eletron ocupar nivel mais externo",
        why: "sem absorver energia suficiente nao ocorre excitacao"
      }
    ]
  },
  {
    subtopico: "Particulas subatomicas",
    habilidade:
      "identificar composicao e cargas das particulas subatomicas",
    tags: ["protons", "neutrons", "eletrons"],
    fatos: [
      {
        lead: "o proton",
        answer: "a particula subatomica de carga positiva localizada no nucleo",
        why: "o numero de protons define o elemento quimico"
      },
      {
        lead: "o neutron",
        answer: "a particula sem carga eletrica localizada no nucleo",
        why: "ele contribui para a massa atomica e estabilidade nuclear"
      },
      {
        lead: "o eletron",
        answer: "a particula de carga negativa presente na eletrosfera",
        why: "ele participa diretamente das ligacoes e transformacoes quimicas"
      },
      {
        lead: "o numero atomico",
        answer: "a quantidade de protons presente no nucleo de um atomo",
        why: "esse numero identifica unicamente o elemento"
      },
      {
        lead: "o numero de massa",
        answer: "a soma de protons e neutrons no nucleo",
        why: "ele representa aproximadamente a massa do atomo"
      }
    ]
  },
  {
    subtopico: "Numero atomico e numero de massa",
    habilidade:
      "calcular numero atomico, numero de massa e composicao do atomo",
    tags: ["numero atomico", "numero de massa", "composicao atomica"],
    fatos: [
      {
        lead: "a representacao Z",
        answer: "o simbolo usado para indicar o numero atomico de um elemento",
        why: "Z corresponde ao total de protons"
      },
      {
        lead: "a representacao A",
        answer: "o simbolo usado para indicar o numero de massa de um atomo",
        why: "A corresponde a protons mais neutrons"
      },
      {
        lead: "a quantidade de neutrons",
        answer: "a diferenca entre numero de massa e numero atomico",
        why: "n = A - Z permite determinar neutrons"
      },
      {
        lead: "um atomo neutro",
        answer: "a especie em que o numero de protons e igual ao de eletrons",
        why: "nessa condicao a carga total do atomo e nula"
      },
      {
        lead: "a notacao isotopica",
        answer: "a forma de representar simbolo do elemento com numero atomico e de massa",
        why: "ela organiza informacoes fundamentais sobre o atomo"
      }
    ]
  },
  {
    subtopico: "Isotopos, isobaros e isotonos",
    habilidade:
      "comparar especies atomicas segundo numero atomico, massa e neutrons",
    tags: ["isotopos", "isobaros", "isotonos"],
    fatos: [
      {
        lead: "os isotopos",
        answer: "atomos do mesmo elemento com diferente numero de neutrons",
        why: "eles possuem igual numero atomico e diferente massa"
      },
      {
        lead: "os isobaros",
        answer: "atomos de elementos diferentes com o mesmo numero de massa",
        why: "nesse caso o valor de A coincide, mas Z muda"
      },
      {
        lead: "os isotonos",
        answer: "atomos de elementos diferentes com o mesmo numero de neutrons",
        why: "eles diferem em protons, mas mantem n igual"
      },
      {
        lead: "a diferenca entre isotopos e isobaros",
        answer: "o fato de isotopos terem mesmo Z e isobaros terem mesmo A",
        why: "a comparacao depende da grandeza escolhida"
      },
      {
        lead: "a massa diferente entre isotopos",
        answer: "a consequencia da variacao no numero de neutrons",
        why: "mais neutrons significam maior numero de massa"
      }
    ]
  },
  {
    subtopico: "Ions e eletrizacao",
    habilidade:
      "analisar formacao de ions por perda ou ganho de eletrons",
    tags: ["ions", "cation", "anion"],
    fatos: [
      {
        lead: "o cation",
        answer: "o ion positivo formado pela perda de eletrons",
        why: "ao perder cargas negativas a especie fica positiva"
      },
      {
        lead: "o anion",
        answer: "o ion negativo formado pelo ganho de eletrons",
        why: "o excesso de eletrons torna a carga total negativa"
      },
      {
        lead: "a ionizacao",
        answer: "o processo de formacao de ion positivo por perda de eletrons",
        why: "esse termo costuma ser associado a formacao de cations"
      },
      {
        lead: "a afinidade eletrica com carga",
        answer: "a tendencia de algumas especies a ganhar ou perder eletrons",
        why: "isso depende da estabilidade eletronica buscada"
      },
      {
        lead: "a carga do ion",
        answer: "o resultado da diferenca entre protons e eletrons da especie",
        why: "desbalanceamentos eletricos determinam o sinal do ion"
      }
    ]
  },
  {
    subtopico: "Distribuicao eletronica",
    habilidade:
      "relacionar distribuicao eletronica a camadas e subniveis de energia",
    tags: ["distribuicao eletronica", "camadas", "subniveis"],
    fatos: [
      {
        lead: "a distribuicao eletronica",
        answer: "a organizacao dos eletrons em camadas e subniveis de energia",
        why: "ela indica como a eletrosfera e ocupada"
      },
      {
        lead: "as camadas eletronicas",
        answer: "os niveis principais de energia ao redor do nucleo",
        why: "elas sao tradicionalmente identificadas por K, L, M e assim por diante"
      },
      {
        lead: "os subniveis s, p, d e f",
        answer: "as subdivisoes das camadas segundo capacidade e energia",
        why: "cada subnivel comporta quantidade especifica de eletrons"
      },
      {
        lead: "a camada de valencia",
        answer: "a camada mais externa ocupada por eletrons em um atomo",
        why: "ela influencia fortemente o comportamento quimico"
      },
      {
        lead: "a regra de preenchimento energetico",
        answer: "o criterio de ocupar primeiro subniveis de menor energia",
        why: "a distribuicao eletronica segue ordem energetica"
      }
    ]
  },
  {
    subtopico: "Camada de valencia",
    habilidade:
      "relacionar distribuicao eletronica a propriedades quimicas dos elementos",
    tags: ["camada de valencia", "valencia", "reatividade"],
    fatos: [
      {
        lead: "a camada de valencia",
        answer: "a regiao externa do atomo que concentra os eletrons mais envolvidos em ligacoes",
        why: "esses eletrons interagem mais facilmente com outras especies"
      },
      {
        lead: "os eletrons de valencia",
        answer: "os eletrons presentes na camada mais externa ocupada",
        why: "eles determinam varias propriedades quimicas"
      },
      {
        lead: "a relacao entre valencia e grupo",
        answer: "a semelhanca entre elementos de uma mesma familia quanto aos eletrons externos",
        why: "essa regularidade ajuda a prever comportamento"
      },
      {
        lead: "a estabilidade eletronica",
        answer: "a tendencia de atingir arranjo externo mais energeticamente favoravel",
        why: "muitos elementos buscam configuracoes semelhantes a gases nobres"
      },
      {
        lead: "a reatividade de um elemento",
        answer: "a facilidade com que sua camada de valencia participa de transformacoes",
        why: "ela depende do arranjo e do numero de eletrons externos"
      }
    ]
  },
  {
    subtopico: "Radioatividade e aplicacoes",
    habilidade:
      "identificar nocoes basicas de estabilidade nuclear e radioatividade",
    tags: ["radioatividade", "nucleo", "radiacao"],
    fatos: [
      {
        lead: "a radioatividade",
        answer: "a emissao espontanea de radiacao por nucleos instaveis",
        why: "alguns nucleos sofrem transformacoes para atingir maior estabilidade"
      },
      {
        lead: "a instabilidade nuclear",
        answer: "a condicao de nucleos com arranjo desfavoravel de particulas",
        why: "nessa situacao pode ocorrer emissao radioativa"
      },
      {
        lead: "a radiacao alfa",
        answer: "a emissao de particulas formadas por dois protons e dois neutrons",
        why: "ela reduz massa e numero atomico do nucleo emissor"
      },
      {
        lead: "a radiacao beta",
        answer: "a emissao associada a transformacoes internas envolvendo eletrons ou positrons",
        why: "ela altera o numero atomico sem mudar o numero de massa"
      },
      {
        lead: "as aplicacoes da radioatividade",
        answer: "o uso controlado de emissoes nucleares em medicina, industria e pesquisa",
        why: "radiacoes possuem utilidade quando manipuladas com seguranca"
      }
    ]
  }
];

export const estruturaAtomica = {
  id: "quimica_estrutura_atomica",
  materia: "Quimica",
  serie: [1],
  topico: "Estrutura Atomica",
  metadados: {
    disciplinaId: "quimica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Quimica",
    frente: "Estrutura da materia e modelos atomicos",
    searchAliases: [
      "estrutura atomica",
      "modelos atomicos",
      "particulas subatomicas",
      "distribuicao eletronica",
      "radioatividade"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar a evolucao historica dos modelos atomicos",
      "interpretar experimentos que levaram aos modelos nucleares do atomo",
      "identificar composicao e cargas das particulas subatomicas",
      "calcular numero atomico, numero de massa e composicao do atomo",
      "relacionar distribuicao eletronica a propriedades quimicas dos elementos"
    ],
    planejamentoQuestoes: CHEMISTRY_HUNDRED_FIFTY_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "ea",
    serie: 1,
    materia: "Quimica",
    topico: "Estrutura Atomica",
    blocos,
    stemBuilders: CHEMISTRY_STEM_BUILDERS,
    globalMatrix: CHEMISTRY_HUNDRED_FIFTY_MATRIX
  })
};

