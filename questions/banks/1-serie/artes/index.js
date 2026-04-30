import { historiaDaArteClassica } from "./historia-da-arte-classica/index.js";
import { elementosVisuais } from "./elementos-visuais/index.js";
import { withArtsEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const artes1Serie = [
  historiaDaArteClassica,
  elementosVisuais
].map(withArtsEditorialAudit);
