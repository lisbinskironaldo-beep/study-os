import { normalizeProfileState } from "../../domain/entities/profileState.mjs";
import { QUESTIONS_STORAGE_KEYS } from "../storage/storageKeys.mjs";
import { createLocalStorageJsonStore } from "../storage/localStorageJsonStore.mjs";

export function createLocalStorageProfileStateRepository(
    options = {}
) {
    const key =
        options.key ||
        QUESTIONS_STORAGE_KEYS.profile;
    const store =
        options.store ||
        createLocalStorageJsonStore(
            options.storage
        );

    return {
        key,

        load() {
            return normalizeProfileState(
                store.read(key, {})
            );
        },

        save(state = {}) {
            const normalized =
                normalizeProfileState(state);
            store.write(key, normalized);
            return normalized;
        }
    };
}
