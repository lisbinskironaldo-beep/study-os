import { culturaESociedade } from "./cultura-e-sociedade/index.js";
import { socializacao } from "./socializacao/index.js";
import { identidade } from "./identidade/index.js";
import { withSociologyEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const sociologia1Serie = [
  culturaESociedade,
  socializacao,
  identidade
].map(withSociologyEditorialAudit);
