import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";

const blocos = [
  {
    subtopico: "Crise do sistema colonial",
    habilidade: "identificar-fatores-da-crise-do-sistema-colonial-e-da-independencia",
    tags: ["independencia-do-brasil", "crise-colonial"],
    fatos: [
      {
        lead: "o desgaste da relacao entre colonia e metropole no fim do periodo colonial",
        answer: "a crise do sistema colonial",
        why: "as estruturas coloniais passaram a ser contestadas por diferentes grupos"
      },
      {
        lead: "a insatisfacao com impostos, monopolios e restricoes comerciais",
        answer: "um fator de tensao entre Brasil e Portugal",
        why: "o pacto colonial limitava interesses economicos locais"
      },
      {
        lead: "a influencia das revolucoes americana e francesa sobre colonias ibericas",
        answer: "a circulacao de ideias de emancipacao politica",
        why: "esses exemplos estimularam debates sobre autonomia e ruptura"
      },
      {
        lead: "o questionamento do exclusivismo comercial portugues",
        answer: "uma critica central ao antigo sistema colonial",
        why: "setores coloniais queriam maior liberdade economica"
      },
      {
        lead: "o crescimento de interesses locais na administracao e na economia",
        answer: "a formacao de elites com projeto autonomista",
        why: "esses grupos desejavam ampliar seu poder politico"
      }
    ]
  },
  {
    subtopico: "Transferencia da corte e abertura dos portos",
    habilidade: "analisar-o-papel-da-corte-portuguesa-e-das-elites-no-processo-de-emancipacao",
    tags: ["independencia-do-brasil", "corte-portuguesa"],
    fatos: [
      {
        lead: "a vinda da familia real portuguesa para o Rio de Janeiro em 1808",
        answer: "a transferencia da corte",
        why: "ela alterou profundamente a condicao politica do Brasil"
      },
      {
        lead: "o ato que encerrou o monopolio comercial de Portugal sobre o Brasil",
        answer: "a abertura dos portos",
        why: "o comercio brasileiro passou a se abrir a outras nacoes"
      },
      {
        lead: "a elevacao do Brasil a Reino Unido a Portugal e Algarves",
        answer: "um passo de valorizacao politica da colonia",
        why: "o territorio deixou de ocupar posicao formalmente subalterna"
      },
      {
        lead: "a criacao de instituicoes como Banco do Brasil, imprensa e tribunais",
        answer: "a reorganizacao administrativa joanina",
        why: "a presenca da corte ampliou a estrutura estatal no Brasil"
      },
      {
        lead: "o fortalecimento economico do Rio de Janeiro com a corte",
        answer: "uma mudanca importante no centro politico do imperio portugues",
        why: "a capital americana ganhou protagonismo nas decisoes da monarquia"
      }
    ]
  },
  {
    subtopico: "Revolucao do Porto e tensoes luso-brasileiras",
    habilidade: "identificar-fatores-da-crise-do-sistema-colonial-e-da-independencia",
    tags: ["independencia-do-brasil", "revolucao-do-porto"],
    fatos: [
      {
        lead: "o movimento liberal ocorrido em Portugal em 1820",
        answer: "a Revolucao do Porto",
        why: "ela exigiu reformas politicas e o retorno da corte"
      },
      {
        lead: "a tentativa das Cortes de recolonizar o Brasil",
        answer: "um fator de agravamento das tensoes",
        why: "as medidas ameacavam ganhos politicos e economicos obtidos desde 1808"
      },
      {
        lead: "a ordem para que D. Pedro retornasse a Portugal",
        answer: "uma exigencia das Cortes portuguesas",
        why: "o objetivo era subordinar novamente o Brasil"
      },
      {
        lead: "a permanencia de D. Pedro no Brasil em janeiro de 1822",
        answer: "o Dia do Fico",
        why: "esse episodio reforcou a ruptura com as Cortes"
      },
      {
        lead: "o conflito entre projeto centralizador das Cortes e interesses locais brasileiros",
        answer: "a polarizacao luso-brasileira",
        why: "ela acelerou o caminho para a separacao politica"
      }
    ]
  },
  {
    subtopico: "Projetos politicos de emancipacao",
    habilidade: "analisar-o-papel-da-corte-portuguesa-e-das-elites-no-processo-de-emancipacao",
    tags: ["independencia-do-brasil", "projetos-politicos"],
    fatos: [
      {
        lead: "a proposta de manter a unidade territorial sob uma monarquia centralizada",
        answer: "o projeto conservador de independencia",
        why: "ele buscava autonomia sem revolucao social profunda"
      },
      {
        lead: "a defesa de maior participacao politica e limites ao poder do governante",
        answer: "o liberalismo constitucional",
        why: "muitos grupos desejavam independencia com ordenamento constitucional"
      },
      {
        lead: "a divergencia entre autonomia provincial e centralizacao no Rio de Janeiro",
        answer: "um debate central da emancipacao",
        why: "setores distintos tinham projetos diferentes para o novo Estado"
      },
      {
        lead: "a influencia de Jose Bonifacio no processo de 1822",
        answer: "a articulacao de uma independencia liderada pelas elites",
        why: "ele defendeu unidade politica sob D. Pedro"
      },
      {
        lead: "a ausencia de ruptura radical com a ordem social",
        answer: "uma caracteristica dos projetos vitoriosos",
        why: "a emancipacao preservou escravidao e hierarquias"
      }
    ]
  },
  {
    subtopico: "Processo de 1822 e ruptura politica",
    habilidade: "avaliar-o-significado-politico-da-independencia-na-formacao-do-estado-brasileiro",
    tags: ["independencia-do-brasil", "1822"],
    fatos: [
      {
        lead: "o episodio simbolico ocorrido as margens do Ipiranga",
        answer: "a proclamacao da independencia em 1822",
        why: "ele representa a ruptura politica formal com Portugal"
      },
      {
        lead: "a declaracao liderada por D. Pedro em setembro de 1822",
        answer: "um ato de separacao politica",
        why: "o Brasil passou a se afirmar como Estado independente"
      },
      {
        lead: "a manutencao da monarquia apos a independencia",
        answer: "uma peculiaridade do caso brasileiro",
        why: "diferentemente de muitos vizinhos, a emancipacao preservou a forma monarquica"
      },
      {
        lead: "a continuidade de estruturas administrativas e sociais apos 1822",
        answer: "um sinal de independencia conservadora",
        why: "houve mudanca politica sem ampla transformacao social"
      },
      {
        lead: "a lideranca do herdeiro portugues no processo emancipador",
        answer: "uma estrategia de continuidade dinastica",
        why: "ela ajudou elites a evitar rupturas mais profundas"
      }
    ]
  },
  {
    subtopico: "Participacao popular e resistencias regionais",
    habilidade: "relacionar-a-independencia-a-conflitos-regionais-escravidao-e-dependencia-externa",
    tags: ["independencia-do-brasil", "resistencias-regionais"],
    fatos: [
      {
        lead: "a adesao desigual das provincias ao novo governo de D. Pedro",
        answer: "a existencia de resistencias regionais a independencia",
        why: "nem todo o territorio aceitou imediatamente a ruptura"
      },
      {
        lead: "os conflitos militares na Bahia, no Para e no Maranhao",
        answer: "guerras de consolidacao da independencia",
        why: "a separacao exigiu luta armada em varias regioes"
      },
      {
        lead: "a participacao de setores populares e de mulheres nas lutas regionais",
        answer: "um aspecto frequentemente invisibilizado do processo",
        why: "a independencia nao foi obra exclusiva de elites"
      },
      {
        lead: "a resistencia de grupos ligados a administracao portuguesa",
        answer: "um obstaculo a consolidacao do novo Estado",
        why: "esses setores defendiam a manutencao da uniao com Lisboa"
      },
      {
        lead: "a necessidade de impor autoridade sobre provincias diversas",
        answer: "um desafio da unidade territorial brasileira",
        why: "o novo Estado precisou integrar regioes com interesses diferentes"
      }
    ]
  },
  {
    subtopico: "Elites, escravidao e independencia",
    habilidade: "relacionar-a-independencia-a-conflitos-regionais-escravidao-e-dependencia-externa",
    tags: ["independencia-do-brasil", "escravidao"],
    fatos: [
      {
        lead: "a manutencao do trabalho escravizado apos 1822",
        answer: "uma grande permanencia da independencia",
        why: "o novo Estado nao rompeu com a base social escravista"
      },
      {
        lead: "o protagonismo de proprietarios e grupos economicamente dominantes",
        answer: "a conducao elitista da emancipacao",
        why: "as elites buscaram autonomia politica sem revolucao social"
      },
      {
        lead: "a ausencia de cidadania ampla para a maioria da populacao",
        answer: "um limite da independencia brasileira",
        why: "direitos politicos permaneceram restritos"
      },
      {
        lead: "a defesa da ordem social e da propriedade escravista pelos lideres de 1822",
        answer: "um fator de conservacao estrutural",
        why: "a independencia protegeu interesses agrarios e escravistas"
      },
      {
        lead: "a continuacao do trafico de africanos apos a independencia",
        answer: "uma evidencia de continuidade economica",
        why: "o sistema escravista seguiu central para a economia"
      }
    ]
  },
  {
    subtopico: "Reconhecimento internacional e dependencias",
    habilidade: "relacionar-a-independencia-a-conflitos-regionais-escravidao-e-dependencia-externa",
    tags: ["independencia-do-brasil", "reconhecimento-internacional"],
    fatos: [
      {
        lead: "a mediacao britanica nas negociacoes entre Brasil e Portugal",
        answer: "um elemento da dependencia externa do novo Estado",
        why: "a Inglaterra teve peso diplomatico e economico no processo"
      },
      {
        lead: "o pagamento de indenizacao a Portugal pelo reconhecimento da independencia",
        answer: "uma exigencia negociada para legitimar a separacao",
        why: "o acordo reforcou a dependencia financeira brasileira"
      },
      {
        lead: "a concessao de vantagens comerciais aos ingleses",
        answer: "um sinal da influencia britanica no Brasil independente",
        why: "tratados mantiveram condicoes favoraveis ao comercio ingles"
      },
      {
        lead: "a necessidade de obter reconhecimento das grandes potencias",
        answer: "um desafio diplomatico do novo imperio",
        why: "a legitimacao internacional era importante para sua estabilidade"
      },
      {
        lead: "a permanencia de vinculos economicos externos apos 1822",
        answer: "uma limitacao da autonomia nacional",
        why: "a independencia politica nao significou plena independencia economica"
      }
    ]
  },
  {
    subtopico: "Constituicao de 1824 e Primeiro Reinado",
    habilidade: "avaliar-o-significado-politico-da-independencia-na-formacao-do-estado-brasileiro",
    tags: ["independencia-do-brasil", "primeiro-reinado"],
    fatos: [
      {
        lead: "a Carta que organizou politicamente o Imperio do Brasil",
        answer: "a Constituicao de 1824",
        why: "ela estruturou o novo Estado independente"
      },
      {
        lead: "o mecanismo que colocava o imperador acima dos demais poderes",
        answer: "o Poder Moderador",
        why: "ele ampliava a autoridade politica de D. Pedro I"
      },
      {
        lead: "a dissolucao da Assembleia Constituinte em 1823",
        answer: "um indicio de autoritarismo do Primeiro Reinado",
        why: "o conflito mostrou tensoes entre imperador e representantes"
      },
      {
        lead: "a revolta de 1824 no Nordeste contra o centralismo imperial",
        answer: "a Confederacao do Equador",
        why: "o movimento contestou a concentracao de poder no Rio"
      },
      {
        lead: "o voto censitario previsto na Constituicao imperial",
        answer: "um limite da participacao politica",
        why: "somente determinados grupos podiam exercer direitos eleitorais"
      }
    ]
  },
  {
    subtopico: "Limites e significados da independencia",
    habilidade: "sintetizar-permanencias-e-rupturas-do-processo-de-1822",
    tags: ["independencia-do-brasil", "significados"],
    fatos: [
      {
        lead: "a separacao politica sem abolicao da escravidao e sem reforma social ampla",
        answer: "uma independencia conservadora",
        why: "a ruptura ocorreu com fortes continuidades estruturais"
      },
      {
        lead: "a preservacao da unidade territorial brasileira apos 1822",
        answer: "um resultado importante da independencia",
        why: "o novo Estado manteve grande parte do antigo territorio colonial"
      },
      {
        lead: "a mudanca de colonia para imperio soberano",
        answer: "o principal significado politico de 1822",
        why: "o Brasil conquistou autonomia formal diante de Portugal"
      },
      {
        lead: "a permanencia do poder das elites agrarias no novo Estado",
        answer: "um limite social da emancipacao",
        why: "as estruturas de poder interno pouco se alteraram"
      },
      {
        lead: "a avaliacao historica do processo de independencia brasileira",
        answer: "uma combinacao de ruptura e continuidade",
        why: "houve autonomia politica, mas nao transformacao social profunda"
      }
    ]
  }
];

const questoes = buildPlannedQuestions({
  prefix: "idb",
  serie: [2],
  materia: "Historia",
  topico: "Independencia do Brasil",
  blocos
});

export const independenciaDoBrasil = {
  id: "historia_independencia_do_brasil",
  materia: "Historia",
  serie: [2],
  topico: "Independencia do Brasil",
  metadados: {
    disciplinaId: "historia",
    base: "ESCOLAR",
    eixo: "Historia",
    frente: "Formacao do Estado nacional brasileiro",
    searchAliases: [
      "independencia do brasil",
      "1822",
      "primeiro reinado",
      "corte portuguesa",
      "emancipacao politica"
    ],
    subtopicosBase: [
      "Crise do sistema colonial",
      "Transferencia da corte e abertura dos portos",
      "Revolucao do Porto e tensoes luso-brasileiras",
      "Projetos politicos de emancipacao",
      "Processo de 1822 e ruptura politica",
      "Participacao popular e resistencias regionais",
      "Elites, escravidao e independencia",
      "Reconhecimento internacional e dependencias",
      "Constituicao de 1824 e Primeiro Reinado",
      "Limites e significados da independencia"
    ],
    habilidadesBase: [
      "identificar fatores da crise do sistema colonial e da independencia",
      "analisar o papel da corte portuguesa e das elites no processo de emancipacao",
      "relacionar a independencia a conflitos regionais, escravidao e dependencia externa",
      "avaliar o significado politico da independencia na formacao do Estado brasileiro",
      "sintetizar permanencias e rupturas do processo de 1822"
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
