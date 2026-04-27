import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  CHEMISTRY_HUNDRED_FIFTY_MATRIX,
  CHEMISTRY_HUNDRED_FIFTY_PLAN,
  CHEMISTRY_STEM_BUILDERS
} from "../../../_shared/chemistryTopicPresets.js";

const blocos = [
  {
    subtopico: "Conceito de solucao",
    habilidade:
      "identificar os componentes e conceitos fundamentais das solucoes",
    tags: ["solucoes", "soluto", "solvente"],
    fatos: [
      {
        lead: "uma solucao",
        answer: "a mistura homogenea formada por soluto e solvente",
        why: "seus componentes encontram-se distribuidos de modo uniforme"
      },
      {
        lead: "o soluto",
        answer: "a substancia dissolvida em um solvente",
        why: "ele costuma estar em menor proporcao na mistura"
      },
      {
        lead: "o solvente",
        answer: "a substancia que dissolve o soluto e geralmente aparece em maior quantidade",
        why: "ele determina o meio da dissolucao"
      },
      {
        lead: "a mistura homogenea",
        answer: "o sistema que apresenta uma unica fase visivel",
        why: "as solucoes sao exemplos classicos desse tipo de mistura"
      },
      {
        lead: "a fase unica de uma solucao",
        answer: "a consequencia da distribuicao uniforme das particulas do soluto no solvente",
        why: "isso impede distincao visual entre componentes"
      }
    ]
  },
  {
    subtopico: "Coeficiente de solubilidade",
    habilidade:
      "interpretar solubilidade e fatores que influenciam dissolucao",
    tags: ["solubilidade", "saturacao", "coeficiente"],
    fatos: [
      {
        lead: "a solubilidade",
        answer: "a quantidade maxima de soluto que pode dissolver-se em certa quantidade de solvente",
        why: "ela depende de temperatura e da natureza das especies"
      },
      {
        lead: "o coeficiente de solubilidade",
        answer: "a medida que expressa a quantidade limite de soluto dissolvido em condicoes definidas",
        why: "ele e usado para prever saturacao"
      },
      {
        lead: "uma solucao saturada",
        answer: "a solucao que contem a quantidade maxima de soluto dissolvido nas condicoes dadas",
        why: "alem desse limite, o excesso tende a permanecer sem dissolver"
      },
      {
        lead: "uma solucao insaturada",
        answer: "a solucao que ainda pode dissolver mais soluto",
        why: "ela esta abaixo do limite de solubilidade"
      },
      {
        lead: "a solucao supersaturada",
        answer: "a solucao que contem mais soluto dissolvido do que o previsto para o equilibrio comum",
        why: "ela e metastavel e pode precipitar com facilidade"
      }
    ]
  },
  {
    subtopico: "Concentracao comum",
    habilidade:
      "calcular e interpretar diferentes formas de concentracao de solucoes",
    tags: ["concentracao comum", "g/L", "massa por volume"],
    fatos: [
      {
        lead: "a concentracao comum",
        answer: "a razao entre a massa do soluto e o volume da solucao",
        why: "ela e frequentemente expressa em g/L"
      },
      {
        lead: "a unidade g/L",
        answer: "a forma usual de expressar quantos gramas de soluto existem em cada litro de solucao",
        why: "essa unidade aparece em varios problemas escolares"
      },
      {
        lead: "o aumento da concentracao comum",
        answer: "a consequencia de elevar a massa de soluto ou reduzir o volume da solucao",
        why: "a relacao massa-volume se torna maior"
      },
      {
        lead: "a diluicao e a concentracao comum",
        answer: "a reducao do valor por aumento de volume com massa de soluto constante",
        why: "o soluto fica distribuido em maior quantidade de solvente"
      },
      {
        lead: "a interpretacao de 20 g/L",
        answer: "a existencia de 20 gramas de soluto em um litro de solucao",
        why: "essa leitura direta e importante nos exercicios"
      }
    ]
  },
  {
    subtopico: "Concentracao molar",
    habilidade:
      "calcular e interpretar diferentes formas de concentracao de solucoes",
    tags: ["molaridade", "mol/L", "concentracao molar"],
    fatos: [
      {
        lead: "a concentracao molar",
        answer: "a quantidade de mols de soluto presente em um litro de solucao",
        why: "ela tambem e chamada de molaridade"
      },
      {
        lead: "a unidade mol/L",
        answer: "a forma de expressar quantos mols de soluto existem por litro de solucao",
        why: "essa unidade liga estequiometria e solucoes"
      },
      {
        lead: "uma solucao 1 mol/L",
        answer: "a solucao que contem um mol de soluto em cada litro de volume total",
        why: "essa leitura orienta calculos de preparo e diluicao"
      },
      {
        lead: "a relacao entre massa molar e molaridade",
        answer: "a conversao necessaria quando a quantidade conhecida do soluto esta em gramas",
        why: "massa molar permite encontrar numero de mols"
      },
      {
        lead: "o aumento da molaridade",
        answer: "a elevacao do numero de mols de soluto por litro de solucao",
        why: "isso pode ocorrer com mais soluto ou menor volume"
      }
    ]
  },
  {
    subtopico: "Diluicao e mistura",
    habilidade:
      "resolver problemas de diluicao e mistura de solucoes",
    tags: ["diluicao", "mistura", "conservacao do soluto"],
    fatos: [
      {
        lead: "a diluicao",
        answer: "o processo de adicionar solvente sem alterar a quantidade de soluto",
        why: "o volume aumenta e a concentracao diminui"
      },
      {
        lead: "a conservacao do soluto na diluicao",
        answer: "o principio de que a quantidade de soluto permanece a mesma antes e depois do processo",
        why: "isso fundamenta a relacao C1V1 = C2V2"
      },
      {
        lead: "a mistura de solucoes do mesmo soluto",
        answer: "o processo em que as quantidades de soluto e volumes se combinam",
        why: "o calculo final depende da soma adequada dessas grandezas"
      },
      {
        lead: "a reducao de concentracao em uma diluicao",
        answer: "a consequencia direta do aumento de volume sem aumento de soluto",
        why: "o mesmo soluto fica mais disperso"
      },
      {
        lead: "a importancia da relacao C1V1 = C2V2",
        answer: "a simplificacao do calculo de diluicao em problemas escolares",
        why: "ela deriva da conservacao da quantidade de soluto"
      }
    ]
  },
  {
    subtopico: "Solubilidade e temperatura",
    habilidade:
      "interpretar solubilidade e fatores que influenciam dissolucao",
    tags: ["temperatura", "solubilidade", "grafico"],
    fatos: [
      {
        lead: "o aumento da temperatura em muitos solidos",
        answer: "o fator que tende a elevar a solubilidade em agua",
        why: "muitos sais dissolvem-se mais com aquecimento"
      },
      {
        lead: "a solubilidade de gases em liquidos",
        answer: "a grandeza que em geral diminui quando a temperatura aumenta",
        why: "gases tendem a escapar mais facilmente do solvente aquecido"
      },
      {
        lead: "o grafico de solubilidade",
        answer: "a representacao da quantidade dissolvida em funcao da temperatura",
        why: "ele permite prever saturacao e precipitacao"
      },
      {
        lead: "o resfriamento de uma solucao saturada",
        answer: "a condicao que pode levar a precipitacao do excesso de soluto",
        why: "o limite de dissolucao pode diminuir com a temperatura"
      },
      {
        lead: "a cristalizacao por resfriamento",
        answer: "a separacao de soluto quando a solubilidade diminui e o excesso sai da solucao",
        why: "esse processo depende da relacao entre temperatura e solubilidade"
      }
    ]
  },
  {
    subtopico: "Solucoes ionicas e moleculares",
    habilidade:
      "comparar comportamento de solucoes ionicas e moleculares",
    tags: ["ionicas", "moleculares", "condutividade"],
    fatos: [
      {
        lead: "uma solucao ionica",
        answer: "a solucao que contem ions livres capazes de conduzir corrente eletrica",
        why: "ela resulta da dissolucao de compostos ionicos ou ionizacao de certas substancias"
      },
      {
        lead: "uma solucao molecular nao ionizada",
        answer: "a solucao em que predominam moleculas neutras sem formacao relevante de ions",
        why: "nessa situacao a conducao eletrica tende a ser pequena"
      },
      {
        lead: "a condutividade eletrica em solucoes",
        answer: "a propriedade ligada a presenca de cargas moveis no meio",
        why: "ions livres permitem passagem de corrente"
      },
      {
        lead: "a dissociacao ionica em agua",
        answer: "a separacao de ions preexistentes quando o composto se dissolve",
        why: "isso ocorre com varios sais e bases ionicas"
      },
      {
        lead: "a ionizacao em agua",
        answer: "a formacao de ions a partir de substancias moleculares ao entrar em solucao",
        why: "esse e o caso de muitos acidos"
      }
    ]
  },
  {
    subtopico: "Unidades de concentracao",
    habilidade:
      "calcular e interpretar diferentes formas de concentracao de solucoes",
    tags: ["porcentagem", "ppm", "unidades"],
    fatos: [
      {
        lead: "a porcentagem em massa",
        answer: "a relacao entre massa do soluto e massa da solucao multiplicada por cem",
        why: "ela indica a fracao percentual do soluto"
      },
      {
        lead: "a porcentagem em volume",
        answer: "a relacao entre volume do soluto e volume da solucao multiplicada por cem",
        why: "essa forma aparece em misturas liquidas"
      },
      {
        lead: "o ppm",
        answer: "a unidade usada para expressar concentracoes muito pequenas",
        why: "ela significa partes por milhao"
      },
      {
        lead: "a porcentagem m/v",
        answer: "a forma de expressar massa de soluto por volume de solucao em porcentagem",
        why: "ela e comum em rotulos e preparos"
      },
      {
        lead: "a escolha da unidade de concentracao",
        answer: "a adaptacao da forma de expressar a composicao segundo o contexto do problema",
        why: "diferentes situacoes pedem diferentes unidades"
      }
    ]
  },
  {
    subtopico: "Propriedades coligativas",
    habilidade:
      "identificar nocoes iniciais sobre efeitos da presenca de soluto nas propriedades do solvente",
    tags: ["coligativas", "ebulioscopia", "crioscopia"],
    fatos: [
      {
        lead: "as propriedades coligativas",
        answer: "os efeitos provocados pela quantidade de particulas de soluto nas propriedades do solvente",
        why: "elas dependem mais do numero de particulas do que da identidade quimica"
      },
      {
        lead: "a diminuicao da pressao de vapor",
        answer: "o efeito de um soluto nao volatil sobre a tendencia do solvente evaporar",
        why: "as particulas dissolvidas dificultam a evaporacao"
      },
      {
        lead: "a elevacao do ponto de ebulicao",
        answer: "a necessidade de maior temperatura para o solvente entrar em ebulicao na presenca de soluto",
        why: "essa e uma propriedade coligativa"
      },
      {
        lead: "a diminuicao do ponto de congelamento",
        answer: "a reducao da temperatura de solidificacao do solvente causada por soluto dissolvido",
        why: "esse efeito explica uso de sais em algumas situacoes"
      },
      {
        lead: "a importancia do numero de particulas",
        answer: "o fator central para comparar intensidade dos efeitos coligativos",
        why: "mais particulas em solucao tendem a intensificar o efeito"
      }
    ]
  },
  {
    subtopico: "Aplicacoes de solucoes",
    habilidade:
      "aplicar conceitos de solucoes a contextos cotidianos e experimentais",
    tags: ["cotidiano", "soro", "rotulos"],
    fatos: [
      {
        lead: "o soro fisiologico",
        answer: "uma solucao aquosa de composicao controlada usada em contextos biologicos e medicos",
        why: "ele ilustra a importancia da concentracao adequada"
      },
      {
        lead: "a leitura de rotulos de bebidas e medicamentos",
        answer: "a interpretacao de informacoes de concentracao presentes em produtos",
        why: "muitas aplicacoes diarias envolvem solucoes"
      },
      {
        lead: "a agua do mar como exemplo",
        answer: "uma solucao complexa com varios sais dissolvidos em agua",
        why: "ela mostra a presenca de solutos em sistema natural"
      },
      {
        lead: "o preparo de uma solucao em laboratorio",
        answer: "a medicao controlada de soluto e solvente para obter concentracao desejada",
        why: "isso exige atencao a unidades e vidrarias"
      },
      {
        lead: "a utilidade do estudo das solucoes",
        answer: "a compreensao de misturas homogeneas em contextos biologicos, industriais e cotidianos",
        why: "quimica das solucoes aparece em muitos setores"
      }
    ]
  }
];

export const solucoes = {
  id: "quimica_solucoes",
  materia: "Quimica",
  serie: [2],
  topico: "Solucoes",
  metadados: {
    disciplinaId: "quimica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Quimica",
    frente: "Dissolucao, concentracao e propriedades das solucoes",
    searchAliases: [
      "solucoes",
      "solubilidade",
      "concentracao molar",
      "diluicao",
      "propriedades coligativas"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar os componentes e conceitos fundamentais das solucoes",
      "interpretar solubilidade e fatores que influenciam dissolucao",
      "calcular e interpretar diferentes formas de concentracao de solucoes",
      "resolver problemas de diluicao e mistura de solucoes",
      "aplicar conceitos de solucoes a contextos cotidianos e experimentais"
    ],
    planejamentoQuestoes: CHEMISTRY_HUNDRED_FIFTY_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "sol",
    serie: 2,
    materia: "Quimica",
    topico: "Solucoes",
    blocos,
    stemBuilders: CHEMISTRY_STEM_BUILDERS,
    globalMatrix: CHEMISTRY_HUNDRED_FIFTY_MATRIX
  })
};

