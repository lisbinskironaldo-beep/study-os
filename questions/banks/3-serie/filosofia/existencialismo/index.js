import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  PHILOSOPHY_HUNDRED_MATRIX,
  PHILOSOPHY_HUNDRED_PLAN,
  PHILOSOPHY_STEM_BUILDERS
} from "../../../_shared/philosophyTopicPresets.js";

const blocos = [
  {
    subtopico: "Origem e contexto do existencialismo",
    habilidade:
      "compreender o contexto historico e conceitual do existencialismo",
    tags: ["existencialismo", "contexto", "existencia"],
    fatos: [
      {
        lead: "o existencialismo",
        answer: "a corrente que enfatiza liberdade, escolha e responsabilidade da existência humana",
        why: "ela se concentra no modo concreto de viver no mundo"
      },
      {
        lead: "o contexto do existencialismo",
        answer: "o ambiente de crises, guerras e inquietacoes sobre sentido da vida no mundo moderno",
        why: "esses problemas intensificaram reflexoes sobre angustia e liberdade"
      },
      {
        lead: "a existência concreta",
        answer: "a vida humana vivida em situações, escolhas e conflitos reais",
        why: "o existencialismo parte da experiência e não de essencias abstratas"
      },
      {
        lead: "a centralidade do individuo no existencialismo",
        answer: "o foco na pessoa singular que escolhe e responde por seus atos",
        why: "a existência individual é o ponto de partida dessa filosofia"
      },
      {
        lead: "a crise de sentido moderna",
        answer: "a experiência de perda de referencias estaveis para orientar a vida",
        why: "o existencialismo procura pensar justamente essa situação"
      }
    ]
  },
  {
    subtopico: "Kierkegaard",
    habilidade:
      "identificar autores e conceitos fundamentais do existencialismo",
    tags: ["kierkegaard", "individuo", "escolha"],
    fatos: [
      {
        lead: "Kierkegaard",
        answer: "o pensador que destacou subjetividade, escolha e relação singular com a existência",
        why: "ele é frequentemente visto como precursor do existencialismo"
      },
      {
        lead: "a verdade subjetiva em Kierkegaard",
        answer: "a importância da apropriação pessoal de uma verdade vivida",
        why: "o essencial não é apenas saber algo, mas existir de acordo com isso"
      },
      {
        lead: "a escolha existencial",
        answer: "a decisão pessoal que compromete o individuo com um modo de vida",
        why: "escolher define quem se torna"
      },
      {
        lead: "a angustia em Kierkegaard",
        answer: "a experiência ligada a abertura da liberdade é a possibilidade de escolha",
        why: "ser livre também significa enfrentar incerteza"
      },
      {
        lead: "o individuo singular",
        answer: "a pessoa concreta considerada irredutivel a categorias gerais abstratas",
        why: "Kierkegaard crítica sistemas que apagam singularidade"
      }
    ]
  },
  {
    subtopico: "Heidegger é o ser-no-mundo",
    habilidade:
      "identificar autores e conceitos fundamentais do existencialismo",
    tags: ["heidegger", "ser-no-mundo", "existencia"],
    fatos: [
      {
        lead: "o ser-no-mundo",
        answer: "a ideia de que a existência humana esta sempre inserida em um contexto de relações",
        why: "o humano não existe isolado de mundo, tempo e outros"
      },
      {
        lead: "o Dasein",
        answer: "o ente humano compreendido como aquele que se pergunta pelo ser",
        why: "Heidegger usa esse termo para pensar a existência humana"
      },
      {
        lead: "a cotidianidade",
        answer: "o modo comum e rotineiro em que a existência costuma se desenrolar",
        why: "nela, o individuo pode perder-se em conformismo"
      },
      {
        lead: "a autenticidade em Heidegger",
        answer: "a assuncao própria da existência e de suas possibilidades",
        why: "ela se opoe a vida impessoal guiada pelo se faz"
      },
      {
        lead: "a temporalidade da existência",
        answer: "o fato de que o humano se compreende em relação a passado, presente e futuro",
        why: "o tempo e constitutivo do existir"
      }
    ]
  },
  {
    subtopico: "Sartre é a liberdade",
    habilidade:
      "identificar autores e conceitos fundamentais do existencialismo",
    tags: ["sartre", "liberdade", "responsabilidade"],
    fatos: [
      {
        lead: "Jean-Paul Sartre",
        answer: "o filosofo que formulou o existencialismo como filosofia da liberdade radical",
        why: "ele enfatiza escolha e responsabilidade em cada existência"
      },
      {
        lead: "a frase de Sartre sobre a existência preceder a essencia",
        answer: "a tese de que o ser humano primeiro existe e depois se define por suas escolhas",
        why: "não haveria natureza humana pronta determinando o individuo"
      },
      {
        lead: "a liberdade em Sartre",
        answer: "a condição de ter de escolher e responder pelo que se faz",
        why: "mesmo não escolher ja é uma forma de escolha"
      },
      {
        lead: "a responsabilidade existencial",
        answer: "o dever de assumir as consequências das próprias escolhas",
        why: "não ha como transferir completamente a outros o peso da decisão"
      },
      {
        lead: "a condenacao a liberdade",
        answer: "a ideia sartreana de que o humano não pode escapar da necessidade de escolher",
        why: "liberdade não aparece como conforto, mas como tarefa"
      }
    ]
  },
  {
    subtopico: "Angustia, escolha e responsabilidade",
    habilidade:
      "analisar conceitos existencialistas ligados a liberdade, angustia e autenticidade",
    tags: ["angustia", "escolha", "responsabilidade"],
    fatos: [
      {
        lead: "a angustia existencial",
        answer: "a experiência de sentir o peso da liberdade e da indeterminacao",
        why: "ela surge quando percebemos que nossas escolhas nos cabem"
      },
      {
        lead: "a escolha autentica",
        answer: "a decisão assumida com consciência e sem refugio em desculpas externas",
        why: "ela expressa apropriação da própria vida"
      },
      {
        lead: "a responsabilidade no existencialismo",
        answer: "a exigencia de responder pelos atos praticados e pelo modo de existir",
        why: "liberdade sem responsabilidade seria contraditoria"
      },
      {
        lead: "a possibilidade",
        answer: "o conjunto de caminhos que se abrem ao individuo em sua existência",
        why: "o humano vive projetando-se para o que pode ser"
      },
      {
        lead: "a decisão sob incerteza",
        answer: "a necessidade de escolher mesmo sem garantia absoluta sobre resultados",
        why: "o existencialismo rejeita segurancas totais para agir"
      }
    ]
  },
  {
    subtopico: "Ma-fe e autenticidade",
    habilidade:
      "analisar conceitos existencialistas ligados a liberdade, angustia e autenticidade",
    tags: ["ma-fe", "autenticidade", "autoengano"],
    fatos: [
      {
        lead: "a ma-fe em Sartre",
        answer: "o autoengano pelo qual a pessoa tenta negar sua própria liberdade",
        why: "ela procura esconder de si a responsabilidade por escolher"
      },
      {
        lead: "o autoengano existencial",
        answer: "a tentativa de apresentar-se como totalmente determinado por papeis ou circunstancias",
        why: "isso reduz artificialmente a liberdade humana"
      },
      {
        lead: "a autenticidade existencial",
        answer: "a assuncao sincera da própria liberdade e situação",
        why: "ser autentico e não se esconder atras de mascaras confortaveis"
      },
      {
        lead: "o papel social no existencialismo",
        answer: "uma dimensao real da vida que não elimina a responsabilidade individual",
        why: "ocupar um papel não basta para anular escolha"
      },
      {
        lead: "a desculpa determinista na ma-fe",
        answer: "o recurso de atribuir a outros ou ao destino aquilo que também depende de escolha própria",
        why: "essa fuga enfraquece a autenticidade"
      }
    ]
  },
  {
    subtopico: "Camus é o absurdo",
    habilidade:
      "identificar autores e conceitos fundamentais do existencialismo",
    tags: ["camus", "absurdo", "revolta"],
    fatos: [
      {
        lead: "o absurdo em Camus",
        answer: "o desencontro entre a busca humana por sentido é o silencio do mundo",
        why: "a experiência absurda nasce dessa tensao"
      },
      {
        lead: "a revolta em Camus",
        answer: "a atitude de afirmar a vida mesmo sem garantia de sentido ultimo",
        why: "ela responde ao absurdo sem resignacao"
      },
      {
        lead: "o mito de Sisifo",
        answer: "a imagem usada por Camus para pensar a repeticao é o desafio de existir",
        why: "Sisifo simboliza a condição humana diante do absurdo"
      },
      {
        lead: "a recusa do suicídio filosófico",
        answer: "a crítica a fugas que anulam o problema do absurdo por consolacoes prontas",
        why: "Camus propoe enfrentar a condição absurda lucidamente"
      },
      {
        lead: "a lucidez em Camus",
        answer: "a consciência clara da ausencia de fundamento definitivo sem abandonar a vida",
        why: "essa lucidez sustenta a revolta"
      }
    ]
  },
  {
    subtopico: "Simone de Beauvoir",
    habilidade:
      "relacionar existencialismo a problemas de gênero, alteridade e vida social",
    tags: ["simone de beauvoir", "alteridade", "genero"],
    fatos: [
      {
        lead: "Simone de Beauvoir",
        answer: "a pensadora que articulou existencialismo, liberdade e crítica das opressoes de gênero",
        why: "ela ampliou o alcance social do existencialismo"
      },
      {
        lead: "a ideia de que não se nasce mulher",
        answer: "a tese de que papeis femininos são historicamente construidos",
        why: "Beauvoir crítica naturalizacoes da desigualdade"
      },
      {
        lead: "a alteridade em Beauvoir",
        answer: "a condição de ser definido como outro em relações de dominacao",
        why: "ela mostra como grupos podem ser subordinados simbolicamente"
      },
      {
        lead: "a liberdade situada",
        answer: "a liberdade vivida dentro de condicoes historicas e sociais concretas",
        why: "Beauvoir evita pensar liberdade como abstracao desencarnada"
      },
      {
        lead: "a opressao de gênero",
        answer: "a desigualdade produzida por normas e instituicoes que limitam a autonomia feminina",
        why: "esse problema é central em sua obra"
      }
    ]
  },
  {
    subtopico: "Existencialismo é o outro",
    habilidade:
      "relacionar existencialismo a problemas de gênero, alteridade e vida social",
    tags: ["o outro", "alteridade", "relações humanas"],
    fatos: [
      {
        lead: "o outro no existencialismo",
        answer: "a presenca de outra liberdade que participa da constituicao da experiência humana",
        why: "não existimos sozinhos, mas diante de outros sujeitos"
      },
      {
        lead: "o conflito entre liberdades",
        answer: "a tensao que surge quando diferentes sujeitos afirmam seus projetos",
        why: "a convivencia pode envolver disputa por reconhecimento"
      },
      {
        lead: "o reconhecimento do outro",
        answer: "a compreensao de que a própria existência se relaciona com outras consciencias",
        why: "a alteridade e parte constitutiva da vida humana"
      },
      {
        lead: "a relação entre liberdade e convivencia",
        answer: "o desafio de afirmar-se sem negar a liberdade alheia",
        why: "existência humana tem dimensao necessariamente intersubjetiva"
      },
      {
        lead: "a responsabilidade diante do outro",
        answer: "o dever de considerar impactos de nossas escolhas nas outras pessoas",
        why: "a liberdade não é isolada de mundo comum"
      }
    ]
  },
  {
    subtopico: "Existencialismo e cotidiano",
    habilidade:
      "relacionar existencialismo a problemas de gênero, alteridade e vida social",
    tags: ["cotidiano", "sentido da vida", "existencia"],
    fatos: [
      {
        lead: "o existencialismo no cotidiano",
        answer: "a aplicacao da reflexão sobre liberdade e responsabilidade as escolhas diarias",
        why: "essa filosofia não fica restrita a sistemas abstratos"
      },
      {
        lead: "a busca de sentido",
        answer: "o esforco de orientar a vida por escolhas assumidas e não por automatismos",
        why: "existir implica dar direcao ao próprio viver"
      },
      {
        lead: "a relação com o outro no existencialismo",
        answer: "o encontro com outras liberdades que também condiciona a experiência humana",
        why: "não existimos sozinhos, mas em situação compartilhada"
      },
      {
        lead: "a autenticidade cotidiana",
        answer: "a tentativa de viver sem fugir do peso das próprias decisões",
        why: "ela exige consciência e compromisso com a vida concreta"
      },
      {
        lead: "o legado do existencialismo",
        answer: "a insistencia em pensar liberdade, responsabilidade e sentido no mundo moderno",
        why: "essas questoes permanecem vivas no presente"
      }
    ]
  }
];

export const existencialismo = {
  id: "filosofia_existencialismo",
  materia: "Filosofia",
  serie: [3],
  topico: "Existencialismo",
  metadados: {
    disciplinaId: "filosofia",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Filosofia",
    frente: "Liberdade, angustia e sentido da existência",
    searchAliases: [
      "existencialismo",
      "sartre camus beauvoir",
      "ma-fe",
      "angustia existencial",
      "existência precede essencia"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "compreender o contexto historico e conceitual do existencialismo",
      "identificar autores e conceitos fundamentais do existencialismo",
      "analisar conceitos existencialistas ligados a liberdade, angustia e autenticidade",
      "relacionar existencialismo a problemas de gênero, alteridade e vida social",
      "avaliar a atualidade das questoes existencialistas no cotidiano"
    ],
    planejamentoQuestoes: PHILOSOPHY_HUNDRED_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "ex",
    serie: 3,
    materia: "Filosofia",
    topico: "Existencialismo",
    blocos,
    stemBuilders: PHILOSOPHY_STEM_BUILDERS,
    globalMatrix: PHILOSOPHY_HUNDRED_MATRIX
  })
};
