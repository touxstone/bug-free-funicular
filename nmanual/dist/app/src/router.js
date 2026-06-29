export function currentSectionId(fallbackId) {
  const hash = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
  return hash || fallbackId;
}

export function goToSection(sectionId) {
  location.hash = `/${encodeURIComponent(sectionId)}`;
}

export function onRouteChange(callback) {
  window.addEventListener("hashchange", callback);
}
