import { revolucoesIndustrialEFrancesa } from "./revolucoes-industrial-e-francesa/index.js";
import { independenciaDoBrasil } from "./independencia-do-brasil/index.js";
import { periodoImperial } from "./periodo-imperial/index.js";
import { withHistoryEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const historia2Serie = [
  revolucoesIndustrialEFrancesa,
  independenciaDoBrasil,
  periodoImperial
].map(withHistoryEditorialAudit);
