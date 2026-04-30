import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";

const blocos = [
  {
    subtopico: "Crise do sistema colonial",
    habilidade: "identificar-fatores-da-crise-do-sistema-colonial-e-da-independencia",
    tags: ["independencia-do-brasil", "crise-colonial"],
    fatos: [
      {
        lead: "o desgaste da relação entre colonia e metropole no fim do período colonial",
        answer: "a crise do sistema colonial",
        why: "as estruturas coloniais passaram a ser contestadas por diferentes grupos"
      },
      {
        lead: "a insatisfacao com impostos, monopolios e restricoes comerciais",
        answer: "um fator de tensao entre Brasil e Portugal",
        why: "o pacto colonial limitava interesses economicos locais"
      },
      {
        lead: "a influencia das revoluções americana e francesa sobre colonias ibericas",
        answer: "a circulação de ideias de emancipacao política",
        why: "esses exemplos estimularam debates sobre autonomia e ruptura"
      },
      {
        lead: "o questionamento do exclusivismo comercial português",
        answer: "uma critica central ao antigo sistema colonial",
        why: "setores coloniais queriam maior liberdade econômica"
      },
      {
        lead: "o crescimento de interesses locais na administracao e na economia",
        answer: "a formação de elites com projeto autonomista",
        why: "esses grupos desejavam ampliar seu poder político"
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
        why: "ela alterou profundamente a condicao política do Brasil"
      },
      {
        lead: "o ato que encerrou o monopolio comercial de Portugal sobre o Brasil",
        answer: "a abertura dos portos",
        why: "o comercio brasileiro passou a se abrir a outras nacoes"
      },
      {
        lead: "a elevacao do Brasil a Reino Unido a Portugal e Algarves",
        answer: "um passo de valorizacao política da colonia",
        why: "o territorio deixou de ocupar posicao formalmente subalterna"
      },
      {
        lead: "a criacao de instituicoes como Banco do Brasil, imprensa e tribunais",
        answer: "a reorganizacao administrativa joanina",
        why: "a presenca da corte ampliou a estrutura estatal no Brasil"
      },
      {
        lead: "o fortalecimento economico do Rio de Janeiro com a corte",
        answer: "uma mudanca importante no centro político do império português",
        why: "a capital americana ganhou protagonismo nas decisões da monarquia"
      }
    ]
  },
  {
    subtopico: "Revolução do Porto e tensoes luso-brasileiras",
    habilidade: "identificar-fatores-da-crise-do-sistema-colonial-e-da-independencia",
    tags: ["independencia-do-brasil", "revolucao-do-porto"],
    fatos: [
      {
        lead: "o movimento liberal ocorrido em Portugal em 1820",
        answer: "a Revolução do Porto",
        why: "ela exigiu reformas políticas é o retorno da corte"
      },
      {
        lead: "a tentativa das Cortes de recolonizar o Brasil",
        answer: "um fator de agravamento das tensoes",
        why: "as medidas ameacavam ganhos políticos e economicos obtidos desde 1808"
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
        why: "ela acelerou o caminho para a separacao política"
      }
    ]
  },
  {
    subtopico: "Projetos políticos de emancipacao",
    habilidade: "analisar-o-papel-da-corte-portuguesa-e-das-elites-no-processo-de-emancipacao",
    tags: ["independencia-do-brasil", "projetos-politicos"],
    fatos: [
      {
        lead: "a proposta de manter a unidade territorial sob uma monarquia centralizada",
        answer: "o projeto conservador de independencia",
        why: "ele buscava autonomia sem revolução social profunda"
      },
      {
        lead: "a defesa de maior participacao política e limites ao poder do governante",
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
        why: "ele defendeu unidade política sob D. Pedro"
      },
      {
        lead: "a ausencia de ruptura radical com a ordem social",
        answer: "uma caracteristica dos projetos vitoriosos",
        why: "a emancipacao preservou escravidao e hierarquias"
      }
    ]
  },
  {
    subtopico: "Processo de 1822 e ruptura política",
    habilidade: "avaliar-o-significado-politico-da-independencia-na-formacao-do-estado-brasileiro",
    tags: ["independencia-do-brasil", "1822"],
    fatos: [
      {
        lead: "o episodio simbolico ocorrido as margens do Ipiranga",
        answer: "a proclamacao da independencia em 1822",
        why: "ele representa a ruptura política formal com Portugal"
      },
      {
        lead: "a declaracao liderada por D. Pedro em setembro de 1822",
        answer: "um ato de separacao política",
        why: "o Brasil passou a se afirmar como Estado independente"
      },
      {
        lead: "a manutencao da monarquia após a independencia",
        answer: "uma peculiaridade do caso brasileiro",
        why: "diferentemente de muitos vizinhos, a emancipacao preservou a forma monarquica"
      },
      {
        lead: "a continuidade de estruturas administrativas e sociais após 1822",
        answer: "um sinal de independencia conservadora",
        why: "houve mudanca política sem ampla transformação social"
      },
      {
        lead: "a liderança do herdeiro português no processo emancipador",
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
        why: "a independencia não foi obra exclusiva de elites"
      },
      {
        lead: "a resistência de grupos ligados a administracao portuguesa",
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
        lead: "a manutencao do trabalho escravizado após 1822",
        answer: "uma grande permanencia da independencia",
        why: "o novo Estado não rompeu com a base social escravista"
      },
      {
        lead: "o protagonismo de proprietarios e grupos economicamente dominantes",
        answer: "a conducao elitista da emancipacao",
        why: "as elites buscaram autonomia política sem revolução social"
      },
      {
        lead: "a ausencia de cidadania ampla para a maioria da população",
        answer: "um limite da independencia brasileira",
        why: "direitos políticos permaneceram restritos"
      },
      {
        lead: "a defesa da ordem social e da propriedade escravista pelos lideres de 1822",
        answer: "um fator de conservacao estrutural",
        why: "a independencia protegeu interesses agrarios e escravistas"
      },
      {
        lead: "a continuacao do trafico de africanos após a independencia",
        answer: "uma evidencia de continuidade econômica",
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
        answer: "um elemento da dependência externa do novo Estado",
        why: "a Inglaterra teve peso diplomatico e economico no processo"
      },
      {
        lead: "o pagamento de indenizacao a Portugal pelo reconhecimento da independencia",
        answer: "uma exigencia negociada para legitimar a separacao",
        why: "o acordo reforcou a dependência financeira brasileira"
      },
      {
        lead: "a concessao de vantagens comerciais aos ingleses",
        answer: "um sinal da influencia britanica no Brasil independente",
        why: "tratados mantiveram condições favoraveis ao comercio inglês"
      },
      {
        lead: "a necessidade de obter reconhecimento das grandes potencias",
        answer: "um desafio diplomatico do novo império",
        why: "a legitimacao internacional era importante para sua estabilidade"
      },
      {
        lead: "a permanencia de vinculos economicos externos após 1822",
        answer: "uma limitacao da autonomia nacional",
        why: "a independencia política não significou plena independencia econômica"
      }
    ]
  },
  {
    subtopico: "Constituicao de 1824 e Primeiro Reinado",
    habilidade: "avaliar-o-significado-politico-da-independencia-na-formacao-do-estado-brasileiro",
    tags: ["independencia-do-brasil", "primeiro-reinado"],
    fatos: [
      {
        lead: "a Carta que organizou politicamente o Império do Brasil",
        answer: "a Constituicao de 1824",
        why: "ela estruturou o novo Estado independente"
      },
      {
        lead: "o mecanismo que colocava o imperador acima dos demais poderes",
        answer: "o Poder Moderador",
        why: "ele ampliava a autoridade política de D. Pedro I"
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
        answer: "um limite da participacao política",
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
        lead: "a separacao política sem abolicao da escravidao e sem reforma social ampla",
        answer: "uma independencia conservadora",
        why: "a ruptura ocorreu com fortes continuidades estruturais"
      },
      {
        lead: "a preservacao da unidade territorial brasileira após 1822",
        answer: "um resultado importante da independencia",
        why: "o novo Estado manteve grande parte do antigo territorio colonial"
      },
      {
        lead: "a mudanca de colonia para império soberano",
        answer: "o principal significado político de 1822",
        why: "o Brasil conquistou autonomia formal diante de Portugal"
      },
      {
        lead: "a permanencia do poder das elites agrarias no novo Estado",
        answer: "um limite social da emancipacao",
        why: "as estruturas de poder interno pouco se alteraram"
      },
      {
        lead: "a avaliação historica do processo de independencia brasileira",
        answer: "uma combinacao de ruptura e continuidade",
        why: "houve autonomia política, mas não transformação social profunda"
      }
    ]
  }
];

const questoes = buildPlannedQuestions({
  prefix: "idb",
  serie: [2],
  materia: "História",
  topico: "Independencia do Brasil",
  blocos
});

export const independenciaDoBrasil = {
  id: "historia_independencia_do_brasil",
  materia: "História",
  serie: [2],
  topico: "Independencia do Brasil",
  metadados: {
    disciplinaId: "historia",
    base: "ESCOLAR",
    eixo: "História",
    frente: "Formação do Estado nacional brasileiro",
    searchAliases: [
      "independencia do brasil",
      "1822",
      "primeiro reinado",
      "corte portuguesa",
      "emancipacao política"
    ],
    subtopicosBase: [
      "Crise do sistema colonial",
      "Transferencia da corte e abertura dos portos",
      "Revolução do Porto e tensoes luso-brasileiras",
      "Projetos políticos de emancipacao",
      "Processo de 1822 e ruptura política",
      "Participacao popular e resistencias regionais",
      "Elites, escravidao e independencia",
      "Reconhecimento internacional e dependencias",
      "Constituicao de 1824 e Primeiro Reinado",
      "Limites e significados da independencia"
    ],
    habilidadesBase: [
      "identificar fatores da crise do sistema colonial e da independencia",
      "analisar o papel da corte portuguesa e das elites no processo de emancipacao",
      "relacionar a independencia a conflitos regionais, escravidao e dependência externa",
      "avaliar o significado político da independencia na formação do Estado brasileiro",
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
