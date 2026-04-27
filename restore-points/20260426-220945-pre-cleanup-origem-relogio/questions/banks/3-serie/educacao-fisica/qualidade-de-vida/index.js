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
      "compreender o conceito de qualidade de vida em dimensoes fisica, mental e social",
    tags: ["qualidade de vida", "bem-estar", "conceito"],
    fatos: [
      {
        lead: "a qualidade de vida",
        answer: "a percepcao de bem-estar em diferentes dimensoes da existencia",
        why: "ela envolve aspectos fisicos, emocionais, sociais e ambientais"
      },
      {
        lead: "o bem-estar global",
        answer: "o equilibrio entre saude do corpo, relacoes e satisfacao cotidiana",
        why: "qualidade de vida nao depende de um unico fator isolado"
      },
      {
        lead: "a dimensao fisica da qualidade de vida",
        answer: "o cuidado com corpo, energia, sono e capacidade funcional",
        why: "essas condicoes influenciam a vida diaria e a autonomia"
      },
      {
        lead: "a dimensao social da qualidade de vida",
        answer: "a qualidade das relacoes, da convivencia e do sentimento de pertencimento",
        why: "viver bem tambem envolve interacao e apoio social"
      },
      {
        lead: "a dimensao subjetiva da qualidade de vida",
        answer: "a forma como a pessoa avalia sua propria vida e seu bem-estar",
        why: "essa percepcao muda conforme contexto e experiencia"
      }
    ]
  },
  {
    subtopico: "Atividade fisica regular",
    habilidade:
      "avaliar o papel da atividade fisica regular na promocao da saude",
    tags: ["atividade fisica", "regularidade", "saude"],
    fatos: [
      {
        lead: "a atividade fisica regular",
        answer: "a pratica frequente de movimentos corporais ao longo da rotina",
        why: "regularidade e mais relevante que acoes isoladas e raras"
      },
      {
        lead: "o exercicio planejado",
        answer: "uma forma organizada de atividade fisica com objetivos definidos",
        why: "ele pode buscar condicionamento, saude ou desempenho"
      },
      {
        lead: "o movimento no cotidiano",
        answer: "a insercao de deslocamentos e acoes corporais nas tarefas diarias",
        why: "subir escadas e caminhar tambem contam para um estilo de vida ativo"
      },
      {
        lead: "a aderencia a pratica corporal",
        answer: "a capacidade de manter uma rotina ativa ao longo do tempo",
        why: "o beneficio aumenta quando a pratica se torna habito"
      },
      {
        lead: "a relacao entre movimento e autonomia",
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
        answer: "o conjunto de experiencias escolhidas livremente fora das obrigacoes",
        why: "ele pode favorecer descanso, prazer e desenvolvimento cultural"
      },
      {
        lead: "o tempo livre",
        answer: "o periodo disponivel para atividades nao impostas por deveres imediatos",
        why: "a forma de usar esse tempo interfere na qualidade de vida"
      },
      {
        lead: "o lazer ativo",
        answer: "a participacao em praticas de movimento, cultura ou recreacao",
        why: "ele tende a ampliar bem-estar e socializacao"
      },
      {
        lead: "a convivencia no lazer",
        answer: "a construcao de relacoes por meio de experiencias compartilhadas",
        why: "atividades coletivas fortalecem vinculos e pertencimento"
      },
      {
        lead: "o equilibrio entre obrigacoes e descanso",
        answer: "a distribuicao saudavel do tempo entre deveres e recuperacao",
        why: "rotinas sem pausa podem comprometer saude e motivacao"
      }
    ]
  },
  {
    subtopico: "Alimentacao e equilibrio",
    habilidade:
      "relacionar alimentacao, hidratacao e escolhas cotidianas ao bem-estar",
    tags: ["alimentacao", "equilibrio", "habitos"],
    fatos: [
      {
        lead: "a alimentacao equilibrada",
        answer: "uma organizacao alimentar variada e adequada as necessidades do corpo",
        why: "equilibrio alimentar sustenta energia e funcionamento organico"
      },
      {
        lead: "a escolha consciente de alimentos",
        answer: "a decisao informada sobre o que consumir no dia a dia",
        why: "conhecer composicao e contexto ajuda a cuidar melhor da saude"
      },
      {
        lead: "a regularidade na hidratacao",
        answer: "o habito de consumir agua ao longo do dia",
        why: "o organismo depende de liquidos para varias funcoes"
      },
      {
        lead: "o excesso de acucar, sal e gordura",
        answer: "um padrao alimentar que pode prejudicar equilibrio corporal",
        why: "consumo repetido em excesso tende a aumentar riscos a saude"
      },
      {
        lead: "a relacao entre alimentacao e disposicao",
        answer: "a influencia dos habitos alimentares sobre energia e rendimento cotidiano",
        why: "comer mal pode comprometer atencao e bem-estar"
      }
    ]
  },
  {
    subtopico: "Sono e descanso",
    habilidade:
      "reconhecer a importancia do sono, do descanso e da recuperacao",
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
        why: "nao basta dormir; e preciso dormir bem"
      },
      {
        lead: "a rotina de sono",
        answer: "a regularidade de horarios e habitos ligados ao repouso",
        why: "constancia favorece recuperacao mais eficiente"
      },
      {
        lead: "a sonolencia diurna",
        answer: "um sinal de que descanso noturno pode estar insuficiente",
        why: "cansaco ao longo do dia compromete atencao e produtividade"
      },
      {
        lead: "o descanso entre atividades",
        answer: "a pausa que ajuda a evitar sobrecarga fisica e mental",
        why: "qualidade de vida tambem depende de ritmo sustentavel"
      }
    ]
  },
  {
    subtopico: "Estresse e autocuidado",
    habilidade:
      "desenvolver estrategias de autocuidado, controle do estresse e equilibrio emocional",
    tags: ["estresse", "autocuidado", "equilibrio emocional"],
    fatos: [
      {
        lead: "o estresse",
        answer: "uma resposta do organismo diante de exigencias e pressoes do cotidiano",
        why: "em excesso, ele pode comprometer saude e qualidade de vida"
      },
      {
        lead: "o autocuidado",
        answer: "o conjunto de atitudes usadas para preservar saude e bem-estar",
        why: "ele envolve observar necessidades e agir preventivamente"
      },
      {
        lead: "a organizacao da rotina",
        answer: "uma estrategia para reduzir sobrecarga e melhorar uso do tempo",
        why: "planejar tarefas ajuda a lidar com demandas diarias"
      },
      {
        lead: "a respiracao consciente",
        answer: "um recurso corporal que pode auxiliar em momentos de tensao",
        why: "ela favorece percepcao do corpo e regulacao do ritmo interno"
      },
      {
        lead: "o limite saudavel",
        answer: "a capacidade de reconhecer quando parar, descansar ou pedir apoio",
        why: "qualidade de vida tambem depende de nao ultrapassar o proprio limite"
      }
    ]
  },
  {
    subtopico: "Saude mental e socializacao",
    habilidade:
      "compreender o conceito de qualidade de vida em dimensoes fisica, mental e social",
    tags: ["saude mental", "socializacao", "apoio social"],
    fatos: [
      {
        lead: "a saude mental",
        answer: "a condicao de equilibrio emocional, cognitivo e relacional da pessoa",
        why: "ela influencia como cada um lida com desafios e convive socialmente"
      },
      {
        lead: "a socializacao",
        answer: "o processo de interacao e participacao em grupos e relacoes",
        why: "conviver com outras pessoas compoe a experiencia de bem-estar"
      },
      {
        lead: "a rede de apoio",
        answer: "o conjunto de pessoas e vinculos que oferece acolhimento e ajuda",
        why: "ter apoio fortalece enfrentamento de dificuldades"
      },
      {
        lead: "o sentimento de pertencimento",
        answer: "a percepcao de fazer parte de grupos, espacos e relacoes significativas",
        why: "essa experiencia contribui para seguranca e autoestima"
      },
      {
        lead: "o isolamento prolongado",
        answer: "uma condicao que pode empobrecer trocas sociais e afetar bem-estar",
        why: "ausencia de convivio pode aumentar sofrimento e desmotivacao"
      }
    ]
  },
  {
    subtopico: "Ambiente e qualidade de vida",
    habilidade:
      "analisar relacoes entre ambiente, rotina e condicoes de vida saudavel",
    tags: ["ambiente", "espaco de vida", "bem-estar coletivo"],
    fatos: [
      {
        lead: "o ambiente de vida",
        answer: "o conjunto de condicoes fisicas e sociais em que a pessoa vive",
        why: "moradia, mobilidade e seguranca afetam bem-estar cotidiano"
      },
      {
        lead: "os espacos publicos de lazer",
        answer: "areas coletivas que favorecem convivencia e atividade corporal",
        why: "parques e pracas ampliam oportunidades de vida ativa"
      },
      {
        lead: "a poluicao ambiental",
        answer: "um fator que pode comprometer saude e conforto da populacao",
        why: "ar, agua e ruido influenciam qualidade de vida"
      },
      {
        lead: "a seguranca urbana",
        answer: "a condicao que permite circular e usar a cidade com tranquilidade",
        why: "locais inseguros reduzem acesso ao lazer e ao movimento"
      },
      {
        lead: "a relacao entre ambiente e saude",
        answer: "a influencia do espaco fisico sobre habitos, riscos e oportunidades",
        why: "qualidade de vida depende tambem do contexto em que se vive"
      }
    ]
  },
  {
    subtopico: "Consumo e escolhas cotidianas",
    habilidade:
      "relacionar alimentacao, hidratacao e escolhas cotidianas ao bem-estar",
    tags: ["consumo", "escolhas", "cotidiano"],
    fatos: [
      {
        lead: "o consumo consciente",
        answer: "a escolha responsavel de produtos e habitos considerando impactos e necessidades",
        why: "essa postura evita excessos e favorece equilibrio"
      },
      {
        lead: "a rotina acelerada",
        answer: "um modo de vida que pode dificultar descanso, alimentacao e autocuidado",
        why: "quando tudo e urgente, o bem-estar tende a ser adiado"
      },
      {
        lead: "as escolhas cotidianas de saude",
        answer: "decisoes repetidas que influenciam o corpo e a mente ao longo do tempo",
        why: "qualidade de vida se constroi por habitos recorrentes"
      },
      {
        lead: "o equilibrio entre prazer e cuidado",
        answer: "a capacidade de fazer escolhas sem radicalismos e sem descuido",
        why: "vida saudavel nao depende de perfeicao, mas de constancia e bom senso"
      },
      {
        lead: "a autonomia nas decisoes",
        answer: "a capacidade de escolher com criterio e responsabilidade sobre a propria rotina",
        why: "autonomia fortalece o compromisso com o proprio bem-estar"
      }
    ]
  },
  {
    subtopico: "Projeto de vida e autonomia",
    habilidade:
      "desenvolver estrategias de autocuidado, controle do estresse e equilibrio emocional",
    tags: ["projeto de vida", "autonomia", "planejamento pessoal"],
    fatos: [
      {
        lead: "o projeto de vida",
        answer: "a organizacao de metas e escolhas orientadas por valores e objetivos pessoais",
        why: "pensar no futuro ajuda a dar sentido as decisoes do presente"
      },
      {
        lead: "a autonomia pessoal",
        answer: "a capacidade de conduzir escolhas com responsabilidade e reflexao",
        why: "ela envolve independencia sem romper com o cuidado coletivo"
      },
      {
        lead: "o planejamento de rotina",
        answer: "a distribuicao intencional de tempo, tarefas e prioridades",
        why: "planejar ajuda a manter equilibrio entre deveres e cuidado de si"
      },
      {
        lead: "a definicao de prioridades",
        answer: "a escolha do que merece mais atencao em determinado momento da vida",
        why: "essa selecao evita dispersao e sobrecarga"
      },
      {
        lead: "a coerencia entre metas e habitos",
        answer: "a correspondencia entre o que se deseja e o que se pratica diariamente",
        why: "qualidade de vida exige alinhar objetivos e acoes concretas"
      }
    ]
  }
];

export const qualidadeDeVida = {
  id: "educacao-fisica_qualidade_de_vida",
  materia: "Educacao Fisica",
  serie: [3],
  topico: "Qualidade de Vida",
  metadados: {
    disciplinaId: "educacao-fisica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Educacao Fisica",
    frente: "Bem-estar, autonomia e vida saudavel",
    searchAliases: [
      "qualidade de vida",
      "bem-estar",
      "atividade fisica e saude",
      "autocuidado",
      "projeto de vida"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "compreender o conceito de qualidade de vida em dimensoes fisica, mental e social",
      "avaliar o papel da atividade fisica regular na promocao da saude",
      "analisar lazer, convivio e uso do tempo livre como fatores de qualidade de vida",
      "relacionar alimentacao, hidratacao e escolhas cotidianas ao bem-estar",
      "desenvolver estrategias de autocuidado, controle do estresse e equilibrio emocional"
    ],
    planejamentoQuestoes: PHYSICAL_EDUCATION_HUNDRED_PLAN,
    auditado: true,
    auditadoEm: "2026-04-11"
  },
  questoes: buildPlannedQuestions({
    prefix: "qv",
    serie: 3,
    materia: "Educacao Fisica",
    topico: "Qualidade de Vida",
    blocos,
    stemBuilders: PHYSICAL_EDUCATION_STEM_BUILDERS,
    globalMatrix: PHYSICAL_EDUCATION_HUNDRED_MATRIX
  })
};
