import { interpretacaoAvancada } from "./interpretacao-avancada/index.js";
import { sintaxePeriodoSimplesEComposto } from "./sintaxe-periodo-simples-e-composto/index.js";
import { concordancia } from "./concordancia/index.js";
import { regencia } from "./regencia/index.js";
import { literaturaBarrocoArcadismoRomantismo } from "./literatura-barroco-arcadismo-romantismo/index.js";
import { withPortugueseEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const portugues2Serie = [
  interpretacaoAvancada,
  sintaxePeriodoSimplesEComposto,
  concordancia,
  regencia,
  literaturaBarrocoArcadismoRomantismo
].map(withPortugueseEditorialAudit);

