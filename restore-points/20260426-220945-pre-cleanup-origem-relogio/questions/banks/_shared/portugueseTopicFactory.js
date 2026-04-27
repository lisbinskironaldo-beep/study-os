import { buildPlannedQuestions } from "./plannedTopicBuilder.js";
import {
  PORTUGUESE_STEM_BUILDERS,
  PORTUGUESE_TWO_HUNDRED_MATRIX,
  PORTUGUESE_TWO_HUNDRED_PLAN
} from "./portugueseTopicPresets.js";

export function createPortugueseTopic({
  id,
  serie,
  topico,
  prefix,
  base = "ESCOLAR",
  eixo,
  frente,
  searchAliases,
  habilidadesBase,
  blocos
}) {
  return {
    id,
    materia: "Portugues",
    serie: [serie],
    topico,
    metadados: {
      disciplinaId: "portugues",
      base,
      eixo,
      frente,
      searchAliases,
      subtopicosBase: blocos.map((bloco) => bloco.subtopico),
      habilidadesBase,
      planejamentoQuestoes: PORTUGUESE_TWO_HUNDRED_PLAN,
      seloEditorial: "VERIFICADA",
      auditado: true,
      auditadoEm: "2026-04-12"
    },
    questoes: buildPlannedQuestions({
      prefix,
      serie: [serie],
      materia: "Portugues",
      topico,
      blocos,
      stemBuilders: PORTUGUESE_STEM_BUILDERS,
      globalMatrix: PORTUGUESE_TWO_HUNDRED_MATRIX
    })
  };
}
