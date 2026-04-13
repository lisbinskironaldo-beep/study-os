import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  CHEMISTRY_HUNDRED_FIFTY_MATRIX,
  CHEMISTRY_HUNDRED_FIFTY_PLAN,
  CHEMISTRY_STEM_BUILDERS
} from "../../../_shared/chemistryTopicPresets.js";

const blocos = [
  {
    subtopico: "Energia e transformacoes quimicas",
    habilidade:
      "relacionar energia a transformacoes quimicas e fisicas",
    tags: ["energia", "transformacoes", "calor"],
    fatos: [
      {
        lead: "a termoquimica",
        answer: "o estudo das trocas de calor envolvidas em transformacoes quimicas",
        why: "ela analisa energia liberada ou absorvida nas reacoes"
      },
      {
        lead: "a energia quimica",
        answer: "a energia associada as ligacoes e a organizacao das particulas nas substancias",
        why: "mudancas nessa organizacao provocam trocas energeticas"
      },
      {
        lead: "uma transformacao exotermica",
        answer: "a transformacao que libera calor para o ambiente",
        why: "o sistema perde energia na forma de calor"
      },
      {
        lead: "uma transformacao endotermica",
        answer: "a transformacao que absorve calor do ambiente",
        why: "o sistema precisa receber energia para ocorrer"
      },
      {
        lead: "o calor em termoquimica",
        answer: "a forma de transferencia de energia associada a diferenca de temperatura",
        why: "ele e a principal grandeza observada nesse estudo"
      }
    ]
  },
  {
    subtopico: "Entalpia",
    habilidade:
      "identificar e interpretar o conceito de entalpia",
    tags: ["entalpia", "variacao de entalpia", "delta h"],
    fatos: [
      {
        lead: "a entalpia",
        answer: "a grandeza associada ao conteudo energetico de um sistema em determinadas condicoes",
        why: "ela e muito usada para estudar reacoes a pressao constante"
      },
      {
        lead: "a variacao de entalpia",
        answer: "a diferenca entre a entalpia dos produtos e a dos reagentes",
        why: "esse valor indica se a reacao libera ou absorve calor"
      },
      {
        lead: "um delta H negativo",
        answer: "a indicacao de reacao exotermica",
        why: "produtos ficam com entalpia menor que reagentes"
      },
      {
        lead: "um delta H positivo",
        answer: "a indicacao de reacao endotermica",
        why: "o sistema absorve energia ao se transformar"
      },
      {
        lead: "a unidade comum da entalpia de reacao",
        answer: "o quilojoule por mol ou o quilojoule para a equacao considerada",
        why: "essa unidade expressa energia associada ao processo"
      }
    ]
  },
  {
    subtopico: "Reacoes exotermicas e endotermicas",
    habilidade:
      "classificar processos quanto ao sentido da troca de calor",
    tags: ["exotermica", "endotermica", "troca de calor"],
    fatos: [
      {
        lead: "uma reacao exotermica",
        answer: "a reacao que aquece o ambiente ao liberar energia",
        why: "a temperatura externa pode aumentar durante o processo"
      },
      {
        lead: "uma reacao endotermica",
        answer: "a reacao que retira energia do ambiente para acontecer",
        why: "o meio pode resfriar-se ao fornecer calor ao sistema"
      },
      {
        lead: "a combustao como exemplo",
        answer: "um processo tipicamente exotermico",
        why: "ela libera grande quantidade de energia"
      },
      {
        lead: "a fotossintese como exemplo",
        answer: "um processo global de carater endotermico",
        why: "ele exige absorcao de energia luminosa"
      },
      {
        lead: "a classificacao termoquimica de uma reacao",
        answer: "a analise do sentido da troca de calor entre sistema e ambiente",
        why: "isso define o carater exotermico ou endotermico"
      }
    ]
  },
  {
    subtopico: "Equacoes termoquimicas",
    habilidade:
      "interpretar equacoes termoquimicas e seus dados energeticos",
    tags: ["equacao termoquimica", "delta h", "estado fisico"],
    fatos: [
      {
        lead: "uma equacao termoquimica",
        answer: "a equacao quimica acompanhada do valor de energia associado a transformacao",
        why: "ela informa reagentes, produtos e variacao entalpica"
      },
      {
        lead: "o estado fisico na equacao termoquimica",
        answer: "a informacao importante porque a entalpia depende da forma fisica das substancias",
        why: "solido, liquido e gasoso possuem energias diferentes"
      },
      {
        lead: "o valor de delta H na equacao",
        answer: "a energia envolvida na reacao tal como a equacao esta escrita",
        why: "mudar coeficientes altera proporcionalmente esse valor"
      },
      {
        lead: "a inversao da equacao termoquimica",
        answer: "a operacao que troca o sinal do delta H",
        why: "o sentido da reacao e invertido e a energia acompanha essa mudanca"
      },
      {
        lead: "a multiplicacao dos coeficientes da equacao",
        answer: "a operacao que multiplica na mesma proporcao o valor de delta H",
        why: "a energia acompanha a escala da reacao"
      }
    ]
  },
  {
    subtopico: "Entalpia de formacao",
    habilidade:
      "identificar diferentes tipos de entalpia de processo",
    tags: ["entalpia de formacao", "substancia simples", "padrao"],
    fatos: [
      {
        lead: "a entalpia de formacao",
        answer: "a variacao de entalpia associada a formacao de um mol de composto a partir de substancias simples",
        why: "essa grandeza e usada como referencia em varios calculos"
      },
      {
        lead: "a substancia simples no estado padrao",
        answer: "a referencia adotada para definir entalpias de formacao",
        why: "por convencao, sua entalpia de formacao e zero"
      },
      {
        lead: "o uso das entalpias de formacao",
        answer: "o calculo do delta H de reacoes por dados tabulados",
        why: "elas permitem comparar energias de reagentes e produtos"
      },
      {
        lead: "a entalpia padrao de formacao",
        answer: "a entalpia de formacao medida em condicoes padrao",
        why: "ela aparece em tabelas termodinamicas"
      },
      {
        lead: "a soma das entalpias de formacao",
        answer: "o procedimento usado para calcular a variacao de entalpia total da reacao",
        why: "produtos e reagentes entram com sinais diferentes"
      }
    ]
  },
  {
    subtopico: "Entalpia de combustao",
    habilidade:
      "identificar diferentes tipos de entalpia de processo",
    tags: ["combustao", "entalpia de combustao", "energia"],
    fatos: [
      {
        lead: "a entalpia de combustao",
        answer: "a energia liberada na combustao completa de certa quantidade de substancia",
        why: "ela mede o potencial energetico do combustivel"
      },
      {
        lead: "a combustao completa de um hidrocarboneto",
        answer: "a reacao que produz principalmente dioxido de carbono e agua",
        why: "nessa condicao a oxidacao e mais total"
      },
      {
        lead: "o valor negativo da entalpia de combustao",
        answer: "a indicacao de que a combustao libera calor",
        why: "combustoes sao tipicamente exotermicas"
      },
      {
        lead: "o combustivel com maior energia de combustao",
        answer: "a substancia capaz de liberar maior quantidade de energia por quantidade considerada",
        why: "isso interessa a comparacoes energeticas"
      },
      {
        lead: "a aplicacao da entalpia de combustao",
        answer: "a analise do poder energetico de combustiveis usados no cotidiano e na industria",
        why: "ela auxilia escolhas tecnicas e economicas"
      }
    ]
  },
  {
    subtopico: "Lei de Hess",
    habilidade:
      "aplicar a lei de Hess no calculo de variacoes de entalpia",
    tags: ["lei de hess", "somatorio", "entalpia"],
    fatos: [
      {
        lead: "a lei de Hess",
        answer: "o principio de que a variacao total de entalpia independe do caminho percorrido",
        why: "so os estados inicial e final importam para o delta H"
      },
      {
        lead: "o somatorio de equacoes na lei de Hess",
        answer: "a combinacao de equacoes intermediarias para obter a reacao desejada",
        why: "os deltas H tambem se somam algebricamente"
      },
      {
        lead: "a utilidade da lei de Hess",
        answer: "o calculo do delta H de reacoes dificeis de medir diretamente",
        why: "ela usa dados de outras transformacoes conhecidas"
      },
      {
        lead: "a inversao de uma equacao na lei de Hess",
        answer: "a operacao que exige trocar o sinal de seu delta H",
        why: "o sentido da transformacao foi invertido"
      },
      {
        lead: "a multiplicacao de uma equacao na lei de Hess",
        answer: "a operacao que exige multiplicar o delta H pelo mesmo fator",
        why: "energia escala junto com a equacao"
      }
    ]
  },
  {
    subtopico: "Diagramas de entalpia",
    habilidade:
      "interpretar representacoes graficas de variacao de entalpia",
    tags: ["diagramas", "entalpia", "energia de ativacao"],
    fatos: [
      {
        lead: "o diagrama de entalpia",
        answer: "a representacao grafica do nivel energetico de reagentes e produtos",
        why: "ele facilita visualizar se a reacao libera ou absorve calor"
      },
      {
        lead: "a energia de ativacao",
        answer: "a energia minima necessaria para iniciar a transformacao",
        why: "mesmo reacoes exotermicas precisam superar essa barreira"
      },
      {
        lead: "a altura maior dos reagentes no diagrama",
        answer: "a indicacao de reacao exotermica quando os produtos ficam abaixo",
        why: "a diferenca representa energia liberada"
      },
      {
        lead: "a altura maior dos produtos no diagrama",
        answer: "a indicacao de reacao endotermica",
        why: "o sistema terminou com maior entalpia"
      },
      {
        lead: "o efeito de um catalisador no diagrama",
        answer: "a reducao da energia de ativacao sem alterar o delta H total",
        why: "catalisadores mudam a velocidade, nao o saldo energetico final"
      }
    ]
  },
  {
    subtopico: "Energia de ligacao",
    habilidade:
      "relacionar quebra e formacao de ligacoes as trocas de energia",
    tags: ["energia de ligacao", "quebra", "formacao"],
    fatos: [
      {
        lead: "a quebra de ligacoes",
        answer: "o processo que exige absorcao de energia",
        why: "romper interacoes entre atomos consome energia"
      },
      {
        lead: "a formacao de ligacoes",
        answer: "o processo que libera energia para o meio",
        why: "sistemas mais estaveis se formam ao ligar atomos"
      },
      {
        lead: "a energia de ligacao",
        answer: "a medida da energia envolvida na ruptura de uma ligacao quimica",
        why: "ela ajuda a estimar o comportamento energetico de reacoes"
      },
      {
        lead: "o saldo energetico de uma reacao",
        answer: "a diferenca entre energia absorvida para quebrar ligacoes e energia liberada ao formar novas",
        why: "esse saldo define o delta H"
      },
      {
        lead: "a explicacao energetica de uma reacao exotermica",
        answer: "a situacao em que a formacao de ligacoes libera mais energia do que a quebra consome",
        why: "o resultado final e liberacao de calor"
      }
    ]
  },
  {
    subtopico: "Aplicacoes da termoquimica",
    habilidade:
      "aplicar conceitos termoquimicos a processos cotidianos e industriais",
    tags: ["cotidiano", "combustiveis", "aplicacoes"],
    fatos: [
      {
        lead: "a escolha de combustiveis",
        answer: "um problema que pode considerar entalpia de combustao e eficiencia energetica",
        why: "a termoquimica ajuda a comparar fontes de energia"
      },
      {
        lead: "as compressas frias instantaneas",
        answer: "um exemplo de processo endotermico usado no cotidiano",
        why: "elas absorvem calor do meio ao funcionar"
      },
      {
        lead: "o aquecimento por combustao domestica",
        answer: "um exemplo de processo exotermico",
        why: "a energia liberada aquece ambientes e alimentos"
      },
      {
        lead: "a termoquimica na industria",
        answer: "o controle de energia em processos de producao, combustao e sintese",
        why: "isso influencia custo e seguranca operacional"
      },
      {
        lead: "a utilidade da termoquimica",
        answer: "a compreensao e previsao das trocas de energia em transformacoes materiais",
        why: "ela conecta reatividade e aproveitamento energetico"
      }
    ]
  }
];

export const termoquimica = {
  id: "quimica_termoquimica",
  materia: "Quimica",
  serie: [2],
  topico: "Termoquimica",
  metadados: {
    disciplinaId: "quimica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Quimica",
    frente: "Trocas de energia nas reacoes",
    searchAliases: [
      "termoquimica",
      "entalpia",
      "lei de hess",
      "reacoes exotermicas endotermicas",
      "entalpia de combustao"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "relacionar energia a transformacoes quimicas e fisicas",
      "identificar e interpretar o conceito de entalpia",
      "classificar processos quanto ao sentido da troca de calor",
      "aplicar a lei de Hess no calculo de variacoes de entalpia",
      "relacionar quebra e formacao de ligacoes as trocas de energia"
    ],
    planejamentoQuestoes: CHEMISTRY_HUNDRED_FIFTY_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "tq",
    serie: 2,
    materia: "Quimica",
    topico: "Termoquimica",
    blocos,
    stemBuilders: CHEMISTRY_STEM_BUILDERS,
    globalMatrix: CHEMISTRY_HUNDRED_FIFTY_MATRIX
  })
};

