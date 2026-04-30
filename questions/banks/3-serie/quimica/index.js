import { eletroquimica } from "./eletroquimica/index.js";
import { quimicaOrganica } from "./quimica-organica/index.js";
import { funcoesOrganicas } from "./funcoes-organicas/index.js";
import { polimeros } from "./polimeros/index.js";
import { withChemistryEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const quimica3Serie = [
  eletroquimica,
  quimicaOrganica,
  funcoesOrganicas,
  polimeros
].map(withChemistryEditorialAudit);

