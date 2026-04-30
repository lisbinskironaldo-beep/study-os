import { introducaoAFilosofia } from "./introducao-a-filosofia/index.js";
import { preSocraticos } from "./pre-socraticos/index.js";
import { socratesPlataoAristoteles } from "./socrates-platao-aristoteles/index.js";
import { withPhilosophyEditorialAudit } from "../../_shared/editorialAuditMetadata.js";

export const filosofia1Serie = [
  introducaoAFilosofia,
  preSocraticos,
  socratesPlataoAristoteles
].map(withPhilosophyEditorialAudit);
