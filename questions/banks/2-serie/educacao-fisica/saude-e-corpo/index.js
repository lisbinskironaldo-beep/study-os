import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  PHYSICAL_EDUCATION_HUNDRED_MATRIX,
  PHYSICAL_EDUCATION_HUNDRED_PLAN,
  PHYSICAL_EDUCATION_STEM_BUILDERS
} from "../../../_shared/physicalEducationTopicPresets.js";

const blocos = [
  {
    subtopico: "Aptidão física e componentes",
    habilidade:
      "identificar componentes da aptidão física relacionados a saúde",
    tags: ["aptidão física", "condicionamento", "saude"],
    fatos: [
      {
        lead: "a aptidão física",
        answer: "a capacidade do corpo de realizar atividades com eficiencia e segurança",
        why: "ela relaciona desempenho motor e condicoes de saúde"
      },
      {
        lead: "a resistencia cardiorrespiratoria",
        answer: "a capacidade de sustentar esforcos que envolvem coracao e pulmoes",
        why: "ela é importante para atividades prolongadas"
      },
      {
        lead: "a forca muscular",
        answer: "a capacidade de produzir tensao para mover ou sustentar cargas",
        why: "ela apoia postura, locomocao e autonomia funcional"
      },
      {
        lead: "a flexibilidade",
        answer: "a amplitude de movimento possível em articulações e segmentos corporais",
        why: "ela favorece mobilidade e execucao de gestos"
      },
      {
        lead: "a composicao corporal",
        answer: "a relação entre diferentes componentes do corpo, como massa magra e gordura",
        why: "ela ajuda a compreender aspectos do estado fisico"
      }
    ]
  },
  {
    subtopico: "Sistemas do corpo e exercicio",
    habilidade:
      "relacionar funcionamento do corpo humano com prática de exercicios",
    tags: ["sistemas do corpo", "exercicio", "organismo"],
    fatos: [
      {
        lead: "o sistema cardiovascular",
        answer: "o conjunto responsavel por circular sangue e nutrientes pelo organismo",
        why: "durante o exercicio, ele aumenta o transporte de oxigenio"
      },
      {
        lead: "o sistema respiratorio",
        answer: "o sistema que realiza trocas gasosas necessarias ao metabolismo",
        why: "na atividade física, ele atua para suprir maior demanda de oxigenio"
      },
      {
        lead: "o sistema muscular",
        answer: "o conjunto de estruturas que possibilita movimento e estabilizacao corporal",
        why: "ele é diretamente acionado na prática de exercicios"
      },
      {
        lead: "o sistema esqueletico",
        answer: "a estrutura de sustentacao e proteção que apoia os movimentos do corpo",
        why: "ossos e articulações permitem alavancas e deslocamentos"
      },
      {
        lead: "a adaptacao ao treino",
        answer: "a resposta progressiva do corpo aos estimulos repetidos de exercicio",
        why: "com prática orientada, o organismo melhora eficiencia funcional"
      }
    ]
  },
  {
    subtopico: "Alimentação e hidratação",
    habilidade:
      "avaliar hábitos de alimentação, hidratação e recuperação corporal",
    tags: ["alimentacao", "hidratacao", "energia"],
    fatos: [
      {
        lead: "a alimentação equilibrada",
        answer: "o consumo variado de nutrientes em quantidade adequada ao organismo",
        why: "ela fornece energia e materiais para funcionamento corporal"
      },
      {
        lead: "a hidratação regular",
        answer: "a reposição frequente de água para manter equilíbrio corporal",
        why: "perdas de liquido durante o dia e no exercicio precisam ser compensadas"
      },
      {
        lead: "os carboidratos",
        answer: "nutrientes que funcionam como importante fonte de energia para o corpo",
        why: "eles ajudam a sustentar esforcos e atividades cotidianas"
      },
      {
        lead: "as proteinas",
        answer: "nutrientes ligados a formação e reparo de tecidos do organismo",
        why: "elas participam da recuperação após esforcos"
      },
      {
        lead: "o consumo excessivo de ultraprocessados",
        answer: "um hábito que pode prejudicar equilíbrio alimentar e saúde geral",
        why: "esses produtos costumam concentrar sal, acucar e gordura em excesso"
      }
    ]
  },
  {
    subtopico: "Postura e ergonomia",
    habilidade:
      "analisar postura, ergonomia e prevencao de desconfortos corporais",
    tags: ["postura", "ergonomia", "coluna"],
    fatos: [
      {
        lead: "a postura corporal",
        answer: "a forma como o corpo se alinha e se organiza em pe, sentado ou em movimento",
        why: "postura adequada favorece conforto e funcionalidade"
      },
      {
        lead: "a ergonomia",
        answer: "a adaptacao das atividades e do ambiente as características do corpo",
        why: "ela busca reduzir sobrecargas e melhorar execucao de tarefas"
      },
      {
        lead: "o uso correto da mochila",
        answer: "o transporte equilibrado da carga sem excessos e com ajuste apropriado",
        why: "isso ajuda a evitar desconfortos e tensoes desnecessarias"
      },
      {
        lead: "a alternancia de posicoes",
        answer: "a mudanca periodica da postura ao longo do tempo",
        why: "permanecer muito tempo na mesma posicao pode gerar desconforto"
      },
      {
        lead: "o alongamento postural",
        answer: "a prática de movimentos que favorecem mobilidade e alivio de tensoes",
        why: "ele pode contribuir para melhor consciência corporal"
      }
    ]
  },
  {
    subtopico: "Sono e recuperação",
    habilidade:
      "avaliar hábitos de alimentação, hidratação e recuperação corporal",
    tags: ["sono", "descanso", "recuperacao"],
    fatos: [
      {
        lead: "o sono regular",
        answer: "um período de descanso essencial para reposição física e mental",
        why: "dormir bem contribui para memoria, humor e recuperação"
      },
      {
        lead: "a recuperação corporal",
        answer: "o processo pelo qual o organismo reorganiza energias após o esforco",
        why: "descanso adequado evita fadiga acumulada"
      },
      {
        lead: "a privacao de sono",
        answer: "a reducao do tempo ou da qualidade do descanso noturno",
        why: "ela compromete atenção, disposição e rendimento"
      },
      {
        lead: "a rotina de sono",
        answer: "o conjunto de horários e hábitos que favorece descanso consistente",
        why: "regularidade ajuda o corpo a responder melhor ao ciclo diario"
      },
      {
        lead: "o excesso de estimulos antes de dormir",
        answer: "um fator que pode dificultar relaxamento e inicio do sono",
        why: "luz, ruido e agitacao interferem na recuperação"
      }
    ]
  },
  {
    subtopico: "Sedentarismo e riscos",
    habilidade:
      "reconhecer fatores de risco associados ao sedentarismo e a inatividade",
    tags: ["sedentarismo", "inatividade", "riscos a saúde"],
    fatos: [
      {
        lead: "o sedentarismo",
        answer: "um estilo de vida marcado por baixa movimentacao corporal cotidiana",
        why: "ele reduz gasto energetico e pode comprometer a saúde"
      },
      {
        lead: "a inatividade física",
        answer: "a ausencia de práticas corporais suficientes para manutencao da saúde",
        why: "ficar muito tempo parado tende a trazer prejuizos acumulados"
      },
      {
        lead: "o tempo excessivo em telas",
        answer: "um hábito que pode aumentar permanencia prolongada em repouso",
        why: "quando substitui movimento, ele favorece inatividade"
      },
      {
        lead: "a reducao da capacidade funcional",
        answer: "a perda de disposição e eficiencia para tarefas cotidianas",
        why: "a falta de movimento compromete condicionamento geral"
      },
      {
        lead: "a inserção de movimento na rotina",
        answer: "uma estratégia para combater sedentarismo no dia a dia",
        why: "pequenas mudancas podem ampliar gasto energetico e bem-estar"
      }
    ]
  },
  {
    subtopico: "Prevencao de lesoes",
    habilidade:
      "analisar postura, ergonomia e prevencao de desconfortos corporais",
    tags: ["prevencao", "lesoes", "segurança corporal"],
    fatos: [
      {
        lead: "a prevencao de lesoes",
        answer: "o cuidado antecipado para reduzir riscos durante exercicios e atividades",
        why: "boa técnica, aquecimento e orientação protegem o corpo"
      },
      {
        lead: "o aquecimento progressivo",
        answer: "uma preparacao corporal que antecede o esforco principal",
        why: "ele ajuda o organismo a responder melhor a atividade"
      },
      {
        lead: "a execucao técnica adequada",
        answer: "a realizacao correta dos movimentos exigidos pela prática",
        why: "gestos mal feitos podem gerar sobrecarga e dor"
      },
      {
        lead: "o respeito aos limites do corpo",
        answer: "a percepção de sinais de fadiga, dor e cansaco excessivo",
        why: "ignorar esses sinais aumenta risco de lesoes"
      },
      {
        lead: "o retorno a calma",
        answer: "a transicao gradual após o exercicio para estabilizar o organismo",
        why: "essa etapa ajuda o corpo a sair do esforco intenso"
      }
    ]
  },
  {
    subtopico: "Exercicio e saúde mental",
    habilidade:
      "relacionar atividade física, saúde mental e bem-estar social",
    tags: ["saúde mental", "exercicio", "bem-estar"],
    fatos: [
      {
        lead: "a relação entre exercicio e humor",
        answer: "a influencia positiva do movimento corporal sobre sensacoes de bem-estar",
        why: "atividades fisicas podem aliviar tensao e melhorar disposição"
      },
      {
        lead: "o alivio do estresse",
        answer: "a reducao de tensoes psicofisicas por meio de práticas corporais",
        why: "movimentar-se ajuda a reorganizar atenção e energia"
      },
      {
        lead: "a socializacao nas atividades fisicas",
        answer: "o fortalecimento de vinculos por meio de experiências corporais compartilhadas",
        why: "praticar com outras pessoas pode ampliar apoio e pertencimento"
      },
      {
        lead: "a autoestima corporal",
        answer: "a forma como a pessoa percebe e valoriza o próprio corpo",
        why: "vivencias positivas com o movimento podem favorecer essa construção"
      },
      {
        lead: "o autocuidado ativo",
        answer: "a escolha de práticas que ajudam a preservar equilíbrio fisico e mental",
        why: "cuidar do corpo também significa cuidar da saúde emocional"
      }
    ]
  },
  {
    subtopico: "Imagem corporal e autocuidado",
    habilidade:
      "relacionar atividade física, saúde mental e bem-estar social",
    tags: ["imagem corporal", "autocuidado", "diversidade"],
    fatos: [
      {
        lead: "a imagem corporal",
        answer: "a percepção que a pessoa constroi sobre o próprio corpo",
        why: "ela pode ser influenciada por experiências, relações e discursos sociais"
      },
      {
        lead: "o autocuidado",
        answer: "o conjunto de atitudes voltadas a preservar saúde e bem-estar",
        why: "ele envolve escolhas conscientes sobre descanso, higiene e movimento"
      },
      {
        lead: "a comparacao corporal excessiva",
        answer: "um comportamento que pode gerar insatisfacao e sofrimento",
        why: "padrões irreais dificultam relação saudavel com o próprio corpo"
      },
      {
        lead: "a diversidade de corpos",
        answer: "o reconhecimento de diferentes formas, tamanhos e capacidades corporais",
        why: "valorizar essa diversidade combate preconceitos e simplificacoes"
      },
      {
        lead: "o cuidado sem extremismos",
        answer: "a busca de saúde por meios equilibrados e não por imposicoes nocivas",
        why: "práticas radicais podem prejudicar mais do que ajudar"
      }
    ]
  },
  {
    subtopico: "Hábitos saudaveis no cotidiano",
    habilidade:
      "avaliar hábitos de alimentação, hidratação e recuperação corporal",
    tags: ["hábitos saudaveis", "rotina", "qualidade de vida"],
    fatos: [
      {
        lead: "um hábito saudavel",
        answer: "uma prática cotidiana que contribui para manter equilíbrio fisico e mental",
        why: "saúde depende de repeticao de boas escolhas ao longo do tempo"
      },
      {
        lead: "a regularidade nas refeicoes",
        answer: "a organização alimentar em horários e composicoes adequadas",
        why: "essa rotina ajuda a sustentar energia e bem-estar"
      },
      {
        lead: "a prática corporal frequente",
        answer: "a inserção constante de movimento na semana",
        why: "ela é mais eficaz quando faz parte do cotidiano"
      },
      {
        lead: "o equilíbrio entre estudo, descanso e atividade",
        answer: "a distribuicao harmoniosa das demandas da rotina",
        why: "rotinas desequilibradas podem gerar cansaco e queda de rendimento"
      },
      {
        lead: "a autonomia no cuidado com o corpo",
        answer: "a capacidade de fazer escolhas conscientes favoraveis a saúde",
        why: "desenvolver autonomia fortalece responsabilidade e continuidade do cuidado"
      }
    ]
  }
];

export const saudeECorpo = {
  id: "educacao-fisica_saude_e_corpo",
  materia: "Educação Física",
  serie: [2],
  topico: "Saúde e Corpo",
  metadados: {
    disciplinaId: "educacao-fisica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Educação Física",
    frente: "Corpo, hábitos e promoção da saúde",
    searchAliases: [
      "saúde e corpo",
      "aptidão física",
      "alimentação e hidratação",
      "postura e ergonomia",
      "saúde mental"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar componentes da aptidão física relacionados a saúde",
      "relacionar funcionamento do corpo humano com prática de exercicios",
      "avaliar hábitos de alimentação, hidratação e recuperação corporal",
      "analisar postura, ergonomia e prevencao de desconfortos corporais",
      "relacionar atividade física, saúde mental e bem-estar social"
    ],
    planejamentoQuestoes: PHYSICAL_EDUCATION_HUNDRED_PLAN,
    auditado: true,
    auditadoEm: "2026-04-11"
  },
  questoes: buildPlannedQuestions({
    prefix: "sc",
    serie: 2,
    materia: "Educação Física",
    topico: "Saúde e Corpo",
    blocos,
    stemBuilders: PHYSICAL_EDUCATION_STEM_BUILDERS,
    globalMatrix: PHYSICAL_EDUCATION_HUNDRED_MATRIX
  })
};
