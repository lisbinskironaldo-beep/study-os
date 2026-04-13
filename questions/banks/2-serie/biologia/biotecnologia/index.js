import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  BIOLOGY_STEM_BUILDERS,
  BIOLOGY_TWO_HUNDRED_MATRIX,
  BIOLOGY_TWO_HUNDRED_PLAN
} from "../../../_shared/biologyTopicPresets.js";

const blocos = [
  {
    subtopico: "Conceitos basicos de biotecnologia",
    habilidade:
      "identificar conceitos fundamentais e areas de aplicacao da biotecnologia",
    tags: ["biotecnologia", "conceitos", "aplicacoes"],
    fatos: [
      { lead: "a biotecnologia", answer: "o uso de organismos, celulas ou moleculas biologicas para produzir bens, processos e conhecimentos", why: "ela aplica conhecimentos da biologia em diferentes setores" },
      { lead: "a biotecnologia moderna", answer: "a area que integra genetica, microbiologia e tecnicas moleculares para modificar ou analisar sistemas vivos", why: "ela ampliou muito as aplicacoes do campo" },
      { lead: "a aplicacao biotecnologica", answer: "o uso pratico de processos biologicos em saude, agricultura, industria e ambiente", why: "essa diversidade de uso caracteriza a area" },
      { lead: "o organismo modelo em biotecnologia", answer: "o ser vivo utilizado para estudar mecanismos biologicos ou produzir substancias de interesse", why: "bacterias e leveduras sao exemplos frequentes" },
      { lead: "a relevancia da biotecnologia", answer: "a possibilidade de unir conhecimento biologico e solucao de problemas humanos", why: "ela influencia medicina, producao e sustentabilidade" }
    ]
  },
  {
    subtopico: "DNA recombinante",
    habilidade:
      "compreender tecnicas de manipulacao genetica e DNA recombinante",
    tags: ["dna recombinante", "engenharia genetica", "genes"],
    fatos: [
      { lead: "o DNA recombinante", answer: "a molecula formada pela combinacao de fragmentos de DNA de origens diferentes", why: "essa uniao e base de varias tecnicas de engenharia genetica" },
      { lead: "a engenharia genetica", answer: "o conjunto de tecnicas de manipulacao do material genetico", why: "ela permite inserir, remover ou modificar genes" },
      { lead: "a recombinacao artificial de DNA", answer: "a montagem laboratorial de sequencias geneticas em uma mesma molecula", why: "isso produz novos arranjos de informacao biologica" },
      { lead: "o gene de interesse", answer: "o segmento de DNA selecionado para ser estudado ou transferido em uma tecnica biotecnologica", why: "ele carrega a informacao biologica desejada" },
      { lead: "a importancia do DNA recombinante", answer: "a abertura de caminho para producao de substancias e estudo dirigido de genes", why: "essa tecnica revolucionou a biologia molecular" }
    ]
  },
  {
    subtopico: "Enzimas de restricao e plasmideos",
    habilidade:
      "compreender tecnicas de manipulacao genetica e DNA recombinante",
    tags: ["enzimas de restricao", "plasmideos", "vetores"],
    fatos: [
      { lead: "a enzima de restricao", answer: "a proteina que reconhece sequencias especificas de DNA e realiza cortes nelas", why: "ela funciona como ferramenta de recorte molecular" },
      { lead: "o plasmideo", answer: "a pequena molecula circular de DNA presente em muitas bacterias", why: "ele pode atuar como vetor em engenharia genetica" },
      { lead: "o vetor genetico", answer: "a estrutura usada para transportar um gene de interesse para outra celula", why: "plasmideos sao vetores bastante utilizados" },
      { lead: "a ligase", answer: "a enzima que une fragmentos de DNA formando nova molecula continua", why: "ela complementa a acao das enzimas de restricao" },
      { lead: "o uso de plasmideos em laboratorio", answer: "a insercao de genes para replicacao ou expressao em celulas bacterianas", why: "esse procedimento e classico em biotecnologia" }
    ]
  },
  {
    subtopico: "Transgenicos e OGM",
    habilidade:
      "analisar organismos geneticamente modificados e suas implicacoes",
    tags: ["transgenicos", "ogm", "agricultura"],
    fatos: [
      { lead: "um organismo geneticamente modificado", answer: "o ser vivo cujo material genetico foi alterado por tecnicas de biotecnologia", why: "essa alteracao pode envolver insercao, remocao ou modificacao de genes" },
      { lead: "um transgenico", answer: "o organismo que recebeu gene proveniente de outra especie", why: "ele e um caso particular de OGM" },
      { lead: "a planta transgenica resistente a pragas", answer: "o vegetal modificado para produzir protecao contra certos organismos", why: "essa e uma aplicacao agricola comum da biotecnologia" },
      { lead: "a sigla OGM", answer: "a abreviacao para organismo geneticamente modificado", why: "ela designa seres vivos alterados por tecnologia genetica" },
      { lead: "a diferenca entre transgenico e melhoramento tradicional", answer: "o uso de manipulacao direta do DNA em vez de apenas cruzamentos seletivos", why: "a biotecnologia intervem de modo mais preciso no material genetico" }
    ]
  },
  {
    subtopico: "Clonagem",
    habilidade:
      "identificar tecnicas biotecnologicas aplicadas a saude, pesquisa e reproducao",
    tags: ["clonagem", "clone", "reproducao"],
    fatos: [
      { lead: "a clonagem", answer: "a producao de copias geneticamente muito semelhantes de genes, celulas ou organismos", why: "ela pode ocorrer em diferentes niveis biologicos" },
      { lead: "um clone", answer: "a copia genetica de um organismo, celula ou fragmento de DNA", why: "sua formacao depende de processos de replicacao controlada" },
      { lead: "a clonagem reprodutiva", answer: "a tecnica voltada a gerar um novo organismo com genoma muito semelhante ao do doador", why: "ela foi exemplificada pela ovelha Dolly" },
      { lead: "a clonagem terapeutica", answer: "a abordagem usada para obter celulas e tecidos de interesse medico", why: "ela nao tem como objetivo principal formar um novo individuo completo" },
      { lead: "a ovelha Dolly", answer: "o exemplo historico de mamifero clonado a partir de nucleo de celula somatica", why: "esse caso tornou a clonagem amplamente conhecida" }
    ]
  },
  {
    subtopico: "Celulas-tronco",
    habilidade:
      "identificar tecnicas biotecnologicas aplicadas a saude, pesquisa e reproducao",
    tags: ["celulas-tronco", "diferenciacao", "terapia celular"],
    fatos: [
      { lead: "as celulas-tronco", answer: "as celulas com capacidade de autorrenovacao e diferenciacao em outros tipos celulares", why: "essa plasticidade lhes da grande importancia medica" },
      { lead: "a diferenciacao celular", answer: "o processo pelo qual uma celula assume estrutura e funcao especializadas", why: "celulas-tronco podem originar varios tecidos" },
      { lead: "as celulas-tronco embrionarias", answer: "as celulas com alta capacidade de originar diferentes tipos celulares", why: "sua versatilidade e tema central em pesquisa biologica" },
      { lead: "as celulas-tronco adultas", answer: "as celulas presentes em tecidos do corpo com capacidade de renovacao mais limitada", why: "elas atuam na manutencao e reparo de alguns tecidos" },
      { lead: "a terapia celular", answer: "a aplicacao medica de celulas para recuperar ou substituir tecidos danificados", why: "ela se relaciona fortemente ao estudo de celulas-tronco" }
    ]
  },
  {
    subtopico: "PCR e analise molecular",
    habilidade:
      "interpretar tecnicas de diagnostico e analise genetica em biotecnologia",
    tags: ["pcr", "amplificacao", "diagnostico molecular"],
    fatos: [
      { lead: "a PCR", answer: "a tecnica de amplificacao de segmentos especificos de DNA em laboratorio", why: "ela permite obter muitas copias de uma sequencia alvo" },
      { lead: "a amplificacao de DNA", answer: "o aumento do numero de copias de uma sequencia genetica", why: "esse processo facilita analises e diagnosticos" },
      { lead: "o diagnostico molecular", answer: "a identificacao de agentes biologicos ou alteracoes geneticas por analise de DNA ou RNA", why: "ele depende de tecnicas como a PCR" },
      { lead: "os primers na PCR", answer: "as pequenas sequencias que delimitam a regiao de DNA a ser amplificada", why: "eles orientam a replicacao dirigida" },
      { lead: "a utilidade da PCR", answer: "a possibilidade de detectar, comparar e estudar material genetico em pequena quantidade", why: "isso a torna central em varias aplicacoes biologicas" }
    ]
  },
  {
    subtopico: "Biotecnologia na medicina e agricultura",
    habilidade:
      "analisar organismos geneticamente modificados e suas implicacoes",
    tags: ["medicina", "agricultura", "biotecnologia aplicada"],
    fatos: [
      { lead: "a insulina produzida por engenharia genetica", answer: "o exemplo de medicamento obtido com micro-organismos modificados", why: "essa aplicacao marcou a biotecnologia moderna" },
      { lead: "o melhoramento molecular de plantas", answer: "o uso de tecnicas geneticas para selecionar ou introduzir caracteristicas desejadas", why: "isso pode elevar produtividade e resistencia" },
      { lead: "o diagnostico genetico na medicina", answer: "a analise de material genetico para detectar predisposicoes ou alteracoes biologicas", why: "biotecnologia ampliou precisao e rapidez desses exames" },
      { lead: "a vacinacao com base biotecnologica", answer: "o desenvolvimento de imunizantes com apoio de tecnicas de biologia molecular", why: "essa abordagem ganhou grande relevancia em saude publica" },
      { lead: "a aplicacao agricola da biotecnologia", answer: "o uso de conhecimento genetico para melhorar cultivos e manejo biologico", why: "ela atua em sementes, resistencia e produtividade" }
    ]
  },
  {
    subtopico: "Bioetica e biosseguranca",
    habilidade:
      "avaliar implicacoes eticas, sociais e ambientais da biotecnologia",
    tags: ["bioetica", "biosseguranca", "debates"],
    fatos: [
      { lead: "a bioetica na biotecnologia", answer: "a reflexao sobre limites, riscos e finalidades do uso de tecnicas biologicas", why: "nem toda possibilidade tecnica deve ser aplicada sem debate" },
      { lead: "a biosseguranca", answer: "o conjunto de cuidados para reduzir riscos biologicos em pesquisa e aplicacoes tecnicas", why: "ela protege pessoas e ambiente" },
      { lead: "o debate etico sobre clonagem", answer: "a discussao sobre limites morais e biologicos de intervir na reproducao e no uso de celulas", why: "a tecnica levanta questoes sobre dignidade e finalidade" },
      { lead: "o debate etico sobre transgenicos", answer: "a analise de vantagens, riscos e impactos sociais e ambientais de organismos modificados", why: "o tema envolve ciencia, economia e sociedade" },
      { lead: "a regulamentacao biotecnologica", answer: "a criacao de normas para controlar pesquisas e aplicacoes com organismos e genes", why: "isso busca equilibrar inovacao e seguranca" }
    ]
  },
  {
    subtopico: "Biotecnologia e sociedade",
    habilidade:
      "avaliar implicacoes eticas, sociais e ambientais da biotecnologia",
    tags: ["sociedade", "inovacao", "impactos sociais"],
    fatos: [
      { lead: "o impacto social da biotecnologia", answer: "a transformacao de praticas de saude, producao e pesquisa pela aplicacao do conhecimento biologico", why: "ela altera relacoes sociais e tecnicas" },
      { lead: "a democratizacao do acesso a biotecnologias", answer: "o desafio de tornar beneficios cientificos disponiveis a mais pessoas", why: "nem toda inovacao chega igualmente a populacao" },
      { lead: "a biotecnologia como inovacao", answer: "a capacidade de gerar novas solucoes a partir do estudo dos sistemas vivos", why: "isso a torna estrategica para varios setores" },
      { lead: "a dimensao ambiental da biotecnologia", answer: "o efeito das aplicacoes sobre ecossistemas, residuos e manejo de organismos", why: "os impactos nao se limitam ao laboratorio" },
      { lead: "a relacao entre ciencia e sociedade na biotecnologia", answer: "a necessidade de debate publico sobre usos, riscos e prioridades de pesquisa", why: "conhecimento biotecnologico possui consequencias coletivas" }
    ]
  }
];

export const biotecnologia = {
  id: "biologia_biotecnologia",
  materia: "Biologia",
  serie: [2],
  topico: "Biotecnologia",
  metadados: {
    disciplinaId: "biologia",
    base: "ESCOLAR",
    eixo: "Biologia",
    frente: "Tecnicas moleculares, aplicacoes e bioetica",
    searchAliases: [
      "biotecnologia",
      "dna recombinante",
      "transgenicos",
      "clonagem",
      "celulas-tronco",
      "pcr"
    ],
    subtopicosBase: [
      "Conceitos basicos de biotecnologia",
      "DNA recombinante",
      "Enzimas de restricao e plasmideos",
      "Transgenicos e OGM",
      "Clonagem",
      "Celulas-tronco",
      "PCR e analise molecular",
      "Biotecnologia na medicina e agricultura",
      "Bioetica e biosseguranca",
      "Biotecnologia e sociedade"
    ],
    habilidadesBase: [
      "identificar conceitos fundamentais e areas de aplicacao da biotecnologia",
      "compreender tecnicas de manipulacao genetica e DNA recombinante",
      "identificar tecnicas biotecnologicas aplicadas a saude, pesquisa e reproducao",
      "interpretar tecnicas de diagnostico e analise genetica em biotecnologia",
      "avaliar implicacoes eticas, sociais e ambientais da biotecnologia"
    ],
    planejamentoQuestoes: BIOLOGY_TWO_HUNDRED_PLAN,
    seloEditorial: "VERIFICADA",
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "bio",
    serie: 2,
    materia: "Biologia",
    topico: "Biotecnologia",
    blocos,
    stemBuilders: BIOLOGY_STEM_BUILDERS,
    globalMatrix: BIOLOGY_TWO_HUNDRED_MATRIX
  })
};
