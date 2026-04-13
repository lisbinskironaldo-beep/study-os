import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  PHILOSOPHY_HUNDRED_MATRIX,
  PHILOSOPHY_HUNDRED_PLAN,
  PHILOSOPHY_STEM_BUILDERS
} from "../../../_shared/philosophyTopicPresets.js";

const blocos = [
  {
    subtopico: "Razao e progresso",
    habilidade:
      "identificar principios gerais do Iluminismo e sua valorizacao da razao",
    tags: ["iluminismo", "razao", "progresso"],
    fatos: [
      {
        lead: "o Iluminismo",
        answer: "o movimento intelectual que valorizou razao, critica e autonomia",
        why: "ele combateu obscurantismo, privilegios e dogmas"
      },
      {
        lead: "a razao iluminista",
        answer: "a confianca na capacidade humana de pensar criticamente e reformar a sociedade",
        why: "os iluministas viam a razao como instrumento de emancipacao"
      },
      {
        lead: "a ideia de progresso",
        answer: "a expectativa de aperfeicoamento da vida humana por conhecimento e reformas",
        why: "ela expressa otimismo caracteristico do periodo"
      },
      {
        lead: "a critica ao obscurantismo",
        answer: "a rejeicao de formas de autoridade que impedem livre uso da razao",
        why: "o Iluminismo atacou supersticoes e censuras"
      },
      {
        lead: "a autonomia intelectual",
        answer: "a capacidade de pensar por si mesmo sem tutela alheia",
        why: "esse ideal e sintetizado em varias formulacoes iluministas"
      }
    ]
  },
  {
    subtopico: "Enciclopedismo",
    habilidade:
      "compreender a difusao das ideias iluministas e o papel das enciclopedias",
    tags: ["enciclopedia", "diderot", "difusao do saber"],
    fatos: [
      {
        lead: "a Enciclopedia",
        answer: "o grande projeto de reunir e divulgar conhecimentos do tempo moderno",
        why: "ela expressa a confianca iluminista na instrucao e na razao"
      },
      {
        lead: "o enciclopedismo",
        answer: "o movimento de organizacao sistematica do saber para circulacao publica",
        why: "divulgar conhecimento era visto como ato emancipador"
      },
      {
        lead: "Diderot",
        answer: "um dos principais organizadores da Enciclopedia e pensador iluminista",
        why: "ele defendia circulacao critica do conhecimento"
      },
      {
        lead: "a divulgacao do saber",
        answer: "a ampliacao do acesso ao conhecimento para alem de circulos restritos",
        why: "isso enfraquece monopolios intelectuais e politicos"
      },
      {
        lead: "a organizacao racional do conhecimento",
        answer: "o esforco de classificar e disponibilizar saberes de forma sistematica",
        why: "essa organizacao traduz o espirito iluminista"
      }
    ]
  },
  {
    subtopico: "Montesquieu e a separacao dos poderes",
    habilidade:
      "relacionar o Iluminismo a propostas politicas modernas",
    tags: ["montesquieu", "separacao dos poderes", "politica"],
    fatos: [
      {
        lead: "Montesquieu",
        answer: "o pensador iluminista conhecido pela teoria da separacao dos poderes",
        why: "ele buscou limitar abusos do poder politico"
      },
      {
        lead: "a separacao dos poderes",
        answer: "a distribuicao das funcoes estatais entre instancias distintas",
        why: "executivo, legislativo e judiciario se controlariam mutuamente"
      },
      {
        lead: "o equilibrio institucional",
        answer: "a organizacao politica que impede concentracao excessiva de poder",
        why: "Montesquieu liga liberdade a freios e contrapesos"
      },
      {
        lead: "a critica ao absolutismo em Montesquieu",
        answer: "a rejeicao do poder centralizado sem limites legais",
        why: "o absolutismo comprometeria a liberdade politica"
      },
      {
        lead: "a liberdade politica em Montesquieu",
        answer: "a seguranca de nao estar submetido ao arbitrio de um unico poder",
        why: "ela depende de instituicoes equilibradas"
      }
    ]
  },
  {
    subtopico: "Voltaire e a tolerancia",
    habilidade:
      "relacionar o Iluminismo a criticas religiosas, politicas e culturais",
    tags: ["voltaire", "tolerancia", "liberdade de expressao"],
    fatos: [
      {
        lead: "Voltaire",
        answer: "o iluminista que se destacou pela defesa da tolerancia e da critica ao fanatismo",
        why: "sua obra combateu perseguicoes e arbitrariedades"
      },
      {
        lead: "a tolerancia em Voltaire",
        answer: "o respeito a diferencas de crenca e opiniao em uma sociedade plural",
        why: "ela e vista como antidoto contra violencia e intolerancia"
      },
      {
        lead: "a critica ao fanatismo",
        answer: "a denuncia das violencias praticadas em nome de verdades absolutizadas",
        why: "Voltaire associava fanatismo a injustica e opressao"
      },
      {
        lead: "a liberdade de expressao",
        answer: "o direito de manifestar ideias sem censura arbitraria",
        why: "ela e essencial ao debate racional e publico"
      },
      {
        lead: "a ironia voltairiana",
        answer: "o uso de satira e critica mordaz para atacar abusos e dogmas",
        why: "essa estrategia tornou seu pensamento amplamente influente"
      }
    ]
  },
  {
    subtopico: "Iluminismo, direitos e cidadania",
    habilidade:
      "relacionar o Iluminismo a propostas politicas modernas",
    tags: ["direitos", "cidadania", "igualdade juridica"],
    fatos: [
      {
        lead: "os direitos naturais no contexto iluminista",
        answer: "as garantias consideradas proprias de todo ser humano",
        why: "liberdade e igualdade juridica ganham destaque nesse debate"
      },
      {
        lead: "a cidadania moderna",
        answer: "a condicao de sujeito de direitos e participante da vida publica",
        why: "o Iluminismo reforca essa imagem do individuo"
      },
      {
        lead: "a igualdade perante a lei",
        answer: "o principio de que privilegios de nascimento nao devem definir a justica",
        why: "isso contrasta com sociedades de ordens e estamentos"
      },
      {
        lead: "a critica aos privilegios",
        answer: "a oposicao a vantagens politicas baseadas em sangue ou titulo",
        why: "os iluministas defendem criterios mais universais e racionais"
      },
      {
        lead: "a legitimidade politica moderna",
        answer: "a justificacao do poder por direitos, leis e consentimento",
        why: "esse modelo se fortalece com o pensamento iluminista"
      }
    ]
  },
  {
    subtopico: "Despotismo esclarecido",
    habilidade:
      "avaliar limites e contradicoes do pensamento iluminista na pratica politica",
    tags: ["despotismo esclarecido", "reformas", "absolutismo"],
    fatos: [
      {
        lead: "o despotismo esclarecido",
        answer: "a tentativa de aplicar reformas iluministas sem abandonar monarquia centralizada",
        why: "governantes adotavam medidas modernas mantendo poder concentrado"
      },
      {
        lead: "as reformas ilustradas",
        answer: "mudancas administrativas, educacionais e economicas inspiradas pela razao",
        why: "elas buscavam modernizar o Estado"
      },
      {
        lead: "a contradicao do despotismo esclarecido",
        answer: "promover racionalizacao sem plena participacao politica popular",
        why: "reforma e autoritarismo conviviam nesse modelo"
      },
      {
        lead: "o monarca reformador",
        answer: "o governante que se apresenta como agente de progresso controlado",
        why: "ele incorpora ideias iluministas sem abrir mao do trono"
      },
      {
        lead: "os limites politicos das reformas ilustradas",
        answer: "a manutencao de hierarquias e de pouca soberania popular",
        why: "nem toda modernizacao significava democracia"
      }
    ]
  },
  {
    subtopico: "Esfera publica e opiniao",
    habilidade:
      "compreender a difusao das ideias iluministas e o papel das enciclopedias",
    tags: ["esfera publica", "opiniao publica", "debate"],
    fatos: [
      {
        lead: "a esfera publica",
        answer: "o espaco de debate em que assuntos coletivos passam a ser discutidos publicamente",
        why: "ela fortalece circulacao de ideias e critica politica"
      },
      {
        lead: "a opiniao publica",
        answer: "o conjunto de juizos sociais formados pela discussao de temas comuns",
        why: "ela ganha relevancia com imprensa e sociabilidade urbana"
      },
      {
        lead: "os saloes iluministas",
        answer: "ambientes de encontro e discussao intelectual na Europa moderna",
        why: "eles ajudam a difundir ideias filosoficas e politicas"
      },
      {
        lead: "a imprensa no Iluminismo",
        answer: "o meio de ampliacao da circulacao de textos, polemicas e propostas de reforma",
        why: "ela contribui para formacao da opiniao publica"
      },
      {
        lead: "o debate racional publico",
        answer: "a discussao de ideias com base em argumentos e critica",
        why: "esse ideal e central para a cultura iluminista"
      }
    ]
  },
  {
    subtopico: "Iluminismo e revolucoes",
    habilidade:
      "relacionar o Iluminismo a processos historicos de transformacao politica",
    tags: ["revolucoes", "franca", "independencias"],
    fatos: [
      {
        lead: "a influencia do Iluminismo nas revolucoes",
        answer: "o fornecimento de principios como liberdade, direitos e critica ao absolutismo",
        why: "essas ideias inspiraram mudancas politicas concretas"
      },
      {
        lead: "a Revolucao Francesa e o Iluminismo",
        answer: "a ligacao entre critica aos privilegios e afirmacao de direitos universais",
        why: "muitos ideais iluministas aparecem no discurso revolucionario"
      },
      {
        lead: "as independencias americanas",
        answer: "processos politicos influenciados por ideias de autonomia e soberania",
        why: "o Iluminismo ajudou a legitimar ruptura com dominacoes coloniais"
      },
      {
        lead: "a declaracao de direitos",
        answer: "a formalizacao de principios juridicos inspirados em liberdade e igualdade",
        why: "ela traduz ideias iluministas para a politica institucional"
      },
      {
        lead: "o impacto historico do Iluminismo",
        answer: "a transformacao das bases da legitimidade politica e dos direitos modernos",
        why: "seu alcance ultrapassa o campo puramente intelectual"
      }
    ]
  },
  {
    subtopico: "Criticas e limites do Iluminismo",
    habilidade:
      "avaliar limites e contradicoes do pensamento iluminista na pratica politica",
    tags: ["criticas ao iluminismo", "limites", "contradicoes"],
    fatos: [
      {
        lead: "o universalismo iluminista",
        answer: "a pretensao de formular principios validos para todos os seres humanos",
        why: "essa pretensao foi poderosa, mas tambem gerou exclusoes historicas"
      },
      {
        lead: "a exclusao de grupos no periodo iluminista",
        answer: "a contradicao entre discursos de universalidade e praticas limitadas de cidadania",
        why: "mulheres, escravizados e colonizados ficaram muitas vezes fora desses direitos"
      },
      {
        lead: "a critica romantica ao racionalismo excessivo",
        answer: "a reacao a uma visao que subordinaria sensibilidade e tradicao a calculo racional",
        why: "nem todos aceitaram o otimismo iluminista de modo irrestrito"
      },
      {
        lead: "o eurocentrismo em leituras do Iluminismo",
        answer: "a tendencia de tomar experiencias europeias como medida universal de civilizacao",
        why: "isso exige revisao critica hoje"
      },
      {
        lead: "a atualidade critica do Iluminismo",
        answer: "a necessidade de defender direitos e razao sem ignorar limites historicos desse projeto",
        why: "sua heranca pede apropriacao reflexiva e nao repeticao ingenua"
      }
    ]
  },
  {
    subtopico: "Legado iluminista",
    habilidade:
      "relacionar o Iluminismo a processos historicos de transformacao politica",
    tags: ["legado iluminista", "modernidade", "direitos"],
    fatos: [
      {
        lead: "o legado do Iluminismo",
        answer: "a afirmacao de razao critica, direitos e reforma das instituicoes",
        why: "ele marcou a formacao do mundo politico moderno"
      },
      {
        lead: "a secularizacao moderna",
        answer: "a diminuicao do monopolio religioso sobre explicacao e organizacao da vida publica",
        why: "o Iluminismo fortaleceu autonomia da razao nesse processo"
      },
      {
        lead: "a educacao iluminista",
        answer: "a valorizacao da instrucao como meio de emancipacao humana",
        why: "conhecimento era visto como caminho contra tutela e ignorancia"
      },
      {
        lead: "a cidadania contemporanea",
        answer: "um campo ainda influenciado por ideais iluministas de direitos e participacao",
        why: "muitas democracias modernas dialogam com esse legado"
      },
      {
        lead: "a permanencia da critica iluminista",
        answer: "a defesa do exame racional diante de abusos, censuras e fanatismos",
        why: "esse impulso continua relevante no presente"
      }
    ]
  }
];

export const iluminismo = {
  id: "filosofia_iluminismo",
  materia: "Filosofia",
  serie: [2],
  topico: "Iluminismo",
  metadados: {
    disciplinaId: "filosofia",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Filosofia",
    frente: "Razao, critica e transformacao politica",
    searchAliases: [
      "iluminismo",
      "montesquieu voltaire",
      "enciclopedismo",
      "despotismo esclarecido",
      "legado iluminista"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar principios gerais do Iluminismo e sua valorizacao da razao",
      "compreender a difusao das ideias iluministas e o papel das enciclopedias",
      "relacionar o Iluminismo a propostas politicas modernas",
      "relacionar o Iluminismo a processos historicos de transformacao politica",
      "avaliar limites e contradicoes do pensamento iluminista na pratica politica"
    ],
    planejamentoQuestoes: PHILOSOPHY_HUNDRED_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "ilu",
    serie: 2,
    materia: "Filosofia",
    topico: "Iluminismo",
    blocos,
    stemBuilders: PHILOSOPHY_STEM_BUILDERS,
    globalMatrix: PHILOSOPHY_HUNDRED_MATRIX
  })
};
