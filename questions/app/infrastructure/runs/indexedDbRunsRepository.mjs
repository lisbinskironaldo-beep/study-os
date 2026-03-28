import { normalizeRunRecord } from "../../domain/entities/runRecord.mjs";
import { QUESTIONS_INDEXED_DB_SCHEMA } from "../storage/indexedDbSchema.mjs";
import {
    openQuestionsIndexedDb,
    readAllFromStore,
    replaceStoreContents
} from "../storage/indexedDbClient.mjs";
import { QUESTIONS_STORAGE_KEYS } from "../storage/storageKeys.mjs";

function readLegacyRuns(
    storage,
    key
) {
    if (!storage) {
        return [];
    }

    try {
        const raw =
            storage.getItem(key);

        if (!raw) {
            return [];
        }

        const parsed =
            JSON.parse(raw);

        return Array.isArray(parsed)
            ? parsed.map((run) =>
                  normalizeRunRecord(run)
              )
            : [];
    } catch (_error) {
        return [];
    }
}

function writeLegacyRuns(
    storage,
    key,
    runs = []
) {
    if (!storage) {
        return false;
    }

    try {
        storage.setItem(
            key,
            JSON.stringify(
                Array.isArray(runs)
                    ? runs
                    : []
            )
        );
        return true;
    } catch (_error) {
        return false;
    }
}

export async function createIndexedDbRunsRepository(
    options = {}
) {
    const schema =
        options.schema ||
        QUESTIONS_INDEXED_DB_SCHEMA;
    const storeName =
        options.storeName || "runs";
    const legacyStorage =
        options.legacyStorage || null;
    const legacyKey =
        options.legacyKey ||
        QUESTIONS_STORAGE_KEYS.runs;
    const database =
        await openQuestionsIndexedDb(
            schema
        );
    const state = {
        database,
        cache: [],
        persistChain:
            Promise.resolve()
    };

    const persistedRuns =
        (
            await readAllFromStore(
                database,
                storeName
            )
        ).map((run) =>
            normalizeRunRecord(run)
        );
    const legacyRuns =
        readLegacyRuns(
            legacyStorage,
            legacyKey
        );

    if (
        !persistedRuns.length &&
        legacyRuns.length
    ) {
        await replaceStoreContents(
            database,
            storeName,
            legacyRuns
        );
        state.cache = [...legacyRuns];
    } else {
        state.cache = [...persistedRuns];
    }

    function enqueuePersist(
        nextRuns = []
    ) {
        const snapshot = (
            Array.isArray(nextRuns)
                ? nextRuns
                : []
        ).map((run) =>
            normalizeRunRecord(run)
        );

        state.persistChain =
            state.persistChain
                .catch(() => null)
                .then(async () => {
                    writeLegacyRuns(
                        legacyStorage,
                        legacyKey,
                        snapshot
                    );

                    return replaceStoreContents(
                        state.database,
                        storeName,
                        snapshot
                    );
                });

        return state.persistChain;
    }

    return {
        key: `${schema.dbName}:${storeName}`,
        storageType: "indexeddb",

        list() {
            return state.cache.map(
                (run) =>
                    normalizeRunRecord(run)
            );
        },

        findById(runId) {
            return this.list().find(
                (run) =>
                    String(run.id) ===
                    String(runId)
            ) || null;
        },

        saveAll(runs = []) {
            const normalizedRuns = (
                Array.isArray(runs)
                    ? runs
                    : []
            ).map((run) =>
                normalizeRunRecord(run)
            );

            state.cache = [...normalizedRuns];
            enqueuePersist(
                normalizedRuns
            );
            return normalizedRuns;
        },

        upsert(run = {}) {
            const normalized =
                normalizeRunRecord(run);
            const next = [
                normalized,
                ...state.cache.filter(
                    (entry) =>
                        String(entry.id) !==
                        String(
                            normalized.id
                        )
                )
            ].slice(0, 80);

            state.cache = next;
            enqueuePersist(next);
            return normalized;
        },

        remove(runId) {
            const currentLength =
                state.cache.length;
            const next =
                state.cache.filter(
                    (run) =>
                        String(run.id) !==
                        String(runId)
                );

            if (
                next.length ===
                currentLength
            ) {
                return false;
            }

            state.cache = next;
            enqueuePersist(next);
            return true;
        },

        async ready() {
            await state.persistChain.catch(
                () => null
            );
            return true;
        }
    };
}
