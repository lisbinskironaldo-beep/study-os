import { readingEInterpretacao } from "./reading-e-interpretacao/index.js";
import { temposVerbaisPastEFuture } from "./tempos-verbais-past-e-future/index.js";
import { vocabularioIntermediario } from "./vocabulario-intermediario/index.js";
import { withEnglishEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const ingles2Serie = [
  readingEInterpretacao,
  temposVerbaisPastEFuture,
  vocabularioIntermediario
].map(withEnglishEditorialAudit);
