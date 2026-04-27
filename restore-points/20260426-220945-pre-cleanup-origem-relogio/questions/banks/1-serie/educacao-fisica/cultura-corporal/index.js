import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  PHYSICAL_EDUCATION_HUNDRED_MATRIX,
  PHYSICAL_EDUCATION_HUNDRED_PLAN,
  PHYSICAL_EDUCATION_STEM_BUILDERS
} from "../../../_shared/physicalEducationTopicPresets.js";

const blocos = [
  {
    subtopico: "Conceito de cultura corporal",
    habilidade:
      "identificar conceitos fundamentais da cultura corporal",
    tags: ["cultura corporal", "conceito", "corpo e movimento"],
    fatos: [
      {
        lead: "a cultura corporal",
        answer: "o conjunto de praticas e significados ligados ao corpo e ao movimento",
        why: "ela inclui jogos, dancas, esportes, lutas e outras manifestacoes corporais"
      },
      {
        lead: "as praticas corporais",
        answer: "formas culturais de movimentar o corpo em diferentes contextos",
        why: "elas variam conforme tempo, grupo social e objetivo"
      },
      {
        lead: "o movimento humano",
        answer: "uma acao corporal que tambem carrega valores sociais e culturais",
        why: "mover-se nao e apenas um ato biologico, mas tambem cultural"
      },
      {
        lead: "a Educacao Fisica escolar",
        answer: "um espaco de estudo e vivencia das praticas corporais",
        why: "na escola, essas praticas sao tratadas como conhecimento e experiencia"
      },
      {
        lead: "a diversidade corporal",
        answer: "a existencia de diferentes formas de participacao e expressao do corpo",
        why: "a cultura corporal reconhece sujeitos com historias e capacidades diversas"
      }
    ]
  },
  {
    subtopico: "Jogos e brincadeiras",
    habilidade:
      "compreender o papel de jogos e brincadeiras no desenvolvimento",
    tags: ["jogos", "brincadeiras", "convivencia"],
    fatos: [
      {
        lead: "os jogos e brincadeiras",
        answer: "praticas corporais que articulam regras, imaginacao e interacao social",
        why: "eles promovem aprendizagem motora e convivencia"
      },
      {
        lead: "a brincadeira tradicional",
        answer: "uma atividade transmitida entre geracoes por meio da cultura",
        why: "ela preserva costumes e formas coletivas de brincar"
      },
      {
        lead: "as regras do jogo",
        answer: "combinados que organizam a participacao dos jogadores",
        why: "as regras tornam a atividade compreensivel e compartilhada"
      },
      {
        lead: "o jogo cooperativo",
        answer: "uma pratica em que o objetivo prioriza colaboracao entre participantes",
        why: "nesse tipo de jogo, o grupo busca resolver desafios em conjunto"
      },
      {
        lead: "o brincar na escola",
        answer: "uma experiencia que favorece autonomia, criatividade e socializacao",
        why: "brincar tambem e forma de aprender e se relacionar"
      }
    ]
  },
  {
    subtopico: "Dancas e ritmo",
    habilidade:
      "reconhecer a importancia da expressao corporal em dancas e ritmos",
    tags: ["danca", "ritmo", "expressao corporal"],
    fatos: [
      {
        lead: "a danca",
        answer: "uma manifestacao corporal que combina movimento, ritmo e expressao",
        why: "ela comunica ideias e sentimentos por meio do corpo"
      },
      {
        lead: "o ritmo corporal",
        answer: "a organizacao temporal dos movimentos durante uma pratica",
        why: "ritmo orienta repeticao, intensidade e sequencia de gestos"
      },
      {
        lead: "as dancas populares",
        answer: "praticas ligadas a tradicoes culturais de diferentes grupos",
        why: "elas expressam identidades coletivas e memorias sociais"
      },
      {
        lead: "a coreografia",
        answer: "a organizacao planejada de movimentos em uma sequencia",
        why: "ela estrutura a apresentacao corporal no espaco e no tempo"
      },
      {
        lead: "a expressao ritmica",
        answer: "a capacidade de responder ao som com movimentos coordenados",
        why: "essa habilidade articula percepcao auditiva e acao corporal"
      }
    ]
  },
  {
    subtopico: "Ginasticas",
    habilidade:
      "relacionar corpo e movimento com saude e bem-estar",
    tags: ["ginastica", "movimento", "condicionamento"],
    fatos: [
      {
        lead: "a ginastica",
        answer: "um conjunto de exercicios voltados a desenvolver capacidades corporais",
        why: "ela pode ter fins educativos, competitivos, terapeuticos ou de condicionamento"
      },
      {
        lead: "a ginastica de alongamento",
        answer: "uma pratica voltada a ampliar a mobilidade e a flexibilidade corporal",
        why: "ela ajuda na preparacao e na recuperacao do corpo"
      },
      {
        lead: "a ginastica laboral",
        answer: "uma sequencia curta de exercicios realizada no ambiente de trabalho ou estudo",
        why: "ela auxilia na prevencao de tensoes e desconfortos posturais"
      },
      {
        lead: "a ginastica geral",
        answer: "uma pratica que combina exercicios, criatividade e participacao coletiva",
        why: "ela valoriza movimento, expressao e integracao do grupo"
      },
      {
        lead: "o condicionamento fisico",
        answer: "o nivel de preparo corporal para realizar atividades com eficiencia",
        why: "ele envolve forca, resistencia, flexibilidade e outras capacidades"
      }
    ]
  },
  {
    subtopico: "Lutas e praticas corporais",
    habilidade:
      "identificar conceitos fundamentais da cultura corporal",
    tags: ["lutas", "respeito", "praticas corporais"],
    fatos: [
      {
        lead: "as lutas",
        answer: "praticas corporais com tecnicas de oposicao reguladas por regras",
        why: "elas exigem controle, estrategia e respeito ao oponente"
      },
      {
        lead: "o combate esportivo",
        answer: "uma disputa corporal organizada com limites tecnicos e eticos",
        why: "o objetivo nao e machucar, mas aplicar tecnicas com seguranca"
      },
      {
        lead: "o respeito nas lutas",
        answer: "um principio que orienta a relacao entre praticantes e regras",
        why: "sem respeito, a pratica perde seu carater educativo e esportivo"
      },
      {
        lead: "a capoeira",
        answer: "uma pratica corporal brasileira que combina luta, musica e cultura",
        why: "ela articula movimento, ritmo e historia social"
      },
      {
        lead: "a defesa pessoal",
        answer: "o uso consciente de tecnicas corporais para protecao em situacoes de risco",
        why: "essa pratica envolve controle emocional e tomada de decisao"
      }
    ]
  },
  {
    subtopico: "Corpo e expressao",
    habilidade:
      "reconhecer a importancia da expressao corporal em dancas e ritmos",
    tags: ["corpo", "expressao", "comunicacao"],
    fatos: [
      {
        lead: "a expressao corporal",
        answer: "o uso intencional do corpo para comunicar ideias e sentimentos",
        why: "gestos, posturas e deslocamentos podem produzir sentido"
      },
      {
        lead: "a comunicacao nao verbal",
        answer: "a transmissao de mensagens por gestos, olhares e movimentos",
        why: "o corpo tambem comunica sem depender de fala"
      },
      {
        lead: "a postura corporal",
        answer: "a maneira como o corpo se organiza no espaco",
        why: "ela influencia equilibrio, saude e forma de expressao"
      },
      {
        lead: "o gesto expressivo",
        answer: "um movimento que ganha significado em determinado contexto",
        why: "gestos podem representar emocao, intencao ou convencao cultural"
      },
      {
        lead: "a consciencia corporal",
        answer: "a percepcao do proprio corpo em movimento e repouso",
        why: "ela favorece controle motor e autoconhecimento"
      }
    ]
  },
  {
    subtopico: "Inclusao e participacao",
    habilidade:
      "aplicar principios de inclusao na pratica fisica",
    tags: ["inclusao", "participacao", "adaptacao"],
    fatos: [
      {
        lead: "a inclusao nas aulas",
        answer: "a garantia de participacao de todos nas praticas corporais",
        why: "a aula deve considerar necessidades, ritmos e possibilidades diversas"
      },
      {
        lead: "a adaptacao de regras",
        answer: "uma estrategia para ampliar acesso e permanencia dos participantes",
        why: "ajustes tornam a atividade mais justa e viavel para o grupo"
      },
      {
        lead: "a acessibilidade corporal",
        answer: "a criacao de condicoes para que diferentes pessoas possam se movimentar e participar",
        why: "ela envolve espaco, materiais e organizacao adequados"
      },
      {
        lead: "o respeito as diferencas",
        answer: "uma atitude essencial para convivencia em praticas corporais",
        why: "reconhecer diferencas evita exclusao e fortalece o grupo"
      },
      {
        lead: "a participacao colaborativa",
        answer: "o envolvimento do grupo em acoes de ajuda mutua e cooperacao",
        why: "ela favorece aprendizagem compartilhada e pertencimento"
      }
    ]
  },
  {
    subtopico: "Saude e bem-estar",
    habilidade:
      "relacionar corpo e movimento com saude e bem-estar",
    tags: ["saude", "bem-estar", "atividade fisica"],
    fatos: [
      {
        lead: "a atividade fisica regular",
        answer: "uma pratica que contribui para o funcionamento saudavel do organismo",
        why: "ela melhora resistencia, controle corporal e disposicao"
      },
      {
        lead: "o bem-estar corporal",
        answer: "uma sensacao de equilibrio fisico e funcionalidade do corpo",
        why: "ele depende de habitos de movimento, descanso e cuidados diarios"
      },
      {
        lead: "o sedentarismo",
        answer: "um estilo de vida com pouca movimentacao corporal cotidiana",
        why: "a ausencia de movimento aumenta riscos para a saude"
      },
      {
        lead: "o aquecimento",
        answer: "uma preparacao corporal antes da atividade principal",
        why: "ele ajuda o corpo a responder melhor ao esforco fisico"
      },
      {
        lead: "a recuperacao corporal",
        answer: "o periodo de descanso e reorganizacao do corpo apos o esforco",
        why: "ela e importante para evitar fadiga excessiva e lesoes"
      }
    ]
  },
  {
    subtopico: "Lazer e convivio",
    habilidade:
      "compreender o papel de jogos e brincadeiras no desenvolvimento",
    tags: ["lazer", "convivio", "tempo livre"],
    fatos: [
      {
        lead: "o lazer",
        answer: "um conjunto de atividades escolhidas livremente no tempo disponivel",
        why: "ele pode envolver descanso, diversao e desenvolvimento pessoal"
      },
      {
        lead: "o convivio social",
        answer: "a relacao entre pessoas em experiencias coletivas de participacao",
        why: "praticas corporais tambem fortalecem lacos e cooperacao"
      },
      {
        lead: "o uso do tempo livre",
        answer: "a forma como uma pessoa organiza momentos fora das obrigacoes",
        why: "esse tempo pode favorecer saude, cultura e socializacao"
      },
      {
        lead: "as atividades recreativas",
        answer: "praticas que unem prazer, movimento e interacao",
        why: "elas ampliam possibilidades de lazer ativo"
      },
      {
        lead: "o lazer ativo",
        answer: "a participacao em atividades que envolvem movimento corporal no tempo livre",
        why: "essa escolha contribui para saude e bem-estar"
      }
    ]
  },
  {
    subtopico: "Midia e cultura do corpo",
    habilidade:
      "interpretar situacoes aplicadas em cultura corporal",
    tags: ["midia", "imagem corporal", "cultura do corpo"],
    fatos: [
      {
        lead: "a cultura da imagem corporal",
        answer: "a valorizacao social de determinados padroes de aparencia",
        why: "midias e discursos publicos podem reforcar modelos limitados de corpo"
      },
      {
        lead: "a influencia da midia",
        answer: "a capacidade de divulgar referencias de corpo, consumo e desempenho",
        why: "mensagens midiaticas afetam percepcoes e comportamentos"
      },
      {
        lead: "o padrao corporal idealizado",
        answer: "uma representacao simplificada e muitas vezes irreal do corpo considerado correto",
        why: "ele desconsidera diversidade e contextos individuais"
      },
      {
        lead: "a leitura critica da propaganda",
        answer: "a analise das mensagens que associam corpo a sucesso e aceitacao",
        why: "essa leitura ajuda a questionar promessas e imposicoes"
      },
      {
        lead: "a valorizacao da diversidade corporal",
        answer: "o reconhecimento de diferentes corpos como legitimos e dignos de respeito",
        why: "essa perspectiva combate preconceitos e exclusoes"
      }
    ]
  }
];

export const culturaCorporal = {
  id: "educacao-fisica_cultura_corporal",
  materia: "Educacao Fisica",
  serie: [1],
  topico: "Cultura Corporal",
  metadados: {
    disciplinaId: "educacao-fisica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Educacao Fisica",
    frente: "Praticas corporais e formacao humana",
    searchAliases: [
      "cultura corporal",
      "corpo e movimento",
      "jogos e brincadeiras",
      "danca e expressao corporal",
      "saude e bem-estar"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar conceitos fundamentais da cultura corporal",
      "relacionar corpo e movimento com saude e bem-estar",
      "reconhecer a importancia da expressao corporal em dancas e ritmos",
      "compreender o papel de jogos e brincadeiras no desenvolvimento",
      "aplicar principios de inclusao na pratica fisica"
    ],
    planejamentoQuestoes: PHYSICAL_EDUCATION_HUNDRED_PLAN,
    auditado: true,
    auditadoEm: "2026-04-11"
  },
  questoes: buildPlannedQuestions({
    prefix: "cc",
    serie: 1,
    materia: "Educacao Fisica",
    topico: "Cultura Corporal",
    blocos,
    stemBuilders: PHYSICAL_EDUCATION_STEM_BUILDERS,
    globalMatrix: PHYSICAL_EDUCATION_HUNDRED_MATRIX
  })
};
