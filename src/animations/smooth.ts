import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

let lenis: Lenis | null = null;

/**
 * Smooth scrolling for fine pointers with motion allowed. Native scrolling
 * stays in charge everywhere else (touch, keyboard users, reduced motion).
 */
export function startSmoothScroll() {
  const ok = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches;
  if (!ok || lenis) return;
  lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, anchors: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

function tick(time: number) {
  lenis?.raf(time * 1000);
}

const headerOffset = () => (document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 76) + 8;

/** Scroll to a document position, smoothly when motion is allowed. */
export function scrollToY(y: number, immediate = false) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (lenis) lenis.scrollTo(y, { immediate: immediate || reduce, force: true, duration: 1.4 });
  else window.scrollTo({ top: y, behavior: immediate || reduce ? 'auto' : 'smooth' });
}

/** Scroll so that `el` sits just below the fixed header. */
export function scrollToEl(el: Element) {
  const y = el.id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - headerOffset();
  scrollToY(Math.max(0, y));
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
