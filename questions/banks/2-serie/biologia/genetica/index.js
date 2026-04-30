import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  BIOLOGY_STEM_BUILDERS,
  BIOLOGY_TWO_HUNDRED_MATRIX,
  BIOLOGY_TWO_HUNDRED_PLAN
} from "../../../_shared/biologyTopicPresets.js";

const blocos = [
  {
    subtopico: "Conceitos fundamentais de genetica",
    habilidade:
      "identificar conceitos basicos de genes, cromossomos e hereditariedade",
    tags: ["genetica", "hereditariedade", "conceitos"],
    fatos: [
      { lead: "a genetica", answer: "a area da biologia que estuda hereditariedade e variação dos seres vivos", why: "ela investiga como informacoes biologicas são transmitidas e expressas" },
      { lead: "a hereditariedade", answer: "a transmissao de características biologicas entre geracoes", why: "essa transmissao depende da informacao genetica" },
      { lead: "o gene", answer: "a unidade funcional da heranca associada a um segmento de DNA", why: "ele participa da determinacao de características" },
      { lead: "o alelo", answer: "cada uma das diferentes formas de um mesmo gene", why: "alelos explicam variacoes hereditarias em uma populacao" },
      { lead: "o genotipo", answer: "o conjunto de alelos que um individuo possui", why: "ele representa a constituicao genetica do organismo" }
    ]
  },
  {
    subtopico: "DNA, RNA e sintese proteica",
    habilidade:
      "explicar a relação entre DNA, RNA, codigo genetico e sintese proteica",
    tags: ["dna", "rna", "sintese proteica"],
    fatos: [
      { lead: "o DNA", answer: "a molecula que armazena a informacao genetica dos seres vivos", why: "sua sequencia de bases organiza instrucoes biologicas" },
      { lead: "o RNA", answer: "a molecula que participa da expressao da informacao genetica", why: "ele atua em processos como transcricao e traducao" },
      { lead: "a transcricao", answer: "a produção de RNA a partir de um molde de DNA", why: "esse processo copia a informacao para uso celular" },
      { lead: "a traducao", answer: "a sintese de proteina com base na sequencia de um RNA mensageiro", why: "ela converte informacao nucleotidica em sequencia de aminoacidos" },
      { lead: "o codigo genetico", answer: "a correspondencia entre trincas de bases e aminoacidos", why: "ele organiza a linguagem molecular da sintese proteica" }
    ]
  },
  {
    subtopico: "Genes, cromossomos e cariotipo",
    habilidade:
      "analisar mutacoes, cariotipos e alteracoes geneticas humanas",
    tags: ["cromossomos", "cariotipo", "genes"],
    fatos: [
      { lead: "o cromossomo", answer: "a estrutura formada por DNA associado a proteinas no nucleo celular", why: "ele organiza e compacta a informacao genetica" },
      { lead: "o cariotipo", answer: "a representacao ordenada do conjunto de cromossomos de um individuo", why: "ele permite observar número e morfologia cromossomica" },
      { lead: "os cromossomos homologos", answer: "o par de cromossomos com genes correspondentes em mesmos loci", why: "um cromossomo vem do pai e outro da mae" },
      { lead: "o locus genico", answer: "a posicao ocupada por um gene em um cromossomo", why: "genes alelos ocupam o mesmo locus em homologos" },
      { lead: "o genoma", answer: "o conjunto total do material genetico de um organismo", why: "ele inclui toda a informacao herdavel da especie" }
    ]
  },
  {
    subtopico: "Replicacao do DNA e divisao celular",
    habilidade:
      "explicar a relação entre DNA, RNA, codigo genetico e sintese proteica",
    tags: ["replicacao", "mitose", "meiose"],
    fatos: [
      { lead: "a replicacao do DNA", answer: "o processo de duplicacao da molecula antes da divisao celular", why: "ele garante que a informacao genetica seja transmitida as células-filhas" },
      { lead: "a mitose", answer: "a divisao celular que gera duas células geneticamente semelhantes", why: "ela participa de crescimento e renovacao de tecidos" },
      { lead: "a meiose", answer: "a divisao celular que reduz pela metade o número de cromossomos", why: "ela forma gametas e amplia variabilidade genetica" },
      { lead: "as cromatides-irmas", answer: "as copias identicas de um cromossomo apos a replicacao", why: "elas permanecem unidas ate etapas especificas da divisao" },
      { lead: "a importancia da meiose para a genetica", answer: "a produção de gametas e a segregacao dos alelos", why: "sem meiose não ha reproducao sexuada com variabilidade adequada" }
    ]
  },
  {
    subtopico: "Codigo genetico e expressao genica",
    habilidade:
      "explicar a relação entre DNA, RNA, codigo genetico e sintese proteica",
    tags: ["codigo genetico", "expressao genica", "proteinas"],
    fatos: [
      { lead: "a expressao genica", answer: "o conjunto de processos pelos quais a informacao do gene se manifesta na célula", why: "ela envolve transcricao e, em muitos casos, traducao" },
      { lead: "o RNA mensageiro", answer: "a molecula que leva a informacao genetica do DNA aos ribossomos", why: "ele serve de molde para a sintese de proteinas" },
      { lead: "o RNA transportador", answer: "a molecula que leva aminoacidos para o ribossomo durante a traducao", why: "ele relaciona anticodons aos codons do mRNA" },
      { lead: "o RNA ribossomico", answer: "o componente estrutural e funcional dos ribossomos", why: "ele participa diretamente da sintese proteica" },
      { lead: "o codon", answer: "a trinca de bases no mRNA que especifica um aminoacido ou sinal de parada", why: "o codigo genetico e lido em trincas" }
    ]
  },
  {
    subtopico: "Mutacoes geneticas e cromossomicas",
    habilidade:
      "analisar mutacoes, cariotipos e alteracoes geneticas humanas",
    tags: ["mutacoes", "alteracoes cromossomicas", "genetica humana"],
    fatos: [
      { lead: "a mutacao genica", answer: "a alteracao na sequencia de bases do DNA de um gene", why: "ela pode modificar a informacao codificada" },
      { lead: "a mutacao cromossomica", answer: "a alteracao estrutural ou numerica envolvendo cromossomos", why: "ela afeta porcoes maiores do material genetico" },
      { lead: "a aneuploidia", answer: "a alteracao no número de cromossomos de um individuo", why: "ela pode surgir por erro na separacao cromossomica" },
      { lead: "a mutacao somatica", answer: "a alteracao genetica que ocorre em células do corpo não reprodutivas", why: "ela não e herdada pela descendencia sexual" },
      { lead: "o agente mutagenico", answer: "o fator fisico, quimico ou biologico capaz de aumentar a taxa de mutacoes", why: "radiacoes e certos compostos podem atuar desse modo" }
    ]
  },
  {
    subtopico: "Heredogramas e análise de hereditariedade",
    habilidade:
      "interpretar heredogramas, padroes de dominancia e grupos sanguineos",
    tags: ["heredograma", "análise genetica", "familias"],
    fatos: [
      { lead: "o heredograma", answer: "o esquema gráfico usado para representar a ocorrencia de características em uma familia", why: "ele ajuda a inferir padroes de heranca" },
      { lead: "o individuo afetado no heredograma", answer: "o membro da familia que manifesta a caracteristica estudada", why: "essa identificacao orienta a análise do padrao hereditario" },
      { lead: "o padrao autossomico", answer: "a heranca associada a genes localizados em cromossomos não sexuais", why: "ela pode afetar homens e mulheres em proporcoes semelhantes" },
      { lead: "o padrao ligado ao sexo", answer: "a heranca relacionada a genes situados nos cromossomos sexuais", why: "ela pode apresentar distribuicoes diferentes entre os sexos" },
      { lead: "a leitura de um heredograma", answer: "a interpretação das relações familiares para inferir genotipos e padroes de heranca", why: "ela combina simbolos, geracoes e recorrencia do fenotipo" }
    ]
  },
  {
    subtopico: "Dominancia, recessividade e codominancia",
    habilidade:
      "interpretar heredogramas, padroes de dominancia e grupos sanguineos",
    tags: ["dominancia", "recessividade", "codominancia"],
    fatos: [
      { lead: "a dominancia", answer: "a relação em que um alelo se manifesta no fenotipo do heterozigoto", why: "o alelo dominante mascara a expressao do recessivo nesse caso" },
      { lead: "a recessividade", answer: "a condicao em que um alelo so se manifesta em homozigose", why: "no heterozigoto sua expressao fica encoberta pelo dominante" },
      { lead: "a codominancia", answer: "a relação em que dois alelos se expressam simultaneamente no heterozigoto", why: "nenhum deles anula completamente o outro" },
      { lead: "o heterozigoto", answer: "o individuo que possui dois alelos diferentes para um gene", why: "essa combinacao e central para estudar dominancia" },
      { lead: "o homozigoto", answer: "o individuo que possui alelos iguais para determinado gene", why: "ele pode ser dominante ou recessivo" }
    ]
  },
  {
    subtopico: "Grupos sanguineos e fator Rh",
    habilidade:
      "interpretar heredogramas, padroes de dominancia e grupos sanguineos",
    tags: ["grupos sanguineos", "abo", "rh"],
    fatos: [
      { lead: "o sistema ABO", answer: "a classificacao sanguinea baseada nos antigenos A e B presentes nas hemacias", why: "ele depende da combinacao de alelos IA, IB e i" },
      { lead: "o tipo sanguineo O", answer: "o grupo em que não ha antigenos A nem B nas hemacias", why: "ele resulta do genotipo ii no sistema ABO" },
      { lead: "o fator Rh positivo", answer: "a presenca do antigeno Rh na superficie das hemacias", why: "essa caracteristica influencia compatibilidade sanguinea" },
      { lead: "a incompatibilidade Rh", answer: "o problema imunologico que pode ocorrer quando ha diferenca entre mae Rh negativa e feto Rh positivo", why: "a sensibilizacao materna pode afetar gestacoes posteriores" },
      { lead: "a codominancia no sistema ABO", answer: "a expressao simultanea dos alelos IA e IB no grupo AB", why: "esse sistema e exemplo classico de codominancia" }
    ]
  },
  {
    subtopico: "Genetica humana e doencas hereditarias",
    habilidade:
      "aplicar conhecimentos de genetica a situações do corpo humano e da saude",
    tags: ["genetica humana", "doencas hereditarias", "saude"],
    fatos: [
      { lead: "uma doenca hereditaria", answer: "a condicao associada a alteracoes geneticas transmissiveis entre geracoes", why: "ela pode decorrer de genes ou cromossomos alterados" },
      { lead: "a anemia falciforme", answer: "a doenca genetica ligada a alteracao na hemoglobina", why: "ela é exemplo de mutacao que afeta a proteina sanguinea" },
      { lead: "a sindrome de Down", answer: "a alteracao cromossomica humana associada a trissomia do cromossomo 21", why: "ela é um exemplo de aneuploidia" },
      { lead: "o aconselhamento genetico", answer: "a orientacao especializada sobre riscos e heranca de condicoes geneticas", why: "ele auxilia familias em decisões e compreensao do quadro" },
      { lead: "a relação entre genetica e saude", answer: "a aplicacao do conhecimento hereditario na prevencao, diagnostico e acompanhamento de condicoes biologicas", why: "a genetica humana possui forte impacto medico e social" }
    ]
  }
];

export const genetica = {
  id: "biologia_genetica",
  materia: "Biologia",
  serie: [2],
  topico: "Genetica",
  metadados: {
    disciplinaId: "biologia",
    base: "ESCOLAR",
    eixo: "Biologia",
    frente: "Hereditariedade e informacao genetica",
    searchAliases: [
      "genetica",
      "genes",
      "cromossomos",
      "dna e rna",
      "hereditariedade",
      "mutacoes"
    ],
    subtopicosBase: [
      "Conceitos fundamentais de genetica",
      "DNA, RNA e sintese proteica",
      "Genes, cromossomos e cariotipo",
      "Replicacao do DNA e divisao celular",
      "Codigo genetico e expressao genica",
      "Mutacoes geneticas e cromossomicas",
      "Heredogramas e análise de hereditariedade",
      "Dominancia, recessividade e codominancia",
      "Grupos sanguineos e fator Rh",
      "Genetica humana e doencas hereditarias"
    ],
    habilidadesBase: [
      "identificar conceitos basicos de genes, cromossomos e hereditariedade",
      "explicar a relação entre DNA, RNA, codigo genetico e sintese proteica",
      "analisar mutacoes, cariotipos e alteracoes geneticas humanas",
      "interpretar heredogramas, padroes de dominancia e grupos sanguineos",
      "aplicar conhecimentos de genetica a situações do corpo humano e da saude"
    ],
    planejamentoQuestoes: BIOLOGY_TWO_HUNDRED_PLAN,
    seloEditorial: "VERIFICADA",
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "gen",
    serie: 2,
    materia: "Biologia",
    topico: "Genetica",
    blocos,
    stemBuilders: BIOLOGY_STEM_BUILDERS,
    globalMatrix: BIOLOGY_TWO_HUNDRED_MATRIX
  })
};
