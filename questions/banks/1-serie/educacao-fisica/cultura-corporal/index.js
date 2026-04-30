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
        answer: "o conjunto de práticas e significados ligados ao corpo e ao movimento",
        why: "ela inclui jogos, dancas, esportes, lutas e outras manifestacoes corporais"
      },
      {
        lead: "as práticas corporais",
        answer: "formas culturais de movimentar o corpo em diferentes contextos",
        why: "elas variam conforme tempo, grupo social e objetivo"
      },
      {
        lead: "o movimento humano",
        answer: "uma ação corporal que também carrega valores sociais e culturais",
        why: "mover-se não é apenas um ato biológico, mas também cultural"
      },
      {
        lead: "a Educação Física escolar",
        answer: "um espaco de estudo e vivencia das práticas corporais",
        why: "na escola, essas práticas são tratadas como conhecimento e experiência"
      },
      {
        lead: "a diversidade corporal",
        answer: "a existencia de diferentes formas de participação e expressao do corpo",
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
        answer: "práticas corporais que articulam regras, imaginacao e interação social",
        why: "eles promovem aprendizagem motora e convivencia"
      },
      {
        lead: "a brincadeira tradicional",
        answer: "uma atividade transmitida entre geracoes por meio da cultura",
        why: "ela preserva costumes e formas coletivas de brincar"
      },
      {
        lead: "as regras do jogo",
        answer: "combinados que organizam a participação dos jogadores",
        why: "as regras tornam a atividade compreensivel e compartilhada"
      },
      {
        lead: "o jogo cooperativo",
        answer: "uma prática em que o objetivo prioriza colaboracao entre participantes",
        why: "nesse tipo de jogo, o grupo busca resolver desafios em conjunto"
      },
      {
        lead: "o brincar na escola",
        answer: "uma experiência que favorece autonomia, criatividade e socializacao",
        why: "brincar também e forma de aprender e se relacionar"
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
        answer: "a organização temporal dos movimentos durante uma prática",
        why: "ritmo orienta repeticao, intensidade e sequencia de gestos"
      },
      {
        lead: "as dancas populares",
        answer: "práticas ligadas a tradicoes culturais de diferentes grupos",
        why: "elas expressam identidades coletivas e memorias sociais"
      },
      {
        lead: "a coreografia",
        answer: "a organização planejada de movimentos em uma sequencia",
        why: "ela estrutura a apresentacao corporal no espaco e no tempo"
      },
      {
        lead: "a expressao ritmica",
        answer: "a capacidade de responder ao som com movimentos coordenados",
        why: "essa habilidade articula percepção auditiva e ação corporal"
      }
    ]
  },
  {
    subtopico: "Ginasticas",
    habilidade:
      "relacionar corpo e movimento com saúde e bem-estar",
    tags: ["ginastica", "movimento", "condicionamento"],
    fatos: [
      {
        lead: "a ginastica",
        answer: "um conjunto de exercicios voltados a desenvolver capacidades corporais",
        why: "ela pode ter fins educativos, competitivos, terapeuticos ou de condicionamento"
      },
      {
        lead: "a ginastica de alongamento",
        answer: "uma prática voltada a ampliar a mobilidade e a flexibilidade corporal",
        why: "ela ajuda na preparacao e na recuperação do corpo"
      },
      {
        lead: "a ginastica laboral",
        answer: "uma sequencia curta de exercicios realizada no ambiente de trabalho ou estudo",
        why: "ela auxilia na prevencao de tensoes e desconfortos posturais"
      },
      {
        lead: "a ginastica geral",
        answer: "uma prática que combina exercicios, criatividade e participação coletiva",
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
    subtopico: "Lutas e práticas corporais",
    habilidade:
      "identificar conceitos fundamentais da cultura corporal",
    tags: ["lutas", "respeito", "práticas corporais"],
    fatos: [
      {
        lead: "as lutas",
        answer: "práticas corporais com técnicas de oposicao reguladas por regras",
        why: "elas exigem controle, estratégia e respeito ao oponente"
      },
      {
        lead: "o combate esportivo",
        answer: "uma disputa corporal organizada com limites tecnicos e eticos",
        why: "o objetivo não é machucar, mas aplicar técnicas com segurança"
      },
      {
        lead: "o respeito nas lutas",
        answer: "um principio que orienta a relação entre praticantes e regras",
        why: "sem respeito, a prática perde seu caráter educativo e esportivo"
      },
      {
        lead: "a capoeira",
        answer: "uma prática corporal brasileira que combina luta, musica e cultura",
        why: "ela articula movimento, ritmo e história social"
      },
      {
        lead: "a defesa pessoal",
        answer: "o uso consciente de técnicas corporais para proteção em situações de risco",
        why: "essa prática envolve controle emocional e tomada de decisão"
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
        lead: "a comunicação não verbal",
        answer: "a transmissao de mensagens por gestos, olhares e movimentos",
        why: "o corpo também comunica sem depender de fala"
      },
      {
        lead: "a postura corporal",
        answer: "a maneira como o corpo se organiza no espaco",
        why: "ela influencia equilíbrio, saúde e forma de expressao"
      },
      {
        lead: "o gesto expressivo",
        answer: "um movimento que ganha significado em determinado contexto",
        why: "gestos podem representar emocao, intencao ou convencao cultural"
      },
      {
        lead: "a consciência corporal",
        answer: "a percepção do próprio corpo em movimento e repouso",
        why: "ela favorece controle motor e autoconhecimento"
      }
    ]
  },
  {
    subtopico: "Inclusão e participação",
    habilidade:
      "aplicar princípios de inclusão na prática física",
    tags: ["inclusao", "participacao", "adaptacao"],
    fatos: [
      {
        lead: "a inclusão nas aulas",
        answer: "a garantia de participação de todos nas práticas corporais",
        why: "a aula deve considerar necessidades, ritmos e possibilidades diversas"
      },
      {
        lead: "a adaptacao de regras",
        answer: "uma estratégia para ampliar acesso e permanencia dos participantes",
        why: "ajustes tornam a atividade mais justa e viavel para o grupo"
      },
      {
        lead: "a acessibilidade corporal",
        answer: "a criacao de condicoes para que diferentes pessoas possam se movimentar e participar",
        why: "ela envolve espaco, materiais e organização adequados"
      },
      {
        lead: "o respeito as diferencas",
        answer: "uma atitude essencial para convivencia em práticas corporais",
        why: "reconhecer diferencas evita exclusao e fortalece o grupo"
      },
      {
        lead: "a participação colaborativa",
        answer: "o envolvimento do grupo em ações de ajuda mútua e cooperação",
        why: "ela favorece aprendizagem compartilhada e pertencimento"
      }
    ]
  },
  {
    subtopico: "Saúde e bem-estar",
    habilidade:
      "relacionar corpo e movimento com saúde e bem-estar",
    tags: ["saude", "bem-estar", "atividade física"],
    fatos: [
      {
        lead: "a atividade física regular",
        answer: "uma prática que contribui para o funcionamento saudavel do organismo",
        why: "ela melhora resistencia, controle corporal e disposição"
      },
      {
        lead: "o bem-estar corporal",
        answer: "uma sensacao de equilíbrio fisico e funcionalidade do corpo",
        why: "ele depende de hábitos de movimento, descanso e cuidados diarios"
      },
      {
        lead: "o sedentarismo",
        answer: "um estilo de vida com pouca movimentacao corporal cotidiana",
        why: "a ausencia de movimento aumenta riscos para a saúde"
      },
      {
        lead: "o aquecimento",
        answer: "uma preparacao corporal antes da atividade principal",
        why: "ele ajuda o corpo a responder melhor ao esforco fisico"
      },
      {
        lead: "a recuperação corporal",
        answer: "o período de descanso e reorganizacao do corpo após o esforco",
        why: "ela é importante para evitar fadiga excessiva e lesoes"
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
        answer: "a relação entre pessoas em experiências coletivas de participação",
        why: "práticas corporais também fortalecem laços e cooperação"
      },
      {
        lead: "o uso do tempo livre",
        answer: "a forma como uma pessoa organiza momentos fora das obrigações",
        why: "esse tempo pode favorecer saúde, cultura e socializacao"
      },
      {
        lead: "as atividades recreativas",
        answer: "práticas que unem prazer, movimento e interação",
        why: "elas ampliam possibilidades de lazer ativo"
      },
      {
        lead: "o lazer ativo",
        answer: "a participação em atividades que envolvem movimento corporal no tempo livre",
        why: "essa escolha contribui para saúde e bem-estar"
      }
    ]
  },
  {
    subtopico: "Midia e cultura do corpo",
    habilidade:
      "interpretar situações aplicadas em cultura corporal",
    tags: ["midia", "imagem corporal", "cultura do corpo"],
    fatos: [
      {
        lead: "a cultura da imagem corporal",
        answer: "a valorizacao social de determinados padrões de aparencia",
        why: "midias e discursos publicos podem reforcar modelos limitados de corpo"
      },
      {
        lead: "a influencia da midia",
        answer: "a capacidade de divulgar referencias de corpo, consumo e desempenho",
        why: "mensagens midiaticas afetam percepcoes e comportamentos"
      },
      {
        lead: "o padrão corporal idealizado",
        answer: "uma representacao simplificada e muitas vezes irreal do corpo considerado correto",
        why: "ele desconsidera diversidade e contextos individuais"
      },
      {
        lead: "a leitura critica da propaganda",
        answer: "a análise das mensagens que associam corpo a sucesso e aceitacao",
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
  materia: "Educação Física",
  serie: [1],
  topico: "Cultura Corporal",
  metadados: {
    disciplinaId: "educacao-fisica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Educação Física",
    frente: "Práticas corporais e formação humana",
    searchAliases: [
      "cultura corporal",
      "corpo e movimento",
      "jogos e brincadeiras",
      "danca e expressao corporal",
      "saúde e bem-estar"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar conceitos fundamentais da cultura corporal",
      "relacionar corpo e movimento com saúde e bem-estar",
      "reconhecer a importancia da expressao corporal em dancas e ritmos",
      "compreender o papel de jogos e brincadeiras no desenvolvimento",
      "aplicar princípios de inclusão na prática física"
    ],
    planejamentoQuestoes: PHYSICAL_EDUCATION_HUNDRED_PLAN,
    auditado: true,
    auditadoEm: "2026-04-11"
  },
  questoes: buildPlannedQuestions({
    prefix: "cc",
    serie: 1,
    materia: "Educação Física",
    topico: "Cultura Corporal",
    blocos,
    stemBuilders: PHYSICAL_EDUCATION_STEM_BUILDERS,
    globalMatrix: PHYSICAL_EDUCATION_HUNDRED_MATRIX
  })
};
