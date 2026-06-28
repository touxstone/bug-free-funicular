import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const STUFF_DIR = path.join(ROOT, "stuff");
const DATA_DIR = path.join(ROOT, "data");
const TMP_DIR = path.join(ROOT, ".tmp", "pdf-images");
const ASSET_DIR = path.join(ROOT, "app", "assets", "questions");

function attr(tag, name) {
  const match = tag.match(new RegExp(`${name}="([^"]+)"`));
  return match ? match[1] : "";
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, "").trim();
}

function testIdFromFile(fileName) {
  const match = fileName.match(/test(\d{2})\.pdf$/i);
  if (!match) throw new Error(`Unexpected test filename: ${fileName}`);
  return String(1000 + Number(match[1]));
}

function parseXml(xml) {
  const pages = [];
  const pagePattern = /<page\b([^>]*)>([\s\S]*?)<\/page>/g;

  for (const pageMatch of xml.matchAll(pagePattern)) {
    const pageNumber = Number(attr(pageMatch[1], "number"));
    const body = pageMatch[2];
    const images = [...body.matchAll(/<image\b[^>]*>/g)].map((match) => ({
      top: Number(attr(match[0], "top")),
      left: Number(attr(match[0], "left")),
      width: Number(attr(match[0], "width")),
      height: Number(attr(match[0], "height")),
      src: attr(match[0], "src")
    }));

    const textItems = [...body.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)]
      .map((match) => ({
        top: Number(attr(match[1], "top")),
        left: Number(attr(match[1], "left")),
        text: stripTags(match[2])
      }))
      .sort((a, b) => a.top - b.top || a.left - b.left);

    const questionStarts = [];
    for (let i = 0; i < textItems.length; i += 1) {
      const item = textItems[i];
      if (/^\d{1,2}\.$/.test(item.text)) {
        questionStarts.push({
          top: item.top,
          question_number: Number(item.text.replace(".", ""))
        });
        continue;
      }

      const next = textItems[i + 1];
      if (/^\d{1,2}$/.test(item.text) && next?.text === "." && Math.abs(next.top - item.top) <= 3) {
        questionStarts.push({
          top: item.top,
          question_number: Number(item.text)
        });
      }
    }

    pages.push({ page: pageNumber, images, questionStarts });
  }

  return pages;
}

function imageForQuestion(page, question, nextQuestion) {
  const start = question.top - 12;
  const end = nextQuestion ? nextQuestion.top - 12 : Number.POSITIVE_INFINITY;
  const candidates = page.images.filter((image) => image.top >= start && image.top < end);

  if (!candidates.length) return null;

  return candidates.sort((a, b) => {
    const leftScore = a.left - b.left;
    if (leftScore !== 0) return leftScore;
    return a.top - b.top;
  })[0];
}

function runPdfToHtml(fileName, outputBase) {
  const pdfPath = path.join(STUFF_DIR, fileName);
  const result = spawnSync("pdftohtml", ["-xml", "-fmt", "png", pdfPath, outputBase], {
    encoding: "utf8"
  });
  const xmlPath = `${outputBase}.xml`;

  if (result.error && !existsSync(xmlPath)) throw result.error;
  if (result.status !== 0 && !existsSync(xmlPath)) {
    throw new Error(`pdftohtml failed for ${fileName}: ${result.stderr}`);
  }
}

rmSync(TMP_DIR, { recursive: true, force: true });
mkdirSync(TMP_DIR, { recursive: true });
mkdirSync(ASSET_DIR, { recursive: true });

const files = readdirSync(STUFF_DIR)
  .filter((file) => /^test\d{2}\.pdf$/i.test(file))
  .sort();

const imageMap = {};
let copied = 0;

for (const fileName of files) {
  const testId = testIdFromFile(fileName);
  const testSlug = fileName.replace(/\.pdf$/i, "");
  const tmpBase = path.join(TMP_DIR, testSlug);
  const assetTestDir = path.join(ASSET_DIR, testSlug);

  rmSync(assetTestDir, { recursive: true, force: true });
  mkdirSync(assetTestDir, { recursive: true });
  runPdfToHtml(fileName, tmpBase);

  const xmlPath = `${tmpBase}.xml`;
  if (!existsSync(xmlPath)) throw new Error(`Missing XML output for ${fileName}`);

  const pages = parseXml(readFileSync(xmlPath, "utf8"));
  const allQuestions = pages.flatMap((page) =>
    page.questionStarts.map((question, index) => ({
      page,
      question,
      nextQuestion: page.questionStarts[index + 1]
    }))
  );

  for (const { page, question, nextQuestion } of allQuestions) {
    const image = imageForQuestion(page, question, nextQuestion);
    if (!image) continue;

    const source = image.src;
    if (!existsSync(source)) continue;

    const cardId = `${testId}-${String(question.question_number).padStart(2, "0")}`;
    const targetName = `${cardId}.png`;
    const targetPath = path.join(assetTestDir, targetName);
    const relativePath = `app/assets/questions/${testSlug}/${targetName}`;

    copyFileSync(source, targetPath);
    imageMap[cardId] = {
      src: relativePath,
      page: page.page,
      top: image.top,
      left: image.left,
      width: image.width,
      height: image.height
    };
    copied += 1;
  }
}

writeFileSync(path.join(DATA_DIR, "question-images.json"), `${JSON.stringify({ images: imageMap }, null, 2)}\n`);

console.log(`Extracted ${copied} question images.`);
