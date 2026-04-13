function buildMatrixSlice(count, nivel, label, cognicoes) {
  return Array.from({ length: count }, (_, index) => ({
    nivel,
    label,
    cognicao: cognicoes[index % cognicoes.length]
  }));
}

export const PORTUGUESE_STEM_BUILDERS = [
  ({ lead }) => `No contexto da lingua portuguesa, ${lead} corresponde a:`,
  ({ subtopico, lead }) =>
    `Ao estudar ${subtopico.toLowerCase()}, ${lead} indica:`,
  ({ lead }) => `Qual alternativa define corretamente ${lead}?`,
  ({ subtopico, lead }) =>
    `Em questoes sobre ${subtopico.toLowerCase()}, ${lead} pode ser entendido como:`
];

export const PORTUGUESE_TWO_HUNDRED_MATRIX = [
  ...buildMatrixSlice(20, 1, "facil", ["identificacao", "compreensao"]),
  ...buildMatrixSlice(10, 2, "facil", ["compreensao", "interpretacao"]),
  ...buildMatrixSlice(10, 3, "facil", ["interpretacao", "analise"]),
  ...buildMatrixSlice(20, 4, "medio", ["analise", "comparacao", "interpretacao"]),
  ...buildMatrixSlice(20, 5, "medio", ["analise", "aplicacao", "comparacao"]),
  ...buildMatrixSlice(40, 6, "medio", ["aplicacao", "analise", "avaliacao"]),
  ...buildMatrixSlice(20, 7, "dificil", ["analise", "avaliacao", "sintese"]),
  ...buildMatrixSlice(20, 8, "dificil", ["aplicacao", "sintese", "avaliacao"]),
  ...buildMatrixSlice(20, 9, "dificil", ["sintese", "avaliacao", "analise"]),
  ...buildMatrixSlice(20, 10, "dificil", ["avaliacao", "sintese", "aplicacao"])
];

export const PORTUGUESE_TWO_HUNDRED_PLAN = {
  totalAlvo: 200,
  revisaoPorLote: 20,
  formato: "multipla_escolha",
  alternativasPorQuestao: 4,
  comentarioBreve: true,
  dificuldade: {
    facil: 30,
    medio: 90,
    dificil: 80
  },
  niveis: {
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
