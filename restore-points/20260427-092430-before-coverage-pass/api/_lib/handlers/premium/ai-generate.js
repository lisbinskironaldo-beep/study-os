const { sendJson, readJsonBody } = require("../../json");
const { callGeminiJson, isGeminiConfigured, isRetryableGeminiStatus } = require("../../gemini");
const { getPremiumStatus, sanitizeCustomerId } = require("../../premium-entitlements");
const { readAppSession } = require("../../auth-session");

const TASKS = {
    FREE_BUNDLE: "free_bundle_from_material",
    EXTRA_MINI_EXAM: "extra_mini_exam",
    PREMIUM_LEVEL_EXAM: "premium_level_exam"
};

const PROMPT_VERSION = "rotanota-pdf-focused-ai-v3";
const DEFAULT_MODEL = "gemini-2.5-flash-lite";
const FALLBACK_MODEL = "gemini-2.5-flash-lite";
const FREE_MAX_TEXT_CHARS = 30000;
const PREMIUM_MAX_TEXT_CHARS = 90000;
const LEVEL_EXAM_COUNTS = [10, 20, 30];

function cleanText(value, fallback = "") {
    return String(value || fallback)
        .replace(/\s+/g, " ")
        .trim();
}

function truncateText(value, maxLength) {
    const text = cleanText(value);
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function asArray(value) {
    return Array.isArray(value) ? value : [];
}

function clampNumber(value, min, max, fallback) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return fallback;
    }
    return Math.max(min, Math.min(max, numeric));
}

function parseIsoDate(value) {
    const text = cleanText(value);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        return null;
    }
    const parsed = new Date(`${text}T00:00:00Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function computeDaysUntilExam(value) {
    const examDate = parseIsoDate(value);
    if (!examDate) {
        return null;
    }
    const now = new Date();
    const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const examUtc = Date.UTC(examDate.getUTCFullYear(), examDate.getUTCMonth(), examDate.getUTCDate());
    return Math.max(0, Math.round((examUtc - todayUtc) / 86400000));
}

function looksLikeLargeLegalMaterial(materialName = "") {
    return /(codigo|c[oó]digo|lei|decreto|estatuto|clt|constitui|regulamento|penal|civil|processual)/i.test(cleanText(materialName));
}

function inferMaterialProfile(body = {}) {
    const materialName = cleanText(body.materialName);
    const textSample = truncateText(body.extractedText, 12000);
    const combined = `${materialName} ${textSample}`.toLowerCase();

    if (/(codigo|c[oó]digo|lei|decreto|estatuto|clt|constitui|art\.|artigo|penal|civil|processual|tribut|administrativo)/i.test(combined)) {
        return "juridico";
    }

    if (/(formula|f[oó]rmula|calculo|c[aá]lculo|equacao|equa[cç][aã]o|matematica|matem[aá]tica|fisica|f[ií]sica|quimica|qu[ií]mica)/i.test(combined)) {
        return "exatas";
    }

    if (/(anatomia|fisiologia|patologia|diagn[oó]stico|clinico|cl[ií]nico|biologia|medicina|enfermagem|farmacologia)/i.test(combined)) {
        return "saude_biologicas";
    }

    if (/(hist[oó]ria|geografia|sociologia|filosofia|autor|teoria|revolu[cç][aã]o|linha do tempo)/i.test(combined)) {
        return "humanas";
    }

    if (/(edital|conte[uú]do program[aá]tico|cronograma|cargo|banca|concurso)/i.test(combined)) {
        return "edital";
    }

    return "geral";
}

function buildBundlePlan(body, premiumActive) {
    const pageCount = Math.max(0, Number(body.pageCount || 0));
    const dailyMinutes = Math.max(0, Number(body.dailyMinutes || 0));
    const daysUntilExam = computeDaysUntilExam(body.examDate);
    const materialProfile = inferMaterialProfile(body);
    const legalMaterial = materialProfile === "juridico" || looksLikeLargeLegalMaterial(body.materialName);
    const tierMax = premiumActive ? 18 : 4;
    let desiredBlockCount = premiumActive ? 8 : 3;

    if (pageCount >= 120) {
        desiredBlockCount += premiumActive ? 7 : 1;
    } else if (pageCount >= 80) {
        desiredBlockCount += premiumActive ? 5 : 1;
    } else if (pageCount >= 40) {
        desiredBlockCount += premiumActive ? 4 : 1;
    } else if (pageCount >= 20) {
        desiredBlockCount += 1;
    } else if (pageCount >= 8 && !premiumActive) {
        desiredBlockCount += 1;
    }

    if (legalMaterial) {
        desiredBlockCount += premiumActive ? 1 : 0;
    }

    if (daysUntilExam !== null) {
        if (daysUntilExam <= 7) {
            desiredBlockCount -= premiumActive ? 2 : 1;
        } else if (daysUntilExam <= 21) {
            desiredBlockCount -= 1;
        } else if (daysUntilExam >= 120) {
            desiredBlockCount += premiumActive ? 2 : 1;
        } else if (daysUntilExam >= 60) {
            desiredBlockCount += 1;
        }
    }

    if (dailyMinutes >= 180) {
        desiredBlockCount += 1;
    } else if (dailyMinutes > 0 && dailyMinutes <= 30) {
        desiredBlockCount -= 1;
    }

    desiredBlockCount = clampNumber(
        body.desiredBlockCount || desiredBlockCount,
        premiumActive && pageCount >= 120 ? 12 : premiumActive && pageCount >= 80 ? 10 : premiumActive ? 6 : 2,
        tierMax,
        premiumActive && pageCount >= 120 ? 15 : premiumActive && pageCount >= 80 ? 13 : premiumActive ? 9 : 3
    );

    const planMode = daysUntilExam !== null && daysUntilExam <= 14
        ? "reta_final"
        : desiredBlockCount >= 9
            ? "amplo"
            : "equilibrado";

    return {
        premiumActive: Boolean(premiumActive),
        pageCount,
        dailyMinutes,
        daysUntilExam,
        materialProfile,
        legalMaterial,
        desiredBlockCount,
        planMode,
        learningDepth: premiumActive ? "apostila_interativa" : "trilha_inicial",
        visualAidBudget: premiumActive ? "amplo" : "enxuto",
        freePageLimit: 8,
        maxTextChars: premiumActive ? PREMIUM_MAX_TEXT_CHARS : FREE_MAX_TEXT_CHARS
    };
}

function normalizeQuestion(item, fallbackTopic, index) {
    const options = asArray(item && item.options)
        .map((option) => cleanText(option))
        .filter(Boolean)
        .slice(0, 4);

    while (options.length < 4) {
        options.push(`Alternativa ${options.length + 1}`);
    }

    const correctIndex = Number(item && item.correctIndex);

    return {
        prompt: cleanText(item && item.prompt, `Questao ${index + 1} sobre ${fallbackTopic}`),
        options,
        correctIndex: Number.isFinite(correctIndex) && correctIndex >= 0 && correctIndex < options.length
            ? correctIndex
            : 0,
        rationale: cleanText(item && item.rationale, "Revise o criterio central deste ponto antes de seguir.")
    };
}

function normalizeTrueFalse(item, fallbackTopic, index) {
    return {
        statement: cleanText(item && item.statement, `Afirmacao ${index + 1} sobre ${fallbackTopic}.`),
        answer: Boolean(item && item.answer),
        rationale: cleanText(item && item.rationale, "Confira se a afirmacao respeita o limite do conceito.")
    };
}

function normalizeFlashcard(item, fallbackTopic, index) {
    return {
        front: cleanText(item && item.front, `${fallbackTopic} ${index + 1}`),
        back: cleanText(item && item.back, "Releia o trecho central deste bloco."),
        tip: cleanText(item && item.tip, "Use este card para recuperar o criterio, nao so o nome.")
    };
}

function normalizeQuestionSeries(series, fallbackTopic) {
    const normalized = asArray(series)
        .slice(0, 3)
        .map((items) => asArray(items)
            .slice(0, 5)
            .map((item, index) => normalizeQuestion(item, fallbackTopic, index))
            .filter((item) => item.prompt));

    while (normalized.length < 3) {
        normalized.push([]);
    }

    return normalized.map((items, seriesIndex) => {
        if (items.length) {
            return items;
        }

        return Array.from({ length: 3 }, (_, index) => normalizeQuestion({}, fallbackTopic, (seriesIndex * 3) + index));
    });
}

function normalizeTrueFalseSeries(series, fallbackTopic) {
    const normalized = asArray(series)
        .slice(0, 3)
        .map((items) => asArray(items)
            .slice(0, 5)
            .map((item, index) => normalizeTrueFalse(item, fallbackTopic, index)));

    while (normalized.length < 3) {
        normalized.push([]);
    }

    return normalized.map((items, seriesIndex) => {
        if (items.length) {
            return items;
        }

        return Array.from({ length: 3 }, (_, index) => normalizeTrueFalse({}, fallbackTopic, (seriesIndex * 3) + index));
    });
}

function normalizeFlashcardSeries(series, fallbackTopic) {
    const normalized = asArray(series)
        .slice(0, 3)
        .map((items) => asArray(items)
            .slice(0, 5)
            .map((item, index) => normalizeFlashcard(item, fallbackTopic, index)));

    while (normalized.length < 3) {
        normalized.push([]);
    }

    return normalized.map((items, seriesIndex) => {
        if (items.length) {
            return items;
        }

        return Array.from({ length: 3 }, (_, index) => normalizeFlashcard({}, fallbackTopic, (seriesIndex * 3) + index));
    });
}

function normalizeDocumentSections(sections, fallbackTopic) {
    return asArray(sections).slice(0, 8).map((section, index) => {
        const paragraphs = asArray(section && section.paragraphs)
            .map((paragraph) => cleanText(paragraph))
            .filter(Boolean)
            .slice(0, 5);
        const items = asArray(section && section.items)
            .map((item) => cleanText(item))
            .filter(Boolean)
            .slice(0, 8);

        return {
            id: cleanText(section && section.id, `section-${index + 1}`),
            type: cleanText(section && section.type, cleanText(section && section.id, "reading")),
            label: cleanText(section && section.label, "Leitura guiada"),
            title: cleanText(section && section.title, fallbackTopic),
            paragraphs,
            items
        };
    }).filter((section) => section.paragraphs.length || section.items.length);
}

function normalizeTextList(value, maxItems = 8) {
    return asArray(value)
        .map((item) => cleanText(item))
        .filter(Boolean)
        .slice(0, maxItems);
}

function normalizeObjectList(value, normalizer, maxItems = 4) {
    return asArray(value)
        .map((item, index) => normalizer(item, index))
        .filter(Boolean)
        .slice(0, maxItems);
}

function normalizeComparisonTable(table, index) {
    const rows = asArray(table && table.rows)
        .map((row) => ({
            left: cleanText(row && (row.left || row.term || row.concept)),
            right: cleanText(row && (row.right || row.definition || row.distinction)),
            note: cleanText(row && (row.note || row.whyItMatters || row.example))
        }))
        .filter((row) => row.left || row.right || row.note)
        .slice(0, 6);

    if (!rows.length) {
        return null;
    }

    return {
        title: cleanText(table && table.title, `Comparativo ${index + 1}`),
        leftLabel: cleanText(table && table.leftLabel, "Conceito"),
        rightLabel: cleanText(table && table.rightLabel, "Diferenca pratica"),
        rows
    };
}

function normalizeFlowDiagram(diagram, index) {
    const steps = asArray(diagram && diagram.steps)
        .map((step, stepIndex) => ({
            label: cleanText(step && (step.label || step.title), `Etapa ${stepIndex + 1}`),
            detail: cleanText(step && (step.detail || step.description || step.note))
        }))
        .filter((step) => step.label || step.detail)
        .slice(0, 7);

    if (!steps.length) {
        return null;
    }

    return {
        title: cleanText(diagram && diagram.title, `Esquema ${index + 1}`),
        type: cleanText(diagram && diagram.type, "flow"),
        steps
    };
}

function normalizeMnemonic(mnemonic, index) {
    if (typeof mnemonic === "string") {
        const text = cleanText(mnemonic);
        return text
            ? {
                title: `Mnemonico ${index + 1}`,
                formula: text,
                explanation: ""
            }
            : null;
    }

    const formula = cleanText(mnemonic && (mnemonic.formula || mnemonic.text || mnemonic.phrase));
    const explanation = cleanText(mnemonic && (mnemonic.explanation || mnemonic.meaning || mnemonic.use));

    if (!formula && !explanation) {
        return null;
    }

    return {
        title: cleanText(mnemonic && mnemonic.title, `Mnemonico ${index + 1}`),
        formula,
        explanation
    };
}

function normalizeLessonModule(module, index) {
    const paragraphs = asArray(module && module.paragraphs)
        .map((paragraph) => cleanText(paragraph))
        .filter(Boolean)
        .slice(0, 6);
    const takeaways = normalizeTextList(
        module && (module.takeaways || module.keyTakeaways || module.items),
        6
    );

    if (!paragraphs.length && !takeaways.length) {
        return null;
    }

    return {
        title: cleanText(module && module.title, `Aula ${index + 1}`),
        objective: cleanText(module && (module.objective || module.goal || module.label), "Entender o criterio central deste recorte."),
        paragraphs,
        takeaways
    };
}

function normalizeCaseStudy(caseStudy, index) {
    const scenario = cleanText(caseStudy && (caseStudy.scenario || caseStudy.case || caseStudy.example));
    const analysis = cleanText(caseStudy && (caseStudy.analysis || caseStudy.resolution || caseStudy.comment));
    const lesson = cleanText(caseStudy && (caseStudy.lesson || caseStudy.takeaway || caseStudy.point));

    if (!scenario && !analysis && !lesson) {
        return null;
    }

    return {
        title: cleanText(caseStudy && caseStudy.title, `Caso ${index + 1}`),
        scenario,
        analysis,
        lesson
    };
}

function normalizeMemoryCard(card, index) {
    const front = cleanText(card && (card.front || card.prompt || card.title));
    const back = cleanText(card && (card.back || card.answer || card.meaning));
    const cue = cleanText(card && (card.cue || card.tip || card.why));

    if (!front && !back && !cue) {
        return null;
    }

    return {
        front: front || `Memoria ${index + 1}`,
        back,
        cue
    };
}

function normalizeBlock(block, index, materialName) {
    const title = cleanText(block && block.title, `Bloco ${index + 1}`);
    const learn = block && block.learn ? block.learn : {};
    const practice = block && block.practice ? block.practice : {};
    const exam = block && block.exam ? block.exam : {};
    const documentSections = normalizeDocumentSections(learn.documentSections, title);
    const reviewSource = learn.reviewInFivePoints ||
        (learn.reviewPanel && learn.reviewPanel.items) ||
        learn.reviewPanel;
    const questionSource = asArray(exam.questions).slice(0, 5);
    const questions = questionSource.length
        ? questionSource.map((item, questionIndex) => normalizeQuestion(item, title, questionIndex))
        : Array.from({ length: 5 }, (_, questionIndex) => normalizeQuestion({}, title, questionIndex));
    const quizSeries = normalizeQuestionSeries(practice.quizSeries, title);
    const trueFalseSeries = normalizeTrueFalseSeries(practice.trueFalseSeries, title);
    const flashcardSeries = normalizeFlashcardSeries(practice.flashcardSeries, title);

    return {
        id: cleanText(block && block.id, `block-${index + 1}`),
        generatedByAi: true,
        title,
        subtitle: cleanText(block && block.subtitle, `Recorte prioritario de ${materialName}.`),
        duration: cleanText(block && block.duration, "25 min"),
        status: index === 0 ? "recommended" : "ready",
        excerpt: cleanText(block && block.excerpt, cleanText(learn.summary, title)),
        topics: asArray(block && block.topics).map((item) => cleanText(item)).filter(Boolean).slice(0, 5),
        progress: {
            learn: false,
            practice: false,
            exam: false
        },
        learn: {
            summary: cleanText(learn.summary, `Resumo focado de ${title}.`),
            intro: cleanText(learn.intro, "Leia este bloco procurando criterios, relacoes e pontos de prova."),
            lessonModules: normalizeObjectList(
                learn.lessonModules ||
                learn.lessons ||
                learn.aula ||
                learn.modules,
                normalizeLessonModule,
                5
            ),
            documentSections: documentSections.length
                ? documentSections
                : [
                    {
                        id: "summary",
                        type: "summary",
                        label: "Resumo",
                        title,
                        paragraphs: [
                            cleanText(learn.summary, `Resumo focado de ${title}.`),
                            cleanText(learn.intro, "Leia este bloco procurando criterios, relacoes e pontos de prova.")
                        ].filter(Boolean),
                        items: []
                    },
                    {
                        id: "exam-focus",
                        type: "exam_focus",
                        label: "Como isso cai",
                        title: `Cobranca principal de ${title}`,
                        paragraphs: [],
                        items: normalizeTextList(learn.hotPoints, 5)
                    }
                ],
            keyConcepts: normalizeTextList(learn.keyConcepts, 8),
            hotPoints: normalizeTextList(learn.hotPoints, 8),
            pitfalls: normalizeTextList(learn.pitfalls, 8),
            examFocus: normalizeTextList(
                learn.examFocus ||
                learn.howItIsCharged ||
                learn.examPatterns,
                6
            ),
            practicalCases: normalizeTextList(
                learn.practicalCases ||
                learn.caseDrills ||
                learn.examples,
                5
            ),
            connections: normalizeTextList(
                learn.connections ||
                learn.comparisons ||
                learn.crossLinks,
                6
            ),
            memoryAnchors: normalizeTextList(
                learn.memoryAnchors ||
                learn.memoryHooks ||
                learn.memorizationCues,
                6
            ),
            comparisonTables: normalizeObjectList(
                learn.comparisonTables ||
                learn.comparativeTables ||
                learn.tables,
                normalizeComparisonTable,
                3
            ),
            flowDiagrams: normalizeObjectList(
                learn.flowDiagrams ||
                learn.visualSchemas ||
                learn.schemes ||
                learn.flows,
                normalizeFlowDiagram,
                3
            ),
            mnemonics: normalizeObjectList(
                learn.mnemonics ||
                learn.memoryDevices ||
                learn.memoryAnchors,
                normalizeMnemonic,
                4
            ),
            memoryDeck: normalizeObjectList(
                learn.memoryDeck ||
                learn.memoryCards ||
                learn.recallCards,
                normalizeMemoryCard,
                8
            ),
            caseStudies: normalizeObjectList(
                learn.caseStudies ||
                learn.appliedCases ||
                learn.examples ||
                learn.practicalCases,
                normalizeCaseStudy,
                5
            ),
            masteryChecklist: normalizeTextList(
                learn.masteryChecklist ||
                learn.checklist ||
                learn.mustKnow,
                7
            ),
            explainBetter: {
                title: cleanText((learn.explainBetter || learn.explainPanel || {}).title, `Explicacao de ${title}`),
                paragraphs: asArray((learn.explainBetter || learn.explainPanel || {}).paragraphs)
                    .map((item) => cleanText(item))
                    .filter(Boolean)
                    .slice(0, 4)
            },
            reviewInFivePoints: asArray(reviewSource)
                .map((item) => cleanText(item))
                .filter(Boolean)
                .slice(0, 5)
        },
        practice: {
            targets: {
                quiz: 3,
                trueFalse: 3,
                flashcards: 3
            },
            quiz: quizSeries[0],
            quizSeries,
            trueFalse: trueFalseSeries[0],
            trueFalseSeries,
            flashcards: flashcardSeries[0],
            flashcardSeries
        },
        exam: {
            baseCount: 5,
            questions
        }
    };
}

function normalizeBundle(data, body, plan) {
    const materialName = cleanText(body.materialName, "seu material");
    const source = data && typeof data === "object" ? data : {};
    const maxBlocks = clampNumber(
        plan && plan.desiredBlockCount,
        3,
        18,
        5
    );
    const blocks = asArray(source.blocks)
        .slice(0, maxBlocks)
        .map((block, index) => normalizeBlock(block, index, materialName));

    if (!blocks.length) {
        return null;
    }

    return {
        title: cleanText(source.title, materialName.replace(/\.pdf$/i, "")),
        recommendedBlockId: cleanText(source.recommendedBlockId, blocks[0].id),
        blocks,
        warnings: asArray(source.warnings).map((item) => cleanText(item)).filter(Boolean).slice(0, 8)
    };
}

function buildFreeBundlePrompt(body, plan) {
    const text = truncateText(body.extractedText, plan.maxTextChars);
    const depthGuidance = plan.premiumActive
        ? "Entrega premium: trate Aprender como workspace de estudo. Priorize a espinha dorsal do bloco com Aula forte, cobranca de prova, checklist e ferramentas de apoio seletivas. Nao desperdice tokens repetindo explicacao expandida ou revisao em 5 pontos; esses complementos podem ser derivados localmente e enriquecidos sob demanda."
        : "Entrega gratis: mantenha o limite de ate 8 paginas como uma amostra util. Gere uma trilha inicial clara, com aula guiada, pontos de prova, pratica base e no maximo 1 recurso auxiliar marcante por bloco quando fizer sentido.";
    const timingGuidance = plan.daysUntilExam === null
        ? "Prazo nao informado: entregue uma trilha inicial equilibrada."
        : plan.daysUntilExam <= 7
            ? "Faltam pouquissimos dias para a prova: compacte assuntos relacionados, priorize incidencia e fundamentos cobraveis."
            : plan.daysUntilExam <= 30
                ? "Prazo curto: entregue uma trilha objetiva, mas sem sacrificar os assuntos que mais costumam cair."
                : "Prazo mais amplo: distribua melhor a cobertura do material, com mais blocos e progressao por assunto.";
    const structureGuidance = plan.legalMaterial
        ? "Como o material parece juridico/legislativo, organize os blocos por eixos tematicos, titulos, capitulos ou grupos de artigos. Para leis/codigos, destaque dispositivos centrais, conduta, sujeito, consequencia, excecoes, diferencas e fluxos de analise. Nao concentre tudo nos artigos iniciais."
        : "Organize os blocos por assuntos progressivos e sem repetir o mesmo resumo.";
    const profileGuidance = {
        juridico: "Perfil juridico: priorize artigo/dispositivo, conceito, requisitos, excecoes, pegadinhas, comparativos e casos curtos. So cite jurisprudencia se estiver no texto.",
        exatas: "Perfil de exatas: priorize formulas, condicoes de uso, passo a passo, exemplo resolvido e erros comuns.",
        saude_biologicas: "Perfil de saude/biologicas: priorize mecanismo, sinais, criterios, condutas ou classificacoes, e fluxos de decisao quando houver.",
        humanas: "Perfil de humanas: priorize conceitos, autores, causas/consequencias, linhas do tempo e comparativos.",
        edital: "Perfil edital: transforme topicos em frentes de estudo, prioridades e checklist de cobertura.",
        geral: "Perfil geral: adapte o formato ao texto real, preservando hierarquia, definicoes, exemplos e relacoes."
    }[plan.materialProfile] || "Adapte o formato ao texto real.";

    return `
Voce e a IA pedagogica do RotaNota. Transforme o material do usuario em blocos de estudo proporcionais ao plano, ao tamanho do documento e ao prazo.

Regras obrigatorias:
- Responda SOMENTE JSON valido.
- Crie EXATAMENTE ${plan.desiredBlockCount} blocos com recortes proprios do mesmo material.
- A trilha precisa se adaptar ao tamanho do material e ao prazo da prova; nao entregue sempre a mesma estrutura.
- Cada bloco deve cobrir um assunto diferente e cumulativo; nao duplique o mesmo resumo em todos.
- Cada bloco precisa ensinar o conteudo do PDF com linguagem clara, voltada para prova.
- Cada bloco precisa parecer uma aula estruturada, nao apenas um resumo corrido.
- Distribua o material por estrutura semantica: capitulos, titulos, artigos, secoes, topicos ou mudancas de assunto. Evite recorte fixo por pagina.
- Cada bloco precisa ter exatamente 5 questoes em exam.questions.
- Cada bloco precisa ter 3 series gratis de quiz, verdadeiro/falso e flashcards.
- Nao altere a mecanica de pratica/prova: apenas alimente quizSeries, trueFalseSeries, flashcardSeries e exam.questions no formato pedido.
- Nao invente fatos fora do texto; se o texto estiver incompleto, deixe isso claro em warnings.
- Use portugues do Brasil.
- ${depthGuidance}
- ${timingGuidance}
- ${structureGuidance}
- ${profileGuidance}
- Em cada bloco, entregue aula guiada, cobranca principal, pratica base e fechamento de dominio.
- Recursos auxiliares devem ser seletivos: comparativo, fluxo, mnemônico, deck de memória ou caso aplicado só quando realmente melhorarem o bloco.
- No premium, organize esses recursos em campos separados. Aula nao deve misturar checklist, comparativo, esquema e memorizacao no mesmo texto.
- explainBetter e reviewInFivePoints sao opcionais na chamada base; se faltar, o cliente deriva uma primeira versao local.
- Para material premium longo, a quantidade de blocos deve cobrir o material inteiro por eixos reais. Nunca compacte um documento grande em poucos blocos genericos.
- Para material com 80+ paginas no premium, use no minimo 10 blocos. Para 120+ paginas, use no minimo 12 blocos, salvo se o texto extraido estiver claramente incompleto.
- Mnemonicos devem ser usados apenas quando ajudarem de verdade; nao force frases artificiais.
- Esquemas/fluxos devem ser textuais e renderizaveis em JSON, com etapas curtas.
- Comparativos devem separar conceitos confundiveis ou regimes parecidos.
- As ferramentas devem se adaptar ao assunto: fluxos para processos/decisoes, tabelas para diferencas, cards para memorizacao, casos para aplicacao, checklist para dominio.

Contexto:
Material: ${cleanText(body.materialName, "material.pdf")}
Paginas estimadas: ${plan.pageCount}
Data da prova: ${cleanText(body.examDate, "nao informada")}
Dias ate a prova: ${plan.daysUntilExam === null ? "nao informado" : plan.daysUntilExam}
Meta: ${cleanText(body.targetScore, "nao informada")}
Tempo diario em minutos: ${plan.dailyMinutes || "nao informado"}
Quantidade alvo de blocos: ${plan.desiredBlockCount}
Modo de trilha: ${plan.planMode}
Perfil do material: ${plan.materialProfile}
Profundidade de Aprender: ${plan.learningDepth}
Recursos visuais: ${plan.visualAidBudget}
Conta premium ativa: ${plan.premiumActive ? "sim" : "nao"}

Texto extraido do PDF:
${text || "Texto nao extraido. Gere uma estrutura inicial honesta baseada no nome do material e avise em warnings que faltou texto."}
`;
}

function buildFreeBundleSchema() {
    return `
Formato obrigatorio:
{
  "title": "string",
  "recommendedBlockId": "block-1",
  "warnings": ["string"],
  "blocks": [
    {
      "id": "block-1",
      "title": "string",
      "subtitle": "string",
      "duration": "25 min",
      "excerpt": "string",
      "topics": ["string"],
      "learn": {
        "summary": "string",
        "intro": "string",
        "lessonModules": [
          {
            "title": "string",
            "objective": "string",
            "paragraphs": ["string"],
            "takeaways": ["string"]
          }
        ],
        "documentSections": [
          { "id": "summary", "type": "summary", "label": "Resumo", "title": "string", "paragraphs": ["string"], "items": ["string"] }
        ],
        "keyConcepts": ["string"],
        "hotPoints": ["string"],
        "pitfalls": ["string"],
        "examFocus": ["string"],
        "practicalCases": ["string"],
        "connections": ["string"],
        "memoryAnchors": ["string"],
        "comparisonTables": [
          {
            "title": "string",
            "leftLabel": "Conceito",
            "rightLabel": "Diferenca pratica",
            "rows": [
              { "left": "string", "right": "string", "note": "string" }
            ]
          }
        ],
        "flowDiagrams": [
          {
            "title": "string",
            "type": "flow",
            "steps": [
              { "label": "string", "detail": "string" }
            ]
          }
        ],
        "mnemonics": [
          { "title": "string", "formula": "string", "explanation": "string" }
        ],
        "memoryDeck": [
          { "front": "string", "back": "string", "cue": "string" }
        ],
        "caseStudies": [
          { "title": "string", "scenario": "string", "analysis": "string", "lesson": "string" }
        ],
        "masteryChecklist": ["string"]
      },
      "practice": {
        "quizSeries": [[{ "prompt": "string", "options": ["A", "B", "C", "D"], "correctIndex": 0, "rationale": "string" }]],
        "trueFalseSeries": [[{ "statement": "string", "answer": true, "rationale": "string" }]],
        "flashcardSeries": [[{ "front": "string", "back": "string", "tip": "string" }]]
      },
      "exam": {
        "baseCount": 5,
        "questions": [{ "prompt": "string", "options": ["A", "B", "C", "D"], "correctIndex": 0, "rationale": "string" }]
      }
    }
  ]
}`;
}

function buildExtraMiniExamPrompt(body) {
    return `
Gere exatamente 5 novas questoes para a mini prova premium do bloco abaixo.
As questoes devem ser diferentes das questoes ja existentes e devem cobrar criterio, pegadinhas e entendimento real.
Responda SOMENTE JSON valido no formato { "questions": [...] }.

Bloco: ${cleanText(body.blockTitle || body.blockId, "bloco")}
Resumo: ${truncateText(body.blockSummary, 3000)}
Topicos: ${asArray(body.topics).join(", ")}
`;
}

function buildLevelExamPrompt(body) {
    const count = LEVEL_EXAM_COUNTS.includes(Number(body.questionCount))
        ? Number(body.questionCount)
        : 10;
    return `
Gere uma prova de nivel premium com exatamente ${count} questoes sobre o material do usuario.
A prova deve misturar blocos, medir prontidao geral e ter alternativas plausiveis.
Responda SOMENTE JSON valido no formato { "title": "string", "questions": [...] }.

Resumo do material:
${truncateText(body.bundleSummary, 9000)}
`;
}

async function ensurePremium(input = {}) {
    const status = await getPremiumStatus(input);
    return Boolean(status && status.premiumActive);
}

function getPrimaryModel() {
    return cleanText(process.env.ROTANOTA_AI_MODEL || process.env.GEMINI_MODEL || DEFAULT_MODEL, DEFAULT_MODEL);
}

function buildModelSequence(model) {
    return Array.from(new Set([
        cleanText(model, ""),
        FALLBACK_MODEL
    ].filter(Boolean)));
}

async function callGeminiWithFallback({ model, prompt, schemaInstruction, temperature }) {
    const attemptedModels = [];
    let lastResult = {
        ok: false,
        status: "not_attempted",
        providerStatus: "NOT_ATTEMPTED",
        httpStatus: 0,
        data: null
    };

    for (const currentModel of buildModelSequence(model)) {
        attemptedModels.push(currentModel);
        const result = await callGeminiJson({
            model: currentModel,
            prompt,
            schemaInstruction,
            temperature
        });

        lastResult = {
            ...result,
            model: currentModel
        };

        if (result.ok || !isRetryableGeminiStatus(result)) {
            break;
        }
    }

    return {
        ...lastResult,
        attemptedModels
    };
}

module.exports = async function handler(req, res) {
    if (req.method === "OPTIONS") {
        res.setHeader("Allow", "POST, OPTIONS");
        return sendJson(res, 204, {});
    }

    if (req.method !== "POST") {
        res.setHeader("Allow", "POST, OPTIONS");
        return sendJson(res, 405, {
            ok: false,
            status: "method_not_allowed"
        });
    }

    if (!isGeminiConfigured()) {
        return sendJson(res, 503, {
            ok: false,
            status: "not_configured",
            message: "Gemini ainda nao esta configurado para gerar conteudo do PDF."
        });
    }

    let body = {};

    try {
        body = await readJsonBody(req);
    } catch (error) {
        return sendJson(res, 400, {
            ok: false,
            status: "invalid_json"
        });
    }

    const task = cleanText(body.task);
    const customerId = sanitizeCustomerId(body.customerId || "");
    const session = readAppSession(req);
    const userId = session && session.ok && session.payload && session.payload.userId
        ? String(session.payload.userId).trim()
        : "";
    const model = getPrimaryModel();

    try {
        if (task === TASKS.FREE_BUNDLE) {
            const entitlementPremium = await ensurePremium({
                customerId,
                userId
            });
            const requestedPremium = String(body.accessTier || "").toLowerCase() === "premium" ||
                body.premiumActive === true;
            const premiumActive = entitlementPremium || requestedPremium;
            const plan = buildBundlePlan(body, premiumActive);
            const result = await callGeminiWithFallback({
                model,
                prompt: buildFreeBundlePrompt(body, plan),
                schemaInstruction: buildFreeBundleSchema(),
                temperature: 0.35
            });
            const bundle = result.ok ? normalizeBundle(result.data, body, plan) : null;

            if (!result.ok || !bundle) {
                return sendJson(res, 502, {
                    ok: false,
                    status: result.status || "invalid_bundle",
                    provider: "gemini",
                    model: result.model || model,
                    attemptedModels: result.attemptedModels || [model],
                    providerStatus: result.providerStatus || "",
                    promptVersion: PROMPT_VERSION,
                    message: "A IA nao retornou um pacote de estudo valido."
                });
            }

            return sendJson(res, 200, {
                ok: true,
                status: "generated",
                provider: "gemini",
                model: result.model || model,
                attemptedModels: result.attemptedModels || [result.model || model],
                providerStatus: result.providerStatus || "OK",
                promptVersion: PROMPT_VERSION,
                plan,
                bundle
            });
        }

        if (task === TASKS.EXTRA_MINI_EXAM) {
            if (!(await ensurePremium({
                customerId,
                userId
            }))) {
                return sendJson(res, 403, {
                    ok: false,
                    status: "premium_required"
                });
            }

            const result = await callGeminiWithFallback({
                model,
                prompt: buildExtraMiniExamPrompt(body),
                schemaInstruction: '{ "questions": [{ "prompt": "string", "options": ["A", "B", "C", "D"], "correctIndex": 0, "rationale": "string" }] }',
                temperature: 0.45
            });
            const questions = result.ok
                ? asArray(result.data && result.data.questions).slice(0, 5).map((item, index) => normalizeQuestion(item, body.blockTitle || body.blockId, index))
                : [];

            if (!questions.length) {
                return sendJson(res, 502, {
                    ok: false,
                    status: result.status || "invalid_questions",
                    provider: "gemini",
                    model: result.model || model,
                    attemptedModels: result.attemptedModels || [model],
                    providerStatus: result.providerStatus || ""
                });
            }

            return sendJson(res, 200, {
                ok: true,
                status: "generated",
                provider: "gemini",
                model: result.model || model,
                attemptedModels: result.attemptedModels || [result.model || model],
                providerStatus: result.providerStatus || "OK",
                promptVersion: PROMPT_VERSION,
                questions
            });
        }

        if (task === TASKS.PREMIUM_LEVEL_EXAM) {
            if (!(await ensurePremium({
                customerId,
                userId
            }))) {
                return sendJson(res, 403, {
                    ok: false,
                    status: "premium_required"
                });
            }

            const count = LEVEL_EXAM_COUNTS.includes(Number(body.questionCount))
                ? Number(body.questionCount)
                : 10;
            const result = await callGeminiWithFallback({
                model,
                prompt: buildLevelExamPrompt({ ...body, questionCount: count }),
                schemaInstruction: '{ "title": "string", "questions": [{ "prompt": "string", "options": ["A", "B", "C", "D"], "correctIndex": 0, "rationale": "string" }] }',
                temperature: 0.4
            });
            const questions = result.ok
                ? asArray(result.data && result.data.questions).slice(0, count).map((item, index) => normalizeQuestion(item, "prova de nivel", index))
                : [];

            if (questions.length < count) {
                return sendJson(res, 502, {
                    ok: false,
                    status: result.status || "invalid_level_exam",
                    provider: "gemini",
                    model: result.model || model,
                    attemptedModels: result.attemptedModels || [model],
                    providerStatus: result.providerStatus || ""
                });
            }

            return sendJson(res, 200, {
                ok: true,
                status: "generated",
                provider: "gemini",
                model: result.model || model,
                attemptedModels: result.attemptedModels || [result.model || model],
                providerStatus: result.providerStatus || "OK",
                promptVersion: PROMPT_VERSION,
                title: cleanText(result.data && result.data.title, "Prova de nivel RotaNota"),
                questions
            });
        }

        return sendJson(res, 400, {
            ok: false,
            status: "unknown_task"
        });
    } catch (error) {
        console.error("rotanota_ai_generate_failed", {
            task,
            message: error && error.message ? error.message : String(error)
        });

        return sendJson(res, 500, {
            ok: false,
            status: "internal_error"
        });
    }
};
