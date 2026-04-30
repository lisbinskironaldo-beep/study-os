import { cidadania } from "./cidadania/index.js";
import { movimentosSociais } from "./movimentos-sociais/index.js";
import { politica } from "./politica/index.js";
import { withSociologyEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const sociologia3Serie = [
  cidadania,
  movimentosSociais,
  politica
].map(withSociologyEditorialAudit);
