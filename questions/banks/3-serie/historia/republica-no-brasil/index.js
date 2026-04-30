import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";

const blocos = [
  {
    subtopico: "República da Espada",
    habilidade: "identificar-fases-e-caracteristicas-da-republica-brasileira",
    tags: ["republica-no-brasil", "republica-da-espada"],
    fatos: [
      {
        lead: "o período inicial da República brasileira sob forte presenca militar",
        answer: "a República da Espada",
        why: "ela correspondeu aos governos de Deodoro e Floriano"
      },
      {
        lead: "o presidente que proclamou a República e liderou o governo provisorio",
        answer: "Deodoro da Fonseca",
        why: "ele comandou a transição da monarquia para o novo regime"
      },
      {
        lead: "a Carta que instituiu presidencialismo e federalismo republicano",
        answer: "a Constituicao de 1891",
        why: "ela organizou juridicamente a nova ordem republicana"
      },
      {
        lead: "a crise financeira marcada por especulacao e emissao excessiva de moeda",
        answer: "o Encilhamento",
        why: "o episodio abalou os primeiros anos da República"
      },
      {
        lead: "a relevancia dos militares na conducao política do período",
        answer: "uma marca da República da Espada",
        why: "o novo regime nasceu sob protagonismo castrense"
      }
    ]
  },
  {
    subtopico: "República Oligarquica",
    habilidade: "analisar-oligarquias-coronelismo-e-movimentos-sociais-na-primeira-republica",
    tags: ["republica-no-brasil", "republica-oligarquica"],
    fatos: [
      {
        lead: "o período republicano dominado por elites agrarias estaduais",
        answer: "a República Oligarquica",
        why: "o poder concentrou-se em grupos regionais influentes"
      },
      {
        lead: "a alternancia de liderancas ligadas a São Paulo e Minas Gerais",
        answer: "a política do cafe com leite",
        why: "ela sintetiza a predominancia de oligarquias centrais"
      },
      {
        lead: "o sistema eleitoral marcado por fraude e pressao local",
        answer: "uma limitacao da democracia republicana",
        why: "o voto não refletia livremente a vontade popular"
      },
      {
        lead: "a centralidade da exportacao cafeeira para a economia do período",
        answer: "a base material do poder oligarquico",
        why: "a riqueza do cafe fortalecia as elites políticas"
      },
      {
        lead: "o acordo de valorizacao do cafe entre governos estaduais",
        answer: "o Convenio de Taubate",
        why: "ele procurou proteger os interesses dos cafeicultores"
      }
    ]
  },
  {
    subtopico: "Coronelismo e política dos governadores",
    habilidade: "analisar-oligarquias-coronelismo-e-movimentos-sociais-na-primeira-republica",
    tags: ["republica-no-brasil", "coronelismo"],
    fatos: [
      {
        lead: "o poder local exercido por chefes políticos rurais influentes",
        answer: "o coronelismo",
        why: "ele estruturou relações de mando na Primeira República"
      },
      {
        lead: "a troca de favores e protecao por apoio político",
        answer: "o clientelismo",
        why: "essa pratica sustentava o dominio das oligarquias"
      },
      {
        lead: "o controle do voto por pressao e dependência pessoal",
        answer: "o voto de cabresto",
        why: "ele comprometia a liberdade eleitoral"
      },
      {
        lead: "o arranjo entre presidente e oligarquias estaduais para garantir governabilidade",
        answer: "a política dos governadores",
        why: "o sistema articulava interesses locais e nacionais"
      },
      {
        lead: "a manipulacao de resultados e da validacao eleitoral",
        answer: "um mecanismo de sustentacao do poder oligarquico",
        why: "fraudes ajudavam a conservar a mesma elite no comando"
      }
    ]
  },
  {
    subtopico: "Movimentos sociais da Primeira República",
    habilidade: "analisar-oligarquias-coronelismo-e-movimentos-sociais-na-primeira-republica",
    tags: ["republica-no-brasil", "movimentos-sociais"],
    fatos: [
      {
        lead: "o arraial liderado por Antonio Conselheiro no sertao baiano",
        answer: "Canudos",
        why: "o movimento foi violentamente destruido pelo Estado"
      },
      {
        lead: "o conflito social e religioso ocorrido entre Parana e Santa Catarina",
        answer: "a Guerra do Contestado",
        why: "a luta envolveu terras, messianismo e exclusao social"
      },
      {
        lead: "a revolta popular contra a vacinacao obrigatoria no Rio de Janeiro",
        answer: "a Revolta da Vacina",
        why: "o movimento expressou autoritarismo estatal e tensoes urbanas"
      },
      {
        lead: "o levante dos marinheiros contra castigos corporais e hierarquia racista",
        answer: "a Revolta da Chibata",
        why: "ela denunciou abusos persistentes na Marinha"
      },
      {
        lead: "o movimento de jovens oficiais que criticava a velha política",
        answer: "o tenentismo",
        why: "ele expressou insatisfacao com o sistema oligarquico"
      }
    ]
  },
  {
    subtopico: "Revolução de 1930 e Era Vargas",
    habilidade: "relacionar-era-vargas-estado-novo-e-populismo-a-transformacoes-politicas-e-sociais",
    tags: ["republica-no-brasil", "era-vargas"],
    fatos: [
      {
        lead: "o movimento que encerrou a hegemonia da Primeira República",
        answer: "a Revolução de 1930",
        why: "ela levou Getulio Vargas ao poder"
      },
      {
        lead: "a alianca oposicionista que contestou o arranjo oligarquico",
        answer: "a Alianca Liberal",
        why: "ela reuniu forcas dissidentes do sistema político anterior"
      },
      {
        lead: "a centralizacao administrativa e política promovida por Vargas",
        answer: "uma marca da Era Vargas",
        why: "o novo governo ampliou o papel do Estado nacional"
      },
      {
        lead: "o crescimento da legislacao trabalhista sob Getulio",
        answer: "uma estrategia de incorporacao política dos trabalhadores",
        why: "o governo buscou apoio social e controle institucional"
      },
      {
        lead: "o incentivo estatal a industria durante o período",
        answer: "um aspecto da modernizacao varguista",
        why: "o pais fortaleceu bases urbanas e industriais"
      }
    ]
  },
  {
    subtopico: "Estado Novo",
    habilidade: "relacionar-era-vargas-estado-novo-e-populismo-a-transformacoes-politicas-e-sociais",
    tags: ["republica-no-brasil", "estado-novo"],
    fatos: [
      {
        lead: "o regime instaurado por Getulio Vargas em 1937",
        answer: "o Estado Novo",
        why: "ele representou fase autoritaria da era varguista"
      },
      {
        lead: "a constituicao outorgada que reforcou poderes centralizados",
        answer: "a Polaca",
        why: "ela consolidou o autoritarismo do novo regime"
      },
      {
        lead: "o orgao responsavel por propaganda e controle de informacoes no período",
        answer: "o DIP",
        why: "ele atuou na construcao da imagem oficial do governo"
      },
      {
        lead: "a sistematizacao das leis trabalhistas em 1943",
        answer: "a CLT",
        why: "ela integrou importante legado institucional do varguismo"
      },
      {
        lead: "a combinacao entre nacionalismo, centralizacao e repressao",
        answer: "uma caracteristica do Estado Novo",
        why: "o regime limitou liberdades em nome da unidade nacional"
      }
    ]
  },
  {
    subtopico: "Democracia de 1946 e populismo",
    habilidade: "relacionar-era-vargas-estado-novo-e-populismo-a-transformacoes-politicas-e-sociais",
    tags: ["republica-no-brasil", "democracia-de-1946"],
    fatos: [
      {
        lead: "a fase republicana aberta com o fim do Estado Novo",
        answer: "a democracia de 1946",
        why: "o pais retomou instituicoes representativas após a ditadura varguista"
      },
      {
        lead: "a constituicao promulgada no pos-guerra brasileiro",
        answer: "a Constituicao de 1946",
        why: "ela restaurou bases liberais e eleitorais da vida política"
      },
      {
        lead: "o retorno de Vargas a presidencia pelo voto em 1950",
        answer: "um marco do populismo brasileiro",
        why: "liderancas carismaticas ampliaram o apelo direto as massas urbanas"
      },
      {
        lead: "o plano desenvolvimentista sintetizado no lema cinquenta anos em cinco",
        answer: "o governo Juscelino Kubitschek",
        why: "ele associou crescimento economico a modernizacao acelerada"
      },
      {
        lead: "a tentativa de promover reformas estruturais no inicio dos anos 1960",
        answer: "um ponto de tensao da democracia populista",
        why: "as disputas sobre mudancas sociais se intensificaram antes de 1964"
      }
    ]
  },
  {
    subtopico: "Crise política e golpe de 1964",
    habilidade: "avaliar-a-crise-de-1964-a-redemocratizacao-e-a-nova-republica",
    tags: ["republica-no-brasil", "crise-de-1964"],
    fatos: [
      {
        lead: "a renuncia inesperada do presidente em 1961",
        answer: "a crise aberta por Janio Quadros",
        why: "o episodio desestabilizou profundamente a política nacional"
      },
      {
        lead: "a solucao institucional provisoria para permitir a posse de Joao Goulart",
        answer: "o parlamentarismo de 1961",
        why: "ele buscou reduzir resistencias a chegada de Jango"
      },
      {
        lead: "as Reformas de Base defendidas por Joao Goulart",
        answer: "um eixo da polarizacao política",
        why: "setores conservadores viam nelas ameaça a ordem social"
      },
      {
        lead: "o apoio de militares e grupos civis ao afastamento de Jango",
        answer: "a base do golpe de 1964",
        why: "o movimento reuniu diferentes interesses antirreformistas"
      },
      {
        lead: "a interrupcao da democracia em abril de 1964",
        answer: "um marco autoritario da República brasileira",
        why: "o golpe abriu caminho para duas decadas de ditadura"
      }
    ]
  },
  {
    subtopico: "Redemocratizacao e Nova República",
    habilidade: "avaliar-a-crise-de-1964-a-redemocratizacao-e-a-nova-republica",
    tags: ["republica-no-brasil", "nova-republica"],
    fatos: [
      {
        lead: "o processo de retorno gradual a democracia após a ditadura",
        answer: "a redemocratizacao",
        why: "ele reabriu espacos de representacao política e direitos civis"
      },
      {
        lead: "a eleicao indireta de Tancredo Neves em 1985",
        answer: "um marco inicial da Nova República",
        why: "o evento simbolizou o encerramento do ciclo militar"
      },
      {
        lead: "a Carta que ampliou direitos e reorganizou a ordem democratica",
        answer: "a Constituicao de 1988",
        why: "ela se tornou referencia da cidadania no período recente"
      },
      {
        lead: "a realizacao da primeira eleicao presidencial direta após a ditadura",
        answer: "um passo de consolidacao democratica",
        why: "o voto popular voltou a definir a chefia do Executivo nacional"
      },
      {
        lead: "as dificuldades econômicas e institucionais da fase inicial da Nova República",
        answer: "um desafio da democracia recente",
        why: "a estabilizacao política não eliminou crises estruturais"
      }
    ]
  },
  {
    subtopico: "República brasileira: permanencias e mudancas",
    habilidade: "sintetizar-permanencias-e-rupturas-da-experiencia-republicana-no-brasil",
    tags: ["republica-no-brasil", "permanencias-e-mudancas"],
    fatos: [
      {
        lead: "a permanencia historica de desigualdades sociais e políticas ao longo da República",
        answer: "uma continuidade da experiência republicana",
        why: "a ampliacao formal de direitos nem sempre eliminou exclusoes"
      },
      {
        lead: "a ampliacao gradual da cidadania em diferentes momentos do período republicano",
        answer: "uma mudanca importante da história política brasileira",
        why: "novos grupos foram incorporados aos direitos é a participacao"
      },
      {
        lead: "a oscilação entre fases democráticas e autoritarias",
        answer: "uma tensao recorrente da República brasileira",
        why: "o regime alternou abertura política e interrupcoes institucionais"
      },
      {
        lead: "a variação do papel do Estado na economia e nas políticas sociais",
        answer: "um aspecto dinamico da trajetoria republicana",
        why: "diferentes governos redefiniram prioridades e instrumentos"
      },
      {
        lead: "a avaliação de longo prazo da República no Brasil",
        answer: "uma experiência marcada por rupturas e permanencias",
        why: "o regime combinou modernizacao, conflitos e desigualdades duradouras"
      }
    ]
  }
];

const questoes = buildPlannedQuestions({
  prefix: "rpb",
  serie: [3],
  materia: "História",
  topico: "República no Brasil",
  blocos
});

export const republicaNoBrasil = {
  id: "historia_republica_no_brasil",
  materia: "História",
  serie: [3],
  topico: "República no Brasil",
  metadados: {
    disciplinaId: "historia",
    base: "ESCOLAR",
    eixo: "História",
    frente: "República brasileira e transformações políticas",
    searchAliases: [
      "república no brasil",
      "república velha",
      "era vargas",
      "nova república",
      "história republicana"
    ],
    subtopicosBase: [
      "República da Espada",
      "República Oligarquica",
      "Coronelismo e política dos governadores",
      "Movimentos sociais da Primeira República",
      "Revolução de 1930 e Era Vargas",
      "Estado Novo",
      "Democracia de 1946 e populismo",
      "Crise política e golpe de 1964",
      "Redemocratizacao e Nova República",
      "República brasileira: permanencias e mudancas"
    ],
    habilidadesBase: [
      "identificar fases e características da República brasileira",
      "analisar oligarquias, coronelismo e movimentos sociais na Primeira República",
      "relacionar Era Vargas, Estado Novo e populismo a transformações políticas e sociais",
      "avaliar a crise de 1964, a redemocratizacao é a Nova República",
      "sintetizar permanencias e rupturas da experiência republicana no Brasil"
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
