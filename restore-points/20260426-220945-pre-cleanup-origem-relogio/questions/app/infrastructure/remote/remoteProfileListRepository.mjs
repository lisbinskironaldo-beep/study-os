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

export function createRemoteProfileListRepository(
    options = {}
) {
    const client =
        options.client || null;
    const fallbackRepository =
        options.fallbackRepository ||
        null;
    const sectionName =
        String(
            options.sectionName || ""
        ).trim();

    if (!client) {
        throw new Error(
            "client is required for remote profile list repository."
        );
    }

    if (!sectionName) {
        throw new Error(
            "sectionName is required for remote profile list repository."
        );
    }

    return {
        key: `questions:account:${sectionName}`,
        storageType:
            "remote+local",

        list() {
            return cloneList(
                client.getState()[
                    sectionName
                ]
            );
        },

        saveAll(records = []) {
            const next =
                cloneList(records);
            const current =
                client.getState();

            client.setState({
                ...current,
                [sectionName]:
                    next
            });
            fallbackRepository?.saveAll?.(
                next
            );

            return this.list();
        },

        async ready() {
            await client.ready();
            await fallbackRepository?.ready?.();
            return true;
        }
    };
}
