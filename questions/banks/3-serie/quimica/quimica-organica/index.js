import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  CHEMISTRY_HUNDRED_FIFTY_MATRIX,
  CHEMISTRY_HUNDRED_FIFTY_PLAN,
  CHEMISTRY_STEM_BUILDERS
} from "../../../_shared/chemistryTopicPresets.js";

const blocos = [
  {
    subtopico: "Conceito de quimica organica",
    habilidade:
      "identificar o objeto de estudo e os fundamentos da quimica organica",
    tags: ["quimica organica", "carbono", "compostos organicos"],
    fatos: [
      { lead: "a quimica organica", answer: "o ramo da quimica que estuda principalmente compostos de carbono", why: "esse elemento forma enorme variedade de estruturas e substancias" },
      { lead: "o carbono nos compostos organicos", answer: "o elemento central capaz de formar cadeias e ligacoes variadas", why: "sua tetravalencia amplia muito o numero de compostos possiveis" },
      { lead: "o objeto de estudo da quimica organica", answer: "as estruturas, propriedades e transformacoes dos compostos carbonados", why: "ela investiga desde combustiveis ate biomoleculas" },
      { lead: "a tetravalencia do carbono", answer: "a capacidade de realizar quatro ligacoes covalentes", why: "isso explica a diversidade das cadeias carbonicas" },
      { lead: "a catenacao do carbono", answer: "a capacidade de ligar-se a outros atomos de carbono formando cadeias", why: "essa propriedade sustenta a complexidade organica" }
    ]
  },
  {
    subtopico: "Cadeias carbonicas",
    habilidade:
      "classificar cadeias carbonicas segundo criterios estruturais",
    tags: ["cadeias carbonicas", "aberta", "fechada"],
    fatos: [
      { lead: "uma cadeia aberta", answer: "a cadeia carbonica que nao forma ciclo", why: "ela tambem pode ser chamada de aciclica" },
      { lead: "uma cadeia fechada", answer: "a cadeia carbonica que apresenta arranjo ciclico", why: "os atomos de carbono formam um anel ou ciclo" },
      { lead: "uma cadeia saturada", answer: "a cadeia que possui apenas ligacoes simples entre carbonos", why: "nao ha ligacoes duplas ou triplas entre atomos de carbono" },
      { lead: "uma cadeia insaturada", answer: "a cadeia que apresenta pelo menos uma ligacao multipla entre carbonos", why: "duplas e triplas caracterizam insaturacao" },
      { lead: "uma cadeia ramificada", answer: "a cadeia que apresenta desvios laterais em relacao a sequencia principal", why: "ela nao segue apenas uma linha continua simples" }
    ]
  },
  {
    subtopico: "Classificacao de carbonos",
    habilidade:
      "relacionar a posicao do carbono a classificacoes estruturais",
    tags: ["carbono primario", "secundario", "terciario"],
    fatos: [
      { lead: "um carbono primario", answer: "o carbono ligado diretamente a apenas outro carbono", why: "essa classificacao depende do numero de carbonos vizinhos" },
      { lead: "um carbono secundario", answer: "o carbono ligado diretamente a dois outros carbonos", why: "ele ocupa posicao intermediaria na cadeia" },
      { lead: "um carbono terciario", answer: "o carbono ligado diretamente a tres outros carbonos", why: "essa situacao e comum em estruturas ramificadas" },
      { lead: "um carbono quaternario", answer: "o carbono ligado diretamente a quatro outros carbonos", why: "ele aparece em centros de forte ramificacao" },
      { lead: "a classificacao dos carbonos", answer: "o criterio baseado no numero de atomos de carbono diretamente vizinhos", why: "ela ajuda a descrever a estrutura das moleculas" }
    ]
  },
  {
    subtopico: "Hidrocarbonetos",
    habilidade:
      "identificar classes basicas de compostos organicos e sua nomenclatura",
    tags: ["hidrocarbonetos", "alcanos", "alcenos"],
    fatos: [
      { lead: "os hidrocarbonetos", answer: "os compostos organicos formados apenas por carbono e hidrogenio", why: "eles constituem base de varias classes de combustiveis" },
      { lead: "os alcanos", answer: "os hidrocarbonetos saturados com apenas ligacoes simples entre carbonos", why: "eles compoem uma das series mais estudadas da organica" },
      { lead: "os alcenos", answer: "os hidrocarbonetos que possuem pelo menos uma ligacao dupla entre carbonos", why: "essa insaturacao altera propriedades e nomenclatura" },
      { lead: "os alcinos", answer: "os hidrocarbonetos que possuem pelo menos uma ligacao tripla entre carbonos", why: "eles apresentam grau de insaturacao ainda maior" },
      { lead: "os hidrocarbonetos aromaticos", answer: "os compostos que apresentam aneis especiais associados a aromaticidade", why: "o benzeno e a referencia classica desse grupo" }
    ]
  },
  {
    subtopico: "Nomenclatura organica basica",
    habilidade:
      "aplicar regras basicas de nomenclatura organica",
    tags: ["nomenclatura", "prefixo", "sufixo"],
    fatos: [
      { lead: "o prefixo da nomenclatura organica", answer: "a parte do nome que indica o numero de carbonos da cadeia principal", why: "met-, et-, prop- e but- sao exemplos usuais" },
      { lead: "o infixo da nomenclatura organica", answer: "a parte do nome que indica o tipo de ligacao entre carbonos", why: "an, en e in assinalam saturacao ou insaturacao" },
      { lead: "o sufixo da nomenclatura organica", answer: "a parte do nome que identifica a funcao organica principal", why: "ele diferencia classes como alcool, aldeido e acido" },
      { lead: "a cadeia principal", answer: "a sequencia de carbonos escolhida como referencia para nomear a molecula", why: "ela deve seguir criterios de comprimento e prioridade" },
      { lead: "a numeracao da cadeia", answer: "o processo de localizar insaturacoes, ramificacoes e grupos funcionais na molecula", why: "ela garante nome sistematico e sem ambiguidades" }
    ]
  },
  {
    subtopico: "Isomeria plana",
    habilidade:
      "identificar nocoes iniciais de isomeria em compostos organicos",
    tags: ["isomeria", "plana", "mesma formula"],
    fatos: [
      { lead: "a isomeria plana", answer: "a situacao em que compostos possuem mesma formula molecular e estruturas diferentes no plano", why: "eles diferem no arranjo dos atomos" },
      { lead: "a isomeria de cadeia", answer: "a diferenca entre compostos de mesma formula causada por arranjos distintos da cadeia carbonica", why: "mudam linearidade ou ramificacao" },
      { lead: "a isomeria de posicao", answer: "a diferenca determinada pela localizacao de insaturacao, ramificacao ou grupo funcional", why: "a formula molecular continua a mesma" },
      { lead: "a isomeria de funcao", answer: "a situacao em que compostos de mesma formula pertencem a funcoes organicas diferentes", why: "a mudanca estrutural altera o comportamento quimico" },
      { lead: "os isomeros", answer: "os compostos que apresentam mesma formula molecular, mas estruturas distintas", why: "por isso podem ter propriedades diferentes" }
    ]
  },
  {
    subtopico: "Petroleo e combustiveis",
    habilidade:
      "relacionar compostos organicos a processos industriais e energeticos",
    tags: ["petroleo", "combustiveis", "destilacao"],
    fatos: [
      { lead: "o petroleo", answer: "a mistura complexa de hidrocarbonetos de grande importancia energetica e industrial", why: "dele derivam varios combustiveis e materias-primas" },
      { lead: "a destilacao fracionada do petroleo", answer: "o processo de separacao baseado em diferentes faixas de ebulicao", why: "ele permite obter gasolina, diesel e outras fracoes" },
      { lead: "a gasolina", answer: "a fracao do petroleo rica em hidrocarbonetos leves usada como combustivel", why: "ela resulta de processos de separacao e refino" },
      { lead: "o diesel", answer: "a fracao mais pesada do petroleo utilizada em motores especificos", why: "suas propriedades diferem das fracoes mais leves" },
      { lead: "a importancia dos combustiveis organicos", answer: "o fornecimento de energia para transporte, industria e atividades cotidianas", why: "a quimica organica esta diretamente ligada a essa matriz" }
    ]
  },
  {
    subtopico: "Biocombustiveis",
    habilidade:
      "relacionar compostos organicos a processos industriais e energeticos",
    tags: ["biocombustiveis", "etanol", "biodiesel"],
    fatos: [
      { lead: "o etanol combustivel", answer: "o alcool obtido por fermentacao ou outras rotas e usado como fonte de energia", why: "ele e um importante biocombustivel" },
      { lead: "o biodiesel", answer: "o combustivel renovavel produzido a partir de oleos e gorduras", why: "ele pode substituir parcialmente derivados do petroleo" },
      { lead: "um biocombustivel", answer: "o combustivel produzido a partir de biomassa ou fontes renovaveis", why: "ele busca reduzir dependencia exclusiva do petroleo" },
      { lead: "a vantagem ambiental relativa dos biocombustiveis", answer: "a possibilidade de integrar ciclos renovaveis de materia organica", why: "isso pode reduzir impacto comparado a fontes exclusivamente fosseis" },
      { lead: "a relacao entre quimica organica e energia", answer: "o estudo dos compostos de carbono presentes em combustiveis e materiais energeticos", why: "a organica ajuda a compreender composicao e uso dessas substancias" }
    ]
  },
  {
    subtopico: "Reacoes organicas iniciais",
    habilidade:
      "identificar transformacoes organicas introdutorias",
    tags: ["reacoes organicas", "adicao", "substituicao"],
    fatos: [
      { lead: "a reacao de adicao", answer: "a transformacao em que atomos ou grupos se adicionam a uma cadeia insaturada", why: "ligacoes multiplas favorecem esse tipo de processo" },
      { lead: "a reacao de substituicao", answer: "a transformacao em que um atomo ou grupo da molecula e trocado por outro", why: "esse tipo e comum em varias classes organicas" },
      { lead: "a reacao de combustao organica", answer: "a oxidacao energetica de compostos carbonados com producao de calor", why: "ela e importante para combustiveis" },
      { lead: "a reatividade de uma insaturacao", answer: "a maior facilidade de participar de certas reacoes como adicao", why: "ligacoes multiplas sao centros reativos relevantes" },
      { lead: "o estudo introdutorio das reacoes organicas", answer: "a observacao de transformacoes tipicas ligadas a estrutura da cadeia e do grupo funcional", why: "isso prepara a compreensao de sinteses e usos" }
    ]
  },
  {
    subtopico: "Quimica organica e cotidiano",
    habilidade:
      "aplicar conceitos de quimica organica a materiais e situacoes cotidianas",
    tags: ["cotidiano", "materiais", "aplicacoes organicas"],
    fatos: [
      { lead: "os compostos organicos no cotidiano", answer: "a presenca de substancias carbonadas em combustiveis, alimentos, remedios e plasticos", why: "a vida moderna e amplamente apoiada neles" },
      { lead: "a relacao entre alimentos e organica", answer: "o fato de carboidratos, lipidios e proteinas serem compostos carbonados", why: "biomoleculas pertencem ao dominio da quimica organica" },
      { lead: "os medicamentos organicos", answer: "as moleculas carbonadas desenvolvidas para atuar biologicamente no organismo", why: "a organica e decisiva na industria farmaceutica" },
      { lead: "os materiais plastificados do dia a dia", answer: "a manifestacao pratica de cadeias carbonicas e polimeros organicos", why: "embalagens e objetos comuns ilustram essa presenca" },
      { lead: "a utilidade de estudar quimica organica", answer: "a compreensao das substancias de carbono presentes em processos naturais e tecnologicos", why: "isso aproxima a disciplina de temas amplamente vividos" }
    ]
  }
];

export const quimicaOrganica = {
  id: "quimica_quimica_organica",
  materia: "Quimica",
  serie: [3],
  topico: "Quimica Organica",
  metadados: {
    disciplinaId: "quimica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Quimica",
    frente: "Estruturas de carbono e compostos organicos",
    searchAliases: [
      "quimica organica",
      "cadeias carbonicas",
      "hidrocarbonetos",
      "isomeria plana",
      "petroleo e biocombustiveis"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar o objeto de estudo e os fundamentos da quimica organica",
      "classificar cadeias carbonicas segundo criterios estruturais",
      "aplicar regras basicas de nomenclatura organica",
      "identificar nocoes iniciais de isomeria em compostos organicos",
      "relacionar compostos organicos a processos industriais e energeticos"
    ],
    planejamentoQuestoes: CHEMISTRY_HUNDRED_FIFTY_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "qo",
    serie: 3,
    materia: "Quimica",
    topico: "Quimica Organica",
    blocos,
    stemBuilders: CHEMISTRY_STEM_BUILDERS,
    globalMatrix: CHEMISTRY_HUNDRED_FIFTY_MATRIX
  })
};

