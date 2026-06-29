export async function loadManual() {
  const response = await fetch("../data/json/manual.json");
  if (!response.ok) {
    throw new Error(`No se pudo cargar manual.json (${response.status})`);
  }
  return response.json();
}

export function flattenSections(manual) {
  const sections = [];
  for (const chapter of manual.chapters) {
    for (const section of chapter.sections) {
      sections.push({
        ...section,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
      });
    }
  }
  return sections;
}

export function buildStats(sections) {
  return {
    sections: sections.length,
    ready: sections.filter((section) => section.content_status === "ready").length,
    containerOnly: sections.filter((section) => section.content_status === "container_only").length,
    emptySource: sections.filter((section) => section.content_status === "empty_source").length,
    blocks: sections.reduce((total, section) => total + section.blocks.length, 0),
  };
}
