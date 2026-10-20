import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, Flip, SplitText, useGSAP);
gsap.defaults({ ease: 'expo.out', duration: 1.1 });
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, Flip, SplitText, useGSAP };

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const DESKTOP = '(min-width: 64rem)';

/** Reveal starts are clamped so triggers near the end of the page still fire. */
export const START = 'clamp(top 88%)';

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Split a heading into words and lift them in. Words only: the browser keeps
 * its own line breaking, there is no overflow mask that could clip ascenders
 * or descenders, and the split is reverted as soon as the tween completes.
 */
export function wordsIn(el: Element, vars: gsap.TweenVars = {}) {
  const split = SplitText.create(el, { type: 'words', wordsClass: 'split-word', aria: 'auto' });
  return gsap.from(split.words, {
    yPercent: 60,
    opacity: 0,
    rotate: 2,
    transformOrigin: '0% 100%',
    duration: 1.2,
    stagger: 0.05,
    ...vars,
    onComplete() {
      split.revert();
      (vars.onComplete as (() => void) | undefined)?.();
    },
  });
}

/**
 * Declarative reveals for everything under `scope`:
 *   data-reveal="up"       fade and rise
 *   data-reveal="words"    word by word heading
 *   data-reveal="media"    clip-path wipe with the inner image settling
 *   data-reveal="stagger"  children rise in sequence
 *   data-reveal="line"     hairline draws from the left
 *   data-reveal="fade"     plain fade
 *   data-parallax="12"     yPercent drift while scrolling (desktop only)
 * Call inside a gsap context (useGSAP) so it reverts on unmount.
 * Without JavaScript, or with reduced motion, nothing is ever hidden.
 */
export function wireReveals(scope: Element) {
  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, () => {
    let shown = 0;
    scope.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      const kind = el.dataset.reveal;
      // Elements already on screen play at once as a short sequence; a trigger
      // whose start clamps to 0 could otherwise wait for the first scroll.
      const inView = el.getBoundingClientRect().top < window.innerHeight;
      const delay = Number(el.dataset.delay ?? 0) + (inView ? 0.1 + Math.min(shown++, 6) * 0.08 : 0);
      const st = inView ? undefined : { trigger: el, start: START, once: true };
      if (kind === 'up') {
        gsap.from(el, { y: 40, opacity: 0, duration: 1.2, delay, scrollTrigger: st });
      } else if (kind === 'words') {
        const tween = wordsIn(el, { delay, paused: !inView });
        if (st) ScrollTrigger.create({ ...st, onEnter: () => void tween.play() });
      } else if (kind === 'media') {
        const img = el.querySelector('img');
        const tl = gsap.timeline({ delay, scrollTrigger: st });
        tl.fromTo(el, { clipPath: 'inset(14% 10% 14% 10%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', clearProps: 'clipPath' });
        if (img) tl.from(img, { scale: 1.2, duration: 1.9, ease: 'expo.out', clearProps: 'transform' }, 0);
      } else if (kind === 'stagger') {
        gsap.from(el.children, { y: 28, opacity: 0, duration: 1, stagger: 0.08, delay, scrollTrigger: st });
      } else if (kind === 'line') {
        gsap.from(el, { scaleX: 0, transformOrigin: '0 50%', duration: 1.6, ease: 'expo.inOut', delay, scrollTrigger: st });
      } else if (kind === 'fade') {
        gsap.from(el, { opacity: 0, duration: 1.4, delay, scrollTrigger: st });
      }
    });
  });
  mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
    scope.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const amount = Number(el.dataset.parallax || 10);
      gsap.fromTo(
        el,
        { yPercent: -amount / 2 },
        { yPercent: amount / 2, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    });
  });
  return mm;
}
