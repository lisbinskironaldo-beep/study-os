const { sendJson, readJsonBody } = require("../_lib/json");
const { callGeminiJson, isGeminiConfigured, isRetryableGeminiStatus } = require("../_lib/gemini");
const { getPremiumStatus, sanitizeCustomerId } = require("../_lib/premium-entitlements");
const { readAppSession } = require("../_lib/auth-session");

const TASKS = {
    FREE_BUNDLE: "free_bundle_from_material",
    EXTRA_MINI_EXAM: "extra_mini_exam",
    PREMIUM_LEVEL_EXAM: "premium_level_exam"
};

const PROMPT_VERSION = "rotanota-pdf-focused-ai-v1";
const DEFAULT_MODEL = "gemini-2.5-flash-lite";
const FALLBACK_MODEL = "gemini-2.5-flash-lite";
const MAX_TEXT_CHARS = 22000;
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
    return asArray(sections).slice(0, 6).map((section, index) => {
        const paragraphs = asArray(section && section.paragraphs)
            .map((paragraph) => cleanText(paragraph))
            .filter(Boolean)
            .slice(0, 4);
        const items = asArray(section && section.items)
            .map((item) => cleanText(item))
            .filter(Boolean)
            .slice(0, 6);

        return {
            id: cleanText(section && section.id, `section-${index + 1}`),
            label: cleanText(section && section.label, "Leitura guiada"),
            title: cleanText(section && section.title, fallbackTopic),
            paragraphs,
            items
        };
    }).filter((section) => section.paragraphs.length || section.items.length);
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
            documentSections: documentSections.length
                ? documentSections
                : [
                    {
                        id: "summary",
                        label: "Resumo",
                        title,
                        paragraphs: [
                            cleanText(learn.summary, `Resumo focado de ${title}.`),
                            cleanText(learn.intro, "Leia este bloco procurando criterios, relacoes e pontos de prova.")
                        ].filter(Boolean),
                        items: []
                    }
                ],
            keyConcepts: asArray(learn.keyConcepts).map((item) => cleanText(item)).filter(Boolean).slice(0, 8),
            hotPoints: asArray(learn.hotPoints).map((item) => cleanText(item)).filter(Boolean).slice(0, 8),
            pitfalls: asArray(learn.pitfalls).map((item) => cleanText(item)).filter(Boolean).slice(0, 8),
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

function normalizeBundle(data, body) {
    const materialName = cleanText(body.materialName, "seu material");
    const source = data && typeof data === "object" ? data : {};
    const blocks = asArray(source.blocks)
        .slice(0, 5)
        .map((block, index) => normalizeBlock(block, index, materialName));

    if (!blocks.length) {
        return null;
    }

    return {
        title: cleanText(source.title, materialName.replace(/\.pdf$/i, "")),
        recommendedBlockId: cleanText(source.recommendedBlockId, blocks[0].id),
        blocks,
        warnings: asArray(source.warnings).map((item) => cleanText(item)).filter(Boolean).slice(0, 5)
    };
}

function buildFreeBundlePrompt(body) {
    const text = truncateText(body.extractedText, MAX_TEXT_CHARS);
    return `
Voce e a IA pedagogica do RotaNota. Transforme o PDF do usuario em um pacote inicial gratis completo.

Regras obrigatorias:
- Responda SOMENTE JSON valido.
- Crie de 3 a 5 blocos com recortes proprios do mesmo material; nao duplique o mesmo resumo em todos.
- Cada bloco precisa ensinar o conteudo do PDF com linguagem clara, voltada para prova.
- Cada bloco precisa ter exatamente 5 questoes em exam.questions.
- Cada bloco precisa ter 3 series gratis de quiz, verdadeiro/falso e flashcards.
- Nao invente fatos fora do texto; se o texto estiver incompleto, deixe isso claro em warnings.
- Use portugues do Brasil.

Contexto:
Material: ${cleanText(body.materialName, "material.pdf")}
Paginas estimadas: ${Number(body.pageCount || 0)}
Data da prova: ${cleanText(body.examDate, "nao informada")}
Meta: ${cleanText(body.targetScore, "nao informada")}
Tempo diario em minutos: ${cleanText(body.dailyMinutes, "nao informado")}

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
        "documentSections": [
          { "id": "summary", "label": "Resumo", "title": "string", "paragraphs": ["string"], "items": ["string"] }
        ],
        "keyConcepts": ["string"],
        "hotPoints": ["string"],
        "pitfalls": ["string"],
        "explainBetter": { "title": "string", "paragraphs": ["string"] },
        "reviewInFivePoints": ["string", "string", "string", "string", "string"]
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
    const userId = session && session.userId
        ? String(session.userId).trim()
        : "";
    const model = getPrimaryModel();

    try {
        if (task === TASKS.FREE_BUNDLE) {
            const result = await callGeminiWithFallback({
                model,
                prompt: buildFreeBundlePrompt(body),
                schemaInstruction: buildFreeBundleSchema(),
                temperature: 0.35
            });
            const bundle = result.ok ? normalizeBundle(result.data, body) : null;

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
