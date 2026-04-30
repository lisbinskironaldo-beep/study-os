export const PORTUGUESE_EDITORIAL_AUDIT_2026_04_30 = {
  status: "AUDITADA",
  auditadoEm: "2026-04-30",
  escopo: "Português - 1ª, 2ª e 3ª séries",
  criterios: [
    "acentuação e ortografia exibíveis",
    "mojibake e caracteres quebrados",
    "alternativa correta presente nas opções",
    "alternativas duplicadas",
    "campos vazios, placeholders e texto bruto",
    "sintaxe dos módulos"
  ],
  resultados: {
    arquivosAnalisados: 19,
    questoesAnalisadas: 3200,
    suspeitasTextuais: 0,
    problemasDeIntegridade: 0
  },
  relatorios: [
    ".codex-artifacts/editorial-audit/todas-series__portugues.md",
    ".codex-artifacts/editorial-audit/integrity__todas-series__portugues.md"
  ],
  observacao:
    "Este selo substitui o uso de VERIFICADA/revisada como garantia editorial para Português."
};

export function withPortugueseEditorialAudit(topic) {
  return {
    ...topic,
    metadados: {
      ...topic.metadados,
      auditoriaEditorial: PORTUGUESE_EDITORIAL_AUDIT_2026_04_30
    }
  };
}

export const MATHEMATICS_EDITORIAL_AUDIT_2026_04_30 = {
  status: "AUDITADA",
  auditadoEm: "2026-04-30",
  escopo: "Matem\u00e1tica - 1\u00aa, 2\u00aa e 3\u00aa s\u00e9ries",
  criterios: [
    "acentua\u00e7\u00e3o e ortografia exib\u00edveis",
    "mojibake e caracteres quebrados",
    "alternativa correta presente nas op\u00e7\u00f5es",
    "alternativas duplicadas",
    "coment\u00e1rios explicativos m\u00ednimos",
    "campos vazios, placeholders e texto bruto",
    "sintaxe dos m\u00f3dulos"
  ],
  resultados: {
    arquivosAnalisados: 20,
    questoesAnalisadas: 3410,
    suspeitasTextuais: 0,
    problemasDeIntegridade: 0
  },
  relatorios: [
    ".codex-artifacts/editorial-audit/todas-series__matematica.md",
    ".codex-artifacts/editorial-audit/integrity__todas-series__matematica.md"
  ],
  observacao:
    "Este selo substitui o uso de VERIFICADA/revisada como garantia editorial para Matem\u00e1tica."
};

export function withMathematicsEditorialAudit(topic) {
  return {
    ...topic,
    metadados: {
      ...topic.metadados,
      auditoriaEditorial: MATHEMATICS_EDITORIAL_AUDIT_2026_04_30
    }
  };
}

export const PHYSICS_EDITORIAL_AUDIT_2026_04_30 = {
  status: "AUDITADA",
  auditadoEm: "2026-04-30",
  escopo: "F\u00edsica - 1\u00aa, 2\u00aa e 3\u00aa s\u00e9ries",
  criterios: [
    "acentua\u00e7\u00e3o e ortografia exib\u00edveis",
    "mojibake e caracteres quebrados",
    "termos t\u00e9cnicos e unidades exib\u00edveis",
    "alternativa correta presente nas op\u00e7\u00f5es",
    "alternativas duplicadas",
    "campos vazios, placeholders e texto bruto",
    "sintaxe dos m\u00f3dulos"
  ],
  resultados: {
    arquivosAnalisados: 14,
    questoesAnalisadas: 1650,
    suspeitasTextuais: 0,
    problemasDeIntegridade: 0
  },
  relatorios: [
    ".codex-artifacts/editorial-audit/todas-series__fisica.md",
    ".codex-artifacts/editorial-audit/integrity__todas-series__fisica.md"
  ],
  observacao:
    "Este selo substitui o uso de VERIFICADA/revisada como garantia editorial para F\u00edsica."
};

export function withPhysicsEditorialAudit(topic) {
  return {
    ...topic,
    metadados: {
      ...topic.metadados,
      auditoriaEditorial: PHYSICS_EDITORIAL_AUDIT_2026_04_30
    }
  };
}

export const ENGLISH_EDITORIAL_AUDIT_2026_04_30 = {
  status: "AUDITADA",
  auditadoEm: "2026-04-30",
  escopo: "Ingl\u00eas - 1\u00aa, 2\u00aa e 3\u00aa s\u00e9ries",
  criterios: [
    "acentua\u00e7\u00e3o e ortografia exib\u00edveis no portugu\u00eas de apoio",
    "mojibake e caracteres quebrados",
    "preserva\u00e7\u00e3o de termos leg\u00edtimos em ingl\u00eas",
    "alternativa correta presente nas op\u00e7\u00f5es",
    "alternativas duplicadas",
    "campos vazios, placeholders e texto bruto",
    "sintaxe dos m\u00f3dulos"
  ],
  resultados: {
    arquivosAnalisados: 12,
    questoesAnalisadas: 1800,
    suspeitasTextuais: 0,
    problemasDeIntegridade: 0
  },
  relatorios: [
    ".codex-artifacts/editorial-audit/todas-series__ingles.md",
    ".codex-artifacts/editorial-audit/integrity__todas-series__ingles.md"
  ],
  observacao:
    "Este selo substitui o uso de VERIFICADA/revisada como garantia editorial para Ingl\u00eas."
};

export function withEnglishEditorialAudit(topic) {
  return {
    ...topic,
    metadados: {
      ...topic.metadados,
      auditoriaEditorial: ENGLISH_EDITORIAL_AUDIT_2026_04_30
    }
  };
}

export const BIOLOGY_EDITORIAL_AUDIT_2026_04_30 = {
  status: "AUDITADA",
  auditadoEm: "2026-04-30",
  escopo: "Biologia - 1\u00aa, 2\u00aa e 3\u00aa s\u00e9ries",
  criterios: [
    "acentua\u00e7\u00e3o e ortografia exib\u00edveis",
    "mojibake e caracteres quebrados",
    "termos biol\u00f3gicos e cient\u00edficos exib\u00edveis",
    "alternativa correta presente nas op\u00e7\u00f5es",
    "alternativas duplicadas",
    "campos vazios, placeholders e texto bruto",
    "sintaxe dos m\u00f3dulos"
  ],
  resultados: {
    arquivosAnalisados: 16,
    questoesAnalisadas: 2600,
    suspeitasTextuais: 0,
    problemasDeIntegridade: 0
  },
  relatorios: [
    ".codex-artifacts/editorial-audit/todas-series__biologia.md",
    ".codex-artifacts/editorial-audit/integrity__todas-series__biologia.md"
  ],
  observacao:
    "Este selo substitui o uso de VERIFICADA/revisada como garantia editorial para Biologia."
};

export function withBiologyEditorialAudit(topic) {
  return {
    ...topic,
    metadados: {
      ...topic.metadados,
      auditoriaEditorial: BIOLOGY_EDITORIAL_AUDIT_2026_04_30
    }
  };
}

export const CHEMISTRY_EDITORIAL_AUDIT_2026_04_30 = {
  status: "AUDITADA",
  auditadoEm: "2026-04-30",
  escopo: "Qu\u00edmica - 1\u00aa, 2\u00aa e 3\u00aa s\u00e9ries",
  criterios: [
    "acentua\u00e7\u00e3o e ortografia exib\u00edveis",
    "mojibake e caracteres quebrados",
    "termos qu\u00edmicos, unidades e nota\u00e7\u00f5es exib\u00edveis",
    "alternativa correta presente nas op\u00e7\u00f5es",
    "alternativas duplicadas",
    "campos vazios, placeholders e texto bruto",
    "sintaxe dos m\u00f3dulos"
  ],
  resultados: {
    arquivosAnalisados: 15,
    questoesAnalisadas: 1800,
    suspeitasTextuais: 0,
    problemasDeIntegridade: 0
  },
  relatorios: [
    ".codex-artifacts/editorial-audit/todas-series__quimica.md",
    ".codex-artifacts/editorial-audit/integrity__todas-series__quimica.md"
  ],
  observacao:
    "Este selo substitui o uso de VERIFICADA/revisada como garantia editorial para Qu\u00edmica."
};

export function withChemistryEditorialAudit(topic) {
  return {
    ...topic,
    metadados: {
      ...topic.metadados,
      auditoriaEditorial: CHEMISTRY_EDITORIAL_AUDIT_2026_04_30
    }
  };
}

export const PHILOSOPHY_EDITORIAL_AUDIT_2026_04_30 = {
  status: "AUDITADA",
  auditadoEm: "2026-04-30",
  escopo: "Filosofia - 1\u00aa, 2\u00aa e 3\u00aa s\u00e9ries",
  criterios: [
    "acentua\u00e7\u00e3o e ortografia exib\u00edveis",
    "mojibake e caracteres quebrados",
    "termos filos\u00f3ficos, autores e correntes exib\u00edveis",
    "alternativa correta presente nas op\u00e7\u00f5es",
    "alternativas duplicadas",
    "campos vazios, placeholders e texto bruto",
    "sintaxe dos m\u00f3dulos"
  ],
  resultados: {
    arquivosAnalisados: 11,
    questoesAnalisadas: 800,
    suspeitasTextuais: 0,
    problemasDeIntegridade: 0
  },
  relatorios: [
    ".codex-artifacts/editorial-audit/todas-series__filosofia.md",
    ".codex-artifacts/editorial-audit/integrity__todas-series__filosofia.md"
  ],
  observacao:
    "Este selo substitui o uso de VERIFICADA/revisada como garantia editorial para Filosofia."
};

export function withPhilosophyEditorialAudit(topic) {
  return {
    ...topic,
    metadados: {
      ...topic.metadados,
      auditoriaEditorial: PHILOSOPHY_EDITORIAL_AUDIT_2026_04_30
    }
  };
}

export const SOCIOLOGY_EDITORIAL_AUDIT_2026_04_30 = {
  status: "AUDITADA",
  auditadoEm: "2026-04-30",
  escopo: "Sociologia - 1\u00aa, 2\u00aa e 3\u00aa s\u00e9ries",
  criterios: [
    "acentua\u00e7\u00e3o e ortografia exib\u00edveis",
    "mojibake e caracteres quebrados",
    "termos sociol\u00f3gicos, conceitos sociais e pol\u00edticos exib\u00edveis",
    "alternativa correta presente nas op\u00e7\u00f5es",
    "alternativas duplicadas",
    "campos vazios, placeholders e texto bruto",
    "sintaxe dos m\u00f3dulos"
  ],
  resultados: {
    arquivosAnalisados: 12,
    questoesAnalisadas: 1350,
    suspeitasTextuais: 0,
    problemasDeIntegridade: 0
  },
  relatorios: [
    ".codex-artifacts/editorial-audit/todas-series__sociologia.md",
    ".codex-artifacts/editorial-audit/integrity__todas-series__sociologia.md"
  ],
  observacao:
    "Este selo substitui o uso de VERIFICADA/revisada como garantia editorial para Sociologia."
};

export function withSociologyEditorialAudit(topic) {
  return {
    ...topic,
    metadados: {
      ...topic.metadados,
      auditoriaEditorial: SOCIOLOGY_EDITORIAL_AUDIT_2026_04_30
    }
  };
}

export const HISTORY_EDITORIAL_AUDIT_2026_04_30 = {
  status: "AUDITADA",
  auditadoEm: "2026-04-30",
  escopo: "Hist\u00f3ria - 1\u00aa, 2\u00aa e 3\u00aa s\u00e9ries",
  criterios: [
    "acentua\u00e7\u00e3o e ortografia exib\u00edveis",
    "mojibake e caracteres quebrados",
    "termos hist\u00f3ricos, per\u00edodos, processos e conceitos exib\u00edveis",
    "alternativa correta presente nas op\u00e7\u00f5es",
    "alternativas duplicadas",
    "campos vazios, placeholders e texto bruto",
    "sintaxe dos m\u00f3dulos"
  ],
  resultados: {
    arquivosAnalisados: 13,
    questoesAnalisadas: 2000,
    suspeitasTextuais: 0,
    problemasDeIntegridade: 0
  },
  relatorios: [
    ".codex-artifacts/editorial-audit/todas-series__historia.md",
    ".codex-artifacts/editorial-audit/integrity__todas-series__historia.md"
  ],
  observacao:
    "Este selo substitui o uso de VERIFICADA/revisada como garantia editorial para Hist\u00f3ria."
};

export function withHistoryEditorialAudit(topic) {
  return {
    ...topic,
    metadados: {
      ...topic.metadados,
      auditoriaEditorial: HISTORY_EDITORIAL_AUDIT_2026_04_30
    }
  };
}

export const GEOGRAPHY_EDITORIAL_AUDIT_2026_04_30 = {
  status: "AUDITADA",
  auditadoEm: "2026-04-30",
  escopo: "Geografia - 1\u00aa, 2\u00aa e 3\u00aa s\u00e9ries",
  criterios: [
    "acentua\u00e7\u00e3o e ortografia exib\u00edveis",
    "mojibake e caracteres quebrados",
    "termos geogr\u00e1ficos, unidades, mapas e conceitos exib\u00edveis",
    "alternativa correta presente nas op\u00e7\u00f5es",
    "alternativas duplicadas",
    "campos vazios, placeholders e texto bruto",
    "sintaxe dos m\u00f3dulos"
  ],
  resultados: {
    arquivosAnalisados: 15,
    questoesAnalisadas: 2400,
    suspeitasTextuais: 0,
    problemasDeIntegridade: 0
  },
  relatorios: [
    ".codex-artifacts/editorial-audit/todas-series__geografia.md",
    ".codex-artifacts/editorial-audit/integrity__todas-series__geografia.md"
  ],
  observacao:
    "Este selo substitui o uso de VERIFICADA/revisada como garantia editorial para Geografia."
};

export function withGeographyEditorialAudit(topic) {
  return {
    ...topic,
    metadados: {
      ...topic.metadados,
      auditoriaEditorial: GEOGRAPHY_EDITORIAL_AUDIT_2026_04_30
    }
  };
}

export const ARTS_EDITORIAL_AUDIT_2026_04_30 = {
  status: "AUDITADA",
  auditadoEm: "2026-04-30",
  escopo: "Artes - 1\u00aa, 2\u00aa e 3\u00aa s\u00e9ries",
  criterios: [
    "acentua\u00e7\u00e3o e ortografia exib\u00edveis",
    "mojibake e caracteres quebrados",
    "termos art\u00edsticos, movimentos, obras e conceitos exib\u00edveis",
    "alternativa correta presente nas op\u00e7\u00f5es",
    "alternativas duplicadas",
    "campos vazios, placeholders e texto bruto",
    "sintaxe dos m\u00f3dulos"
  ],
  resultados: {
    arquivosAnalisados: 8,
    questoesAnalisadas: 500,
    suspeitasTextuais: 0,
    problemasDeIntegridade: 0
  },
  relatorios: [
    ".codex-artifacts/editorial-audit/todas-series__artes.md",
    ".codex-artifacts/editorial-audit/integrity__todas-series__artes.md"
  ],
  observacao:
    "Este selo substitui o uso de VERIFICADA/revisada como garantia editorial para Artes."
};

export function withArtsEditorialAudit(topic) {
  return {
    ...topic,
    metadados: {
      ...topic.metadados,
      auditoriaEditorial: ARTS_EDITORIAL_AUDIT_2026_04_30
    }
  };
}

export const PHYSICAL_EDUCATION_EDITORIAL_AUDIT_2026_04_30 = {
  status: "AUDITADA",
  auditadoEm: "2026-04-30",
  escopo: "Educa\u00e7\u00e3o F\u00edsica - 1\u00aa, 2\u00aa e 3\u00aa s\u00e9ries",
  criterios: [
    "acentua\u00e7\u00e3o e ortografia exib\u00edveis",
    "mojibake e caracteres quebrados",
    "termos corporais, esportivos, sa\u00fade e qualidade de vida exib\u00edveis",
    "alternativa correta presente nas op\u00e7\u00f5es",
    "alternativas duplicadas",
    "campos vazios, placeholders e texto bruto",
    "sintaxe dos m\u00f3dulos"
  ],
  resultados: {
    arquivosAnalisados: 8,
    questoesAnalisadas: 500,
    suspeitasTextuais: 0,
    problemasDeIntegridade: 0
  },
  relatorios: [
    ".codex-artifacts/editorial-audit/todas-series__educacao-fisica.md",
    ".codex-artifacts/editorial-audit/integrity__todas-series__educacao-fisica.md"
  ],
  observacao:
    "Este selo substitui o uso de VERIFICADA/revisada como garantia editorial para Educa\u00e7\u00e3o F\u00edsica."
};

export function withPhysicalEducationEditorialAudit(topic) {
  return {
    ...topic,
    metadados: {
      ...topic.metadados,
      auditoriaEditorial: PHYSICAL_EDUCATION_EDITORIAL_AUDIT_2026_04_30
    }
  };
}
