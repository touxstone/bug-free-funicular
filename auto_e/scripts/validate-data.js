import { readFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const VALID_ANSWERS = new Set(["a", "b", "c"]);

const answers = JSON.parse(readFileSync(path.join(DATA_DIR, "answers.json"), "utf8"));
const questionsData = JSON.parse(readFileSync(path.join(DATA_DIR, "questions.json"), "utf8"));
const { images } = JSON.parse(readFileSync(path.join(DATA_DIR, "question-images.json"), "utf8"));
const { flashcards } = JSON.parse(readFileSync(path.join(DATA_DIR, "flashcards.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const testIds = Object.keys(answers).sort();
assert(testIds.length === 10, `Expected 10 answer keys, found ${testIds.length}`);

for (const testId of testIds) {
  assert(answers[testId].length === 30, `Expected 30 answers for ${testId}`);
  for (const answer of answers[testId]) {
    assert(VALID_ANSWERS.has(answer), `Invalid answer "${answer}" in ${testId}`);
  }
}

assert(questionsData.tests.length === 10, `Expected 10 parsed tests, found ${questionsData.tests.length}`);
assert(questionsData.questions.length === 300, `Expected 300 questions, found ${questionsData.questions.length}`);
assert(flashcards.length === 300, `Expected 300 flashcards, found ${flashcards.length}`);
assert(Object.keys(images).length >= 250, `Expected most questions to have images, found ${Object.keys(images).length}`);

for (const test of questionsData.tests) {
  assert(test.questions.length === 30, `Expected 30 questions in ${test.test_id}, found ${test.questions.length}`);
}

for (const card of flashcards) {
  assert(VALID_ANSWERS.has(card.correct_answer), `Invalid answer in card ${card.id}`);
  assert(card.options.a && card.options.b, `Missing required options in card ${card.id}`);
  assert(card.correct_option === card.options[card.correct_answer], `Mismatched correct option in card ${card.id}`);
  if (card.image) {
    assert(card.requires_image, `Card ${card.id} has image but is not marked as image-dependent`);
  }
}

const visualCount = flashcards.filter((card) => card.requires_image).length;
console.log(`Validation OK: ${flashcards.length} cards, ${visualCount} marked as image-dependent.`);
