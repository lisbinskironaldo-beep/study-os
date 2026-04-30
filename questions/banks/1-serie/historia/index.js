import { antiguidadeEgitoGreciaRoma } from "./antiguidade-egito-grecia-roma/index.js";
import { feudalismo } from "./feudalismo/index.js";
import { formacaoDosEstadosModernos } from "./formacao-dos-estados-modernos/index.js";
import { expansaoMaritima } from "./expansao-maritima/index.js";
import { withHistoryEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const historia1Serie = [
  antiguidadeEgitoGreciaRoma,
  feudalismo,
  formacaoDosEstadosModernos,
  expansaoMaritima
].map(withHistoryEditorialAudit);
