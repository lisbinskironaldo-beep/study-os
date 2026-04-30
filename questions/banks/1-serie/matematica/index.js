import { numerosReais } from "./numeros-reais/index.js";
import { notacaoCientifica } from "./notacao-cientifica/index.js";
import { razoesProporcoes } from "./razoes-e-proporcoes/index.js";
import { porcentagem } from "./porcentagem/index.js";
import { funcoesAfimEQuadratica } from "./funcoes-afim-e-quadratica/index.js";
import { introducaoATrigonometria } from "./introducao-a-trigonometria/index.js";
import { geometriaPlana } from "./geometria-plana/index.js";
import { withMathematicsEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const matematica1Serie = [
  numerosReais,
  notacaoCientifica,
  razoesProporcoes,
  porcentagem,
  funcoesAfimEQuadratica,
  introducaoATrigonometria,
  geometriaPlana
].map(withMathematicsEditorialAudit);

