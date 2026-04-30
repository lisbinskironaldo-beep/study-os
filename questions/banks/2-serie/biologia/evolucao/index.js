import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  BIOLOGY_STEM_BUILDERS,
  BIOLOGY_TWO_HUNDRED_MATRIX,
  BIOLOGY_TWO_HUNDRED_PLAN
} from "../../../_shared/biologyTopicPresets.js";

const blocos = [
  {
    subtopico: "Conceitos fundamentais de evolucao",
    habilidade:
      "identificar conceitos basicos e evidencias do processo evolutivo",
    tags: ["evolucao", "adaptacao", "especie"],
    fatos: [
      { lead: "a evolucao biologica", answer: "a mudanca das populacoes ao longo do tempo em termos geneticos e fenotipicos", why: "ela explica diversidade e transformacao dos seres vivos" },
      { lead: "a adaptacao", answer: "a caracteristica que aumenta a chance de sobrevivencia e reproducao em certo ambiente", why: "ela é favorecida em contextos seletivos" },
      { lead: "a variabilidade genetica", answer: "a diversidade de combinacoes de genes entre individuos de uma populacao", why: "ela fornece materia-prima para a evolucao" },
      { lead: "a especie biologica", answer: "o conjunto de individuos capazes de se reproduzir entre si gerando descendentes ferteis", why: "essa definicao ajuda a pensar isolamento e especiacao" },
      { lead: "a ancestralidade comum", answer: "a ideia de que seres vivos diferentes descendem de ancestrais compartilhados", why: "esse conceito e central na teoria evolutiva" }
    ]
  },
  {
    subtopico: "Lamarckismo",
    habilidade:
      "comparar teorias historicas da evolucao",
    tags: ["lamarck", "uso e desuso", "heranca adquirida"],
    fatos: [
      { lead: "o lamarckismo", answer: "a teoria que explicava mudancas dos seres vivos por uso e desuso e heranca de caracteres adquiridos", why: "ela antecede a formulacao darwinista" },
      { lead: "a lei do uso e desuso", answer: "a ideia de que estruturas muito usadas se desenvolveriam e pouco usadas se atrofiariam", why: "esse é um dos pilares da explicacao lamarckista" },
      { lead: "a heranca dos caracteres adquiridos", answer: "a proposta de transmissao a descendentes das modificacoes ocorridas durante a vida do individuo", why: "essa hipotese foi central em Lamarck" },
      { lead: "a importancia historica de Lamarck", answer: "a defesa de que os seres vivos se transformam ao longo do tempo", why: "embora sua explicacao esteja superada, ele rompeu com o fixismo" },
      { lead: "o transformismo lamarckista", answer: "a ideia de que as especies não são imutaveis e sofrem mudancas com o tempo", why: "isso representou avanco em relação ao pensamento fixista" }
    ]
  },
  {
    subtopico: "Darwinismo e selecao natural",
    habilidade:
      "comparar teorias historicas da evolucao",
    tags: ["darwin", "selecao natural", "adaptacao"],
    fatos: [
      { lead: "a selecao natural", answer: "o processo em que individuos com características vantajosas tendem a deixar mais descendentes", why: "essa diferenca de sucesso reprodutivo altera a populacao ao longo do tempo" },
      { lead: "o darwinismo", answer: "a teoria que explica a evolucao principalmente pela selecao natural atuando sobre variacoes", why: "ela se consolidou com forte base observacional" },
      { lead: "a luta pela sobrevivencia", answer: "a competicao por recursos limitados entre organismos de uma populacao", why: "esse contexto favorece a selecao de certas características" },
      { lead: "a descendencia com modificacao", answer: "a ideia de que os seres vivos descendem de ancestrais comuns sofrendo mudancas ao longo do tempo", why: "esse conceito resume a visao evolutiva de Darwin" },
      { lead: "a viagem do Beagle", answer: "a experiencia de observação que contribuiu para o desenvolvimento das ideias de Darwin", why: "ela forneceu dados sobre biodiversidade e distribuicao de especies" }
    ]
  },
  {
    subtopico: "Neodarwinismo",
    habilidade:
      "relacionar genetica e selecao natural na teoria sintetica da evolucao",
    tags: ["neodarwinismo", "sintese moderna", "genetica"],
    fatos: [
      { lead: "o neodarwinismo", answer: "a teoria sintetica que integra selecao natural e genetica mendeliana", why: "ela explica a evolucao por variação herdavel e mudanca de frequencias genicas" },
      { lead: "a teoria sintetica da evolucao", answer: "a formulacao que uniu Darwin e a genetica do seculo XX", why: "ela ampliou a compreensao dos mecanismos evolutivos" },
      { lead: "a frequência alelica", answer: "a proporcao de um alelo em relação ao total de alelos na populacao", why: "mudancas nessa frequência indicam evolucao populacional" },
      { lead: "a populacao como unidade evolutiva", answer: "a ideia de que a evolucao ocorre no conjunto de individuos de uma especie, e não em um individuo isolado", why: "quem evolui e a populacao ao longo das geracoes" },
      { lead: "a integracao entre genetica e evolucao", answer: "a explicacao dos processos evolutivos com base em heranca e selecao", why: "isso caracteriza a sintese moderna" }
    ]
  },
  {
    subtopico: "Mutacoes e variabilidade genetica",
    habilidade:
      "relacionar genetica e selecao natural na teoria sintetica da evolucao",
    tags: ["mutacoes", "variabilidade", "recombinacao"],
    fatos: [
      { lead: "a mutacao", answer: "a alteracao na sequencia do material genetico que pode gerar novas variantes", why: "ela é uma fonte importante de variabilidade" },
      { lead: "a recombinacao genetica", answer: "a formação de novas combinacoes de alelos durante a reproducao sexuada", why: "ela amplia a diversidade dentro das populacoes" },
      { lead: "a variabilidade hereditaria", answer: "a diferenca genetica transmissivel entre individuos", why: "sem essa variação a selecao natural não atua de forma efetiva" },
      { lead: "a mutacao favoravel", answer: "a alteracao genetica que pode aumentar a chance de sobrevivencia ou reproducao em certo ambiente", why: "ela tende a ser preservada pela selecao" },
      { lead: "a importancia da variabilidade para a evolucao", answer: "a oferta de diferentes características sobre as quais atuam os mecanismos seletivos", why: "ela sustenta a mudanca evolutiva das populacoes" }
    ]
  },
  {
    subtopico: "Especiacao",
    habilidade:
      "analisar processos de especiacao e isolamento reprodutivo",
    tags: ["especiacao", "isolamento", "novas especies"],
    fatos: [
      { lead: "a especiacao", answer: "o processo de formação de novas especies ao longo do tempo", why: "ela depende de divergencia genetica e isolamento reprodutivo" },
      { lead: "o isolamento reprodutivo", answer: "a incapacidade de dois grupos produzirem descendentes ferteis entre si", why: "ele separa populacoes em trajetorias evolutivas distintas" },
      { lead: "a especiacao alopatrica", answer: "a formação de especies em populacoes separadas geograficamente", why: "a barreira espacial dificulta fluxo genico" },
      { lead: "a especiacao simpatrica", answer: "a formação de especies sem separacao geografica completa", why: "outros mecanismos podem interromper o fluxo genico" },
      { lead: "o fluxo genico", answer: "a troca de genes entre populacoes por reproducao e migracao", why: "sua reducao favorece diferenciacao evolutiva" }
    ]
  },
  {
    subtopico: "Evidencias da evolucao",
    habilidade:
      "identificar conceitos basicos e evidencias do processo evolutivo",
    tags: ["fosseis", "anatomia comparada", "evidencias"],
    fatos: [
      { lead: "o registro fossil", answer: "a evidencia historica da existencia de organismos em epocas passadas", why: "ele mostra transformacoes e extincoes ao longo do tempo" },
      { lead: "a anatomia comparada", answer: "a análise de semelhancas e diferencas estruturais entre organismos", why: "ela pode indicar ancestralidade comum" },
      { lead: "os orgaos homologos", answer: "as estruturas de mesma origem evolutiva com funções possivelmente diferentes", why: "eles sustentam a ideia de ancestralidade comum" },
      { lead: "os orgaos analogos", answer: "as estruturas de origem diferente, mas função semelhante", why: "eles exemplificam convergencia adaptativa" },
      { lead: "a embriologia comparada", answer: "a observação de semelhancas no desenvolvimento inicial de diferentes organismos", why: "ela fornece indicios de parentesco evolutivo" }
    ]
  },
  {
    subtopico: "Selecao artificial e evolucao aplicada",
    habilidade:
      "aplicar conceitos evolutivos a situações praticas e atuais",
    tags: ["selecao artificial", "domesticacao", "resistencia"],
    fatos: [
      { lead: "a selecao artificial", answer: "a escolha humana de individuos com características desejadas para reproducao", why: "ela modifica populacoes ao longo das geracoes" },
      { lead: "a domesticacao", answer: "o processo de selecao prolongada de organismos para convivio e uso humano", why: "ela altera características comportamentais e fisicas" },
      { lead: "a resistencia bacteriana a antibioticos", answer: "o exemplo de evolucao observavel em resposta a selecao ambiental", why: "bacterias resistentes tendem a sobreviver e se multiplicar" },
      { lead: "a resistencia de insetos a inseticidas", answer: "a consequência da selecao de variantes capazes de suportar o produto quimico", why: "isso evidencia evolucao em populacoes naturais" },
      { lead: "a evolucao aplicada", answer: "o uso do conhecimento evolutivo para interpretar problemas em saude, agricultura e conservacao", why: "ela conecta teoria e realidade contemporanea" }
    ]
  },
  {
    subtopico: "Evolucao humana e biodiversidade",
    habilidade:
      "analisar a relação entre evolucao, diversidade biologica e origem humana",
    tags: ["evolucao humana", "biodiversidade", "hominideos"],
    fatos: [
      { lead: "a evolucao humana", answer: "o processo pelo qual diferentes linhagens de hominideos deram origem ao Homo sapiens", why: "ela faz parte da história evolutiva dos primatas" },
      { lead: "os hominideos", answer: "o grupo de primatas relacionado a linhagem humana", why: "nele se incluem formas ancestrais e o ser humano atual" },
      { lead: "a biodiversidade", answer: "a variedade de formas de vida existente em diferentes niveis de organizacao", why: "ela resulta de processos evolutivos ao longo do tempo" },
      { lead: "a adaptacao humana", answer: "a modificacao populacional associada a diferentes ambientes e modos de vida", why: "ela ocorre dentro da logica evolutiva da especie" },
      { lead: "a relação entre evolucao e biodiversidade", answer: "a explicacao da diversidade dos seres vivos como resultado de ancestralidade comum e diferenciacao", why: "a teoria evolutiva organiza a compreensao da vida" }
    ]
  },
  {
    subtopico: "Interpretação de problemas evolutivos",
    habilidade:
      "aplicar conceitos evolutivos a situações praticas e atuais",
    tags: ["interpretacao", "problemas evolutivos", "graficos"],
    fatos: [
      { lead: "a leitura de um problema evolutivo", answer: "a identificacao do mecanismo envolvido, como selecao, mutacao ou isolamento", why: "essa leitura direciona a interpretação correta" },
      { lead: "a interpretação de gráficos evolutivos", answer: "a análise de mudancas em frequencias genicas, populacoes ou características ao longo do tempo", why: "gráficos são comuns em questoes de evolucao" },
      { lead: "a distincao entre individuo e populacao em evolucao", answer: "o reconhecimento de que quem evolui e a populacao e não um organismo isolado", why: "essa e uma ideia fundamental da sintese moderna" },
      { lead: "a interpretação de exemplos adaptativos", answer: "a análise de características vantajosas em determinado contexto ambiental", why: "adaptacao depende de ambiente e selecao" },
      { lead: "a utilidade da teoria evolutiva", answer: "a integracao de evidencias, mecanismos e aplicacoes para explicar a diversidade biologica", why: "ela é um eixo central da biologia" }
    ]
  }
];

export const evolucao = {
  id: "biologia_evolucao",
  materia: "Biologia",
  serie: [2],
  topico: "Evolucao",
  metadados: {
    disciplinaId: "biologia",
    base: "ESCOLAR",
    eixo: "Biologia",
    frente: "Origem das especies, adaptacao e biodiversidade",
    searchAliases: [
      "evolucao",
      "darwinismo",
      "lamarckismo",
      "neodarwinismo",
      "especiacao",
      "evolucao humana"
    ],
    subtopicosBase: [
      "Conceitos fundamentais de evolucao",
      "Lamarckismo",
      "Darwinismo e selecao natural",
      "Neodarwinismo",
      "Mutacoes e variabilidade genetica",
      "Especiacao",
      "Evidencias da evolucao",
      "Selecao artificial e evolucao aplicada",
      "Evolucao humana e biodiversidade",
      "Interpretação de problemas evolutivos"
    ],
    habilidadesBase: [
      "identificar conceitos basicos e evidencias do processo evolutivo",
      "comparar teorias historicas da evolucao",
      "relacionar genetica e selecao natural na teoria sintetica da evolucao",
      "analisar processos de especiacao e isolamento reprodutivo",
      "aplicar conceitos evolutivos a situações praticas e atuais"
    ],
    planejamentoQuestoes: BIOLOGY_TWO_HUNDRED_PLAN,
    seloEditorial: "VERIFICADA",
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "evo",
    serie: 2,
    materia: "Biologia",
    topico: "Evolucao",
    blocos,
    stemBuilders: BIOLOGY_STEM_BUILDERS,
    globalMatrix: BIOLOGY_TWO_HUNDRED_MATRIX
  })
};
