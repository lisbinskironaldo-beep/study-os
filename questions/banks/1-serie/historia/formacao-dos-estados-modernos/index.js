import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";

const blocos = [
  {
    subtopico: "Crise do feudalismo e centralizacao politica",
    habilidade: "identificar-fatores-da-crise-do-feudalismo-e-da-centralizacao-politica",
    tags: ["estados-modernos", "centralizacao"],
    fatos: [
      {
        lead: "o enfraquecimento do poder local dos senhores feudais",
        answer: "a centralizacao politica",
        why: "ela transferiu autoridade para o rei"
      },
      {
        lead: "a alianca entre reis e grupos burgueses urbanos",
        answer: "uma base da formacao das monarquias nacionais",
        why: "os interesses em ordem e comercio favoreceram o poder real"
      },
      {
        lead: "a busca de estabilidade apos guerras e conflitos internos",
        answer: "um impulso para o fortalecimento real",
        why: "governos centrais prometiam paz e uniformidade"
      },
      {
        lead: "a cobranca regular de impostos em todo o reino",
        answer: "um instrumento de centralizacao",
        why: "ela ampliava a capacidade financeira da Coroa"
      },
      {
        lead: "a substituicao dos exercitos feudais por tropas vinculadas ao rei",
        answer: "a formacao de exercitos permanentes",
        why: "isso reduziu a dependencia militar em relacao aos nobres"
      }
    ]
  },
  {
    subtopico: "Monarquias nacionais europeias",
    habilidade: "reconhecer-caracteristicas-das-monarquias-nacionais-europeias",
    tags: ["estados-modernos", "monarquias-nacionais"],
    fatos: [
      {
        lead: "a uniao entre territorio, rei e leis comuns",
        answer: "a monarquia nacional",
        why: "esse modelo politizou a ideia de reino integrado"
      },
      {
        lead: "o reino iberico que se destacou pela centralizacao precoce",
        answer: "Portugal",
        why: "sua consolidacao politica favoreceu a expansao ultramarina"
      },
      {
        lead: "o fortalecimento do poder real depois da Guerra dos Cem Anos",
        answer: "a monarquia francesa",
        why: "o conflito contribuiu para consolidar a autoridade do rei"
      },
      {
        lead: "o conflito dinastico ingles que antecedeu a consolidacao Tudor",
        answer: "a Guerra das Rosas",
        why: "ela abriu caminho para novo equilibrio monarquico"
      },
      {
        lead: "o sentimento coletivo ligado ao reino e ao soberano",
        answer: "a identidade nacional em formacao",
        why: "ela se fortaleceu junto com a unificacao politica"
      }
    ]
  },
  {
    subtopico: "Formacao do Estado moderno",
    habilidade: "explicar-elementos-da-formacao-do-estado-moderno",
    tags: ["estados-modernos", "estado-moderno"],
    fatos: [
      {
        lead: "a concentracao de poder em uma autoridade soberana",
        answer: "o Estado moderno",
        why: "ele se diferenciou da fragmentacao feudal"
      },
      {
        lead: "o uso de funcionarios especializados a servico da Coroa",
        answer: "um aparelho administrativo mais estavel",
        why: "a burocracia dava continuidade ao governo"
      },
      {
        lead: "a criacao de regras mais uniformes para todo o reino",
        answer: "a padronizacao juridica",
        why: "ela reforcava a autoridade central"
      },
      {
        lead: "a definicao mais clara de dominios territoriais sob um soberano",
        answer: "uma marca da soberania territorial",
        why: "fronteiras e autoridade passaram a ser mais delimitadas"
      },
      {
        lead: "a negociacao entre reinos por enviados e acordos formais",
        answer: "um elemento das relacoes interestatais modernas",
        why: "a diplomacia tornou-se instrumento regular de politica externa"
      }
    ]
  },
  {
    subtopico: "Absolutismo e teorias do poder",
    habilidade: "analisar-o-absolutismo-e-suas-teorias-de-legitimacao",
    tags: ["estados-modernos", "absolutismo"],
    fatos: [
      {
        lead: "a doutrina segundo a qual o rei governava por vontade divina",
        answer: "o direito divino dos reis",
        why: "ela justificava religiosamente a autoridade monarquica"
      },
      {
        lead: "a defesa de um poder soberano forte para conter a desordem",
        answer: "a teoria politica de Hobbes",
        why: "o autor valorizava um governo capaz de garantir seguranca"
      },
      {
        lead: "a formula associada a concentracao extrema de autoridade na Franca",
        answer: "o Estado sou eu",
        why: "a frase sintetiza o imaginario do absolutismo"
      },
      {
        lead: "a concentracao de poderes legislativo, militar e judicial na monarquia",
        answer: "o absolutismo",
        why: "o rei buscava dominar os principais instrumentos do Estado"
      },
      {
        lead: "a necessidade de apoio de elites, burocracias e financas para governar",
        answer: "um limite pratico ao absolutismo",
        why: "o poder real dependia de negociacoes e recursos"
      }
    ]
  },
  {
    subtopico: "Mercantilismo e fortalecimento monarquico",
    habilidade: "relacionar-mercantilismo-e-fortalecimento-monarquico",
    tags: ["estados-modernos", "mercantilismo"],
    fatos: [
      {
        lead: "a valorizacao da acumulacao de ouro e prata pelo Estado",
        answer: "o metalismo",
        why: "riqueza metalica era vista como fonte de poder"
      },
      {
        lead: "a busca por vender mais do que comprar nas relacoes externas",
        answer: "um objetivo mercantilista",
        why: "a balanca comercial favoravel deveria ampliar a riqueza do reino"
      },
      {
        lead: "a participacao ativa da Coroa na organizacao da economia",
        answer: "o dirigismo economico",
        why: "o Estado regulamentava comercio e producao"
      },
      {
        lead: "a cobranca de tarifas para defender produtores do proprio reino",
        answer: "o protecionismo",
        why: "essa pratica limitava a concorrencia externa"
      },
      {
        lead: "o papel das colonias na logica mercantilista",
        answer: "fontes de materias-primas e mercados cativos",
        why: "elas reforcavam os interesses economicos da metropole"
      }
    ]
  },
  {
    subtopico: "Burocracia, exercito e fiscalidade",
    habilidade: "explicar-como-burocracia-exercito-e-fiscalidade-fortaleceram-o-estado",
    tags: ["estados-modernos", "burocracia"],
    fatos: [
      {
        lead: "o conjunto de funcionarios que executava ordens do rei",
        answer: "a burocracia estatal",
        why: "ela tornava mais continua a administracao do reino"
      },
      {
        lead: "as tropas mantidas e pagas diretamente pela Coroa",
        answer: "o exercito permanente",
        why: "elas reforcavam a autoridade central"
      },
      {
        lead: "a cobranca sistematica de tributos em todo o territorio",
        answer: "a fiscalidade monarquica",
        why: "financiava guerra, corte e administracao"
      },
      {
        lead: "a imposicao de justica acima dos senhores locais",
        answer: "a ampliacao da autoridade real",
        why: "o rei passava a se afirmar como instancia superior"
      },
      {
        lead: "o uso de registros, documentos e controles administrativos",
        answer: "instrumentos de governabilidade",
        why: "eles permitiam conhecer e gerir melhor o reino"
      }
    ]
  },
  {
    subtopico: "Franca e o absolutismo classico",
    habilidade: "identificar-caracteristicas-do-absolutismo-frances",
    tags: ["estados-modernos", "franca"],
    fatos: [
      {
        lead: "o rei que se tornou simbolo do absolutismo frances",
        answer: "Luis XIV",
        why: "sua imagem ficou associada ao auge do poder monarquico"
      },
      {
        lead: "o palacio usado para concentrar nobreza e prestigio cortesao",
        answer: "Versalhes",
        why: "ele ajudou a submeter nobres ao controle do rei"
      },
      {
        lead: "o ministro ligado a politica economica mercantilista da Franca",
        answer: "Colbert",
        why: "sua atuacao reforcou intervencao estatal na economia"
      },
      {
        lead: "a estrategia de manter nobres proximos a corte real",
        answer: "uma domesticacao politica da nobreza",
        why: "o rei reduzia autonomias aristocraticas"
      },
      {
        lead: "a revogacao do Edito de Nantes no reinado de Luis XIV",
        answer: "um exemplo de centralizacao religiosa do reino",
        why: "a monarquia procurou uniformizar a fe catolica"
      }
    ]
  },
  {
    subtopico: "Inglaterra e limites ao absolutismo",
    habilidade: "comparar-o-caso-ingles-aos-modelos-absolutistas-continentais",
    tags: ["estados-modernos", "inglaterra"],
    fatos: [
      {
        lead: "o documento medieval que impunha limites ao poder do rei ingles",
        answer: "a Magna Carta",
        why: "ela e um marco na limitacao juridica da monarquia"
      },
      {
        lead: "o conflito do seculo XVII entre rei e Parlamento",
        answer: "a Revolucao Inglesa",
        why: "ele expressou disputa sobre soberania e impostos"
      },
      {
        lead: "o processo politico de 1688 que depos Jaime II",
        answer: "a Revolucao Gloriosa",
        why: "ela consolidou a superioridade parlamentar"
      },
      {
        lead: "o documento que reafirmou garantias parlamentares apos 1688",
        answer: "o Bill of Rights",
        why: "ele limitou formalmente a autoridade real"
      },
      {
        lead: "o arranjo politico ingles consolidado apos a Revolucao Gloriosa",
        answer: "a monarquia parlamentar",
        why: "o rei passou a governar sob controle legal e politico"
      }
    ]
  },
  {
    subtopico: "Portugal, Espanha e a expansao estatal",
    habilidade: "relacionar-centralizacao-iberica-e-expansao-ultramarina",
    tags: ["estados-modernos", "iberia"],
    fatos: [
      {
        lead: "a organizacao politica precoce do reino portugues",
        answer: "a centralizacao precoce de Portugal",
        why: "ela favoreceu o lancamento das navegacoes oceanicas"
      },
      {
        lead: "a uniao dinastica que fortaleceu a monarquia espanhola",
        answer: "o casamento de Isabel e Fernando",
        why: "essa alianca ajudou a consolidar o poder dos Reis Catolicos"
      },
      {
        lead: "a exploracao ultramarina promovida pelas monarquias ibericas",
        answer: "um fator de fortalecimento monarquico",
        why: "riqueza e prestigio ampliaram o poder estatal"
      },
      {
        lead: "o uso de perseguicoes religiosas para reforcar a unidade do reino espanhol",
        answer: "a Inquisicao espanhola",
        why: "ela tambem serviu a objetivos politicos de controle"
      },
      {
        lead: "a administracao dos dominios coloniais por agentes da Coroa",
        answer: "uma extensao do poder metropolitano",
        why: "o Estado projetava sua autoridade para alem da Europa"
      }
    ]
  },
  {
    subtopico: "Estado moderno e transformacoes da Europa",
    habilidade: "avaliar-impactos-da-formacao-do-estado-moderno-na-europa",
    tags: ["estados-modernos", "europa-moderna"],
    fatos: [
      {
        lead: "a passagem da fragmentacao feudal para monarquias centralizadas",
        answer: "uma transformacao politica decisiva da Europa",
        why: "ela redefiniu soberania, impostos e exercitos"
      },
      {
        lead: "a ideia de autoridade suprema sobre um territorio definido",
        answer: "um principio da politica moderna",
        why: "a soberania tornou-se eixo de organizacao estatal"
      },
      {
        lead: "a relacao entre centralizacao politica e expansao maritima",
        answer: "processos interligados de poder e riqueza",
        why: "os Estados financiaram navegacoes e se fortaleceram com elas"
      },
      {
        lead: "a uniformizacao de leis, moeda e administracao pelo poder real",
        answer: "fatores de integracao territorial",
        why: "essas medidas aproximaram regioes antes dispersas"
      },
      {
        lead: "a permanencia de estruturas estatais surgidas na Modernidade",
        answer: "a base de muitos Estados contemporaneos",
        why: "burocracia, fiscalidade e soberania continuam centrais"
      }
    ]
  }
];

const questoes = buildPlannedQuestions({
  prefix: "fem",
  serie: [1],
  materia: "Historia",
  topico: "Formacao dos Estados Modernos",
  blocos
});

export const formacaoDosEstadosModernos = {
  id: "historia_formacao_dos_estados_modernos",
  materia: "Historia",
  serie: [1],
  topico: "Formacao dos Estados Modernos",
  metadados: {
    disciplinaId: "historia",
    base: "ESCOLAR",
    eixo: "Historia",
    frente: "Europa moderna e centralizacao do poder",
    searchAliases: [
      "estado moderno",
      "estados modernos",
      "monarquias nacionais",
      "absolutismo",
      "mercantilismo",
      "centralizacao politica"
    ],
    subtopicosBase: [
      "Crise do feudalismo e centralizacao politica",
      "Monarquias nacionais europeias",
      "Formacao do Estado moderno",
      "Absolutismo e teorias do poder",
      "Mercantilismo e fortalecimento monarquico",
      "Burocracia, exercito e fiscalidade",
      "Franca e o absolutismo classico",
      "Inglaterra e limites ao absolutismo",
      "Portugal, Espanha e a expansao estatal",
      "Estado moderno e transformacoes da Europa"
    ],
    habilidadesBase: [
      "identificar fatores de crise do feudalismo e centralizacao politica",
      "reconhecer caracteristicas das monarquias nacionais e do Estado moderno",
      "analisar o absolutismo e o mercantilismo como bases do poder monarquico",
      "comparar experiencias de Franca, Inglaterra, Portugal e Espanha",
      "avaliar impactos da formacao do Estado moderno na Europa"
    ],
    planejamentoQuestoes: {
      totalAlvo: 200,
      revisaoPorLote: 20,
      formato: "multipla_escolha",
      alternativasPorQuestao: 4,
      comentarioBreve: true,
      distribuicaoDificuldade: {
        facil: 30,
        medio: 90,
        dificil: 80
      },
      distribuicaoNiveis: {
        1: 20,
        2: 10,
        3: 10,
        4: 20,
        5: 20,
        6: 40,
        7: 20,
        8: 20,
        9: 20,
        10: 20
      }
    }
  },
  questoes
};
