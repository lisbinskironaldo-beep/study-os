import { normalizeRunRecord } from "../../domain/entities/runRecord.mjs";
import { QUESTIONS_STORAGE_KEYS } from "../storage/storageKeys.mjs";
import { createLocalStorageJsonStore } from "../storage/localStorageJsonStore.mjs";

export function createLocalStorageRunsRepository(
    options = {}
) {
    const key =
        options.key ||
        QUESTIONS_STORAGE_KEYS.runs;
    const store =
        options.store ||
        createLocalStorageJsonStore(
            options.storage
        );

    return {
        key,

        list() {
            const current = store.read(
                key,
                []
            );

            return Array.isArray(current)
                ? current.map((run) =>
                      normalizeRunRecord(run)
                  )
                : [];
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

            store.write(key, normalizedRuns);
            return normalizedRuns;
        },

        upsert(run = {}) {
            const normalized =
                normalizeRunRecord(run);
            const next = [
                normalized,
                ...this.list().filter(
                    (entry) =>
                        String(entry.id) !==
                        String(normalized.id)
                )
            ].slice(0, 80);

            this.saveAll(next);
            return normalized;
        },

        remove(runId) {
            const current = this.list();
            const next = current.filter(
                (run) =>
                    String(run.id) !==
                    String(runId)
            );

            if (next.length === current.length) {
                return false;
            }

            this.saveAll(next);
            return true;
        }
    };
}
