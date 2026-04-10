import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { questionsDB } from "../banks/index.js";
import { buildQuestionsCatalogManifest } from "../app/infrastructure/content/catalogManifest.mjs";

const __filename = fileURLToPath(
    import.meta.url
);
const __dirname =
    path.dirname(__filename);
const banksDir = path.resolve(
    __dirname,
    "../banks"
);
const outputDir = path.resolve(
    __dirname,
    "../content/generated"
);
const outputPath = path.resolve(
    outputDir,
    "catalog-manifest.json"
);

async function collectJsFiles(
    directoryPath
) {
    const entries = await fs.readdir(
        directoryPath,
        {
            withFileTypes: true
        }
    );
    const files = [];

    for (const entry of entries) {
        const entryPath = path.join(
            directoryPath,
            entry.name
        );

        if (entry.isDirectory()) {
            files.push(
                ...(await collectJsFiles(
                    entryPath
                ))
            );
            continue;
        }

        if (entry.isFile()) {
            files.push(entryPath);
        }
    }

    return files;
}

async function buildTopicMetaById() {
    const files =
        await collectJsFiles(banksDir);
    const topicMetaById = {};

    for (const filePath of files) {
        if (
            path.basename(filePath) !==
            "index.js"
        ) {
            continue;
        }

        const source = await fs.readFile(
            filePath,
            "utf8"
        );
        const match = source.match(
            /(?:^|[\s{,])["'`]?id["'`]?\s*:\s*["'`]([^"'`]+)["'`]/m
        );

        if (!match) {
            continue;
        }

        const fileStat = await fs.stat(
            filePath
        );
        topicMetaById[match[1]] = {
            path: path
                .relative(
                    path.resolve(
                        __dirname,
                        "..",
                        ".."
                    ),
                    filePath
                )
                .replace(/\\/g, "/"),
            updatedAt:
                fileStat.mtime.toISOString()
        };
    }

    return topicMetaById;
}

const topicMetaById =
    await buildTopicMetaById();

const manifest =
    buildQuestionsCatalogManifest(
        questionsDB,
        {
            topicMetaById
        }
    );

await fs.mkdir(outputDir, {
    recursive: true
});
await fs.writeFile(
    outputPath,
    JSON.stringify(manifest, null, 2) +
        "\n",
    "utf8"
);

console.log(
    `Manifest generated at ${outputPath}`
);
console.log(
    JSON.stringify(manifest.totals, null, 2)
);
