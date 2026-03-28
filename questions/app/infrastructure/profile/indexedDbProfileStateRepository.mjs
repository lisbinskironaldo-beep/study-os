import { normalizeProfileState } from "../../domain/entities/profileState.mjs";
import { QUESTIONS_INDEXED_DB_SCHEMA } from "../storage/indexedDbSchema.mjs";
import {
    openQuestionsIndexedDb,
    readAllFromStore,
    replaceStoreContents
} from "../storage/indexedDbClient.mjs";

function cloneTopicEntries(
    topics = {}
) {
    return Object.fromEntries(
        Object.entries(
            topics &&
                typeof topics === "object"
                ? topics
                : {}
        ).map(([key, value]) => [
            key,
            value &&
            typeof value === "object"
                ? { ...value }
                : value
        ])
    );
}

function cloneSessions(
    sessions = []
) {
    return (
        Array.isArray(sessions)
            ? sessions
            : []
    ).map((session) =>
        session &&
        typeof session === "object"
            ? { ...session }
            : session
    );
}

function mapTopicEntriesToObject(
    records = []
) {
    return Object.fromEntries(
        (
            Array.isArray(records)
                ? records
                : []
        )
            .filter(
                (record) =>
                    record &&
                    typeof record ===
                        "object"
            )
            .map((record) => [
                String(
                    record.key ||
                        [
                            record.baseKey,
                            record.subjectKey,
                            record.topicKey
                        ].join("::")
                ),
                { ...record }
            ])
    );
}

function mapTopicsToStoreRecords(
    topics = {}
) {
    return Object.entries(
        topics &&
            typeof topics === "object"
            ? topics
            : {}
    ).map(([key, value]) => ({
        key,
        ...(value &&
        typeof value === "object"
            ? value
            : {})
    }));
}

function writeLegacyProfileState(
    legacyProfileStateRepository,
    state = {}
) {
    if (
        !legacyProfileStateRepository ||
        typeof legacyProfileStateRepository.load !==
            "function" ||
        typeof legacyProfileStateRepository.save !==
            "function"
    ) {
        return false;
    }

    try {
        const current =
            legacyProfileStateRepository.load();
        legacyProfileStateRepository.save(
            {
                ...(current || {}),
                topics:
                    cloneTopicEntries(
                        state.topics
                    ),
                sessions:
                    cloneSessions(
                        state.sessions
                    )
            }
        );
        return true;
    } catch (_error) {
        return false;
    }
}

export async function createIndexedDbProfileStateRepository(
    options = {}
) {
    const schema =
        options.schema ||
        QUESTIONS_INDEXED_DB_SCHEMA;
    const legacyProfileStateRepository =
        options.legacyProfileStateRepository ||
        null;
    const database =
        await openQuestionsIndexedDb(
            schema
        );
    const state = {
        database,
        cache: normalizeProfileState({}),
        persistChain:
            Promise.resolve()
    };
    const [
        persistedTopicRecords,
        persistedSessions
    ] = await Promise.all([
        readAllFromStore(
            database,
            "topicStats"
        ),
        readAllFromStore(
            database,
            "sessions"
        )
    ]);
    const legacyState =
        normalizeProfileState(
            legacyProfileStateRepository?.load?.() ||
                {}
        );

    if (
        !persistedTopicRecords.length &&
        !persistedSessions.length &&
        (
            Object.keys(
                legacyState.topics || {}
            ).length ||
            legacyState.sessions.length
        )
    ) {
        await Promise.all([
            replaceStoreContents(
                database,
                "topicStats",
                mapTopicsToStoreRecords(
                    legacyState.topics
                )
            ),
            replaceStoreContents(
                database,
                "sessions",
                legacyState.sessions
            )
        ]);
        state.cache =
            normalizeProfileState(
                legacyState
            );
    } else {
        state.cache =
            normalizeProfileState({
                topics:
                    mapTopicEntriesToObject(
                        persistedTopicRecords
                    ),
                sessions:
                    cloneSessions(
                        persistedSessions
                    )
            });
    }

    function enqueuePersist(
        nextState = {}
    ) {
        const normalized =
            normalizeProfileState(
                nextState
            );

        state.persistChain =
            state.persistChain
                .catch(() => null)
                .then(async () => {
                    writeLegacyProfileState(
                        legacyProfileStateRepository,
                        normalized
                    );

                    await Promise.all([
                        replaceStoreContents(
                            state.database,
                            "topicStats",
                            mapTopicsToStoreRecords(
                                normalized.topics
                            )
                        ),
                        replaceStoreContents(
                            state.database,
                            "sessions",
                            normalized.sessions
                        )
                    ]);
                });

        return state.persistChain;
    }

    return {
        key: `${schema.dbName}:profileState`,
        storageType: "indexeddb",

        load() {
            return normalizeProfileState(
                {
                    topics:
                        cloneTopicEntries(
                            state.cache.topics
                        ),
                    sessions:
                        cloneSessions(
                            state.cache.sessions
                        )
                }
            );
        },

        save(nextState = {}) {
            const normalized =
                normalizeProfileState({
                    topics:
                        cloneTopicEntries(
                            nextState.topics
                        ),
                    sessions:
                        cloneSessions(
                            nextState.sessions
                        )
                });

            state.cache = normalized;
            enqueuePersist(normalized);
            return this.load();
        },

        async ready() {
            await state.persistChain.catch(
                () => null
            );
            return true;
        }
    };
}
