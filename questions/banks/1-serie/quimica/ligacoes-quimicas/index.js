import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  CHEMISTRY_HUNDRED_FIFTY_MATRIX,
  CHEMISTRY_HUNDRED_FIFTY_PLAN,
  CHEMISTRY_STEM_BUILDERS
} from "../../../_shared/chemistryTopicPresets.js";

const blocos = [
  {
    subtopico: "Estabilidade e regra do octeto",
    habilidade:
      "relacionar estabilidade eletronica a formação de ligacoes quimicas",
    tags: ["octeto", "estabilidade", "ligacoes"],
    fatos: [
      {
        lead: "a regra do octeto",
        answer: "a tendencia de muitos atomos buscarem oito eletrons na camada de valencia",
        why: "essa configuracao costuma estar associada a maior estabilidade"
      },
      {
        lead: "a estabilidade eletronica",
        answer: "a configuracao em que o arranjo de eletrons torna a especie menos energetica",
        why: "ligacoes se formam para aproximar os atomos dessa condicao"
      },
      {
        lead: "a camada de valencia incompleta",
        answer: "a situação que favorece ganho, perda ou compartilhamento de eletrons",
        why: "elementos reativos tendem a buscar configuracao mais estavel"
      },
      {
        lead: "os gases nobres como referencia",
        answer: "o modelo de configuracao externa estavel para muitos elementos",
        why: "sua baixa reatividade inspirou a regra do octeto"
      },
      {
        lead: "a formação de ligacoes",
        answer: "o processo de reorganizacao eletronica para obter maior estabilidade",
        why: "atomos ligam-se quando isso reduz a energia do sistema"
      }
    ]
  },
  {
    subtopico: "Ligacao ionica",
    habilidade:
      "identificar características e formação da ligacao ionica",
    tags: ["ligacao ionica", "ions", "transferencia de eletrons"],
    fatos: [
      {
        lead: "a ligacao ionica",
        answer: "a interacao eletrostatica entre ions de cargas opostas",
        why: "ela surge apos transferencia de eletrons entre especies"
      },
      {
        lead: "a transferencia de eletrons",
        answer: "o processo em que uma especie perde eletrons e outra os recebe",
        why: "isso forma cations e anions que se atraem"
      },
      {
        lead: "o composto ionico",
        answer: "a substancia formada pela organizacao de ions positivos e negativos",
        why: "sua estrutura resulta da atracao entre cargas opostas"
      },
      {
        lead: "a formação de cation e anion",
        answer: "a consequência da perda e do ganho de eletrons respectivamente",
        why: "esses ions participam da ligacao ionica"
      },
      {
        lead: "a atracao eletrostatica nos ionicos",
        answer: "a forca que mantem unidas especies carregadas de sinais opostos",
        why: "ela explica a existencia do reticulo cristalino"
      }
    ]
  },
  {
    subtopico: "Ligacao covalente",
    habilidade:
      "identificar características e formação da ligacao covalente",
    tags: ["ligacao covalente", "compartilhamento", "moleculas"],
    fatos: [
      {
        lead: "a ligacao covalente",
        answer: "a uniao entre atomos por compartilhamento de pares de eletrons",
        why: "ela ocorre com frequência entre ametais"
      },
      {
        lead: "o compartilhamento eletronico",
        answer: "a divisao de pares de eletrons entre atomos ligados",
        why: "esse mecanismo permite aproximar-se da estabilidade"
      },
      {
        lead: "a molecula",
        answer: "o agrupamento de atomos unidos principalmente por ligacoes covalentes",
        why: "ela representa unidade de muitas substancias moleculares"
      },
      {
        lead: "a ligacao simples",
        answer: "a covalencia formada por um par de eletrons compartilhado",
        why: "ela é o caso mais basico de compartilhamento"
      },
      {
        lead: "a ligacao multipla",
        answer: "a situação em que dois ou tres pares de eletrons são compartilhados",
        why: "ligacoes duplas e triplas reforcam a uniao entre atomos"
      }
    ]
  },
  {
    subtopico: "Ligacao metalica",
    habilidade:
      "identificar características e formação da ligacao metalica",
    tags: ["ligacao metalica", "metais", "mar de eletrons"],
    fatos: [
      {
        lead: "a ligacao metalica",
        answer: "a interacao entre cations metalicos e eletrons deslocalizados",
        why: "ela explica varias propriedades tipicas dos metais"
      },
      {
        lead: "o mar de eletrons",
        answer: "a imagem da mobilidade dos eletrons na estrutura metalica",
        why: "esses eletrons circulam pela rede de atomos metalicos"
      },
      {
        lead: "a condutividade dos metais",
        answer: "a propriedade favorecida pela livre movimentacao de eletrons",
        why: "por isso metais conduzem bem corrente e calor"
      },
      {
        lead: "a maleabilidade",
        answer: "a capacidade de um metal deformar-se sem quebrar facilmente",
        why: "a ligacao metalica permite rearranjos na estrutura"
      },
      {
        lead: "a ductilidade",
        answer: "a possibilidade de transformar metais em fios",
        why: "ela também decorre da natureza da ligacao metalica"
      }
    ]
  },
  {
    subtopico: "Polaridade das ligacoes",
    habilidade:
      "relacionar diferenca de eletronegatividade a polaridade",
    tags: ["polaridade", "eletronegatividade", "dipolo"],
    fatos: [
      {
        lead: "a polaridade da ligacao",
        answer: "a distribuicao desigual de cargas ao longo de uma ligacao covalente",
        why: "ela depende da diferenca de eletronegatividade entre os atomos"
      },
      {
        lead: "uma ligacao apolar",
        answer: "a ligacao em que o compartilhamento eletrico ocorre de forma mais equilibrada",
        why: "isso costuma acontecer entre atomos de eletronegatividades semelhantes"
      },
      {
        lead: "uma ligacao polar",
        answer: "a ligacao com deslocamento de densidade eletronica para um dos atomos",
        why: "o mais eletronegativo atrai mais fortemente os eletrons"
      },
      {
        lead: "o dipolo eletrico",
        answer: "a separacao parcial de cargas em uma ligacao ou molecula",
        why: "ele caracteriza a polaridade resultante"
      },
      {
        lead: "a eletronegatividade",
        answer: "a tendencia de um atomo atrair eletrons em uma ligacao",
        why: "ela é central para entender polaridade"
      }
    ]
  },
  {
    subtopico: "Geometria molecular",
    habilidade:
      "relacionar geometria molecular a distribuicao de pares eletronicos",
    tags: ["geometria molecular", "pares eletronicos", "forma"],
    fatos: [
      {
        lead: "a geometria molecular",
        answer: "a forma espacial assumida pelos atomos em uma molecula",
        why: "ela depende da distribuicao dos pares de eletrons"
      },
      {
        lead: "a repulsao entre pares eletronicos",
        answer: "o principio segundo o qual pares ao redor do atomo central buscam maior afastamento",
        why: "isso determina a geometria das moleculas"
      },
      {
        lead: "a geometria linear",
        answer: "a disposicao em que atomos ficam alinhados em uma unica direcao",
        why: "ela ocorre quando ha arranjos eletronicos compativeis com esse formato"
      },
      {
        lead: "a geometria angular",
        answer: "a forma dobrada de uma molecula com pares isolados influenciando a estrutura",
        why: "pares não ligantes alteram o arranjo espacial"
      },
      {
        lead: "a geometria tetraedrica",
        answer: "a organizacao espacial comum quando quatro direcoes de repulsao se equilibram",
        why: "ela aparece em varias moleculas covalentes simples"
      }
    ]
  },
  {
    subtopico: "Forcas intermoleculares",
    habilidade:
      "distinguir ligacoes intramoleculares de forcas intermoleculares",
    tags: ["forcas intermoleculares", "dipolo", "hidrogenio"],
    fatos: [
      {
        lead: "as forcas intermoleculares",
        answer: "as interacoes que ocorrem entre moleculas distintas",
        why: "elas influenciam propriedades fisicas como fusao e ebulicao"
      },
      {
        lead: "a ligacao de hidrogenio",
        answer: "uma interacao intermolecular forte envolvendo H ligado a F, O ou N",
        why: "ela intensifica atracao entre moleculas polares especificas"
      },
      {
        lead: "a forca dipolo-dipolo",
        answer: "a interacao entre polos positivos e negativos de moleculas polares",
        why: "ela ocorre quando existem dipolos permanentes"
      },
      {
        lead: "as forcas de dispersao",
        answer: "as interacoes presentes mesmo entre moleculas apolares por dipolos instantaneos",
        why: "também são chamadas forcas de London"
      },
      {
        lead: "a diferenca entre ligacao e forca intermolecular",
        answer: "o fato de uma unir atomos na molecula e a outra aproximar moleculas diferentes",
        why: "essa distincao evita confusoes conceituais"
      }
    ]
  },
  {
    subtopico: "Propriedades das substancias",
    habilidade:
      "relacionar tipos de ligacao a propriedades fisicas das substancias",
    tags: ["propriedades", "fusao", "conducao"],
    fatos: [
      {
        lead: "o alto ponto de fusao de compostos ionicos",
        answer: "a consequência da forte atracao eletrostatica no reticulo cristalino",
        why: "romper essas interacoes exige muita energia"
      },
      {
        lead: "a baixa conducao de compostos moleculares",
        answer: "a ausencia de cargas livres para transportar corrente em muitas situações",
        why: "moleculas neutras não conduzem como metais ou ionicos fundidos"
      },
      {
        lead: "a boa conducao eletrica dos metais",
        answer: "a propriedade explicada pela mobilidade do mar de eletrons",
        why: "eletrons livres atravessam a estrutura metalica"
      },
      {
        lead: "a solubilidade de muitos ionicos em agua",
        answer: "a interacao favoravel entre ions e moleculas polares do solvente",
        why: "a agua pode separar e estabilizar ions"
      },
      {
        lead: "a volatilidade de substancias moleculares",
        answer: "a facilidade maior de separar moleculas quando forcas intermoleculares são fracas",
        why: "isso pode resultar em menor ponto de ebulicao"
      }
    ]
  },
  {
    subtopico: "Representacoes de Lewis",
    habilidade:
      "interpretar formulas eletronicas e estruturas de Lewis",
    tags: ["lewis", "formula eletronica", "pares isolados"],
    fatos: [
      {
        lead: "a estrutura de Lewis",
        answer: "a representacao dos eletrons de valencia em ligacoes e pares livres",
        why: "ela ajuda a visualizar como os atomos compartilham eletrons"
      },
      {
        lead: "os pares ligantes",
        answer: "os pares de eletrons compartilhados que formam ligacoes covalentes",
        why: "eles unem atomos na estrutura de Lewis"
      },
      {
        lead: "os pares não ligantes",
        answer: "os pares de eletrons que permanecem localizados em um unico atomo",
        why: "eles influenciam polaridade e geometria"
      },
      {
        lead: "a formula eletronica",
        answer: "a representacao que destaca os eletrons de valencia dos atomos",
        why: "ela antecede ou acompanha a estrutura de Lewis"
      },
      {
        lead: "a utilidade das estruturas de Lewis",
        answer: "a previsao de ligacoes, pares isolados e geometria aproximada",
        why: "elas sintetizam a organizacao eletronica em moleculas"
      }
    ]
  },
  {
    subtopico: "Aplicacoes e comparacoes",
    habilidade:
      "comparar diferentes tipos de ligacao e suas consequências",
    tags: ["comparacao", "aplicacoes", "materiais"],
    fatos: [
      {
        lead: "a diferenca entre ligacao ionica e covalente",
        answer: "o fato de uma envolver transferencia e a outra compartilhamento de eletrons",
        why: "isso produz materiais com propriedades bem distintas"
      },
      {
        lead: "a diferenca entre ligacao covalente e metalica",
        answer: "o contraste entre pares localizados compartilhados e eletrons deslocalizados",
        why: "esse contraste ajuda a explicar propriedades dos metais"
      },
      {
        lead: "a escolha do tipo de ligacao entre elementos",
        answer: "a consequência das características eletronicas e da diferenca de eletronegatividade",
        why: "metais e ametais tendem a interagir de formas distintas"
      },
      {
        lead: "a relação entre ligacao e material do cotidiano",
        answer: "a explicacao de propriedades como dureza, conducao e solubilidade por sua estrutura",
        why: "tipos de ligacao influenciam diretamente uso dos materiais"
      },
      {
        lead: "o estudo das ligacoes quimicas",
        answer: "a base para compreender interacoes entre atomos e propriedades das substancias",
        why: "ele conecta estrutura microscopica e comportamento macroscopico"
      }
    ]
  }
];

export const ligacoesQuimicas = {
  id: "quimica_ligacoes_quimicas",
  materia: "Química",
  serie: [1],
  topico: "Ligacoes Quimicas",
  metadados: {
    disciplinaId: "quimica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Química",
    frente: "Interacoes atomicas e propriedades da materia",
    searchAliases: [
      "ligacoes quimicas",
      "ligacao ionica covalente metalica",
      "regra do octeto",
      "polaridade",
      "forcas intermoleculares"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "relacionar estabilidade eletronica a formação de ligacoes quimicas",
      "identificar características e formação da ligacao ionica",
      "identificar características e formação da ligacao covalente",
      "relacionar diferenca de eletronegatividade a polaridade",
      "relacionar tipos de ligacao a propriedades fisicas das substancias"
    ],
    planejamentoQuestoes: CHEMISTRY_HUNDRED_FIFTY_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "lq",
    serie: 1,
    materia: "Química",
    topico: "Ligacoes Quimicas",
    blocos,
    stemBuilders: CHEMISTRY_STEM_BUILDERS,
    globalMatrix: CHEMISTRY_HUNDRED_FIFTY_MATRIX
  })
};

