const state = {
  cards: [],
  filtered: [],
  index: 0,
  revealed: false,
  known: new Set(JSON.parse(localStorage.getItem("knownCards") || "[]"))
};

const els = {
  position: document.querySelector("#position"),
  knownCount: document.querySelector("#known-count"),
  testFilter: document.querySelector("#test-filter"),
  imageFilter: document.querySelector("#image-filter"),
  cardId: document.querySelector("#card-id"),
  imageBadge: document.querySelector("#image-badge"),
  cardImage: document.querySelector("#card-image"),
  question: document.querySelector("#question"),
  options: document.querySelector("#options"),
  answer: document.querySelector("#answer"),
  prev: document.querySelector("#prev-button"),
  reveal: document.querySelector("#reveal-button"),
  known: document.querySelector("#known-button"),
  next: document.querySelector("#next-button")
};

function saveKnown() {
  localStorage.setItem("knownCards", JSON.stringify([...state.known]));
}

function currentCard() {
  return state.filtered[state.index];
}

function applyFilters() {
  const selectedTest = els.testFilter.value;
  const onlyImages = els.imageFilter.checked;

  state.filtered = state.cards.filter((card) => {
    const byTest = selectedTest === "all" || card.test_id === selectedTest;
    const byImage = !onlyImages || card.requires_image;
    return byTest && byImage;
  });

  state.index = 0;
  state.revealed = false;
  render();
}

function renderOptions(card) {
  els.options.replaceChildren();

  for (const letter of Object.keys(card.options).sort()) {
    const item = document.createElement("li");
    item.className = state.revealed && card.correct_answer === letter ? "correct" : "";
    item.textContent = `${letter.toUpperCase()}) ${card.options[letter]}`;
    els.options.append(item);
  }
}

function renderAnswer(card) {
  els.answer.replaceChildren();

  if (!state.revealed) {
    els.answer.hidden = true;
    return;
  }

  const correct = document.createElement("p");
  correct.className = "answer-main";
  correct.textContent = card.back;

  els.answer.append(correct);
  els.answer.hidden = false;
}

function renderEmpty() {
  els.position.textContent = "0/0";
  els.cardId.textContent = "Sin tarjetas";
  els.imageBadge.hidden = true;
  els.cardImage.hidden = true;
  els.cardImage.removeAttribute("src");
  els.question.textContent = "No hay tarjetas para este filtro.";
  els.options.replaceChildren();
  els.answer.replaceChildren();
  els.answer.hidden = true;
}

function render() {
  els.knownCount.textContent = `${state.known.size} sabidas`;

  if (!state.filtered.length) {
    renderEmpty();
    return;
  }

  const card = currentCard();
  const known = state.known.has(card.id);

  els.position.textContent = `${state.index + 1}/${state.filtered.length}`;
  els.cardId.textContent = `${card.id}${known ? " · sabida" : ""}`;
  els.imageBadge.hidden = !card.requires_image;
  els.cardImage.hidden = !card.image;
  if (card.image) {
    els.cardImage.src = `../${card.image.src}`;
    els.cardImage.alt = `Imagen de la pregunta ${card.id}`;
  } else {
    els.cardImage.removeAttribute("src");
    els.cardImage.alt = "";
  }
  els.question.textContent = card.front;
  renderOptions(card);
  renderAnswer(card);
  els.reveal.textContent = state.revealed ? "Ocultar respuesta" : "Ver respuesta";
}

function move(delta) {
  if (!state.filtered.length) return;
  state.index = (state.index + delta + state.filtered.length) % state.filtered.length;
  state.revealed = false;
  render();
}

function toggleKnown() {
  const card = currentCard();
  if (!card) return;

  if (state.known.has(card.id)) {
    state.known.delete(card.id);
  } else {
    state.known.add(card.id);
  }

  saveKnown();
  render();
}

function fillTestFilter(cards) {
  const tests = [...new Set(cards.map((card) => card.test_id))].sort();

  for (const test of tests) {
    const option = document.createElement("option");
    option.value = test;
    option.textContent = test;
    els.testFilter.append(option);
  }
}

async function boot() {
  const response = await fetch("../data/flashcards.json");
  const data = await response.json();
  state.cards = data.flashcards;
  fillTestFilter(state.cards);
  applyFilters();
}

els.prev.addEventListener("click", () => move(-1));
els.next.addEventListener("click", () => move(1));
els.reveal.addEventListener("click", () => {
  state.revealed = !state.revealed;
  render();
});
els.known.addEventListener("click", toggleKnown);
els.testFilter.addEventListener("change", applyFilters);
els.imageFilter.addEventListener("change", applyFilters);

boot().catch((error) => {
  els.question.textContent = "No se pudieron cargar las flashcards.";
  console.error(error);
});
