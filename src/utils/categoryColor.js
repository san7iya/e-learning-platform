const TAG_COLORS = ["var(--moss)", "var(--coral)", "var(--sky)"];

// Deterministic hash so the same category string always maps to the same
// accent color everywhere it's rendered (hero, dashboard, catalog, tags) —
// categories are free-text from the DB, not a fixed enum, so we can't hardcode.
export function getCategoryColor(category) {
  const str = category || "uncategorized";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}
