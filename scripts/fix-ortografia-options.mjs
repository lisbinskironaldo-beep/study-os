import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const repoRoot = process.cwd();
const target = path.join(repoRoot, "questions", "banks", "1-serie", "portugues", "ortografia-e-pontuacao", "index.js");

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function stripAccents(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function unique(options) {
  const seen = new Set();
  const result = [];
  for (const option of options) {
    const key = normalize(option);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(option);
  }
  return result;
}

function wordCandidates(correct, subtopic) {
  const lower = normalize(correct);
  const byCorrect = {
    "mas": ["mais", "más", "maiz"],
    "mais": ["mas", "más", "maiz"],
    "mal": ["mau", "máu", "ma"],
    "mau": ["mal", "máu", "ma"],
    "por que": ["porque", "porquê", "por quê"],
    "porque": ["por que", "porquê", "por quê"],
    "há": ["a", "à", "ha"],
    "a": ["há", "à", "ha"],
    "xícara": ["chícara", "xicara", "xícera"],
    "mexer": ["mecher", "mexerr", "meixer"],
    "enxó": ["enchó", "enxo", "encho"],
    "conserto": ["concerto", "consserto", "conzerto"],
    "tráfego": ["tráfico", "trafego", "tráfego"],
    "iminente": ["eminente", "imimente", "eminenti"],
    "precisar": ["prezisar", "precizzar", "presisar"],
    "apoio": ["apoioo", "apoiyo", "apóio"]
  };

  if (byCorrect[lower]) return byCorrect[lower];

  if (/acentu/i.test(subtopic) || /[áéíóúâêôãõç]/i.test(correct)) {
    const plain = stripAccents(correct);
    return unique([
      plain,
      `${plain}o`,
      correct.replace(/[áéíóúâêôãõ]/i, "a"),
      `${correct}o`
    ]);
  }

  return unique([
    `${correct}o`,
    stripAccents(correct),
    correct.replace(/[sz]/i, (match) => (match.toLowerCase() === "s" ? "z" : "s")),
    correct.replace(/[xc]/i, (match) => (match.toLowerCase() === "x" ? "ch" : "x"))
  ]);
}

function sentenceCandidates(correct, enunciado) {
  const base = String(correct || "");
  const withoutQuestion = base.replace(/\?$/, ".");
  const withoutPeriod = base.replace(/\.$/, "");
  const swappedPorque = base
    .replace(/\bPor que\b/g, "Porque")
    .replace(/\bporque\b/g, "por que");
  const noCommas = base.replace(/,/g, "");
  const wrongEnding = base.endsWith("?") ? base.replace(/\?$/, "") : `${base}?`;

  return unique([
    swappedPorque,
    withoutQuestion,
    withoutPeriod,
    noCommas,
    wrongEnding,
    enunciado.replace(/^Qual alternativa reescreve corretamente a frase\s*/i, "").replace(/^"|"$/g, "")
  ]);
}

function candidatesFor(question) {
  const correct = String(question.correta || "");
  if (correct.includes(" ") || /[.?!,]/.test(correct)) {
    return sentenceCandidates(correct, question.enunciado || "");
  }
  return wordCandidates(correct, question.subtopico || "");
}

function fixQuestion(question) {
  const current = Array.isArray(question.opcoes) ? question.opcoes : [];
  const output = unique(current);
  const hasCorrect = output.some((option) => normalize(option) === normalize(question.correta));
  if (!hasCorrect && question.correta) {
    output.unshift(question.correta);
  }

  for (const candidate of candidatesFor(question)) {
    if (output.length >= 4) break;
    if (normalize(candidate) !== normalize(question.correta)) {
      output.push(candidate);
      const deduped = unique(output);
      output.length = 0;
      output.push(...deduped);
    }
  }

  question.opcoes = output.slice(0, 4);
}

const mod = await import(`${pathToFileURL(target).href}?t=${Date.now()}`);
const [[exportName, topic]] = Object.entries(mod).filter(([, value]) => value?.questoes);

for (const question of topic.questoes) {
  if (new Set(question.opcoes.map(normalize)).size !== question.opcoes.length) {
    fixQuestion(question);
  }
}

const output = `export const ${exportName} = ${JSON.stringify(topic, null, 2)};\n`;
fs.writeFileSync(target, output, "utf8");
console.log(`Corrigido: ${path.relative(repoRoot, target)}`);
