import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";

const blocos = [
  {
    subtopico: "Crise do feudalismo e contexto das navegações",
    habilidade: "identificar-fatores-que-explicam-o-contexto-das-grandes-navegacoes",
    tags: ["expansao-maritima", "contexto"],
    fatos: [
      {
        lead: "a busca europeia por chegar diretamente aos produtos orientais",
        answer: "o interesse pelas especiarias",
        why: "elas tinham alto valor comercial no mercado europeu"
      },
      {
        lead: "a dificuldade de acesso ao Oriente pelo Mediterraneo",
        answer: "a intermediacao de cidades italianas e povos muculmanos",
        why: "essa rede encarecia e controlava o comercio oriental"
      },
      {
        lead: "o fortalecimento político das monarquias ao final da Idade Média",
        answer: "uma condicao para financiar navegações",
        why: "os reis passaram a reunir recursos para projetos oceanicos"
      },
      {
        lead: "a valorizacao da curiosidade geografica e da iniciativa humana",
        answer: "o espirito de expansão ultramarina",
        why: "a cultura da epoca estimulava novas exploracoes"
      },
      {
        lead: "a necessidade de metais e de novos circuitos comerciais",
        answer: "um estimulo economico das grandes navegações",
        why: "a expansão prometia lucro, riqueza e acesso a mercados"
      }
    ]
  },
  {
    subtopico: "Portugal e pioneirismo ultramarino",
    habilidade: "reconhecer-os-fatores-do-pioneirismo-portugues",
    tags: ["expansao-maritima", "portugal"],
    fatos: [
      {
        lead: "a experiência nautica acumulada pelo reino português",
        answer: "uma vantagem do pioneirismo lusitano",
        why: "ela combinava posicao geografica, navegacao e apoio estatal"
      },
      {
        lead: "a conquista de Ceuta em 1415",
        answer: "um marco inicial da expansão portuguesa",
        why: "a ocupacao abriu caminho para a presenca lusa no Atlantico e na África"
      },
      {
        lead: "a busca de uma rota para o Oriente contornando a África",
        answer: "um objetivo central da Coroa portuguesa",
        why: "ela pretendia romper intermediacoes no comercio oriental"
      },
      {
        lead: "a passagem pelo cabo da Boa Esperanca",
        answer: "a viagem de Bartolomeu Dias",
        why: "ela demonstrou a possibilidade de seguir pelo sul da África"
      },
      {
        lead: "a chegada europeia por mar as Indias",
        answer: "a viagem de Vasco da Gama",
        why: "o feito consolidou a rota oriental portuguesa"
      }
    ]
  },
  {
    subtopico: "Espanha é a expansão oceanica",
    habilidade: "analisar-o-papel-da-espanha-na-expansao-oceanica",
    tags: ["expansao-maritima", "espanha"],
    fatos: [
      {
        lead: "a expedicao que chegou a America em 1492",
        answer: "a viagem de Cristovao Colombo",
        why: "ela inaugurou a expansão espanhola no continente americano"
      },
      {
        lead: "o suporte político para a viagem de Colombo",
        answer: "o apoio da monarquia espanhola",
        why: "os Reis Catolicos financiaram a expedicao"
      },
      {
        lead: "a linha imaginaria que dividia areas de exploracao iberica no Atlantico",
        answer: "o Tratado de Tordesilhas",
        why: "o acordo tentou evitar conflitos entre Portugal e Espanha"
      },
      {
        lead: "a submissao de grandes sociedades americanas pelos conquistadores",
        answer: "a conquista de imperios indigenas",
        why: "ela marcou a expansão espanhola no Novo Mundo"
      },
      {
        lead: "a entrada macica de prata e ouro americanos na Espanha",
        answer: "a base da riqueza colonial espanhola",
        why: "os metais preciosos financiaram o poder imperial"
      }
    ]
  },
  {
    subtopico: "Técnicas náuticas e cartografia moderna",
    habilidade: "identificar-tecnicas-e-instrumentos-das-navegacoes-modernas",
    tags: ["expansao-maritima", "tecnicas-nauticas"],
    fatos: [
      {
        lead: "o instrumento utilizado para calcular a posicao a partir dos astros",
        answer: "o astrolabio",
        why: "ele auxiliava a orientacao em mar aberto"
      },
      {
        lead: "a embarcacao leve e adaptada a longas viagens oceanicas",
        answer: "a caravela",
        why: "ela permitia maior mobilidade e exploracao costeira"
      },
      {
        lead: "os mapas especializados em rotas e portos",
        answer: "ferramentas de navegacao",
        why: "a cartografia moderna tornou as viagens mais seguras"
      },
      {
        lead: "o instrumento que indicava direcao pelo magnetismo",
        answer: "a bussola",
        why: "ela ajudava navegadores a manter rumos constantes"
      },
      {
        lead: "o dominio de ventos, correntes e rotas do oceano",
        answer: "um fator tecnico das viagens oceanicas",
        why: "esse conhecimento era decisivo para o sucesso das expedicoes"
      }
    ]
  },
  {
    subtopico: "Mercantilismo e economia colonial",
    habilidade: "relacionar-mercantilismo-e-economia-colonial",
    tags: ["expansao-maritima", "mercantilismo"],
    fatos: [
      {
        lead: "a política econômica voltada a acumular riqueza para o Estado",
        answer: "o mercantilismo",
        why: "ela associava poder político a intervencao econômica"
      },
      {
        lead: "a subordinacao econômica da colonia aos interesses da metropole",
        answer: "o pacto colonial",
        why: "a produção colonial devia atender prioridades metropolitanas"
      },
      {
        lead: "a reserva do comercio colonial para a metropole",
        answer: "o exclusivismo comercial",
        why: "ele limitava a autonomia econômica das colonias"
      },
      {
        lead: "a valorizacao de ouro e prata como medida de riqueza",
        answer: "o metalismo",
        why: "metais preciosos eram vistos como fundamento da prosperidade estatal"
      },
      {
        lead: "o sistema de monocultura exportadora em grandes propriedades",
        answer: "a plantation",
        why: "ele caracterizou varias economias coloniais americanas"
      }
    ]
  },
  {
    subtopico: "Tratados, rotas e disputas maritimas",
    habilidade: "explicar-tratados-rotas-e-disputas-na-expansao-maritima",
    tags: ["expansao-maritima", "rotas-oceanicas"],
    fatos: [
      {
        lead: "o meridiano negociado para dividir zonas de exploracao iberica",
        answer: "uma tentativa diplomatica de controle oceanico",
        why: "tratados procuravam organizar a competicao entre monarquias"
      },
      {
        lead: "o caminho português para o Oriente contornando a África",
        answer: "a rota do cabo",
        why: "ela conectou o Atlantico ao Índico"
      },
      {
        lead: "o dominio português de entrepostos e passagens no oceano Índico",
        answer: "um foco de disputas entre europeus",
        why: "outras potencias buscavam romper o monopolio luso"
      },
      {
        lead: "os ataques autorizados ou tolerados contra navios rivais",
        answer: "a pirataria é o corso",
        why: "essas praticas fizeram parte da concorrencia maritima"
      },
      {
        lead: "a ofensiva de ingleses e holandeses contra monopolios ibericos",
        answer: "a quebra do monopolio iberico",
        why: "novas potencias passaram a disputar mares e colonias"
      }
    ]
  },
  {
    subtopico: "Conquista e contato com povos amerindios",
    habilidade: "analisar-o-contato-e-a-conquista-dos-povos-amerindios",
    tags: ["expansao-maritima", "amerindios"],
    fatos: [
      {
        lead: "o primeiro encontro entre europeus e sociedades nativas da America",
        answer: "um choque cultural profundo",
        why: "a aproximacao envolveu estranhamentos, violencia e negociacoes"
      },
      {
        lead: "o sistema espanhol de exploracao do trabalho indigena",
        answer: "a encomienda",
        why: "ela subordinava comunidades nativas a colonizadores"
      },
      {
        lead: "a disseminacao de enfermidades trazidas pelos europeus",
        answer: "um fator de queda demografica indigena",
        why: "muitas populacoes não tinham resistência biologica a essas doencas"
      },
      {
        lead: "a tentativa de converter nativos ao cristianismo",
        answer: "um instrumento de dominacao cultural",
        why: "a catequese acompanhou a ocupacao colonial"
      },
      {
        lead: "as reacoes dos povos originarios diante da invasao europeia",
        answer: "formas de resistência indigena",
        why: "diversos grupos lutaram, negociaram ou recuaram para sobreviver"
      }
    ]
  },
  {
    subtopico: "África, escravizacao e trafico atlantico",
    habilidade: "relacionar-africa-escravizacao-e-trafico-atlantico-ao-sistema-colonial",
    tags: ["expansao-maritima", "trafico-atlantico"],
    fatos: [
      {
        lead: "o comercio forcado de africanos para diferentes partes do Atlantico",
        answer: "o trafico negreiro",
        why: "ele integrou África, America e Europa em escala violenta"
      },
      {
        lead: "o uso da mao de obra africana nas colonias americanas",
        answer: "uma base do sistema colonial",
        why: "a produção exportadora dependeu largamente do trabalho escravizado"
      },
      {
        lead: "os postos comerciais europeus instalados no litoral africano",
        answer: "espacos de feitorias e comercio",
        why: "eles articulavam trocas e captura de pessoas"
      },
      {
        lead: "a dispersao forcada de populacoes africanas pelo Atlantico",
        answer: "a diaspora africana",
        why: "milhoes de pessoas foram arrancadas de seus territorios"
      },
      {
        lead: "a associacao entre escravizacao, lucro e hierarquias raciais",
        answer: "uma estrutura de violencia e lucro",
        why: "o trafico sustentou riquezas e desigualdades duradouras"
      }
    ]
  },
  {
    subtopico: "Colonização e formação do sistema colonial",
    habilidade: "explicar-a-colonizacao-e-a-formacao-do-sistema-colonial",
    tags: ["expansao-maritima", "colonizacao"],
    fatos: [
      {
        lead: "a colonia organizada para atender prioritariamente a metropole",
        answer: "a colonia de exploracao",
        why: "seu sentido economico estava voltado ao exterior"
      },
      {
        lead: "a instalacao de autoridades e normas coloniais em terras conquistadas",
        answer: "a administracao colonial",
        why: "ela garantia obediencia política e fiscal"
      },
      {
        lead: "a predominancia de grandes propriedades voltadas a exportacao",
        answer: "o latifundio colonial",
        why: "esse modelo marcou varias areas produtivas americanas"
      },
      {
        lead: "o emprego de formas compulsorias de trabalho na produção",
        answer: "a sustentacao da economia colonial",
        why: "a riqueza colonial dependeu de coercao sobre trabalhadores"
      },
      {
        lead: "a ligacao desigual entre metropole e territorio dominado",
        answer: "a dependência econômica e política",
        why: "as colonias tinham autonomia muito limitada"
      }
    ]
  },
  {
    subtopico: "Consequências historicas da expansão maritima",
    habilidade: "avaliar-as-consequencias-historicas-da-expansao-maritima",
    tags: ["expansao-maritima", "mundo-moderno"],
    fatos: [
      {
        lead: "a conexao mais intensa entre continentes depois das navegações",
        answer: "a primeira mundializacao comercial",
        why: "produtos, pessoas e ideias passaram a circular em escala ampliada"
      },
      {
        lead: "a mudanca do centro economico europeu do Mediterraneo para o Atlantico",
        answer: "uma reorganizacao das rotas de poder",
        why: "novos portos e Estados ganharam protagonismo"
      },
      {
        lead: "o enriquecimento de grupos mercantis e monarquias europeias",
        answer: "o fortalecimento do capitalismo mercantil",
        why: "a expansão ultramarina ampliou acumulacao e investimentos"
      },
      {
        lead: "os efeitos da conquista sobre sociedades colonizadas",
        answer: "violencia, dominio e reordenacao social",
        why: "a ocupacao alterou profundamente vidas e culturas locais"
      },
      {
        lead: "a formação de um mundo interligado por mares e imperios",
        answer: "uma consequência duradoura das navegações",
        why: "o processo ajudou a definir a Modernidade"
      }
    ]
  }
];

const questoes = buildPlannedQuestions({
  prefix: "exm",
  serie: [1],
  materia: "História",
  topico: "Expansão Maritima",
  blocos
});

export const expansaoMaritima = {
  id: "historia_expansao_maritima",
  materia: "História",
  serie: [1],
  topico: "Expansão Maritima",
  metadados: {
    disciplinaId: "historia",
    base: "ESCOLAR",
    eixo: "História",
    frente: "Expansão ultramarina e sistema colonial",
    searchAliases: [
      "expansão maritima",
      "grandes navegações",
      "expansão ultramarina",
      "portugal e espanha",
      "mercantilismo",
      "sistema colonial"
    ],
    subtopicosBase: [
      "Crise do feudalismo e contexto das navegações",
      "Portugal e pioneirismo ultramarino",
      "Espanha é a expansão oceanica",
      "Técnicas náuticas e cartografia moderna",
      "Mercantilismo e economia colonial",
      "Tratados, rotas e disputas maritimas",
      "Conquista e contato com povos amerindios",
      "África, escravizacao e trafico atlantico",
      "Colonização e formação do sistema colonial",
      "Consequências historicas da expansão maritima"
    ],
    habilidadesBase: [
      "identificar fatores que impulsionaram as grandes navegações",
      "reconhecer o pioneirismo português é a expansão espanhola",
      "analisar técnicas náuticas, mercantilismo e sistema colonial",
      "relacionar conquista, escravizacao e trafico atlantico aos processos coloniais",
      "avaliar consequências historicas da expansão maritima"
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
