import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";

const blocos = [
  {
    subtopico: "Imperialismo e Primeira Guerra Mundial",
    habilidade: "identificar-processos-e-conflitos-centrais-da-historia-contemporanea",
    tags: ["historia-contemporanea", "primeira-guerra"],
    fatos: [
      {
        lead: "a expansão das potencias europeias sobre África e Asia no fim do seculo XIX",
        answer: "o imperialismo",
        why: "esse processo intensificou disputas territoriais e econômicas"
      },
      {
        lead: "a rivalidade entre grandes potencias por colonias, mercados e influencia",
        answer: "um fator da Primeira Guerra Mundial",
        why: "as tensoes internacionais cresceram antes de 1914"
      },
      {
        lead: "o assassinato do arquiduque Francisco Ferdinando em Sarajevo",
        answer: "o estopim da Primeira Guerra",
        why: "o atentado desencadeou a ativacao de aliancas militares"
      },
      {
        lead: "o tipo de combate marcado por linhas fortificadas e poucos avancos territoriais",
        answer: "a guerra de trincheiras",
        why: "ela simbolizou a brutalidade do conflito no front ocidental"
      },
      {
        lead: "o tratado que impos duras penalidades a Alemanha após 1918",
        answer: "o Tratado de Versalhes",
        why: "ele redesenhou a Europa e alimentou novas tensoes"
      }
    ]
  },
  {
    subtopico: "Revolução Russa e socialismo",
    habilidade: "analisar-guerras-mundiais-revolucoes-e-totalitarismos-do-seculo-xx",
    tags: ["historia-contemporanea", "revolucao-russa"],
    fatos: [
      {
        lead: "a crise do regime autocratico russo no inicio do seculo XX",
        answer: "o enfraquecimento do czarismo",
        why: "a insatisfacao social e política abriu caminho para a revolução"
      },
      {
        lead: "o grupo liderado por Lenin que defendeu revolução socialista imediata",
        answer: "os bolcheviques",
        why: "eles assumiram o poder em outubro de 1917"
      },
      {
        lead: "o lema paz, terra e pao",
        answer: "uma sintese das demandas revolucionarias russas",
        why: "o programa respondia a guerra, fome e desigualdade agraria"
      },
      {
        lead: "a tentativa de organizar uma economia é um Estado sob controle socialista",
        answer: "a experiência sovietica",
        why: "ela inaugurou novo modelo político no seculo XX"
      },
      {
        lead: "a guerra interna entre vermelhos e brancos após 1917",
        answer: "a Guerra Civil Russa",
        why: "o conflito definiu os rumos iniciais do novo regime"
      }
    ]
  },
  {
    subtopico: "Crise de 1929 e totalitarismos",
    habilidade: "analisar-guerras-mundiais-revolucoes-e-totalitarismos-do-seculo-xx",
    tags: ["historia-contemporanea", "crise-de-1929"],
    fatos: [
      {
        lead: "a quebra da Bolsa de Nova York em 1929",
        answer: "o marco da Grande Depressao",
        why: "ela desencadeou crise econômica internacional"
      },
      {
        lead: "a combinacao de especulacao financeira e superproducao",
        answer: "uma causa da crise de 1929",
        why: "o sistema capitalista entrou em forte desequilibrio"
      },
      {
        lead: "o programa intervencionista adotado nos Estados Unidos para enfrentar a depressao",
        answer: "o New Deal",
        why: "ele ampliou a ação do Estado na economia"
      },
      {
        lead: "o regime de partido unico e culto ao lider na Italia",
        answer: "o fascismo",
        why: "ele se tornou modelo de autoritarismo nacionalista"
      },
      {
        lead: "o regime racista e expansionista liderado por Hitler na Alemanha",
        answer: "o nazismo",
        why: "ele articulou totalitarismo, antisemitismo e militarismo"
      }
    ]
  },
  {
    subtopico: "Segunda Guerra Mundial",
    habilidade: "analisar-guerras-mundiais-revolucoes-e-totalitarismos-do-seculo-xx",
    tags: ["historia-contemporanea", "segunda-guerra"],
    fatos: [
      {
        lead: "a alianca formada por Alemanha, Italia e Japao",
        answer: "o Eixo",
        why: "esses paises lideraram o bloco agressor no conflito"
      },
      {
        lead: "a invasao da Polonia em 1939 pela Alemanha",
        answer: "o inicio da Segunda Guerra Mundial",
        why: "o ataque levou a declaracao de guerra das potencias ocidentais"
      },
      {
        lead: "o conjunto de paises que combateu o Eixo",
        answer: "os Aliados",
        why: "eles reuniram diferentes potencias contra o expansionismo totalitario"
      },
      {
        lead: "o desembarque anglo-americano na Normandia em 1944",
        answer: "o Dia D",
        why: "a operacao foi decisiva para a derrota alema no Ocidente"
      },
      {
        lead: "o uso de bombas atomicas pelos Estados Unidos contra o Japao",
        answer: "o desfecho dramatico da guerra no Pacifico",
        why: "Hiroshima e Nagasaki aceleraram a rendicao japonesa"
      }
    ]
  },
  {
    subtopico: "Holocausto e reorganizacao do pos-guerra",
    habilidade: "analisar-guerras-mundiais-revolucoes-e-totalitarismos-do-seculo-xx",
    tags: ["historia-contemporanea", "pos-guerra"],
    fatos: [
      {
        lead: "o genocidio sistematico de judeus e outros grupos pelo nazismo",
        answer: "o Holocausto",
        why: "ele simboliza a violencia extrema do racismo de Estado"
      },
      {
        lead: "os julgamentos de lideres nazistas após a guerra",
        answer: "os Julgamentos de Nuremberg",
        why: "eles estabeleceram referencias juridicas internacionais para crimes de guerra"
      },
      {
        lead: "a organizacao criada em 1945 para promover cooperacao internacional",
        answer: "a ONU",
        why: "ela se tornou instituicao central da ordem do pos-guerra"
      },
      {
        lead: "a divisao do mundo em duas grandes areas de influencia após 1945",
        answer: "a reorganizacao bipolar do pos-guerra",
        why: "ela preparou o terreno para a Guerra Fria"
      },
      {
        lead: "a criacao do Estado de Israel em 1948",
        answer: "um desdobramento importante do pos-guerra",
        why: "o evento alterou fortemente a geopolitica do Oriente Medio"
      }
    ]
  },
  {
    subtopico: "Guerra Fria e mundo bipolar",
    habilidade: "relacionar-guerra-fria-descolonizacao-e-reorganizacao-geopolitica-mundial",
    tags: ["historia-contemporanea", "guerra-fria"],
    fatos: [
      {
        lead: "a disputa global entre Estados Unidos e Uniao Sovietica sem confronto direto total",
        answer: "a Guerra Fria",
        why: "o conflito articulou ideologia, poder militar e influencia mundial"
      },
      {
        lead: "a existencia de dois blocos político-ideologicos rivais após 1945",
        answer: "o mundo bipolar",
        why: "capitalismo e socialismo organizaram a ordem internacional"
      },
      {
        lead: "o programa norte-americano de ajuda econômica para reconstruir a Europa",
        answer: "o Plano Marshall",
        why: "ele buscou conter a expansão da influencia sovietica"
      },
      {
        lead: "as aliancas militares organizadas por EUA e URSS",
        answer: "a OTAN é o Pacto de Varsovia",
        why: "elas institucionalizaram a disputa dos blocos"
      },
      {
        lead: "a tensao nuclear evidenciada em episodios como Cuba e Berlim",
        answer: "a corrida armamentista da Guerra Fria",
        why: "o equilíbrio do terror marcou o período"
      }
    ]
  },
  {
    subtopico: "Descolonizacao afro-asiatica",
    habilidade: "relacionar-guerra-fria-descolonizacao-e-reorganizacao-geopolitica-mundial",
    tags: ["historia-contemporanea", "descolonizacao"],
    fatos: [
      {
        lead: "o processo de independencia de colonias na África e na Asia após 1945",
        answer: "a descolonizacao afro-asiatica",
        why: "ele redesenhou o mapa político mundial"
      },
      {
        lead: "a independencia da India em 1947",
        answer: "um marco da descolonizacao asiatica",
        why: "ela abalou a legitimidade dos imperios europeus"
      },
      {
        lead: "as lutas anticoloniais travadas com violencia em varios territorios",
        answer: "um caminho frequente para a independencia",
        why: "metropoles resistiram a perder dominios estrategicos"
      },
      {
        lead: "a reuniao de paises recem-independentes que defendiam autonomia diante dos blocos",
        answer: "a Conferencia de Bandung",
        why: "ela foi referencia para o não alinhamento"
      },
      {
        lead: "a permanencia de dependência econômica após a independencia formal",
        answer: "um desafio do pos-colonialismo",
        why: "muitos paises seguiram subordinados a interesses externos"
      }
    ]
  },
  {
    subtopico: "Queda do socialismo real",
    habilidade: "avaliar-globalizacao-queda-do-socialismo-real-e-conflitos-recentes",
    tags: ["historia-contemporanea", "socialismo-real"],
    fatos: [
      {
        lead: "as reformas propostas por Mikhail Gorbachev na URSS",
        answer: "a glasnost é a perestroika",
        why: "elas buscaram abrir e reestruturar o sistema sovietico"
      },
      {
        lead: "o derrubamento da barreira que dividia a Alemanha em 1989",
        answer: "a queda do Muro de Berlim",
        why: "o episodio simbolizou a crise do bloco socialista"
      },
      {
        lead: "o fim da Uniao Sovietica em 1991",
        answer: "a dissolucao da URSS",
        why: "ela encerrou uma das grandes potencias do seculo XX"
      },
      {
        lead: "o esgotamento economico e político dos regimes do Leste Europeu",
        answer: "uma causa da queda do socialismo real",
        why: "o modelo enfrentou dificuldades internas crescentes"
      },
      {
        lead: "o desaparecimento da ordem internacional organizada por dois blocos fixos",
        answer: "o fim da bipolaridade",
        why: "a política mundial entrou em nova fase após 1991"
      }
    ]
  },
  {
    subtopico: "Globalizacao e nova ordem mundial",
    habilidade: "avaliar-globalizacao-queda-do-socialismo-real-e-conflitos-recentes",
    tags: ["historia-contemporanea", "globalizacao"],
    fatos: [
      {
        lead: "a intensificacao da circulação de capitais, mercadorias, informacoes e pessoas",
        answer: "a globalizacao",
        why: "esse processo ampliou interdependencias entre sociedades"
      },
      {
        lead: "a defesa de privatizacoes e menor intervencao estatal na economia",
        answer: "o neoliberalismo",
        why: "essa orientacao ganhou forca a partir do fim do seculo XX"
      },
      {
        lead: "a formação de agrupamentos economicos entre paises",
        answer: "os blocos economicos",
        why: "eles buscam ampliar mercados e coordenar interesses regionais"
      },
      {
        lead: "o papel das tecnologias digitais na economia e na comunicacao global",
        answer: "a revolução informacional",
        why: "ela acelerou o tempo é a escala das conexoes mundiais"
      },
      {
        lead: "a redistribuicao relativa de poder em um mundo sem ordem bipolar fixa",
        answer: "a nova ordem mundial",
        why: "o sistema internacional tornou-se mais complexo e desigual"
      }
    ]
  },
  {
    subtopico: "Conflitos e desafios do mundo contemporaneo",
    habilidade: "sintetizar-transformacoes-politicas-sociais-e-economicas-do-mundo-contemporaneo",
    tags: ["historia-contemporanea", "desafios-contemporaneos"],
    fatos: [
      {
        lead: "os atentados e guerras associados a grupos extremistas no seculo XXI",
        answer: "o terrorismo internacional",
        why: "ele se tornou um dos temas centrais da seguranca global"
      },
      {
        lead: "o agravamento do aquecimento global e da degradacao ambiental",
        answer: "a crise climatica",
        why: "ela desafia governos, economias e sociedades em escala mundial"
      },
      {
        lead: "o deslocamento forcado de populacoes por guerras, miseria e perseguicoes",
        answer: "a crise dos refugiados",
        why: "o fenomeno expoe desigualdades e tensoes humanitarias"
      },
      {
        lead: "a permanencia de fortes disparidades entre paises e grupos sociais",
        answer: "a desigualdade global",
        why: "a integracao mundial não eliminou hierarquias econômicas e sociais"
      },
      {
        lead: "os conflitos regionais que combinam recursos, identidades e interesses geopoliticos",
        answer: "um traco persistente do mundo contemporaneo",
        why: "a instabilidade internacional continua produzindo guerras e crises"
      }
    ]
  }
];

const questoes = buildPlannedQuestions({
  prefix: "hc",
  serie: [3],
  materia: "História",
  topico: "História Contemporanea",
  blocos
});

export const historiaContemporanea = {
  id: "historia_historia_contemporanea",
  materia: "História",
  serie: [3],
  topico: "História Contemporanea",
  metadados: {
    disciplinaId: "historia",
    base: "ESCOLAR",
    eixo: "História",
    frente: "Mundo contemporaneo",
    searchAliases: [
      "história contemporanea",
      "guerra fria",
      "segunda guerra mundial",
      "globalizacao",
      "descolonizacao"
    ],
    subtopicosBase: [
      "Imperialismo e Primeira Guerra Mundial",
      "Revolução Russa e socialismo",
      "Crise de 1929 e totalitarismos",
      "Segunda Guerra Mundial",
      "Holocausto e reorganizacao do pos-guerra",
      "Guerra Fria e mundo bipolar",
      "Descolonizacao afro-asiatica",
      "Queda do socialismo real",
      "Globalizacao e nova ordem mundial",
      "Conflitos e desafios do mundo contemporaneo"
    ],
    habilidadesBase: [
      "identificar processos e conflitos centrais da história contemporanea",
      "analisar guerras mundiais, revoluções e totalitarismos do seculo XX",
      "relacionar Guerra Fria, descolonizacao e reorganizacao geopolitica mundial",
      "avaliar globalizacao, queda do socialismo real e conflitos recentes",
      "sintetizar transformações políticas, sociais e econômicas do mundo contemporaneo"
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
