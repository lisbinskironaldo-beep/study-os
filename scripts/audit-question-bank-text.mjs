import fs from "node:fs";
import path from "node:path";

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

const selectedSerie = args.get("serie") ? String(args.get("serie")) : "";
const selectedMateria = args.get("materia") ? normalizeSlug(String(args.get("materia"))) : "";
const failOnIssues = args.has("fail-on-issues");

const mojibakePatterns = [
  { label: "mojibake Ã", pattern: /Ã[\u00a0-\u00bf]/ },
  { label: "mojibake Â", pattern: /Â[\u00a0-\u00bf·]/ },
  { label: "mojibake â", pattern: /â(?:€|€™|€œ|€\u009d|€¢|€“|€”|€¦)/ },
  { label: "replacement char", pattern: /�/ }
];

const asciiTerms = [
  ["acao", "a\u00e7\u00e3o"],
  ["acoes", "a\u00e7\u00f5es"],
  ["analise", "an\u00e1lise"],
  ["avaliacao", "avalia\u00e7\u00e3o"],
  ["carater", "car\u00e1ter"],
  ["caracteristicas", "caracter\u00edsticas"],
  ["celula", "c\u00e9lula"],
  ["ciencias", "ci\u00eancias"],
  ["consequencia", "consequ\u00eancia"],
  ["consequencias", "consequ\u00eancias"],
  ["contem", "cont\u00e9m"],
  ["criterio", "crit\u00e9rio"],
  ["criterios", "crit\u00e9rios"],
  ["decisao", "decis\u00e3o"],
  ["decisoes", "decis\u00f5es"],
  ["distancia", "dist\u00e2ncia"],
  ["distancias", "dist\u00e2ncias"],
  ["domestico", "dom\u00e9stico"],
  ["domesticos", "dom\u00e9sticos"],
  ["educacao", "educa\u00e7\u00e3o"],
  ["equilibrio", "equil\u00edbrio"],
  ["etica", "\u00e9tica"],
  ["fisica", "f\u00edsica"],
  ["filosofica", "filos\u00f3fica"],
  ["filosofico", "filos\u00f3fico"],
  ["formacao", "forma\u00e7\u00e3o"],
  ["frequencia", "frequ\u00eancia"],
  ["grafico", "gr\u00e1fico"],
  ["graficos", "gr\u00e1ficos"],
  ["funcao", "fun\u00e7\u00e3o"],
  ["funcoes", "fun\u00e7\u00f5es"],
  ["genero", "g\u00eanero"],
  ["generos", "g\u00eaneros"],
  ["habito", "h\u00e1bito"],
  ["habitos", "h\u00e1bitos"],
  ["historia", "hist\u00f3ria"],
  ["ingles", "ingl\u00eas"],
  ["interpretacao", "interpreta\u00e7\u00e3o"],
  ["juizo", "ju\u00edzo"],
  ["laboratorio", "laborat\u00f3rio"],
  ["lancar", "lan\u00e7ar"],
  ["lancamento", "lan\u00e7amento"],
  ["lancamentos", "lan\u00e7amentos"],
  ["lingua", "l\u00edngua"],
  ["matematica", "matem\u00e1tica"],
  ["media", "m\u00e9dia"],
  ["numero", "n\u00famero"],
  ["numeros", "n\u00fameros"],
  ["observacao", "observa\u00e7\u00e3o"],
  ["oscilacao", "oscila\u00e7\u00e3o"],
  ["oscilacoes", "oscila\u00e7\u00f5es"],
  ["nao", "n\u00e3o"],
  ["oculos", "\u00f3culos"],
  ["portugues", "portugu\u00eas"],
  ["possivel", "poss\u00edvel"],
  ["possiveis", "poss\u00edveis"],
  ["preposicao", "preposi\u00e7\u00e3o"],
  ["producao", "produ\u00e7\u00e3o"],
  ["propagacao", "propaga\u00e7\u00e3o"],
  ["quimica", "qu\u00edmica"],
  ["raciocinio", "racioc\u00ednio"],
  ["redacao", "reda\u00e7\u00e3o"],
  ["reflexao", "reflex\u00e3o"],
  ["reposicao", "reposi\u00e7\u00e3o"],
  ["regencia", "reg\u00eancia"],
  ["relacao", "rela\u00e7\u00e3o"],
  ["relacoes", "rela\u00e7\u00f5es"],
  ["sao", "s\u00e3o"],
  ["situacao", "situa\u00e7\u00e3o"],
  ["situacoes", "situa\u00e7\u00f5es"],
  ["tambem", "tamb\u00e9m"],
  ["tecnica", "t\u00e9cnica"],
  ["tecnicas", "t\u00e9cnicas"],
  ["triangulo", "tri\u00e2ngulo"],
  ["triangulos", "tri\u00e2ngulos"],
  ["variacao", "varia\u00e7\u00e3o"],
  ["visivel", "vis\u00edvel"],
  ["visiveis", "vis\u00edveis"],
  ["voce", "voc\u00ea"]
].map(([term, expected]) => ({
  term,
  expected,
  pattern: new RegExp(`\\b${term}\\b`, "i")
}));

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
    if (entry.isDirectory()) {
      output.push(...walkFiles(fullPath));
    } else if (entry.isFile() && entry.name === "index.js") {
      output.push(fullPath);
    }
  }

  return output;
}

function getLine(source, index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function extractStrings(source) {
  const strings = [];
  const regex = /(["'`])((?:\\[\s\S]|(?!\1)[\s\S])*?)\1/g;
  let match;
  while ((match = regex.exec(source))) {
    const raw = match[0];
    const value = match[2]
      .replace(/\\n/g, " ")
      .replace(/\\"/g, "\"")
      .replace(/\\'/g, "'")
      .replace(/\\`/g, "`");
    strings.push({
      value,
      raw,
      line: getLine(source, match.index)
    });
  }
  return strings;
}

function shouldSkipString(value) {
  return (
    value.startsWith(".") ||
    value.startsWith("/") ||
    value.includes("../") ||
    value.includes("./") ||
    /^[a-z0-9_-]+$/i.test(value) ||
    /^[a-z0-9_-]+\/[a-z0-9_./-]+$/i.test(value)
  );
}

function auditFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const relPath = path.relative(repoRoot, filePath).replace(/\\/g, "/");
  const issues = [];
  const strings = extractStrings(source).filter((item) => !shouldSkipString(item.value));

  for (const item of strings) {
    for (const check of mojibakePatterns) {
      if (check.pattern.test(item.value)) {
        issues.push({
          type: "mojibake",
          term: check.label,
          line: item.line,
          text: item.value
        });
      }
    }

    for (const check of asciiTerms) {
      const match = item.value.match(check.pattern)?.[0] || "";
      if (
        match &&
        !(selectedMateria === "matematica" && match === match.toUpperCase()) &&
        !(selectedMateria === "ingles" && check.term === "media") &&
        !(check.term === "media" && /\bmedia(?:ç|c)/i.test(item.value))
      ) {
        issues.push({
          type: "missing-accent",
          term: check.term,
          expected: check.expected,
          line: item.line,
          text: item.value
        });
      }
    }

    if (/\s{2,}/.test(item.value.trim())) {
      issues.push({
        type: "spacing",
        term: "double-space",
        line: item.line,
        text: item.value
      });
    }

  }

  const auditMetadata = {
    auditado: /"auditado"\s*:\s*true/.test(source),
    auditadoEm: source.match(/"auditadoEm"\s*:\s*"([^"]+)"/)?.[1] || "",
    auditoriaTipo: source.match(/"auditoriaTipo"\s*:\s*"([^"]+)"/)?.[1] || "",
    seloEditorial: source.match(/"seloEditorial"\s*:\s*"([^"]*)"/)?.[1] || ""
  };

  return {
    file: relPath,
    issueCount: issues.length,
    auditMetadata,
    issues
  };
}

function buildTargetRoot() {
  if (!selectedSerie && !selectedMateria) return banksRoot;
  if (selectedSerie && selectedMateria) {
    return path.join(banksRoot, `${selectedSerie}-serie`, selectedMateria);
  }
  if (selectedSerie) return path.join(banksRoot, `${selectedSerie}-serie`);
  return banksRoot;
}

function groupSummary(results) {
  const byType = new Map();
  for (const result of results) {
    for (const issue of result.issues) {
      byType.set(issue.type, (byType.get(issue.type) || 0) + 1);
    }
  }
  return Object.fromEntries([...byType.entries()].sort(([left], [right]) => left.localeCompare(right)));
}

function renderMarkdown(results, summary) {
  const titleParts = ["# Auditoria editorial"];
  if (selectedSerie) titleParts.push(`${selectedSerie}\u00aa s\u00e9rie`);
  if (selectedMateria) titleParts.push(selectedMateria);

  const lines = [
    titleParts.join(" - "),
    "",
    `Gerado em: ${new Date().toISOString()}`,
    `Arquivos analisados: ${results.length}`,
    `Arquivos com suspeitas: ${results.filter((item) => item.issueCount > 0).length}`,
    `Suspeitas totais: ${results.reduce((total, item) => total + item.issueCount, 0)}`,
    "",
    "## Resumo por tipo",
    ""
  ];

  for (const [type, count] of Object.entries(summary)) {
    lines.push(`- ${type}: ${count}`);
  }

  if (!Object.keys(summary).length) {
    lines.push("- nenhum problema encontrado");
  }

  lines.push("", "## Arquivos", "");

  for (const result of results.filter((item) => item.issueCount > 0)) {
    lines.push(`### ${result.file}`);
    lines.push(`- suspeitas: ${result.issueCount}`);
    if (result.auditMetadata.auditado || result.auditMetadata.seloEditorial) {
      lines.push(
        `- metadados: auditado=${result.auditMetadata.auditado}; auditadoEm=${result.auditMetadata.auditadoEm || "-"}; auditoriaTipo=${result.auditMetadata.auditoriaTipo || "-"}; seloEditorial=${result.auditMetadata.seloEditorial || "-"}`
      );
    }

    for (const issue of result.issues.slice(0, 30)) {
      const expected = issue.expected ? ` -> ${issue.expected}` : "";
      lines.push(`- L${issue.line} [${issue.type}] ${issue.term}${expected}: ${issue.text.slice(0, 180)}`);
    }
    if (result.issues.length > 30) {
      lines.push(`- ... mais ${result.issues.length - 30} suspeitas neste arquivo`);
    }
    lines.push("");
  }

  if (!results.some((item) => item.issueCount > 0)) {
    lines.push("Nenhuma suspeita encontrada.");
  }

  return `${lines.join("\n")}\n`;
}

const targetRoot = buildTargetRoot();
const files = walkFiles(targetRoot).filter((filePath) => {
  const rel = path.relative(banksRoot, filePath).replace(/\\/g, "/");
  if (!selectedMateria) return true;
  return rel.split("/").includes(selectedMateria);
});

const results = files.map(auditFile).sort((left, right) => right.issueCount - left.issueCount || left.file.localeCompare(right.file));
const summary = groupSummary(results);
const totalIssues = results.reduce((total, item) => total + item.issueCount, 0);
const reportBase = [
  selectedSerie ? `${selectedSerie}-serie` : "todas-series",
  selectedMateria || "todas-materias"
].join("__");

fs.mkdirSync(reportRoot, { recursive: true });
fs.writeFileSync(path.join(reportRoot, `${reportBase}.json`), `${JSON.stringify({ summary, results }, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(reportRoot, `${reportBase}.md`), renderMarkdown(results, summary), "utf8");

console.log(`Arquivos analisados: ${results.length}`);
console.log(`Arquivos com suspeitas: ${results.filter((item) => item.issueCount > 0).length}`);
console.log(`Suspeitas totais: ${totalIssues}`);
console.log(`Relatorio: ${path.relative(repoRoot, path.join(reportRoot, `${reportBase}.md`))}`);

if (failOnIssues && totalIssues > 0) {
  process.exitCode = 1;
}
