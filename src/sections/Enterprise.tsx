import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Plus } from 'lucide-react';
import { companies, company, enterpriseIntro, enterpriseNote } from '../data/site';
import { Img } from '../components/Img';
import { Flip, gsap, useGSAP, wireReveals, prefersReducedMotion } from '../animations/gsap';

export function Enterprise() {
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const [open, setOpen] = useState<string | null>(companies[0].id);

  useGSAP(
    () => {
      const mm = wireReveals(root.current!);
      return () => mm.revert();
    },
    { scope: root },
  );

  const toggle = (id: string) => {
    const next = open === id ? null : id;
    if (prefersReducedMotion() || !list.current) {
      setOpen(next);
      return;
    }
    // Record every row, change the layout, then let Flip glide the rows from
    // where they were. Rows are opaque, so those below sweep across the
    // opening panel like a curtain while it reveals.
    const rows = list.current.querySelectorAll('.ent-row');
    const state = Flip.getState(rows);
    flushSync(() => setOpen(next));
    Flip.from(state, { duration: 0.9, ease: 'expo.inOut', simple: true });
    if (next) {
      const panel = list.current.querySelector(`#ent-${next}`);
      if (!panel) return;
      const tl = gsap.timeline();
      tl.fromTo(panel.querySelector('.ent-row__frame'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut', clearProps: 'clipPath' }, 0.1)
        .fromTo(panel.querySelector('.ent-row__frame img'), { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'expo.out', clearProps: 'transform' }, 0.1)
        .fromTo(panel.querySelectorAll('.ent-row__facts > div, .ent-row__body'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: 'expo.out', clearProps: 'all' }, 0.35);
    }
  };

  return (
    <section id="enterprise" ref={root} className="section enterprise on-dark" tabIndex={-1} aria-labelledby="enterprise-title">
      <div className="wrap enterprise__grid">
        <div className="enterprise__aside">
          <p className="label kicker" data-reveal="up">
            Subsidiary companies
          </p>
          <h2 id="enterprise-title" className="display d-lg" data-reveal="words">
            The Enterprise <em>Network</em>
          </h2>
          <p style={{ margin: 0, maxWidth: '30rem', color: 'var(--on-dark-soft)' }} data-reveal="up">
            {enterpriseIntro}
          </p>
          <p className="caption" style={{ margin: 0, maxWidth: '30rem' }} data-reveal="up">
            {enterpriseNote}
          </p>
        </div>

        <ol ref={list} className="enterprise__list" data-reveal="stagger">
          {companies.map((c, i) => {
            const isOpen = open === c.id;
            return (
              <li key={c.id} className="ent-row" style={{ background: 'var(--charcoal)' }}>
                <h3 style={{ margin: 0 }}>
                  <button className="ent-row__btn" type="button" aria-expanded={isOpen} aria-controls={`ent-${c.id}`} onClick={() => toggle(c.id)}>
                    <span className="label ent-row__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="ent-row__head">
                      <span className="ent-row__name">{c.name}</span>
                      <span className="label ent-row__state">
                        {c.state} <span aria-hidden="true">/</span> {c.category}
                      </span>
                    </span>
                    <span className="ent-row__icon" aria-hidden="true">
                      <Plus size={18} strokeWidth={1.5} />
                    </span>
                  </button>
                </h3>
                <div id={`ent-${c.id}`} className="ent-row__panel" hidden={!isOpen}>
                  <div className="ent-row__panel-inner">
                    <figure className="ent-row__media">
                      <div className="ent-row__frame">
                        <Img src={c.photo.key} alt={c.photo.alt} sizes="(min-width: 64rem) 28vw, (min-width: 48rem) 44vw, 100vw" />
                      </div>
                      <figcaption className="caption">{c.photo.caption}</figcaption>
                    </figure>
                    <div style={{ display: 'grid', gap: '1.25rem', alignContent: 'start' }}>
                      <dl className="ent-row__facts">
                        <div>
                          <dt className="label">Location</dt>
                          <dd>{c.region}</dd>
                        </div>
                        <div>
                          <dt className="label">Activity</dt>
                          <dd>{c.category}</dd>
                        </div>
                        <div>
                          <dt className="label">Ownership</dt>
                          <dd>Wholly owned by {company.name}, as the company states</dd>
                        </div>
                      </dl>
                      <p className="ent-row__body">{c.body}</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
