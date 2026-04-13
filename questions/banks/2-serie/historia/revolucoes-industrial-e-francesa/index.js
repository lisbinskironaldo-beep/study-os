import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";

const blocos = [
  {
    subtopico: "Antigo Regime e Iluminismo",
    habilidade: "identificar-causas-e-contexto-das-revolucoes-industrial-e-francesa",
    tags: ["revolucoes", "antigo-regime"],
    fatos: [
      {
        lead: "a ordem politica e social europeia anterior a Revolucao Francesa",
        answer: "o Antigo Regime",
        why: "ela combinava monarquia absolutista, privilegios e sociedade estamental"
      },
      {
        lead: "a divisao da sociedade francesa em clero, nobreza e terceiro estado",
        answer: "a estrutura estamental",
        why: "os direitos e deveres eram desigualmente distribuidos"
      },
      {
        lead: "o movimento intelectual que valorizava razao e critica ao absolutismo",
        answer: "o Iluminismo",
        why: "suas ideias influenciaram projetos politicos modernos"
      },
      {
        lead: "a defesa da separacao entre os poderes do Estado",
        answer: "uma proposta de Montesquieu",
        why: "ela buscava limitar a concentracao de poder"
      },
      {
        lead: "a ideia de soberania popular e contrato social",
        answer: "uma contribuicao de Rousseau",
        why: "ela influenciou fortemente a cultura politica revolucionaria"
      }
    ]
  },
  {
    subtopico: "Crise do Antigo Regime na Franca",
    habilidade: "analisar-o-iluminismo-o-antigo-regime-e-as-transformacoes-politicas-de-1789",
    tags: ["revolucoes", "crise-francesa"],
    fatos: [
      {
        lead: "o peso desigual dos impostos sobre o terceiro estado",
        answer: "um fator da crise do Antigo Regime na Franca",
        why: "a maioria social sustentava financeiramente os privilegios de poucos"
      },
      {
        lead: "o endividamento da monarquia francesa no seculo XVIII",
        answer: "um elemento central da crise politica",
        why: "os gastos do Estado agravaram a instabilidade financeira"
      },
      {
        lead: "a sucessao de colheitas ruins e aumento no preco do pao",
        answer: "um fator de explosao social",
        why: "a crise economica afetou fortemente a populacao urbana e rural"
      },
      {
        lead: "a convocacao dos Estados Gerais em 1789",
        answer: "um sinal do enfraquecimento da monarquia",
        why: "o rei precisou recorrer a uma instituicao representativa extraordinaria"
      },
      {
        lead: "a contestacao dos privilegios de clero e nobreza",
        answer: "o eixo social da crise francesa",
        why: "o terceiro estado exigia igualdade politica e fiscal"
      }
    ]
  },
  {
    subtopico: "Revolucao Francesa: 1789 e fases iniciais",
    habilidade: "analisar-o-iluminismo-o-antigo-regime-e-as-transformacoes-politicas-de-1789",
    tags: ["revolucoes", "revolucao-francesa"],
    fatos: [
      {
        lead: "a declaracao do terceiro estado como Assembleia Nacional",
        answer: "um passo decisivo na ruptura revolucionaria",
        why: "os representantes passaram a reivindicar soberania politica"
      },
      {
        lead: "a tomada da Bastilha em 14 de julho de 1789",
        answer: "um simbolo do inicio da Revolucao Francesa",
        why: "o episodio representou ataque ao despotismo real"
      },
      {
        lead: "o documento que afirmou direitos naturais e igualdade juridica",
        answer: "a Declaracao dos Direitos do Homem e do Cidadao",
        why: "ela sintetizou principios fundamentais da revolucao"
      },
      {
        lead: "a abolicao dos privilegios feudais em 1789",
        answer: "uma mudanca social importante",
        why: "a revolucao desmontou bases juridicas da sociedade estamental"
      },
      {
        lead: "a instauracao da monarquia constitucional nos primeiros anos revolucionarios",
        answer: "uma fase moderada da revolucao",
        why: "ainda se buscava limitar, e nao eliminar, a monarquia"
      }
    ]
  },
  {
    subtopico: "Revolucao Francesa: jacobinos, terror e diretorio",
    habilidade: "analisar-o-iluminismo-o-antigo-regime-e-as-transformacoes-politicas-de-1789",
    tags: ["revolucoes", "jacobinos"],
    fatos: [
      {
        lead: "o grupo revolucionario mais radical associado a defesa da republica",
        answer: "os jacobinos",
        why: "eles lideraram a fase mais intensa da revolucao"
      },
      {
        lead: "o periodo de perseguicoes e execucoes para defender a revolucao",
        answer: "o Terror",
        why: "o governo jacobino usou violencia politica contra inimigos reais ou supostos"
      },
      {
        lead: "a lideranca simbolica do jacobinismo",
        answer: "Robespierre",
        why: "seu nome ficou ligado ao comite e ao Terror"
      },
      {
        lead: "a reacao conservadora que derrubou os jacobinos",
        answer: "a Reacao Termidoriana",
        why: "ela encerrou a fase radical da revolucao"
      },
      {
        lead: "o governo mais moderado e instavel que antecedeu Napoleao",
        answer: "o Diretorio",
        why: "essa fase preparou o caminho para nova concentracao de poder"
      }
    ]
  },
  {
    subtopico: "Legados politicos da Revolucao Francesa",
    habilidade: "avaliar-os-legados-das-revolucoes-para-politica-e-sociedade",
    tags: ["revolucoes", "legados-politicos"],
    fatos: [
      {
        lead: "a afirmacao de liberdade e igualdade juridica como principios universais",
        answer: "um legado da Revolucao Francesa",
        why: "esses ideais influenciaram varias experiencias politicas posteriores"
      },
      {
        lead: "a defesa da soberania da nacao em lugar do direito divino",
        answer: "uma mudanca politica fundamental",
        why: "a legitimidade do poder passou a ser associada ao corpo politico"
      },
      {
        lead: "a difusao do principio de cidadania",
        answer: "um legado moderno da revolucao",
        why: "a participacao politica ganhou novo sentido historico"
      },
      {
        lead: "o enfraquecimento dos privilegios de nascimento",
        answer: "uma heranca da critica revolucionaria ao Antigo Regime",
        why: "a revolucao questionou hierarquias estamentais tradicionais"
      },
      {
        lead: "a repercussao da revolucao em outras partes do mundo",
        answer: "a expansao de ideias liberais e nacionais",
        why: "o processo frances inspirou movimentos e debates internacionais"
      }
    ]
  },
  {
    subtopico: "Revolucao Industrial: origens na Inglaterra",
    habilidade: "identificar-causas-e-contexto-das-revolucoes-industrial-e-francesa",
    tags: ["revolucoes", "revolucao-industrial"],
    fatos: [
      {
        lead: "o pais em que a industrializacao se iniciou primeiro",
        answer: "a Inglaterra",
        why: "ela reuniu condicoes favoraveis para pioneirismo industrial"
      },
      {
        lead: "a disponibilidade de capitais acumulados com comercio e colonias",
        answer: "um fator da Revolucao Industrial",
        why: "os investimentos ajudaram a financiar maquinas e fabricas"
      },
      {
        lead: "a existencia de carvao mineral e ferro em larga escala",
        answer: "uma base material da industrializacao inglesa",
        why: "esses recursos foram essenciais para energia e metalurgia"
      },
      {
        lead: "a ampliacao da producao agricola e da oferta de trabalhadores",
        answer: "um efeito das transformacoes no campo ingles",
        why: "a modernizacao agricola favoreceu o deslocamento de populacoes"
      },
      {
        lead: "a combinacao de mercado consumidor, capitais e estabilidade institucional",
        answer: "o contexto do pioneirismo britanico",
        why: "esses elementos impulsionaram a industrializacao"
      }
    ]
  },
  {
    subtopico: "Maquinas, sistema fabril e producao industrial",
    habilidade: "relacionar-industrializacao-sistema-fabril-e-questao-operaria-ao-capitalismo",
    tags: ["revolucoes", "sistema-fabril"],
    fatos: [
      {
        lead: "a substituicao do trabalho artesanal por producao concentrada em unidades maiores",
        answer: "o sistema fabril",
        why: "a fabricacao passou a ocorrer em espacos controlados pelos empresarios"
      },
      {
        lead: "a maquina que se tornou simbolo da nova energia industrial",
        answer: "a maquina a vapor",
        why: "ela ampliou a produtividade em varios setores"
      },
      {
        lead: "a mecanizacao da fiacao e da tecelagem",
        answer: "uma transformacao central da industria textil",
        why: "o setor textil esteve na vanguarda da industrializacao"
      },
      {
        lead: "a organizacao do trabalho com horarios rigorosos e repeticao de tarefas",
        answer: "uma caracteristica do sistema fabril",
        why: "a disciplina do tempo tornou-se essencial a producao"
      },
      {
        lead: "o aumento da producao em escala e da produtividade",
        answer: "um efeito da mecanizacao",
        why: "as maquinas permitiram produzir mais em menos tempo"
      }
    ]
  },
  {
    subtopico: "Questao operaria e transformacoes sociais",
    habilidade: "relacionar-industrializacao-sistema-fabril-e-questao-operaria-ao-capitalismo",
    tags: ["revolucoes", "questao-operaria"],
    fatos: [
      {
        lead: "o conjunto de problemas ligados as condicoes de vida e trabalho dos trabalhadores industriais",
        answer: "a questao operaria",
        why: "a industrializacao produziu novas desigualdades e conflitos sociais"
      },
      {
        lead: "as jornadas longas, salarios baixos e trabalho infantil",
        answer: "marcas da exploracao operaria inicial",
        why: "o capitalismo industrial se expandiu com pouca protecao social"
      },
      {
        lead: "a destruicao de maquinas por trabalhadores insatisfeitos",
        answer: "o ludismo",
        why: "o movimento reagia a perda de trabalho e ao agravamento da exploracao"
      },
      {
        lead: "a organizacao de trabalhadores para defender direitos e salarios",
        answer: "o sindicalismo",
        why: "ele ganhou importancia com a ampliacao do operariado"
      },
      {
        lead: "o crescimento das cidades industriais e dos bairros operarios",
        answer: "uma transformacao urbana da industrializacao",
        why: "a concentracao fabril alterou profundamente a vida urbana"
      }
    ]
  },
  {
    subtopico: "Capitalismo industrial e expansao economica",
    habilidade: "relacionar-industrializacao-sistema-fabril-e-questao-operaria-ao-capitalismo",
    tags: ["revolucoes", "capitalismo-industrial"],
    fatos: [
      {
        lead: "a forma de organizacao economica baseada em propriedade privada e lucro",
        answer: "o capitalismo industrial",
        why: "ele se consolidou com a expansao das fabricas"
      },
      {
        lead: "a aplicacao de capitais em maquinas, transportes e manufaturas",
        answer: "um motor da expansao industrial",
        why: "investimentos ampliaram capacidade produtiva e mercados"
      },
      {
        lead: "a busca por materias-primas e consumidores para bens industrializados",
        answer: "uma tendencia de expansao economica do capitalismo",
        why: "a producao crescente exigia novos circuitos de abastecimento e venda"
      },
      {
        lead: "o aumento da interligacao entre bancos, comercio e industria",
        answer: "uma caracteristica do capitalismo em amadurecimento",
        why: "setores economicos passaram a se articular mais fortemente"
      },
      {
        lead: "a multiplicacao de ferrovias, navios e meios de circulacao",
        answer: "um fator de aceleracao da economia industrial",
        why: "transportes mais rapidos integraram mercados e mercadorias"
      }
    ]
  },
  {
    subtopico: "Impactos politicos e sociais das revolucoes",
    habilidade: "sintetizar-conexoes-entre-mudanca-politica-e-mudanca-produtiva-na-modernidade",
    tags: ["revolucoes", "impactos-historicos"],
    fatos: [
      {
        lead: "a substituicao de privilegios estamentais por principios de cidadania e direitos",
        answer: "um impacto politico da Revolucao Francesa",
        why: "a legitimidade do poder passou a ser redefinida"
      },
      {
        lead: "a passagem do artesanato para a grande industria mecanizada",
        answer: "um impacto economico da Revolucao Industrial",
        why: "a producao foi reorganizada em novas bases tecnicas e sociais"
      },
      {
        lead: "a formacao de burguesia industrial e proletariado urbano",
        answer: "uma nova estrutura social da modernidade",
        why: "as revolucoes alteraram profundamente as relacoes de classe"
      },
      {
        lead: "a conexao entre ideias politicas de igualdade e mudancas economicas produtivas",
        answer: "uma marca do mundo contemporaneo nascente",
        why: "os dois processos reconfiguraram Estado, sociedade e trabalho"
      },
      {
        lead: "a difusao internacional de liberalismo, nacionalismo e industrializacao",
        answer: "um legado amplo das revolucoes modernas",
        why: "essas transformacoes moldaram os seculos XIX e XX"
      }
    ]
  }
];

const questoes = buildPlannedQuestions({
  prefix: "rif",
  serie: [2],
  materia: "Historia",
  topico: "Revolucoes Industrial e Francesa",
  blocos
});

export const revolucoesIndustrialEFrancesa = {
  id: "historia_revolucoes_industrial_e_francesa",
  materia: "Historia",
  serie: [2],
  topico: "Revolucoes Industrial e Francesa",
  metadados: {
    disciplinaId: "historia",
    base: "ESCOLAR",
    eixo: "Historia",
    frente: "Revolucoes do mundo moderno",
    searchAliases: [
      "revolucao industrial",
      "revolucao francesa",
      "iluminismo",
      "antigo regime",
      "capitalismo industrial"
    ],
    subtopicosBase: [
      "Antigo Regime e Iluminismo",
      "Crise do Antigo Regime na Franca",
      "Revolucao Francesa: 1789 e fases iniciais",
      "Revolucao Francesa: jacobinos, terror e diretorio",
      "Legados politicos da Revolucao Francesa",
      "Revolucao Industrial: origens na Inglaterra",
      "Maquinas, sistema fabril e producao industrial",
      "Questao operaria e transformacoes sociais",
      "Capitalismo industrial e expansao economica",
      "Impactos politicos e sociais das revolucoes"
    ],
    habilidadesBase: [
      "identificar causas e contexto das revolucoes Industrial e Francesa",
      "analisar o Iluminismo, o Antigo Regime e as transformacoes politicas de 1789",
      "relacionar industrializacao, sistema fabril e questao operaria ao capitalismo",
      "avaliar os legados das revolucoes para politica, economia e sociedade",
      "sintetizar conexoes entre mudanca politica e mudanca produtiva na modernidade"
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
