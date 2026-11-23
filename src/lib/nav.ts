/**
 * Internal links. Content stores paths like "/pricing"; link() adds the site's
 * base path so the same content works at oddlyperfectllc.com/ and at a GitHub
 * Pages project address like username.github.io/repo-name/.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, ''); // "" or "/repo-name"

export function link(path: string) {
  if (!path.startsWith('/') || path.startsWith('//')) return path; // tel:, mailto:, https:, #hash
  if (BASE && (path === BASE || path.startsWith(`${BASE}/`))) return path;
  return `${BASE}${path}` || '/';
}

/** The current path with the base removed, e.g. "/pricing". */
export function pagePath(pathname: string) {
  const p = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  return p || '/';
}

/** Is `href` the current page (or a parent of it)? */
export function isActive(href: string, pathname: string) {
  const clean = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);
  const h = clean(href);
  const p = clean(pagePath(pathname));
  return h === '/' ? p === '/' : p === h || p.startsWith(`${h}/`);
}
