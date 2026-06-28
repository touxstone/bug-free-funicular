import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");

const answers = JSON.parse(readFileSync(path.join(DATA_DIR, "answers.json"), "utf8"));
const { questions } = JSON.parse(readFileSync(path.join(DATA_DIR, "questions.json"), "utf8"));
const { images } = JSON.parse(readFileSync(path.join(DATA_DIR, "question-images.json"), "utf8"));

function cardBack(question, answer) {
  const option = question.options[answer];
  return `Respuesta correcta: ${answer.toUpperCase()}) ${option}`;
}

const flashcards = questions.map((question) => {
  const answer = answers[question.test_id]?.[question.question_number - 1];

  if (!answer) {
    throw new Error(`Missing answer for ${question.id}`);
  }

  return {
    id: question.id,
    test_id: question.test_id,
    question_number: question.question_number,
    front: question.question,
    options: question.options,
    back: cardBack(question, answer),
    correct_answer: answer,
    correct_option: question.options[answer],
    explanation: "Pendiente de enriquecer con el prompt pedagogico.",
    tags: ["autoescuela", `test${question.test_id}`],
    requires_image: Boolean(images[question.id]) || question.requires_image,
    image: images[question.id] ?? null,
    source_pdf: `stuff/test${String(Number(question.test_id) - 1000).padStart(2, "0")}.pdf`
  };
});

mkdirSync(DATA_DIR, { recursive: true });
writeFileSync(path.join(DATA_DIR, "flashcards.json"), `${JSON.stringify({ flashcards }, null, 2)}\n`);

console.log(`Built ${flashcards.length} flashcards.`);
