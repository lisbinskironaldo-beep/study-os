import { filosofiaContemporanea } from "./filosofia-contemporanea/index.js";
import { existencialismo } from "./existencialismo/index.js";
import { etica } from "./etica/index.js";
import { withPhilosophyEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const filosofia3Serie = [
  filosofiaContemporanea,
  existencialismo,
  etica
].map(withPhilosophyEditorialAudit);
