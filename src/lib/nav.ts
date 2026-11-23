/** Is `href` the current page (or a parent of it)? */
export function isActive(href: string, pathname: string) {
  const clean = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);
  const h = clean(href);
  const p = clean(pathname);
  return h === '/' ? p === '/' : p === h || p.startsWith(`${h}/`);
}
