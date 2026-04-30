import { estruturaAtomica } from "./estrutura-atomica/index.js";
import { tabelaPeriodica } from "./tabela-periodica/index.js";
import { ligacoesQuimicas } from "./ligacoes-quimicas/index.js";
import { funcoesInorganicas } from "./funcoes-inorganicas/index.js";
import { withChemistryEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const quimica1Serie = [
  estruturaAtomica,
  tabelaPeriodica,
  ligacoesQuimicas,
  funcoesInorganicas
].map(withChemistryEditorialAudit);

