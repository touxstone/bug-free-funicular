const STORAGE_KEY = "nmanual.progress.v1";

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getSectionState(progress, sectionId) {
  return progress[sectionId] || "pending";
}

export function setSectionState(progress, sectionId, state) {
  progress[sectionId] = state;
  saveProgress(progress);
}

export function progressCounts(progress) {
  return Object.values(progress).reduce(
    (counts, state) => {
      if (state === "read") counts.read += 1;
      if (state === "doubt") counts.doubt += 1;
      if (state === "mastered") counts.mastered += 1;
      return counts;
    },
    { read: 0, doubt: 0, mastered: 0 },
  );
}
