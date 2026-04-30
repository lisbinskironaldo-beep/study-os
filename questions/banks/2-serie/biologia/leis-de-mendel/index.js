import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  BIOLOGY_STEM_BUILDERS,
  BIOLOGY_TWO_HUNDRED_MATRIX,
  BIOLOGY_TWO_HUNDRED_PLAN
} from "../../../_shared/biologyTopicPresets.js";

const blocos = [
  {
    subtopico: "Contexto historico dos experimentos de Mendel",
    habilidade:
      "identificar os principios mendelianos e o contexto dos experimentos classicos",
    tags: ["mendel", "ervilhas", "história da genetica"],
    fatos: [
      { lead: "Gregor Mendel", answer: "o pesquisador que formulou leis basicas da hereditariedade a partir de cruzamentos com ervilhas", why: "seus experimentos inauguraram a genetica classica" },
      { lead: "as ervilhas de Mendel", answer: "o material biologico escolhido por possuir características contrastantes e facil controle de cruzamentos", why: "isso favoreceu observação de proporcoes hereditarias" },
      { lead: "a importancia historica dos experimentos de Mendel", answer: "a demonstracao de padroes matematicos na transmissao das características", why: "essa descoberta fundamentou a genetica mendeliana" },
      { lead: "a polinizacao controlada por Mendel", answer: "o procedimento para garantir cruzamentos entre parentais escolhidos", why: "isso evitava fecundacoes indesejadas" },
      { lead: "a genetica mendeliana", answer: "o estudo dos padroes de heranca baseados em fatores hereditarios discretos", why: "ela organiza muitos problemas classicos de cruzamento" }
    ]
  },
  {
    subtopico: "Primeira lei de Mendel",
    habilidade:
      "identificar os principios mendelianos e o contexto dos experimentos classicos",
    tags: ["primeira lei", "segregacao", "monoibridismo"],
    fatos: [
      { lead: "a primeira lei de Mendel", answer: "o principio segundo o qual os fatores hereditarios de um par se separam na formação dos gametas", why: "cada gameta recebe apenas um alelo de cada gene" },
      { lead: "a segregacao dos alelos", answer: "a separacao dos fatores hereditarios durante a formação dos gametas", why: "esse processo fundamenta a primeira lei" },
      { lead: "o monoibridismo", answer: "o cruzamento que considera apenas uma caracteristica hereditaria", why: "ele é o modelo mais simples para aplicar a primeira lei" },
      { lead: "a geracao F1 em cruzamento mendeliano simples", answer: "a descendencia obtida do cruzamento entre os parentais", why: "ela revela como os alelos interagem no heterozigoto" },
      { lead: "a geracao F2", answer: "a descendencia obtida a partir do cruzamento ou autofecundacao da F1", why: "ela costuma revelar as proporcoes classicas estudadas por Mendel" }
    ]
  },
  {
    subtopico: "Segunda lei de Mendel",
    habilidade:
      "identificar os principios mendelianos e o contexto dos experimentos classicos",
    tags: ["segunda lei", "segregacao independente", "diibridismo"],
    fatos: [
      { lead: "a segunda lei de Mendel", answer: "o principio de que pares de fatores diferentes segregam-se independentemente na formação dos gametas", why: "ela explica cruzamentos envolvendo duas características" },
      { lead: "a segregacao independente", answer: "a distribuicao autonoma de pares alelicos distintos para os gametas", why: "esse processo sustenta a segunda lei" },
      { lead: "o diibridismo", answer: "o cruzamento que considera simultaneamente duas características hereditarias", why: "ele é usado para aplicar a segunda lei de Mendel" },
      { lead: "a proporcao 9:3:3:1", answer: "o resultado fenotipico classico de certos cruzamentos diibridos com dominancia completa", why: "ela decorre da segregacao independente" },
      { lead: "a independencia entre genes", answer: "a condicao em que a heranca de um gene não interfere diretamente na de outro", why: "essa e a base do raciocínio da segunda lei" }
    ]
  },
  {
    subtopico: "Monoibridismo e cruzamentos simples",
    habilidade:
      "resolver cruzamentos monoibridos e diibridos com proporcoes fenotipicas e genotipicas",
    tags: ["monoibridismo", "cruzamentos", "quadrado de punnett"],
    fatos: [
      { lead: "o quadrado de Punnett", answer: "o esquema usado para organizar as combinacoes possíveis de gametas em cruzamentos", why: "ele facilita prever genotipos e fenotipos da prole" },
      { lead: "o cruzamento entre heterozigotos para um gene", answer: "o caso classico que pode gerar proporcao genotipica 1:2:1", why: "a combinacao dos alelos revela todas as possibilidades" },
      { lead: "a proporcao fenotipica 3:1", answer: "o resultado classico de certos cruzamentos monoibridos com dominancia completa", why: "o fenotipo recessivo reaparece em parte da F2" },
      { lead: "um parental homozigoto dominante", answer: "o individuo que possui dois alelos dominantes para a caracteristica estudada", why: "ele so produz gametas com o alelo dominante" },
      { lead: "um parental homozigoto recessivo", answer: "o individuo que possui dois alelos recessivos para a caracteristica estudada", why: "ele so produz gametas com o alelo recessivo" }
    ]
  },
  {
    subtopico: "Diibridismo e segregacao independente",
    habilidade:
      "resolver cruzamentos monoibridos e diibridos com proporcoes fenotipicas e genotipicas",
    tags: ["diibridismo", "duas características", "proporcoes"],
    fatos: [
      { lead: "o gameta em um heterozigoto diibrido", answer: "a combinacao de alelos formada pela segregacao independente dos dois genes", why: "por isso surgem varios tipos de gametas" },
      { lead: "a multiplicacao de probabilidades no diibridismo", answer: "o recurso usado para combinar eventos geneticos independentes", why: "ele simplifica a resolucao de varios problemas" },
      { lead: "a proporcao genotipica em cruzamentos diibridos", answer: "a distribuicao dos diferentes genotipos obtidos a partir da combinacao de dois pares alelicos", why: "ela é mais ampla que no monoibridismo" },
      { lead: "a análise de duas características ao mesmo tempo", answer: "a situação em que se considera simultaneamente dois genes distintos no cruzamento", why: "isso caracteriza o diibridismo" },
      { lead: "a aplicacao do diibridismo", answer: "a previsao de descendentes quando dois caracteres segregam de forma independente", why: "essa análise amplia a compreensao da heranca mendeliana" }
    ]
  },
  {
    subtopico: "Probabilidade aplicada a genetica",
    habilidade:
      "aplicar probabilidade e heredogramas a problemas de heranca",
    tags: ["probabilidade", "genetica", "eventos"],
    fatos: [
      { lead: "a probabilidade em genetica", answer: "a ferramenta matemática usada para prever frequencias de genotipos e fenotipos esperados", why: "cruzamentos mendelianos podem ser analisados probabilisticamente" },
      { lead: "a regra do produto em genetica", answer: "a multiplicacao das probabilidades de eventos independentes", why: "ela é util quando duas condicoes devem ocorrer juntas" },
      { lead: "a regra da soma em genetica", answer: "a adicao das probabilidades de eventos mutuamente exclusivos", why: "ela ajuda quando diferentes caminhos levam ao mesmo resultado" },
      { lead: "um evento genetico independente", answer: "a situação em que a ocorrencia de um resultado não altera a probabilidade do outro", why: "isso aparece em varios cruzamentos de genes distintos" },
      { lead: "a previsao probabilistica", answer: "a estimativa de frequencias esperadas e não a garantia de resultados exatos em cada familia", why: "probabilidade descreve tendencias, não certezas absolutas" }
    ]
  },
  {
    subtopico: "Heredogramas mendelianos",
    habilidade:
      "aplicar probabilidade e heredogramas a problemas de heranca",
    tags: ["heredogramas", "mendel", "análise familiar"],
    fatos: [
      { lead: "um heredograma mendeliano", answer: "o esquema familiar usado para inferir padroes simples de heranca com base nas leis de Mendel", why: "ele conecta teoria mendeliana e casos familiares" },
      { lead: "a recorrencia de fenotipo recessivo em pais não afetados", answer: "o indicio de que ambos podem ser heterozigotos", why: "isso e frequente em herancas autossomicas recessivas" },
      { lead: "a distribuicao semelhante entre sexos em heranca autossomica", answer: "uma pista de que o gene não esta ligado aos cromossomos sexuais", why: "autossomos ocorrem em ambos os sexos em número equivalente" },
      { lead: "a análise de simbolos no heredograma", answer: "a leitura de geracoes, casais e descendentes para inferir transmissao", why: "essa etapa e basica para resolver problemas familiares" },
      { lead: "a inferencia de genotipos em heredogramas", answer: "a deducao da composicao alelica mais provavel dos individuos", why: "ela combina padrao fenotipico e regras mendelianas" }
    ]
  },
  {
    subtopico: "Excecoes aparentes e extensoes didaticas",
    habilidade:
      "analisar questoes interpretativas e calculos em situações mendelianas",
    tags: ["dominancia incompleta", "codominancia", "extensoes"],
    fatos: [
      { lead: "a dominancia incompleta", answer: "a situação em que o heterozigoto apresenta fenotipo intermediario", why: "nesse caso não ha mascara total de um alelo sobre o outro" },
      { lead: "a codominancia", answer: "a situação em que dois alelos se expressam ao mesmo tempo no heterozigoto", why: "ela amplia a compreensao dos padroes mendelianos classicos" },
      { lead: "as extensoes didaticas das leis de Mendel", answer: "os casos que mantem a ideia de heranca por genes, mas apresentam interacoes mais variadas", why: "elas mostram que a genetica real pode ser mais complexa" },
      { lead: "a dominancia completa", answer: "a relação em que o heterozigoto manifesta plenamente o fenotipo dominante", why: "esse é o caso mais simples discutido por Mendel" },
      { lead: "a utilidade de estudar excecoes aparentes", answer: "a compreensao de que os principios mendelianos são base para analisar padroes mais complexos", why: "isso evita interpretar genetica como um sistema excessivamente rigido" }
    ]
  },
  {
    subtopico: "Aplicacoes em genetica humana",
    habilidade:
      "relacionar leis de Mendel a exemplos de genetica humana e vegetal",
    tags: ["genetica humana", "mendel", "heranca"],
    fatos: [
      { lead: "a aplicacao das leis de Mendel em humanos", answer: "a análise de padroes simples de heranca em características e doencas familiares", why: "muitos casos podem ser interpretados por segregacao de alelos" },
      { lead: "o estudo de grupos sanguineos em Mendel", answer: "um exemplo didatico de aplicacao de principios de segregacao e combinacao de alelos", why: "ele aparece com frequência em problemas escolares" },
      { lead: "a heranca de certas doencas recessivas", answer: "um campo em que a primeira lei de Mendel e frequentemente aplicada", why: "ela ajuda a prever risco para descendentes" },
      { lead: "a heranca em vegetais cultivados", answer: "um caso em que cruzamentos mendelianos ajudam a selecionar características desejaveis", why: "essa foi justamente a base experimental dos trabalhos de Mendel" },
      { lead: "a previsao de descendencia por Mendel", answer: "a estimativa das proporcoes provaveis de genotipos e fenotipos", why: "ela tem utilidade em genetica humana, vegetal e animal" }
    ]
  },
  {
    subtopico: "Resolucao de problemas mendelianos",
    habilidade:
      "analisar questoes interpretativas e calculos em situações mendelianas",
    tags: ["problemas", "mendel", "resolucao"],
    fatos: [
      { lead: "a resolucao de um problema mendeliano", answer: "a organizacao do cruzamento, dos alelos e das proporcoes esperadas", why: "esse procedimento evita erros de interpretação" },
      { lead: "a representacao simbolica dos alelos", answer: "o uso de letras para distinguir formas dominantes e recessivas de um gene", why: "ela facilita montar cruzamentos" },
      { lead: "a etapa inicial de um exercicio de Mendel", answer: "a identificacao do fenotipo, dos genotipos possíveis e do tipo de heranca", why: "essa leitura direciona o restante do raciocínio" },
      { lead: "o cruzamento-teste", answer: "o cruzamento com individuo recessivo usado para revelar genotipo desconhecido", why: "ele é um recurso classico de análise genetica" },
      { lead: "a interpretação final de um problema genetico", answer: "a traducao do resultado numerico em significado biologico para a prole", why: "resolver não e so calcular, mas concluir corretamente" }
    ]
  }
];

export const leisDeMendel = {
  id: "biologia_leis_de_mendel",
  materia: "Biologia",
  serie: [2],
  topico: "Leis de Mendel",
  metadados: {
    disciplinaId: "biologia",
    base: "ESCOLAR",
    eixo: "Biologia",
    frente: "Padroes de heranca mendeliana",
    searchAliases: [
      "leis de mendel",
      "primeira lei de mendel",
      "segunda lei de mendel",
      "monoibridismo",
      "diibridismo",
      "probabilidade genetica"
    ],
    subtopicosBase: [
      "Contexto historico dos experimentos de Mendel",
      "Primeira lei de Mendel",
      "Segunda lei de Mendel",
      "Monoibridismo e cruzamentos simples",
      "Diibridismo e segregacao independente",
      "Probabilidade aplicada a genetica",
      "Heredogramas mendelianos",
      "Excecoes aparentes e extensoes didaticas",
      "Aplicacoes em genetica humana",
      "Resolucao de problemas mendelianos"
    ],
    habilidadesBase: [
      "identificar os principios mendelianos e o contexto dos experimentos classicos",
      "resolver cruzamentos monoibridos e diibridos com proporcoes fenotipicas e genotipicas",
      "aplicar probabilidade e heredogramas a problemas de heranca",
      "relacionar leis de Mendel a exemplos de genetica humana e vegetal",
      "analisar questoes interpretativas e calculos em situações mendelianas"
    ],
    planejamentoQuestoes: BIOLOGY_TWO_HUNDRED_PLAN,
    seloEditorial: "VERIFICADA",
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "lm",
    serie: 2,
    materia: "Biologia",
    topico: "Leis de Mendel",
    blocos,
    stemBuilders: BIOLOGY_STEM_BUILDERS,
    globalMatrix: BIOLOGY_TWO_HUNDRED_MATRIX
  })
};
