import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  CHEMISTRY_HUNDRED_FIFTY_MATRIX,
  CHEMISTRY_HUNDRED_FIFTY_PLAN,
  CHEMISTRY_STEM_BUILDERS
} from "../../../_shared/chemistryTopicPresets.js";

const blocos = [
  {
    subtopico: "Conceito de reacao quimica",
    habilidade:
      "identificar evidencias e caracteristicas gerais de reacoes quimicas",
    tags: ["reacao quimica", "transformacao", "materia"],
    fatos: [
      {
        lead: "uma reacao quimica",
        answer: "a transformacao em que substancias iniciais originam novas substancias",
        why: "os reagentes reorganizam atomos e formam produtos"
      },
      {
        lead: "os reagentes",
        answer: "as substancias presentes no inicio de uma transformacao quimica",
        why: "eles participam do processo de formacao dos produtos"
      },
      {
        lead: "os produtos",
        answer: "as substancias obtidas ao final de uma reacao quimica",
        why: "eles resultam da reorganizacao dos atomos dos reagentes"
      },
      {
        lead: "a conservacao dos atomos numa reacao",
        answer: "a permanencia do numero de atomos de cada elemento antes e depois do processo",
        why: "os atomos apenas se reorganizam nas substancias"
      },
      {
        lead: "a transformacao quimica",
        answer: "a mudanca que altera a composicao das substancias envolvidas",
        why: "ela se diferencia de mudancas meramente fisicas"
      }
    ]
  },
  {
    subtopico: "Evidencias de reacao",
    habilidade:
      "identificar evidencias e caracteristicas gerais de reacoes quimicas",
    tags: ["evidencias", "gases", "precipitado"],
    fatos: [
      {
        lead: "a formacao de gas",
        answer: "uma possivel evidencia experimental de que uma reacao ocorreu",
        why: "o desprendimento de bolhas indica surgimento de nova substancia gasosa"
      },
      {
        lead: "a formacao de precipitado",
        answer: "o aparecimento de um solido insoluvel em meio liquido durante a reacao",
        why: "isso sinaliza nova substancia com baixa solubilidade"
      },
      {
        lead: "a mudanca de cor em uma mistura reacional",
        answer: "um indicio frequente de transformacao quimica",
        why: "ela pode refletir formacao de novas especies"
      },
      {
        lead: "a variacao de temperatura sem aquecimento externo",
        answer: "uma evidencia possivel de reacao com troca de energia",
        why: "algumas transformacoes liberam ou absorvem calor"
      },
      {
        lead: "o aparecimento de odor novo",
        answer: "um sinal de formacao de substancia diferente da inicial",
        why: "mudancas sensoriais podem indicar reacao"
      }
    ]
  },
  {
    subtopico: "Balanceamento de equacoes",
    habilidade:
      "balancear equacoes quimicas com base na conservacao da massa",
    tags: ["balanceamento", "equacoes", "conservacao"],
    fatos: [
      {
        lead: "o balanceamento de uma equacao",
        answer: "o ajuste dos coeficientes para igualar o numero de atomos nos dois lados",
        why: "ele respeita a conservacao da massa"
      },
      {
        lead: "o coeficiente estequiometrico",
        answer: "o numero colocado antes da formula para indicar a proporcao entre substancias",
        why: "ele participa do balanceamento das equacoes"
      },
      {
        lead: "a conservacao da massa no balanceamento",
        answer: "a exigencia de manter a mesma quantidade de atomos de cada elemento",
        why: "a massa total se conserva em sistema fechado"
      },
      {
        lead: "a alteracao do indice na formula",
        answer: "um erro no balanceamento por modificar a identidade da substancia",
        why: "o correto e ajustar coeficientes, nao subscritos"
      },
      {
        lead: "uma equacao nao balanceada",
        answer: "a representacao que ainda nao respeita a igualdade de atomos entre reagentes e produtos",
        why: "ela precisa de ajuste para expressar corretamente a reacao"
      }
    ]
  },
  {
    subtopico: "Lei de Lavoisier",
    habilidade:
      "relacionar reacoes quimicas a leis ponderais",
    tags: ["lavoisier", "conservacao da massa", "leis ponderais"],
    fatos: [
      {
        lead: "a lei de Lavoisier",
        answer: "o principio de que a soma das massas dos reagentes iguala a soma das massas dos produtos",
        why: "a massa se conserva nas transformacoes quimicas"
      },
      {
        lead: "a frase nada se perde, nada se cria",
        answer: "a ideia de conservacao da materia em uma transformacao",
        why: "ela resume a interpretacao classica da lei de Lavoisier"
      },
      {
        lead: "a massa em sistema fechado",
        answer: "a grandeza que se mantem constante durante a reacao quimica",
        why: "sem troca de materia com o meio, a soma de massas permanece"
      },
      {
        lead: "a aplicacao da lei de Lavoisier",
        answer: "o calculo de massas desconhecidas em reacoes balanceadas",
        why: "a conservacao da massa permite resolver proporcoes"
      },
      {
        lead: "a importancia experimental de Lavoisier",
        answer: "a consolidacao da quimica quantitativa baseada em medidas de massa",
        why: "isso fortaleceu o estudo moderno das reacoes"
      }
    ]
  },
  {
    subtopico: "Tipos de reacao",
    habilidade:
      "classificar reacoes quimicas segundo padroes de transformacao",
    tags: ["sintese", "analise", "deslocamento"],
    fatos: [
      {
        lead: "a reacao de sintese",
        answer: "a transformacao em que duas ou mais substancias originam um unico produto principal",
        why: "ela tambem e chamada de combinacao"
      },
      {
        lead: "a reacao de analise",
        answer: "a transformacao em que uma substancia origina duas ou mais substancias",
        why: "ela tambem e chamada de decomposicao"
      },
      {
        lead: "a reacao de deslocamento simples",
        answer: "a transformacao em que uma substancia simples substitui elemento de uma composta",
        why: "ela depende da reatividade relativa das especies"
      },
      {
        lead: "a reacao de dupla troca",
        answer: "a transformacao em que dois compostos trocam ions entre si",
        why: "ela e comum em meios aquosos"
      },
      {
        lead: "a classificacao de uma reacao",
        answer: "a identificacao do padrao de reorganizacao das especies envolvidas",
        why: "isso auxilia a prever produtos e comportamento"
      }
    ]
  },
  {
    subtopico: "Reacoes de sintese e analise",
    habilidade:
      "classificar reacoes quimicas segundo padroes de transformacao",
    tags: ["sintese", "analise", "decomposicao"],
    fatos: [
      {
        lead: "uma reacao de combinacao",
        answer: "outra forma de nomear a reacao de sintese",
        why: "nesse tipo de processo as especies se unem para formar produto unico"
      },
      {
        lead: "uma reacao de decomposicao",
        answer: "outra forma de nomear a reacao de analise",
        why: "um composto se fragmenta em duas ou mais especies"
      },
      {
        lead: "a decomposicao termica",
        answer: "a analise provocada pelo fornecimento de calor",
        why: "o aquecimento pode quebrar estruturas quimicas"
      },
      {
        lead: "a sintese com oxigenio",
        answer: "o caso em que uma substancia reage com oxigenio formando novo composto",
        why: "esse processo aparece em varias transformacoes comuns"
      },
      {
        lead: "a comparacao entre sintese e analise",
        answer: "o contraste entre unir substancias e fragmentar uma substancia",
        why: "cada tipo segue logica oposta de reorganizacao"
      }
    ]
  },
  {
    subtopico: "Deslocamento e dupla troca",
    habilidade:
      "classificar reacoes quimicas segundo padroes de transformacao",
    tags: ["deslocamento", "dupla troca", "reatividade"],
    fatos: [
      {
        lead: "o deslocamento simples",
        answer: "a reacao em que um elemento substitui outro em um composto",
        why: "isso so ocorre quando a especie livre e mais reativa"
      },
      {
        lead: "a dupla troca",
        answer: "a reacao em que dois compostos permutam ions entre si",
        why: "ela pode gerar precipitado, gas ou agua"
      },
      {
        lead: "a serie de reatividade dos metais",
        answer: "a ordem comparativa que ajuda a prever deslocamentos metalicos",
        why: "metais mais reativos substituem menos reativos"
      },
      {
        lead: "o criterio para ocorrer dupla troca",
        answer: "a formacao de produto pouco ionizado, insoluvel ou gasoso",
        why: "isso favorece o deslocamento do equilibrio reacional"
      },
      {
        lead: "o deslocamento do hidrogenio por metal reativo",
        answer: "um caso de deslocamento simples em meio acido",
        why: "metais mais ativos podem liberar gas hidrogenio"
      }
    ]
  },
  {
    subtopico: "Reacoes de oxidacao e combustao",
    habilidade:
      "identificar reacoes de oxidacao e combustao em diferentes contextos",
    tags: ["oxidacao", "combustao", "oxigenio"],
    fatos: [
      {
        lead: "a combustao",
        answer: "a reacao rapida com oxigenio que libera energia",
        why: "ela e um caso importante de oxidacao"
      },
      {
        lead: "a combustao completa",
        answer: "a oxidacao em que ha oxigenio suficiente e formacao principal de CO2 e agua",
        why: "o combustivel e oxidado de modo mais pleno"
      },
      {
        lead: "a combustao incompleta",
        answer: "a combustao em que falta oxigenio e podem surgir CO e fuligem",
        why: "a oxidacao nao ocorre de forma total"
      },
      {
        lead: "a oxidacao quimica",
        answer: "o processo associado a perda de eletrons ou aumento do nox",
        why: "essa definicao e central em redox"
      },
      {
        lead: "a presenca de chama em uma combustao",
        answer: "o indicio visual de liberacao intensa de energia em forma de calor e luz",
        why: "varias combustoes manifestam esse efeito"
      }
    ]
  },
  {
    subtopico: "Velocidade das reacoes",
    habilidade:
      "relacionar fatores que influenciam a velocidade das reacoes",
    tags: ["cinetica", "velocidade", "catalisador"],
    fatos: [
      {
        lead: "a velocidade de reacao",
        answer: "a rapidez com que reagentes se transformam em produtos",
        why: "ela pode variar conforme condicoes do sistema"
      },
      {
        lead: "a influencia da temperatura",
        answer: "o aumento da energia media das particulas e da frequencia de choques eficazes",
        why: "temperaturas maiores costumam acelerar reacoes"
      },
      {
        lead: "a influencia da superficie de contato",
        answer: "a maior exposicao de particulas para colisoes reacionais",
        why: "substancias fragmentadas reagem mais rapidamente em muitos casos"
      },
      {
        lead: "o catalisador",
        answer: "a substancia que altera a velocidade da reacao sem ser consumida ao final",
        why: "ele oferece caminho energetico alternativo"
      },
      {
        lead: "a concentracao dos reagentes",
        answer: "o fator que modifica a frequencia de choques entre particulas reativas",
        why: "maior concentracao pode elevar a velocidade"
      }
    ]
  },
  {
    subtopico: "Interpretacao de equacoes e aplicacoes",
    habilidade:
      "interpretar equacoes quimicas em contextos experimentais e cotidianos",
    tags: ["equacoes", "aplicacoes", "interpretacao"],
    fatos: [
      {
        lead: "uma equacao quimica",
        answer: "a representacao simbolica dos reagentes, produtos e proporcoes de uma reacao",
        why: "ela sintetiza qualitativa e quantitativamente a transformacao"
      },
      {
        lead: "o estado fisico em uma equacao",
        answer: "a indicacao de se a substancia esta solida, liquida, gasosa ou aquosa",
        why: "essa informacao ajuda a interpretar o sistema"
      },
      {
        lead: "a leitura quantitativa de uma equacao",
        answer: "a interpretacao dos coeficientes como proporcoes entre quantidades de materia",
        why: "eles nao representam massas diretas, mas relacoes proporcionais"
      },
      {
        lead: "a aplicacao de reacoes no cotidiano",
        answer: "o uso de transformacoes quimicas em combustiveis, limpeza, alimentos e industria",
        why: "reacoes estao presentes em diversas praticas diarias"
      },
      {
        lead: "a utilidade de classificar reacoes",
        answer: "a previsao mais clara do comportamento e dos produtos formados",
        why: "isso organiza o estudo das transformacoes da materia"
      }
    ]
  }
];

export const reacoesQuimicas = {
  id: "quimica_reacoes_quimicas",
  materia: "Quimica",
  serie: [2],
  topico: "Reacoes Quimicas",
  metadados: {
    disciplinaId: "quimica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Quimica",
    frente: "Transformacoes e classificacao das reacoes",
    searchAliases: [
      "reacoes quimicas",
      "balanceamento de equacoes",
      "tipos de reacao",
      "combustao",
      "velocidade de reacao"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar evidencias e caracteristicas gerais de reacoes quimicas",
      "balancear equacoes quimicas com base na conservacao da massa",
      "relacionar reacoes quimicas a leis ponderais",
      "classificar reacoes quimicas segundo padroes de transformacao",
      "relacionar fatores que influenciam a velocidade das reacoes"
    ],
    planejamentoQuestoes: CHEMISTRY_HUNDRED_FIFTY_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "rq",
    serie: 2,
    materia: "Quimica",
    topico: "Reacoes Quimicas",
    blocos,
    stemBuilders: CHEMISTRY_STEM_BUILDERS,
    globalMatrix: CHEMISTRY_HUNDRED_FIFTY_MATRIX
  })
};

