import { spawnSync } from "node:child_process";
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const STUFF_DIR = path.join(ROOT, "stuff");
const DATA_DIR = path.join(ROOT, "data");

const optionPattern = /(?:^|\n)\s*([abc])\)\s*/gim;
const visualHints = [
  "esta señal",
  "esta situacion",
  "esta situación",
  "en esta via",
  "en esta vía",
  "por esta carretera",
  "en la fotografia",
  "en la fotografía",
  "en la imagen",
  "observando la imagen"
];

function normalizeText(value) {
  return value
    .replace(/\r/g, "\n")
    .replace(/\f/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function unwrap(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function testIdFromText(text, fallbackIndex) {
  const match = text.match(/\bTEST\s+(\d{4})\b/i);
  return match ? match[1] : String(1000 + fallbackIndex);
}

function parseQuestionBlock(block, testId) {
  const numberMatch = block.match(/^\s*(\d{1,2})\.\s*/);
  if (!numberMatch) return null;

  const questionNumber = Number(numberMatch[1]);
  const withoutNumber = block.slice(numberMatch[0].length);
  const matches = [...withoutNumber.matchAll(optionPattern)];

  if (matches.length < 2) {
    throw new Error(`Question ${testId}-${questionNumber} has ${matches.length} options`);
  }

  const question = unwrap(withoutNumber.slice(0, matches[0].index));
  const options = {};

  for (let i = 0; i < matches.length; i += 1) {
    const letter = matches[i][1].toLowerCase();
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : withoutNumber.length;
    options[letter] = unwrap(withoutNumber.slice(start, end));
  }

  const lowerQuestion = question.toLowerCase();
  const requiresImage = visualHints.some((hint) => lowerQuestion.includes(hint));

  return {
    id: `${testId}-${String(questionNumber).padStart(2, "0")}`,
    test_id: testId,
    question_number: questionNumber,
    question,
    options,
    requires_image: requiresImage
  };
}

function parsePdf(fileName, fallbackIndex) {
  const filePath = path.join(STUFF_DIR, fileName);
  const result = spawnSync("pdftotext", ["-layout", filePath, "-"], { encoding: "utf8" });

  if (!result.stdout && result.error) {
    throw result.error;
  }

  if (!result.stdout && result.status !== 0) {
    throw new Error(`pdftotext failed for ${fileName}: ${result.stderr}`);
  }

  const raw = result.stdout;
  const text = normalizeText(raw);
  const testId = testIdFromText(text, fallbackIndex);

  const blocks = text
    .replace(/^.*?\bTEST\s+\d{4}\b/ims, "")
    .split(/\n(?=\s*\d{1,2}\.\s)/)
    .map((block) => block.trim())
    .filter(Boolean);

  const questions = blocks
    .map((block) => parseQuestionBlock(block, testId))
    .filter(Boolean);

  return { test_id: testId, source_pdf: `stuff/${fileName}`, questions };
}

const files = readdirSync(STUFF_DIR)
  .filter((file) => /^test\d{2}\.pdf$/i.test(file))
  .sort();

const tests = files.map((file, index) => parsePdf(file, index + 1));
const questions = tests.flatMap((test) => test.questions);

mkdirSync(DATA_DIR, { recursive: true });
writeFileSync(path.join(DATA_DIR, "questions.json"), `${JSON.stringify({ tests, questions }, null, 2)}\n`);

console.log(`Extracted ${questions.length} questions from ${tests.length} tests.`);
