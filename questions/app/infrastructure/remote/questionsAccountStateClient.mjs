import { normalizeProfileState } from "../../domain/entities/profileState.mjs";
import { normalizeRunRecord } from "../../domain/entities/runRecord.mjs";

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

export function normalizeQuestionsAccountState(
    input = {}
) {
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
        profileState: normalizeProfileState({
            topics: cloneObjectMap(
                profileState.topics
            ),
            sessions: cloneList(
                profileState.sessions
            )
        }),
        smartProfiles: cloneList(
            input.smartProfiles
        ),
        savedBlocks: cloneList(
            input.savedBlocks
        ),
        runs: (
            Array.isArray(input.runs)
                ? input.runs
                : []
        ).map((run) =>
            normalizeRunRecord(run)
        )
    };
}

function buildEmptyState() {
    return normalizeQuestionsAccountState(
        {}
    );
}

export function createQuestionsAccountStateClient(
    options = {}
) {
    const endpoint =
        String(
            options.endpoint ||
                "/api/questions/state"
        ).trim() ||
        "/api/questions/state";
    const sessionEndpoint =
        String(
            options.sessionEndpoint ||
                "/api/auth/session"
        ).trim() ||
        "/api/auth/session";
    const state = {
        loaded: false,
        authenticated: false,
        session:
            options.session &&
            typeof options.session === "object"
                ? {
                    ...options.session
                }
                : null,
        cache: buildEmptyState(),
        loadPromise: null,
        persistChain:
            Promise.resolve()
    };

    async function resolveSession() {
        const existingSession =
            globalThis.RotaNotaAuth?.getSession?.();

        if (
            existingSession &&
            existingSession.userId
        ) {
            return existingSession;
        }

        if (
            state.session &&
            state.session.userId
        ) {
            return state.session;
        }

        const response = await fetch(
            sessionEndpoint,
            {
                method: "GET",
                credentials:
                    "same-origin",
                headers: {
                    Accept:
                        "application/json"
                }
            }
        );

        if (!response.ok) {
            return null;
        }

        const payload =
            await response
                .json()
                .catch(() => null);

        if (
            !payload?.authenticated ||
            !payload?.user?.userId
        ) {
            return null;
        }

        return {
            ...payload.user,
            premiumActive:
                Boolean(
                    payload.premiumActive
                )
        };
    }

    async function loadRemoteState() {
        const session =
            await resolveSession();

        state.session =
            session &&
            typeof session === "object"
                ? {
                    ...session
                }
                : null;
        state.authenticated = Boolean(
            state.session &&
                state.session.userId
        );

        if (!state.authenticated) {
            state.cache =
                buildEmptyState();
            state.loaded = true;
            return state.cache;
        }

        const response = await fetch(
            endpoint,
            {
                method: "GET",
                credentials:
                    "same-origin",
                headers: {
                    Accept:
                        "application/json"
                }
            }
        );

        if (
            response.status === 401
        ) {
            state.authenticated = false;
            state.cache =
                buildEmptyState();
            state.loaded = true;
            return state.cache;
        }

        if (!response.ok) {
            throw new Error(
                `questions_state_load_failed:${response.status}`
            );
        }

        const payload =
            await response
                .json()
                .catch(() => null);

        state.cache =
            normalizeQuestionsAccountState(
                payload?.state || {}
            );
        state.loaded = true;
        return state.cache;
    }

    function ensureReady() {
        if (state.loaded) {
            return Promise.resolve(
                state.cache
            );
        }

        if (!state.loadPromise) {
            state.loadPromise =
                loadRemoteState()
                    .catch((error) => {
                        state.loaded =
                            false;
                        throw error;
                    })
                    .finally(() => {
                        state.loadPromise =
                            null;
                    });
        }

        return state.loadPromise;
    }

    function enqueuePersist(
        snapshot = {}
    ) {
        if (!state.authenticated) {
            return state.persistChain;
        }

        const payload =
            normalizeQuestionsAccountState(
                snapshot
            );

        state.persistChain =
            state.persistChain
                .catch(() => null)
                .then(async () => {
                    const response =
                        await fetch(
                            endpoint,
                            {
                                method: "POST",
                                credentials:
                                    "same-origin",
                                headers: {
                                    "Content-Type":
                                        "application/json",
                                    Accept:
                                        "application/json"
                                },
                                body: JSON.stringify(
                                    {
                                        state:
                                            payload
                                    }
                                )
                            }
                        );

                    if (!response.ok) {
                        throw new Error(
                            `questions_state_save_failed:${response.status}`
                        );
                    }

                    const result =
                        await response
                            .json()
                            .catch(
                                () => null
                            );

                    state.cache =
                        normalizeQuestionsAccountState(
                            result?.state ||
                                payload
                        );

                    return state.cache;
                });

        return state.persistChain;
    }

    return {
        endpoint,

        async ready() {
            await ensureReady();
            return true;
        },

        async flush() {
            await ensureReady();
            await state.persistChain.catch(
                () => null
            );
            return true;
        },

        isAuthenticated() {
            return Boolean(
                state.authenticated
            );
        },

        getSession() {
            return state.session
                ? {
                    ...state.session
                }
                : null;
        },

        getState() {
            return normalizeQuestionsAccountState(
                state.cache
            );
        },

        setState(nextState = {}) {
            const normalized =
                normalizeQuestionsAccountState(
                    nextState
                );

            state.cache = normalized;
            enqueuePersist(normalized);
            return this.getState();
        }
    };
}
