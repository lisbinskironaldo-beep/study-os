import { republicaNoBrasil } from "./republica-no-brasil/index.js";
import { ditaduraMilitar } from "./ditadura-militar/index.js";
import { historiaContemporanea } from "./historia-contemporanea/index.js";
import { withHistoryEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const historia3Serie = [
  republicaNoBrasil,
  ditaduraMilitar,
  historiaContemporanea
].map(withHistoryEditorialAudit);
