import { culturaCorporal } from "./cultura-corporal/index.js";
import { esportesBasicos } from "./esportes-basicos/index.js";
import { withPhysicalEducationEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const educacaoFisica1Serie = [
  culturaCorporal,
  esportesBasicos
].map(withPhysicalEducationEditorialAudit);
