import { estruturaSocial } from "./estrutura-social/index.js";
import { classesSociais } from "./classes-sociais/index.js";
import { trabalho } from "./trabalho/index.js";
import { withSociologyEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const sociologia2Serie = [
  estruturaSocial,
  classesSociais,
  trabalho
].map(withSociologyEditorialAudit);
