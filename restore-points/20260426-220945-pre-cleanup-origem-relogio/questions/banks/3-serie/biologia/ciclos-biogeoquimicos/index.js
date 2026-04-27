import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  BIOLOGY_STEM_BUILDERS,
  BIOLOGY_TWO_HUNDRED_MATRIX,
  BIOLOGY_TWO_HUNDRED_PLAN
} from "../../../_shared/biologyTopicPresets.js";

const blocos = [
  {
    subtopico: "Conceito de ciclos biogeoquimicos",
    habilidade:
      "identificar os principais ciclos biogeoquimicos e sua importancia ecologica",
    tags: ["ciclos biogeoquimicos", "materia", "ambiente"],
    fatos: [
      { lead: "os ciclos biogeoquimicos", answer: "os processos de circulacao de elementos quimicos entre seres vivos e ambiente", why: "eles garantem reutilizacao da materia nos ecossistemas" },
      { lead: "a ciclagem da materia", answer: "o retorno constante de elementos ao ambiente e aos organismos", why: "sem esse processo a vida se tornaria inviavel" },
      { lead: "a dimensao biogeoquimica", answer: "a integracao entre componentes biologicos, geologicos e quimicos na circulacao da materia", why: "os ciclos envolvem atmosfera, solo, agua e seres vivos" },
      { lead: "a importancia ecologica dos ciclos", answer: "a manutencao da disponibilidade de elementos essenciais a vida", why: "eles sustentam a produtividade e o equilibrio dos ecossistemas" },
      { lead: "a diferenca entre fluxo de energia e ciclo de materia", answer: "o fato de a energia seguir principalmente em sentido unidirecional e a materia ser reutilizada", why: "essa distincao e central na ecologia" }
    ]
  },
  {
    subtopico: "Ciclo da agua",
    habilidade:
      "compreender etapas e importancia dos ciclos da agua e do carbono",
    tags: ["agua", "hidrologico", "evaporacao"],
    fatos: [
      { lead: "o ciclo da agua", answer: "a circulacao da agua entre atmosfera, superficie, subsolo e seres vivos", why: "ele envolve mudancas de estado e deslocamentos no planeta" },
      { lead: "a evaporacao", answer: "a passagem da agua liquida para o estado gasoso", why: "essa etapa contribui para a formacao de vapor na atmosfera" },
      { lead: "a condensacao", answer: "a transformacao do vapor de agua em goticulas liquidas", why: "ela participa da formacao de nuvens" },
      { lead: "a precipitacao", answer: "o retorno da agua da atmosfera para a superficie em forma de chuva, neve ou granizo", why: "ela reabastece rios, lagos e solos" },
      { lead: "a infiltracao", answer: "a penetracao da agua no solo e em camadas subterraneas", why: "esse processo alimenta lencois freaticos e aquiferos" }
    ]
  },
  {
    subtopico: "Ciclo do carbono",
    habilidade:
      "compreender etapas e importancia dos ciclos da agua e do carbono",
    tags: ["carbono", "fotossintese", "respiracao"],
    fatos: [
      { lead: "o ciclo do carbono", answer: "a circulacao do carbono entre atmosfera, seres vivos, oceanos e rochas", why: "ele esta ligado a materia organica e ao clima" },
      { lead: "a fotossintese no ciclo do carbono", answer: "a retirada de gas carbonico da atmosfera para producao de materia organica", why: "esse processo incorpora carbono aos produtores" },
      { lead: "a respiracao celular no ciclo do carbono", answer: "a devolucao de gas carbonico ao ambiente pela oxidacao de moleculas organicas", why: "ela ocorre em varios organismos" },
      { lead: "a combustao no ciclo do carbono", answer: "a liberacao de dioxido de carbono pela queima de materia organica ou combustiveis", why: "essa etapa intensifica a presenca de carbono na atmosfera" },
      { lead: "os reservatorios de carbono", answer: "os compartimentos onde o elemento pode permanecer armazenado, como oceanos, biomassa e combustiveis fosseis", why: "eles participam do equilibrio do ciclo" }
    ]
  },
  {
    subtopico: "Ciclo do nitrogenio",
    habilidade:
      "explicar etapas, organismos e importancia do ciclo do nitrogenio",
    tags: ["nitrogenio", "fixacao", "desnitrificacao"],
    fatos: [
      { lead: "o ciclo do nitrogenio", answer: "a circulacao do nitrogenio entre atmosfera, solo e seres vivos", why: "ele depende de transformacoes quimicas e atividade microbiana" },
      { lead: "a fixacao do nitrogenio", answer: "a transformacao do N2 atmosferico em formas assimilaveis pelos seres vivos", why: "ela pode ocorrer biologicamente ou por processos fisicos" },
      { lead: "a nitrificacao", answer: "a conversao bacteriana de compostos nitrogenados em nitritos e nitratos", why: "essa etapa aumenta a disponibilidade para as plantas" },
      { lead: "a desnitrificacao", answer: "a devolucao do nitrogenio ao ar por transformacao bacteriana de nitratos em N2", why: "ela fecha o ciclo atmosferico do elemento" },
      { lead: "a amonificacao", answer: "a formacao de compostos amoniacais a partir da decomposicao de materia organica nitrogenada", why: "ela reintroduz nitrogenio no solo" }
    ]
  },
  {
    subtopico: "Ciclo do fosforo",
    habilidade:
      "relacionar caracteristicas e importancia do ciclo do fosforo e de outros nutrientes",
    tags: ["fosforo", "solo", "nutrientes"],
    fatos: [
      { lead: "o ciclo do fosforo", answer: "a circulacao do fosforo principalmente entre rochas, solo, agua e seres vivos", why: "ele nao possui fase atmosferica expressiva como outros ciclos" },
      { lead: "o intemperismo das rochas", answer: "a liberacao de fosfatos minerais para o solo e para a agua", why: "essa etapa inicia a disponibilidade de fosforo no ambiente" },
      { lead: "a absorcao de fosfato pelas plantas", answer: "a incorporacao do nutriente dissolvido as cadeias biologicas", why: "o fosforo entra nos organismos a partir dos produtores" },
      { lead: "o papel biologico do fosforo", answer: "a participacao em moleculas como ATP, DNA e membranas celulares", why: "isso torna o elemento essencial a vida" },
      { lead: "a sedimentacao no ciclo do fosforo", answer: "o retorno de fosfatos a depositos geologicos ao longo do tempo", why: "esse processo pode retirar temporariamente o nutriente da ciclagem rapida" }
    ]
  },
  {
    subtopico: "Ciclo do oxigenio",
    habilidade:
      "relacionar caracteristicas e importancia do ciclo do fosforo e de outros nutrientes",
    tags: ["oxigenio", "respiracao", "fotossintese"],
    fatos: [
      { lead: "o ciclo do oxigenio", answer: "a circulacao do oxigenio entre atmosfera, hidrosfera, seres vivos e compostos quimicos", why: "ele esta ligado a fotossintese e respiracao" },
      { lead: "a producao de oxigenio pela fotossintese", answer: "a liberacao de O2 durante a sintese de materia organica por organismos autotrofos", why: "essa etapa reabastece a atmosfera" },
      { lead: "o consumo de oxigenio na respiracao", answer: "o uso de O2 na obtencao de energia a partir de moleculas organicas", why: "essa etapa integra o metabolismo aerobio" },
      { lead: "a participacao do oxigenio em combustoes", answer: "o envolvimento do elemento em reacoes de oxidacao com liberacao de energia", why: "essa e outra via de consumo de O2" },
      { lead: "a relacao entre oxigenio e equilibrio atmosferico", answer: "a manutencao de concentracoes adequadas pela integracao entre processos biologicos e quimicos", why: "isso influencia a vida no planeta" }
    ]
  },
  {
    subtopico: "Decomposicao e reciclacao da materia",
    habilidade:
      "analisar o papel dos decompositores na ciclagem da materia",
    tags: ["decompositores", "reciclagem", "materia organica"],
    fatos: [
      { lead: "os decompositores", answer: "os organismos que degradam materia organica morta liberando substancias reutilizaveis", why: "fungos e bacterias sao essenciais nesse processo" },
      { lead: "a decomposicao", answer: "a quebra da materia organica complexa em substancias mais simples", why: "ela devolve nutrientes ao ambiente" },
      { lead: "a reciclagem de nutrientes", answer: "o retorno de elementos quimicos ao solo, agua e atmosfera por acao biologica", why: "sem isso os ecossistemas perderiam fertilidade" },
      { lead: "a materia organica morta", answer: "a fonte de nutrientes para muitos decompositores no ecossistema", why: "sua transformacao alimenta a ciclagem da materia" },
      { lead: "a importancia ecologica da decomposicao", answer: "a manutencao do fluxo de nutrientes entre os niveis do ecossistema", why: "ela fecha varios ciclos biogeoquimicos" }
    ]
  },
  {
    subtopico: "Interferencia humana nos ciclos",
    habilidade:
      "avaliar alteracoes humanas nos ciclos biogeoquimicos e seus impactos",
    tags: ["impacto humano", "fertilizantes", "combustiveis"],
    fatos: [
      { lead: "a queima de combustiveis fosseis", answer: "a atividade humana que intensifica a liberacao de carbono para a atmosfera", why: "ela altera o equilibrio do ciclo do carbono" },
      { lead: "o uso excessivo de fertilizantes", answer: "a pratica que modifica a disponibilidade de nitrogenio e fosforo nos ambientes", why: "isso pode gerar desequilibrios como eutrofizacao" },
      { lead: "o desmatamento", answer: "a acao que reduz a fixacao de carbono pela vegetacao e altera o ciclo da agua", why: "ele afeta varios ciclos simultaneamente" },
      { lead: "a poluicao atmosferica", answer: "a alteracao da composicao do ar por substancias emitidas por atividades humanas", why: "ela interfere em ciclos como os do carbono e do nitrogenio" },
      { lead: "a intensificacao antropica dos ciclos", answer: "a mudanca provocada por acoes humanas em taxas e fluxos naturais de elementos", why: "essa interferencia pode gerar impactos ambientais amplos" }
    ]
  },
  {
    subtopico: "Ciclos biogeoquimicos e equilibrio ecologico",
    habilidade:
      "avaliar alteracoes humanas nos ciclos biogeoquimicos e seus impactos",
    tags: ["equilibrio ecologico", "ciclos", "ecossistemas"],
    fatos: [
      { lead: "o equilibrio ecologico nos ciclos", answer: "a manutencao relativa da disponibilidade e circulacao dos elementos essenciais nos ecossistemas", why: "grandes alteracoes comprometem a estabilidade ambiental" },
      { lead: "a produtividade primaria e os ciclos", answer: "a dependencia da producao biologica em relacao a disponibilidade de agua, carbono e nutrientes", why: "ciclos regulam a base energetica dos ecossistemas" },
      { lead: "a ligacao entre ciclos e cadeias alimentares", answer: "o fato de a materia circular entre organismos em diferentes niveis troficos", why: "os ciclos sustentam a transferencia de elementos entre produtores e consumidores" },
      { lead: "a disponibilidade de nutrientes", answer: "a condicao ambiental que influencia crescimento, reproducao e produtividade dos organismos", why: "ela depende diretamente da ciclagem biogeoquimica" },
      { lead: "a importancia dos ciclos para a vida", answer: "a reposicao continua de elementos fundamentais como agua, carbono, nitrogenio e fosforo", why: "sem essa reposicao a vida nao se manteria" }
    ]
  },
  {
    subtopico: "Interpretacao de situacoes ambientais",
    habilidade:
      "avaliar alteracoes humanas nos ciclos biogeoquimicos e seus impactos",
    tags: ["interpretacao", "problemas ambientais", "ciclos"],
    fatos: [
      { lead: "a leitura de um problema sobre ciclos biogeoquimicos", answer: "a identificacao do elemento envolvido, das etapas do ciclo e da alteracao ambiental descrita", why: "essa estrategia organiza a interpretacao da questao" },
      { lead: "a relacao entre eutrofizacao e nutrientes", answer: "o excesso de compostos de nitrogenio e fosforo em ambientes aquaticos", why: "essa entrada altera o equilibrio do ecossistema" },
      { lead: "a interpretacao de graficos dos ciclos", answer: "a analise de fluxos, reservatorios e mudancas ao longo do tempo", why: "graficos sao comuns em avaliacoes de ecologia" },
      { lead: "a identificacao de um impacto no ciclo da agua", answer: "a observacao de mudancas em infiltracao, evaporacao, escoamento ou precipitacao", why: "acoes humanas podem alterar essas etapas" },
      { lead: "a utilidade do estudo dos ciclos", answer: "a compreensao integrada entre materia, ecossistemas e impactos ambientais", why: "ele e essencial para interpretar problemas ecologicos atuais" }
    ]
  }
];

export const ciclosBiogeoquimicos = {
  id: "biologia_ciclos_biogeoquimicos",
  materia: "Biologia",
  serie: [3],
  topico: "Ciclos Biogeoquimicos",
  metadados: {
    disciplinaId: "biologia",
    base: "ESCOLAR",
    eixo: "Biologia",
    frente: "Ciclagem da materia e equilibrio ambiental",
    searchAliases: [
      "ciclos biogeoquimicos",
      "ciclo da agua",
      "ciclo do carbono",
      "ciclo do nitrogenio",
      "ciclo do fosforo",
      "decomposicao"
    ],
    subtopicosBase: [
      "Conceito de ciclos biogeoquimicos",
      "Ciclo da agua",
      "Ciclo do carbono",
      "Ciclo do nitrogenio",
      "Ciclo do fosforo",
      "Ciclo do oxigenio",
      "Decomposicao e reciclacao da materia",
      "Interferencia humana nos ciclos",
      "Ciclos biogeoquimicos e equilibrio ecologico",
      "Interpretacao de situacoes ambientais"
    ],
    habilidadesBase: [
      "identificar os principais ciclos biogeoquimicos e sua importancia ecologica",
      "compreender etapas e importancia dos ciclos da agua e do carbono",
      "explicar etapas, organismos e importancia do ciclo do nitrogenio",
      "relacionar caracteristicas e importancia do ciclo do fosforo e de outros nutrientes",
      "avaliar alteracoes humanas nos ciclos biogeoquimicos e seus impactos"
    ],
    planejamentoQuestoes: BIOLOGY_TWO_HUNDRED_PLAN,
    seloEditorial: "VERIFICADA",
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "cbg",
    serie: 3,
    materia: "Biologia",
    topico: "Ciclos Biogeoquimicos",
    blocos,
    stemBuilders: BIOLOGY_STEM_BUILDERS,
    globalMatrix: BIOLOGY_TWO_HUNDRED_MATRIX
  })
};
