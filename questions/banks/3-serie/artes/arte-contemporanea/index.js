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
      "identificar características gerais da arte contemporanea",
    tags: ["arte contemporanea", "pluralidade", "linguagens"],
    fatos: [
      {
        lead: "a arte contemporanea",
        answer: "uma produção marcada pela diversidade de linguagens e propostas",
        why: "ela não segue um único estilo e acolhe suportes, materiais e discursos variados"
      },
      {
        lead: "a expansao de linguagens",
        answer: "a ampliacao dos meios artisticos para alem da pintura e da escultura tradicionais",
        why: "a arte contemporanea incorpora instalacoes, videos, performances e meios digitais"
      },
      {
        lead: "a centralidade da ideia",
        answer: "a valorizacao do conceito como parte essencial da obra",
        why: "muitas obras contemporaneas destacam a reflexão mais do que a técnica tradicional"
      },
      {
        lead: "o engajamento contemporaneo",
        answer: "a aproximacao da arte com debates politicos, sociais e culturais do presente",
        why: "a produção contemporanea costuma dialogar com conflitos e temas atuais"
      },
      {
        lead: "a pluralidade estética",
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
        answer: "uma pratica em que a ideia tem papel central na construção da obra",
        why: "o conceito orienta a experiencia e o sentido do trabalho artístico"
      },
      {
        lead: "a primazia do conceito",
        answer: "a valorizacao do pensamento artístico acima do acabamento material",
        why: "nessa linguagem, a proposicao intelectual pode ser o foco principal"
      },
      {
        lead: "a linguagem verbal na arte",
        answer: "o uso de textos, instrucoes e frases como componentes da obra",
        why: "muitos artistas conceituais utilizam palavras para construir significado"
      },
      {
        lead: "a interrogacao do sistema artístico",
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
    tags: ["performance", "corpo", "ação artística"],
    fatos: [
      {
        lead: "a performance",
        answer: "uma linguagem artística baseada em ação, presença e tempo",
        why: "ela acontece como evento e envolve corpo, gesto e situação"
      },
      {
        lead: "a arte corporal",
        answer: "o uso do corpo como suporte, tema ou meio da obra",
        why: "nessa pratica, o corpo deixa de ser apenas representado e passa a atuar"
      },
      {
        lead: "a ação performativa",
        answer: "a realizacao de gestos e procedimentos com intencao artística",
        why: "a obra se constitui no proprio ato executado"
      },
      {
        lead: "a interacao performatica",
        answer: "a participação ou aproximacao do público na experiencia da performance",
        why: "muitas performances criam relação direta entre artista, espaco e observador"
      },
      {
        lead: "o registro da performance",
        answer: "a documentacao em foto, video ou texto de uma obra efemera",
        why: "como a performance acontece no tempo, o registro preserva sua memória"
      }
    ]
  },
  {
    subtopico: "Instalação e ocupacao do espaco",
    habilidade:
      "compreender a importancia da ideia, do corpo e do espaco na obra",
    tags: ["instalacao", "espaco", "imersao"],
    fatos: [
      {
        lead: "a instalação",
        answer: "uma obra que organiza elementos no espaco para produzir experiencia",
        why: "ela depende da relação entre objetos, ambiente e observador"
      },
      {
        lead: "a ocupacao espacial",
        answer: "o uso do ambiente como parte constitutiva da obra",
        why: "na instalação, o espaco não é neutro; ele integra o sentido artístico"
      },
      {
        lead: "a experiencia imersiva",
        answer: "o envolvimento sensorial do público no ambiente artístico",
        why: "algumas instalacoes criam participação física e perceptiva intensa"
      },
      {
        lead: "a linguagem expandida",
        answer: "a mistura de suportes, materiais e recursos em uma mesma obra",
        why: "instalacoes costumam reunir luz, som, objetos, imagens e texto"
      },
      {
        lead: "a espacialidade da instalação",
        answer: "a organização intencional do percurso e da percepcao do público",
        why: "o modo de circular pelo espaco altera a interpretação da obra"
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
        answer: "um meio artístico capaz de registrar, construir e problematizar imagens",
        why: "na arte contemporanea, a fotografia vai alem do registro documental"
      },
      {
        lead: "a videoarte",
        answer: "o uso experimental da imagem em movimento como linguagem artística",
        why: "ela explora tempo, narrativa, montagem e sensação visual"
      },
      {
        lead: "a cultura da imagem",
        answer: "a forte presença de imagens na vida cotidiana e nos processos culturais",
        why: "a arte contemporanea dialoga com a circulacao intensa de imagens"
      },
      {
        lead: "a linguagem audiovisual",
        answer: "a articulação de som e imagem na produção de sentido artístico",
        why: "videos e outras midias audiovisuais trabalham com vários canais perceptivos"
      },
      {
        lead: "a problematizacao da imagem",
        answer: "a reflexão crítica sobre representação, manipulação e circulacao visual",
        why: "muitas obras questionam como imagens constroem realidades e discursos"
      }
    ]
  },
  {
    subtopico: "Street art e arte urbana",
    habilidade:
      "reconhecer meios audiovisuais, digitais e urbanos como linguagens artisticas",
    tags: ["arte urbana", "grafite", "espaco público"],
    fatos: [
      {
        lead: "a arte urbana",
        answer: "uma produção realizada em dialogo com a cidade e o espaco público",
        why: "ela ocupa muros, ruas e superficies urbanas para comunicar ideias"
      },
      {
        lead: "o grafite",
        answer: "uma linguagem visual urbana associada a pintura mural e identidade autoral",
        why: "ele se destaca pelo uso de cor, traco e presença na cidade"
      },
      {
        lead: "a tag",
        answer: "uma marca grafica simplificada ligada a assinatura do autor no espaco urbano",
        why: "ela enfatiza autoria, presença e repeticao na paisagem urbana"
      },
      {
        lead: "a disputa pelo espaco público",
        answer: "o conflito entre expressao artística, regulacao urbana e usos da cidade",
        why: "a arte urbana provoca debates sobre visibilidade e direito a cidade"
      },
      {
        lead: "a diversidade da intervencao urbana",
        answer: "a existencia de mural, estencil, lambe-lambe e outras praticas na paisagem",
        why: "a arte urbana reune técnicas e intenções variadas"
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
        why: "o ambiente deixa de ser apenas tema e passa a integrar a criação"
      },
      {
        lead: "a arte site specific",
        answer: "uma obra pensada para um lugar determinado e inseparavel dele",
        why: "seu sentido depende das características concretas do espaco"
      },
      {
        lead: "a materialidade ambiental",
        answer: "o uso de terra, pedra, agua e outros elementos do meio na construção da obra",
        why: "essas praticas trabalham diretamente com materiais da paisagem"
      },
      {
        lead: "a intervencao na natureza",
        answer: "a ação artística que transforma ou reorganiza elementos do ambiente natural",
        why: "a obra surge da relação direta entre gesto artístico e espaco natural"
      },
      {
        lead: "a efemeridade ambiental",
        answer: "o caráter passageiro de obras sujeitas ao tempo e aos processos naturais",
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
        answer: "uma produção que utiliza recursos computacionais na criação ou exibicao",
        why: "ela pode envolver software, redes, sensores e imagens geradas por computador"
      },
      {
        lead: "a imagem digital",
        answer: "uma visualidade produzida, tratada ou exibida por meio de codigos e dispositivos",
        why: "sua existencia depende de processos tecnologicos de captura e processamento"
      },
      {
        lead: "a interatividade",
        answer: "a participação ativa do público no funcionamento ou no resultado da obra",
        why: "muitas obras digitais respondem a toque, movimento ou escolha do visitante"
      },
      {
        lead: "a criação computacional",
        answer: "o uso de algoritmos e programas no desenvolvimento artístico",
        why: "processos automatizados também podem compor a autoria da obra"
      },
      {
        lead: "a difusao tecnologica da arte",
        answer: "a ampliacao da circulacao artística por redes e meios digitais",
        why: "plataformas online mudam o acesso, a exibicao e a recepcao das obras"
      }
    ]
  },
  {
    subtopico: "Identidade, politica e crítica social",
    habilidade:
      "interpretar temas de identidade, politica e crítica social na arte",
    tags: ["identidade", "politica", "crítica social"],
    fatos: [
      {
        lead: "a arte de crítica social",
        answer: "uma produção que questiona desigualdades, violencias e estruturas de poder",
        why: "muitas obras contemporaneas assumem posicionamento diante de problemas coletivos"
      },
      {
        lead: "a questao da identidade",
        answer: "a reflexão sobre gênero, etnia, territorio, memória e pertencimento",
        why: "a arte contemporanea frequentemente debate quem fala e de onde se fala"
      },
      {
        lead: "o engajamento político",
        answer: "a aproximacao da obra com pautas publicas e disputas de narrativas",
        why: "a arte pode atuar como forma de denuncia, memória ou resistencia"
      },
      {
        lead: "a reparacao simbólica",
        answer: "a valorizacao de sujeitos e historias historicamente silenciados",
        why: "algumas obras buscam reposicionar memorias e identidades marginalizadas"
      },
      {
        lead: "a dimensao cidada da arte",
        answer: "a capacidade da produção artística de estimular debate e participação social",
        why: "a arte pode ampliar a reflexão pública sobre o presente"
      }
    ]
  },
  {
    subtopico: "Curadoria, público e sistema da arte",
    habilidade:
      "analisar circulacao, curadoria e recepcao das obras contemporaneas",
    tags: ["curadoria", "museu", "sistema da arte"],
    fatos: [
      {
        lead: "a curadoria",
        answer: "a selecao e organização de obras para construir um recorte interpretativo",
        why: "o curador propoe relações e sentidos ao reunir trabalhos em exposicoes"
      },
      {
        lead: "o sistema da arte",
        answer: "o conjunto de instituicoes, agentes e circuitos que fazem circular as obras",
        why: "museus, galerias, bienais, crítica e mercado participam desse sistema"
      },
      {
        lead: "a interpretação curatorial",
        answer: "a leitura orientada que a exposicao oferece ao público",
        why: "a montagem e os textos ajudam a construir percursos de sentido"
      },
      {
        lead: "a recepcao ativa",
        answer: "a participação interpretativa do público diante da obra",
        why: "o observador também produz significado ao interagir com o trabalho"
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
      "performance e instalação",
      "arte urbana",
      "arte digital"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar características gerais da arte contemporanea",
      "compreender a importancia da ideia, do corpo e do espaco na obra",
      "reconhecer meios audiovisuais, digitais e urbanos como linguagens artisticas",
      "interpretar temas de identidade, politica e crítica social na arte",
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
