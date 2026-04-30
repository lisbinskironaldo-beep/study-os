import { geopolitica } from "./geopolitica/index.js";
import { meioAmbiente } from "./meio-ambiente/index.js";
import { energia } from "./energia/index.js";
import { brasilAtual } from "./brasil-atual/index.js";
import { withGeographyEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const geografia3Serie = [
  brasilAtual,
  energia,
  geopolitica,
  meioAmbiente
].map(withGeographyEditorialAudit);
