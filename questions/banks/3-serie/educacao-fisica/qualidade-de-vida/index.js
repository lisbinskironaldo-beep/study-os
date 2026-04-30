import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  PHYSICAL_EDUCATION_HUNDRED_MATRIX,
  PHYSICAL_EDUCATION_HUNDRED_PLAN,
  PHYSICAL_EDUCATION_STEM_BUILDERS
} from "../../../_shared/physicalEducationTopicPresets.js";

const blocos = [
  {
    subtopico: "Conceito de qualidade de vida",
    habilidade:
      "compreender o conceito de qualidade de vida em dimensões física, mental e social",
    tags: ["qualidade de vida", "bem-estar", "conceito"],
    fatos: [
      {
        lead: "a qualidade de vida",
        answer: "a percepção de bem-estar em diferentes dimensões da existencia",
        why: "ela envolve aspectos fisicos, emocionais, sociais e ambientais"
      },
      {
        lead: "o bem-estar global",
        answer: "o equilíbrio entre saúde do corpo, relações e satisfação cotidiana",
        why: "qualidade de vida não depende de um único fator isolado"
      },
      {
        lead: "a dimensão física da qualidade de vida",
        answer: "o cuidado com corpo, energia, sono e capacidade funcional",
        why: "essas condicoes influenciam a vida diaria e a autonomia"
      },
      {
        lead: "a dimensão social da qualidade de vida",
        answer: "a qualidade das relações, da convivencia e do sentimento de pertencimento",
        why: "viver bem também envolve interação e apoio social"
      },
      {
        lead: "a dimensão subjetiva da qualidade de vida",
        answer: "a forma como a pessoa avalia sua propria vida e seu bem-estar",
        why: "essa percepção muda conforme contexto e experiência"
      }
    ]
  },
  {
    subtopico: "Atividade física regular",
    habilidade:
      "avaliar o papel da atividade física regular na promoção da saúde",
    tags: ["atividade física", "regularidade", "saude"],
    fatos: [
      {
        lead: "a atividade física regular",
        answer: "a prática frequente de movimentos corporais ao longo da rotina",
        why: "regularidade e mais relevante que ações isoladas e raras"
      },
      {
        lead: "o exercicio planejado",
        answer: "uma forma organizada de atividade física com objetivos definidos",
        why: "ele pode buscar condicionamento, saúde ou desempenho"
      },
      {
        lead: "o movimento no cotidiano",
        answer: "a inserção de deslocamentos e ações corporais nas tarefas diárias",
        why: "subir escadas e caminhar também contam para um estilo de vida ativo"
      },
      {
        lead: "a aderencia a prática corporal",
        answer: "a capacidade de manter uma rotina ativa ao longo do tempo",
        why: "o beneficio aumenta quando a prática se torna hábito"
      },
      {
        lead: "a relação entre movimento e autonomia",
        answer: "a contribuicao da atividade corporal para independencia funcional",
        why: "corpo ativo tende a responder melhor a exigencias da vida diaria"
      }
    ]
  },
  {
    subtopico: "Lazer e tempo livre",
    habilidade:
      "analisar lazer, convivio e uso do tempo livre como fatores de qualidade de vida",
    tags: ["lazer", "tempo livre", "convivio"],
    fatos: [
      {
        lead: "o lazer",
        answer: "o conjunto de experiências escolhidas livremente fora das obrigações",
        why: "ele pode favorecer descanso, prazer e desenvolvimento cultural"
      },
      {
        lead: "o tempo livre",
        answer: "o período disponivel para atividades não impostas por deveres imediatos",
        why: "a forma de usar esse tempo interfere na qualidade de vida"
      },
      {
        lead: "o lazer ativo",
        answer: "a participação em práticas de movimento, cultura ou recreacao",
        why: "ele tende a ampliar bem-estar e socializacao"
      },
      {
        lead: "a convivencia no lazer",
        answer: "a construção de relações por meio de experiências compartilhadas",
        why: "atividades coletivas fortalecem vinculos e pertencimento"
      },
      {
        lead: "o equilíbrio entre obrigações e descanso",
        answer: "a distribuicao saudavel do tempo entre deveres e recuperação",
        why: "rotinas sem pausa podem comprometer saúde e motivacao"
      }
    ]
  },
  {
    subtopico: "Alimentação e equilíbrio",
    habilidade:
      "relacionar alimentação, hidratação e escolhas cotidianas ao bem-estar",
    tags: ["alimentacao", "equilibrio", "habitos"],
    fatos: [
      {
        lead: "a alimentação equilibrada",
        answer: "uma organização alimentar variada e adequada as necessidades do corpo",
        why: "equilíbrio alimentar sustenta energia e funcionamento orgânico"
      },
      {
        lead: "a escolha consciente de alimentos",
        answer: "a decisão informada sobre o que consumir no dia a dia",
        why: "conhecer composicao e contexto ajuda a cuidar melhor da saúde"
      },
      {
        lead: "a regularidade na hidratação",
        answer: "o hábito de consumir água ao longo do dia",
        why: "o organismo depende de líquidos para várias funções"
      },
      {
        lead: "o excesso de acucar, sal e gordura",
        answer: "um padrão alimentar que pode prejudicar equilíbrio corporal",
        why: "consumo repetido em excesso tende a aumentar riscos a saúde"
      },
      {
        lead: "a relação entre alimentação e disposição",
        answer: "a influencia dos hábitos alimentares sobre energia e rendimento cotidiano",
        why: "comer mal pode comprometer atenção e bem-estar"
      }
    ]
  },
  {
    subtopico: "Sono e descanso",
    habilidade:
      "reconhecer a importancia do sono, do descanso e da recuperação",
    tags: ["sono", "descanso", "recuperacao"],
    fatos: [
      {
        lead: "o descanso adequado",
        answer: "a pausa necessaria para restaurar corpo e mente",
        why: "sem descanso, o organismo acumula fadiga"
      },
      {
        lead: "a qualidade do sono",
        answer: "a capacidade do descanso noturno de realmente recuperar o organismo",
        why: "não basta dormir; é preciso dormir bem"
      },
      {
        lead: "a rotina de sono",
        answer: "a regularidade de horários e hábitos ligados ao repouso",
        why: "constancia favorece recuperação mais eficiente"
      },
      {
        lead: "a sonolencia diurna",
        answer: "um sinal de que descanso noturno pode estar insuficiente",
        why: "cansaco ao longo do dia compromete atenção e produtividade"
      },
      {
        lead: "o descanso entre atividades",
        answer: "a pausa que ajuda a evitar sobrecarga física e mental",
        why: "qualidade de vida também depende de ritmo sustentavel"
      }
    ]
  },
  {
    subtopico: "Estresse e autocuidado",
    habilidade:
      "desenvolver estrategias de autocuidado, controle do estresse e equilíbrio emocional",
    tags: ["estresse", "autocuidado", "equilíbrio emocional"],
    fatos: [
      {
        lead: "o estresse",
        answer: "uma resposta do organismo diante de exigencias e pressoes do cotidiano",
        why: "em excesso, ele pode comprometer saúde e qualidade de vida"
      },
      {
        lead: "o autocuidado",
        answer: "o conjunto de atitudes usadas para preservar saúde e bem-estar",
        why: "ele envolve observar necessidades e agir preventivamente"
      },
      {
        lead: "a organização da rotina",
        answer: "uma estratégia para reduzir sobrecarga e melhorar uso do tempo",
        why: "planejar tarefas ajuda a lidar com demandas diárias"
      },
      {
        lead: "a respiracao consciente",
        answer: "um recurso corporal que pode auxiliar em momentos de tensao",
        why: "ela favorece percepção do corpo e regulacao do ritmo interno"
      },
      {
        lead: "o limite saudavel",
        answer: "a capacidade de reconhecer quando parar, descansar ou pedir apoio",
        why: "qualidade de vida também depende de não ultrapassar o próprio limite"
      }
    ]
  },
  {
    subtopico: "Saúde mental e socializacao",
    habilidade:
      "compreender o conceito de qualidade de vida em dimensões física, mental e social",
    tags: ["saúde mental", "socializacao", "apoio social"],
    fatos: [
      {
        lead: "a saúde mental",
        answer: "a condição de equilíbrio emocional, cognitivo e relacional da pessoa",
        why: "ela influencia como cada um lida com desafios e convive socialmente"
      },
      {
        lead: "a socializacao",
        answer: "o processo de interação e participação em grupos e relações",
        why: "conviver com outras pessoas compoe a experiência de bem-estar"
      },
      {
        lead: "a rede de apoio",
        answer: "o conjunto de pessoas e vinculos que oferece acolhimento e ajuda",
        why: "ter apoio fortalece enfrentamento de dificuldades"
      },
      {
        lead: "o sentimento de pertencimento",
        answer: "a percepção de fazer parte de grupos, espacos e relações significativas",
        why: "essa experiência contribui para segurança e autoestima"
      },
      {
        lead: "o isolamento prolongado",
        answer: "uma condição que pode empobrecer trocas sociais e afetar bem-estar",
        why: "ausencia de convivio pode aumentar sofrimento e desmotivacao"
      }
    ]
  },
  {
    subtopico: "Ambiente e qualidade de vida",
    habilidade:
      "analisar relações entre ambiente, rotina e condicoes de vida saudavel",
    tags: ["ambiente", "espaco de vida", "bem-estar coletivo"],
    fatos: [
      {
        lead: "o ambiente de vida",
        answer: "o conjunto de condicoes fisicas e sociais em que a pessoa vive",
        why: "moradia, mobilidade e segurança afetam bem-estar cotidiano"
      },
      {
        lead: "os espacos publicos de lazer",
        answer: "areas coletivas que favorecem convivencia e atividade corporal",
        why: "parques e pracas ampliam oportunidades de vida ativa"
      },
      {
        lead: "a poluicao ambiental",
        answer: "um fator que pode comprometer saúde e conforto da populacao",
        why: "ar, água e ruido influenciam qualidade de vida"
      },
      {
        lead: "a segurança urbana",
        answer: "a condição que permite circular e usar a cidade com tranquilidade",
        why: "locais inseguros reduzem acesso ao lazer e ao movimento"
      },
      {
        lead: "a relação entre ambiente e saúde",
        answer: "a influencia do espaco fisico sobre hábitos, riscos e oportunidades",
        why: "qualidade de vida depende também do contexto em que se vive"
      }
    ]
  },
  {
    subtopico: "Consumo e escolhas cotidianas",
    habilidade:
      "relacionar alimentação, hidratação e escolhas cotidianas ao bem-estar",
    tags: ["consumo", "escolhas", "cotidiano"],
    fatos: [
      {
        lead: "o consumo consciente",
        answer: "a escolha responsavel de produtos e hábitos considerando impactos e necessidades",
        why: "essa postura evita excessos e favorece equilíbrio"
      },
      {
        lead: "a rotina acelerada",
        answer: "um modo de vida que pode dificultar descanso, alimentação e autocuidado",
        why: "quando tudo e urgente, o bem-estar tende a ser adiado"
      },
      {
        lead: "as escolhas cotidianas de saúde",
        answer: "decisões repetidas que influenciam o corpo e a mente ao longo do tempo",
        why: "qualidade de vida se constroi por hábitos recorrentes"
      },
      {
        lead: "o equilíbrio entre prazer e cuidado",
        answer: "a capacidade de fazer escolhas sem radicalismos e sem descuido",
        why: "vida saudavel não depende de perfeicao, mas de constancia e bom senso"
      },
      {
        lead: "a autonomia nas decisões",
        answer: "a capacidade de escolher com critério e responsabilidade sobre a propria rotina",
        why: "autonomia fortalece o compromisso com o próprio bem-estar"
      }
    ]
  },
  {
    subtopico: "Projeto de vida e autonomia",
    habilidade:
      "desenvolver estrategias de autocuidado, controle do estresse e equilíbrio emocional",
    tags: ["projeto de vida", "autonomia", "planejamento pessoal"],
    fatos: [
      {
        lead: "o projeto de vida",
        answer: "a organização de metas e escolhas orientadas por valores e objetivos pessoais",
        why: "pensar no futuro ajuda a dar sentido as decisões do presente"
      },
      {
        lead: "a autonomia pessoal",
        answer: "a capacidade de conduzir escolhas com responsabilidade e reflexão",
        why: "ela envolve independencia sem romper com o cuidado coletivo"
      },
      {
        lead: "o planejamento de rotina",
        answer: "a distribuicao intencional de tempo, tarefas e prioridades",
        why: "planejar ajuda a manter equilíbrio entre deveres e cuidado de si"
      },
      {
        lead: "a definicao de prioridades",
        answer: "a escolha do que merece mais atenção em determinado momento da vida",
        why: "essa selecao evita dispersao e sobrecarga"
      },
      {
        lead: "a coerencia entre metas e hábitos",
        answer: "a correspondencia entre o que se deseja e o que se prática diariamente",
        why: "qualidade de vida exige alinhar objetivos e ações concretas"
      }
    ]
  }
];

export const qualidadeDeVida = {
  id: "educacao-fisica_qualidade_de_vida",
  materia: "Educação Física",
  serie: [3],
  topico: "Qualidade de Vida",
  metadados: {
    disciplinaId: "educacao-fisica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Educação Física",
    frente: "Bem-estar, autonomia e vida saudavel",
    searchAliases: [
      "qualidade de vida",
      "bem-estar",
      "atividade física e saúde",
      "autocuidado",
      "projeto de vida"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "compreender o conceito de qualidade de vida em dimensões física, mental e social",
      "avaliar o papel da atividade física regular na promoção da saúde",
      "analisar lazer, convivio e uso do tempo livre como fatores de qualidade de vida",
      "relacionar alimentação, hidratação e escolhas cotidianas ao bem-estar",
      "desenvolver estrategias de autocuidado, controle do estresse e equilíbrio emocional"
    ],
    planejamentoQuestoes: PHYSICAL_EDUCATION_HUNDRED_PLAN,
    auditado: true,
    auditadoEm: "2026-04-11"
  },
  questoes: buildPlannedQuestions({
    prefix: "qv",
    serie: 3,
    materia: "Educação Física",
    topico: "Qualidade de Vida",
    blocos,
    stemBuilders: PHYSICAL_EDUCATION_STEM_BUILDERS,
    globalMatrix: PHYSICAL_EDUCATION_HUNDRED_MATRIX
  })
};
