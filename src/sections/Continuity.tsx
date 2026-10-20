import { useRef } from 'react';
import { continuity } from '../data/site';
import { PlatLines } from '../components/PlatLines';
import { gsap, SplitText, useGSAP, MOTION_OK } from '../animations/gsap';

export function Continuity() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Restrained background transition as the interlude arrives.
        gsap.fromTo(el, { backgroundColor: '#e7e1d5' }, { backgroundColor: '#a88e65', ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 35%', scrub: true } });

        // Progressive emphasis: letters brighten in reading order with the
        // scroll. They start dim, never invisible, and finish fully opaque.
        const statement = el.querySelector('.continuity__statement')!;
        const split = SplitText.create(statement, { type: 'words,chars', wordsClass: 'split-word', aria: 'auto' });
        gsap.fromTo(split.chars, { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: true } });

        // Survey lines draw as the section passes.
        gsap.fromTo(el.querySelectorAll('[data-draw]'), { strokeDasharray: '0 1' }, { strokeDasharray: '1 0', ease: 'none', stagger: 0.04, scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 60%', scrub: true } });

        // The three words, each with its rule.
        const words = el.querySelectorAll('.continuity__word');
        const tl = gsap.timeline({ scrollTrigger: { trigger: el.querySelector('.continuity__words'), start: 'clamp(top 85%)', once: true } });
        tl.from(words, { y: 36, opacity: 0, duration: 1.2, stagger: 0.14, ease: 'expo.out' }).from(
          el.querySelectorAll('.continuity__line'),
          { scaleX: 0, duration: 1.4, stagger: 0.14, ease: 'expo.inOut' },
          0.2,
        );

        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="continuity" ref={root} className="section continuity" aria-labelledby="continuity-title">
      <div className="continuity__plat" aria-hidden="true">
        <PlatLines variant="b" />
      </div>
      <div className="wrap continuity__inner">
        <p className="label kicker" style={{ color: 'var(--forest)' }}>
          Interlude
        </p>
        <h2 id="continuity-title" className="display continuity__statement">
          <span className="line">{continuity.lines[0]}</span> <span className="line">{continuity.lines[1]}</span>
        </h2>
        <ol className="continuity__words">
          {continuity.words.map((w, i) => (
            <li key={w} className="continuity__word">
              <span className="label">{String(i + 1).padStart(2, '0')}</span>
              <span>{w}</span>
              <span className="continuity__line" aria-hidden="true" />
            </li>
          ))}
        </ol>
        <p className="caption continuity__note" style={{ margin: 0 }}>
          {continuity.note}
        </p>
      </div>
    </section>
  );
}
