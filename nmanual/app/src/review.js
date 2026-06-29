const STORAGE_KEY = "nmanual.review.v1";

export function loadReviewStats() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveReviewStats(stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function recordReview(stats, cardId, outcome) {
  const current = stats[cardId] || { known: 0, doubt: 0, missed: 0, seen: 0 };
  current.seen += 1;
  current.lastOutcome = outcome;
  current.reviewedAt = new Date().toISOString();
  if (outcome === "known") current.known += 1;
  if (outcome === "doubt") current.doubt += 1;
  if (outcome === "missed") current.missed += 1;
  stats[cardId] = current;
  saveReviewStats(stats);
}

export function cardsFromSection(section) {
  return section.blocks
    .filter((block) => block.type === "paragraph" && block.term && block.text)
    .map((block) => ({
      id: block.id,
      term: block.term,
      answer: block.text,
      sectionId: section.id,
      sectionTitle: section.title,
      chapterTitle: section.chapterTitle,
      sourceSp: section.source_sp,
    }));
}

export function cardsFromSections(sections) {
  return sections.flatMap(cardsFromSection);
}

export function reviewSummary(stats) {
  return Object.values(stats).reduce(
    (summary, item) => {
      summary.seen += item.seen || 0;
      summary.known += item.known || 0;
      summary.doubt += item.doubt || 0;
      summary.missed += item.missed || 0;
      return summary;
    },
    { seen: 0, known: 0, doubt: 0, missed: 0 },
  );
}

export function accuracy(summary) {
  const answered = summary.known + summary.doubt + summary.missed;
  if (!answered) return 0;
  return Math.round((summary.known / answered) * 100);
}
