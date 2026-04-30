import { ecologia } from "./ecologia/index.js";
import { ciclosBiogeoquimicos } from "./ciclos-biogeoquimicos/index.js";
import { impactosAmbientais } from "./impactos-ambientais/index.js";
import { revisaoGeral } from "./revisao-geral/index.js";
import { withBiologyEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const biologia3Serie = [
  ecologia,
  ciclosBiogeoquimicos,
  impactosAmbientais,
  revisaoGeral
].map(withBiologyEditorialAudit);

