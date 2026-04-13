import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  PHILOSOPHY_HUNDRED_MATRIX,
  PHILOSOPHY_HUNDRED_PLAN,
  PHILOSOPHY_STEM_BUILDERS
} from "../../../_shared/philosophyTopicPresets.js";

const blocos = [
  {
    subtopico: "Socrates e a busca do saber",
    habilidade:
      "identificar ideias centrais de Socrates, Platao e Aristoteles",
    tags: ["socrates", "saber", "dialogo"],
    fatos: [
      {
        lead: "Socrates",
        answer: "o filosofo ateniense que valorizou o dialogo e o exame da vida",
        why: "sua filosofia se concentra na formacao etica e no conhecimento de si"
      },
      {
        lead: "a frase socratica sobre nada saber",
        answer: "o reconhecimento da propria ignorancia como ponto de partida do conhecimento",
        why: "Socrates entende que admitir limites abre espaco para investigar melhor"
      },
      {
        lead: "o exame da vida em Socrates",
        answer: "a ideia de que viver bem exige refletir criticamente sobre si e sobre o agir",
        why: "a vida sem reflexao nao realizaria plenamente o humano"
      },
      {
        lead: "o conhecimento de si",
        answer: "a investigacao do proprio pensamento e das proprias escolhas",
        why: "Socrates liga autoconhecimento a cuidado da alma"
      },
      {
        lead: "a centralidade do dialogo socratico",
        answer: "o uso da conversa racional para testar opinioes e buscar definicoes",
        why: "o saber se desenvolve no confronto argumentativo"
      }
    ]
  },
  {
    subtopico: "Ironia e maiutica",
    habilidade:
      "compreender o metodo socratico de investigacao e dialogo",
    tags: ["ironia", "maiutica", "metodo socratico"],
    fatos: [
      {
        lead: "a ironia socratica",
        answer: "a estrategia de questionar fingindo nao saber para expor contradicoes do interlocutor",
        why: "ela desestabiliza certezas mal fundamentadas"
      },
      {
        lead: "a maiutica",
        answer: "o metodo de conduzir o interlocutor a formular por si mesmo um conceito mais claro",
        why: "Socrates se compara a uma parteira de ideias"
      },
      {
        lead: "o metodo socratico",
        answer: "a investigacao dialogica baseada em perguntas, refutacoes e busca conceitual",
        why: "ele procura substituir opinioes vagas por definicoes mais consistentes"
      },
      {
        lead: "a refutacao em Socrates",
        answer: "o procedimento de mostrar incoerencias em uma resposta inicial",
        why: "sem refutacao, o interlocutor nao percebe limites de sua opiniao"
      },
      {
        lead: "a funcao educativa da maiutica",
        answer: "estimular autonomia intelectual em vez de simples transmissao de respostas prontas",
        why: "o aprendizado filosofico nasce da elaboracao do proprio pensamento"
      }
    ]
  },
  {
    subtopico: "Etica socratica",
    habilidade:
      "relacionar filosofia antiga a problemas eticos e politicos",
    tags: ["etica socratica", "virtude", "alma"],
    fatos: [
      {
        lead: "a virtude em Socrates",
        answer: "a excelencia moral ligada ao conhecimento do bem",
        why: "agir bem dependeria de compreender o que e verdadeiramente bom"
      },
      {
        lead: "o cuidado da alma",
        answer: "a atencao prioritaria a formacao moral e intelectual da pessoa",
        why: "Socrates considera mais importante aperfeicoar a alma do que bens externos"
      },
      {
        lead: "a tese socratica sobre o mal",
        answer: "a ideia de que ninguem pratica o mal deliberadamente se conhece o bem",
        why: "o erro moral estaria ligado a ignorancia"
      },
      {
        lead: "a vida virtuosa",
        answer: "a existencia orientada pela reflexao, pela justica e pela moderacao",
        why: "para Socrates, felicidade e moralidade estao articuladas"
      },
      {
        lead: "a critica socratica ao relativismo moral",
        answer: "a defesa de que valores podem ser discutidos racionalmente e nao apenas aceitos por costume",
        why: "isso justifica a busca filosofica por definicoes do justo e do bem"
      }
    ]
  },
  {
    subtopico: "Platao e o mundo das ideias",
    habilidade:
      "identificar ideias centrais de Socrates, Platao e Aristoteles",
    tags: ["platao", "ideias", "conhecimento"],
    fatos: [
      {
        lead: "o mundo das ideias em Platao",
        answer: "o plano inteligivel das formas perfeitas e imutaveis",
        why: "ele seria mais verdadeiro do que o mundo sensivel"
      },
      {
        lead: "a teoria das formas",
        answer: "a doutrina segundo a qual os seres sensiveis participam de modelos ideais",
        why: "assim Platao explica permanencia e conhecimento universal"
      },
      {
        lead: "o mundo sensivel em Platao",
        answer: "o nivel da realidade acessivel aos sentidos e marcado pela mudanca",
        why: "ele e considerado menos estavel e menos verdadeiro"
      },
      {
        lead: "o conhecimento inteligivel",
        answer: "o saber obtido pela razao acerca das formas ou ideias",
        why: "esse conhecimento supera a mera opiniao sensivel"
      },
      {
        lead: "a participacao em Platao",
        answer: "a relacao pela qual coisas sensiveis remetem a formas ideais",
        why: "um objeto belo, por exemplo, participa da ideia de beleza"
      }
    ]
  },
  {
    subtopico: "Alegoria da caverna",
    habilidade:
      "compreender imagens e conceitos centrais da filosofia platonica",
    tags: ["caverna", "educacao", "verdade"],
    fatos: [
      {
        lead: "a alegoria da caverna",
        answer: "a narrativa platonica sobre passagem da ignorancia ao conhecimento",
        why: "ela representa educacao como libertacao intelectual"
      },
      {
        lead: "as sombras na caverna",
        answer: "as aparencias tomadas como realidade pelos prisioneiros",
        why: "elas simbolizam conhecimento superficial e enganoso"
      },
      {
        lead: "a saida da caverna",
        answer: "o processo de afastamento das aparencias rumo a verdade",
        why: "ela exige esforco, dor e reorientacao do olhar"
      },
      {
        lead: "o sol na alegoria",
        answer: "a imagem do bem como principio maximo de inteligibilidade",
        why: "o bem torna possivel conhecer e orientar a vida"
      },
      {
        lead: "o retorno do filosofo a caverna",
        answer: "a responsabilidade de compartilhar conhecimento com a cidade",
        why: "Platao liga saber filosofico e compromisso politico"
      }
    ]
  },
  {
    subtopico: "Politica platonica",
    habilidade:
      "relacionar filosofia antiga a problemas eticos e politicos",
    tags: ["politica platonica", "justica", "cidade ideal"],
    fatos: [
      {
        lead: "a cidade ideal em Platao",
        answer: "a organizacao politica orientada pela justica e pela harmonia entre funcoes sociais",
        why: "cada grupo deveria cumprir a funcao para a qual e mais apto"
      },
      {
        lead: "o filosofo-rei",
        answer: "o governante que possui conhecimento do bem e da justica",
        why: "Platao defende que governar exige sabedoria e nao mera ambicao"
      },
      {
        lead: "a justica em Platao",
        answer: "a ordem em que cada parte da cidade e da alma cumpre sua funcao",
        why: "justica e equilibrio funcional e nao simples igualdade numerica"
      },
      {
        lead: "a divisao social na Republica",
        answer: "a organizacao entre produtores, guardioes e governantes",
        why: "essa divisao busca manter a unidade da cidade"
      },
      {
        lead: "a educacao politica em Platao",
        answer: "o processo formativo necessario para selecionar e orientar os governantes",
        why: "a cidade justa depende de educacao rigorosa"
      }
    ]
  },
  {
    subtopico: "Aristoteles e a logica",
    habilidade:
      "identificar ideias centrais de Socrates, Platao e Aristoteles",
    tags: ["aristoteles", "logica", "silogismo"],
    fatos: [
      {
        lead: "a logica em Aristoteles",
        answer: "o estudo das formas corretas do raciocinio",
        why: "ela fornece instrumentos para avaliar argumentos"
      },
      {
        lead: "o silogismo",
        answer: "uma estrutura argumentativa em que premissas levam a uma conclusao",
        why: "Aristoteles sistematizou esse modelo de inferencia"
      },
      {
        lead: "a demonstracao",
        answer: "o raciocinio que prova algo a partir de principios e passos coerentes",
        why: "ela e fundamental para o conhecimento rigoroso"
      },
      {
        lead: "a classificacao dos seres em Aristoteles",
        answer: "o esforco de ordenar conceitos segundo generos e especies",
        why: "isso apoia analise logica e cientifica"
      },
      {
        lead: "o principio de nao contradicao",
        answer: "a tese de que algo nao pode ser e nao ser ao mesmo tempo sob o mesmo aspecto",
        why: "esse principio e basico para pensar de modo coerente"
      }
    ]
  },
  {
    subtopico: "Metafisica aristotelica",
    habilidade:
      "compreender conceitos centrais da metafisica e da teoria do conhecimento antigas",
    tags: ["metafisica", "substancia", "potencia e ato"],
    fatos: [
      {
        lead: "a substancia em Aristoteles",
        answer: "o ser individual que existe como suporte de propriedades",
        why: "ela ocupa lugar central em sua metafisica"
      },
      {
        lead: "potencia e ato",
        answer: "os conceitos usados para explicar possibilidade e realizacao dos seres",
        why: "eles mostram como a mudanca pode ser pensada racionalmente"
      },
      {
        lead: "a materia e a forma",
        answer: "os principios que compoem os seres concretos segundo Aristoteles",
        why: "a materia recebe determinacao pela forma"
      },
      {
        lead: "as quatro causas",
        answer: "material, formal, eficiente e final como modos de explicar um ser",
        why: "Aristoteles amplia a analise do por que das coisas"
      },
      {
        lead: "o motor imovel",
        answer: "o principio ultimo que move sem ser movido",
        why: "ele explica a ordem do movimento no universo"
      }
    ]
  },
  {
    subtopico: "Etica e politica em Aristoteles",
    habilidade:
      "relacionar filosofia antiga a problemas eticos e politicos",
    tags: ["etica aristotelica", "virtude", "politica"],
    fatos: [
      {
        lead: "a etica da virtude em Aristoteles",
        answer: "a concepcao segundo a qual agir bem depende de habitos excelentes",
        why: "virtudes sao formadas pela pratica e orientadas pela razao"
      },
      {
        lead: "a justa medida",
        answer: "o equilibrio entre extremos viciosos na conduta",
        why: "a virtude evita excesso e falta"
      },
      {
        lead: "a eudaimonia",
        answer: "a realizacao plena da vida humana por meio da virtude e da razao",
        why: "ela e o fim maior da etica aristotelica"
      },
      {
        lead: "o ser humano como animal politico",
        answer: "a ideia de que a vida humana se realiza na comunidade",
        why: "para Aristoteles, viver em polis faz parte de nossa natureza"
      },
      {
        lead: "a politica como busca do bem comum",
        answer: "a orientacao da vida coletiva para favorecer realizacao dos cidadaos",
        why: "a cidade deve criar condicoes para vida virtuosa"
      }
    ]
  },
  {
    subtopico: "Legado da filosofia classica",
    habilidade:
      "avaliar a importancia da filosofia classica para a tradicao ocidental",
    tags: ["legado classico", "tradicao filosofica", "grecia"],
    fatos: [
      {
        lead: "o legado de Socrates",
        answer: "a valorizacao do dialogo, do exame de si e da pergunta etica",
        why: "sua postura influenciou toda a filosofia posterior"
      },
      {
        lead: "o legado de Platao",
        answer: "a sistematizacao de problemas sobre conhecimento, politica e realidade inteligivel",
        why: "suas ideias marcaram historia da metafisica e da educacao"
      },
      {
        lead: "o legado de Aristoteles",
        answer: "a organizacao de campos como logica, etica, politica e metafisica",
        why: "sua obra se tornou referencia duradoura no pensamento ocidental"
      },
      {
        lead: "a filosofia classica grega",
        answer: "o conjunto de reflexoes que estruturou problemas fundamentais do pensamento ocidental",
        why: "muitas questoes atuais dialogam com ela"
      },
      {
        lead: "a permanencia dos classicos",
        answer: "a atualidade de suas perguntas sobre verdade, justica e vida boa",
        why: "esses temas continuam centrais na experiencia humana"
      }
    ]
  }
];

export const socratesPlataoAristoteles = {
  id: "filosofia_socrates_platao_aristoteles",
  materia: "Filosofia",
  serie: [1],
  topico: "Socrates Platao Aristoteles",
  metadados: {
    disciplinaId: "filosofia",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Filosofia",
    frente: "Fundacao da filosofia classica",
    searchAliases: [
      "socrates platao aristoteles",
      "filosofia classica",
      "alegoria da caverna",
      "maiutica",
      "etica da virtude"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar ideias centrais de Socrates, Platao e Aristoteles",
      "compreender o metodo socratico de investigacao e dialogo",
      "compreender imagens e conceitos centrais da filosofia platonica",
      "compreender conceitos centrais da metafisica e da teoria do conhecimento antigas",
      "relacionar filosofia antiga a problemas eticos e politicos"
    ],
    planejamentoQuestoes: PHILOSOPHY_HUNDRED_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "spa",
    serie: 1,
    materia: "Filosofia",
    topico: "Socrates Platao Aristoteles",
    blocos,
    stemBuilders: PHILOSOPHY_STEM_BUILDERS,
    globalMatrix: PHILOSOPHY_HUNDRED_MATRIX
  })
};
