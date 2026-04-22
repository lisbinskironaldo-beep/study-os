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
    isRetryableGeminiStatus
};
