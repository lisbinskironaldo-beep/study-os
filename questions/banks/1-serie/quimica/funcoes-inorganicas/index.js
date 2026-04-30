import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  CHEMISTRY_HUNDRED_FIFTY_MATRIX,
  CHEMISTRY_HUNDRED_FIFTY_PLAN,
  CHEMISTRY_STEM_BUILDERS
} from "../../../_shared/chemistryTopicPresets.js";

const blocos = [
  {
    subtopico: "Conceito de funções inorganicas",
    habilidade:
      "identificar critérios de classificacao das funções inorganicas",
    tags: ["funções inorganicas", "classificacao", "compostos"],
    fatos: [
      {
        lead: "as funções inorganicas",
        answer: "os grupos de compostos classificados por propriedades e comportamento quimico semelhantes",
        why: "acidos, bases, sais e oxidos são exemplos principais"
      },
      {
        lead: "a classificacao inorganica",
        answer: "a organizacao dos compostos conforme grupos funcionais e respostas características",
        why: "ela ajuda a prever reatividade e nomenclatura"
      },
      {
        lead: "o estudo das funções",
        answer: "a análise das propriedades comuns entre classes de substancias",
        why: "isso facilita entender reacoes e usos dos compostos"
      },
      {
        lead: "um composto inorganico",
        answer: "a substancia normalmente pertencente a classes como acidos, bases, sais e oxidos",
        why: "essas classes compoem o nucleo da química inorganica escolar"
      },
      {
        lead: "a importancia da classificacao funcional",
        answer: "a possibilidade de reconhecer comportamento quimico a partir da formula",
        why: "o agrupamento por funções organiza o estudo da materia"
      }
    ]
  },
  {
    subtopico: "Acidos",
    habilidade:
      "identificar formulas, propriedades e nomenclatura de acidos",
    tags: ["acidos", "ionizacao", "pH"],
    fatos: [
      {
        lead: "um acido segundo Arrhenius",
        answer: "a substancia que em agua libera ions H+",
        why: "essa definicao e a mais usada no estudo inicial das funções"
      },
      {
        lead: "a ionizacao de um acido",
        answer: "a formação de ions quando a substancia molecular e dissolvida em agua",
        why: "o processo produz H+ e anions correspondentes"
      },
      {
        lead: "a propriedade acida em solucao",
        answer: "a presenca de ions hidrogenio que influencia pH e reatividade",
        why: "isso explica características como azedume e condutividade"
      },
      {
        lead: "a formula geral de muitos acidos",
        answer: "a presenca de hidrogenio ionizavel no inicio da formula",
        why: "essa observação ajuda a reconhecer a função"
      },
      {
        lead: "o papel do pH acido",
        answer: "a indicacao de maior concentracao relativa de H+ em solucao",
        why: "valores baixos de pH caracterizam meios acidos"
      }
    ]
  },
  {
    subtopico: "Bases",
    habilidade:
      "identificar formulas, propriedades e nomenclatura de bases",
    tags: ["bases", "hidroxila", "arrhenius"],
    fatos: [
      {
        lead: "uma base segundo Arrhenius",
        answer: "a substancia que em agua libera ions OH-",
        why: "essa liberacao define a função basica no enfoque escolar"
      },
      {
        lead: "a dissociacao de uma base ionica",
        answer: "a separacao dos ions presentes no composto ao entrar em solucao",
        why: "isso torna a base condutora em meio aquoso"
      },
      {
        lead: "a hidroxila",
        answer: "o grupo OH- caracteristico das bases no modelo de Arrhenius",
        why: "sua presenca ajuda a reconhecer a função"
      },
      {
        lead: "uma propriedade das bases",
        answer: "a capacidade de elevar o pH do meio aquoso",
        why: "meios basicos apresentam baixa concentracao relativa de H+"
      },
      {
        lead: "a formula de muitas bases",
        answer: "a combinacao entre um cation e uma ou mais hidroxilas",
        why: "essa estrutura funcional e tipica da classe"
      }
    ]
  },
  {
    subtopico: "Sais",
    habilidade:
      "identificar formulas, propriedades e nomenclatura de sais",
    tags: ["sais", "neutralizacao", "ions"],
    fatos: [
      {
        lead: "um sal",
        answer: "o composto ionico formado por cation diferente de H+ e anion diferente de OH-",
        why: "essa classe costuma resultar de neutralizacao"
      },
      {
        lead: "a neutralizacao acido-base",
        answer: "a reacao que geralmente produz sal e agua",
        why: "nela, H+ e OH- combinam-se formando agua"
      },
      {
        lead: "a estrutura de um sal",
        answer: "a associacao entre um cation e um anion em rede ionica",
        why: "por isso muitos sais são solidos cristalinos"
      },
      {
        lead: "a dissociacao de um sal",
        answer: "a separacao em ions quando o composto se dissolve em agua",
        why: "essa propriedade explica condutividade de solucoes salinas"
      },
      {
        lead: "a nomenclatura de sais",
        answer: "a identificacao do anion seguida da indicacao do cation",
        why: "essa logica organiza o nome da substancia"
      }
    ]
  },
  {
    subtopico: "Oxidos",
    habilidade:
      "identificar formulas, propriedades e nomenclatura de oxidos",
    tags: ["oxidos", "oxigenio", "classificacao"],
    fatos: [
      {
        lead: "um oxido",
        answer: "o composto binario em que o oxigenio e o elemento mais eletronegativo, exceto fluor",
        why: "essa definicao separa oxidos de outras classes"
      },
      {
        lead: "o número de oxidacao do oxigenio em muitos oxidos",
        answer: "o valor -2",
        why: "essa regularidade auxilia no reconhecimento da função"
      },
      {
        lead: "o oxido basico",
        answer: "o oxido que reage com acidos formando sal e agua",
        why: "ele é geralmente formado por metal"
      },
      {
        lead: "o oxido acido",
        answer: "o oxido que reage com bases e pode originar acidos em agua",
        why: "ele costuma ser formado por ametal"
      },
      {
        lead: "a classificacao dos oxidos",
        answer: "a divisao em basicos, acidos, anfoteros ou neutros conforme comportamento",
        why: "ela depende da reatividade com agua, acidos e bases"
      }
    ]
  },
  {
    subtopico: "Nomenclatura inorganica",
    habilidade:
      "aplicar regras basicas de nomenclatura inorganica",
    tags: ["nomenclatura", "acidos", "bases"],
    fatos: [
      {
        lead: "a nomenclatura dos acidos",
        answer: "a regra que costuma usar a palavra acido seguida do radical correspondente",
        why: "ela varia conforme o tipo de anion presente"
      },
      {
        lead: "a nomenclatura das bases",
        answer: "a expressao hidroxido seguida do nome do cation",
        why: "essa é a forma basica de nomear compostos da classe"
      },
      {
        lead: "a nomenclatura dos oxidos",
        answer: "a expressao oxido de seguida do elemento ligado ao oxigenio",
        why: "pode incluir número de oxidacao quando necessario"
      },
      {
        lead: "a nomenclatura dos sais",
        answer: "a referencia ao anion combinada ao nome do cation",
        why: "isso identifica a composicao ionica do composto"
      },
      {
        lead: "a função da nomenclatura química",
        answer: "padronizar a identificacao das substancias e reduzir ambiguidades",
        why: "nomes sistematicos facilitam comunicacao cientifica"
      }
    ]
  },
  {
    subtopico: "Indicadores e pH",
    habilidade:
      "relacionar acidez e basicidade a indicadores e escala de pH",
    tags: ["indicadores", "pH", "acidez"],
    fatos: [
      {
        lead: "o pH",
        answer: "a escala usada para indicar acidez ou basicidade de solucoes aquosas",
        why: "ela se relaciona a concentracao de ions H+"
      },
      {
        lead: "um indicador acido-base",
        answer: "a substancia que muda de cor conforme o meio fica mais acido ou basico",
        why: "ele permite estimar o comportamento da solucao"
      },
      {
        lead: "o pH menor que 7",
        answer: "a indicacao de meio acido",
        why: "nessa faixa a concentracao de H+ e relativamente maior"
      },
      {
        lead: "o pH maior que 7",
        answer: "a indicacao de meio basico",
        why: "nessa faixa predominam características alcalinas"
      },
      {
        lead: "a faixa neutra de pH",
        answer: "a condicao aproximada em que o meio não se mostra nem acido nem basico",
        why: "a neutralidade costuma ser associada ao valor 7"
      }
    ]
  },
  {
    subtopico: "Neutralizacao e reacoes",
    habilidade:
      "interpretar reacoes entre acidos, bases e oxidos",
    tags: ["neutralizacao", "reacoes", "produtos"],
    fatos: [
      {
        lead: "a reacao de neutralizacao",
        answer: "a interacao entre acido e base formando sal e agua",
        why: "ela envolve combinacao de H+ com OH-"
      },
      {
        lead: "a formação de agua na neutralizacao",
        answer: "o resultado do encontro entre ions hidrogenio e hidroxila",
        why: "essa combinacao reduz acidez e basicidade livres"
      },
      {
        lead: "a reacao entre oxido basico e acido",
        answer: "a produção de sal e agua em muitas situações",
        why: "o comportamento do oxido basico lembra o de uma base"
      },
      {
        lead: "a reacao entre oxido acido e base",
        answer: "a produção de sal e agua em varias circunstancias",
        why: "o oxido acido apresenta comportamento analogo ao dos acidos"
      },
      {
        lead: "a interpretação funcional de uma reacao",
        answer: "a identificacao das classes reagentes para prever os produtos",
        why: "reconhecer a função ajuda a antecipar o tipo de transformacao"
      }
    ]
  },
  {
    subtopico: "Acidos, bases e cotidiano",
    habilidade:
      "relacionar funções inorganicas a situações do cotidiano",
    tags: ["cotidiano", "aplicacoes", "substancias comuns"],
    fatos: [
      {
        lead: "o vinagre como exemplo",
        answer: "uma substancia cotidiana associada a comportamento acido",
        why: "ele contém acido acetico em solucao"
      },
      {
        lead: "a soda caustica como exemplo",
        answer: "uma base forte usada em processos de limpeza e industria",
        why: "ela contém hidroxido de sodio"
      },
      {
        lead: "o sal de cozinha como exemplo",
        answer: "um sal ionico amplamente utilizado na alimentacao",
        why: "ele é representado pelo cloreto de sodio"
      },
      {
        lead: "a cal virgem como exemplo",
        answer: "um oxido basico usado em construcoes e processos industriais",
        why: "ela corresponde ao oxido de calcio"
      },
      {
        lead: "a leitura funcional de substancias do cotidiano",
        answer: "a identificacao da classe química para compreender uso e reatividade",
        why: "isso aproxima a teoria da experiencia diaria"
      }
    ]
  },
  {
    subtopico: "Comparacoes e interpretação",
    habilidade:
      "comparar propriedades das funções inorganicas e interpretar formulas",
    tags: ["comparacao", "interpretacao", "propriedades"],
    fatos: [
      {
        lead: "a diferenca entre acido e base",
        answer: "o fato de um liberar H+ e a outra liberar OH- em agua no modelo de Arrhenius",
        why: "essa distincao organiza a classificacao funcional"
      },
      {
        lead: "a diferenca entre sal e oxido",
        answer: "o fato de um ser composto ionico variado e o outro ser binario com oxigenio",
        why: "a formula permite distinguir as classes"
      },
      {
        lead: "a presenca de OH- na formula",
        answer: "um indicio importante de que a substancia pertence a função base",
        why: "o grupo hidroxila caracteriza a classe no modelo escolar"
      },
      {
        lead: "a presenca de oxigenio e outro elemento apenas",
        answer: "um indicio de classificacao como oxido",
        why: "a função envolve compostos binarios do oxigenio"
      },
      {
        lead: "o estudo das funções inorganicas",
        answer: "a base para compreender formulas, nomenclatura e reatividade de compostos comuns",
        why: "ele organiza grande parte da química inorganica introdutoria"
      }
    ]
  }
];

export const funcoesInorganicas = {
  id: "quimica_funcoes_inorganicas",
  materia: "Química",
  serie: [1],
  topico: "Funções Inorganicas",
  metadados: {
    disciplinaId: "quimica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Química",
    frente: "Classificacao e reatividade de compostos inorganicos",
    searchAliases: [
      "funções inorganicas",
      "acidos bases sais oxidos",
      "nomenclatura inorganica",
      "neutralizacao",
      "pH e indicadores"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar critérios de classificacao das funções inorganicas",
      "identificar formulas, propriedades e nomenclatura de acidos",
      "identificar formulas, propriedades e nomenclatura de bases",
      "identificar formulas, propriedades e nomenclatura de sais",
      "interpretar reacoes entre acidos, bases e oxidos"
    ],
    planejamentoQuestoes: CHEMISTRY_HUNDRED_FIFTY_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "fin",
    serie: 1,
    materia: "Química",
    topico: "Funções Inorganicas",
    blocos,
    stemBuilders: CHEMISTRY_STEM_BUILDERS,
    globalMatrix: CHEMISTRY_HUNDRED_FIFTY_MATRIX
  })
};

