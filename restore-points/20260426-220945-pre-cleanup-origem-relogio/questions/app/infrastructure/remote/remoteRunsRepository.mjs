import { normalizeRunRecord } from "../../domain/entities/runRecord.mjs";

export function createRemoteRunsRepository(
    options = {}
) {
    const client =
        options.client || null;
    const fallbackRepository =
        options.fallbackRepository ||
        null;

    if (!client) {
        throw new Error(
            "client is required for remote runs repository."
        );
    }

    function listRuns() {
        return (
            Array.isArray(
                client.getState().runs
            )
                ? client.getState().runs
                : []
        ).map((run) =>
            normalizeRunRecord(run)
        );
    }

    function persist(nextRuns = []) {
        const current =
            client.getState();
        const normalizedRuns = (
            Array.isArray(nextRuns)
                ? nextRuns
                : []
        ).map((run) =>
            normalizeRunRecord(run)
        );

        client.setState({
            ...current,
            runs: normalizedRuns
        });
        fallbackRepository?.saveAll?.(
            normalizedRuns
        );

        return normalizedRuns;
    }

    return {
        key: "questions:account:runs",
        storageType:
            "remote+local",

        list() {
            return listRuns();
        },

        findById(runId) {
            return this.list().find(
                (run) =>
                    String(run.id) ===
                    String(runId)
            ) || null;
        },

        saveAll(runs = []) {
            return persist(runs);
        },

        upsert(run = {}) {
            const normalized =
                normalizeRunRecord(run);
            const next = [
                normalized,
                ...this.list().filter(
                    (entry) =>
                        String(entry.id) !==
                        String(
                            normalized.id
                        )
                )
            ].slice(0, 80);

            persist(next);
            return normalized;
        },

        remove(runId) {
            const current =
                this.list();
            const next =
                current.filter(
                    (run) =>
                        String(run.id) !==
                        String(runId)
                );

            if (
                next.length ===
                current.length
            ) {
                return false;
            }

            persist(next);
            return true;
        },

        async ready() {
            await client.ready();
            await fallbackRepository?.ready?.();
            return true;
        }
    };
}
