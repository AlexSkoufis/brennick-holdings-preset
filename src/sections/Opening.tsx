import { useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { opening } from '../data/site';
import { Img } from '../components/Img';
import { PlatLines } from '../components/PlatLines';
import { Magnetic } from '../components/Magnetic';
import { onAnchorClick } from '../components/Header';
import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION_OK, DESKTOP } from '../animations/gsap';

export function Opening() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const html = document.documentElement;
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const title = el.querySelector('.opening__title')!;
        const frame = el.querySelector('.opening__frame')!;
        const img = frame.querySelector('img');
        const support = el.querySelectorAll('[data-intro="support"]');
        const draw = el.querySelectorAll('.opening__plat [data-draw]');
        let split: SplitText | null = null;

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
        tl.fromTo(draw, { strokeDasharray: '0 1' }, { strokeDasharray: '1 0', duration: 2.6, stagger: 0.06, ease: 'power2.inOut' }, 0)
          .fromTo(frame, { clipPath: 'inset(22% 26% 22% 26%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'expo.inOut' }, 0.15)
          .fromTo(img, { scale: 1.35 }, { scale: 1, duration: 2.4 }, 0.15)
          .fromTo(support, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.09 }, 0.9);

        // Measure words only after the fonts have loaded, so the split
        // matches the final line breaks. The split is reverted afterwards.
        // A stalled font load must never hold the page hidden.
        let cancelled = false;
        Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(() => {
          if (cancelled) return;
          split = SplitText.create(title, { type: 'words', wordsClass: 'split-word', aria: 'auto' });
          tl.fromTo(
            split.words,
            { yPercent: 70, opacity: 0, rotate: 3 },
            { yPercent: 0, opacity: 1, rotate: 0, duration: 1.4, stagger: 0.07, transformOrigin: '0% 100%' },
            0.3,
          );
          tl.eventCallback('onComplete', () => {
            split?.revert();
            split = null;
            gsap.set([frame, img, support], { clearProps: 'all' });
          });
          html.classList.remove('intro-pending');
          tl.play(0);
        });

        return () => {
          cancelled = true;
          split?.revert();
          html.classList.remove('intro-pending');
        };
      });

      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        // Layered parallax as the opening scrolls away.
        const st = { trigger: el, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('.opening__plat', { yPercent: 18, ease: 'none', scrollTrigger: st });
        gsap.to('.opening__frame img', { yPercent: 8, ease: 'none', scrollTrigger: st });
        gsap.to('.opening__copy', { yPercent: -6, ease: 'none', scrollTrigger: st });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        html.classList.remove('intro-pending');
      });

      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} className="opening" tabIndex={-1} aria-labelledby="opening-title">
      <div className="opening__plat" aria-hidden="true">
        <PlatLines />
      </div>

      <div className="wrap opening__grid">
        <div className="opening__copy">
          <p className="label kicker" data-intro="support">
            {opening.eyebrow}
          </p>
          <h1 id="opening-title" className="display d-hero opening__title" data-intro="title">
            A Legacy <em className="accent">Across</em> Generations.
          </h1>
          <p className="lede" data-intro="support">
            {opening.lede}
          </p>
          <div className="opening__actions" data-intro="support">
            <Magnetic>
              <a className="btn btn--solid" href="#heritage" onClick={(e) => onAnchorClick(e, 'heritage')}>
                Read the heritage
                <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn" href="#holdings" onClick={(e) => onAnchorClick(e, 'holdings')}>
                Our holdings
              </a>
            </Magnetic>
          </div>
        </div>

        <figure className="opening__figure" data-intro="figure">
          <div className="opening__frame">
            <Img src={opening.photo.key} alt={opening.photo.alt} sizes="(min-width: 64rem) 42vw, 100vw" priority position="50% 60%" />
            <span className="opening__stamp label">{opening.established}</span>
          </div>
          <figcaption className="caption" data-intro="support">
            {opening.photo.caption}
          </figcaption>
        </figure>
      </div>

      <div className="wrap" style={{ position: 'relative' }}>
        <dl className="opening__facts" data-intro="support">
          {opening.facts.map((f) => (
            <div className="opening__fact" key={f.label}>
              <dt className="visually-hidden">{f.label}</dt>
              <dd style={{ margin: 0, display: 'contents' }}>
                <strong>{f.value}</strong>
                <span>{f.label}</span>
              </dd>
            </div>
          ))}
        </dl>
        <a className="scroll-cue label" href="#heritage" onClick={(e) => onAnchorClick(e, 'heritage')} style={{ marginTop: '1.5rem' }} data-intro="support">
          <span className="scroll-cue__line" aria-hidden="true" />
          Scroll to the story
          <ArrowDown size={14} strokeWidth={1.5} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
