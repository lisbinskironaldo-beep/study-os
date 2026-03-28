export function createLocalStorageJsonStore(
    storage = globalThis.localStorage
) {
    return {
        read(key, fallbackValue) {
            if (!storage) {
                return fallbackValue;
            }

            try {
                const raw =
                    storage.getItem(key);
                return raw
                    ? JSON.parse(raw)
                    : fallbackValue;
            } catch (_error) {
                return fallbackValue;
            }
        },

        write(key, value) {
            if (!storage) {
                return false;
            }

            try {
                storage.setItem(
                    key,
                    JSON.stringify(value)
                );
                return true;
            } catch (_error) {
                return false;
            }
        }
    };
}
