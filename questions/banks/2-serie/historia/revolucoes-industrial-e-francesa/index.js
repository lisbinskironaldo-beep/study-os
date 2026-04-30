import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";

const blocos = [
  {
    subtopico: "Antigo Regime e Iluminismo",
    habilidade: "identificar-causas-e-contexto-das-revolucoes-industrial-e-francesa",
    tags: ["revolucoes", "antigo-regime"],
    fatos: [
      {
        lead: "a ordem política e social europeia anterior a Revolução Francesa",
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
        why: "suas ideias influenciaram projetos políticos modernos"
      },
      {
        lead: "a defesa da separacao entre os poderes do Estado",
        answer: "uma proposta de Montesquieu",
        why: "ela buscava limitar a concentracao de poder"
      },
      {
        lead: "a ideia de soberania popular e contrato social",
        answer: "uma contribuicao de Rousseau",
        why: "ela influenciou fortemente a cultura política revolucionaria"
      }
    ]
  },
  {
    subtopico: "Crise do Antigo Regime na França",
    habilidade: "analisar-o-iluminismo-o-antigo-regime-e-as-transformacoes-politicas-de-1789",
    tags: ["revolucoes", "crise-francesa"],
    fatos: [
      {
        lead: "o peso desigual dos impostos sobre o terceiro estado",
        answer: "um fator da crise do Antigo Regime na França",
        why: "a maioria social sustentava financeiramente os privilegios de poucos"
      },
      {
        lead: "o endividamento da monarquia francesa no seculo XVIII",
        answer: "um elemento central da crise política",
        why: "os gastos do Estado agravaram a instabilidade financeira"
      },
      {
        lead: "a sucessao de colheitas ruins e aumento no preco do pao",
        answer: "um fator de explosao social",
        why: "a crise econômica afetou fortemente a população urbana e rural"
      },
      {
        lead: "a convocacao dos Estados Gerais em 1789",
        answer: "um sinal do enfraquecimento da monarquia",
        why: "o rei precisou recorrer a uma instituicao representativa extraordinaria"
      },
      {
        lead: "a contestacao dos privilegios de clero e nobreza",
        answer: "o eixo social da crise francesa",
        why: "o terceiro estado exigia igualdade política e fiscal"
      }
    ]
  },
  {
    subtopico: "Revolução Francesa: 1789 e fases iniciais",
    habilidade: "analisar-o-iluminismo-o-antigo-regime-e-as-transformacoes-politicas-de-1789",
    tags: ["revolucoes", "revolucao-francesa"],
    fatos: [
      {
        lead: "a declaracao do terceiro estado como Assembleia Nacional",
        answer: "um passo decisivo na ruptura revolucionaria",
        why: "os representantes passaram a reivindicar soberania política"
      },
      {
        lead: "a tomada da Bastilha em 14 de julho de 1789",
        answer: "um simbolo do inicio da Revolução Francesa",
        why: "o episodio representou ataque ao despotismo real"
      },
      {
        lead: "o documento que afirmou direitos naturais e igualdade juridica",
        answer: "a Declaracao dos Direitos do Homem e do Cidadao",
        why: "ela sintetizou principios fundamentais da revolução"
      },
      {
        lead: "a abolicao dos privilegios feudais em 1789",
        answer: "uma mudanca social importante",
        why: "a revolução desmontou bases juridicas da sociedade estamental"
      },
      {
        lead: "a instauracao da monarquia constitucional nos primeiros anos revolucionarios",
        answer: "uma fase moderada da revolução",
        why: "ainda se buscava limitar, e não eliminar, a monarquia"
      }
    ]
  },
  {
    subtopico: "Revolução Francesa: jacobinos, terror e diretorio",
    habilidade: "analisar-o-iluminismo-o-antigo-regime-e-as-transformacoes-politicas-de-1789",
    tags: ["revolucoes", "jacobinos"],
    fatos: [
      {
        lead: "o grupo revolucionario mais radical associado a defesa da república",
        answer: "os jacobinos",
        why: "eles lideraram a fase mais intensa da revolução"
      },
      {
        lead: "o período de perseguicoes e execucoes para defender a revolução",
        answer: "o Terror",
        why: "o governo jacobino usou violencia política contra inimigos reais ou supostos"
      },
      {
        lead: "a liderança simbolica do jacobinismo",
        answer: "Robespierre",
        why: "seu nome ficou ligado ao comite e ao Terror"
      },
      {
        lead: "a reacao conservadora que derrubou os jacobinos",
        answer: "a Reacao Termidoriana",
        why: "ela encerrou a fase radical da revolução"
      },
      {
        lead: "o governo mais moderado e instavel que antecedeu Napoleao",
        answer: "o Diretorio",
        why: "essa fase preparou o caminho para nova concentracao de poder"
      }
    ]
  },
  {
    subtopico: "Legados políticos da Revolução Francesa",
    habilidade: "avaliar-os-legados-das-revolucoes-para-politica-e-sociedade",
    tags: ["revolucoes", "legados-politicos"],
    fatos: [
      {
        lead: "a afirmacao de liberdade e igualdade juridica como principios universais",
        answer: "um legado da Revolução Francesa",
        why: "esses ideais influenciaram varias experiencias políticas posteriores"
      },
      {
        lead: "a defesa da soberania da nacao em lugar do direito divino",
        answer: "uma mudanca política fundamental",
        why: "a legitimidade do poder passou a ser associada ao corpo político"
      },
      {
        lead: "a difusao do principio de cidadania",
        answer: "um legado moderno da revolução",
        why: "a participacao política ganhou novo sentido historico"
      },
      {
        lead: "o enfraquecimento dos privilegios de nascimento",
        answer: "uma heranca da critica revolucionaria ao Antigo Regime",
        why: "a revolução questionou hierarquias estamentais tradicionais"
      },
      {
        lead: "a repercussao da revolução em outras partes do mundo",
        answer: "a expansão de ideias liberais e nacionais",
        why: "o processo frances inspirou movimentos e debates internacionais"
      }
    ]
  },
  {
    subtopico: "Revolução Industrial: origens na Inglaterra",
    habilidade: "identificar-causas-e-contexto-das-revolucoes-industrial-e-francesa",
    tags: ["revolucoes", "revolucao-industrial"],
    fatos: [
      {
        lead: "o pais em que a industrializacao se iniciou primeiro",
        answer: "a Inglaterra",
        why: "ela reuniu condições favoraveis para pioneirismo industrial"
      },
      {
        lead: "a disponibilidade de capitais acumulados com comercio e colonias",
        answer: "um fator da Revolução Industrial",
        why: "os investimentos ajudaram a financiar máquinas e fabricas"
      },
      {
        lead: "a existencia de carvao mineral e ferro em larga escala",
        answer: "uma base material da industrializacao inglesa",
        why: "esses recursos foram essenciais para energia e metalurgia"
      },
      {
        lead: "a ampliacao da produção agricola e da oferta de trabalhadores",
        answer: "um efeito das transformações no campo inglês",
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
    subtopico: "Máquinas, sistema fabril e produção industrial",
    habilidade: "relacionar-industrializacao-sistema-fabril-e-questao-operaria-ao-capitalismo",
    tags: ["revolucoes", "sistema-fabril"],
    fatos: [
      {
        lead: "a substituicao do trabalho artesanal por produção concentrada em unidades maiores",
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
        answer: "uma transformação central da industria textil",
        why: "o setor textil esteve na vanguarda da industrializacao"
      },
      {
        lead: "a organizacao do trabalho com horarios rigorosos e repeticao de tarefas",
        answer: "uma caracteristica do sistema fabril",
        why: "a disciplina do tempo tornou-se essencial a produção"
      },
      {
        lead: "o aumento da produção em escala e da produtividade",
        answer: "um efeito da mecanizacao",
        why: "as máquinas permitiram produzir mais em menos tempo"
      }
    ]
  },
  {
    subtopico: "Questao operaria e transformações sociais",
    habilidade: "relacionar-industrializacao-sistema-fabril-e-questao-operaria-ao-capitalismo",
    tags: ["revolucoes", "questao-operaria"],
    fatos: [
      {
        lead: "o conjunto de problemas ligados as condições de vida e trabalho dos trabalhadores industriais",
        answer: "a questao operaria",
        why: "a industrializacao produziu novas desigualdades e conflitos sociais"
      },
      {
        lead: "as jornadas longas, salarios baixos e trabalho infantil",
        answer: "marcas da exploracao operaria inicial",
        why: "o capitalismo industrial se expandiu com pouca protecao social"
      },
      {
        lead: "a destruicao de máquinas por trabalhadores insatisfeitos",
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
        answer: "uma transformação urbana da industrializacao",
        why: "a concentracao fabril alterou profundamente a vida urbana"
      }
    ]
  },
  {
    subtopico: "Capitalismo industrial e expansão econômica",
    habilidade: "relacionar-industrializacao-sistema-fabril-e-questao-operaria-ao-capitalismo",
    tags: ["revolucoes", "capitalismo-industrial"],
    fatos: [
      {
        lead: "a forma de organizacao econômica baseada em propriedade privada e lucro",
        answer: "o capitalismo industrial",
        why: "ele se consolidou com a expansão das fabricas"
      },
      {
        lead: "a aplicacao de capitais em máquinas, transportes e manufaturas",
        answer: "um motor da expansão industrial",
        why: "investimentos ampliaram capacidade produtiva e mercados"
      },
      {
        lead: "a busca por materias-primas e consumidores para bens industrializados",
        answer: "uma tendencia de expansão econômica do capitalismo",
        why: "a produção crescente exigia novos circuitos de abastecimento e venda"
      },
      {
        lead: "o aumento da interligacao entre bancos, comercio e industria",
        answer: "uma caracteristica do capitalismo em amadurecimento",
        why: "setores economicos passaram a se articular mais fortemente"
      },
      {
        lead: "a multiplicacao de ferrovias, navios e meios de circulação",
        answer: "um fator de aceleracao da economia industrial",
        why: "transportes mais rapidos integraram mercados e mercadorias"
      }
    ]
  },
  {
    subtopico: "Impactos políticos e sociais das revoluções",
    habilidade: "sintetizar-conexoes-entre-mudanca-politica-e-mudanca-produtiva-na-modernidade",
    tags: ["revolucoes", "impactos-historicos"],
    fatos: [
      {
        lead: "a substituicao de privilegios estamentais por principios de cidadania e direitos",
        answer: "um impacto político da Revolução Francesa",
        why: "a legitimidade do poder passou a ser redefinida"
      },
      {
        lead: "a passagem do artesanato para a grande industria mecanizada",
        answer: "um impacto economico da Revolução Industrial",
        why: "a produção foi reorganizada em novas bases técnicas e sociais"
      },
      {
        lead: "a formação de burguesia industrial e proletariado urbano",
        answer: "uma nova estrutura social da modernidade",
        why: "as revoluções alteraram profundamente as relações de classe"
      },
      {
        lead: "a conexao entre ideias políticas de igualdade e mudancas econômicas produtivas",
        answer: "uma marca do mundo contemporaneo nascente",
        why: "os dois processos reconfiguraram Estado, sociedade e trabalho"
      },
      {
        lead: "a difusao internacional de liberalismo, nacionalismo e industrializacao",
        answer: "um legado amplo das revoluções modernas",
        why: "essas transformações moldaram os seculos XIX e XX"
      }
    ]
  }
];

const questoes = buildPlannedQuestions({
  prefix: "rif",
  serie: [2],
  materia: "História",
  topico: "Revoluções Industrial e Francesa",
  blocos
});

export const revolucoesIndustrialEFrancesa = {
  id: "historia_revolucoes_industrial_e_francesa",
  materia: "História",
  serie: [2],
  topico: "Revoluções Industrial e Francesa",
  metadados: {
    disciplinaId: "historia",
    base: "ESCOLAR",
    eixo: "História",
    frente: "Revoluções do mundo moderno",
    searchAliases: [
      "revolução industrial",
      "revolução francesa",
      "iluminismo",
      "antigo regime",
      "capitalismo industrial"
    ],
    subtopicosBase: [
      "Antigo Regime e Iluminismo",
      "Crise do Antigo Regime na França",
      "Revolução Francesa: 1789 e fases iniciais",
      "Revolução Francesa: jacobinos, terror e diretorio",
      "Legados políticos da Revolução Francesa",
      "Revolução Industrial: origens na Inglaterra",
      "Máquinas, sistema fabril e produção industrial",
      "Questao operaria e transformações sociais",
      "Capitalismo industrial e expansão econômica",
      "Impactos políticos e sociais das revoluções"
    ],
    habilidadesBase: [
      "identificar causas e contexto das revoluções Industrial e Francesa",
      "analisar o Iluminismo, o Antigo Regime e as transformações políticas de 1789",
      "relacionar industrializacao, sistema fabril e questao operaria ao capitalismo",
      "avaliar os legados das revoluções para política, economia e sociedade",
      "sintetizar conexoes entre mudanca política e mudanca produtiva na modernidade"
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
