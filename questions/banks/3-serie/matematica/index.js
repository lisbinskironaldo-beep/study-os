import { analiseCombinatoria } from "./analise-combinatoria/index.js";
import { probabilidade } from "./probabilidade/index.js";
import { estatistica } from "./estatistica/index.js";
import { revisaoGeral } from "./revisao-geral/index.js";
import { matematicaAplicadaEnem } from "./matematica-aplicada-enem/index.js";
import { withMathematicsEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const matematica3Serie = [
  analiseCombinatoria,
  probabilidade,
  estatistica,
  revisaoGeral,
  matematicaAplicadaEnem
].map(withMathematicsEditorialAudit);

