export const BIOLOGY_STEM_BUILDERS = [
  ({ lead }) =>
    `Em biologia, ${lead} corresponde a:`,
  ({ subtopico, lead }) =>
    `No estudo de ${subtopico.toLowerCase()}, ${lead} indica:`,
  ({ lead }) =>
    `Qual alternativa define corretamente ${lead}?`,
  ({ subtopico, lead }) =>
    `Ao analisar ${subtopico.toLowerCase()}, ${lead} pode ser entendido como:`
];

function createEntries(
  count,
  nivel,
  label,
  cognicao
) {
  return Array.from({ length: count }, () => ({
    nivel,
    label,
    cognicao
  }));
}

export const BIOLOGY_TWO_HUNDRED_MATRIX = [
  ...createEntries(
    20,
    1,
    "facil",
    "identificacao"
  ),
  ...createEntries(
    10,
    2,
    "facil",
    "compreensao"
  ),
  ...createEntries(
    10,
    3,
    "medio",
    "compreensao"
  ),
  ...createEntries(
    20,
    4,
    "medio",
    "comparacao"
  ),
  ...createEntries(
    20,
    5,
    "medio",
    "analise"
  ),
  ...createEntries(
    40,
    6,
    "medio",
    "aplicacao"
  ),
  ...createEntries(
    20,
    7,
    "dificil",
    "analise"
  ),
  ...createEntries(
    20,
    8,
    "dificil",
    "aplicacao"
  ),
  ...createEntries(
    20,
    9,
    "dificil",
    "sintese"
  ),
  ...createEntries(
    20,
    10,
    "dificil",
    "avaliacao"
  )
];

export const BIOLOGY_TWO_HUNDRED_PLAN = {
  totalAlvo: 200,
  revisaoPorLote: 20,
  formato: "multipla_escolha",
  alternativasPorQuestao: 4,
  comentarioBreve: true,
  distribuicaoDificuldade: {
    facil: 30,
    medio: 90,
    dificil: 80
  },
  distribuicaoNiveis: {
    1: 20,
    2: 10,
    3: 10,
    4: 20,
    5: 20,
    6: 40,
    7: 20,
    8: 20,
    9: 20,
    10: 20
  }
};
