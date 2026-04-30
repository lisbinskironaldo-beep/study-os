import { filosofiaModernaDescartesLockeRousseau } from "./filosofia-moderna-descartes-locke-rousseau/index.js";
import { iluminismo } from "./iluminismo/index.js";
import { withPhilosophyEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const filosofia2Serie = [
  filosofiaModernaDescartesLockeRousseau,
  iluminismo
].map(withPhilosophyEditorialAudit);
