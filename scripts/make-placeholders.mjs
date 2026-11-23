#!/usr/bin/env node
/**
 * Generates the clearly-labelled placeholder photos in content/media/placeholders/.
 * They're flat "studio backdrop" still lifes in the brand palette, in the aspect
 * ratios the real photos will use, so layouts are tested at the right shapes.
 * Every use of them in /content must say `placeholder: true`; the production
 * build refuses to publish while any are referenced.
 *
 *   npm run placeholders
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(new URL('..', import.meta.url).pathname, 'content/media/placeholders');
mkdirSync(OUT, { recursive: true });

const C = { ink: '#2b2a33', cream: '#faf3e3', coral: '#d9654f', butter: '#f6de8d', rose: '#ebb5b0', sage: '#b9cdb0', sky: '#afcbdd', cork: '#c9a27a', manila: '#e8dcc0' };

const shots = [
  { file: 'founder-portrait.jpg', w: 1200, h: 1500, ratio: '4:5 portrait', label: 'Founder portrait, studio backdrop', bg: C.sky, floor: '#9dbbcf', scene: 'portrait' },
  { file: 'desk-flatlay.jpg', w: 1400, h: 1400, ratio: '1:1 square', label: 'Desk flat-lay: binder, notes, coffee', bg: C.manila, floor: C.manila, scene: 'flatlay' },
  { file: 'whiteboard-session.jpg', w: 1600, h: 1200, ratio: '4:3', label: 'Planning session at the whiteboard', bg: C.sage, floor: '#a6bd9c', scene: 'whiteboard' },
  { file: 'event-room.jpg', w: 1920, h: 1080, ratio: '16:9 wide', label: 'Event day: the room, mid-run', bg: C.rose, floor: '#dca29c', scene: 'event' },
  { file: 'hands-notes.jpg', w: 1200, h: 1600, ratio: '3:4 portrait', label: 'Close-up: hands sorting sticky notes', bg: C.butter, floor: '#eccf73', scene: 'notes' },
  { file: 'office-wide.jpg', w: 1800, h: 1200, ratio: '3:2 wide', label: 'The office, wide shot', bg: '#d8cbb0', floor: '#c7b796', scene: 'office' },
];

const shadow = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.ink}" opacity=".14"/>`;
const note = (x, y, s, fill, rot) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="${-s / 2 + 6}" y="${-s / 2 + 10}" width="${s}" height="${s}" fill="${C.ink}" opacity=".12" rx="4"/><rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" fill="${fill}" rx="4"/><path d="M${-s / 3} ${-s / 6}h${s * 0.6}M${-s / 3} 0h${s * 0.45}M${-s / 3} ${s / 6}h${s * 0.52}" stroke="${C.ink}" stroke-opacity=".35" stroke-width="${s / 26}" stroke-linecap="round"/></g>`;
const mug = (x, y, s) =>
  `${shadow(x, y + s * 0.55, s * 0.62, s * 0.12)}<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" rx="${s * 0.12}" fill="${C.cream}"/><path d="M${x + s / 2} ${y - s / 5}c${s * 0.38} 0 ${s * 0.38} ${s * 0.45} 0 ${s * 0.45}" fill="none" stroke="${C.cream}" stroke-width="${s * 0.11}"/><rect x="${x - s / 2}" y="${y - s / 8}" width="${s}" height="${s * 0.16}" fill="${C.coral}"/>`;
const binder = (x, y, w, h, fill) =>
  `${shadow(x + w / 2, y + h + 8, w * 0.56, 16)}<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${fill}"/><rect x="${x}" y="${y}" width="${w * 0.14}" height="${h}" rx="14" fill="${C.ink}" opacity=".18"/>${[0.25, 0.5, 0.75].map((t) => `<circle cx="${x + w * 0.07}" cy="${y + h * t}" r="${w * 0.03}" fill="${C.cream}"/>`).join('')}<rect x="${x + w}" y="${y + h * 0.15}" width="${w * 0.09}" height="${h * 0.12}" rx="6" fill="${C.coral}"/><rect x="${x + w}" y="${y + h * 0.33}" width="${w * 0.09}" height="${h * 0.12}" rx="6" fill="${C.butter}"/>`;

function scene(s) {
  const { w, h } = s;
  const floorY = h * 0.68;
  const base = `<rect width="${w}" height="${h}" fill="${s.bg}"/><rect y="${floorY}" width="${w}" height="${h - floorY}" fill="${s.floor}"/>`;
  switch (s.scene) {
    case 'portrait':
      return `${base}${shadow(w / 2, floorY + 40, w * 0.3, 40)}<rect x="${w * 0.27}" y="${h * 0.48}" width="${w * 0.46}" height="${h * 0.6}" rx="${w * 0.2}" fill="${C.ink}" opacity=".82"/><circle cx="${w / 2}" cy="${h * 0.36}" r="${w * 0.15}" fill="${C.cork}"/><path d="M${w * 0.35} ${h * 0.33}a${w * 0.15} ${w * 0.16} 0 0 1 ${w * 0.3} 0v-${h * 0.02}a${w * 0.15} ${w * 0.15} 0 0 0 -${w * 0.3} 0z" fill="${C.ink}"/><rect x="${w * 0.44}" y="${h * 0.52}" width="${w * 0.12}" height="${w * 0.12}" fill="${C.butter}" transform="rotate(-6 ${w / 2} ${h * 0.56})"/>`;
    case 'flatlay':
      return `<rect width="${w}" height="${h}" fill="${s.bg}"/>${binder(w * 0.1, h * 0.14, w * 0.42, h * 0.56, C.coral)}${mug(w * 0.75, h * 0.25, w * 0.15)}${note(w * 0.68, h * 0.62, w * 0.17, C.butter, -8)}${note(w * 0.82, h * 0.74, w * 0.14, C.rose, 7)}${note(w * 0.36, h * 0.84, w * 0.13, C.sage, 4)}<rect x="${w * 0.08}" y="${h * 0.82}" width="${w * 0.2}" height="${w * 0.018}" rx="6" fill="${C.ink}" transform="rotate(-12 ${w * 0.18} ${h * 0.83})"/>`;
    case 'whiteboard':
      return `${base}${shadow(w / 2, floorY + 30, w * 0.38, 30)}<rect x="${w * 0.14}" y="${h * 0.1}" width="${w * 0.72}" height="${h * 0.52}" rx="22" fill="${C.cream}" stroke="#d8ccb0" stroke-width="18"/><path d="M${w * 0.22} ${h * 0.24}h${w * 0.3}M${w * 0.22} ${h * 0.33}h${w * 0.22}M${w * 0.22} ${h * 0.42}h${w * 0.27}" stroke="${C.ink}" stroke-opacity=".55" stroke-width="12" stroke-linecap="round"/><path d="M${w * 0.58} ${h * 0.44}c${w * 0.04} -${h * 0.12} ${w * 0.14} -${h * 0.14} ${w * 0.18} -${h * 0.04}" fill="none" stroke="${C.coral}" stroke-width="10" stroke-linecap="round"/>${note(w * 0.66, h * 0.24, w * 0.08, C.butter, 5)}${note(w * 0.76, h * 0.3, w * 0.07, C.sky, -6)}`;
    case 'event':
      return `${base}${[0.18, 0.4, 0.62, 0.84].map((t, i) => `${shadow(w * t, floorY + 70, w * 0.08, 18)}<rect x="${w * t - w * 0.07}" y="${floorY - 10}" width="${w * 0.14}" height="${h * 0.12}" rx="16" fill="${C.cream}"/><circle cx="${w * t}" cy="${floorY - 40}" r="22" fill="${[C.butter, C.sage, C.sky, C.coral][i]}"/>`).join('')}<rect x="${w * 0.3}" y="${h * 0.1}" width="${w * 0.4}" height="${h * 0.3}" rx="16" fill="${C.cream}" opacity=".9"/><path d="M${w * 0.36} ${h * 0.25}h${w * 0.28}" stroke="${C.ink}" stroke-opacity=".5" stroke-width="16" stroke-linecap="round"/>${[0.08, 0.22, 0.78, 0.92].map((t, i) => `<path d="M${w * t} 0v${h * 0.08}" stroke="${C.ink}" stroke-opacity=".25" stroke-width="3"/><path d="M${w * t - 26} ${h * 0.08}h52l-26 40z" fill="${[C.coral, C.butter, C.sage, C.sky][i]}"/>`).join('')}`;
    case 'notes':
      return `<rect width="${w}" height="${h}" fill="${s.bg}"/>${note(w * 0.35, h * 0.3, w * 0.34, C.rose, -9)}${note(w * 0.66, h * 0.42, w * 0.3, C.sky, 6)}${note(w * 0.42, h * 0.66, w * 0.32, C.sage, -3)}<path d="M${w * 0.72} ${h * 1.02}c-${w * 0.03} -${h * 0.18} ${w * 0.02} -${h * 0.3} ${w * 0.12} -${h * 0.34}l${w * 0.16} ${h * 0.04}v${h * 0.3}z" fill="${C.cork}"/>`;
    default:
      return `${base}${binder(w * 0.08, floorY - h * 0.36, w * 0.16, h * 0.36, C.sage)}${binder(w * 0.27, floorY - h * 0.33, w * 0.15, h * 0.33, C.coral)}<rect x="${w * 0.5}" y="${floorY - h * 0.03}" width="${w * 0.42}" height="${h * 0.04}" rx="8" fill="${C.ink}" opacity=".75"/><rect x="${w * 0.55}" y="${floorY}" width="${w * 0.02}" height="${h * 0.3}" fill="${C.ink}" opacity=".6"/><rect x="${w * 0.86}" y="${floorY}" width="${w * 0.02}" height="${h * 0.3}" fill="${C.ink}" opacity=".6"/>${mug(w * 0.62, floorY - h * 0.08, w * 0.06)}<rect x="${w * 0.52}" y="${h * 0.12}" width="${w * 0.38}" height="${h * 0.32}" rx="14" fill="${C.cork}"/>${note(w * 0.6, h * 0.24, w * 0.07, C.butter, -5)}${note(w * 0.72, h * 0.3, w * 0.07, C.rose, 4)}${note(w * 0.83, h * 0.22, w * 0.06, C.sky, -2)}`;
  }
}

function label(s) {
  const { w, h } = s;
  const fs = Math.round(Math.min(w, h) * 0.034);
  const pad = fs * 0.9;
  const tagW = fs * 14.5;
  return `<g font-family="DejaVu Sans, Arial, sans-serif" fill="${C.ink}">
    <rect x="${pad}" y="${pad}" width="${tagW}" height="${fs * 2.1}" rx="${fs}" fill="${C.cream}" stroke="${C.ink}" stroke-width="3" stroke-dasharray="10 8"/>
    <text x="${pad + fs * 0.9}" y="${pad + fs * 1.42}" font-size="${fs}" font-weight="700" letter-spacing="1">PLACEHOLDER PHOTO</text>
    <rect x="${pad}" y="${h - pad - fs * 3.6}" width="${Math.min(w - pad * 2, fs * 23)}" height="${fs * 3.6}" rx="${fs * 0.6}" fill="${C.cream}" opacity=".92"/>
    <text x="${pad + fs * 0.8}" y="${h - pad - fs * 2.2}" font-size="${fs * 0.95}" font-weight="700">${s.label}</text>
    <text x="${pad + fs * 0.8}" y="${h - pad - fs * 0.85}" font-size="${fs * 0.8}" opacity=".75">${s.ratio}. Swap for the real photo.</text>
  </g>`;
}

for (const s of shots) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s.w}" height="${s.h}" viewBox="0 0 ${s.w} ${s.h}">${scene(s)}${label(s)}</svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(join(OUT, s.file));
  console.log('made', s.file, `${s.w}x${s.h}`);
}
