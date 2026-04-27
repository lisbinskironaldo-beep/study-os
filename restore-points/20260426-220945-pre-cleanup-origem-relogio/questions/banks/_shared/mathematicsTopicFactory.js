import { buildPlannedQuestions } from "./plannedTopicBuilder.js";
import {
  MATHEMATICS_STEM_BUILDERS,
  MATHEMATICS_TWO_HUNDRED_MATRIX,
  MATHEMATICS_TWO_HUNDRED_PLAN
} from "./mathematicsTopicPresets.js";

export function createMathematicsTopic({
  id,
  serie,
  topico,
  prefix,
  eixo,
  frente,
  searchAliases,
  habilidadesBase,
  blocos
}) {
  return {
    id,
    materia: "Matematica",
    serie: [serie],
    topico,
    metadados: {
      disciplinaId: "matematica",
      base: "ESCOLAR",
      eixo,
      frente,
      searchAliases,
      subtopicosBase: blocos.map((bloco) => bloco.subtopico),
      habilidadesBase,
      planejamentoQuestoes: MATHEMATICS_TWO_HUNDRED_PLAN,
      seloEditorial: "VERIFICADA",
      auditado: true,
      auditadoEm: "2026-04-12"
    },
    questoes: buildPlannedQuestions({
      prefix,
      serie: [serie],
      materia: "Matematica",
      topico,
      blocos,
      stemBuilders: MATHEMATICS_STEM_BUILDERS,
      globalMatrix: MATHEMATICS_TWO_HUNDRED_MATRIX
    })
  };
}
