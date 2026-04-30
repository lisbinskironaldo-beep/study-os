import { interpretacaoAvancadaEnem } from "./interpretacao-avancada-enem/index.js";
import { redacao } from "./redacao/index.js";
import { coesaoECoerencia } from "./coesao-e-coerencia/index.js";
import { literaturaRealismoNaturalismoModernismo } from "./literatura-realismo-naturalismo-modernismo/index.js";
import { withPortugueseEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const portugues3Serie = [
  interpretacaoAvancadaEnem,
  redacao,
  coesaoECoerencia,
  literaturaRealismoNaturalismoModernismo
].map(withPortugueseEditorialAudit);

