/**
 * Emoji are only ever sticker artwork (sticker-emoji rule). They're drawn from
 * the bundled Noto Emoji set (Apache-2.0, via @iconify-json/noto) at build
 * time as inline SVG, so they look the same on every device.
 */
import icons from '@iconify-json/noto/icons.json';
import chars from '@iconify-json/noto/chars.json';

type IconSet = { icons: Record<string, { body: string; width?: number; height?: number }>; width?: number; height?: number };
const set = icons as unknown as IconSet;
const map = chars as Record<string, string>;

export function emojiSvg(emoji: string): string {
  const cp = [...emoji].map((c) => c.codePointAt(0)!.toString(16)).filter((h) => h !== 'fe0f').join('-');
  const name = map[cp] ?? map[`${cp}-fe0f`];
  const icon = name ? set.icons[name] : undefined;
  if (!icon) throw new Error(`Sticker emoji "${emoji}" isn't in the bundled Noto Emoji set.`);
  const w = icon.width ?? set.width ?? 128;
  const h = icon.height ?? set.height ?? 128;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" aria-hidden="true" focusable="false">${icon.body}</svg>`;
}
