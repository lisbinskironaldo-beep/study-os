import { cartografia } from "./cartografia/index.js";
import { estruturaDaTerra } from "./estrutura-da-terra/index.js";
import { climaERelevo } from "./clima-e-relevo/index.js";
import { populacao } from "./populacao/index.js";
import { withGeographyEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const geografia1Serie = [
  cartografia,
  estruturaDaTerra,
  climaERelevo,
  populacao
].map(withGeographyEditorialAudit);
