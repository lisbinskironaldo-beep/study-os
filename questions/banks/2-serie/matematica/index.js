import { funcoesExponenciais } from "./funcoes-exponenciais/index.js";
import { logaritmos } from "./logaritmos/index.js";
import { progressoesPaEPg } from "./progressoes-pa-e-pg/index.js";
import { trigonometriaCompleta } from "./trigonometria-completa/index.js";
import { geometriaEspacial } from "./geometria-espacial/index.js";
import { withMathematicsEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const matematica2Serie = [
  funcoesExponenciais,
  logaritmos,
  progressoesPaEPg,
  trigonometriaCompleta,
  geometriaEspacial
].map(withMathematicsEditorialAudit);

