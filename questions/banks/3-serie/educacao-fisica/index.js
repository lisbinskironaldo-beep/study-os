import { qualidadeDeVida } from "./qualidade-de-vida/index.js";
import { withPhysicalEducationEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const educacaoFisica3Serie = [
  qualidadeDeVida
].map(withPhysicalEducationEditorialAudit);
