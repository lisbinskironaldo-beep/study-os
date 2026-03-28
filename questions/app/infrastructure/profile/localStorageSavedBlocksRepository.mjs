export function createLocalStorageSavedBlocksRepository(
    profileStateRepository
) {
    return {
        list() {
            return [
                ...(
                    profileStateRepository
                        ?.load()
                        ?.savedBlocks || []
                )
            ];
        },

        saveAll(list = []) {
            const current =
                profileStateRepository.load();
            return profileStateRepository.save(
                {
                    ...current,
                    savedBlocks:
                        Array.isArray(list)
                            ? [...list]
                            : []
                }
            );
        }
    };
}
