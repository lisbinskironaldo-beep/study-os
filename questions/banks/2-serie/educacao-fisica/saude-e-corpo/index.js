import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  PHYSICAL_EDUCATION_HUNDRED_MATRIX,
  PHYSICAL_EDUCATION_HUNDRED_PLAN,
  PHYSICAL_EDUCATION_STEM_BUILDERS
} from "../../../_shared/physicalEducationTopicPresets.js";

const blocos = [
  {
    subtopico: "Aptidao fisica e componentes",
    habilidade:
      "identificar componentes da aptidao fisica relacionados a saude",
    tags: ["aptidao fisica", "condicionamento", "saude"],
    fatos: [
      {
        lead: "a aptidao fisica",
        answer: "a capacidade do corpo de realizar atividades com eficiencia e seguranca",
        why: "ela relaciona desempenho motor e condicoes de saude"
      },
      {
        lead: "a resistencia cardiorrespiratoria",
        answer: "a capacidade de sustentar esforcos que envolvem coracao e pulmoes",
        why: "ela e importante para atividades prolongadas"
      },
      {
        lead: "a forca muscular",
        answer: "a capacidade de produzir tensao para mover ou sustentar cargas",
        why: "ela apoia postura, locomocao e autonomia funcional"
      },
      {
        lead: "a flexibilidade",
        answer: "a amplitude de movimento possivel em articulacoes e segmentos corporais",
        why: "ela favorece mobilidade e execucao de gestos"
      },
      {
        lead: "a composicao corporal",
        answer: "a relacao entre diferentes componentes do corpo, como massa magra e gordura",
        why: "ela ajuda a compreender aspectos do estado fisico"
      }
    ]
  },
  {
    subtopico: "Sistemas do corpo e exercicio",
    habilidade:
      "relacionar funcionamento do corpo humano com pratica de exercicios",
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
        why: "na atividade fisica, ele atua para suprir maior demanda de oxigenio"
      },
      {
        lead: "o sistema muscular",
        answer: "o conjunto de estruturas que possibilita movimento e estabilizacao corporal",
        why: "ele e diretamente acionado na pratica de exercicios"
      },
      {
        lead: "o sistema esqueletico",
        answer: "a estrutura de sustentacao e protecao que apoia os movimentos do corpo",
        why: "ossos e articulacoes permitem alavancas e deslocamentos"
      },
      {
        lead: "a adaptacao ao treino",
        answer: "a resposta progressiva do corpo aos estimulos repetidos de exercicio",
        why: "com pratica orientada, o organismo melhora eficiencia funcional"
      }
    ]
  },
  {
    subtopico: "Alimentacao e hidratacao",
    habilidade:
      "avaliar habitos de alimentacao, hidratacao e recuperacao corporal",
    tags: ["alimentacao", "hidratacao", "energia"],
    fatos: [
      {
        lead: "a alimentacao equilibrada",
        answer: "o consumo variado de nutrientes em quantidade adequada ao organismo",
        why: "ela fornece energia e materiais para funcionamento corporal"
      },
      {
        lead: "a hidratacao regular",
        answer: "a reposicao frequente de agua para manter equilibrio corporal",
        why: "perdas de liquido durante o dia e no exercicio precisam ser compensadas"
      },
      {
        lead: "os carboidratos",
        answer: "nutrientes que funcionam como importante fonte de energia para o corpo",
        why: "eles ajudam a sustentar esforcos e atividades cotidianas"
      },
      {
        lead: "as proteinas",
        answer: "nutrientes ligados a formacao e reparo de tecidos do organismo",
        why: "elas participam da recuperacao apos esforcos"
      },
      {
        lead: "o consumo excessivo de ultraprocessados",
        answer: "um habito que pode prejudicar equilibrio alimentar e saude geral",
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
        answer: "a adaptacao das atividades e do ambiente as caracteristicas do corpo",
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
        answer: "a pratica de movimentos que favorecem mobilidade e alivio de tensoes",
        why: "ele pode contribuir para melhor consciencia corporal"
      }
    ]
  },
  {
    subtopico: "Sono e recuperacao",
    habilidade:
      "avaliar habitos de alimentacao, hidratacao e recuperacao corporal",
    tags: ["sono", "descanso", "recuperacao"],
    fatos: [
      {
        lead: "o sono regular",
        answer: "um periodo de descanso essencial para reposicao fisica e mental",
        why: "dormir bem contribui para memoria, humor e recuperacao"
      },
      {
        lead: "a recuperacao corporal",
        answer: "o processo pelo qual o organismo reorganiza energias apos o esforco",
        why: "descanso adequado evita fadiga acumulada"
      },
      {
        lead: "a privacao de sono",
        answer: "a reducao do tempo ou da qualidade do descanso noturno",
        why: "ela compromete atencao, disposicao e rendimento"
      },
      {
        lead: "a rotina de sono",
        answer: "o conjunto de horarios e habitos que favorece descanso consistente",
        why: "regularidade ajuda o corpo a responder melhor ao ciclo diario"
      },
      {
        lead: "o excesso de estimulos antes de dormir",
        answer: "um fator que pode dificultar relaxamento e inicio do sono",
        why: "luz, ruido e agitacao interferem na recuperacao"
      }
    ]
  },
  {
    subtopico: "Sedentarismo e riscos",
    habilidade:
      "reconhecer fatores de risco associados ao sedentarismo e a inatividade",
    tags: ["sedentarismo", "inatividade", "riscos a saude"],
    fatos: [
      {
        lead: "o sedentarismo",
        answer: "um estilo de vida marcado por baixa movimentacao corporal cotidiana",
        why: "ele reduz gasto energetico e pode comprometer a saude"
      },
      {
        lead: "a inatividade fisica",
        answer: "a ausencia de praticas corporais suficientes para manutencao da saude",
        why: "ficar muito tempo parado tende a trazer prejuizos acumulados"
      },
      {
        lead: "o tempo excessivo em telas",
        answer: "um habito que pode aumentar permanencia prolongada em repouso",
        why: "quando substitui movimento, ele favorece inatividade"
      },
      {
        lead: "a reducao da capacidade funcional",
        answer: "a perda de disposicao e eficiencia para tarefas cotidianas",
        why: "a falta de movimento compromete condicionamento geral"
      },
      {
        lead: "a insercao de movimento na rotina",
        answer: "uma estrategia para combater sedentarismo no dia a dia",
        why: "pequenas mudancas podem ampliar gasto energetico e bem-estar"
      }
    ]
  },
  {
    subtopico: "Prevencao de lesoes",
    habilidade:
      "analisar postura, ergonomia e prevencao de desconfortos corporais",
    tags: ["prevencao", "lesoes", "seguranca corporal"],
    fatos: [
      {
        lead: "a prevencao de lesoes",
        answer: "o cuidado antecipado para reduzir riscos durante exercicios e atividades",
        why: "boa tecnica, aquecimento e orientacao protegem o corpo"
      },
      {
        lead: "o aquecimento progressivo",
        answer: "uma preparacao corporal que antecede o esforco principal",
        why: "ele ajuda o organismo a responder melhor a atividade"
      },
      {
        lead: "a execucao tecnica adequada",
        answer: "a realizacao correta dos movimentos exigidos pela pratica",
        why: "gestos mal feitos podem gerar sobrecarga e dor"
      },
      {
        lead: "o respeito aos limites do corpo",
        answer: "a percepcao de sinais de fadiga, dor e cansaco excessivo",
        why: "ignorar esses sinais aumenta risco de lesoes"
      },
      {
        lead: "o retorno a calma",
        answer: "a transicao gradual apos o exercicio para estabilizar o organismo",
        why: "essa etapa ajuda o corpo a sair do esforco intenso"
      }
    ]
  },
  {
    subtopico: "Exercicio e saude mental",
    habilidade:
      "relacionar atividade fisica, saude mental e bem-estar social",
    tags: ["saude mental", "exercicio", "bem-estar"],
    fatos: [
      {
        lead: "a relacao entre exercicio e humor",
        answer: "a influencia positiva do movimento corporal sobre sensacoes de bem-estar",
        why: "atividades fisicas podem aliviar tensao e melhorar disposicao"
      },
      {
        lead: "o alivio do estresse",
        answer: "a reducao de tensoes psicofisicas por meio de praticas corporais",
        why: "movimentar-se ajuda a reorganizar atencao e energia"
      },
      {
        lead: "a socializacao nas atividades fisicas",
        answer: "o fortalecimento de vinculos por meio de experiencias corporais compartilhadas",
        why: "praticar com outras pessoas pode ampliar apoio e pertencimento"
      },
      {
        lead: "a autoestima corporal",
        answer: "a forma como a pessoa percebe e valoriza o proprio corpo",
        why: "vivencias positivas com o movimento podem favorecer essa construcao"
      },
      {
        lead: "o autocuidado ativo",
        answer: "a escolha de praticas que ajudam a preservar equilibrio fisico e mental",
        why: "cuidar do corpo tambem significa cuidar da saude emocional"
      }
    ]
  },
  {
    subtopico: "Imagem corporal e autocuidado",
    habilidade:
      "relacionar atividade fisica, saude mental e bem-estar social",
    tags: ["imagem corporal", "autocuidado", "diversidade"],
    fatos: [
      {
        lead: "a imagem corporal",
        answer: "a percepcao que a pessoa constroi sobre o proprio corpo",
        why: "ela pode ser influenciada por experiencias, relacoes e discursos sociais"
      },
      {
        lead: "o autocuidado",
        answer: "o conjunto de atitudes voltadas a preservar saude e bem-estar",
        why: "ele envolve escolhas conscientes sobre descanso, higiene e movimento"
      },
      {
        lead: "a comparacao corporal excessiva",
        answer: "um comportamento que pode gerar insatisfacao e sofrimento",
        why: "padroes irreais dificultam relacao saudavel com o proprio corpo"
      },
      {
        lead: "a diversidade de corpos",
        answer: "o reconhecimento de diferentes formas, tamanhos e capacidades corporais",
        why: "valorizar essa diversidade combate preconceitos e simplificacoes"
      },
      {
        lead: "o cuidado sem extremismos",
        answer: "a busca de saude por meios equilibrados e nao por imposicoes nocivas",
        why: "praticas radicais podem prejudicar mais do que ajudar"
      }
    ]
  },
  {
    subtopico: "Habitos saudaveis no cotidiano",
    habilidade:
      "avaliar habitos de alimentacao, hidratacao e recuperacao corporal",
    tags: ["habitos saudaveis", "rotina", "qualidade de vida"],
    fatos: [
      {
        lead: "um habito saudavel",
        answer: "uma pratica cotidiana que contribui para manter equilibrio fisico e mental",
        why: "saude depende de repeticao de boas escolhas ao longo do tempo"
      },
      {
        lead: "a regularidade nas refeicoes",
        answer: "a organizacao alimentar em horarios e composicoes adequadas",
        why: "essa rotina ajuda a sustentar energia e bem-estar"
      },
      {
        lead: "a pratica corporal frequente",
        answer: "a insercao constante de movimento na semana",
        why: "ela e mais eficaz quando faz parte do cotidiano"
      },
      {
        lead: "o equilibrio entre estudo, descanso e atividade",
        answer: "a distribuicao harmoniosa das demandas da rotina",
        why: "rotinas desequilibradas podem gerar cansaco e queda de rendimento"
      },
      {
        lead: "a autonomia no cuidado com o corpo",
        answer: "a capacidade de fazer escolhas conscientes favoraveis a saude",
        why: "desenvolver autonomia fortalece responsabilidade e continuidade do cuidado"
      }
    ]
  }
];

export const saudeECorpo = {
  id: "educacao-fisica_saude_e_corpo",
  materia: "Educacao Fisica",
  serie: [2],
  topico: "Saude e Corpo",
  metadados: {
    disciplinaId: "educacao-fisica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Educacao Fisica",
    frente: "Corpo, habitos e promocao da saude",
    searchAliases: [
      "saude e corpo",
      "aptidao fisica",
      "alimentacao e hidratacao",
      "postura e ergonomia",
      "saude mental"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar componentes da aptidao fisica relacionados a saude",
      "relacionar funcionamento do corpo humano com pratica de exercicios",
      "avaliar habitos de alimentacao, hidratacao e recuperacao corporal",
      "analisar postura, ergonomia e prevencao de desconfortos corporais",
      "relacionar atividade fisica, saude mental e bem-estar social"
    ],
    planejamentoQuestoes: PHYSICAL_EDUCATION_HUNDRED_PLAN,
    auditado: true,
    auditadoEm: "2026-04-11"
  },
  questoes: buildPlannedQuestions({
    prefix: "sc",
    serie: 2,
    materia: "Educacao Fisica",
    topico: "Saude e Corpo",
    blocos,
    stemBuilders: PHYSICAL_EDUCATION_STEM_BUILDERS,
    globalMatrix: PHYSICAL_EDUCATION_HUNDRED_MATRIX
  })
};
