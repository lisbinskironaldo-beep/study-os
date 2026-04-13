import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";

const blocos = [
  {
    subtopico: "Introducao a Antiguidade Oriental e Classica",
    habilidade: "identificar-caracteristicas-das-civilizacoes-antigas",
    tags: ["antiguidade", "mundo-antigo"],
    fatos: [
      {
        lead: "o conjunto de sociedades organizadas junto a grandes rios no Oriente antigo",
        answer: "as civilizacoes hidraulicas",
        why: "dependiam do controle das aguas e da agricultura irrigada"
      },
      {
        lead: "a forma de explicar o mundo por meio de narrativas sagradas e simbolicas",
        answer: "o pensamento mitico",
        why: "precedia a explicacao filosofica e cientifica"
      },
      {
        lead: "o espaco do Mediterraneo marcado pela circulacao de mercadorias, ideias e exercitos",
        answer: "um eixo de integracao entre povos antigos",
        why: "favoreceu trocas culturais e conflitos"
      },
      {
        lead: "a divisao tradicional entre Antiguidade Oriental e Classica",
        answer: "uma classificacao historica didatica",
        why: "agrupa experiencias antigas com base em caracteristicas dominantes"
      },
      {
        lead: "a producao de registros escritos por Estados e elites",
        answer: "uma marca do surgimento das primeiras civilizacoes",
        why: "permitiu administrar tributos, leis e memoria politica"
      }
    ]
  },
  {
    subtopico: "Egito: sociedade e poder politico",
    habilidade: "comparar-formas-de-organizacao-politica-e-social-no-egito-grecia-e-roma",
    tags: ["egito", "politica"],
    fatos: [
      {
        lead: "a autoridade suprema que concentrava poder politico e religioso no Egito",
        answer: "o farao",
        why: "era visto como governante e figura sagrada"
      },
      {
        lead: "a camada social encarregada de registrar impostos e administrar o Estado",
        answer: "os escribas",
        why: "dominavam a escrita e serviam ao governo"
      },
      {
        lead: "a organizacao do Egito em torno das cheias do rio principal",
        answer: "a dependencia do rio Nilo",
        why: "a agricultura e a vida social seguiam seu ritmo"
      },
      {
        lead: "a forma de governo marcada por centralizacao e obras publicas",
        answer: "a monarquia teocratica",
        why: "o poder era legitimado religiosamente"
      },
      {
        lead: "o grupo que trabalhava majoritariamente nas atividades agricolas egipcias",
        answer: "os camponeses",
        why: "sustentavam a base economica do reino"
      }
    ]
  },
  {
    subtopico: "Egito: religiosidade e cultura",
    habilidade: "analisar-religiosidade-cultura-e-cidadania-no-mundo-antigo",
    tags: ["egito", "cultura"],
    fatos: [
      {
        lead: "a crenca de que a vida continuava apos a morte",
        answer: "a ideia de imortalidade da alma",
        why: "fundamentou ritos funerarios e tumbas"
      },
      {
        lead: "o processo de preservacao de corpos para o culto funerario",
        answer: "a mumificacao",
        why: "buscava conservar o corpo para a vida apos a morte"
      },
      {
        lead: "a escrita usada em templos e monumentos egipcios",
        answer: "os hieroglifos",
        why: "associavam imagem e som na escrita sagrada"
      },
      {
        lead: "as construcoes funerarias monumentais dos faraos",
        answer: "as piramides",
        why: "expressavam poder politico e crenca religiosa"
      },
      {
        lead: "a grande quantidade de deuses ligados a forcas da natureza e da vida",
        answer: "o politeismo",
        why: "marcava a religiosidade egipcia"
      }
    ]
  },
  {
    subtopico: "Grecia: periodo arcaico e polis",
    habilidade: "identificar-caracteristicas-das-civilizacoes-antigas",
    tags: ["grecia", "polis"],
    fatos: [
      {
        lead: "a unidade politica tipica da Grecia antiga",
        answer: "a polis",
        why: "cada cidade-estado tinha leis e autonomia proprias"
      },
      {
        lead: "o processo de expansao grega pelo Mediterraneo",
        answer: "a colonizacao",
        why: "criou novas cidades e ampliou trocas comerciais"
      },
      {
        lead: "o espaco central de debates e circulacao na cidade grega",
        answer: "a agora",
        why: "funcionava como centro politico e comercial"
      },
      {
        lead: "o pertencimento politico restrito a determinados homens livres",
        answer: "a cidadania limitada",
        why: "nao incluia mulheres, escravizados e estrangeiros"
      },
      {
        lead: "o modo de vida comum entre cidades gregas apesar da autonomia politica",
        answer: "a identidade helenica",
        why: "era reforcada por lingua, religiao e costumes"
      }
    ]
  },
  {
    subtopico: "Grecia: democracia ateniense e Esparta",
    habilidade: "comparar-formas-de-organizacao-politica-e-social-no-egito-grecia-e-roma",
    tags: ["grecia", "democracia"],
    fatos: [
      {
        lead: "a participacao direta dos cidadaos nas decisoes politicas de Atenas",
        answer: "a democracia direta",
        why: "as deliberacoes eram feitas pelos proprios cidadaos"
      },
      {
        lead: "a cidade grega marcada por educacao militar e disciplina coletiva",
        answer: "Esparta",
        why: "organizava a sociedade em torno da guerra"
      },
      {
        lead: "o orgao ateniense em que cidadaos discutiam e votavam",
        answer: "a Assembleia",
        why: "era a base da participacao politica"
      },
      {
        lead: "o grupo social que realizava trabalhos forcados em Esparta",
        answer: "os hilotas",
        why: "sustentavam economicamente os espartanos"
      },
      {
        lead: "o limite fundamental da democracia ateniense",
        answer: "a exclusao da maior parte da populacao",
        why: "somente uma minoria era considerada cidada"
      }
    ]
  },
  {
    subtopico: "Grecia: guerras e expansionismo",
    habilidade: "relacionar-guerras-expansionismo-e-administracao-imperial-aos-processos-historicos",
    tags: ["grecia", "guerras"],
    fatos: [
      {
        lead: "os conflitos entre gregos e persas no seculo V a.C.",
        answer: "as Guerras Medicas",
        why: "marcaram a resistencia das polis contra o Imperio Persa"
      },
      {
        lead: "a liga liderada por Atenas apos as guerras contra os persas",
        answer: "a Liga de Delos",
        why: "fortaleceu a influencia ateniense"
      },
      {
        lead: "o conflito entre Atenas e Esparta que enfraqueceu a Grecia",
        answer: "a Guerra do Peloponeso",
        why: "desgastou as principais polis gregas"
      },
      {
        lead: "o rei da Macedonia que unificou os gregos e iniciou a expansao oriental",
        answer: "Alexandre Magno",
        why: "ampliou o dominio macedonico sobre vastos territorios"
      },
      {
        lead: "a fusao cultural promovida pelas conquistas macedonicas",
        answer: "o helenismo",
        why: "misturou elementos gregos e orientais"
      }
    ]
  },
  {
    subtopico: "Roma: monarquia e republica",
    habilidade: "comparar-formas-de-organizacao-politica-e-social-no-egito-grecia-e-roma",
    tags: ["roma", "republica-romana"],
    fatos: [
      {
        lead: "o sistema politico romano baseado na participacao de magistrados e do Senado",
        answer: "a Republica",
        why: "substituiu a monarquia e fortaleceu a aristocracia"
      },
      {
        lead: "o grupo aristocratico que dominava a politica no inicio da Republica romana",
        answer: "os patricios",
        why: "controlavam terras e cargos"
      },
      {
        lead: "o grupo que lutou por direitos politicos em Roma",
        answer: "os plebeus",
        why: "pressionaram por ampliacao de participacao e leis escritas"
      },
      {
        lead: "o conjunto de leis romanas gravadas em placas",
        answer: "a Lei das Doze Tabuas",
        why: "reduziu arbitrariedades juridicas dos patricios"
      },
      {
        lead: "a funcao do Senado na Republica romana",
        answer: "orientar a politica e influenciar as decisoes do Estado",
        why: "era o principal centro de poder aristocratico"
      }
    ]
  },
  {
    subtopico: "Roma: imperio e administracao",
    habilidade: "relacionar-guerras-expansionismo-e-administracao-imperial-aos-processos-historicos",
    tags: ["roma", "imperio-romano"],
    fatos: [
      {
        lead: "o periodo iniciado por Otavio Augusto",
        answer: "o Imperio Romano",
        why: "centralizou o poder nas maos do imperador"
      },
      {
        lead: "a fase de relativa estabilidade e prosperidade do imperio",
        answer: "a Pax Romana",
        why: "foi marcada por ordem interna e expansao comercial"
      },
      {
        lead: "a estrategia romana de integrar provincias por estradas, leis e impostos",
        answer: "a administracao imperial",
        why: "garantiu controle sobre territorios extensos"
      },
      {
        lead: "a extensao da cidadania a diversos povos submetidos",
        answer: "um instrumento de integracao politica",
        why: "ampliava lealdades ao dominio romano"
      },
      {
        lead: "a divisao do imperio entre parte ocidental e oriental",
        answer: "uma tentativa de facilitar o governo",
        why: "buscava administrar melhor a crise e a extensao territorial"
      }
    ]
  },
  {
    subtopico: "Roma: sociedade, cultura e direito",
    habilidade: "analisar-religiosidade-cultura-e-cidadania-no-mundo-antigo",
    tags: ["roma", "direito-romano"],
    fatos: [
      {
        lead: "o principio juridico que influenciou varias sociedades ocidentais",
        answer: "o direito romano",
        why: "organizou normas, contratos e cidadania"
      },
      {
        lead: "o grande espaco publico de debates e atividades urbanas em Roma",
        answer: "o forum",
        why: "concentrava vida politica, juridica e comercial"
      },
      {
        lead: "o grupo social sem liberdade juridica na sociedade romana",
        answer: "os escravizados",
        why: "eram usados em trabalhos domesticos, agricolas e urbanos"
      },
      {
        lead: "a difusao do latim pelo dominio romano",
        answer: "um legado cultural de longa duracao",
        why: "influenciou varias linguas europeias"
      },
      {
        lead: "a incorporacao de costumes e deuses de outros povos pelo imperio",
        answer: "uma marca da flexibilidade cultural romana",
        why: "Roma absorvia praticas de territorios dominados"
      }
    ]
  },
  {
    subtopico: "Crise do mundo antigo e legado classico",
    habilidade: "avaliar-permanencias-e-legados-da-antiguidade-para-a-historia-ocidental",
    tags: ["antiguidade", "legado-classico"],
    fatos: [
      {
        lead: "a entrada de povos germanicos em territorios romanos",
        answer: "as invasoes barbaras",
        why: "aceleraram a crise do Imperio Romano do Ocidente"
      },
      {
        lead: "o enfraquecimento do escravismo, das cidades e do comercio ocidental",
        answer: "uma transformacao da ordem antiga",
        why: "contribuiu para a passagem ao mundo medieval"
      },
      {
        lead: "a legalizacao do cristianismo no Imperio Romano",
        answer: "uma mudanca religiosa decisiva",
        why: "alterou a relacao entre Estado e fe"
      },
      {
        lead: "a permanencia de ideias gregas e romanas na cultura ocidental",
        answer: "o legado classico",
        why: "influenciou politica, arte, filosofia e direito"
      },
      {
        lead: "a queda de Roma em 476",
        answer: "um marco simbolico do fim da Antiguidade ocidental",
        why: "e usada didaticamente para indicar transicao historica"
      }
    ]
  }
];

const questoes = buildPlannedQuestions({
  prefix: "agr",
  serie: [1],
  materia: "Historia",
  topico: "Antiguidade Egito Grecia Roma",
  blocos
});

export const antiguidadeEgitoGreciaRoma = {
  id: "historia_antiguidade_egito_grecia_roma",
  materia: "Historia",
  serie: [1],
  topico: "Antiguidade Egito Grecia Roma",
  metadados: {
    disciplinaId: "historia",
    base: "ESCOLAR",
    eixo: "Historia",
    frente: "Mundo antigo e civilizacoes classicas",
    searchAliases: [
      "antiguidade",
      "egito antigo",
      "grecia antiga",
      "roma antiga",
      "civilizacoes classicas",
      "mundo antigo"
    ],
    subtopicosBase: [
      "Introducao a Antiguidade Oriental e Classica",
      "Egito: sociedade e poder politico",
      "Egito: religiosidade e cultura",
      "Grecia: periodo arcaico e polis",
      "Grecia: democracia ateniense e Esparta",
      "Grecia: guerras e expansionismo",
      "Roma: monarquia e republica",
      "Roma: imperio e administracao",
      "Roma: sociedade, cultura e direito",
      "Crise do mundo antigo e legado classico"
    ],
    habilidadesBase: [
      "identificar caracteristicas das civilizacoes antigas",
      "comparar formas de organizacao politica e social no Egito, Grecia e Roma",
      "analisar religiosidade, cultura e cidadania no mundo antigo",
      "relacionar guerras, expansionismo e administracao imperial aos processos historicos",
      "avaliar permanencias e legados da Antiguidade para a historia ocidental"
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
