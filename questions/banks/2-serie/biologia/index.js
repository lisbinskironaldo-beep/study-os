import { genetica } from "./genetica/index.js";
import { leisDeMendel } from "./leis-de-mendel/index.js";
import { biotecnologia } from "./biotecnologia/index.js";
import { evolucao } from "./evolucao/index.js";
import { withBiologyEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const biologia2Serie = [
  genetica,
  leisDeMendel,
  biotecnologia,
  evolucao
].map(withBiologyEditorialAudit);

