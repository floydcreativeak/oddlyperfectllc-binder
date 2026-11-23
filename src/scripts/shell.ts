/**
 * Shell behaviour, in plain JS (no framework cost on every page):
 *  - glass header hides on scroll down, returns on scroll up
 *  - theme toggle (remembers the choice)
 *  - footer easter egg
 * Listeners are attached once; per-page state refreshes on astro:page-load.
 */
const THEME_KEY = 'op-theme';
const root = document.documentElement;

/* ── Header hide/show ───────────────────────────────────────────────────── */
let lastY = window.scrollY;
let ticking = false;

function updateHeader() {
  ticking = false;
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const y = Math.max(0, window.scrollY);
  const delta = y - lastY;
  header.dataset.scrolled = String(y > 8);
  if (Math.abs(delta) < 6) return;
  const focusInside = header.contains(document.activeElement);
  const goingDown = delta > 0 && y > header.offsetHeight * 2;
  header.dataset.hidden = String(goingDown && !focusInside);
  lastY = y;
}

window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateHeader);
    }
  },
  { passive: true },
);

// Keyboard users tabbing into the header always see it.
document.addEventListener('focusin', (e) => {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (header && header.contains(e.target as Node)) header.dataset.hidden = 'false';
});

/* ── Theme toggle ───────────────────────────────────────────────────────── */
function syncToggle() {
  const dark = root.dataset.theme === 'dark';
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(dark));
    const tip = btn.querySelector('[data-theme-tip]');
    if (tip) tip.textContent = (dark ? btn.dataset.labelLight : btn.dataset.labelDark) ?? '';
  });
}

document.addEventListener('click', (e) => {
  const target = e.target as Element | null;

  const toggle = target?.closest('[data-theme-toggle]');
  if (toggle) {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = () => {
      root.dataset.theme = next;
      try { localStorage.setItem(THEME_KEY, next); } catch { /* private mode: fine */ }
      syncToggle();
    };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // "Lights out" as a view transition where supported.
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (doc.startViewTransition && !reduce) {
      root.dataset.themeSwitch = '';
      const t = doc.startViewTransition(apply) as { finished: Promise<void> };
      t.finished.finally(() => delete root.dataset.themeSwitch);
    } else apply();
    return;
  }

  const egg = target?.closest<HTMLButtonElement>('[data-egg]');
  if (egg) {
    const note = document.getElementById(egg.getAttribute('aria-controls') ?? '');
    const open = egg.getAttribute('aria-expanded') !== 'true';
    egg.setAttribute('aria-expanded', String(open));
    if (note) note.hidden = !open;
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll<HTMLButtonElement>('[data-egg][aria-expanded="true"]').forEach((b) => {
    b.setAttribute('aria-expanded', 'false');
    const note = document.getElementById(b.getAttribute('aria-controls') ?? '');
    if (note) note.hidden = true;
    b.focus();
  });
});

/* ── Per page ───────────────────────────────────────────────────────────── */
document.addEventListener('astro:page-load', () => {
  lastY = window.scrollY;
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (header) header.dataset.hidden = 'false';
  syncToggle();
});
