#!/usr/bin/env node
/**
 * CONTENT LINT: the bouncer at the door of the live site.
 *
 *   node scripts/content-lint.mjs                 # everyday check (placeholders = warnings)
 *   node scripts/content-lint.mjs --production    # deploy check (placeholders = errors)
 *   node scripts/content-lint.mjs --production --dist   # also scan the built HTML in dist/
 *
 * Always fails on:
 *   - leftover writing notes: TODO, TBD, FIXME, lorem ipsum, "your text here"
 *   - internal-only phrases from the planning packet (Part 2, §2.1 "Keep OFF")
 *   - emoji anywhere except a sticker's `emoji` field (sticker-emoji rule)
 *   - price shortcuts like {fee:xyz} that don't match a fee id
 *   - services whose pricingId isn't in pricing.yml, router targets that don't exist
 * In --production it also fails on:
 *   - any `placeholder: true` in /content
 *   - any placeholder photo still referenced
 *   - any element marked data-placeholder in the built site
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { parse } from 'yaml';

const ROOT = new URL('..', import.meta.url).pathname;
const args = new Set(process.argv.slice(2));
const PROD = args.has('--production');
const DIST = args.has('--dist');

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

function walk(dir, exts) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === 'node_modules' ? [] : walk(p, exts);
    return exts.includes(extname(name).toLowerCase()) ? [p] : [];
  });
}
const rel = (p) => relative(ROOT, p);

/* ── Rules ──────────────────────────────────────────────────────────────── */
const WRITING_NOTES = /\b(TODO|TBD|FIXME|XXX)\b|lorem ipsum|your text here|placeholder text/i;

// Internal-only material from the planning packet. Never on the site.
const KEEP_OFF = [
  /fit[- ]check/i, /warning signs/i, /capacity points?/i, /revenue targets?/i, /\breserves\b/i,
  /working notes/i, /pricing notes/i, /think with me/i, /target \d+ flex clients/i, /solo ceiling/i,
  /while solo/i, /cap(ping)? nonprofit/i, /\bKSRM\b/i, /automatic no/i, /acceptance test/i,
  /alaska (attorney|accountant)/i, /\baccountant\b/i, /interview questions/i,
  /threatens recurring[- ]client/i, /financial guardrails/i,
];

const EMOJI = /\p{Extended_Pictographic}/u;
// Typographic symbols that Unicode also tags as pictographic but are fine.
const EMOJI_OK = new Set(['©', '®', '™']);

const contentFiles = walk(join(ROOT, 'content'), ['.yml', '.yaml', '.md']);
const sourceFiles = walk(join(ROOT, 'src'), ['.astro', '.ts', '.tsx', '.css', '.mjs', '.js']);

/** Strip YAML/MD comments so editor guidance like "# TODO-free zone" doesn't trip us. */
const stripComments = (txt, ext) =>
  ext === '.md' ? txt.replace(/<!--[\s\S]*?-->/g, '') : txt.split('\n').map((l) => l.replace(/(^|\s)#.*$/, '')).join('\n');

/* ── Load structured content for cross-checks ───────────────────────────── */
const load = (p) => parse(readFileSync(join(ROOT, p), 'utf8'));
const frontmatter = (p) => {
  const m = readFileSync(p, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  return m ? parse(m[1]) ?? {} : {};
};
const isDraftFile = (p) => {
  if (!p.endsWith('.md')) return false;
  return frontmatter(p).draft === true;
};

let pricing = {};
try { pricing = load('content/pricing.yml'); } catch (e) { err('content/pricing.yml', `could not be read: ${e.message}`); }
const feeIds = new Set((pricing.fees ?? []).map((f) => f.id));
const pricedIds = new Set([...(pricing.partnerships ?? []), ...(pricing.projects ?? []), ...(pricing.events ?? [])].map((x) => x.id));

/* ── Scan content ───────────────────────────────────────────────────────── */
for (const file of contentFiles) {
  const name = rel(file);
  if (name.endsWith('README.md')) continue;
  const raw = readFileSync(file, 'utf8');
  const body = stripComments(raw, extname(file));
  const draftFile = isDraftFile(file);

  if (WRITING_NOTES.test(body)) err(name, `contains a writing note (${body.match(WRITING_NOTES)[0]}). Finish or delete it.`);

  if (!draftFile) {
    for (const re of KEEP_OFF) if (re.test(body)) err(name, `contains internal-only wording ("${body.match(re)[0]}"). That stays off the site.`);
  }

  // Sticker-emoji rule: emoji may only appear as the value of an `emoji:` key in stickers.yml.
  body.split('\n').forEach((line, i) => {
    const hits = [...line].filter((ch) => EMOJI.test(ch) && !EMOJI_OK.has(ch));
    if (!hits.length) return;
    const isStickerEmoji = name === 'content/stickers.yml' && /^\s*emoji:/.test(line);
    if (!isStickerEmoji) err(`${name}:${i + 1}`, `emoji "${hits.join('')}" outside a sticker. Emoji are only allowed as sticker artwork.`);
  });

  for (const m of body.matchAll(/\{fee:([a-z0-9-]+)\}/g)) {
    if (!feeIds.has(m[1])) err(name, `uses {fee:${m[1]}} but there's no fee with id "${m[1]}" in pricing.yml.`);
  }

  // Placeholders
  const placeholderLines = body.split('\n').filter((l) => /^\s*placeholder:\s*true\b/.test(l)).length;
  const placeholderPhotos = (body.match(/\/?content\/media\/placeholders\//g) ?? []).length;
  if (!draftFile && (placeholderLines || placeholderPhotos)) {
    const msg = `${placeholderLines + placeholderPhotos} placeholder(s) still switched on (real details or photos needed).`;
    PROD ? err(name, msg) : warn(name, msg);
  }
}

/* ── Cross-references ───────────────────────────────────────────────────── */
for (const file of walk(join(ROOT, 'content/services'), ['.md'])) {
  const fm = frontmatter(file);
  if (fm.pricingId && !pricedIds.has(fm.pricingId)) err(rel(file), `pricingId "${fm.pricingId}" isn't in pricing.yml.`);
}
try {
  const router = load('content/router.yml');
  const serviceIds = new Set(walk(join(ROOT, 'content/services'), ['.md']).map((f) => f.split('/').pop().replace(/\.md$/, '')));
  for (const n of router.notes ?? []) {
    if (!['events', 'blind-date'].includes(n.target) && !serviceIds.has(n.target))
      err('content/router.yml', `note "${n.says}" points at "${n.target}", which isn't a service.`);
  }
} catch (e) { err('content/router.yml', e.message); }

/* ── Scan source code: no copy or writing notes hiding in markup ────────── */
for (const file of sourceFiles) {
  const txt = readFileSync(file, 'utf8');
  if (/\b(TODO|FIXME|TBD)\b/.test(txt)) err(rel(file), 'contains a TODO/FIXME/TBD note.');
  if (/lorem ipsum/i.test(txt)) err(rel(file), 'contains lorem ipsum.');
  [...txt].forEach((ch) => { if (EMOJI.test(ch) && !EMOJI_OK.has(ch)) err(rel(file), `contains emoji "${ch}". Use a sticker asset instead.`); });
}

/* ── Scan the built site ────────────────────────────────────────────────── */
if (DIST) {
  const html = walk(join(ROOT, 'dist'), ['.html']);
  if (!html.length) err('dist', 'no built pages found. Run `npm run build` first.');
  for (const file of html) {
    const txt = readFileSync(file, 'utf8');
    const visible = txt.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
    if (/\{(fee|pct|areas)(:[a-z0-9-]+)?\}/.test(visible)) err(rel(file), 'shows an unfilled {shortcut}.');
    if (/\b(TODO|TBD|FIXME)\b|lorem ipsum/i.test(visible)) err(rel(file), 'shows a writing note.');
    for (const re of KEEP_OFF) if (re.test(visible.replace(/<[^>]+>/g, ' '))) err(rel(file), `shows internal-only wording (${re}).`);
    const ph = (txt.match(/data-placeholder/g) ?? []).length;
    if (ph) (PROD ? err : warn)(rel(file), `renders ${ph} placeholder element(s).`);
  }
}

/* ── Report ─────────────────────────────────────────────────────────────── */
const mode = PROD ? 'production' : 'everyday';
if (warnings.length) {
  console.log(`\nHeads up (${warnings.length}). These must be fixed before the live site will publish:`);
  for (const w of warnings) console.log(`  - ${w}`);
}
if (errors.length) {
  console.error(`\nContent lint (${mode}) found ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  x ${e}`);
  process.exit(1);
}
console.log(`\nContent lint (${mode}) passed. Tidy binder.`);
