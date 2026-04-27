import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  CHEMISTRY_HUNDRED_FIFTY_MATRIX,
  CHEMISTRY_HUNDRED_FIFTY_PLAN,
  CHEMISTRY_STEM_BUILDERS
} from "../../../_shared/chemistryTopicPresets.js";

const blocos = [
  {
    subtopico: "Conceito de funcao organica",
    habilidade:
      "identificar grupos funcionais e classes organicas principais",
    tags: ["funcoes organicas", "grupo funcional", "classificacao"],
    fatos: [
      { lead: "uma funcao organica", answer: "a classe de compostos definida pela presenca de certo grupo funcional", why: "o grupo funcional orienta propriedades e reatividade" },
      { lead: "o grupo funcional", answer: "o arranjo especifico de atomos responsavel por caracterizar uma funcao organica", why: "ele determina comportamento tipico da molecula" },
      { lead: "a classificacao funcional organica", answer: "a organizacao dos compostos conforme seus grupos funcionais principais", why: "ela facilita nomear e prever reacoes" },
      { lead: "a importancia do grupo funcional", answer: "a definicao das propriedades quimicas mais caracteristicas da substancia", why: "cadeias diferentes podem ter comportamentos parecidos se compartilham a mesma funcao" },
      { lead: "o estudo das funcoes organicas", answer: "a analise das classes de compostos carbonados segundo estrutura e comportamento", why: "ele aprofunda a classificacao da quimica organica" }
    ]
  },
  {
    subtopico: "Alcoois e fenois",
    habilidade:
      "identificar grupos funcionais e classes organicas principais",
    tags: ["alcoois", "fenois", "hidroxila"],
    fatos: [
      { lead: "um alcool", answer: "o composto organico que apresenta hidroxila ligada a carbono saturado", why: "essa e a caracteristica estrutural principal da funcao" },
      { lead: "um fenol", answer: "o composto em que a hidroxila esta ligada diretamente a um anel aromatico", why: "essa diferenca estrutural altera propriedades em relacao aos alcoois" },
      { lead: "a hidroxila em compostos organicos", answer: "o grupo OH que pode aparecer em diferentes funcoes, como alcool e fenol", why: "a posicao desse grupo e decisiva para classificar a substancia" },
      { lead: "o etanol", answer: "um exemplo comum de alcool usado como combustivel e em solucoes", why: "ele pertence a classe dos alcoois por conter hidroxila em carbono saturado" },
      { lead: "a diferenca entre alcool e fenol", answer: "a natureza do carbono ou anel ao qual a hidroxila se liga", why: "isso define funcoes distintas" }
    ]
  },
  {
    subtopico: "Aldeidos e cetonas",
    habilidade:
      "identificar grupos funcionais e classes organicas principais",
    tags: ["aldeidos", "cetonas", "carbonila"],
    fatos: [
      { lead: "o aldeido", answer: "o composto organico com carbonila em extremidade de cadeia", why: "o grupo funcional aldeido aparece na ponta da estrutura" },
      { lead: "a cetona", answer: "o composto organico com carbonila em posicao interna da cadeia", why: "a carbonila fica entre dois carbonos" },
      { lead: "a carbonila", answer: "o grupo funcional C=O presente em varias funcoes organicas", why: "sua localizacao ajuda a diferenciar aldeidos e cetonas" },
      { lead: "a diferenca entre aldeido e cetona", answer: "a posicao da carbonila em extremidade ou no interior da cadeia", why: "esse criterio e central na classificacao" },
      { lead: "a nomenclatura de aldeidos e cetonas", answer: "a identificacao da cadeia principal com sufixos proprios para cada funcao", why: "nomes sistematicos dependem do grupo funcional" }
    ]
  },
  {
    subtopico: "Acidos carboxilicos e esteres",
    habilidade:
      "relacionar grupos funcionais a propriedades e aplicacoes de compostos organicos",
    tags: ["acidos carboxilicos", "esteres", "carboxila"],
    fatos: [
      { lead: "o acido carboxilico", answer: "o composto que apresenta o grupo carboxila na estrutura", why: "essa funcao combina carbonila e hidroxila no mesmo carbono" },
      { lead: "o ester", answer: "o composto derivado da substituicao do hidrogenio da carboxila por radical organico", why: "ele possui odor caracteristico em muitos casos" },
      { lead: "a carboxila", answer: "o grupo funcional COOH caracteristico dos acidos carboxilicos", why: "ele define a funcao e influencia acidez" },
      { lead: "a esterificacao", answer: "a reacao de formacao de ester geralmente a partir de acido e alcool", why: "ela e importante em aromas e sinteses" },
      { lead: "os aromas artificiais", answer: "uma aplicacao frequente de esteres na industria alimenticia e de fragrancias", why: "muitos esteres apresentam odores agradaveis" }
    ]
  },
  {
    subtopico: "Aminas e amidas",
    habilidade:
      "relacionar grupos funcionais a propriedades e aplicacoes de compostos organicos",
    tags: ["aminas", "amidas", "nitrogenio"],
    fatos: [
      { lead: "a amina", answer: "a funcao organica derivada da amonia pela substituicao de hidrogenios por radicais organicos", why: "ela apresenta nitrogenio ligado a cadeias carbonicas" },
      { lead: "a amida", answer: "a funcao organica derivada de acido carboxilico com grupo nitrogenado ligado a carbonila", why: "ela aparece em compostos biologicos importantes" },
      { lead: "o nitrogenio nas aminas", answer: "o atomo central ligado a hidrogenios e ou radicais carbonados sem carbonila adjacente", why: "essa estrutura diferencia a funcao" },
      { lead: "o grupo funcional das amidas", answer: "a presenca da carbonila ligada a nitrogenio", why: "essa combinacao define a classe" },
      { lead: "a importancia biologica das amidas", answer: "a presenca dessa funcao em peptidios e proteinas", why: "ligacoes peptidicas pertencem a esse contexto estrutural" }
    ]
  },
  {
    subtopico: "Eteres e haletos organicos",
    habilidade:
      "identificar grupos funcionais e classes organicas principais",
    tags: ["eteres", "haletos", "funcoes organicas"],
    fatos: [
      { lead: "o eter", answer: "o composto em que um atomo de oxigenio liga dois radicais organicos", why: "essa e a marca funcional da classe" },
      { lead: "o haleto organico", answer: "o composto que apresenta halogenio ligado a cadeia carbonica", why: "cloro, bromo e outros podem caracterizar essa funcao" },
      { lead: "a estrutura geral dos eteres", answer: "a organizacao R-O-R' entre dois fragmentos carbonados", why: "o oxigenio faz a ponte entre eles" },
      { lead: "a substituicao por halogenio na cadeia", answer: "a caracteristica que gera haletos organicos", why: "a presenca de F, Cl, Br ou I altera propriedades" },
      { lead: "a diferenca entre alcool e eter", answer: "o fato de o alcool ter OH e o eter ter oxigenio entre dois radicais", why: "isso muda a classificacao funcional" }
    ]
  },
  {
    subtopico: "Prioridade funcional e nomenclatura",
    habilidade:
      "aplicar regras basicas de nomenclatura organica com grupos funcionais",
    tags: ["prioridade funcional", "nomenclatura", "numeracao"],
    fatos: [
      { lead: "a prioridade funcional", answer: "o criterio usado para escolher a funcao principal na nomenclatura de uma molecula", why: "alguns grupos funcionais prevalecem sobre outros no nome" },
      { lead: "a numeracao em funcoes organicas", answer: "o procedimento de localizar grupo funcional e substituintes com menores numeros possiveis", why: "isso torna a nomenclatura sistematica" },
      { lead: "a funcao principal em uma nomenclatura", answer: "a classe escolhida para definir o sufixo principal do composto", why: "outros grupos podem aparecer como prefixos" },
      { lead: "o uso de prefixos na nomenclatura organica", answer: "a indicacao de substituintes ou grupos de menor prioridade", why: "eles complementam o nome sistematico" },
      { lead: "a escolha da cadeia principal em funcoes organicas", answer: "a selecao da cadeia que contem o grupo funcional prioritario", why: "essa escolha orienta o nome completo" }
    ]
  },
  {
    subtopico: "Propriedades fisicas e quimicas",
    habilidade:
      "relacionar grupos funcionais a propriedades e aplicacoes de compostos organicos",
    tags: ["propriedades", "solubilidade", "ebulicao"],
    fatos: [
      { lead: "a influencia do grupo funcional na solubilidade", answer: "a modificacao da interacao da molecula com solventes, especialmente a agua", why: "grupos mais polares tendem a aumentar afinidade com solventes polares" },
      { lead: "a influencia do grupo funcional no ponto de ebulicao", answer: "a alteracao das interacoes intermoleculares e da energia necessaria para vaporizacao", why: "isso explica diferencas entre compostos de massas parecidas" },
      { lead: "a polaridade de uma funcao organica", answer: "a caracteristica que depende dos atomos presentes e da distribuicao de cargas na molecula", why: "grupos com oxigenio e nitrogenio costumam influenciar bastante" },
      { lead: "a reatividade funcional", answer: "o comportamento tipico de uma classe de compostos diante de reagentes", why: "o grupo funcional condiciona as transformacoes possiveis" },
      { lead: "a comparacao entre funcoes organicas", answer: "a analise das semelhancas e diferencas estruturais que afetam propriedades", why: "essa comparacao e essencial para interpretar a organica" }
    ]
  },
  {
    subtopico: "Funcoes organicas no cotidiano",
    habilidade:
      "aplicar conceitos de funcoes organicas a materiais e substancias do cotidiano",
    tags: ["cotidiano", "perfumes", "medicamentos"],
    fatos: [
      { lead: "os esteres em perfumes", answer: "um exemplo de funcao organica relacionada a aromas e fragrancias", why: "muitos esteres possuem odores caracteristicos agradaveis" },
      { lead: "os alcoois em produtos de higiene", answer: "um exemplo de funcao organica presente em desinfeccao e formulacoes", why: "o etanol e amplamente usado nessas aplicacoes" },
      { lead: "os acidos carboxilicos em alimentos", answer: "a presenca de compostos organicos relacionados a sabor, conservacao e metabolismo", why: "varios acidos aparecem naturalmente ou industrialmente" },
      { lead: "as amidas em biomoleculas", answer: "a manifestacao de grupos funcionais em estruturas biologicas como proteinas", why: "ligacoes peptidicas pertencem a essa classe" },
      { lead: "o estudo das funcoes organicas no cotidiano", answer: "a compreensao de como grupos funcionais aparecem em remedios, combustiveis e materiais", why: "isso mostra a presenca ampla da organica" }
    ]
  },
  {
    subtopico: "Comparacoes e interpretacao",
    habilidade:
      "comparar diferentes funcoes organicas e interpretar formulas estruturais",
    tags: ["comparacao", "interpretacao", "formula estrutural"],
    fatos: [
      { lead: "a diferenca entre aldeido e cetona", answer: "a localizacao da carbonila na extremidade ou no interior da cadeia", why: "esse e o criterio estrutural decisivo" },
      { lead: "a diferenca entre alcool e acido carboxilico", answer: "a presenca de hidroxila simples em um caso e carboxila no outro", why: "os grupos funcionais sao distintos" },
      { lead: "a leitura de uma formula estrutural organica", answer: "a identificacao da cadeia e do grupo funcional presente na molecula", why: "isso permite classificar corretamente o composto" },
      { lead: "a comparacao entre amina e amida", answer: "a diferenca entre nitrogenio sem carbonila adjacente e nitrogenio ligado a carbonila", why: "essa diferenca define funcoes distintas" },
      { lead: "a utilidade da interpretacao funcional", answer: "a previsao de propriedades e nomenclatura a partir da estrutura", why: "o reconhecimento do grupo funcional orienta o estudo do composto" }
    ]
  }
];

export const funcoesOrganicas = {
  id: "quimica_funcoes_organicas",
  materia: "Quimica",
  serie: [3],
  topico: "Funcoes Organicas",
  metadados: {
    disciplinaId: "quimica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Quimica",
    frente: "Grupos funcionais e classificacao organica",
    searchAliases: [
      "funcoes organicas",
      "alcoois aldeidos cetonas",
      "acidos carboxilicos esteres",
      "aminas e amidas",
      "nomenclatura organica"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar grupos funcionais e classes organicas principais",
      "relacionar grupos funcionais a propriedades e aplicacoes de compostos organicos",
      "aplicar regras basicas de nomenclatura organica com grupos funcionais",
      "aplicar conceitos de funcoes organicas a materiais e substancias do cotidiano",
      "comparar diferentes funcoes organicas e interpretar formulas estruturais"
    ],
    planejamentoQuestoes: CHEMISTRY_HUNDRED_FIFTY_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "fo",
    serie: 3,
    materia: "Quimica",
    topico: "Funcoes Organicas",
    blocos,
    stemBuilders: CHEMISTRY_STEM_BUILDERS,
    globalMatrix: CHEMISTRY_HUNDRED_FIFTY_MATRIX
  })
};

