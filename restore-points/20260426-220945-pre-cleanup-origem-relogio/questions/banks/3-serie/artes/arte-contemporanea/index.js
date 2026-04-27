import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  ARTS_HUNDRED_PLAN,
  ARTS_STEM_BUILDERS,
  HUNDRED_QUESTION_MATRIX
} from "../../../_shared/artsTopicPresets.js";

const blocos = [
  {
    subtopico: "Contexto da arte contemporanea",
    habilidade:
      "identificar caracteristicas gerais da arte contemporanea",
    tags: ["arte contemporanea", "pluralidade", "linguagens"],
    fatos: [
      {
        lead: "a arte contemporanea",
        answer: "uma producao marcada pela diversidade de linguagens e propostas",
        why: "ela nao segue um unico estilo e acolhe suportes, materiais e discursos variados"
      },
      {
        lead: "a expansao de linguagens",
        answer: "a ampliacao dos meios artisticos para alem da pintura e da escultura tradicionais",
        why: "a arte contemporanea incorpora instalacoes, videos, performances e meios digitais"
      },
      {
        lead: "a centralidade da ideia",
        answer: "a valorizacao do conceito como parte essencial da obra",
        why: "muitas obras contemporaneas destacam a reflexao mais do que a tecnica tradicional"
      },
      {
        lead: "o engajamento contemporaneo",
        answer: "a aproximacao da arte com debates politicos, sociais e culturais do presente",
        why: "a producao contemporanea costuma dialogar com conflitos e temas atuais"
      },
      {
        lead: "a pluralidade estetica",
        answer: "a convivencia de propostas visuais, conceituais e materiais muito diferentes",
        why: "na contemporaneidade, varias tendencias coexistem sem uma regra unica"
      }
    ]
  },
  {
    subtopico: "Arte conceitual",
    habilidade:
      "compreender a importancia da ideia, do corpo e do espaco na obra",
    tags: ["arte conceitual", "conceito", "linguagem"],
    fatos: [
      {
        lead: "a arte conceitual",
        answer: "uma pratica em que a ideia tem papel central na construcao da obra",
        why: "o conceito orienta a experiencia e o sentido do trabalho artistico"
      },
      {
        lead: "a primazia do conceito",
        answer: "a valorizacao do pensamento artistico acima do acabamento material",
        why: "nessa linguagem, a proposicao intelectual pode ser o foco principal"
      },
      {
        lead: "a linguagem verbal na arte",
        answer: "o uso de textos, instrucoes e frases como componentes da obra",
        why: "muitos artistas conceituais utilizam palavras para construir significado"
      },
      {
        lead: "a interrogacao do sistema artistico",
        answer: "o questionamento de museus, mercado, autoria e modos de exposicao",
        why: "a arte conceitual frequentemente debate o proprio circuito da arte"
      },
      {
        lead: "a desmaterializacao da obra",
        answer: "a reducao da importancia do objeto fisico em favor da proposicao",
        why: "o valor pode estar mais na ideia do que no suporte material"
      }
    ]
  },
  {
    subtopico: "Performance e corpo",
    habilidade:
      "compreender a importancia da ideia, do corpo e do espaco na obra",
    tags: ["performance", "corpo", "acao artistica"],
    fatos: [
      {
        lead: "a performance",
        answer: "uma linguagem artistica baseada em acao, presenca e tempo",
        why: "ela acontece como evento e envolve corpo, gesto e situacao"
      },
      {
        lead: "a arte corporal",
        answer: "o uso do corpo como suporte, tema ou meio da obra",
        why: "nessa pratica, o corpo deixa de ser apenas representado e passa a atuar"
      },
      {
        lead: "a acao performativa",
        answer: "a realizacao de gestos e procedimentos com intencao artistica",
        why: "a obra se constitui no proprio ato executado"
      },
      {
        lead: "a interacao performatica",
        answer: "a participacao ou aproximacao do publico na experiencia da performance",
        why: "muitas performances criam relacao direta entre artista, espaco e observador"
      },
      {
        lead: "o registro da performance",
        answer: "a documentacao em foto, video ou texto de uma obra efemera",
        why: "como a performance acontece no tempo, o registro preserva sua memoria"
      }
    ]
  },
  {
    subtopico: "Instalacao e ocupacao do espaco",
    habilidade:
      "compreender a importancia da ideia, do corpo e do espaco na obra",
    tags: ["instalacao", "espaco", "imersao"],
    fatos: [
      {
        lead: "a instalacao",
        answer: "uma obra que organiza elementos no espaco para produzir experiencia",
        why: "ela depende da relacao entre objetos, ambiente e observador"
      },
      {
        lead: "a ocupacao espacial",
        answer: "o uso do ambiente como parte constitutiva da obra",
        why: "na instalacao, o espaco nao e neutro; ele integra o sentido artistico"
      },
      {
        lead: "a experiencia imersiva",
        answer: "o envolvimento sensorial do publico no ambiente artistico",
        why: "algumas instalacoes criam participacao fisica e perceptiva intensa"
      },
      {
        lead: "a linguagem expandida",
        answer: "a mistura de suportes, materiais e recursos em uma mesma obra",
        why: "instalacoes costumam reunir luz, som, objetos, imagens e texto"
      },
      {
        lead: "a espacialidade da instalacao",
        answer: "a organizacao intencional do percurso e da percepcao do publico",
        why: "o modo de circular pelo espaco altera a interpretacao da obra"
      }
    ]
  },
  {
    subtopico: "Fotografia, video e novas imagens",
    habilidade:
      "reconhecer meios audiovisuais, digitais e urbanos como linguagens artisticas",
    tags: ["fotografia", "videoarte", "imagem"],
    fatos: [
      {
        lead: "a fotografia",
        answer: "um meio artistico capaz de registrar, construir e problematizar imagens",
        why: "na arte contemporanea, a fotografia vai alem do registro documental"
      },
      {
        lead: "a videoarte",
        answer: "o uso experimental da imagem em movimento como linguagem artistica",
        why: "ela explora tempo, narrativa, montagem e sensacao visual"
      },
      {
        lead: "a cultura da imagem",
        answer: "a forte presenca de imagens na vida cotidiana e nos processos culturais",
        why: "a arte contemporanea dialoga com a circulacao intensa de imagens"
      },
      {
        lead: "a linguagem audiovisual",
        answer: "a articulacao de som e imagem na producao de sentido artistico",
        why: "videos e outras midias audiovisuais trabalham com varios canais perceptivos"
      },
      {
        lead: "a problematizacao da imagem",
        answer: "a reflexao critica sobre representacao, manipulacao e circulacao visual",
        why: "muitas obras questionam como imagens constroem realidades e discursos"
      }
    ]
  },
  {
    subtopico: "Street art e arte urbana",
    habilidade:
      "reconhecer meios audiovisuais, digitais e urbanos como linguagens artisticas",
    tags: ["arte urbana", "grafite", "espaco publico"],
    fatos: [
      {
        lead: "a arte urbana",
        answer: "uma producao realizada em dialogo com a cidade e o espaco publico",
        why: "ela ocupa muros, ruas e superficies urbanas para comunicar ideias"
      },
      {
        lead: "o grafite",
        answer: "uma linguagem visual urbana associada a pintura mural e identidade autoral",
        why: "ele se destaca pelo uso de cor, traco e presenca na cidade"
      },
      {
        lead: "a tag",
        answer: "uma marca grafica simplificada ligada a assinatura do autor no espaco urbano",
        why: "ela enfatiza autoria, presenca e repeticao na paisagem urbana"
      },
      {
        lead: "a disputa pelo espaco publico",
        answer: "o conflito entre expressao artistica, regulacao urbana e usos da cidade",
        why: "a arte urbana provoca debates sobre visibilidade e direito a cidade"
      },
      {
        lead: "a diversidade da intervencao urbana",
        answer: "a existencia de mural, estencil, lambe-lambe e outras praticas na paisagem",
        why: "a arte urbana reune tecnicas e intencoes variadas"
      }
    ]
  },
  {
    subtopico: "Land art e intervencao ambiental",
    habilidade:
      "reconhecer meios audiovisuais, digitais e urbanos como linguagens artisticas",
    tags: ["land art", "natureza", "site specific"],
    fatos: [
      {
        lead: "a land art",
        answer: "uma linguagem que intervem na paisagem natural como parte da obra",
        why: "o ambiente deixa de ser apenas tema e passa a integrar a criacao"
      },
      {
        lead: "a arte site specific",
        answer: "uma obra pensada para um lugar determinado e inseparavel dele",
        why: "seu sentido depende das caracteristicas concretas do espaco"
      },
      {
        lead: "a materialidade ambiental",
        answer: "o uso de terra, pedra, agua e outros elementos do meio na construcao da obra",
        why: "essas praticas trabalham diretamente com materiais da paisagem"
      },
      {
        lead: "a intervencao na natureza",
        answer: "a acao artistica que transforma ou reorganiza elementos do ambiente natural",
        why: "a obra surge da relacao direta entre gesto artistico e espaco natural"
      },
      {
        lead: "a efemeridade ambiental",
        answer: "o carater passageiro de obras sujeitas ao tempo e aos processos naturais",
        why: "vento, agua e erosao podem alterar a obra ao longo do tempo"
      }
    ]
  },
  {
    subtopico: "Arte digital e tecnologia",
    habilidade:
      "reconhecer meios audiovisuais, digitais e urbanos como linguagens artisticas",
    tags: ["arte digital", "tecnologia", "interatividade"],
    fatos: [
      {
        lead: "a arte digital",
        answer: "uma producao que utiliza recursos computacionais na criacao ou exibicao",
        why: "ela pode envolver software, redes, sensores e imagens geradas por computador"
      },
      {
        lead: "a imagem digital",
        answer: "uma visualidade produzida, tratada ou exibida por meio de codigos e dispositivos",
        why: "sua existencia depende de processos tecnologicos de captura e processamento"
      },
      {
        lead: "a interatividade",
        answer: "a participacao ativa do publico no funcionamento ou no resultado da obra",
        why: "muitas obras digitais respondem a toque, movimento ou escolha do visitante"
      },
      {
        lead: "a criacao computacional",
        answer: "o uso de algoritmos e programas no desenvolvimento artistico",
        why: "processos automatizados tambem podem compor a autoria da obra"
      },
      {
        lead: "a difusao tecnologica da arte",
        answer: "a ampliacao da circulacao artistica por redes e meios digitais",
        why: "plataformas online mudam o acesso, a exibicao e a recepcao das obras"
      }
    ]
  },
  {
    subtopico: "Identidade, politica e critica social",
    habilidade:
      "interpretar temas de identidade, politica e critica social na arte",
    tags: ["identidade", "politica", "critica social"],
    fatos: [
      {
        lead: "a arte de critica social",
        answer: "uma producao que questiona desigualdades, violencias e estruturas de poder",
        why: "muitas obras contemporaneas assumem posicionamento diante de problemas coletivos"
      },
      {
        lead: "a questao da identidade",
        answer: "a reflexao sobre genero, etnia, territorio, memoria e pertencimento",
        why: "a arte contemporanea frequentemente debate quem fala e de onde se fala"
      },
      {
        lead: "o engajamento politico",
        answer: "a aproximacao da obra com pautas publicas e disputas de narrativas",
        why: "a arte pode atuar como forma de denuncia, memoria ou resistencia"
      },
      {
        lead: "a reparacao simbolica",
        answer: "a valorizacao de sujeitos e historias historicamente silenciados",
        why: "algumas obras buscam reposicionar memorias e identidades marginalizadas"
      },
      {
        lead: "a dimensao cidada da arte",
        answer: "a capacidade da producao artistica de estimular debate e participacao social",
        why: "a arte pode ampliar a reflexao publica sobre o presente"
      }
    ]
  },
  {
    subtopico: "Curadoria, publico e sistema da arte",
    habilidade:
      "analisar circulacao, curadoria e recepcao das obras contemporaneas",
    tags: ["curadoria", "museu", "sistema da arte"],
    fatos: [
      {
        lead: "a curadoria",
        answer: "a selecao e organizacao de obras para construir um recorte interpretativo",
        why: "o curador propoe relacoes e sentidos ao reunir trabalhos em exposicoes"
      },
      {
        lead: "o sistema da arte",
        answer: "o conjunto de instituicoes, agentes e circuitos que fazem circular as obras",
        why: "museus, galerias, bienais, critica e mercado participam desse sistema"
      },
      {
        lead: "a interpretacao curatorial",
        answer: "a leitura orientada que a exposicao oferece ao publico",
        why: "a montagem e os textos ajudam a construir percursos de sentido"
      },
      {
        lead: "a recepcao ativa",
        answer: "a participacao interpretativa do publico diante da obra",
        why: "o observador tambem produz significado ao interagir com o trabalho"
      },
      {
        lead: "a bienal",
        answer: "uma grande mostra periodica voltada a difusao e debate da arte contemporanea",
        why: "ela reune artistas e tendencias em escala ampla de circulacao"
      }
    ]
  }
];

export const arteContemporanea = {
  id: "artes_arte_contemporanea",
  materia: "Artes",
  serie: [3],
  topico: "Arte Contemporanea",
  metadados: {
    disciplinaId: "artes",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Artes",
    frente: "Poeticas, linguagens e debates da contemporaneidade",
    searchAliases: [
      "arte contemporanea",
      "arte conceitual",
      "performance e instalacao",
      "arte urbana",
      "arte digital"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar caracteristicas gerais da arte contemporanea",
      "compreender a importancia da ideia, do corpo e do espaco na obra",
      "reconhecer meios audiovisuais, digitais e urbanos como linguagens artisticas",
      "interpretar temas de identidade, politica e critica social na arte",
      "analisar circulacao, curadoria e recepcao das obras contemporaneas"
    ],
    planejamentoQuestoes: ARTS_HUNDRED_PLAN,
    auditado: true,
    auditadoEm: "2026-04-11"
  },
  questoes: buildPlannedQuestions({
    prefix: "ac",
    serie: 3,
    materia: "Artes",
    topico: "Arte Contemporanea",
    blocos,
    stemBuilders: ARTS_STEM_BUILDERS,
    globalMatrix: HUNDRED_QUESTION_MATRIX
  })
};
