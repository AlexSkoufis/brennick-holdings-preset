import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { leadership } from '../data/site';
import { Img } from '../components/Img';
import { gsap, useGSAP, wireReveals, MOTION_OK, DESKTOP } from '../animations/gsap';

export function Leadership() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const mm = wireReveals(el);
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        // The portrait drifts inside its frame while the bronze offset
        // frame stays put, so the two separate slightly as you read.
        const st = { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true };
        gsap.fromTo('.leadership__frame img', { yPercent: -4, scale: 1.1 }, { yPercent: 4, scale: 1.1, ease: 'none', scrollTrigger: st });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="leadership" ref={root} className="section leadership" tabIndex={-1} aria-labelledby="leadership-title">
      <div className="wrap leadership__grid">
        <figure className="leadership__figure">
          <div className="leadership__offset">
            <div className="leadership__frame" data-reveal="media">
              <Img src={leadership.portrait.key} alt={leadership.portrait.alt} sizes="(min-width: 64rem) 30vw, (min-width: 30rem) 30rem, 100vw" />
            </div>
          </div>
          <figcaption className="caption" style={{ marginTop: '1.25rem' }}>
            {leadership.name}. {leadership.caption}
          </figcaption>
        </figure>

        <div style={{ display: 'grid', gap: 'clamp(1.75rem, 3vw, 2.75rem)', minWidth: 0 }}>
          <p className="label kicker" data-reveal="up">
            {leadership.kicker}
          </p>
          <h2 id="leadership-title" className="display leadership__name" data-reveal="words">
            {leadership.nameHtml[0]} <em>{leadership.nameHtml[1]}</em>
          </h2>
          <p className="leadership__deck" data-reveal="up">
            {leadership.deck}
          </p>
          <hr className="rule" data-reveal="line" />

          <div className="leadership__body">
            <div className="prose span-2 leadership__lead" data-reveal="up">
              <p style={{ fontSize: 'clamp(1.15rem, 1.05rem + 0.35vw, 1.35rem)', maxWidth: '44rem' }}>{leadership.paragraphs[0]}</p>
            </div>
            <div className="prose" data-reveal="up">
              <p>{leadership.paragraphs[1]}</p>
            </div>
            <div className="prose" data-reveal="up">
              <p>{leadership.paragraphs[2]}</p>
            </div>

            <dl className="leadership__focus span-2" data-reveal="stagger">
              {leadership.focus.map((f) => (
                <div key={f.label}>
                  <dt className="label">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>

            <div data-reveal="up">
              <p className="label" style={{ color: 'var(--bronze-ink)', margin: 0 }}>
                {leadership.linksLabel}
              </p>
              <ul className="leadership__links">
                {leadership.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="link-line">
                      {l.label}
                      <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="leadership__event" data-reveal="up" aria-labelledby="event-title">
              <p className="label" style={{ color: 'var(--bronze-ink)', margin: 0 }}>
                {leadership.event.label}
              </p>
              <h3 id="event-title" className="display d-sm">
                {leadership.event.title}
              </h3>
              <p style={{ margin: 0, color: 'var(--ink-soft)' }}>{leadership.event.body}</p>
              <a className="link-line" href={leadership.event.href} style={{ justifySelf: 'start' }}>
                {leadership.event.linkLabel}
              </a>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
