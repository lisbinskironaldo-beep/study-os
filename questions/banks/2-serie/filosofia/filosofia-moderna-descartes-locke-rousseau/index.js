import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  PHILOSOPHY_HUNDRED_MATRIX,
  PHILOSOPHY_HUNDRED_PLAN,
  PHILOSOPHY_STEM_BUILDERS
} from "../../../_shared/philosophyTopicPresets.js";

const blocos = [
  {
    subtopico: "Contexto da filosofia moderna",
    habilidade:
      "compreender o contexto historico e intelectual da filosofia moderna",
    tags: ["modernidade", "razao", "ciencia moderna"],
    fatos: [
      {
        lead: "a filosofia moderna",
        answer: "o conjunto de reflexoes marcado pela centralidade do sujeito, da razao e do conhecimento",
        why: "ela surge em dialogo com ciencia moderna e transformacoes politicas"
      },
      {
        lead: "a modernidade filosofica",
        answer: "o periodo em que o sujeito pensante ganha papel central na fundamentacao do saber",
        why: "a pergunta pelo conhecimento torna-se decisiva"
      },
      {
        lead: "a revolucao cientifica",
        answer: "o processo que valorizou metodo, matematizacao e observacao na explicacao da natureza",
        why: "ele influenciou profundamente os filosofos modernos"
      },
      {
        lead: "a busca de fundamento seguro do saber",
        answer: "o esforco para encontrar criterio firme contra erro e duvida",
        why: "Descartes e outros modernos tratam essa busca como central"
      },
      {
        lead: "o individuo moderno",
        answer: "o sujeito concebido como capaz de pensar e decidir por si mesmo",
        why: "essa imagem reforca autonomia intelectual e politica"
      }
    ]
  },
  {
    subtopico: "Descartes e a duvida metodica",
    habilidade:
      "identificar teses centrais do racionalismo cartesiano",
    tags: ["descartes", "duvida metodica", "cogito"],
    fatos: [
      {
        lead: "a duvida metodica",
        answer: "o procedimento de colocar em questao tudo o que possa ser duvidoso",
        why: "Descartes usa a duvida como caminho para encontrar certeza"
      },
      {
        lead: "o cogito",
        answer: "a certeza de que quem pensa existe enquanto pensa",
        why: "mesmo duvidando, o sujeito confirma sua existencia pensante"
      },
      {
        lead: "a evidencia clara e distinta",
        answer: "o criterio cartesiano para reconhecer uma verdade segura",
        why: "ideias claras e distintas teriam maior garantia racional"
      },
      {
        lead: "o sujeito pensante em Descartes",
        answer: "a consciencia racional tomada como ponto inicial do conhecimento",
        why: "o eu pensante fundamenta a reconstrucao do saber"
      },
      {
        lead: "a funcao da duvida em Descartes",
        answer: "eliminar o incerto para chegar a um fundamento indubitavel",
        why: "ela nao e fim em si, mas metodo de purificacao do saber"
      }
    ]
  },
  {
    subtopico: "Racionalismo cartesiano",
    habilidade:
      "identificar teses centrais do racionalismo cartesiano",
    tags: ["racionalismo", "razao", "ideias inatas"],
    fatos: [
      {
        lead: "o racionalismo",
        answer: "a corrente que atribui a razao papel central na origem e validacao do conhecimento",
        why: "ela desconfia de uma dependencia exclusiva dos sentidos"
      },
      {
        lead: "as ideias inatas em Descartes",
        answer: "conteudos que nao dependeriam apenas da experiencia sensivel para serem conhecidos",
        why: "elas expressam a capacidade racional do sujeito"
      },
      {
        lead: "o metodo dedutivo cartesiano",
        answer: "a passagem ordenada de principios evidentes para conclusoes necessarias",
        why: "a matematica inspira esse ideal de rigor"
      },
      {
        lead: "a matematizacao do saber",
        answer: "o modelo de conhecimento claro, ordenado e demonstravel assumido por Descartes",
        why: "ele busca certeza semelhante a dos raciocinios matematicos"
      },
      {
        lead: "a autonomia da razao",
        answer: "a capacidade do pensamento de fundamentar conhecimento por exame proprio",
        why: "essa autonomia e marca da filosofia moderna"
      }
    ]
  },
  {
    subtopico: "Locke e o empirismo",
    habilidade:
      "comparar racionalismo e empirismo na filosofia moderna",
    tags: ["locke", "empirismo", "experiencia"],
    fatos: [
      {
        lead: "o empirismo de Locke",
        answer: "a doutrina segundo a qual conhecimento deriva principalmente da experiencia",
        why: "ele rejeita a tese de ideias inatas como fundamento inicial"
      },
      {
        lead: "a mente como tabula rasa",
        answer: "a ideia de que a mente nasce sem conteudos prontos e vai sendo preenchida pela experiencia",
        why: "Locke usa essa imagem para explicar origem do conhecimento"
      },
      {
        lead: "a sensacao em Locke",
        answer: "a fonte de ideias provenientes do contato com o mundo externo",
        why: "ela introduz conteudos a mente"
      },
      {
        lead: "a reflexao em Locke",
        answer: "a observacao das operacoes internas da propria mente",
        why: "alem dos sentidos, a mente tambem reflete sobre seus atos"
      },
      {
        lead: "a critica lockeana ao inatismo",
        answer: "a recusa da ideia de principios universais presentes desde o nascimento",
        why: "para ele, o conhecimento se constroi a partir da experiencia"
      }
    ]
  },
  {
    subtopico: "Conhecimento e experiencia em Locke",
    habilidade:
      "comparar racionalismo e empirismo na filosofia moderna",
    tags: ["conhecimento", "experiencia", "locke"],
    fatos: [
      {
        lead: "as ideias simples em Locke",
        answer: "conteudos elementares recebidos pela sensacao ou reflexao",
        why: "a mente os combina posteriormente em ideias mais complexas"
      },
      {
        lead: "as ideias complexas",
        answer: "combinacoes mentais produzidas a partir de ideias simples",
        why: "a mente opera, compara e organiza conteudos da experiencia"
      },
      {
        lead: "os limites do conhecimento em Locke",
        answer: "a ideia de que o saber humano nao alcanca tudo de modo absoluto",
        why: "conhecemos dentro das possibilidades dadas pela experiencia"
      },
      {
        lead: "a origem das ideias",
        answer: "a entrada de conteudos na mente por sensacao e reflexao",
        why: "isso explica como o conhecimento e formado"
      },
      {
        lead: "a experiencia como criterio",
        answer: "a referencia fundamental para validar e organizar o saber humano",
        why: "o empirismo valoriza contato concreto com o mundo"
      }
    ]
  },
  {
    subtopico: "Locke e o liberalismo politico",
    habilidade:
      "relacionar filosofia moderna a temas politicos de liberdade e contrato social",
    tags: ["locke", "liberalismo", "direitos naturais"],
    fatos: [
      {
        lead: "os direitos naturais em Locke",
        answer: "vida, liberdade e propriedade como direitos anteriores ao Estado",
        why: "o governo legitimo deve proteger esses direitos"
      },
      {
        lead: "o contrato politico em Locke",
        answer: "o acordo pelo qual individuos formam governo para garantir direitos",
        why: "o poder politico nasce do consentimento dos governados"
      },
      {
        lead: "a propriedade em Locke",
        answer: "o direito ligado ao trabalho e ao uso legitimo dos bens",
        why: "essa ideia e central em seu pensamento politico"
      },
      {
        lead: "o direito de resistencia",
        answer: "a possibilidade de opor-se a governos que violam direitos naturais",
        why: "se o poder trai sua finalidade, perde legitimidade"
      },
      {
        lead: "o liberalismo lockeano",
        answer: "a defesa de limites ao poder e protecao das liberdades individuais",
        why: "esse pensamento influenciou instituicoes modernas"
      }
    ]
  },
  {
    subtopico: "Rousseau e o estado de natureza",
    habilidade:
      "relacionar filosofia moderna a temas politicos de liberdade e contrato social",
    tags: ["rousseau", "estado de natureza", "desigualdade"],
    fatos: [
      {
        lead: "o estado de natureza em Rousseau",
        answer: "a condicao hipotetica anterior a sociedade civil organizada",
        why: "ele o usa para pensar origem da desigualdade social"
      },
      {
        lead: "o bom selvagem",
        answer: "a imagem de um ser humano originalmente simples e nao corrompido pela sociedade desigual",
        why: "ela nao idealiza brutalidade, mas critica deformacoes sociais"
      },
      {
        lead: "a desigualdade em Rousseau",
        answer: "um efeito historico e social, nao uma condicao natural inevitavel",
        why: "instituicoes e propriedade intensificam desigualdades"
      },
      {
        lead: "o amor de si",
        answer: "o instinto natural de autopreservacao anterior a vaidade social",
        why: "Rousseau distingue esse sentimento do orgulho competitivo"
      },
      {
        lead: "o amor-proprio",
        answer: "o sentimento comparativo que surge na vida social e alimenta rivalidades",
        why: "ele se liga a busca por reconhecimento desigual"
      }
    ]
  },
  {
    subtopico: "Contrato social e vontade geral",
    habilidade:
      "relacionar filosofia moderna a temas politicos de liberdade e contrato social",
    tags: ["contrato social", "vontade geral", "rousseau"],
    fatos: [
      {
        lead: "o contrato social em Rousseau",
        answer: "o pacto pelo qual os individuos se unem para formar um corpo politico legitimo",
        why: "a liberdade deve ser preservada na vida coletiva"
      },
      {
        lead: "a vontade geral",
        answer: "a orientacao do corpo politico para o interesse comum",
        why: "ela nao se confunde com mera soma de interesses particulares"
      },
      {
        lead: "a soberania popular",
        answer: "a ideia de que o poder legitimo pertence ao povo enquanto corpo coletivo",
        why: "Rousseau rejeita soberania fundada em privilegio de poucos"
      },
      {
        lead: "a liberdade civil em Rousseau",
        answer: "a forma de liberdade vivida sob leis que o cidadao reconhece como suas",
        why: "obedecer a lei comum pode ser expressao de autonomia politica"
      },
      {
        lead: "o legislador em Rousseau",
        answer: "a figura que ajuda a formular leis adequadas ao corpo politico",
        why: "ela nao substitui o povo, mas orienta a fundacao institucional"
      }
    ]
  },
  {
    subtopico: "Individuo, liberdade e politica moderna",
    habilidade:
      "avaliar a importancia da filosofia moderna para a formacao da modernidade politica",
    tags: ["individuo", "liberdade", "politica moderna"],
    fatos: [
      {
        lead: "o individuo moderno",
        answer: "o sujeito pensado como portador de direitos, razao e autonomia",
        why: "essa figura ganha destaque na modernidade filosofica"
      },
      {
        lead: "a liberdade moderna",
        answer: "a capacidade de agir com autonomia frente a autoridades tradicionais",
        why: "ela se torna tema central nos debates politicos"
      },
      {
        lead: "o contrato como fundamento politico",
        answer: "a ideia de que o poder legitimo deriva de acordo humano e nao de origem sagrada",
        why: "Locke e Rousseau usam essa chave de modos distintos"
      },
      {
        lead: "a legitimidade do poder",
        answer: "a justificacao racional do governo perante os governados",
        why: "a filosofia moderna exige fundamento para obediencia politica"
      },
      {
        lead: "a critica ao absolutismo",
        answer: "a contestacao do poder ilimitado concentrado em um soberano",
        why: "os modernos defendem limites, direitos e soberania civil"
      }
    ]
  },
  {
    subtopico: "Legado da filosofia moderna",
    habilidade:
      "avaliar a importancia da filosofia moderna para a formacao da modernidade politica",
    tags: ["legado moderno", "descartes", "locke", "rousseau"],
    fatos: [
      {
        lead: "o legado de Descartes",
        answer: "a centralidade do sujeito racional e da busca por fundamento seguro do saber",
        why: "sua filosofia influenciou epistemologia e ciencia modernas"
      },
      {
        lead: "o legado de Locke",
        answer: "a valorizacao da experiencia e dos direitos individuais na politica",
        why: "suas ideias marcaram liberalismo e teoria do conhecimento"
      },
      {
        lead: "o legado de Rousseau",
        answer: "a reflexao sobre desigualdade, soberania popular e vontade geral",
        why: "ele influenciou pensamento democratico e critico"
      },
      {
        lead: "a modernidade filosofica",
        answer: "o periodo que redefine conhecimento, liberdade e legitimidade politica",
        why: "ele estabelece questoes ainda presentes no mundo contemporaneo"
      },
      {
        lead: "a permanencia dos modernos",
        answer: "a atualidade de debates sobre sujeito, experiencia, direitos e contrato social",
        why: "esses temas continuam estruturando nossas instituicoes"
      }
    ]
  }
];

export const filosofiaModernaDescartesLockeRousseau = {
  id: "filosofia_filosofia_moderna_descartes_locke_rousseau",
  materia: "Filosofia",
  serie: [2],
  topico: "Filosofia Moderna Descartes Locke Rousseau",
  metadados: {
    disciplinaId: "filosofia",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Filosofia",
    frente: "Sujeito, conhecimento e politica moderna",
    searchAliases: [
      "filosofia moderna",
      "descartes locke rousseau",
      "duvida metodica",
      "empirismo",
      "contrato social"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "compreender o contexto historico e intelectual da filosofia moderna",
      "identificar teses centrais do racionalismo cartesiano",
      "comparar racionalismo e empirismo na filosofia moderna",
      "relacionar filosofia moderna a temas politicos de liberdade e contrato social",
      "avaliar a importancia da filosofia moderna para a formacao da modernidade politica"
    ],
    planejamentoQuestoes: PHILOSOPHY_HUNDRED_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "fmdlr",
    serie: 2,
    materia: "Filosofia",
    topico: "Filosofia Moderna Descartes Locke Rousseau",
    blocos,
    stemBuilders: PHILOSOPHY_STEM_BUILDERS,
    globalMatrix: PHILOSOPHY_HUNDRED_MATRIX
  })
};
