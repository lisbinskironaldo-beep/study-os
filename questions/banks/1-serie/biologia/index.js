import { origemDaVida } from "./origem-da-vida/index.js";
import { citologia } from "./citologia/index.js";
import { metabolismoCelular } from "./metabolismo-celular/index.js";
import { membranaPlasmatica } from "./membrana-plasmatica/index.js";
import { organelasCelulares } from "./organelas-celulares/index.js";
import { withBiologyEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const biologia1Serie = [
  origemDaVida,
  citologia,
  metabolismoCelular,
  membranaPlasmatica,
  organelasCelulares
].map(withBiologyEditorialAudit);

