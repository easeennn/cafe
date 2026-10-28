'use client';
import { gsap, useGSAP, trig, motion, ScrollTrigger, isCoarse } from '@/lib/gsap';
import { typeIn } from '@/lib/type';

type Ref = React.RefObject<HTMLElement>;
type Extra = (r: HTMLElement, q: (s: string) => HTMLElement[]) => void;

/** Shared scene motion: [data-speed] parallax, [data-rise], [data-lines] mask reveals, [data-words] scrubbed words,
 *  [data-type] typewriter text that plays once when the element enters the viewport. */
export function useScene(root: Ref, extra?: Extra) {
  useGSAP(() => motion(() => {
    const r = root.current!;
    const q = gsap.utils.selector(r) as (s: string) => HTMLElement[];
    if (!isCoarse()) q('[data-speed]').forEach((el) => {
      const s = Number(el.dataset.speed);
      gsap.fromTo(el, { y: s }, { y: -s, ease: 'none', scrollTrigger: trig(r, { start: 'top bottom', end: 'bottom top', scrub: true }) });
    });
    q('[data-rise]').forEach((el) => gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: trig(el, { start: 'top 90%' }) }));
    q('[data-lines]').forEach((el) => gsap.from(el.querySelectorAll('.ml'), { yPercent: 110, duration: 1.1, stagger: 0.09, ease: 'power4.out', scrollTrigger: trig(el, { start: 'top 88%' }) }));
    q('[data-words]').forEach((el) => gsap.fromTo(el.querySelectorAll('.w'), { opacity: 0.18 }, { opacity: 1, stagger: 0.12, ease: 'none', scrollTrigger: trig(el, { start: 'top 85%', end: 'bottom 45%', scrub: true }) }));
    const typed = q('[data-type]').map((el) => {
      const t = typeIn(el);
      ScrollTrigger.create(trig(el, { start: 'top 92%', once: true, onEnter: () => t.play(0.1) }));
      return t;
    });
    const wipes = q('[data-wipe]');
    if (wipes.length) {
      gsap.set(wipes, { clipPath: 'inset(0 100% 0 0)', x: -18 });
      ScrollTrigger.batch(wipes, { start: 'top 99%', once: true, batchMax: 14, onEnter: (els) => {
        const go = (g: Element[], d: number) => g.length && gsap.to(g, { clipPath: 'inset(0 0% 0 0)', x: 0, duration: d, stagger: 0.08, ease: 'power3.out', clearProps: 'clipPath,transform' });
        go(els.filter((e) => (e as HTMLElement).dataset.wipe !== 'slow'), 1.2); go(els.filter((e) => (e as HTMLElement).dataset.wipe === 'slow'), 1.9);
      } });
    }
    extra?.(r, q);
    return () => typed.forEach((t) => t.restore());
  }), { scope: root });
}
