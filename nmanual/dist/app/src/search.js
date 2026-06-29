function blockText(block) {
  if (block.type === "paragraph") return [block.term, block.text].filter(Boolean).join(" ");
  if (block.type === "heading") return [block.number, block.text].filter(Boolean).join(" ");
  if (block.type === "list") return block.items.join(" ");
  if (block.type === "table") {
    return block.rows.flatMap((row) => row.map((cell) => cell.text)).join(" ");
  }
  if (block.type === "image_group") return block.caption || "";
  return block.alt || "";
}

export function searchSections(sections, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return sections
    .map((section) => {
      const titleScore = section.title.toLowerCase().includes(q) ? 4 : 0;
      const chapterScore = section.chapterTitle.toLowerCase().includes(q) ? 2 : 0;
      const body = section.blocks.map(blockText).join(" ").toLowerCase();
      const bodyScore = body.includes(q) ? 1 : 0;
      return { section, score: titleScore + chapterScore + bodyScore };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.section.order - b.section.order)
    .slice(0, 24);
}
