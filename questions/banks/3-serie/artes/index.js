import { arteContemporanea } from "./arte-contemporanea/index.js";
import { withArtsEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const artes3Serie = [
  arteContemporanea
].map(withArtsEditorialAudit);
