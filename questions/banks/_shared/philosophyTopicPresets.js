export const PHILOSOPHY_STEM_BUILDERS = [
  ({ lead }) =>
    `Na filosofia, ${lead} corresponde a:`,
  ({ subtopico, lead }) =>
    `Ao estudar ${subtopico.toLowerCase()}, ${lead} pode ser entendido como:`
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

export const PHILOSOPHY_HUNDRED_MATRIX = [
  ...createEntries(
    10,
    1,
    "facil",
    "identificacao"
  ),
  ...createEntries(
    5,
    2,
    "facil",
    "compreensao"
  ),
  ...createEntries(
    5,
    3,
    "medio",
    "compreensao"
  ),
  ...createEntries(
    10,
    4,
    "medio",
    "comparacao"
  ),
  ...createEntries(
    10,
    5,
    "medio",
    "analise"
  ),
  ...createEntries(
    20,
    6,
    "medio",
    "aplicacao"
  ),
  ...createEntries(
    10,
    7,
    "dificil",
    "analise"
  ),
  ...createEntries(
    10,
    8,
    "dificil",
    "aplicacao"
  ),
  ...createEntries(
    10,
    9,
    "dificil",
    "sintese"
  ),
  ...createEntries(
    10,
    10,
    "dificil",
    "avaliacao"
  )
];

export const PHILOSOPHY_HUNDRED_PLAN = {
  totalAlvo: 100,
  revisaoPorLote: 20,
  formato: "multipla_escolha",
  alternativasPorQuestao: 4,
  comentarioBreve: true,
  distribuicaoDificuldade: {
    facil: 15,
    medio: 45,
    dificil: 40
  },
  distribuicaoNiveis: {
    1: 10,
    2: 5,
    3: 5,
    4: 10,
    5: 10,
    6: 20,
    7: 10,
    8: 10,
    9: 10,
    10: 10
  }
};
