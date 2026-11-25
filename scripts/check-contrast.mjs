// Verifies WCAG contrast for the brand palette pairings actually used in the UI.
// Run: node scripts/check-contrast.mjs
const hex = (h) => h.replace("#", "").match(/../g).map((x) => parseInt(x, 16) / 255);
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

const pairs = [
  // [foreground, background, usage, minimum]
  ["#FFFFFF", "#0F4C43", "white on teal", 4.5],
  ["#FFC857", "#0F4C43", "yellow on teal", 4.5],
  ["#FFFFFF", "#C44600", "white on orange-deep (buttons)", 4.5],
  ["#FFFFFF", "#A93C00", "white on orange-deep hover", 4.5],
  ["#C44600", "#FFF9F1", "orange-deep link on cream", 4.5],
  ["#C44600", "#FFFFFF", "orange-deep link on white", 4.5],
  ["#1F2937", "#FFF9F1", "charcoal on cream", 4.5],
  ["#1F2937", "#F2E8D9", "charcoal on beige", 4.5],
  ["#6B7280", "#FFF9F1", "grey on cream", 4.5],
  ["#6B7280", "#FFFFFF", "grey on white", 4.5],
  ["#565D6A", "#F2E8D9", "muted-strong on beige", 4.5],
  ["#A93C00", "#F2E8D9", "orange-deeper text on beige", 4.5],
  ["#A93C00", "#FFF0E5", "orange-deeper link in error summary", 4.5],
  ["#D7E4E1", "#0F4C43", "teal-muted text on teal", 4.5],
  ["#FFFFFF", "#FF6A00", "white on brand orange (NOT used)", 4.5],
];
let fail = 0;
for (const [fg, bg, label, min] of pairs) {
  const r = ratio(fg, bg);
  const ok = r >= min || label.includes("NOT used");
  if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)} : 1  ${label}`);
}
process.exit(fail ? 1 : 0);
