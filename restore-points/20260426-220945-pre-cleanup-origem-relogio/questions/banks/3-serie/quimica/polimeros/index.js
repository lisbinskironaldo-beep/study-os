import { buildPlannedQuestions } from "../../../_shared/plannedTopicBuilder.js";
import {
  CHEMISTRY_HUNDRED_FIFTY_MATRIX,
  CHEMISTRY_HUNDRED_FIFTY_PLAN,
  CHEMISTRY_STEM_BUILDERS
} from "../../../_shared/chemistryTopicPresets.js";

const blocos = [
  {
    subtopico: "Conceito de polimero",
    habilidade:
      "identificar conceitos fundamentais relacionados a polimeros",
    tags: ["polimeros", "monomeros", "macromoleculas"],
    fatos: [
      { lead: "um polimero", answer: "a macromolecula formada pela repeticao de unidades menores chamadas monomeros", why: "sua estrutura longa resulta de encadeamento repetitivo" },
      { lead: "o monomero", answer: "a pequena unidade molecular que se repete para formar um polimero", why: "ele funciona como bloco de construcao da cadeia" },
      { lead: "uma macromolecula", answer: "a molecula de grande massa molecular resultante da uniao de muitas unidades", why: "esse e um traco marcante dos polimeros" },
      { lead: "a polimerizacao", answer: "o processo quimico de formacao de polimeros a partir de monomeros", why: "ela converte pequenas moleculas em grandes cadeias" },
      { lead: "a repeticao estrutural em polimeros", answer: "a presenca de unidades que se sucedem ao longo da cadeia", why: "esse padrao define a natureza polimerica" }
    ]
  },
  {
    subtopico: "Polimerizacao por adicao",
    habilidade:
      "distinguir mecanismos basicos de polimerizacao",
    tags: ["adicao", "monomeros insaturados", "polietileno"],
    fatos: [
      { lead: "a polimerizacao por adicao", answer: "a formacao de polimeros pela abertura de ligacoes multiplas dos monomeros", why: "muitos alcenos originam polimeros por esse mecanismo" },
      { lead: "um monomero de adicao", answer: "a molecula geralmente insaturada capaz de ligar-se repetidamente a outras iguais", why: "a ligacao multipla favorece a abertura e uniao em cadeia" },
      { lead: "o polietileno", answer: "um polimero obtido a partir da polimerizacao do eteno", why: "ele e um exemplo classico de polimero de adicao" },
      { lead: "a manutencao da composicao basica na adicao", answer: "a ausencia de subproduto pequeno na formacao do polimero", why: "os atomos do monomero entram praticamente todos na cadeia" },
      { lead: "o papel da ligacao dupla na adicao", answer: "o fornecimento de ponto reativo para encadear monomeros", why: "ela se rompe e permite crescimento da cadeia" }
    ]
  },
  {
    subtopico: "Polimerizacao por condensacao",
    habilidade:
      "distinguir mecanismos basicos de polimerizacao",
    tags: ["condensacao", "subproduto", "nylon"],
    fatos: [
      { lead: "a polimerizacao por condensacao", answer: "a formacao de polimeros com eliminacao de pequenas moleculas como agua", why: "o encadeamento ocorre acompanhado de subproduto" },
      { lead: "o subproduto na condensacao", answer: "a pequena molecula liberada durante a uniao das unidades reativas", why: "agua e um exemplo comum nesse mecanismo" },
      { lead: "o nylon", answer: "um exemplo de polimero obtido por condensacao", why: "sua estrutura resulta da uniao de monomeros bifuncionais" },
      { lead: "a necessidade de grupos funcionais reativos na condensacao", answer: "a condicao estrutural que permite a uniao progressiva dos monomeros", why: "grupos complementares reagem e fazem a cadeia crescer" },
      { lead: "a diferenca entre adicao e condensacao", answer: "o fato de a condensacao liberar subproduto e a adicao nao", why: "essa e a comparacao mais basica entre os mecanismos" }
    ]
  },
  {
    subtopico: "Polimeros naturais",
    habilidade:
      "classificar polimeros naturais e sinteticos",
    tags: ["naturais", "celulose", "proteinas"],
    fatos: [
      { lead: "um polimero natural", answer: "o polimero produzido por seres vivos ou presente em materiais naturais", why: "celulose e proteinas sao exemplos importantes" },
      { lead: "a celulose", answer: "o polimero natural de glicose presente em paredes celulares vegetais", why: "ela compoe fibras e diversos materiais naturais" },
      { lead: "as proteinas como polimeros", answer: "a cadeia de aminoacidos unida por ligacoes peptidicas", why: "essa estrutura macromolecular caracteriza sua natureza polimerica" },
      { lead: "o amido", answer: "um polimero natural de reserva energetica em plantas", why: "ele tambem resulta de repeticoes de unidades de glicose" },
      { lead: "a borracha natural", answer: "o polimero obtido do latex de certas plantas", why: "ela exemplifica material elastico de origem natural" }
    ]
  },
  {
    subtopico: "Polimeros sinteticos",
    habilidade:
      "classificar polimeros naturais e sinteticos",
    tags: ["sinteticos", "plastico", "industria"],
    fatos: [
      { lead: "um polimero sintetico", answer: "o polimero produzido artificialmente por processos industriais", why: "plasticos e fibras sinteticas pertencem a essa categoria" },
      { lead: "o PVC", answer: "um polimero sintetico obtido a partir do cloreto de vinila", why: "ele e muito usado em tubos e revestimentos" },
      { lead: "o poliestireno", answer: "o polimero sintetico derivado do estireno", why: "ele aparece em embalagens e espumas" },
      { lead: "o PET", answer: "o polimero usado em garrafas e fibras sinteticas", why: "ele tem grande relevancia no cotidiano" },
      { lead: "a importancia industrial dos polimeros sinteticos", answer: "a possibilidade de produzir materiais com propriedades ajustadas para diferentes usos", why: "isso explica sua ampla difusao" }
    ]
  },
  {
    subtopico: "Termoplasticos e termofixos",
    habilidade:
      "relacionar estrutura de polimeros a propriedades e aplicacoes",
    tags: ["termoplasticos", "termofixos", "reciclagem"],
    fatos: [
      { lead: "um termoplastico", answer: "o polimero que pode amolecer e ser remoldado quando aquecido", why: "sua estrutura permite reprocessamento em muitas situacoes" },
      { lead: "um termofixo", answer: "o polimero que endurece de forma mais permanente apos processamento", why: "sua rede estrutural dificulta remoldagem pelo calor" },
      { lead: "a diferenca estrutural entre termoplasticos e termofixos", answer: "o grau de encadeamento e reticulacao entre as cadeias", why: "isso afeta comportamento diante do calor" },
      { lead: "a reciclabilidade comum dos termoplasticos", answer: "a possibilidade mais ampla de reprocessamento por fusao", why: "isso favorece aplicacoes em reciclagem" },
      { lead: "o uso de termofixos", answer: "a aplicacao em pecas que exigem maior rigidez e estabilidade termica", why: "suas ligacoes estruturais suportam certas condicoes melhor" }
    ]
  },
  {
    subtopico: "Elastomeros e fibras",
    habilidade:
      "relacionar estrutura de polimeros a propriedades e aplicacoes",
    tags: ["elastomeros", "fibras", "propriedades"],
    fatos: [
      { lead: "um elastomero", answer: "o polimero com alta elasticidade e capacidade de deformar-se e voltar ao formato inicial", why: "borrachas sao exemplos tipicos dessa classe" },
      { lead: "uma fibra sintetica", answer: "o material polimerico produzido em fios com boa resistencia mecanica", why: "nylon e poliester ilustram essa aplicacao" },
      { lead: "a elasticidade dos elastomeros", answer: "a propriedade associada a cadeias flexiveis e organizacao estrutural adequada", why: "ela permite deformacao com retorno posterior" },
      { lead: "a resistencia das fibras polimericas", answer: "a caracteristica importante para uso textil e industrial", why: "cadeias alinhadas contribuem para esse comportamento" },
      { lead: "a vulcanizacao da borracha", answer: "o processo que melhora propriedades mecanicas de elastomeros naturais", why: "ele cria ligacoes cruzadas controladas" }
    ]
  },
  {
    subtopico: "Plastificantes e aditivos",
    habilidade:
      "relacionar estrutura de polimeros a propriedades e aplicacoes",
    tags: ["aditivos", "plastificantes", "materiais"],
    fatos: [
      { lead: "um plastificante", answer: "o aditivo usado para tornar certos polimeros mais flexiveis", why: "ele modifica a interacao entre cadeias do material" },
      { lead: "um aditivo polimerico", answer: "a substancia adicionada para alterar desempenho, cor ou estabilidade do material", why: "muitos produtos finais dependem desses ajustes" },
      { lead: "a funcao dos estabilizantes", answer: "a protecao do polimero contra degradacao por calor, luz ou oxigenio", why: "eles aumentam durabilidade do produto" },
      { lead: "a funcao dos corantes em polimeros", answer: "a modificacao estetica do material produzido", why: "eles atendem exigencias visuais e comerciais" },
      { lead: "a formulacao de um plastico", answer: "a combinacao do polimero base com aditivos conforme o uso desejado", why: "propriedades finais dependem dessa composicao" }
    ]
  },
  {
    subtopico: "Impactos ambientais e reciclagem",
    habilidade:
      "avaliar impactos ambientais e alternativas de uso de polimeros",
    tags: ["impactos ambientais", "reciclagem", "residuos"],
    fatos: [
      { lead: "o descarte inadequado de plasticos", answer: "o problema ambiental causado pelo acumulo persistente de residuos polimericos", why: "muitos materiais demoram muito tempo para se degradar" },
      { lead: "a reciclagem de polimeros", answer: "o reaproveitamento de materiais plastificados para reduzir residuos e consumo de recursos", why: "ela e uma estrategia importante de gestao ambiental" },
      { lead: "um plastico biodegradavel", answer: "o material projetado para degradar-se mais facilmente em certas condicoes", why: "ele busca reduzir impactos ambientais prolongados" },
      { lead: "a coleta seletiva de plasticos", answer: "a separacao de residuos para facilitar triagem e reciclagem", why: "essa etapa melhora o destino dos materiais" },
      { lead: "a educacao ambiental sobre polimeros", answer: "a conscientizacao sobre consumo, descarte e reaproveitamento de materiais", why: "ela ajuda a enfrentar o problema dos residuos" }
    ]
  },
  {
    subtopico: "Aplicacoes dos polimeros",
    habilidade:
      "avaliar impactos ambientais e alternativas de uso de polimeros",
    tags: ["aplicacoes", "embalagens", "materiais"],
    fatos: [
      { lead: "os polimeros nas embalagens", answer: "a aplicacao de materiais leves, moldaveis e resistentes para acondicionar produtos", why: "essa e uma das utilizacoes mais difundidas dos plasticos" },
      { lead: "os polimeros na medicina", answer: "o uso de materiais em seringas, proteses, tubos e embalagens hospitalares", why: "propriedades especificas tornam esses materiais adequados" },
      { lead: "os polimeros na industria textil", answer: "a presenca de fibras sinteticas em roupas e tecidos", why: "poliester e nylon sao exemplos marcantes" },
      { lead: "os polimeros na construcao civil", answer: "a utilizacao de materiais como PVC em tubos, revestimentos e acabamentos", why: "resistencia e durabilidade favorecem esse uso" },
      { lead: "a relevancia dos polimeros no cotidiano", answer: "a presenca ampla desses materiais em objetos, equipamentos e processos modernos", why: "eles combinam propriedades variadas com producao em larga escala" }
    ]
  }
];

export const polimeros = {
  id: "quimica_polimeros",
  materia: "Quimica",
  serie: [3],
  topico: "Polimeros",
  metadados: {
    disciplinaId: "quimica",
    base: "ESCOLAR",
    seloEditorial: "VERIFICADA",
    eixo: "Quimica",
    frente: "Macromoleculas, materiais e sustentabilidade",
    searchAliases: [
      "polimeros",
      "polimerizacao por adicao e condensacao",
      "plasticos",
      "elastomeros e fibras",
      "reciclagem de polimeros"
    ],
    subtopicosBase: blocos.map((bloco) => bloco.subtopico),
    habilidadesBase: [
      "identificar conceitos fundamentais relacionados a polimeros",
      "distinguir mecanismos basicos de polimerizacao",
      "classificar polimeros naturais e sinteticos",
      "relacionar estrutura de polimeros a propriedades e aplicacoes",
      "avaliar impactos ambientais e alternativas de uso de polimeros"
    ],
    planejamentoQuestoes: CHEMISTRY_HUNDRED_FIFTY_PLAN,
    auditado: true,
    auditadoEm: "2026-04-12"
  },
  questoes: buildPlannedQuestions({
    prefix: "pol",
    serie: 3,
    materia: "Quimica",
    topico: "Polimeros",
    blocos,
    stemBuilders: CHEMISTRY_STEM_BUILDERS,
    globalMatrix: CHEMISTRY_HUNDRED_FIFTY_MATRIX
  })
};

