import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  CHEMISTRY_HUNDRED_FIFTY_MATRIX,
  CHEMISTRY_HUNDRED_FIFTY_PLAN,
  CHEMISTRY_STEM_BUILDERS
} from "../../../_shared/chemistryTopicPresets.js";

const blocos = [
  {
    subtopico: "Mole e constante de Avogadro",
    habilidade:
      "relacionar quantidade de materia ao conceito de mole",
    tags: ["mole", "avogadro", "quantidade de materia"],
    fatos: [
      {
        lead: "o mol",
        answer: "a unidade que expressa quantidade de materia em quimica",
        why: "ela conecta o nivel microscopico ao macroscopico"
      },
      {
        lead: "a constante de Avogadro",
        answer: "o numero aproximado de entidades presentes em um mol",
        why: "ela relaciona particulas e quantidade de materia"
      },
      {
        lead: "a quantidade de materia",
        answer: "a grandeza usada para medir quantos grupos de entidades quimicas existem em uma amostra",
        why: "o mol e sua unidade no SI"
      },
      {
        lead: "um mol de atomos",
        answer: "o conjunto contendo cerca de 6,02 x 10^23 atomos",
        why: "essa quantidade define a escala de contagem quimica"
      },
      {
        lead: "a utilidade do mol",
        answer: "permitir calculos proporcionais entre massa, particulas e volume",
        why: "ele simplifica raciocinios estequiometricos"
      }
    ]
  },
  {
    subtopico: "Massa molar",
    habilidade:
      "converter massa em quantidade de materia e vice-versa",
    tags: ["massa molar", "gramas", "mol"],
    fatos: [
      {
        lead: "a massa molar",
        answer: "a massa correspondente a um mol de determinada substancia",
        why: "ela e expressa geralmente em g/mol"
      },
      {
        lead: "a massa molar de um elemento",
        answer: "o valor numericamente associado a sua massa atomica em g/mol",
        why: "essa equivalencia facilita calculos"
      },
      {
        lead: "a massa molar de um composto",
        answer: "a soma das massas molares dos atomos presentes na formula",
        why: "o valor depende da composicao da substancia"
      },
      {
        lead: "a conversao de massa para mol",
        answer: "o calculo obtido ao dividir a massa da amostra pela massa molar",
        why: "essa relacao e basica na estequiometria"
      },
      {
        lead: "a conversao de mol para massa",
        answer: "o calculo obtido ao multiplicar a quantidade de mol pela massa molar",
        why: "isso permite prever massas consumidas ou formadas"
      }
    ]
  },
  {
    subtopico: "Proporcoes estequiometricas",
    habilidade:
      "interpretar coeficientes estequiometricos em termos proporcionais",
    tags: ["proporcoes", "coeficientes", "equacao balanceada"],
    fatos: [
      {
        lead: "a proporcao estequiometrica",
        answer: "a relacao quantitativa entre reagentes e produtos indicada pela equacao balanceada",
        why: "coeficientes mostram as quantidades relativas envolvidas"
      },
      {
        lead: "o coeficiente estequiometrico",
        answer: "o numero que expressa a proporcao em mol entre as especies da reacao",
        why: "ele orienta todos os calculos estequiometricos"
      },
      {
        lead: "a leitura molar de uma equacao",
        answer: "a interpretacao dos coeficientes como relacao entre quantidades de materia",
        why: "por isso e possivel comparar reagentes e produtos"
      },
      {
        lead: "a base do calculo estequiometrico",
        answer: "a combinacao entre equacao balanceada e conversao entre grandezas",
        why: "sem balanceamento correto as proporcoes ficam erradas"
      },
      {
        lead: "a relacao entre reagente e produto",
        answer: "a proporcao fixa determinada pelos coeficientes da equacao",
        why: "essa relacao independe da escala usada"
      }
    ]
  },
  {
    subtopico: "Calculos massa-massa",
    habilidade:
      "resolver problemas estequiometricos envolvendo massas",
    tags: ["massa-massa", "calculos", "proporcao"],
    fatos: [
      {
        lead: "um calculo massa-massa",
        answer: "a determinacao de massa de uma substancia a partir da massa de outra na mesma reacao",
        why: "ele usa a relacao de mol indicada pela equacao"
      },
      {
        lead: "o primeiro passo em massa-massa",
        answer: "converter a massa conhecida em mol usando a massa molar",
        why: "a equacao quimica trabalha com proporcoes molares"
      },
      {
        lead: "o ultimo passo em massa-massa",
        answer: "converter a quantidade em mol obtida novamente para massa",
        why: "isso devolve o resultado na grandeza pedida"
      },
      {
        lead: "a dependencia do balanceamento em massa-massa",
        answer: "a necessidade de coeficientes corretos para usar proporcoes confiaveis",
        why: "erros no balanceamento comprometem todo o calculo"
      },
      {
        lead: "a massa produzida teoricamente",
        answer: "a quantidade prevista pela estequiometria sem considerar perdas reais",
        why: "ela representa o rendimento maximo ideal"
      }
    ]
  },
  {
    subtopico: "Volume molar e gases",
    habilidade:
      "relacionar quantidades de gases a volume em condicoes conhecidas",
    tags: ["volume molar", "gases", "cptp"],
    fatos: [
      {
        lead: "o volume molar de um gas em cptp",
        answer: "o volume aproximado de 22,4 litros por mol",
        why: "essa referencia e muito usada em calculos escolares"
      },
      {
        lead: "a relacao entre mol e volume gasoso",
        answer: "a proporcionalidade que permite converter quantidade de materia em litros",
        why: "em certas condicoes, o volume molar e conhecido"
      },
      {
        lead: "o uso do volume molar na estequiometria",
        answer: "a possibilidade de calcular volumes de gases a partir da equacao balanceada",
        why: "isso amplia os problemas alem de massa"
      },
      {
        lead: "um mol de gas em mesmas condicoes",
        answer: "a quantidade que ocupa o mesmo volume que qualquer outro gas ideal nessas condicoes",
        why: "essa e uma consequencia da hipotese de Avogadro"
      },
      {
        lead: "a estequiometria com gases",
        answer: "o calculo de volumes ou mols gasosos usando proporcoes reacionais",
        why: "ela e comum em combustoes e decomposicoes"
      }
    ]
  },
  {
    subtopico: "Reagente limitante",
    habilidade:
      "identificar reagente limitante e reagente em excesso",
    tags: ["limitante", "excesso", "reagentes"],
    fatos: [
      {
        lead: "o reagente limitante",
        answer: "a substancia que se consome primeiro e determina a quantidade maxima de produto",
        why: "quando ele acaba, a reacao para"
      },
      {
        lead: "o reagente em excesso",
        answer: "a substancia presente acima da proporcao necessaria para reagir completamente",
        why: "parte dela sobra ao final da reacao"
      },
      {
        lead: "a identificacao do limitante",
        answer: "a comparacao entre quantidades disponiveis e proporcoes da equacao balanceada",
        why: "o menor rendimento proporcional indica o limitante"
      },
      {
        lead: "a importancia do reagente limitante",
        answer: "a definicao da quantidade real maxima de produto possivel",
        why: "ele controla o alcance da reacao"
      },
      {
        lead: "a sobra de reagente",
        answer: "a consequencia da presenca de substancia em excesso frente a outra limitante",
        why: "nem todos os reagentes sao consumidos integralmente"
      }
    ]
  },
  {
    subtopico: "Rendimento das reacoes",
    habilidade:
      "calcular rendimento teorico e percentual de reacoes",
    tags: ["rendimento", "teorico", "percentual"],
    fatos: [
      {
        lead: "o rendimento teorico",
        answer: "a quantidade maxima de produto prevista pela estequiometria ideal",
        why: "ele supoe aproveitamento total sem perdas"
      },
      {
        lead: "o rendimento real",
        answer: "a quantidade efetivamente obtida em uma reacao pratica",
        why: "ela costuma ser menor que a quantidade teorica"
      },
      {
        lead: "o rendimento percentual",
        answer: "a razao entre rendimento real e teorico multiplicada por cem",
        why: "ele mede a eficiencia do processo"
      },
      {
        lead: "um rendimento menor que 100%",
        answer: "a indicacao de perdas, reacoes paralelas ou limitacoes experimentais",
        why: "processos reais dificilmente atingem perfeicao"
      },
      {
        lead: "a utilidade do rendimento",
        answer: "a avaliacao da eficiencia de uma transformacao quimica",
        why: "ele orienta comparacoes e melhorias em processos"
      }
    ]
  },
  {
    subtopico: "Pureza de reagentes",
    habilidade:
      "considerar pureza de reagentes em calculos estequiometricos",
    tags: ["pureza", "impurezas", "massa util"],
    fatos: [
      {
        lead: "a pureza de um reagente",
        answer: "a porcentagem da massa da amostra que corresponde de fato a substancia desejada",
        why: "nem toda amostra comercial e cem por cento pura"
      },
      {
        lead: "a impureza",
        answer: "a parte da amostra que nao participa da reacao como o reagente principal",
        why: "ela precisa ser descontada nos calculos"
      },
      {
        lead: "a massa util do reagente",
        answer: "a porcao realmente correspondente a substancia pura que reage",
        why: "somente essa fracao entra na estequiometria"
      },
      {
        lead: "o ajuste de calculo por pureza",
        answer: "a correcao da massa da amostra antes de aplicar as proporcoes da equacao",
        why: "usar massa total sem correcao gera erro"
      },
      {
        lead: "a importancia da pureza",
        answer: "a obtencao de resultados mais realistas em problemas e processos industriais",
        why: "materiais reais frequentemente contem impurezas"
      }
    ]
  },
  {
    subtopico: "Estequiometria e cotidiano",
    habilidade:
      "aplicar raciocinio estequiometrico em contextos do cotidiano e da industria",
    tags: ["cotidiano", "industria", "aplicacoes"],
    fatos: [
      {
        lead: "a estequiometria na industria",
        answer: "o uso de proporcoes quimicas para planejar consumo de reagentes e producao",
        why: "ela evita desperdicio e melhora eficiencia"
      },
      {
        lead: "a estequiometria na combustao de combustiveis",
        answer: "o calculo de oxigenio consumido e produtos liberados em uma queima",
        why: "essa aplicacao e importante em energia e ambiente"
      },
      {
        lead: "a estequiometria em medicamentos e fertilizantes",
        answer: "o controle de quantidades necessarias para formular produtos com composicao definida",
        why: "proporcoes corretas sao fundamentais nesses setores"
      },
      {
        lead: "a importancia escolar da estequiometria",
        answer: "a conexao entre equacoes quimicas e interpretacao quantitativa da materia",
        why: "ela transforma formulas em calculos concretos"
      },
      {
        lead: "a previsao de consumo de materia-prima",
        answer: "a aplicacao das proporcoes reacionais ao planejamento de processos",
        why: "isso reduz custos e perdas"
      }
    ]
  },
  {
    subtopico: "Interpretacao de problemas",
    habilidade:
      "resolver problemas estequiometricos integrando varias grandezas",
    tags: ["problemas", "interpretacao", "estrategia"],
    fatos: [
      {
        lead: "a leitura correta do enunciado estequiometrico",
        answer: "a identificacao da grandeza dada, da grandeza pedida e da equacao envolvida",
        why: "isso organiza o caminho de resolucao"
      },
      {
        lead: "a estrategia geral de resolucao",
        answer: "converter a grandeza inicial para mol, aplicar a proporcao e reconverter quando necessario",
        why: "esse roteiro resolve muitos problemas"
      },
      {
        lead: "a integracao entre massa, mol e volume",
        answer: "a passagem entre diferentes grandezas usando massa molar e volume molar",
        why: "essas conversoes sustentam a resolucao completa"
      },
      {
        lead: "o erro comum em estequiometria",
        answer: "aplicar proporcoes diretamente entre massas sem considerar massas molares quando necessario",
        why: "as proporcoes da equacao sao essencialmente molares"
      },
      {
        lead: "a verificacao final de um problema",
        answer: "a conferencia de unidades, sentido fisico e coerencia do resultado obtido",
        why: "isso reduz erros de montagem e conversao"
      }
    ]
  }
];

export const estequiometria = {
  id: "quimica_estequiometria",
  materia: "Quimica",
  serie: [2],
  topico: "Estequiometria",
  metadados: {
    disciplinaId: "quimica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Quimica",
    frente: "Calculos quantitativos das reacoes",
    searchAliases: [
      "estequiometria",
      "mol e avogadro",
      "massa molar",
      "reagente limitante",
      "rendimento"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "relacionar quantidade de materia ao conceito de mole",
      "converter massa em quantidade de materia e vice-versa",
      "interpretar coeficientes estequiometricos em termos proporcionais",
      "identificar reagente limitante e reagente em excesso",
      "resolver problemas estequiometricos integrando varias grandezas"
    ],
    planejamentoQuestoes: CHEMISTRY_HUNDRED_FIFTY_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "est",
    serie: 2,
    materia: "Quimica",
    topico: "Estequiometria",
    blocos,
    stemBuilders: CHEMISTRY_STEM_BUILDERS,
    globalMatrix: CHEMISTRY_HUNDRED_FIFTY_MATRIX
  })
};

