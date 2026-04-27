import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  BIOLOGY_STEM_BUILDERS,
  BIOLOGY_TWO_HUNDRED_MATRIX,
  BIOLOGY_TWO_HUNDRED_PLAN
} from "../../../_shared/biologyTopicPresets.js";

const blocos = [
  {
    subtopico: "Citologia e metabolismo celular",
    habilidade:
      "integrar diferentes frentes da biologia em situacoes de revisao",
    tags: ["citologia", "metabolismo", "celula"],
    fatos: [
      { lead: "a membrana plasmatica", answer: "a estrutura que delimita a celula e controla trocas com o meio", why: "ela participa da homeostase celular" },
      { lead: "a mitocondria", answer: "a organela associada a respiracao celular e producao de ATP", why: "ela e central no metabolismo energetico" },
      { lead: "a fotossintese", answer: "o processo de producao de materia organica a partir de luz, agua e gas carbonico", why: "ele ocorre em organismos autotrofos e conecta biologia celular e ecologia" },
      { lead: "o ATP", answer: "a molecula que atua como moeda energetica da celula", why: "ela armazena e transfere energia para varios processos metabolicos" },
      { lead: "o metabolismo celular", answer: "o conjunto de reacoes quimicas que sustentam o funcionamento da celula", why: "ele inclui sintese, degradacao e obtencao de energia" }
    ]
  },
  {
    subtopico: "Genetica e hereditariedade",
    habilidade:
      "relacionar genetica, evolucao, ecologia e fisiologia em questoes amplas",
    tags: ["genetica", "hereditariedade", "genes"],
    fatos: [
      { lead: "o DNA como material genetico", answer: "a molecula que armazena e transmite a informacao hereditaria", why: "ela e base da heranca biologica" },
      { lead: "a segregacao dos alelos", answer: "a separacao dos fatores hereditarios durante a formacao dos gametas", why: "esse principio esta ligado a genetica mendeliana" },
      { lead: "a mutacao genetica", answer: "a alteracao na sequencia do material genetico que pode gerar variabilidade", why: "ela e fonte de novas combinacoes biologicas" },
      { lead: "o heredograma", answer: "o esquema grafico utilizado para analisar padroes de heranca em familias", why: "ele conecta genetica e interpretacao de casos humanos" },
      { lead: "a expressao genica", answer: "o processo pelo qual a informacao genetica se manifesta em RNA e proteinas", why: "ela relaciona gene, fenotipo e funcionamento do organismo" }
    ]
  },
  {
    subtopico: "Biotecnologia e bioetica",
    habilidade:
      "resolver problemas interdisciplinares com enfoque biologico",
    tags: ["biotecnologia", "bioetica", "engenharia genetica"],
    fatos: [
      { lead: "o DNA recombinante", answer: "a molecula formada por fragmentos de DNA de diferentes origens", why: "ela e ferramenta central da engenharia genetica" },
      { lead: "o organismo transgenico", answer: "o ser vivo que recebeu gene proveniente de outra especie", why: "ele e um caso particular de OGM" },
      { lead: "a clonagem", answer: "a producao de copias geneticamente muito semelhantes de genes, celulas ou organismos", why: "ela possui aplicacoes cientificas e debates eticos" },
      { lead: "as celulas-tronco", answer: "as celulas capazes de autorrenovacao e diferenciacao em outros tipos celulares", why: "elas tem grande relevancia medica e biotecnologica" },
      { lead: "a bioetica", answer: "a reflexao sobre limites e responsabilidades no uso de tecnicas biologicas", why: "ela orienta debates sobre biotecnologia e saude" }
    ]
  },
  {
    subtopico: "Evolucao e biodiversidade",
    habilidade:
      "relacionar genetica, evolucao, ecologia e fisiologia em questoes amplas",
    tags: ["evolucao", "biodiversidade", "selecao natural"],
    fatos: [
      { lead: "a selecao natural", answer: "o processo em que caracteristicas vantajosas tendem a tornar-se mais frequentes na populacao", why: "ela e um mecanismo central da evolucao" },
      { lead: "a ancestralidade comum", answer: "a ideia de que organismos diferentes descendem de ancestrais compartilhados", why: "ela organiza a visao evolutiva da biodiversidade" },
      { lead: "a especiacao", answer: "o processo de formacao de novas especies", why: "ela amplia a diversidade biologica ao longo do tempo" },
      { lead: "a variabilidade genetica", answer: "a diversidade de genes e combinacoes entre individuos de uma populacao", why: "ela sustenta a acao da evolucao" },
      { lead: "a biodiversidade", answer: "a variedade de genes, especies e ecossistemas existentes", why: "ela resulta de longos processos evolutivos" }
    ]
  },
  {
    subtopico: "Ecologia e cadeias alimentares",
    habilidade:
      "integrar diferentes frentes da biologia em situacoes de revisao",
    tags: ["ecologia", "cadeias alimentares", "piramides"],
    fatos: [
      { lead: "a cadeia alimentar", answer: "a sequencia de transferencia de materia e energia entre organismos", why: "ela organiza os niveis troficos de um ecossistema" },
      { lead: "a teia alimentar", answer: "o conjunto de cadeias alimentares interligadas", why: "ela representa melhor a complexidade ecologica real" },
      { lead: "o produtor", answer: "o organismo autotrofo que produz materia organica a partir de substancias inorganicas", why: "ele esta na base do fluxo energetico" },
      { lead: "a piramide de energia", answer: "a representacao da energia disponivel em cada nivel trofico", why: "ela evidencia a perda de energia ao longo da cadeia" },
      { lead: "o decompositor", answer: "o organismo que recicla materia organica morta no ambiente", why: "ele fecha a ciclagem da materia no ecossistema" }
    ]
  },
  {
    subtopico: "Ciclos biogeoquimicos e ambiente",
    habilidade:
      "relacionar genetica, evolucao, ecologia e fisiologia em questoes amplas",
    tags: ["ciclos", "carbono", "nitrogenio"],
    fatos: [
      { lead: "o ciclo do carbono", answer: "a circulacao do carbono entre atmosfera, seres vivos, oceanos e solo", why: "ele conecta metabolismo, clima e ecossistemas" },
      { lead: "o ciclo do nitrogenio", answer: "a transformacao e circulacao do nitrogenio entre ambiente e seres vivos", why: "ele depende fortemente da acao de micro-organismos" },
      { lead: "o ciclo da agua", answer: "a movimentacao da agua entre atmosfera, superficie, subsolo e organismos", why: "ele influencia clima e disponibilidade hidrica" },
      { lead: "a ciclagem da materia", answer: "o retorno de elementos quimicos ao ambiente e aos organismos", why: "essa dinamica sustenta a continuidade da vida" },
      { lead: "a interferencia humana nos ciclos", answer: "a alteracao dos fluxos naturais por acoes como desmatamento e emissao de poluentes", why: "isso pode gerar desequilibrios ambientais" }
    ]
  },
  {
    subtopico: "Impactos ambientais e sustentabilidade",
    habilidade:
      "resolver problemas interdisciplinares com enfoque biologico",
    tags: ["impactos ambientais", "sustentabilidade", "poluicao"],
    fatos: [
      { lead: "a poluicao ambiental", answer: "a degradacao do ar, da agua ou do solo por agentes nocivos", why: "ela afeta saude humana e ecossistemas" },
      { lead: "o efeito estufa intensificado", answer: "o aumento da retencao de calor associado a elevacao antropica de gases atmosfericos", why: "ele esta relacionado ao aquecimento global" },
      { lead: "a perda de biodiversidade", answer: "a reducao da diversidade biologica em niveis genetico, especifico ou ecossistemico", why: "ela enfraquece a estabilidade ambiental" },
      { lead: "a sustentabilidade", answer: "a busca de equilibrio entre uso dos recursos e manutencao das condicoes ambientais", why: "ela orienta praticas de longo prazo" },
      { lead: "a educacao ambiental", answer: "o processo de formacao critica voltado a compreensao e enfrentamento de problemas ecologicos", why: "ela contribui para participacao social e mudanca de praticas" }
    ]
  },
  {
    subtopico: "Fisiologia humana integrada",
    habilidade:
      "relacionar genetica, evolucao, ecologia e fisiologia em questoes amplas",
    tags: ["fisiologia", "sistemas", "homeostase"],
    fatos: [
      { lead: "a homeostase", answer: "a manutencao do equilibrio interno do organismo", why: "ela depende da integracao entre varios sistemas fisiologicos" },
      { lead: "o sistema circulatorio", answer: "o sistema responsavel pelo transporte de substancias pelo corpo", why: "ele integra trocas gasosas, nutrientes e excretas" },
      { lead: "o sistema respiratorio", answer: "o sistema responsavel pelas trocas gasosas entre organismo e ambiente", why: "ele fornece oxigenio e elimina gas carbonico" },
      { lead: "o sistema nervoso", answer: "o sistema que coordena respostas e integracao do organismo", why: "ele atua junto a sistemas sensoriais e motores" },
      { lead: "a integracao fisiologica", answer: "o funcionamento articulado entre sistemas para manter a vida", why: "nenhum sistema atua de modo totalmente isolado" }
    ]
  },
  {
    subtopico: "Botanica e zoologia em revisao",
    habilidade:
      "integrar diferentes frentes da biologia em situacoes de revisao",
    tags: ["botanica", "zoologia", "diversidade"],
    fatos: [
      { lead: "os vegetais autotrofos", answer: "os organismos capazes de produzir seu proprio alimento por fotossintese", why: "eles ocupam papel central na base dos ecossistemas" },
      { lead: "os tecidos vegetais", answer: "as estruturas especializadas que compoem o corpo das plantas", why: "eles se relacionam a conducao, sustentacao e crescimento" },
      { lead: "a diversidade animal", answer: "a variedade de grupos com diferentes planos corporais, habitats e modos de vida", why: "ela e resultado de processos evolutivos longos" },
      { lead: "a adaptacao zoologica", answer: "a caracteristica associada a sobrevivencia e reproducao de grupos animais em certos ambientes", why: "ela ajuda a entender a diversidade dos seres vivos" },
      { lead: "a revisao integrada de botanica e zoologia", answer: "a retomada de conceitos estruturais, fisiologicos e ecologicos dos grandes grupos", why: "ela fortalece a visao ampla da biologia" }
    ]
  },
  {
    subtopico: "Interpretacao de graficos, experimentos e questoes integradas",
    habilidade:
      "interpretar textos, tabelas, graficos e experimentos biologicos",
    tags: ["graficos", "experimentos", "interpretacao"],
    fatos: [
      { lead: "a leitura de um grafico biologico", answer: "a analise de variaveis, tendencias e relacoes representadas visualmente", why: "ela e essencial em questoes integradas e no enem" },
      { lead: "a interpretacao de um experimento biologico", answer: "a identificacao de problema, hipotese, variaveis e resultado obtido", why: "essa leitura liga metodo cientifico e conteudo" },
      { lead: "a questao integrada de biologia", answer: "o item que relaciona diferentes frentes do conteudo em uma mesma situacao-problema", why: "ela exige articulacao e nao apenas memorizacao" },
      { lead: "a leitura de tabela em biologia", answer: "a comparacao de dados e padroes quantitativos relacionados a organismos e processos", why: "tabelas ajudam a organizar evidencias em exercicios" },
      { lead: "a revisao final em biologia", answer: "a sintese articulada de conceitos de varias areas da disciplina para resolver problemas amplos", why: "ela prepara o estudante para interpretacao e conexao de temas" }
    ]
  }
];

export const revisaoGeral = {
  id: "biologia_revisao_geral",
  materia: "Biologia",
  serie: [3],
  topico: "Revisao Geral",
  metadados: {
    disciplinaId: "biologia",
    base: "ESCOLAR",
    eixo: "Biologia",
    frente: "Integracao de conteudos de biologia para revisao final",
    searchAliases: [
      "revisao geral biologia",
      "enem biologia",
      "revisao de biologia",
      "integracao de conteudos",
      "interpretacao em biologia",
      "biologia geral"
    ],
    subtopicosBase: [
      "Citologia e metabolismo celular",
      "Genetica e hereditariedade",
      "Biotecnologia e bioetica",
      "Evolucao e biodiversidade",
      "Ecologia e cadeias alimentares",
      "Ciclos biogeoquimicos e ambiente",
      "Impactos ambientais e sustentabilidade",
      "Fisiologia humana integrada",
      "Botanica e zoologia em revisao",
      "Interpretacao de graficos, experimentos e questoes integradas"
    ],
    habilidadesBase: [
      "integrar diferentes frentes da biologia em situacoes de revisao",
      "interpretar textos, tabelas, graficos e experimentos biologicos",
      "relacionar genetica, evolucao, ecologia e fisiologia em questoes amplas",
      "resolver problemas interdisciplinares com enfoque biologico",
      "sintetizar conteudos centrais da biologia escolar e do enem"
    ],
    planejamentoQuestoes: BIOLOGY_TWO_HUNDRED_PLAN,
    seloEditorial: "VERIFICADA",
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "revbio",
    serie: 3,
    materia: "Biologia",
    topico: "Revisao Geral",
    blocos,
    stemBuilders: BIOLOGY_STEM_BUILDERS,
    globalMatrix: BIOLOGY_TWO_HUNDRED_MATRIX
  })
};
