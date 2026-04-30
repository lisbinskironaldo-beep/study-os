import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const repoRoot = process.cwd();
const banksRoot = path.join(repoRoot, "questions", "banks");
const reportRoot = path.join(repoRoot, ".codex-artifacts", "editorial-audit");

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const current = process.argv[index];
  if (!current.startsWith("--")) continue;
  const key = current.slice(2);
  const next = process.argv[index + 1];
  if (!next || next.startsWith("--")) {
    args.set(key, true);
  } else {
    args.set(key, next);
    index += 1;
  }
}

const selectedMateria = args.get("materia") ? normalizeSlug(String(args.get("materia"))) : "";
const selectedSerie = args.get("serie") ? String(args.get("serie")) : "";
const failOnIssues = args.has("fail-on-issues");

function normalizeSlug(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function walkFiles(dir) {
  const output = [];
  if (!fs.existsSync(dir)) return output;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) output.push(...walkFiles(fullPath));
    if (entry.isFile() && entry.name === "index.js") output.push(fullPath);
  }

  return output;
}

function targetRoot() {
  if (selectedSerie && selectedMateria) {
    return path.join(banksRoot, `${selectedSerie}-serie`, selectedMateria);
  }
  if (selectedSerie) return path.join(banksRoot, `${selectedSerie}-serie`);
  return banksRoot;
}

function isTopic(value) {
  return value && typeof value === "object" && Array.isArray(value.questoes);
}

function hasPlaceholder(text) {
  const value = String(text || "");
  return (
    /\b(?:TODO|FIXME)\b/.test(value) ||
    /\b(?:undefined|null)\b/i.test(value) ||
    /\{\{|\}\}|lorem ipsum/i.test(value)
  );
}

function normalizeAnswer(text) {
  return String(text || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function auditQuestion(question, index) {
  const issues = [];
  const label = question?.id || `questao-${index + 1}`;
  const options = Array.isArray(question?.opcoes) ? question.opcoes : [];
  const correct = question?.correta;
  const normalizedOptions = options.map(normalizeAnswer);
  const normalizedCorrect = normalizeAnswer(correct);

  if (!question || typeof question !== "object") {
    issues.push({ id: label, type: "invalid-question", detail: "Questao nao e objeto." });
    return issues;
  }

  for (const key of ["id", "materia", "topico", "enunciado", "correta", "comentario"]) {
    if (typeof question[key] !== "string" || !question[key].trim()) {
      issues.push({ id: label, type: "missing-field", detail: `Campo ausente ou vazio: ${key}` });
    }
  }

  if (question.tipo !== "multipla_escolha") {
    issues.push({ id: label, type: "unexpected-type", detail: `Tipo encontrado: ${question.tipo || "-"}` });
  }

  if (options.length < 2) {
    issues.push({ id: label, type: "options-too-short", detail: `Opcoes: ${options.length}` });
  }

  const unique = new Set(normalizedOptions);
  if (unique.size !== normalizedOptions.length) {
    issues.push({ id: label, type: "duplicate-options", detail: "Ha alternativas repetidas." });
  }

  if (normalizedCorrect && !normalizedOptions.includes(normalizedCorrect)) {
    issues.push({ id: label, type: "correct-not-in-options", detail: `Correta: ${correct}` });
  }

  for (const key of ["enunciado", "correta", "comentario"]) {
    if (hasPlaceholder(question[key])) {
      issues.push({ id: label, type: "placeholder", detail: `${key}: ${String(question[key]).slice(0, 120)}` });
    }
  }

  for (const [optionIndex, option] of options.entries()) {
    if (typeof option !== "string" || !option.trim()) {
      issues.push({ id: label, type: "empty-option", detail: `Alternativa ${optionIndex + 1}` });
    }
    if (hasPlaceholder(option)) {
      issues.push({ id: label, type: "placeholder-option", detail: String(option).slice(0, 120) });
    }
  }

  const enunciado = String(question.enunciado || "").trim();
  if (
    enunciado &&
    /^(qual|como|por que|o que|em que)\b/i.test(enunciado) &&
    !enunciado.includes("____") &&
    !/[?:]"?$/.test(enunciado)
  ) {
    issues.push({ id: label, type: "odd-ending", detail: String(question.enunciado).slice(0, 160) });
  }

  if (question.comentario && String(question.comentario).length < 12) {
    issues.push({ id: label, type: "thin-comment", detail: question.comentario });
  }

  return issues;
}

async function auditFile(filePath) {
  const relPath = path.relative(repoRoot, filePath).replace(/\\/g, "/");
  const result = {
    file: relPath,
    topicCount: 0,
    questionCount: 0,
    issueCount: 0,
    issues: []
  };

  try {
    const mod = await import(`${pathToFileURL(filePath).href}?t=${Date.now()}`);
    const topics = Object.values(mod).filter(isTopic);
    result.topicCount = topics.length;

    for (const topic of topics) {
      result.questionCount += topic.questoes.length;
      const expectedMateria = selectedMateria || "portugues";
      if (!topic.materia || normalizeSlug(topic.materia) !== expectedMateria) {
        result.issues.push({
          id: topic.id || relPath,
          type: "topic-materia",
          detail: `Materia inesperada: ${topic.materia || "-"}`
        });
      }

      for (const [index, question] of topic.questoes.entries()) {
        result.issues.push(...auditQuestion(question, index));
      }
    }

    const expectedIndexPath = selectedMateria ? `/${selectedMateria}/index.js` : "/portugues/index.js";
    if (!topics.length && !relPath.endsWith(expectedIndexPath)) {
      result.issues.push({ id: relPath, type: "no-topic-export", detail: "Nenhum export com questoes encontrado." });
    }
  } catch (error) {
    result.issues.push({
      id: relPath,
      type: "import-error",
      detail: error && error.message ? error.message : String(error)
    });
  }

  result.issueCount = result.issues.length;
  return result;
}

function renderMarkdown(results, summary) {
  const lines = [
    "# Auditoria de integridade das questoes",
    "",
    `Gerado em: ${new Date().toISOString()}`,
    `Arquivos analisados: ${results.length}`,
    `Quest\u00f5es analisadas: ${results.reduce((sum, item) => sum + item.questionCount, 0)}`,
    `Arquivos com problemas: ${results.filter((item) => item.issueCount > 0).length}`,
    `Problemas totais: ${results.reduce((sum, item) => sum + item.issueCount, 0)}`,
    "",
    "## Resumo por tipo",
    ""
  ];

  for (const [type, count] of Object.entries(summary)) {
    lines.push(`- ${type}: ${count}`);
  }
  if (!Object.keys(summary).length) lines.push("- nenhum problema encontrado");

  lines.push("", "## Arquivos", "");
  for (const result of results.filter((item) => item.issueCount > 0)) {
    lines.push(`### ${result.file}`);
    lines.push(`- quest\u00f5es: ${result.questionCount}`);
    lines.push(`- problemas: ${result.issueCount}`);
    for (const issue of result.issues.slice(0, 40)) {
      lines.push(`- [${issue.type}] ${issue.id}: ${issue.detail}`);
    }
    if (result.issues.length > 40) {
      lines.push(`- ... mais ${result.issues.length - 40} problemas neste arquivo`);
    }
    lines.push("");
  }

  if (!results.some((item) => item.issueCount > 0)) {
    lines.push("Nenhum problema estrutural encontrado.");
  }

  return `${lines.join("\n")}\n`;
}

function summarize(results) {
  const summary = new Map();
  for (const result of results) {
    for (const issue of result.issues) {
      summary.set(issue.type, (summary.get(issue.type) || 0) + 1);
    }
  }
  return Object.fromEntries([...summary.entries()].sort(([left], [right]) => left.localeCompare(right)));
}

const files = walkFiles(targetRoot()).filter((filePath) => {
  const rel = path.relative(banksRoot, filePath).replace(/\\/g, "/");
  if (selectedMateria && !rel.split("/").includes(selectedMateria)) return false;
  return true;
});

const results = [];
for (const file of files) {
  results.push(await auditFile(file));
}
results.sort((left, right) => right.issueCount - left.issueCount || left.file.localeCompare(right.file));

const summary = summarize(results);
const reportBase = [
  "integrity",
  selectedSerie ? `${selectedSerie}-serie` : "todas-series",
  selectedMateria || "todas-materias"
].join("__");

fs.mkdirSync(reportRoot, { recursive: true });
fs.writeFileSync(path.join(reportRoot, `${reportBase}.json`), `${JSON.stringify({ summary, results }, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(reportRoot, `${reportBase}.md`), renderMarkdown(results, summary), "utf8");

const totalIssues = results.reduce((sum, item) => sum + item.issueCount, 0);
console.log(`Arquivos analisados: ${results.length}`);
console.log(`Questoes analisadas: ${results.reduce((sum, item) => sum + item.questionCount, 0)}`);
console.log(`Arquivos com problemas: ${results.filter((item) => item.issueCount > 0).length}`);
console.log(`Problemas totais: ${totalIssues}`);
console.log(`Relatorio: ${path.relative(repoRoot, path.join(reportRoot, `${reportBase}.md`))}`);

if (failOnIssues && totalIssues > 0) {
  process.exitCode = 1;
}
