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
        answer: "a corrente que enfatiza liberdade, escolha e responsabilidade da existencia humana",
        why: "ela se concentra no modo concreto de viver no mundo"
      },
      {
        lead: "o contexto do existencialismo",
        answer: "o ambiente de crises, guerras e inquietacoes sobre sentido da vida no mundo moderno",
        why: "esses problemas intensificaram reflexoes sobre angustia e liberdade"
      },
      {
        lead: "a existencia concreta",
        answer: "a vida humana vivida em situacoes, escolhas e conflitos reais",
        why: "o existencialismo parte da experiencia e nao de essencias abstratas"
      },
      {
        lead: "a centralidade do individuo no existencialismo",
        answer: "o foco na pessoa singular que escolhe e responde por seus atos",
        why: "a existencia individual e o ponto de partida dessa filosofia"
      },
      {
        lead: "a crise de sentido moderna",
        answer: "a experiencia de perda de referencias estaveis para orientar a vida",
        why: "o existencialismo procura pensar justamente essa situacao"
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
        answer: "o pensador que destacou subjetividade, escolha e relacao singular com a existencia",
        why: "ele e frequentemente visto como precursor do existencialismo"
      },
      {
        lead: "a verdade subjetiva em Kierkegaard",
        answer: "a importancia da apropriacao pessoal de uma verdade vivida",
        why: "o essencial nao e apenas saber algo, mas existir de acordo com isso"
      },
      {
        lead: "a escolha existencial",
        answer: "a decisao pessoal que compromete o individuo com um modo de vida",
        why: "escolher define quem se torna"
      },
      {
        lead: "a angustia em Kierkegaard",
        answer: "a experiencia ligada a abertura da liberdade e a possibilidade de escolha",
        why: "ser livre tambem significa enfrentar incerteza"
      },
      {
        lead: "o individuo singular",
        answer: "a pessoa concreta considerada irredutivel a categorias gerais abstratas",
        why: "Kierkegaard critica sistemas que apagam singularidade"
      }
    ]
  },
  {
    subtopico: "Heidegger e o ser-no-mundo",
    habilidade:
      "identificar autores e conceitos fundamentais do existencialismo",
    tags: ["heidegger", "ser-no-mundo", "existencia"],
    fatos: [
      {
        lead: "o ser-no-mundo",
        answer: "a ideia de que a existencia humana esta sempre inserida em um contexto de relacoes",
        why: "o humano nao existe isolado de mundo, tempo e outros"
      },
      {
        lead: "o Dasein",
        answer: "o ente humano compreendido como aquele que se pergunta pelo ser",
        why: "Heidegger usa esse termo para pensar a existencia humana"
      },
      {
        lead: "a cotidianidade",
        answer: "o modo comum e rotineiro em que a existencia costuma se desenrolar",
        why: "nela, o individuo pode perder-se em conformismo"
      },
      {
        lead: "a autenticidade em Heidegger",
        answer: "a assuncao propria da existencia e de suas possibilidades",
        why: "ela se opoe a vida impessoal guiada pelo se faz"
      },
      {
        lead: "a temporalidade da existencia",
        answer: "o fato de que o humano se compreende em relacao a passado, presente e futuro",
        why: "o tempo e constitutivo do existir"
      }
    ]
  },
  {
    subtopico: "Sartre e a liberdade",
    habilidade:
      "identificar autores e conceitos fundamentais do existencialismo",
    tags: ["sartre", "liberdade", "responsabilidade"],
    fatos: [
      {
        lead: "Jean-Paul Sartre",
        answer: "o filosofo que formulou o existencialismo como filosofia da liberdade radical",
        why: "ele enfatiza escolha e responsabilidade em cada existencia"
      },
      {
        lead: "a frase de Sartre sobre a existencia preceder a essencia",
        answer: "a tese de que o ser humano primeiro existe e depois se define por suas escolhas",
        why: "nao haveria natureza humana pronta determinando o individuo"
      },
      {
        lead: "a liberdade em Sartre",
        answer: "a condicao de ter de escolher e responder pelo que se faz",
        why: "mesmo nao escolher ja e uma forma de escolha"
      },
      {
        lead: "a responsabilidade existencial",
        answer: "o dever de assumir as consequencias das proprias escolhas",
        why: "nao ha como transferir completamente a outros o peso da decisao"
      },
      {
        lead: "a condenacao a liberdade",
        answer: "a ideia sartreana de que o humano nao pode escapar da necessidade de escolher",
        why: "liberdade nao aparece como conforto, mas como tarefa"
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
        answer: "a experiencia de sentir o peso da liberdade e da indeterminacao",
        why: "ela surge quando percebemos que nossas escolhas nos cabem"
      },
      {
        lead: "a escolha autentica",
        answer: "a decisao assumida com consciencia e sem refugio em desculpas externas",
        why: "ela expressa apropriacao da propria vida"
      },
      {
        lead: "a responsabilidade no existencialismo",
        answer: "a exigencia de responder pelos atos praticados e pelo modo de existir",
        why: "liberdade sem responsabilidade seria contraditoria"
      },
      {
        lead: "a possibilidade",
        answer: "o conjunto de caminhos que se abrem ao individuo em sua existencia",
        why: "o humano vive projetando-se para o que pode ser"
      },
      {
        lead: "a decisao sob incerteza",
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
        answer: "o autoengano pelo qual a pessoa tenta negar sua propria liberdade",
        why: "ela procura esconder de si a responsabilidade por escolher"
      },
      {
        lead: "o autoengano existencial",
        answer: "a tentativa de apresentar-se como totalmente determinado por papeis ou circunstancias",
        why: "isso reduz artificialmente a liberdade humana"
      },
      {
        lead: "a autenticidade existencial",
        answer: "a assuncao sincera da propria liberdade e situacao",
        why: "ser autentico e nao se esconder atras de mascaras confortaveis"
      },
      {
        lead: "o papel social no existencialismo",
        answer: "uma dimensao real da vida que nao elimina a responsabilidade individual",
        why: "ocupar um papel nao basta para anular escolha"
      },
      {
        lead: "a desculpa determinista na ma-fe",
        answer: "o recurso de atribuir a outros ou ao destino aquilo que tambem depende de escolha propria",
        why: "essa fuga enfraquece a autenticidade"
      }
    ]
  },
  {
    subtopico: "Camus e o absurdo",
    habilidade:
      "identificar autores e conceitos fundamentais do existencialismo",
    tags: ["camus", "absurdo", "revolta"],
    fatos: [
      {
        lead: "o absurdo em Camus",
        answer: "o desencontro entre a busca humana por sentido e o silencio do mundo",
        why: "a experiencia absurda nasce dessa tensao"
      },
      {
        lead: "a revolta em Camus",
        answer: "a atitude de afirmar a vida mesmo sem garantia de sentido ultimo",
        why: "ela responde ao absurdo sem resignacao"
      },
      {
        lead: "o mito de Sisifo",
        answer: "a imagem usada por Camus para pensar a repeticao e o desafio de existir",
        why: "Sisifo simboliza a condicao humana diante do absurdo"
      },
      {
        lead: "a recusa do suicidio filosofico",
        answer: "a critica a fugas que anulam o problema do absurdo por consolacoes prontas",
        why: "Camus propoe enfrentar a condicao absurda lucidamente"
      },
      {
        lead: "a lucidez em Camus",
        answer: "a consciencia clara da ausencia de fundamento definitivo sem abandonar a vida",
        why: "essa lucidez sustenta a revolta"
      }
    ]
  },
  {
    subtopico: "Simone de Beauvoir",
    habilidade:
      "relacionar existencialismo a problemas de genero, alteridade e vida social",
    tags: ["simone de beauvoir", "alteridade", "genero"],
    fatos: [
      {
        lead: "Simone de Beauvoir",
        answer: "a pensadora que articulou existencialismo, liberdade e critica das opressoes de genero",
        why: "ela ampliou o alcance social do existencialismo"
      },
      {
        lead: "a ideia de que nao se nasce mulher",
        answer: "a tese de que papeis femininos sao historicamente construidos",
        why: "Beauvoir critica naturalizacoes da desigualdade"
      },
      {
        lead: "a alteridade em Beauvoir",
        answer: "a condicao de ser definido como outro em relacoes de dominacao",
        why: "ela mostra como grupos podem ser subordinados simbolicamente"
      },
      {
        lead: "a liberdade situada",
        answer: "a liberdade vivida dentro de condicoes historicas e sociais concretas",
        why: "Beauvoir evita pensar liberdade como abstracao desencarnada"
      },
      {
        lead: "a opressao de genero",
        answer: "a desigualdade produzida por normas e instituicoes que limitam a autonomia feminina",
        why: "esse problema e central em sua obra"
      }
    ]
  },
  {
    subtopico: "Existencialismo e o outro",
    habilidade:
      "relacionar existencialismo a problemas de genero, alteridade e vida social",
    tags: ["o outro", "alteridade", "relacoes humanas"],
    fatos: [
      {
        lead: "o outro no existencialismo",
        answer: "a presenca de outra liberdade que participa da constituicao da experiencia humana",
        why: "nao existimos sozinhos, mas diante de outros sujeitos"
      },
      {
        lead: "o conflito entre liberdades",
        answer: "a tensao que surge quando diferentes sujeitos afirmam seus projetos",
        why: "a convivencia pode envolver disputa por reconhecimento"
      },
      {
        lead: "o reconhecimento do outro",
        answer: "a compreensao de que a propria existencia se relaciona com outras consciencias",
        why: "a alteridade e parte constitutiva da vida humana"
      },
      {
        lead: "a relacao entre liberdade e convivencia",
        answer: "o desafio de afirmar-se sem negar a liberdade alheia",
        why: "existencia humana tem dimensao necessariamente intersubjetiva"
      },
      {
        lead: "a responsabilidade diante do outro",
        answer: "o dever de considerar impactos de nossas escolhas nas outras pessoas",
        why: "a liberdade nao e isolada de mundo comum"
      }
    ]
  },
  {
    subtopico: "Existencialismo e cotidiano",
    habilidade:
      "relacionar existencialismo a problemas de genero, alteridade e vida social",
    tags: ["cotidiano", "sentido da vida", "existencia"],
    fatos: [
      {
        lead: "o existencialismo no cotidiano",
        answer: "a aplicacao da reflexao sobre liberdade e responsabilidade as escolhas diarias",
        why: "essa filosofia nao fica restrita a sistemas abstratos"
      },
      {
        lead: "a busca de sentido",
        answer: "o esforco de orientar a vida por escolhas assumidas e nao por automatismos",
        why: "existir implica dar direcao ao proprio viver"
      },
      {
        lead: "a relacao com o outro no existencialismo",
        answer: "o encontro com outras liberdades que tambem condiciona a experiencia humana",
        why: "nao existimos sozinhos, mas em situacao compartilhada"
      },
      {
        lead: "a autenticidade cotidiana",
        answer: "a tentativa de viver sem fugir do peso das proprias decisoes",
        why: "ela exige consciencia e compromisso com a vida concreta"
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
    frente: "Liberdade, angustia e sentido da existencia",
    searchAliases: [
      "existencialismo",
      "sartre camus beauvoir",
      "ma-fe",
      "angustia existencial",
      "existencia precede essencia"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "compreender o contexto historico e conceitual do existencialismo",
      "identificar autores e conceitos fundamentais do existencialismo",
      "analisar conceitos existencialistas ligados a liberdade, angustia e autenticidade",
      "relacionar existencialismo a problemas de genero, alteridade e vida social",
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
