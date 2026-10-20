import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { holdings, holdingsIntro, type Holding } from '../data/site';
import { Img } from '../components/Img';
import { gsap, useGSAP, wireReveals, prefersReducedMotion } from '../animations/gsap';
import { useMedia } from '../hooks/useMedia';

export function Holdings() {
  const root = useRef<HTMLElement>(null);
  const desktop = useMedia('(min-width: 64rem)');

  useGSAP(
    () => {
      const mm = wireReveals(root.current!.querySelector('.holdings__intro')!);
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="holdings" ref={root} className="section holdings" tabIndex={-1} aria-labelledby="holdings-title">
      <div className="wrap">
        <div className="holdings__intro">
          <h2 id="holdings-title" className="display d-lg holdings__title" data-reveal="words">
            <span>Land.</span> <span>Energy.</span> <span>Enterprise.</span>
          </h2>
          <div style={{ display: 'grid', gap: '1.25rem' }} data-reveal="up">
            <p className="label kicker">Areas of activity</p>
            <p className="lede">
              {holdingsIntro.lede}
            </p>
            <p className="caption" style={{ margin: 0 }}>
              Photographs in this section are illustrative placeholders.
            </p>
          </div>
        </div>
        {desktop ? <SplitIndex /> : <Accordion />}
      </div>
    </section>
  );
}

/* Desktop: oversized index on the left, cinematic panel on the right. */
function SplitIndex() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const prev = useRef(0);
  const hoverTimer = useRef<number>(0);

  const select = (i: number) => {
    window.clearTimeout(hoverTimer.current);
    setActive(i);
  };

  useGSAP(
    () => {
      const el = root.current!;
      const tabs = el.querySelectorAll<HTMLElement>('.holding-tab');
      const indicator = el.querySelector<HTMLElement>('.holdings__indicator')!;
      const imgs = el.querySelectorAll<HTMLElement>('.holdings__media img');
      const panel = el.querySelectorAll<HTMLElement>('.holding-panel')[active];
      const tab = tabs[active];
      const reduce = prefersReducedMotion();
      const from = prev.current;
      prev.current = active;

      const pos = { top: tab.offsetTop, height: tab.offsetHeight };
      imgs.forEach((img, i) => gsap.set(img, { zIndex: i === active ? 2 : i === from ? 1 : 0, opacity: i === active || i === from ? 1 : 0 }));

      if (reduce || from === active) {
        gsap.set(indicator, pos);
        gsap.set(imgs[active], { clipPath: 'none', scale: 1 });
        return;
      }
      gsap.to(indicator, { ...pos, duration: 0.8, ease: 'expo.out' });
      gsap.fromTo(imgs[active], { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.18 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.2, ease: 'expo.inOut', overwrite: true });
      gsap.fromTo(imgs[from], { scale: 1 }, { scale: 1.06, duration: 1.2, ease: 'expo.inOut', overwrite: true });
      gsap.fromTo(panel.children, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: 'expo.out', clearProps: 'all' });
    },
    { scope: root, dependencies: [active] },
  );

  // Keep the indicator aligned when fonts or the viewport change row heights.
  useEffect(() => {
    const el = root.current!;
    const ro = new ResizeObserver(() => {
      const tab = el.querySelectorAll<HTMLElement>('.holding-tab')[prev.current];
      gsap.set(el.querySelector('.holdings__indicator'), { top: tab.offsetTop, height: tab.offsetHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = holdings.length;
    const next = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    select(next);
    root.current!.querySelectorAll<HTMLElement>('.holding-tab')[next].focus();
  };

  return (
    <div ref={root} className="holdings__split">
      <div className="holdings__list" role="tablist" aria-label="Areas of activity" aria-orientation="vertical">
        <span className="holdings__indicator" aria-hidden="true" />
        {holdings.map((h, i) => (
          <button
            key={h.id}
            id={`tab-${h.id}`}
            className="holding-tab"
            role="tab"
            type="button"
            aria-selected={active === i}
            aria-controls={`panel-${h.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={(e) => onKey(e, i)}
            onPointerEnter={(e) => {
              if (e.pointerType !== 'mouse') return;
              window.clearTimeout(hoverTimer.current);
              hoverTimer.current = window.setTimeout(() => setActive(i), 140);
            }}
            onPointerLeave={() => window.clearTimeout(hoverTimer.current)}
          >
            <span className="holding-tab__index">{h.index}</span>
            <span className="holding-tab__name">{h.name}</span>
            <ArrowRight className="holding-tab__arrow" size={22} strokeWidth={1.25} aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="holdings__panel">
        <div className="holdings__media">
          {holdings.map((h, i) => (
            <Img key={h.id} src={h.photo.key} alt={i === active ? h.photo.alt : ''} sizes="48vw" />
          ))}
        </div>
        <div className="holdings__copy">
          {holdings.map((h, i) => (
            <HoldingCopy key={h.id} h={h} hidden={i !== active} />
          ))}
        </div>
      </div>
    </div>
  );
}

function HoldingCopy({ h, hidden }: { h: Holding; hidden: boolean }) {
  return (
    <div id={`panel-${h.id}`} className="holding-panel" role="tabpanel" aria-labelledby={`tab-${h.id}`} hidden={hidden}>
      <p className="holding-panel__summary">{h.summary}</p>
      <ul>
        {h.detail.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <p className="caption" style={{ margin: 0 }}>
        {h.photo.caption}
      </p>
    </div>
  );
}

/* Mobile and tablet: an expandable visual list. Everything works without hover. */
function Accordion() {
  const [open, setOpen] = useState<Record<string, boolean>>({ [holdings[0].id]: true });
  const root = useRef<HTMLUListElement>(null);
  const opening = useRef<string | null>(null);

  useGSAP(
    () => {
      const id = opening.current;
      opening.current = null;
      if (!id || prefersReducedMotion()) return;
      const panel = root.current!.querySelector(`#acc-${id}`);
      if (!panel) return;
      gsap.fromTo(panel, { height: 0 }, { height: 'auto', duration: 0.7, ease: 'expo.out', clearProps: 'height' });
      gsap.fromTo(panel.querySelector('img'), { scale: 1.15 }, { scale: 1, duration: 1.2, ease: 'expo.out', clearProps: 'transform' });
    },
    { scope: root, dependencies: [open] },
  );

  const toggle = (id: string) => {
    if (!open[id]) {
      opening.current = id;
      setOpen((o) => ({ ...o, [id]: true }));
      return;
    }
    const panel = root.current!.querySelector(`#acc-${id}`);
    if (!panel || prefersReducedMotion()) {
      setOpen((o) => ({ ...o, [id]: false }));
      return;
    }
    gsap.to(panel, { height: 0, duration: 0.5, ease: 'expo.inOut', onComplete: () => setOpen((o) => ({ ...o, [id]: false })), clearProps: 'height' });
  };

  return (
    <ul ref={root} className="holdings__accordion">
      {holdings.map((h) => (
        <li key={h.id}>
          <h3 style={{ margin: 0 }}>
            <button className="acc-btn" type="button" aria-expanded={!!open[h.id]} aria-controls={`acc-${h.id}`} onClick={() => toggle(h.id)}>
              <span className="label" style={{ color: 'var(--bronze-ink)' }}>
                {h.index}
              </span>
              <span className="acc-btn__name">{h.name}</span>
              <span className="acc-btn__icon" aria-hidden="true">
                <Plus size={18} strokeWidth={1.5} />
              </span>
            </button>
          </h3>
          <div id={`acc-${h.id}`} className="acc-panel" hidden={!open[h.id]}>
            <div className="acc-panel__inner">
              <div className="acc-panel__media">
                <Img src={h.photo.key} alt={h.photo.alt} sizes="(min-width: 48rem) 90vw, 100vw" />
              </div>
              <p className="holding-panel__summary">{h.summary}</p>
              <ul className="holding-panel" style={{ display: 'grid', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
                {h.detail.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <p className="caption" style={{ margin: 0 }}>
                {h.photo.caption}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
