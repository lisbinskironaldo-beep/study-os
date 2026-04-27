const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

function getGeminiApiKey() {
    return process.env.GEMINI_API_KEY || process.env.GEMINI_PAID_API_KEY || process.env.GEMINI_FREE_API_KEY || "";
}

function isGeminiConfigured() {
    return Boolean(getGeminiApiKey());
}

function getProviderStatus(payload, fallback = "") {
    if (!payload || typeof payload !== "object") {
        return fallback;
    }

    if (payload.error && payload.error.status) {
        return String(payload.error.status);
    }

    if (payload.status) {
        return String(payload.status);
    }

    return fallback;
}

function isRetryableGeminiStatus(result = {}) {
    const providerStatus = String(result.providerStatus || "").toUpperCase();

    return [
        "UNAVAILABLE",
        "RESOURCE_EXHAUSTED",
        "DEADLINE_EXCEEDED",
        "INTERNAL"
    ].includes(providerStatus) || result.status === "rate_limited";
}

function normalizeGeminiPart(part) {
    if (!part || typeof part !== "object") {
        return null;
    }

    if (typeof part.text === "string" && part.text.trim()) {
        return {
            text: part.text
        };
    }

    const inlineData = part.inlineData || part.inline_data;

    if (
        inlineData &&
        typeof inlineData === "object" &&
        typeof (inlineData.data || "") === "string" &&
        String(inlineData.data).trim()
    ) {
        return {
            inlineData: {
                mimeType: inlineData.mimeType || inlineData.mime_type || "application/octet-stream",
                data: inlineData.data
            }
        };
    }

    const fileData = part.fileData || part.file_data;

    if (
        fileData &&
        typeof fileData === "object" &&
        typeof (fileData.fileUri || fileData.file_uri || "") === "string" &&
        String(fileData.fileUri || fileData.file_uri).trim()
    ) {
        return {
            fileData: {
                mimeType: fileData.mimeType || fileData.mime_type || "application/octet-stream",
                fileUri: fileData.fileUri || fileData.file_uri
            }
        };
    }

    return null;
}

async function callGeminiJsonWithParts({
    model,
    parts,
    schemaInstruction = "",
    temperature = 0.4,
    maxOutputTokens
}) {
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
        return {
            ok: false,
            status: "not_configured",
            data: null,
            providerStatus: "NOT_CONFIGURED",
            httpStatus: 503
        };
    }

    const normalizedParts = Array.isArray(parts)
        ? parts.map(normalizeGeminiPart).filter(Boolean)
        : [];

    if (!normalizedParts.length) {
        return {
            ok: false,
            status: "missing_parts",
            data: null,
            providerStatus: "MISSING_PARTS",
            httpStatus: 400
        };
    }

    normalizedParts.push({
        text: `Responda em JSON valido.${schemaInstruction ? `\n${schemaInstruction}` : ""}`
    });

    const generationConfig = {
        temperature,
        responseMimeType: "application/json"
    };

    if (Number.isFinite(maxOutputTokens) && maxOutputTokens > 0) {
        generationConfig.maxOutputTokens = Math.round(maxOutputTokens);
    }

    const response = await fetch(
        `${GEMINI_BASE_URL}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: normalizedParts
                    }
                ],
                generationConfig
            })
        }
    );

    let payload = null;

    try {
        payload = await response.json();
    } catch (error) {
        payload = null;
    }

    if (!response.ok) {
        return {
            ok: false,
            status: response.status === 429 ? "rate_limited" : "provider_error",
            data: payload,
            providerStatus: getProviderStatus(payload, `HTTP_${response.status}`),
            httpStatus: response.status
        };
    }

    const rawText = payload &&
        payload.candidates &&
        payload.candidates[0] &&
        payload.candidates[0].content &&
        Array.isArray(payload.candidates[0].content.parts)
        ? payload.candidates[0].content.parts.map((part) => part.text || "").join("")
        : "";

    if (!rawText.trim()) {
        return {
            ok: false,
            status: "empty_response",
            data: payload,
            providerStatus: getProviderStatus(payload, "EMPTY_RESPONSE"),
            httpStatus: response.status
        };
    }

    try {
        return {
            ok: true,
            status: "ok",
            data: JSON.parse(rawText),
            rawText,
            providerStatus: getProviderStatus(payload, "OK"),
            httpStatus: response.status
        };
    } catch (error) {
        return {
            ok: false,
            status: "invalid_json",
            data: payload,
            rawText,
            providerStatus: getProviderStatus(payload, "INVALID_JSON"),
            httpStatus: response.status
        };
    }
}

async function callGeminiJson({
    model,
    prompt,
    schemaInstruction = "",
    temperature = 0.4
}) {
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
        return {
            ok: false,
            status: "not_configured",
            data: null,
            providerStatus: "NOT_CONFIGURED",
            httpStatus: 503
        };
    }

    const response = await fetch(
        `${GEMINI_BASE_URL}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `${prompt}\n\nResponda em JSON valido.${schemaInstruction ? `\n${schemaInstruction}` : ""}`
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature,
                    responseMimeType: "application/json"
                }
            })
        }
    );

    let payload = null;

    try {
        payload = await response.json();
    } catch (error) {
        payload = null;
    }

    if (!response.ok) {
        return {
            ok: false,
            status: response.status === 429 ? "rate_limited" : "provider_error",
            data: payload,
            providerStatus: getProviderStatus(payload, `HTTP_${response.status}`),
            httpStatus: response.status
        };
    }

    const rawText = payload &&
        payload.candidates &&
        payload.candidates[0] &&
        payload.candidates[0].content &&
        Array.isArray(payload.candidates[0].content.parts)
        ? payload.candidates[0].content.parts.map((part) => part.text || "").join("")
        : "";

    if (!rawText.trim()) {
        return {
            ok: false,
            status: "empty_response",
            data: payload,
            providerStatus: getProviderStatus(payload, "EMPTY_RESPONSE"),
            httpStatus: response.status
        };
    }

    try {
        return {
            ok: true,
            status: "ok",
            data: JSON.parse(rawText),
            rawText,
            providerStatus: getProviderStatus(payload, "OK"),
            httpStatus: response.status
        };
    } catch (error) {
        return {
            ok: false,
            status: "invalid_json",
            data: payload,
            rawText,
            providerStatus: getProviderStatus(payload, "INVALID_JSON"),
            httpStatus: response.status
        };
    }
}

module.exports = {
    getGeminiApiKey,
    isGeminiConfigured,
    callGeminiJson,
    callGeminiJsonWithParts,
    isRetryableGeminiStatus
};
