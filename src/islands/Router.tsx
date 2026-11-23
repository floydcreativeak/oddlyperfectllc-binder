/**
 * "Which One Are You?" Six sticky notes in the visitor's own words. Pick one
 * and a hand-drawn arrow pulls to the matching service card.
 * Without JS the notes render as a plain list of links (see RouterSection).
 */
import { useId, useRef, useState } from 'react';

export type RouterNote = {
  says: string;
  color: 'butter' | 'rose' | 'sage' | 'sky';
  target: { title: string; line: string; price?: string; href: string; cta: string; isCall?: boolean };
};

type Props = {
  notes: RouterNote[];
  instructions: string;
  resultPrefix: string;
};

export default function Router({ notes, instructions, resultPrefix }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const pick = (i: number) => {
    setActive(i);
    requestAnimationFrame(() => {
      const el = resultRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > window.innerHeight) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
      }
    });
  };
  const t = active === null ? null : notes[active].target;

  return (
    <div className="router">
      <p className="router__how hand" id={`${uid}-how`}>{instructions}</p>
      <ul className="router__notes" role="list" aria-describedby={`${uid}-how`}>
        {notes.map((n, i) => (
          <li key={i} style={{ ['--i' as string]: i }}>
            <button
              type="button"
              className={`router__note note note--${n.color}`}
              aria-pressed={active === i}
              aria-controls={`${uid}-result`}
              onClick={() => pick(i)}
            >
              <span className="hand">&ldquo;{n.says}&rdquo;</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="router__result" id={`${uid}-result`} ref={resultRef} aria-live="polite">
        {t && (
          <div className="router__card" key={active}>
            <svg className="router__arrow" viewBox="0 0 120 70" aria-hidden="true" focusable="false">
              <path d="M8 8c22 4 48 10 66 26 10 9 16 18 20 30" pathLength={1} />
              <path d="M80 56l14 10 6-16" pathLength={1} />
            </svg>
            <p className="kicker">{resultPrefix}</p>
            <h3 className="router__title">{t.title}</h3>
            <p className="router__line">{t.line}</p>
            {t.price && <p className="router__price">{t.price}</p>}
            <a className="btn" href={t.href}>{t.cta}</a>
          </div>
        )}
      </div>
    </div>
  );
}
