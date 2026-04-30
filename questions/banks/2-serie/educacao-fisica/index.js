import { esportesColetivos } from "./esportes-coletivos/index.js";
import { saudeECorpo } from "./saude-e-corpo/index.js";
import { withPhysicalEducationEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const educacaoFisica2Serie = [
  esportesColetivos,
  saudeECorpo
].map(withPhysicalEducationEditorialAudit);
