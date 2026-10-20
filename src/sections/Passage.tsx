import { useCallback, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { chapters, passageIntro, type Basis } from '../data/site';
import { Img, imgRatio } from '../components/Img';
import { gsap, ScrollTrigger, useGSAP, wireReveals, MOTION_OK } from '../animations/gsap';
import { scrollToY } from '../animations/smooth';
import { useMedia } from '../hooks/useMedia';

const BASIS_LABEL: Record<Basis, string> = {
  company: 'Family records',
  archive: 'Family archive',
  record: 'Public record',
};

/** Horizontal chronology only where there is room for it and motion is welcome. */
const HORIZONTAL = [
  '(min-width: 75rem) and (min-height: 43.75rem) and (prefers-reduced-motion: no-preference)',
  '(min-width: 64rem) and (min-height: 48rem) and (prefers-reduced-motion: no-preference)',
].join(', ');

export function Passage() {
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const horizontal = useMedia(HORIZONTAL);
  const [active, setActive] = useState(0);

  /** Document scroll position at which chapter i sits at the start of the track. */
  const chapterY = useCallback((i: number) => {
    const st = trigger.current;
    const el = root.current;
    if (!st || !el) return null;
    const track = el.querySelector<HTMLElement>('.passage__track')!;
    const chapter = track.children[i + 1] as HTMLElement | undefined; // child 0 is the rail
    if (!chapter) return null;
    const pad = parseFloat(getComputedStyle(track).paddingLeft);
    const distance = track.scrollWidth - track.parentElement!.clientWidth;
    const p = gsap.utils.clamp(0, 1, (chapter.offsetLeft - pad) / distance);
    return st.start + p * (st.end - st.start);
  }, []);

  const jumpTo = (i: number) => {
    const y = chapterY(i);
    if (y !== null) scrollToY(y + 2);
  };

  useGSAP(
    () => {
      const el = root.current!;
      const mm = wireReveals(el.querySelector('.passage__head')!);

      if (horizontal) {
        const pin = el.querySelector<HTMLElement>('.passage__pin')!;
        const viewport = el.querySelector<HTMLElement>('.passage__viewport')!;
        const track = el.querySelector<HTMLElement>('.passage__track')!;
        const items = gsap.utils.toArray<HTMLElement>('.chapter', el);
        const bar = el.querySelector('.passage__progress span');
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            pin: true,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate(self) {
              gsap.set(bar, { scaleX: self.progress });
              const x = self.progress * distance() + viewport.clientWidth * 0.45;
              const pad = parseFloat(getComputedStyle(track).paddingLeft);
              let idx = 0;
              items.forEach((c, i) => {
                if (c.offsetLeft - pad <= x) idx = i;
              });
              setActive((prev) => (prev === idx ? prev : idx));
            },
          },
        });
        trigger.current = scroll.scrollTrigger ?? null;

        items.forEach((chapter) => {
          const frame = chapter.querySelector('.chapter__frame');
          const img = frame?.querySelector('img');
          const ca = { containerAnimation: scroll, trigger: chapter, scrub: true };
          // Image wipes open from the leading edge as the chapter arrives.
          gsap.fromTo(frame, { clipPath: 'inset(0% 0% 0% 38%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { ...ca, start: 'left 95%', end: 'left 40%' } });
          if (img && chapter.querySelector(".chapter__frame--photo")) {
            gsap.fromTo(img, { xPercent: -6, scale: 1.14 }, { xPercent: 6, scale: 1.14, ease: 'none', scrollTrigger: { ...ca, start: 'left right', end: 'right left' } });
          }
          // Year and name glide in; they are never fully transparent.
          gsap.fromTo(
            chapter.querySelectorAll('.chapter__year, .chapter__name'),
            { x: 90, opacity: 0.25 },
            { x: 0, opacity: 1, ease: 'none', stagger: 0.05, scrollTrigger: { ...ca, start: 'left 100%', end: 'left 50%' } },
          );
        });

        // Keyboard users: bring a focused chapter into view.
        const onFocus = (e: FocusEvent) => {
          const chapter = (e.target as HTMLElement).closest('.chapter');
          const i = items.indexOf(chapter as HTMLElement);
          const y = i >= 0 ? chapterY(i) : null;
          if (y !== null) scrollToY(y + 2, true);
        };
        track.addEventListener('focusin', onFocus);

        return () => {
          track.removeEventListener('focusin', onFocus);
          trigger.current = null;
          mm.revert();
        };
      }

      // Vertical sequence: the rail draws itself and chapters arrive in turn.
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '.passage__rail span',
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.passage__track', start: 'top 70%', end: 'bottom 70%', scrub: true } },
        );
      });
      const mmTrack = wireReveals(el.querySelector('.passage__track')!);
      return () => {
        mmTrack.revert();
        mm.revert();
      };
    },
    { scope: root, dependencies: [horizontal], revertOnUpdate: true },
  );

  return (
    <section id="heritage" ref={root} className={`passage on-dark${horizontal ? ' is-horizontal' : ''}`} tabIndex={-1} aria-labelledby="passage-title">
      <div className="wrap passage__head">
        <h2 id="passage-title" className="display d-xl passage__title" data-reveal="words">
          The Passage <em>of Time</em>
        </h2>
        <p className="lede" data-reveal="up">
          {passageIntro.lede}
        </p>
        <p className="passage__candor" data-reveal="up">
          {passageIntro.candor}
        </p>
        <ul className="passage__legend" aria-label="How sources are labelled" data-reveal="up">
          {(Object.keys(BASIS_LABEL) as Basis[]).map((b) => (
            <li key={b} className={`basis basis--${b}`}>
              {BASIS_LABEL[b]}
            </li>
          ))}
        </ul>
      </div>

      <div className="passage__stage">
        <div className="passage__pin">
          <div className="wrap passage__index">
            <span className="label" style={{ color: 'var(--bronze-light)' }}>
              {String(active + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}
            </span>
            <nav aria-label="Chronology">
              <ol>
                {chapters.map((c, i) => (
                  <li key={c.id}>
                    <button type="button" aria-current={active === i ? 'true' : undefined} aria-label={`${c.year}, ${c.name}`} onClick={() => jumpTo(i)}>
                      {c.year}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
            <span className="passage__progress" aria-hidden="true">
              <span />
            </span>
          </div>

          <div className="passage__viewport">
            <ol className={`passage__track${horizontal ? '' : ' wrap'}`}>
              <li className="passage__rail" aria-hidden="true">
                <span />
              </li>
              {chapters.map((c) => (
                <li key={c.id} className="chapter" aria-labelledby={`ch-${c.id}`}>
                  <div className="chapter__meta" data-reveal={horizontal ? undefined : 'up'}>
                    <span className="label chapter__era">{c.era}</span>
                    <span className="chapter__year" aria-hidden="true">
                      {c.year}
                    </span>
                    <h3 id={`ch-${c.id}`} className="chapter__name">
                      <span className="visually-hidden">{c.year}: </span>
                      {c.name}
                    </h3>
                    <p className="chapter__title">{c.title}</p>
                  </div>

                  <figure className="chapter__figure">
                    <div
                      className={`chapter__frame chapter__frame--${c.image.kind}`}
                      data-reveal={horizontal ? undefined : 'media'}
                      style={{ '--ratio': imgRatio(c.image.key) } as CSSProperties}
                    >
                      <Img
                        src={c.image.key}
                        alt={c.image.alt}
                        sizes={c.image.kind === 'photo' ? '(min-width: 64rem) 36vw, (min-width: 48rem) 45vw, 100vw' : '(min-width: 48rem) 30vw, 80vw'}
                      />
                    </div>
                    <figcaption className="caption">{c.image.caption}</figcaption>
                  </figure>

                  <div className="chapter__body">
                    {c.body.map((p) => (
                      <p key={p.slice(0, 24)}>{p}</p>
                    ))}
                  </div>

                  <ul className="chapter__notes" aria-label="Sources">
                      {c.notes.map((n) => (
                        <li key={n.text}>
                          <span className={`basis basis--${n.basis}`}>{BASIS_LABEL[n.basis]}</span>
                          {n.href ? (
                            <a href={n.href} target="_blank" rel="noopener noreferrer" className="link-line">
                              {n.text}
                              <ArrowUpRight size={13} strokeWidth={1.5} aria-hidden="true" style={{ display: 'inline', marginLeft: 2 }} />
                              <span className="visually-hidden"> (opens in a new tab)</span>
                            </a>
                          ) : (
                            <span>{n.text}</span>
                          )}
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
