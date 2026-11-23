// Prints WCAG contrast ratios for the token pairings we rely on.
// Usage: node scripts/contrast.mjs   (exits 1 if any AA pairing fails)
const hex = (h) => h.replace('#', '').match(/../g).map((x) => parseInt(x, 16) / 255);
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const L = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const pairs = process.argv.slice(2).length ? [process.argv.slice(2)] : [];
for (const [a, b, min = 4.5] of pairs) console.log(a, b, ratio(a, b).toFixed(2), ratio(a, b) >= +min ? 'ok' : 'FAIL');
export default ratio;
