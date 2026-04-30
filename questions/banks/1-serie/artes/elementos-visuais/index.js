import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  ARTS_STEM_BUILDERS,
  HUNDRED_QUESTION_MATRIX,
  ARTS_HUNDRED_PLAN
} from "../../../_shared/artsTopicPresets.js";

const blocos = [
  {
    subtopico: "Linha e contorno",
    habilidade: "identificar-elementos-basicos-da-linguagem-visual",
    tags: ["artes", "linha"],
    fatos: [
      {
        lead: "o elemento visual que sugere direcao e percurso no desenho",
        answer: "a linha",
        why: "ela organiza trajetos, limites e sentidos visuais"
      },
      {
        lead: "o traço que delimita externamente uma figura",
        answer: "o contorno",
        why: "ele marca o limite visual entre forma e fundo"
      },
      {
        lead: "a linha associada a estabilidade e repouso",
        answer: "a linha horizontal",
        why: "ela costuma produzir sensação de calma e equilíbrio"
      },
      {
        lead: "a linha associada a altura e firmeza",
        answer: "a linha vertical",
        why: "ela sugere elevacao e sustentacao visual"
      },
      {
        lead: "a linha que costuma transmitir movimento e tensao",
        answer: "a linha diagonal",
        why: "ela cria dinamismo e quebra da estabilidade"
      }
    ]
  },
  {
    subtopico: "Forma e figura-fundo",
    habilidade: "compreender-como-formas-se-organizam-na-imagem",
    tags: ["artes", "forma"],
    fatos: [
      {
        lead: "o elemento visual definido por limites reconheciveis",
        answer: "a forma",
        why: "ela pode ser geometrica ou organica na composição"
      },
      {
        lead: "a relação em que um elemento principal se destaca no campo visual",
        answer: "a figura",
        why: "ela ocupa o papel central diante do fundo"
      },
      {
        lead: "a área que cerca e sustenta a leitura do elemento principal",
        answer: "o fundo",
        why: "ele condiciona contraste e destaque da figura"
      },
      {
        lead: "o tipo de forma baseado em circulos, quadrados e triângulos",
        answer: "a forma geometrica",
        why: "ela se apoia em estruturas regulares e precisas"
      },
      {
        lead: "o tipo de forma de contornos livres e irregulares",
        answer: "a forma organica",
        why: "ela se aproxima de referencias naturais e fluidas"
      }
    ]
  },
  {
    subtopico: "Cor e circulo cromatico",
    habilidade: "identificar-relacoes-basicas-entre-as-cores",
    tags: ["artes", "cor"],
    fatos: [
      {
        lead: "o conjunto formado por vermelho, amarelo e azul no ensino basico de artes",
        answer: "as cores primarias",
        why: "elas servem de base para outras misturas cromaticas"
      },
      {
        lead: "o conjunto obtido pela mistura de duas cores primarias",
        answer: "as cores secundarias",
        why: "elas ampliam as combinacoes do circulo cromatico"
      },
      {
        lead: "a relação entre duas cores opostas no circulo cromatico",
        answer: "as cores complementares",
        why: "esse contraste intensifica o destaque visual"
      },
      {
        lead: "o grupo de cores associado a sensacoes de calor e energia",
        answer: "as cores quentes",
        why: "vermelhos, amarelos e laranjas costumam transmitir expansao"
      },
      {
        lead: "o grupo de cores associado a frescor e tranquilidade",
        answer: "as cores frias",
        why: "azuis, verdes e violetas sugerem maior recolhimento"
      }
    ]
  },
  {
    subtopico: "Luz e valor tonal",
    habilidade: "analisar-como-luz-e-sombra-modelam-a-imagem",
    tags: ["artes", "luz"],
    fatos: [
      {
        lead: "a graduacao entre claro e escuro em uma imagem",
        answer: "o valor tonal",
        why: "ele ajuda a criar contraste, atmosfera e profundidade"
      },
      {
        lead: "a área mais iluminada de um objeto representado",
        answer: "a luz",
        why: "ela indica onde a fonte luminosa incide com mais intensidade"
      },
      {
        lead: "a área menos iluminada usada para sugerir profundidade",
        answer: "a sombra",
        why: "ela contribui para volume e dramatizacao"
      },
      {
        lead: "a técnica de forte contraste entre claro e escuro",
        answer: "o claro-escuro",
        why: "ela valoriza dramaticidade e modelagem dos corpos"
      },
      {
        lead: "a passagem suave entre tons sem mudanca brusca",
        answer: "a gradacao tonal",
        why: "ela torna as transicoes visuais mais continuas"
      }
    ]
  },
  {
    subtopico: "Textura e padrao",
    habilidade: "reconhecer-superficies-e-ritmos-visuais-na-obra",
    tags: ["artes", "textura"],
    fatos: [
      {
        lead: "a qualidade visual ou tatil da superficie de uma obra",
        answer: "a textura",
        why: "ela pode sugerir aspereza, maciez, rugosidade ou brilho"
      },
      {
        lead: "a repeticao organizada de formas ou motivos visuais",
        answer: "o padrao",
        why: "ele cria ritmo e unidade na composição"
      },
      {
        lead: "a textura percebida apenas pela observação da imagem",
        answer: "a textura visual",
        why: "ela imita sensacoes sem depender do toque real"
      },
      {
        lead: "a textura percebida fisicamente no material da obra",
        answer: "a textura tatil",
        why: "ela depende da superficie concreta do objeto artístico"
      },
      {
        lead: "a repeticao de elementos que gera sensação de continuidade",
        answer: "o ritmo visual",
        why: "ele orienta o olhar ao longo da composição"
      }
    ]
  },
  {
    subtopico: "Espaco e profundidade",
    habilidade: "compreender-recursos-de-organizacao-espacial-na-obra",
    tags: ["artes", "espaco"],
    fatos: [
      {
        lead: "a área visual em que formas e objetos são distribuídos",
        answer: "o espaco",
        why: "ele organiza a relação entre os elementos da imagem"
      },
      {
        lead: "o recurso que faz objetos distantes parecerem menores",
        answer: "a perspectiva",
        why: "ela contribui para a ilusao de profundidade"
      },
      {
        lead: "a sobreposição de elementos para indicar distância",
        answer: "a profundidade por planos",
        why: "ela cria camadas visuais de proximidade e afastamento"
      },
      {
        lead: "a variação de tamanho para sugerir proximidade ou distância",
        answer: "a escala espacial",
        why: "objetos maiores parecem mais proximos do observador"
      },
      {
        lead: "a linha imaginaria para a qual convergem varias retas na perspectiva",
        answer: "o ponto de fuga",
        why: "ele estrutura a organização do espaco em profundidade"
      }
    ]
  },
  {
    subtopico: "Volume e tridimensionalidade",
    habilidade: "identificar-recursos-que-sugerem-volume-e-corpo",
    tags: ["artes", "volume"],
    fatos: [
      {
        lead: "a sugestao de corpo tridimensional em uma representação",
        answer: "o volume",
        why: "ele faz a forma parecer ocupar espaco real"
      },
      {
        lead: "a relação entre luz e sombra usada para modelar objetos",
        answer: "a modelagem",
        why: "ela reforca a sensação de tridimensionalidade"
      },
      {
        lead: "a linguagem artística que trabalha diretamente com corpos no espaco",
        answer: "a escultura",
        why: "ela se organiza em tres dimensoes materiais"
      },
      {
        lead: "a obra que pode ser observada de diferentes angulos no espaco",
        answer: "a forma tridimensional",
        why: "ela não depende apenas de altura e largura"
      },
      {
        lead: "o relevo visual criado por contraste e sombreado no plano",
        answer: "a ilusao de tridimensionalidade",
        why: "ela simula volume sem sair da superficie bidimensional"
      }
    ]
  },
  {
    subtopico: "Composição e equilíbrio",
    habilidade: "analisar-a-organizacao-dos-elementos-na-composicao",
    tags: ["artes", "composicao"],
    fatos: [
      {
        lead: "a organização dos elementos visuais em uma obra",
        answer: "a composição",
        why: "ela define a estrutura e a leitura do conjunto"
      },
      {
        lead: "a distribuicao harmonica de pesos visuais na imagem",
        answer: "o equilíbrio",
        why: "ele evita sensação de desordem compositiva"
      },
      {
        lead: "a organização em que os lados da imagem apresentam correspondencia visual",
        answer: "a simetria",
        why: "ela transmite estabilidade e regularidade"
      },
      {
        lead: "o destaque de um elemento principal no conjunto",
        answer: "a enfase",
        why: "ela direciona o olhar para um ponto importante"
      },
      {
        lead: "a repeticao de formas, cores ou linhas para criar unidade",
        answer: "a harmonia visual",
        why: "ela ajuda a integrar os elementos da obra"
      }
    ]
  },
  {
    subtopico: "Materiais e técnicas",
    habilidade: "relacionar-materiais-e-procedimentos-a-efeitos-visuais",
    tags: ["artes", "tecnicas"],
    fatos: [
      {
        lead: "o instrumento comum no desenho gráfico a mao",
        answer: "o lapis",
        why: "ele permite traços, sombreados e esbocos variados"
      },
      {
        lead: "a técnica de aplicar tinta diluída em agua sobre papel",
        answer: "a aquarela",
        why: "ela produz transparencias e leveza cromatica"
      },
      {
        lead: "a técnica de construir imagem por recorte e justaposição de materiais",
        answer: "a colagem",
        why: "ela combina diferentes superficies e referencias visuais"
      },
      {
        lead: "a tinta espessa e de secagem mais lenta muito usada em pintura",
        answer: "a tinta a oleo",
        why: "ela favorece mistura e camadas cromaticas"
      },
      {
        lead: "o suporte retangular sobre o qual muitas pinturas são feitas",
        answer: "a tela",
        why: "ela é um dos suportes clássicos da pintura"
      }
    ]
  },
  {
    subtopico: "Leitura de imagem e expressao visual",
    habilidade: "interpretar-sentidos-e-escolhas-expressivas-da-imagem",
    tags: ["artes", "leitura-de-imagem"],
    fatos: [
      {
        lead: "a interpretação do sentido construido por formas, cores e composição",
        answer: "a leitura de imagem",
        why: "ela considera linguagem visual e contexto da obra"
      },
      {
        lead: "o uso intencional de elementos para comunicar ideia ou emocao",
        answer: "a expressao visual",
        why: "ela transforma recursos plasticos em mensagem"
      },
      {
        lead: "a escolha do elemento mais importante para orientar o olhar",
        answer: "o foco visual",
        why: "ele organiza a leitura principal da composição"
      },
      {
        lead: "a relação entre imagem, contexto e interpretação do observador",
        answer: "o significado visual",
        why: "ele não depende apenas do objeto representado"
      },
      {
        lead: "a capacidade de observar criticamente uma obra e justificar sua leitura",
        answer: "a análise visual",
        why: "ela articula percepcao, repertorio e argumentacao"
      }
    ]
  }
];

const questoes = buildPlannedQuestions({
  prefix: "ev",
  serie: [1],
  materia: "Artes",
  topico: "Elementos Visuais",
  blocos,
  stemBuilders: ARTS_STEM_BUILDERS,
  globalMatrix: HUNDRED_QUESTION_MATRIX
});

export const elementosVisuais = {
  id: "artes_elementos_visuais",
  materia: "Artes",
  serie: [1],
  topico: "Elementos Visuais",
  metadados: {
    disciplinaId: "artes",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Artes",
    frente: "Linguagem visual",
    searchAliases: [
      "elementos visuais",
      "linguagem visual",
      "linha forma cor",
      "textura e composição",
      "leitura de imagem"
    ],
    subtopicosBase: [
      "Linha e contorno",
      "Forma e figura-fundo",
      "Cor e circulo cromatico",
      "Luz e valor tonal",
      "Textura e padrao",
      "Espaco e profundidade",
      "Volume e tridimensionalidade",
      "Composição e equilíbrio",
      "Materiais e técnicas",
      "Leitura de imagem e expressao visual"
    ],
    habilidadesBase: [
      "identificar elementos basicos da linguagem visual",
      "compreender relações entre forma, cor, luz e espaco",
      "analisar composição, equilíbrio e foco visual",
      "relacionar materiais e técnicas a efeitos expressivos",
      "interpretar sentidos na leitura de imagens"
    ],
    auditado: true,
    auditadoEm: "2026-04-11",
    planejamentoQuestoes: ARTS_HUNDRED_PLAN
  },
  questoes
};
