const { sendJson, readJsonBody } = require("../../json");
const { readAppSession } = require("../../auth-session");
const { isSupabaseConfigured } = require("../../supabase");
const { getStateValue, setStateValue } = require("../../ops-service");

const STATE_KEY_PREFIX = "questions_account_state:";

function cloneObjectMap(value = {}) {
    return Object.fromEntries(
        Object.entries(
            value && typeof value === "object"
                ? value
                : {}
        ).map(([key, entry]) => [
            key,
            entry && typeof entry === "object"
                ? { ...entry }
                : entry
        ])
    );
}

function cloneList(list = []) {
    return (
        Array.isArray(list)
            ? list
            : []
    ).map((entry) =>
        entry && typeof entry === "object"
            ? { ...entry }
            : entry
    );
}

function buildDefaultState() {
    return {
        version: 1,
        updatedAt: "",
        profileState: {
            topics: {},
            sessions: []
        },
        smartProfiles: [],
        savedBlocks: [],
        runs: []
    };
}

function normalizeQuestionsAccountState(input = {}) {
    const profileState =
        input &&
        input.profileState &&
        typeof input.profileState === "object"
            ? input.profileState
            : {};

    return {
        version:
            Number(input.version) > 0
                ? Number(input.version)
                : 1,
        updatedAt:
            String(input.updatedAt || "").trim(),
        profileState: {
            topics: cloneObjectMap(
                profileState.topics
            ),
            sessions: cloneList(
                profileState.sessions
            )
        },
        smartProfiles: cloneList(
            input.smartProfiles
        ),
        savedBlocks: cloneList(
            input.savedBlocks
        ),
        runs: cloneList(input.runs)
    };
}

function getStateKey(userId = "") {
    return `${STATE_KEY_PREFIX}${String(userId || "").trim()}`;
}

module.exports = async function handler(req, res) {
    if (req.method === "OPTIONS") {
        res.setHeader("Allow", "GET, POST, OPTIONS");
        return sendJson(res, 204, {});
    }

    if (
        req.method !== "GET" &&
        req.method !== "POST"
    ) {
        res.setHeader("Allow", "GET, POST, OPTIONS");
        return sendJson(res, 405, {
            ok: false,
            status: "method_not_allowed",
            message: "Use GET ou POST para manipular o estado de Questions."
        });
    }

    const session = readAppSession(req);

    if (!session.ok) {
        return sendJson(res, 401, {
            ok: false,
            status: "unauthorized",
            message: "Entre com sua conta para sincronizar o historico de Questions."
        });
    }

    if (!isSupabaseConfigured()) {
        return sendJson(res, 503, {
            ok: false,
            status: "supabase_not_configured",
            message: "A sincronizacao de Questions ainda nao esta configurada."
        });
    }

    const stateKey = getStateKey(
        session.payload.userId
    );

    if (req.method === "GET") {
        const stored =
            await getStateValue(
                stateKey,
                buildDefaultState()
            );

        return sendJson(res, 200, {
            ok: true,
            state: normalizeQuestionsAccountState(
                stored || {}
            )
        });
    }

    let body = {};

    try {
        body = await readJsonBody(req);
    } catch (_error) {
        return sendJson(res, 400, {
            ok: false,
            status: "invalid_json",
            message: "Envie um JSON valido para salvar o estado de Questions."
        });
    }

    const nextState =
        normalizeQuestionsAccountState(
            body &&
            typeof body === "object" &&
            body.state &&
            typeof body.state === "object"
                ? body.state
                : body
        );
    nextState.updatedAt =
        new Date().toISOString();

    const result =
        await setStateValue(
            stateKey,
            nextState
        );

    if (!result.ok) {
        return sendJson(res, 502, {
            ok: false,
            status: "questions_state_persist_failed",
            message: "Nao foi possivel salvar o estado de Questions agora."
        });
    }

    return sendJson(res, 200, {
        ok: true,
        state: nextState
    });
};
