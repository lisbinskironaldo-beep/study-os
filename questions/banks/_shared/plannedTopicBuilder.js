const LEVEL_MATRIX = [
  { nivel: 1, label: "facil", cognicao: "identificacao" },
  { nivel: 1, label: "facil", cognicao: "identificacao" },
  { nivel: 2, label: "facil", cognicao: "compreensao" },
  { nivel: 3, label: "medio", cognicao: "compreensao" },
  { nivel: 4, label: "medio", cognicao: "comparacao" },
  { nivel: 4, label: "medio", cognicao: "compreensao" },
  { nivel: 5, label: "medio", cognicao: "analise" },
  { nivel: 5, label: "medio", cognicao: "comparacao" },
  { nivel: 6, label: "medio", cognicao: "analise" },
  { nivel: 6, label: "medio", cognicao: "analise" },
  { nivel: 6, label: "medio", cognicao: "aplicacao" },
  { nivel: 6, label: "medio", cognicao: "aplicacao" },
  { nivel: 7, label: "dificil", cognicao: "analise" },
  { nivel: 7, label: "dificil", cognicao: "comparacao" },
  { nivel: 8, label: "dificil", cognicao: "analise" },
  { nivel: 8, label: "dificil", cognicao: "aplicacao" },
  { nivel: 9, label: "dificil", cognicao: "sintese" },
  { nivel: 9, label: "dificil", cognicao: "avaliacao" },
  { nivel: 10, label: "dificil", cognicao: "sintese" },
  { nivel: 10, label: "dificil", cognicao: "avaliacao" }
];

const STEM_BUILDERS = [
  ({ lead }) =>
    `Qual alternativa identifica ${lead}?`,
  ({ subtopico, lead }) =>
    `Ao estudar ${subtopico.toLowerCase()}, ${lead} corresponde a:`,
  ({ lead }) =>
    `Se um texto historico mencionar ${lead}, ele estara se referindo a:`,
  ({ subtopico, lead }) =>
    `Em uma analise sobre ${subtopico.toLowerCase()}, ${lead} aponta para:`
];

function padId(value) {
  return String(value).padStart(3, "0");
}

function rotate(array, offset) {
  const size = array.length;
  return array.map((_, index) => array[(index + offset) % size]);
}

function normalizeOption(value) {
  return String(value || "").trim().toLowerCase();
}

function uniquePush(options, value) {
  const normalized = normalizeOption(value);
  if (!normalized || options.some((option) => normalizeOption(option) === normalized)) {
    return;
  }
  options.push(value);
}

function buildOptions(facts, factIndex, variantIndex, fallbackFacts = []) {
  const current = facts[factIndex];
  const localDistractors = facts
    .filter((_, index) => index !== factIndex)
    .filter((fact) => normalizeOption(fact.answer) !== normalizeOption(current.answer))
    .map((fact) => fact.answer);

  const widerDistractors = fallbackFacts
    .filter((fact) => normalizeOption(fact.answer) !== normalizeOption(current.answer))
    .map((fact) => fact.answer);

  const fallbackDistractors = [
    "uma definição apenas parcialmente relacionada ao tema",
    "uma interpretação genérica que não resolve o comando",
    "um exemplo sem relação direta com o conceito pedido",
    "uma resposta que confunde forma e sentido"
  ];

  const picked = [];
  for (const option of rotate(localDistractors, (factIndex + variantIndex) % Math.max(1, localDistractors.length))) {
    uniquePush(picked, option);
    if (picked.length >= 3) break;
  }
  for (const option of rotate(widerDistractors, (factIndex + variantIndex) % Math.max(1, widerDistractors.length))) {
    uniquePush(picked, option);
    if (picked.length >= 3) break;
  }
  for (const option of fallbackDistractors) {
    uniquePush(picked, option);
    if (picked.length >= 3) break;
  }

  const finalOptions = [];
  uniquePush(finalOptions, current.answer);
  for (const option of picked) {
    uniquePush(finalOptions, option);
  }

  return rotate(finalOptions.slice(0, 4), (factIndex + variantIndex) % 4);
}

function buildTempo(nivel) {
  if (nivel <= 2) {
    return 20;
  }
  if (nivel <= 4) {
    return 25;
  }
  if (nivel <= 6) {
    return 30;
  }
  if (nivel <= 8) {
    return 35;
  }
  return 40;
}

function buildComment(answer, why) {
  return `${answer} é a resposta correta porque ${why}.`;
}

export function buildPlannedQuestions({
  prefix,
  serie,
  materia,
  topico,
  blocos,
  stemBuilders = STEM_BUILDERS,
  globalMatrix = null
}) {
  let counter = 1;
  const allFacts = blocos.flatMap((bloco) => bloco.fatos);

  const rawQuestions = blocos.flatMap((bloco) =>
    bloco.fatos.flatMap((fato, factIndex) =>
      stemBuilders.map((builder, variantIndex) => {
        const fallbackMatrix =
          LEVEL_MATRIX[
            (factIndex * stemBuilders.length) +
              variantIndex
          ];
        const opcoes = buildOptions(
          bloco.fatos,
          factIndex,
          variantIndex,
          allFacts
        );
        const matrix =
          Array.isArray(globalMatrix) &&
          globalMatrix.length
            ? globalMatrix[counter - 1] ||
              fallbackMatrix
            : fallbackMatrix;

        return {
          id: `${prefix}_${padId(counter++)}`,
          serie,
          materia,
          topico,
          subtopico: bloco.subtopico,
          dificuldadeLabel: matrix.label,
          dificuldadeNivel: matrix.nivel,
          cognicao: matrix.cognicao,
          tipo: "multipla_escolha",
          enunciado: builder({
            topico,
            subtopico: bloco.subtopico,
            lead: fato.lead
          }),
          opcoes,
          correta: fato.answer,
          comentario: buildComment(
            fato.answer,
            fato.why
          ),
          tempoEstimado: buildTempo(
            matrix.nivel
          ),
          tags: bloco.tags,
          habilidades: [bloco.habilidade],
          collections: ["questions"],
          sourceType: "original",
          sourceExam: "",
          sourceYear: null,
          competencies: [],
          status: "revisada"
        };
      })
    )
  );

  return rawQuestions;
}
