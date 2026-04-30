import { arteModerna } from "./arte-moderna/index.js";
import { movimentosArtisticos } from "./movimentos-artisticos/index.js";
import { withArtsEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const artes2Serie = [
  arteModerna,
  movimentosArtisticos
].map(withArtsEditorialAudit);
