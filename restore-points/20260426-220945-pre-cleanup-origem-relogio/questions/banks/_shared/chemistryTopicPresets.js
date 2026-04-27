export const CHEMISTRY_STEM_BUILDERS = [
  ({ lead }) =>
    `Qual alternativa identifica ${lead}?`,
  ({ lead }) =>
    `Em quimica, ${lead} corresponde a:`,
  ({ subtopico, lead }) =>
    `No estudo de ${subtopico.toLowerCase()}, ${lead} indica:`
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

export const CHEMISTRY_HUNDRED_FIFTY_MATRIX = [
  ...createEntries(
    15,
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
    5,
    3,
    "medio",
    "compreensao"
  ),
  ...createEntries(
    15,
    4,
    "medio",
    "comparacao"
  ),
  ...createEntries(
    15,
    5,
    "medio",
    "analise"
  ),
  ...createEntries(
    30,
    6,
    "medio",
    "aplicacao"
  ),
  ...createEntries(
    15,
    7,
    "dificil",
    "analise"
  ),
  ...createEntries(
    15,
    8,
    "dificil",
    "aplicacao"
  ),
  ...createEntries(
    15,
    9,
    "dificil",
    "sintese"
  ),
  ...createEntries(
    15,
    10,
    "dificil",
    "avaliacao"
  )
];

export const CHEMISTRY_HUNDRED_FIFTY_PLAN = {
  totalAlvo: 150,
  revisaoPorLote: 20,
  formato: "multipla_escolha",
  alternativasPorQuestao: 4,
  comentarioBreve: true,
  distribuicaoDificuldade: {
    facil: 20,
    medio: 70,
    dificil: 60
  },
  distribuicaoNiveis: {
    1: 15,
    2: 10,
    3: 5,
    4: 15,
    5: 15,
    6: 30,
    7: 15,
    8: 15,
    9: 15,
    10: 15
  }
};
