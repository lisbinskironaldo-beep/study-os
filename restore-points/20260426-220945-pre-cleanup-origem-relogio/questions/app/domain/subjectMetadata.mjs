export function slugify(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

const SUBJECT_ALIASES = new Map(
    [
        {
            key: "artes",
            label: "Artes",
            aliases: ["artes"]
        },
        {
            key: "biologia",
            label: "Biologia",
            aliases: ["biologia"]
        },
        {
            key: "educacao_fisica",
            label: "Educação Física",
            aliases: [
                "educacao_fisica",
                "educa_o_f_sica"
            ]
        },
        {
            key: "filosofia",
            label: "Filosofia",
            aliases: ["filosofia"]
        },
        {
            key: "fisica",
            label: "Física",
            aliases: ["fisica", "f_sica"]
        },
        {
            key: "geografia",
            label: "Geografia",
            aliases: ["geografia"]
        },
        {
            key: "historia",
            label: "História",
            aliases: ["historia", "hist_ria"]
        },
        {
            key: "ingles",
            label: "Inglês",
            aliases: ["ingles", "ingl_s"]
        },
        {
            key: "matematica",
            label: "Matemática",
            aliases: ["matematica", "matem_tica"]
        },
        {
            key: "portugues",
            label: "Português",
            aliases: ["portugues", "portugu_s"]
        },
        {
            key: "quimica",
            label: "Química",
            aliases: ["quimica", "qu_mica"]
        },
        {
            key: "sociologia",
            label: "Sociologia",
            aliases: ["sociologia"]
        }
    ].flatMap((subject) =>
        subject.aliases.map((alias) => [
            alias,
            {
                key: subject.key,
                label: subject.label
            }
        ])
    )
);

export function getCanonicalSubjectMetadata(
    value
) {
    const rawLabel = String(
        value || ""
    ).trim();
    const rawKey = slugify(rawLabel);

    if (!rawKey) {
        return {
            key: "",
            label: rawLabel
        };
    }

    return (
        SUBJECT_ALIASES.get(rawKey) || {
            key: rawKey,
            label: rawLabel
        }
    );
}

export function formatSerieLabel(
    serie
) {
    const numericSerie = Number(serie);

    if (
        Number.isFinite(numericSerie) &&
        numericSerie > 0
    ) {
        return `${numericSerie}ª Série`;
    }

    return String(serie || "").trim();
}
