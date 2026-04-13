import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  CHEMISTRY_HUNDRED_FIFTY_MATRIX,
  CHEMISTRY_HUNDRED_FIFTY_PLAN,
  CHEMISTRY_STEM_BUILDERS
} from "../../../_shared/chemistryTopicPresets.js";

const blocos = [
  {
    subtopico: "Organizacao da tabela periodica",
    habilidade:
      "identificar criterios de organizacao da tabela periodica",
    tags: ["tabela periodica", "organizacao", "elementos"],
    fatos: [
      {
        lead: "a tabela periodica",
        answer: "a organizacao dos elementos quimicos em ordem crescente de numero atomico",
        why: "essa disposicao evidencia regularidades de propriedades"
      },
      {
        lead: "o numero atomico na tabela",
        answer: "o criterio fundamental usado na ordenacao moderna dos elementos",
        why: "elementos sao posicionados segundo total de protons"
      },
      {
        lead: "o periodo na tabela periodica",
        answer: "a linha horizontal que indica o numero de camadas ocupadas",
        why: "elementos de um mesmo periodo possuem mesmo numero de niveis"
      },
      {
        lead: "o grupo ou familia",
        answer: "a coluna vertical que reune elementos com propriedades semelhantes",
        why: "isso decorre da semelhanca na camada de valencia"
      },
      {
        lead: "a periodicidade",
        answer: "a repeticao regular de propriedades ao longo da tabela",
        why: "ela justifica o nome tabela periodica"
      }
    ]
  },
  {
    subtopico: "Familias e periodos",
    habilidade:
      "relacionar grupos e periodos a caracteristicas eletronicas dos elementos",
    tags: ["familias", "periodos", "camada de valencia"],
    fatos: [
      {
        lead: "uma familia quimica",
        answer: "o conjunto de elementos com numero semelhante de eletrons de valencia",
        why: "essa semelhanca produz comportamentos proximos"
      },
      {
        lead: "os elementos de um mesmo periodo",
        answer: "as especies que possuem igual numero de camadas eletronicas ocupadas",
        why: "isso decorre da posicao horizontal na tabela"
      },
      {
        lead: "a relacao entre familia e valencia",
        answer: "a correspondencia entre coluna e configuracao eletronica externa semelhante",
        why: "por isso grupos apresentam tendencias quimicas parecidas"
      },
      {
        lead: "a mudanca de periodo",
        answer: "a alteracao do numero de niveis principais ocupados pelos eletrons",
        why: "cada nova linha indica nova camada de energia"
      },
      {
        lead: "a utilidade das familias",
        answer: "a possibilidade de prever propriedades a partir da posicao do elemento",
        why: "classificar por grupos facilita interpretar reatividade"
      }
    ]
  },
  {
    subtopico: "Metais, ametais e semimetais",
    habilidade:
      "classificar elementos segundo caracteristicas metalicas e nao metalicas",
    tags: ["metais", "ametais", "semimetais"],
    fatos: [
      {
        lead: "os metais",
        answer: "elementos geralmente bons condutores e com tendencia a perder eletrons",
        why: "eles apresentam brilho, ductilidade e maleabilidade em muitos casos"
      },
      {
        lead: "os ametais",
        answer: "elementos que tendem a ganhar eletrons e apresentam baixa condutividade",
        why: "suas propriedades contrastam com as dos metais"
      },
      {
        lead: "os semimetais",
        answer: "elementos com propriedades intermediarias entre metais e ametais",
        why: "eles podem apresentar comportamento misto"
      },
      {
        lead: "o carater metalico",
        answer: "a tendencia do elemento a perder eletrons formando cations",
        why: "esse carater cresce em certas direcoes da tabela"
      },
      {
        lead: "o carater ametalico",
        answer: "a tendencia a ganhar eletrons e formar anions ou compartilhamentos fortes",
        why: "ele e comum em elementos da direita da tabela"
      }
    ]
  },
  {
    subtopico: "Metais alcalinos e alcalino-terrosos",
    habilidade:
      "identificar propriedades de familias importantes da tabela periodica",
    tags: ["metais alcalinos", "alcalino-terrosos", "familias"],
    fatos: [
      {
        lead: "os metais alcalinos",
        answer: "os elementos da familia 1 que possuem um eletron na camada de valencia",
        why: "eles sao bastante reativos e formam cations +1"
      },
      {
        lead: "os metais alcalino-terrosos",
        answer: "os elementos da familia 2 com dois eletrons de valencia",
        why: "eles costumam formar cations +2"
      },
      {
        lead: "a alta reatividade dos alcalinos",
        answer: "a facilidade de perder o unico eletron da camada de valencia",
        why: "essa configuracao torna a ionizacao energeticamente favoravel"
      },
      {
        lead: "a reatividade dos alcalino-terrosos",
        answer: "a tendencia relativamente alta de perder dois eletrons externos",
        why: "isso gera especies estaveis de carga positiva"
      },
      {
        lead: "a localizacao dos alcalinos",
        answer: "a primeira coluna da tabela periodica, exceto o hidrogenio",
        why: "essa posicao expressa sua configuracao externa"
      }
    ]
  },
  {
    subtopico: "Halogenios e gases nobres",
    habilidade:
      "identificar propriedades de familias importantes da tabela periodica",
    tags: ["halogenios", "gases nobres", "familias"],
    fatos: [
      {
        lead: "os halogenios",
        answer: "os elementos da familia 17 com alta tendencia a ganhar um eletron",
        why: "eles apresentam grande reatividade e formam anions -1"
      },
      {
        lead: "os gases nobres",
        answer: "os elementos da familia 18 com camada de valencia completa",
        why: "essa configuracao os torna pouco reativos em geral"
      },
      {
        lead: "a baixa reatividade dos gases nobres",
        answer: "a consequencia de uma configuracao eletronica externa muito estavel",
        why: "por isso eles raramente participam de ligacoes"
      },
      {
        lead: "a alta afinidade eletronica dos halogenios",
        answer: "a tendencia a completar a camada de valencia pelo ganho de eletrons",
        why: "isso ajuda a explicar sua reatividade"
      },
      {
        lead: "a posicao dos halogenios",
        answer: "a coluna imediatamente anterior aos gases nobres",
        why: "ela reflete a proximidade com a estabilidade de octeto"
      }
    ]
  },
  {
    subtopico: "Propriedades periodicas",
    habilidade:
      "analisar tendencias periodicas na tabela",
    tags: ["raio atomico", "energia de ionizacao", "eletroafinidade"],
    fatos: [
      {
        lead: "o raio atomico",
        answer: "a medida aproximada do tamanho do atomo",
        why: "essa propriedade varia com numero de camadas e atracao nuclear"
      },
      {
        lead: "a energia de ionizacao",
        answer: "a energia necessaria para remover um eletron de um atomo gasoso",
        why: "ela indica dificuldade de formar cations"
      },
      {
        lead: "a eletroafinidade",
        answer: "a variacao energetica associada ao ganho de um eletron por um atomo",
        why: "ela ajuda a entender tendencia de formar anions"
      },
      {
        lead: "a eletronegatividade",
        answer: "a tendencia de um atomo atrair eletrons em uma ligacao",
        why: "essa propriedade e central para interpretar polaridade"
      },
      {
        lead: "as propriedades periodicas",
        answer: "as tendencias que mudam de forma regular conforme a posicao do elemento",
        why: "elas permitem prever comportamento quimico"
      }
    ]
  },
  {
    subtopico: "Raio atomico e ionizacao",
    habilidade:
      "analisar tendencias periodicas na tabela",
    tags: ["raio atomico", "ionizacao", "tendencias"],
    fatos: [
      {
        lead: "o aumento do raio atomico em um grupo",
        answer: "a consequencia da adicao de novas camadas eletronicas para baixo na tabela",
        why: "mais camadas ampliam o tamanho do atomo"
      },
      {
        lead: "a diminuicao do raio atomico em um periodo",
        answer: "o efeito do aumento da carga nuclear efetiva da esquerda para a direita",
        why: "os eletrons sao atraidos mais fortemente para o nucleo"
      },
      {
        lead: "a energia de ionizacao alta",
        answer: "a dificuldade maior de remover eletrons do atomo",
        why: "isso ocorre quando a atracao nuclear sobre eles e intensa"
      },
      {
        lead: "a energia de ionizacao baixa",
        answer: "a maior facilidade de perder eletrons e formar cations",
        why: "metais reativos costumam apresentar esse comportamento"
      },
      {
        lead: "a relacao entre raio e ionizacao",
        answer: "o fato de atomos maiores tenderem a prender menos fortemente os eletrons externos",
        why: "isso favorece menor energia para remocao"
      }
    ]
  },
  {
    subtopico: "Eletronegatividade e reatividade",
    habilidade:
      "relacionar propriedades periodicas ao comportamento dos elementos",
    tags: ["eletronegatividade", "reatividade", "tendencias"],
    fatos: [
      {
        lead: "a eletronegatividade elevada",
        answer: "a forte tendencia de um atomo atrair eletrons em ligacoes",
        why: "ametais da direita superior da tabela se destacam nessa propriedade"
      },
      {
        lead: "a eletronegatividade baixa",
        answer: "a menor tendencia de atrair eletrons em uma ligacao",
        why: "metais muito eletropositivos ocupam essa faixa"
      },
      {
        lead: "a reatividade dos metais alcalinos",
        answer: "o comportamento intensificado pelo facil desprendimento do eletron de valencia",
        why: "eles ionizam-se com grande facilidade"
      },
      {
        lead: "a reatividade dos halogenios",
        answer: "a tendencia de ganhar eletrons para completar a camada externa",
        why: "isso explica sua forte participacao em reacoes"
      },
      {
        lead: "a relacao entre eletronegatividade e polaridade",
        answer: "a influencia da atracao desigual de eletrons sobre a distribuicao de cargas",
        why: "diferencas maiores tendem a gerar ligacoes mais polares"
      }
    ]
  },
  {
    subtopico: "Elementos representativos e de transicao",
    habilidade:
      "classificar elementos segundo blocos e posicoes na tabela periodica",
    tags: ["representativos", "transicao", "blocos"],
    fatos: [
      {
        lead: "os elementos representativos",
        answer: "os elementos dos blocos s e p da tabela periodica",
        why: "eles incluem familias tradicionais como alcalinos e halogenios"
      },
      {
        lead: "os elementos de transicao",
        answer: "os elementos do bloco d, geralmente com subnivel d incompleto",
        why: "eles exibem propriedades metalicas marcantes e varios estados de oxidacao"
      },
      {
        lead: "os elementos de transicao interna",
        answer: "as series dos lantanideos e actinideos associadas ao bloco f",
        why: "elas aparecem destacadas na parte inferior da tabela"
      },
      {
        lead: "o bloco de um elemento",
        answer: "a classificacao segundo o subnivel de maior energia ocupado",
        why: "ela ajuda a organizar a estrutura da tabela"
      },
      {
        lead: "a variedade de estados de oxidacao dos metais de transicao",
        answer: "a consequencia de configuracoes eletronicas que permitem diferentes perdas de eletrons",
        why: "isso diferencia esses elementos de muitas familias representativas"
      }
    ]
  },
  {
    subtopico: "Aplicacoes e interpretacao da tabela",
    habilidade:
      "utilizar a tabela periodica para prever propriedades e comportamentos",
    tags: ["aplicacoes", "interpretacao", "previsao"],
    fatos: [
      {
        lead: "o uso da tabela periodica",
        answer: "a previsao de propriedades a partir da posicao ocupada pelo elemento",
        why: "a tabela organiza informacoes valiosas sobre comportamento quimico"
      },
      {
        lead: "a previsao de carga ionica por familia",
        answer: "a inferencia baseada no numero de eletrons de valencia e na estabilidade buscada",
        why: "isso ajuda a antecipar formacao de ions"
      },
      {
        lead: "a comparacao entre elementos vizinhos",
        answer: "a analise de tendencias gradativas ao longo de grupos e periodos",
        why: "posicoes proximas revelam regularidades importantes"
      },
      {
        lead: "a tabela como ferramenta de estudo",
        answer: "o recurso para relacionar configuracao eletronica, propriedades e reatividade",
        why: "ela sintetiza varias informacoes da quimica geral"
      },
      {
        lead: "a interpretacao de uma familia desconhecida",
        answer: "a possibilidade de inferir comportamento a partir do grupo e periodo observados",
        why: "a logica periodica permite extrapolacoes fundamentadas"
      }
    ]
  }
];

export const tabelaPeriodica = {
  id: "quimica_tabela_periodica",
  materia: "Quimica",
  serie: [1],
  topico: "Tabela Periodica",
  metadados: {
    disciplinaId: "quimica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Quimica",
    frente: "Classificacao e propriedades dos elementos",
    searchAliases: [
      "tabela periodica",
      "familias e periodos",
      "propriedades periodicas",
      "metais e ametais",
      "eletronegatividade"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar criterios de organizacao da tabela periodica",
      "relacionar grupos e periodos a caracteristicas eletronicas dos elementos",
      "classificar elementos segundo caracteristicas metalicas e nao metalicas",
      "analisar tendencias periodicas na tabela",
      "utilizar a tabela periodica para prever propriedades e comportamentos"
    ],
    planejamentoQuestoes: CHEMISTRY_HUNDRED_FIFTY_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "tp",
    serie: 1,
    materia: "Quimica",
    topico: "Tabela Periodica",
    blocos,
    stemBuilders: CHEMISTRY_STEM_BUILDERS,
    globalMatrix: CHEMISTRY_HUNDRED_FIFTY_MATRIX
  })
};

