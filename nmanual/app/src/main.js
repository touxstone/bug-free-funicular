import { buildStats, flattenSections, loadManual } from "./data.js";
import { getSectionState, loadProgress, progressCounts, saveProgress, setSectionState } from "./progress.js";
import {
  accuracy,
  cardsFromSection,
  cardsFromSections,
  loadReviewStats,
  recordReview,
  reviewSummary,
  saveReviewStats,
} from "./review.js";
import { currentSectionId, goToSection, onRouteChange } from "./router.js";
import { searchSections } from "./search.js";

const TRASH_TEXT = new Set(["Fi div pgman"]);
const APP_VERSION = "20260629-2";
const STATUS_LABELS = {
  ready: "Lista",
  container_only: "Agrupador",
  empty_source: "Vacia",
};
const PROGRESS_LABELS = {
  pending: "Pendiente",
  read: "Leida",
  doubt: "Duda",
  mastered: "Dominada",
};

const app = {
  manual: null,
  sections: [],
  activeSection: null,
  progress: loadProgress(),
  navFilter: "all",
  focusTerm: "",
  termIndex: [],
  reviewStats: loadReviewStats(),
  reviewQueue: [],
  reviewIndex: 0,
  reviewFlipped: false,
  reviewScope: "section",
  reviewRound: { known: 0, doubt: 0, missed: 0 },
};

const els = {
  chapterList: document.querySelector("#chapterList"),
  studyView: document.querySelector("#studyView"),
  studyRail: document.querySelector("#studyRail"),
  searchInput: document.querySelector("#searchInput"),
  searchFeedback: document.querySelector("#searchFeedback"),
  resultsPanel: document.querySelector("#resultsPanel"),
  searchResults: document.querySelector("#searchResults"),
  previousButton: document.querySelector("#previousButton"),
  nextButton: document.querySelector("#nextButton"),
  menuButton: document.querySelector("#menuButton"),
  sidebar: document.querySelector("#sidebar"),
  mobileBackdrop: document.querySelector("#mobileBackdrop"),
  doneCount: document.querySelector("#doneCount"),
  doubtCount: document.querySelector("#doubtCount"),
  masteredCount: document.querySelector("#masteredCount"),
  quickActions: document.querySelector("#quickActions"),
  termCloud: document.querySelector("#termCloud"),
  weakList: document.querySelector("#weakList"),
  indexMode: document.querySelector("#indexMode"),
  reviewDialog: document.querySelector("#reviewDialog"),
  reviewScope: document.querySelector("#reviewScope"),
  reviewTitle: document.querySelector("#reviewTitle"),
  reviewCard: document.querySelector("#reviewCard"),
  reviewActions: document.querySelector("#reviewActions"),
  exportButton: document.querySelector("#exportButton"),
  importButton: document.querySelector("#importButton"),
  importFile: document.querySelector("#importFile"),
  resetButton: document.querySelector("#resetButton"),
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function sectionIndex(sectionId) {
  return app.sections.findIndex((section) => section.id === sectionId);
}

function siblingSections(sectionId) {
  const index = sectionIndex(sectionId);
  return {
    previous: index > 0 ? app.sections[index - 1] : null,
    next: index >= 0 && index < app.sections.length - 1 ? app.sections[index + 1] : null,
  };
}

function isWeakState(section) {
  const state = getSectionState(app.progress, section.id);
  return state === "pending" || state === "doubt";
}

function isVisibleInFilter(section) {
  const state = getSectionState(app.progress, section.id);
  if (app.navFilter === "all") return true;
  if (app.navFilter === "weak") return isWeakState(section) && section.content_status === "ready";
  if (app.navFilter === "pending") return state === "pending" && section.content_status === "ready";
  if (app.navFilter === "doubt") return state === "doubt";
  if (app.navFilter === "mastered") return state === "mastered";
  if (app.navFilter === "empty") return section.content_status !== "ready";
  return true;
}

function sectionText(section) {
  return section.blocks
    .map((block) => {
      if (block.type === "paragraph") return [block.term, block.text].filter(Boolean).join(" ");
      if (block.type === "heading") return [block.number, block.text].filter(Boolean).join(" ");
      if (block.type === "list") return block.items.join(" ");
      if (block.type === "table") return block.rows.flatMap((row) => row.map((cell) => cell.text)).join(" ");
      return "";
    })
    .join(" ");
}

function buildTermIndex(sections) {
  const stop = new Set([
    "del",
    "con",
    "para",
    "sobre",
    "vehiculo",
    "vehiculos",
    "circulacion",
    "conduccion",
  ]);
  const terms = new Map();
  for (const section of sections) {
    const directTerms = section.blocks.filter((block) => block.term).map((block) => block.term);
    const headingTerms = section.blocks
      .filter((block) => block.type === "heading")
      .map((block) => block.text);
    for (const raw of [...directTerms, ...headingTerms]) {
      const label = raw.trim();
      const key = label.toLowerCase();
      if (label.length < 4 || stop.has(key)) continue;
      if (!terms.has(key)) terms.set(key, { label, count: 0, sections: new Set() });
      terms.get(key).count += 1;
      terms.get(key).sections.add(section.id);
    }
  }
  return [...terms.values()]
    .map((item) => ({ ...item, sectionCount: item.sections.size }))
    .sort((a, b) => b.sectionCount - a.sectionCount || b.count - a.count)
    .slice(0, 18);
}

function visibleChildSections(section) {
  return app.sections.filter(
    (candidate) =>
      candidate.chapterId === section.chapterId &&
      candidate.source_sp.startsWith(`${section.source_sp}.`) &&
      candidate.id !== section.id,
  );
}

function updateProgressCounts() {
  const counts = progressCounts(app.progress);
  els.doneCount.textContent = counts.read;
  els.doubtCount.textContent = counts.doubt;
  els.masteredCount.textContent = counts.mastered;
}

function renderNavigation() {
  if (app.navFilter === "all" && !app.focusTerm) {
    els.indexMode.innerHTML = `
      <div class="index-mode-card">
        <strong>Secuencia del manual</strong>
        <span>Orden original, sin atajos.</span>
      </div>
    `;
    els.chapterList.innerHTML = app.manual.chapters
      .map((chapter) => renderChapterGroup(chapter, chapter.sections))
      .join("");
    return;
  }

  const visible = app.sections.filter(isVisibleInFilter).filter(matchesFocusTerm);
  const label = app.focusTerm
    ? `Termino: ${app.focusTerm}`
    : `Vista: ${filterLabel(app.navFilter)}`;
  els.indexMode.innerHTML = `
    <div class="index-mode-card filtered">
      <div>
        <strong>${escapeHtml(label)}</strong>
        <span>${visible.length} secciones encontradas.</span>
      </div>
      <button data-reset-index type="button">Volver al manual</button>
    </div>
  `;
  els.chapterList.innerHTML = `
    <section class="chapter-group">
      <h2>Atajos de estudio</h2>
      <div class="section-links">
        ${visible.map(renderSectionLink).join("") || `<p class="quiet">Sin secciones para este corte.</p>`}
      </div>
    </section>
  `;
}

function filterLabel(filter) {
  const labels = {
    all: "Todo",
    weak: "Puntos flojos",
    pending: "Pendientes",
    doubt: "Dudas",
    mastered: "Dominadas",
    empty: "Huecos",
  };
  return labels[filter] || filter;
}

function matchesFocusTerm(section) {
  if (!app.focusTerm) return true;
  return `${section.title} ${section.chapterTitle} ${sectionText(section)}`
    .toLowerCase()
    .includes(app.focusTerm.toLowerCase());
}

function renderSectionLink(section) {
  const state = getSectionState(app.progress, section.id);
  const active = app.activeSection?.id === section.id ? "active" : "";
  return `
    <button class="section-link ${active}" data-section-id="${section.id}" type="button">
      <span class="section-link-title">${escapeHtml(section.title)}</span>
      <span class="section-link-meta">
        <span>${escapeHtml(section.source_sp)}</span>
        <span class="dot ${section.content_status}"></span>
        <span>${escapeHtml(PROGRESS_LABELS[state])}</span>
      </span>
    </button>
  `;
}

function renderChapterGroup(chapter, sections) {
  return `
    <section class="chapter-group">
      <h2>${escapeHtml(chapter.title)}</h2>
      <div class="section-links">${sections.map(renderSectionLink).join("")}</div>
    </section>
  `;
}

function renderStudyTools() {
  const filters = [
    ["all", "Todo"],
    ["weak", "Flojos"],
    ["pending", "Pendientes"],
    ["doubt", "Dudas"],
    ["mastered", "Dominadas"],
    ["empty", "Huecos"],
  ];
  els.quickActions.innerHTML = filters
    .map(
      ([value, label]) => `
        <button class="${app.navFilter === value && !app.focusTerm ? "selected" : ""}" data-filter="${value}" type="button">
          ${escapeHtml(label)}
        </button>
      `,
    )
    .join("");

  els.termCloud.innerHTML = app.termIndex
    .map(
      (term) => `
        <button class="${app.focusTerm === term.label ? "selected" : ""}" data-term="${escapeHtml(term.label)}" type="button">
          ${escapeHtml(term.label)}
          <span>${term.sectionCount}</span>
        </button>
      `,
    )
    .join("");

  const weak = app.sections
    .filter((section) => section.content_status === "ready")
    .filter(isWeakState)
    .sort((a, b) => {
      const aState = getSectionState(app.progress, a.id);
      const bState = getSectionState(app.progress, b.id);
      if (aState === "doubt" && bState !== "doubt") return -1;
      if (aState !== "doubt" && bState === "doubt") return 1;
      return b.blocks.length - a.blocks.length;
    })
    .slice(0, 8);

  els.weakList.innerHTML = weak.length
    ? weak
        .map(
          (section) => `
            <button data-section-id="${section.id}" type="button">
              <strong>${escapeHtml(section.title)}</strong>
              <span>${escapeHtml(PROGRESS_LABELS[getSectionState(app.progress, section.id)])} · ${section.blocks.length} bloques</span>
            </button>
          `,
        )
        .join("")
    : `<p class="quiet">Nada marcado. Sospechosamente limpio.</p>`;
}

function cardWeakness(card) {
  const stat = app.reviewStats[card.id];
  if (!stat) return 1;
  return (stat.missed || 0) * 4 + (stat.doubt || 0) * 2 - (stat.known || 0);
}

function renderImage(image) {
  return `
    <figure class="image-block">
      <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || "")}" loading="lazy">
    </figure>
  `;
}

function renderBlock(block) {
  if (block.type === "paragraph") {
    if (TRASH_TEXT.has(block.text)) return "";
    if (block.term) {
      return `
        <section class="definition-block" id="${escapeHtml(block.id)}">
          <h3>${escapeHtml(block.term)}</h3>
          <p>${escapeHtml(block.text)}</p>
        </section>
      `;
    }
    return `<p class="copy-block" id="${escapeHtml(block.id)}">${escapeHtml(block.text)}</p>`;
  }

  if (block.type === "heading") {
    const tag = block.level >= 4 ? "h4" : "h3";
    return `
      <${tag} class="inline-heading" id="${escapeHtml(block.id)}">
        ${block.number ? `<span>${escapeHtml(block.number)}</span>` : ""}
        ${escapeHtml(block.text)}
      </${tag}>
    `;
  }

  if (block.type === "image") {
    return renderImage(block);
  }

  if (block.type === "image_group") {
    return `
      <div class="image-grid ${block.images.length === 1 ? "single" : ""}" id="${escapeHtml(block.id)}">
        ${block.images.map(renderImage).join("")}
      </div>
    `;
  }

  if (block.type === "list") {
    const tag = block.ordered ? "ol" : "ul";
    return `
      <${tag} class="study-list" id="${escapeHtml(block.id)}">
        ${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </${tag}>
    `;
  }

  if (block.type === "table") {
    return `
      <div class="table-wrap" id="${escapeHtml(block.id)}">
        <table>
          <tbody>
            ${block.rows
              .map(
                (row) => `
                  <tr>
                    ${row
                      .map(
                        (cell) => `
                          <td>
                            ${cell.text ? `<span>${escapeHtml(cell.text)}</span>` : ""}
                            ${cell.images?.map(renderImage).join("") || ""}
                          </td>
                        `,
                      )
                      .join("")}
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  return "";
}

function renderEmptySection(section) {
  if (section.content_status === "container_only") {
    const children = visibleChildSections(section);
    return `
      <div class="source-note">
        <strong>Es un paraguas.</strong>
        <span>El contenido vive en sus apartados internos.</span>
      </div>
      <div class="child-jump-list">
        ${children
          .map(
            (child) => `
              <button type="button" data-section-id="${child.id}">
                <span>${escapeHtml(child.source_sp)}</span>
                ${escapeHtml(child.title)}
              </button>
            `,
          )
          .join("")}
      </div>
    `;
  }

  return `
    <div class="source-note danger">
      <strong>Aqui no hay chicha.</strong>
      <span>La fuente original lista esta seccion, pero no trae contenido util.</span>
    </div>
  `;
}

function renderStudyView(section) {
  const state = getSectionState(app.progress, section.id);
  const siblings = siblingSections(section.id);
  const body =
    section.blocks.length > 0
      ? section.blocks.map(renderBlock).join("")
      : renderEmptySection(section);

  els.studyView.innerHTML = `
    <header class="section-header">
      <div class="section-eyebrow">${escapeHtml(section.chapterTitle)}</div>
      <h1>${escapeHtml(section.title)}</h1>
      <div class="section-meta">
        <span>${escapeHtml(section.source_sp)}</span>
        <span>${escapeHtml(STATUS_LABELS[section.content_status])}</span>
        <span>${section.blocks.length} bloques</span>
      </div>
      <div class="progress-control" role="group" aria-label="Estado de estudio">
        ${Object.entries(PROGRESS_LABELS)
          .map(
            ([value, label]) => `
              <button class="${state === value ? "selected" : ""}" data-progress-state="${value}" type="button">
                ${escapeHtml(label)}
              </button>
            `,
          )
          .join("")}
      </div>
      <div class="section-tools">
        <button data-review-scope="section" type="button">Repasar terminos</button>
        <button data-review-scope="weak" type="button">Atacar puntos flojos</button>
      </div>
    </header>
    <div class="content-flow">${body}</div>
    <footer class="section-footer">
      <button ${siblings.previous ? "" : "disabled"} data-section-id="${siblings.previous?.id || ""}" type="button">Anterior</button>
      <button ${siblings.next ? "" : "disabled"} data-section-id="${siblings.next?.id || ""}" type="button">Siguiente</button>
    </footer>
  `;
}

function renderStudyRail(section) {
  const terms = section.blocks.filter((block) => block.term).slice(0, 8);
  const stats = buildStats(app.sections);
  const state = getSectionState(app.progress, section.id);
  const review = reviewSummary(app.reviewStats);
  const score = accuracy(review);
  els.studyRail.innerHTML = `
    <section class="rail-panel">
      <h2>Pulso</h2>
      <dl>
        <div><dt>Estado</dt><dd>${escapeHtml(PROGRESS_LABELS[state])}</dd></div>
        <div><dt>Bloques</dt><dd>${section.blocks.length}</dd></div>
        <div><dt>Dataset</dt><dd>${stats.ready}/${stats.sections}</dd></div>
      </dl>
    </section>
    <section class="rail-panel">
      <h2>Memoria</h2>
      <dl>
        <div><dt>Vistas</dt><dd>${review.seen}</dd></div>
        <div><dt>Sabidas</dt><dd>${review.known}</dd></div>
        <div><dt>Fallos</dt><dd>${review.missed}</dd></div>
        <div><dt>Acierto</dt><dd>${score}%</dd></div>
      </dl>
      <div class="rail-actions">
        <button data-review-scope="section" type="button">Repasar sección</button>
        <button data-review-scope="weak" type="button">Repasar flojos</button>
        <button data-review-scope="exam" type="button">Examen 20</button>
      </div>
    </section>
    <section class="rail-panel">
      <h2>Terminos</h2>
      ${
        terms.length
          ? `<div class="term-stack">${terms
              .map((block) => `<a href="#${escapeHtml(block.id)}">${escapeHtml(block.term)}</a>`)
              .join("")}</div>`
          : `<p class="quiet">Sin definiciones directas.</p>`
      }
    </section>
  `;
}

function reviewTitleForScope(scope) {
  if (scope === "exam") return "Examen 20";
  if (scope === "weak") return "Puntos flojos";
  if (scope === "all") return "Todo el manual";
  return app.activeSection?.title || "Seccion";
}

function sectionsForReview(scope) {
  if (scope === "weak") {
    return app.sections.filter((section) => section.content_status === "ready").filter(isWeakState);
  }
  if (scope === "all") {
    return app.sections.filter((section) => section.content_status === "ready");
  }
  if (scope === "exam") {
    return app.sections.filter((section) => section.content_status === "ready");
  }
  return app.activeSection ? [app.activeSection] : [];
}

function startReview(scope) {
  const sections = sectionsForReview(scope);
  let queue = scope === "section" ? cardsFromSection(app.activeSection) : cardsFromSections(sections);
  if (scope === "weak") {
    queue = queue.sort((a, b) => cardWeakness(b) - cardWeakness(a));
  }
  if (scope === "exam") {
    const weakCards = cardsFromSections(app.sections.filter((section) => section.content_status === "ready").filter(isWeakState));
    const pool = weakCards.length >= 8 ? weakCards : queue;
    queue = pool.sort((a, b) => cardWeakness(b) - cardWeakness(a)).slice(0, 20);
  }
  app.reviewScope = scope;
  app.reviewQueue = queue;
  app.reviewIndex = 0;
  app.reviewFlipped = false;
  app.reviewRound = { known: 0, doubt: 0, missed: 0 };
  renderReview();
  if (!els.reviewDialog.open) els.reviewDialog.showModal();
}

function currentCard() {
  return app.reviewQueue[app.reviewIndex] || null;
}

function renderReview() {
  const card = currentCard();
  els.reviewScope.textContent = `${app.reviewIndex + Math.min(app.reviewQueue.length, 1)} / ${app.reviewQueue.length}`;
  els.reviewTitle.textContent = reviewTitleForScope(app.reviewScope);

  if (!card) {
    els.reviewCard.innerHTML = `
      <div class="empty-review">
        <strong>Sin tarjetas útiles.</strong>
        <span>Esta selección no tiene definiciones directas todavía.</span>
      </div>
    `;
    els.reviewActions.innerHTML = `
      <button value="cancel" type="submit">Cerrar</button>
      <button data-review-scope="all" type="button">Repasar todo</button>
    `;
    return;
  }

  const stat = app.reviewStats[card.id];
  const roundTotal = app.reviewRound.known + app.reviewRound.doubt + app.reviewRound.missed;
  els.reviewCard.innerHTML = `
    <button class="flashcard ${app.reviewFlipped ? "flipped" : ""}" data-flip-card type="button">
      <span class="flashcard-meta">${escapeHtml(card.chapterTitle)} · ${escapeHtml(card.sourceSp)}</span>
      <strong>${escapeHtml(card.term)}</strong>
      <span>${app.reviewFlipped ? escapeHtml(card.answer) : "Toca para revelar la respuesta."}</span>
      ${
        stat?.lastOutcome
          ? `<small>Ultimo resultado: ${escapeHtml(stat.lastOutcome)}</small>`
          : `<small>Sin revisar.</small>`
      }
      ${app.reviewScope === "exam" ? `<small>Ronda: ${roundTotal}/${app.reviewQueue.length}</small>` : ""}
    </button>
  `;
  els.reviewActions.innerHTML = `
    <button data-review-result="missed" type="button">No</button>
    <button data-review-result="doubt" type="button">Duda</button>
    <button data-review-result="known" type="button">Lo sé</button>
  `;
}

function advanceReview(outcome) {
  const card = currentCard();
  if (!card) return;
  recordReview(app.reviewStats, card.id, outcome);
  app.reviewRound[outcome] += 1;
  if (outcome === "known" && getSectionState(app.progress, card.sectionId) === "pending") {
    setSectionState(app.progress, card.sectionId, "read");
  }
  if (outcome === "doubt" || outcome === "missed") {
    setSectionState(app.progress, card.sectionId, "doubt");
  }
  app.reviewIndex += 1;
  app.reviewFlipped = false;
  if (app.reviewIndex >= app.reviewQueue.length) {
    const roundAnswered = app.reviewRound.known + app.reviewRound.doubt + app.reviewRound.missed;
    const roundAccuracy = roundAnswered ? Math.round((app.reviewRound.known / roundAnswered) * 100) : 0;
    renderNavigation();
    renderStudyTools();
    renderStudyRail(app.activeSection);
    updateProgressCounts();
    els.reviewCard.innerHTML = `
      <div class="empty-review">
        <strong>Ronda cerrada.</strong>
        <span>Acierto ${roundAccuracy}% · ${app.reviewRound.known} bien · ${app.reviewRound.doubt} dudas · ${app.reviewRound.missed} no.</span>
      </div>
    `;
    els.reviewActions.innerHTML = `
      <button value="cancel" type="submit">Cerrar</button>
      <button data-review-scope="${escapeHtml(app.reviewScope)}" type="button">Otra vuelta</button>
    `;
    return;
  }
  renderReview();
  renderNavigation();
  renderStudyTools();
  renderStudyRail(app.activeSection);
  updateProgressCounts();
}

function exportStudyData() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    progress: app.progress,
    reviewStats: app.reviewStats,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `manual-b-progreso-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function importStudyData(file) {
  const data = JSON.parse(await file.text());
  app.progress = data.progress || {};
  app.reviewStats = data.reviewStats || {};
  saveProgress(app.progress);
  saveReviewStats(app.reviewStats);
  renderNavigation();
  renderStudyTools();
  renderStudyView(app.activeSection);
  renderStudyRail(app.activeSection);
  updateProgressCounts();
}

function resetStudyData() {
  const ok = window.confirm("Esto borra progreso y resultados locales. ¿Continuar?");
  if (!ok) return;
  app.progress = {};
  app.reviewStats = {};
  saveProgress(app.progress);
  saveReviewStats(app.reviewStats);
  renderNavigation();
  renderStudyTools();
  renderStudyView(app.activeSection);
  renderStudyRail(app.activeSection);
  updateProgressCounts();
}

function renderSearchFeedback(query, results) {
  const term = query.trim();
  els.searchFeedback.hidden = !term;
  if (!term) {
    els.searchFeedback.innerHTML = "";
    return;
  }

  const firstResult = results[0]?.section;
  els.searchFeedback.innerHTML = `
    <div>
      <strong>${results.length} coincidencias</strong>
      <span>${results.length ? `Indice filtrado por "${escapeHtml(term)}".` : "Prueba con otro termino."}</span>
    </div>
    <div class="search-feedback-actions">
      ${
        firstResult
          ? `<button data-section-id="${firstResult.id}" type="button">Ir a la primera</button>`
          : ""
      }
      <button data-clear-search type="button">Limpiar</button>
    </div>
  `;
}

function renderSearchResults(query, results = searchSections(app.sections, query)) {
  els.resultsPanel.hidden = !query.trim();
  els.searchResults.innerHTML = results.length
    ? results
        .map(
          ({ section, score }) => `
            <button class="result-link" data-section-id="${section.id}" type="button">
              <strong>${escapeHtml(section.title)}</strong>
              <span>${escapeHtml(section.chapterTitle)} · ${escapeHtml(section.source_sp)} · peso ${score}</span>
            </button>
          `,
        )
        .join("")
    : `<p class="quiet">Nada. Ese termino se hizo el sueco.</p>`;
}

function applySearchQuery(query) {
  const term = query.trim();
  app.navFilter = "all";
  app.focusTerm = term;
  const results = searchSections(app.sections, term);
  renderSearchFeedback(term, results);
  renderSearchResults(term, results);
  renderNavigation();
  renderStudyTools();
  return results;
}

function clearSearchDisplay() {
  els.searchInput.value = "";
  renderSearchFeedback("", []);
  renderSearchResults("", []);
}

function setActiveSection(sectionId) {
  const section = app.sections.find((item) => item.id === sectionId) || app.sections[0];
  app.activeSection = section;
  renderNavigation();
  renderStudyTools();
  renderStudyView(section);
  renderStudyRail(section);
  updateProgressCounts();
  els.previousButton.disabled = !siblingSections(section.id).previous;
  els.nextButton.disabled = !siblingSections(section.id).next;
  document.title = `${section.title} | Manual B`;
}

function closeMobileMenu() {
  els.sidebar.classList.remove("open");
  els.mobileBackdrop.hidden = true;
}

function wireEvents() {
  document.body.addEventListener("click", (event) => {
    const sectionButton = event.target.closest("[data-section-id]");
    if (sectionButton && sectionButton.dataset.sectionId) {
      goToSection(sectionButton.dataset.sectionId);
      closeMobileMenu();
      return;
    }

    const clearSearchButton = event.target.closest("[data-clear-search]");
    if (clearSearchButton) {
      els.searchInput.value = "";
      applySearchQuery("");
      return;
    }

    const progressButton = event.target.closest("[data-progress-state]");
    if (progressButton && app.activeSection) {
      setSectionState(app.progress, app.activeSection.id, progressButton.dataset.progressState);
      renderNavigation();
      renderStudyTools();
      renderStudyView(app.activeSection);
      renderStudyRail(app.activeSection);
      updateProgressCounts();
      return;
    }

    const filterButton = event.target.closest("[data-filter]");
    if (filterButton) {
      app.navFilter = filterButton.dataset.filter;
      app.focusTerm = "";
      clearSearchDisplay();
      renderNavigation();
      renderStudyTools();
      return;
    }

    const termButton = event.target.closest("[data-term]");
    if (termButton) {
      app.navFilter = "all";
      app.focusTerm = termButton.dataset.term;
      els.searchInput.value = app.focusTerm;
      applySearchQuery(app.focusTerm);
      return;
    }

    const resetIndexButton = event.target.closest("[data-reset-index]");
    if (resetIndexButton) {
      app.navFilter = "all";
      app.focusTerm = "";
      els.searchInput.value = "";
      applySearchQuery("");
      return;
    }

    const reviewButton = event.target.closest("[data-review-scope]");
    if (reviewButton) {
      startReview(reviewButton.dataset.reviewScope);
      return;
    }

    const flipButton = event.target.closest("[data-flip-card]");
    if (flipButton) {
      app.reviewFlipped = !app.reviewFlipped;
      renderReview();
      return;
    }

    const reviewResult = event.target.closest("[data-review-result]");
    if (reviewResult) {
      advanceReview(reviewResult.dataset.reviewResult);
      return;
    }
  });

  els.searchInput.addEventListener("input", (event) => {
    applySearchQuery(event.target.value);
  });

  els.searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const [first] = searchSections(app.sections, event.target.value);
    if (!first) return;
    event.preventDefault();
    goToSection(first.section.id);
    closeMobileMenu();
  });

  els.previousButton.addEventListener("click", () => {
    const previous = siblingSections(app.activeSection.id).previous;
    if (previous) goToSection(previous.id);
  });

  els.nextButton.addEventListener("click", () => {
    const next = siblingSections(app.activeSection.id).next;
    if (next) goToSection(next.id);
  });

  els.menuButton.addEventListener("click", () => {
    els.sidebar.classList.add("open");
    els.mobileBackdrop.hidden = false;
  });

  els.mobileBackdrop.addEventListener("click", closeMobileMenu);
  els.exportButton.addEventListener("click", exportStudyData);
  els.importButton.addEventListener("click", () => els.importFile.click());
  els.importFile.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) importStudyData(file);
    event.target.value = "";
  });
  els.resetButton.addEventListener("click", resetStudyData);

  onRouteChange(() => setActiveSection(currentSectionId(app.sections[0].id)));
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker
    .register(`./sw.js?v=${APP_VERSION}`)
    .then((registration) => registration.update())
    .catch(() => {});
}

async function boot() {
  try {
    app.manual = await loadManual();
    app.sections = flattenSections(app.manual);
    app.termIndex = buildTermIndex(app.sections);
    wireEvents();
    registerServiceWorker();
    setActiveSection(currentSectionId(app.sections[0].id));
  } catch (error) {
    els.studyView.innerHTML = `
      <div class="source-note danger">
        <strong>No carga.</strong>
        <span>${escapeHtml(error.message)}</span>
      </div>
    `;
  }
}

boot();
