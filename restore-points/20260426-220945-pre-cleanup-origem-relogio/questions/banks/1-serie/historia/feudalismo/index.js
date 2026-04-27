import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";

const blocos = [
  {
    subtopico: "Formacao historica do feudalismo",
    habilidade: "identificar-caracteristicas-do-feudalismo-em-sua-formacao-historica",
    tags: ["feudalismo", "origem"],
    fatos: [
      {
        lead: "o encontro entre herancas romanas e costumes germanicos",
        answer: "a origem historica do feudalismo",
        why: "esse processo ajudou a formar estruturas politicas e sociais medievais"
      },
      {
        lead: "a descentralizacao do poder apos a queda de Roma no Ocidente",
        answer: "a fragmentacao politica",
        why: "o poder passou a ficar disperso entre senhores locais"
      },
      {
        lead: "a ruralizacao da vida economica na Alta Idade Media",
        answer: "o recuo das cidades e do comercio",
        why: "a inseguranca reduziu a circulacao urbana e mercantil"
      },
      {
        lead: "a busca por protecao em tempos de invasoes e instabilidade",
        answer: "a formacao de lacos pessoais de dependencia",
        why: "senhores e dependentes construiram relacoes de fidelidade"
      },
      {
        lead: "a organizacao local em terras senhoriais relativamente autonomas",
        answer: "a base do mundo feudal",
        why: "o feudo tornou-se referencia de poder e producao"
      }
    ]
  },
  {
    subtopico: "Economia agraria e senhorio",
    habilidade: "analisar-a-economia-agraria-e-a-organizacao-do-senhorio",
    tags: ["feudalismo", "economia"],
    fatos: [
      {
        lead: "a unidade produtiva que articulava terras, servos e poder senhorial",
        answer: "o senhorio",
        why: "nele se organizavam producao, obrigacoes e autoridade local"
      },
      {
        lead: "a producao voltada principalmente ao consumo local",
        answer: "a autossuficiencia relativa",
        why: "o feudo procurava atender internamente grande parte das necessidades"
      },
      {
        lead: "a area explorada diretamente em beneficio do senhor feudal",
        answer: "a reserva senhorial",
        why: "era cultivada por obrigacoes de trabalho dos servos"
      },
      {
        lead: "as terras utilizadas pelos camponeses para seu sustento",
        answer: "os mansos servis",
        why: "nelas os servos produziam parte do que consumiam"
      },
      {
        lead: "a circulacao reduzida de moedas nas relacoes economicas feudais",
        answer: "uma marca da economia feudal",
        why: "o predomino da producao agraria limitava o uso monetario"
      }
    ]
  },
  {
    subtopico: "Sociedade estamental medieval",
    habilidade: "reconhecer-a-organizacao-da-sociedade-estamental-medieval",
    tags: ["feudalismo", "sociedade"],
    fatos: [
      {
        lead: "a divisao social marcada por pouca mobilidade entre grupos",
        answer: "a sociedade estamental",
        why: "a posicao social tendia a ser definida pelo nascimento"
      },
      {
        lead: "o grupo social medieval associado a oracao e aos assuntos religiosos",
        answer: "o clero",
        why: "tinha forte influencia espiritual e politica"
      },
      {
        lead: "o grupo que concentrava o poder militar e a posse da terra",
        answer: "a nobreza",
        why: "ocupava o topo secular da hierarquia feudal"
      },
      {
        lead: "o grupo que sustentava a producao material no campo",
        answer: "os servos",
        why: "realizavam o trabalho agricola e cumpriam obrigacoes senhoriais"
      },
      {
        lead: "a ideia de que cada ordem possuia funcao social definida",
        answer: "a hierarquia de ordens",
        why: "a sociedade medieval justificava desigualdades como naturais"
      }
    ]
  },
  {
    subtopico: "Suserania, vassalagem e poder local",
    habilidade: "explicar-lacos-de-suserania-vassalagem-e-poder-local",
    tags: ["feudalismo", "poder-politico"],
    fatos: [
      {
        lead: "o pacto entre nobres baseado em fidelidade e protecao",
        answer: "a suserania e vassalagem",
        why: "organizava relacoes politicas entre senhores"
      },
      {
        lead: "o beneficio cedido por um senhor a outro dentro desse pacto",
        answer: "o feudo",
        why: "funcionava como base material do compromisso politico"
      },
      {
        lead: "a cerimonia que formalizava o compromisso entre nobres",
        answer: "a homenagem",
        why: "selava a fidelidade do vassalo ao suserano"
      },
      {
        lead: "a predominancia da autoridade senhorial sobre o poder central",
        answer: "o localismo feudal",
        why: "a vida politica era marcada pela autonomia regional"
      },
      {
        lead: "a obrigacao militar assumida pelo vassalo diante do suserano",
        answer: "o auxilio armado",
        why: "a relacao de fidelidade incluia servico guerreiro"
      }
    ]
  },
  {
    subtopico: "Igreja e mentalidade medieval",
    habilidade: "analisar-o-papel-da-igreja-e-da-mentalidade-medieval",
    tags: ["feudalismo", "igreja"],
    fatos: [
      {
        lead: "a instituicao que mais unificou o Ocidente medieval",
        answer: "a Igreja Catolica",
        why: "orientava valores, politica e vida cotidiana"
      },
      {
        lead: "a visao de mundo que colocava Deus no centro da existencia",
        answer: "o teocentrismo",
        why: "a religiao organizava explicacoes sobre a sociedade e a natureza"
      },
      {
        lead: "o tribunal criado para combater doutrinas consideradas hereticas",
        answer: "a Inquisicao",
        why: "atuou como instrumento de controle religioso"
      },
      {
        lead: "os religiosos que preservavam e copiavam manuscritos",
        answer: "os monges copistas",
        why: "ajudaram a conservar textos e saberes escritos"
      },
      {
        lead: "a organizacao do tempo social por festas, jejuns e datas sagradas",
        answer: "o calendario cristao",
        why: "ele regulava ritmos do trabalho e da religiosidade"
      }
    ]
  },
  {
    subtopico: "Cultura e cotidiano na Idade Media",
    habilidade: "identificar-elementos-da-cultura-e-do-cotidiano-medieval",
    tags: ["feudalismo", "cotidiano"],
    fatos: [
      {
        lead: "a presenca de festas religiosas, feiras e rituais comunitarios",
        answer: "marcas do cotidiano medieval",
        why: "a vida social mesclava trabalho, religiao e sociabilidade"
      },
      {
        lead: "a residencia fortificada que simbolizava poder e defesa",
        answer: "o castelo",
        why: "ele concentrava autoridade militar e politica local"
      },
      {
        lead: "a transmissao de historias, valores e tradicoes sem predominio da escrita",
        answer: "a cultura predominantemente oral",
        why: "grande parte da populacao nao dominava a leitura"
      },
      {
        lead: "o surgimento de centros formais de ensino superior na Baixa Idade Media",
        answer: "um sinal de renovacao intelectual",
        why: "as universidades ampliaram debates filosoficos e juridicos"
      },
      {
        lead: "o conjunto de valores associados aos guerreiros nobres",
        answer: "o codigo de honra da cavalaria",
        why: "ligava valentia, fidelidade e prestigio social"
      }
    ]
  },
  {
    subtopico: "Trabalho servil e vida camponesa",
    habilidade: "explicar-o-trabalho-servil-e-as-condicoes-da-vida-camponesa",
    tags: ["feudalismo", "servidao"],
    fatos: [
      {
        lead: "a condicao dos trabalhadores presos a terra e subordinados ao senhor",
        answer: "a servidao",
        why: "os camponeses nao eram escravos, mas tinham liberdade limitada"
      },
      {
        lead: "a obrigacao de trabalhar gratuitamente alguns dias na terra senhorial",
        answer: "a corveia",
        why: "era uma das principais prestacoes servis"
      },
      {
        lead: "a entrega de parte da producao agricola ao senhor",
        answer: "a talha",
        why: "representava tributo pago com produtos"
      },
      {
        lead: "as taxas cobradas pelo uso de moinho, forno e outros equipamentos do feudo",
        answer: "as banalidades",
        why: "reforcavam a dependencia economica do servo"
      },
      {
        lead: "o conjunto de obrigacoes que restringia a autonomia do campones",
        answer: "a dependencia camponesa",
        why: "o trabalho rural era marcado por deveres e subordinacao"
      }
    ]
  },
  {
    subtopico: "Renascimento comercial e urbano",
    habilidade: "relacionar-renascimento-comercial-urbano-e-transformacoes-medievais",
    tags: ["feudalismo", "renascimento-comercial"],
    fatos: [
      {
        lead: "o crescimento das trocas economicas a partir do seculo XI",
        answer: "a revitalizacao do comercio",
        why: "ela estimulou novas rotas, feiras e especializacoes"
      },
      {
        lead: "os nucleos urbanos que se expandiram junto a castelos e rotas mercantis",
        answer: "os burgos",
        why: "tornaram-se centros de vida comercial e artesanal"
      },
      {
        lead: "o grupo social ligado ao comercio e aos negocios urbanos",
        answer: "a burguesia",
        why: "ganhou importancia com o crescimento das cidades"
      },
      {
        lead: "as associacoes que reuniam artesaos de um mesmo oficio",
        answer: "as corporacoes de oficio",
        why: "regulavam producao, aprendizagem e qualidade do trabalho"
      },
      {
        lead: "os grandes encontros periodicos de compra e venda na Europa medieval",
        answer: "espacos de circulacao mercantil",
        why: "as feiras ligavam diferentes regioes comerciais"
      }
    ]
  },
  {
    subtopico: "Crise do seculo XIV",
    habilidade: "analisar-a-crise-do-seculo-xiv-e-seus-impactos",
    tags: ["feudalismo", "crise-do-seculo-xiv"],
    fatos: [
      {
        lead: "a grande mortalidade que atingiu a Europa no seculo XIV",
        answer: "a Peste Negra",
        why: "ela provocou forte queda demografica"
      },
      {
        lead: "o longo conflito entre Inglaterra e Franca na Baixa Idade Media",
        answer: "a Guerra dos Cem Anos",
        why: "desgastou economias e populacoes"
      },
      {
        lead: "as revoltas de camponeses contra tributos e opressao senhorial",
        answer: "as jacqueries",
        why: "expressaram tensoes sociais do periodo"
      },
      {
        lead: "o conjunto de problemas que abalou a estrutura feudal no seculo XIV",
        answer: "a crise do feudalismo",
        why: "envolveu fome, guerra, peste e tensoes sociais"
      },
      {
        lead: "a falta de trabalhadores apos a grande mortalidade europeia",
        answer: "um fator de mudanca nas relacoes de trabalho",
        why: "a escassez de mao de obra alterou negociacoes e obrigacoes"
      }
    ]
  },
  {
    subtopico: "Feudalismo e transicao para a modernidade",
    habilidade: "avaliar-a-transicao-do-feudalismo-para-a-modernidade",
    tags: ["feudalismo", "transicao-historica"],
    fatos: [
      {
        lead: "o fortalecimento dos reis no fim da Idade Media",
        answer: "a centralizacao monarquica",
        why: "ela reduziu a fragmentacao tipica do feudalismo"
      },
      {
        lead: "o crescimento das cidades e do comercio ao final do periodo medieval",
        answer: "um fator de erosao do feudalismo",
        why: "novas praticas economicas enfraqueceram estruturas senhoriais"
      },
      {
        lead: "o uso crescente da moeda nas trocas e nos impostos",
        answer: "a monetarizacao da economia",
        why: "ela favoreceu transformacoes nas relacoes produtivas"
      },
      {
        lead: "o grupo urbano que ganhou peso politico e economico na passagem para a Modernidade",
        answer: "a burguesia em ascensao",
        why: "seu fortalecimento acompanhou comercio e vida urbana"
      },
      {
        lead: "a passagem do feudalismo para formas politicas e economicas modernas",
        answer: "uma transicao historica gradual",
        why: "as mudancas ocorreram de modo desigual e progressivo"
      }
    ]
  }
];

const questoes = buildPlannedQuestions({
  prefix: "feu",
  serie: [1],
  materia: "Historia",
  topico: "Feudalismo",
  blocos
});

export const feudalismo = {
  id: "historia_feudalismo",
  materia: "Historia",
  serie: [1],
  topico: "Feudalismo",
  metadados: {
    disciplinaId: "historia",
    base: "ESCOLAR",
    eixo: "Historia",
    frente: "Idade Media e sociedade feudal",
    searchAliases: [
      "feudalismo",
      "idade media",
      "sociedade feudal",
      "senhorio",
      "servidao",
      "crise do feudalismo"
    ],
    subtopicosBase: [
      "Formacao historica do feudalismo",
      "Economia agraria e senhorio",
      "Sociedade estamental medieval",
      "Suserania, vassalagem e poder local",
      "Igreja e mentalidade medieval",
      "Cultura e cotidiano na Idade Media",
      "Trabalho servil e vida camponesa",
      "Renascimento comercial e urbano",
      "Crise do seculo XIV",
      "Feudalismo e transicao para a modernidade"
    ],
    habilidadesBase: [
      "identificar fatores de formacao do feudalismo",
      "analisar economia, trabalho e organizacao social no feudalismo",
      "explicar relacoes de poder, suserania e vassalagem",
      "reconhecer o papel da Igreja e da cultura medieval",
      "avaliar a crise do feudalismo e a transicao para a modernidade"
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
