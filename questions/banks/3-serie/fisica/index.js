import { ondulatoria } from "./ondulatoria/index.js";
import { optica } from "./optica/index.js";
import { eletrodinamica } from "./eletrodinamica/index.js";
import { magnetismo } from "./magnetismo/index.js";
import { withPhysicsEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const fisica3Serie = [
  ondulatoria,
  optica,
  eletrodinamica,
  magnetismo
].map(withPhysicsEditorialAudit);
