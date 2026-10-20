import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { company, nav } from '../data/site';
import { gsap, useGSAP, prefersReducedMotion } from '../animations/gsap';
import { lockScroll, scrollToEl } from '../animations/smooth';
import { useActiveSection } from '../hooks/useActiveSection';
import { Monogram } from './Monogram';

const ids = nav.map((n) => n.id);

/** Smooth anchor navigation that also moves focus to the target section. */
export function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  scrollToEl(el);
  history.replaceState(null, '', id === 'top' ? location.pathname : `#${id}`);
  el.focus({ preventScroll: true });
}

export function onAnchorClick(e: MouseEvent<HTMLAnchorElement>, id: string) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  goTo(id);
}

export function Header() {
  const header = useRef<HTMLElement>(null);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ids);

  // Solid after the first scroll; hide while reading downward, return on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setSolid(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > window.innerHeight * 0.8);
        last = y;
      }
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', queue, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', queue);
    };
  }, []);

  // Entrance: the bar settles in with the opening sequence.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from('.site-header__inner > *', { y: -24, opacity: 0, duration: 1.2, stagger: 0.12, delay: 0.25, ease: 'expo.out', clearProps: 'all' });
    },
    { scope: header },
  );

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header ref={header} className={`site-header${solid ? ' is-solid' : ''}${hidden && !open ? ' is-hidden' : ''}`}>
        <div className="wrap site-header__inner">
          <a className="brand" href="#top" onClick={(e) => onAnchorClick(e, 'top')} aria-label={`${company.name}, back to top`}>
            <Monogram className="brand__mark" />
            <span className="brand__text">
              <span className="brand__name">{company.shortName}</span>
              <span className="brand__sub">Holding Company</span>
            </span>
          </a>

          <nav className="nav-desktop" aria-label="Primary">
            <ul>
              {nav.slice(0, -1).map((item) => (
                <li key={item.id}>
                  <a
                    className="nav-link"
                    href={`#${item.id}`}
                    aria-current={active === item.id ? 'true' : undefined}
                    onClick={(e) => onAnchorClick(e, item.id)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a className="btn btn--solid" href="#contact" onClick={(e) => onAnchorClick(e, 'contact')} aria-current={active === 'contact' ? 'true' : undefined}>
              Contact
              <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </nav>

          <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>
            Menu
            <span className="menu-toggle__icon">
              <Menu size={18} strokeWidth={1.5} aria-hidden="true" />
            </span>
          </button>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} active={active} />
    </>
  );
}

function MobileMenu({ open, onClose, active }: { open: boolean; onClose: () => void; active: string }) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const pending = useRef<string | null>(null);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  const finishClose = useCallback(() => {
    setMounted(false);
    lockScroll(false);
    const target = pending.current;
    pending.current = null;
    if (target) requestAnimationFrame(() => goTo(target));
    else document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus();
  }, []);

  // Open and close choreography.
  useGSAP(
    () => {
      const el = root.current;
      if (!el || !mounted) return;
      const reduce = prefersReducedMotion();
      if (open) {
        lockScroll(true);
        closeBtn.current?.focus();
        if (reduce) return;
        const tl = gsap.timeline();
        tl.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut', clearProps: 'clipPath' });
        tl.from(el.querySelectorAll('.mobile-menu__link'), { yPercent: 70, opacity: 0, duration: 1, stagger: 0.06, ease: 'expo.out', clearProps: 'all' }, 0.35);
        tl.from(el.querySelector('.mobile-menu__foot'), { opacity: 0, y: 16, duration: 0.8, clearProps: 'all' }, 0.6);
      } else {
        if (reduce) {
          finishClose();
          return;
        }
        gsap.to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7, ease: 'expo.inOut', onComplete: finishClose });
      }
    },
    { dependencies: [open, mounted], scope: root },
  );

  // Escape closes; Tab stays inside the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab' && root.current) {
        const items = [...root.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      ref={root}
      id="mobile-menu"
      className="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      hidden={!mounted}
    >
      <div className="wrap mobile-menu__top">
        <span className="brand">
          <Monogram className="brand__mark" />
          <span className="brand__text">
            <span className="brand__name">{company.shortName}</span>
            <span className="brand__sub" style={{ color: 'var(--bronze-light)' }}>
              Holding Company
            </span>
          </span>
        </span>
        <button ref={closeBtn} className="menu-toggle" type="button" onClick={onClose} style={{ display: 'inline-flex' }}>
          Close
          <span className="menu-toggle__icon" style={{ background: 'transparent', borderColor: 'var(--rule-dark)' }}>
            <X size={18} strokeWidth={1.5} aria-hidden="true" />
          </span>
        </button>
      </div>
      <nav className="wrap" aria-label="Mobile">
        <ul className="mobile-menu__list">
          {nav.map((item, i) => (
            <li key={item.id}>
              <a
                className="mobile-menu__link"
                href={`#${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  pending.current = item.id;
                  onClose();
                }}
              >
                <span className="label">{String(i + 1).padStart(2, '0')}</span>
                <span className={active === item.id ? 'serif-italic' : undefined}>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="wrap mobile-menu__foot">
        <span className="label" style={{ color: 'var(--bronze-light)' }}>
          Louisville headquarters
        </span>
        <span>
          {company.hq.line1}, {company.hq.line2}
        </span>
        <a href={company.phoneHref} className="link-line" style={{ justifySelf: 'start' }}>
          {company.phone}
        </a>
      </div>
    </div>
  );
}
