import { normalizeProfileState } from "../../domain/entities/profileState.mjs";

export function createRemoteProfileStateRepository(
    options = {}
) {
    const client =
        options.client || null;
    const fallbackRepository =
        options.fallbackRepository ||
        null;

    if (!client) {
        throw new Error(
            "client is required for remote profile state repository."
        );
    }

    return {
        key: "questions:account:profileState",
        storageType:
            "remote+local",

        load() {
            return normalizeProfileState(
                client.getState()
                    .profileState || {}
            );
        },

        save(nextState = {}) {
            const normalized =
                normalizeProfileState(
                    nextState
                );
            const current =
                client.getState();

            client.setState({
                ...current,
                profileState:
                    normalized
            });
            fallbackRepository?.save?.(
                normalized
            );

            return this.load();
        },

        async ready() {
            await client.ready();
            await fallbackRepository?.ready?.();
            return true;
        }
    };
}
