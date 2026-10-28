'use client';
import { site } from '@/lib/site';
import { useRef } from 'react';
import { gsap, useGSAP, motion, ScrollTrigger, trig, toTop, smooth, isCoarse } from '@/lib/gsap';
import { products, favorites, gallery } from '@/lib/data';
import { Arrow, Bean, Clock, Eyebrow, Mask, Slot, Swash, Words } from './ui';
import Magnetic from './Magnetic';
import Receipt from './Receipt';
import { useScene } from './useScene';

const sec = 'relative w-full overflow-hidden';
const beans = [[8, 12, 34, 20], [24, 62, 26, -40], [46, 20, 38, 70], [64, 70, 30, 10], [78, 18, 28, -25], [90, 55, 40, 50]];
const floatBeans = (q: (s: string) => HTMLElement[], amp: number, rot: number) => {
  if (isCoarse()) return; // static beans on touch: nothing runs per frame
  q('.bean').forEach((b, i) => gsap.to(b, { y: i % 2 ? amp : -amp, rotate: `+=${i % 2 ? rot : -rot}`, duration: 7 + i, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
};

/* ───────── 03 FAVORITES ───────── */
// Photo gallery carousel: auto-advances one photo at a time with an eased snap, loops forever, and can be swiped / dragged
// (touch + mouse) — it snaps to the nearest photo on release. 4 identical sets keep the loop seamless in both directions.
function useCarousel(root: React.RefObject<HTMLElement>) {
  useGSAP(() => motion(() => {
    const r = root.current!;
    const q = gsap.utils.selector(r);
    const view = q('.fav-viewport')[0] as HTMLElement, track = q('.fav-track')[0] as HTMLElement, cards = q('.fav-card') as HTMLElement[];
    const count = cards.length / 4;
    const step = () => cards[1].offsetLeft - cards[0].offsetLeft;
    const total = () => count * step();
    const S = { p: total() }; // always normalised into [total, 2·total)
    const setX = gsap.quickSetter(track, 'x', 'px');
    const render = () => setX(-S.p);
    const wrap = () => { const t = total(); S.p = ((S.p % t) + t) % t + t; render(); };
    let on = false, dragging = false, last = step();
    let call: gsap.core.Tween | null = null, tween: gsap.core.Tween | null = null;
    const busy = () => !!tween && tween.isActive();
    const schedule = (dl: number) => { call?.kill(); call = gsap.delayedCall(dl, next); };
    function next() {
      if (!on || dragging) return;
      const s = step();
      tween = gsap.to(S, { p: (Math.round(S.p / s) + 1) * s, duration: 1.4, ease: 'expo.inOut', onUpdate: render, onComplete: () => { wrap(); schedule(1.5); } });
    }
    const st = ScrollTrigger.create({ trigger: r, start: 'top bottom', end: 'bottom top',
      onEnter: () => { on = true; if (!busy() && !dragging) schedule(0.5); }, onEnterBack: () => { on = true; if (!busy() && !dragging) schedule(0.5); },
      onLeave: () => { on = false; call?.kill(); }, onLeaveBack: () => { on = false; call?.kill(); } });
    render();

    // swipe / drag
    let id = -1, sx = 0, sp = 0, lx = 0, lt = 0, v = 0, moved = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; moved = false; id = e.pointerId; sx = lx = e.clientX; sp = S.p; lt = performance.now(); v = 0;
      tween?.kill(); call?.kill();
    };
    const move = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== id) return;
      const dx = e.clientX - sx;
      if (!moved) { if (Math.abs(dx) < 4) return; moved = true; try { view.setPointerCapture(id); } catch { /* noop */ } }
      S.p = sp - dx; wrap(); sp = S.p + dx; // keep the grab point stable across a wrap
      const now = performance.now(), dt = now - lt;
      if (dt > 0) v = 0.7 * v + 0.3 * ((lx - e.clientX) / dt);
      lx = e.clientX; lt = now;
    };
    const up = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== id) return;
      dragging = false;
      try { view.releasePointerCapture(id); } catch { /* noop */ }
      if (!moved) { if (on) schedule(0.6); return; }
      const s = step(), flick = gsap.utils.clamp(-1.6 * s, 1.6 * s, v * 320);
      tween = gsap.to(S, { p: Math.round((S.p + flick) / s) * s, duration: 1, ease: 'power4.out', onUpdate: render, onComplete: () => { wrap(); if (on) schedule(2.2); } });
    };
    view.addEventListener('pointerdown', down); view.addEventListener('pointermove', move);
    view.addEventListener('pointerup', up); view.addEventListener('pointercancel', up);
    const onResize = () => { const s = step(); S.p = (S.p / last) * s; last = s; render(); };
    window.addEventListener('resize', onResize);
    return () => {
      on = false; call?.kill(); tween?.kill(); st.kill(); window.removeEventListener('resize', onResize);
      view.removeEventListener('pointerdown', down); view.removeEventListener('pointermove', move); view.removeEventListener('pointerup', up); view.removeEventListener('pointercancel', up);
      gsap.set(track, { x: 0 });
    };
  }), { scope: root });
}

export function FavoritesScene() {
  const root = useRef<HTMLElement>(null);
  useScene(root);
  useCarousel(root);
  return (
    <section ref={root} id="favorites" data-theme="light" className={`${sec} bg-white text-ink`}>
      {/* gallery wall: pure white, 4 photos on desktop, a single photo on phones */}
      {/* <div aria-hidden className="absolute inset-0 grid grid-cols-1 gap-3 bg-white p-3 md:grid-cols-4 md:gap-5 md:p-5">
        {gallery.map((g, i) => <div key={g} className={`relative bg-white ${i ? 'hidden md:block' : ''}`}><Slot name={g} fit="cover" className="inset-0" sizes="(max-width:768px) 100vw, 25vw" /></div>)}
        <div className="pointer-events-none absolute inset-0 bg-white/45" />
      </div> */}
      <div className="relative">
        <div data-cursor="DRAG" className="fav-viewport relative cursor-grab touch-pan-y select-none pb-[3svh] pt-[12svh] active:cursor-grabbing md:pb-[7svh] md:pt-[15svh]">
          <div className="fav-track flex items-start gap-[3vw] pl-[5%] md:gap-[1.2vw] md:pl-[2.8%]">
            {[...favorites, ...favorites, ...favorites, ...favorites].map((p, i) => (
              <figure key={i} aria-hidden={i >= favorites.length} className={`fav-card relative w-[74vw] shrink-0 overflow-hidden bg-white md:w-[clamp(240px,24vw,440px)] ${p.shape}`}>
                <Slot name={p.image} alt={i < favorites.length ? p.name : ''} fit="cover" className="inset-0" sizes="(max-width:768px) 74vw, 24vw" />
              </figure>
            ))}
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-white via-white/85 to-transparent md:hidden" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-[5] hidden w-[62%] bg-gradient-to-r from-white/90 via-white/45 to-transparent md:block" />
        </div>
        {/* text: slightly overlaps the photos on phones, fully overlays them on large screens (never blocks swiping) */}
        <div className="pointer-events-none relative z-10 -mt-[15svh] px-[5%] pb-[8svh] md:absolute md:inset-0 md:mt-0 md:flex md:items-end md:px-[2.8%] md:pb-[9svh]">
          <div className="w-full">
            <Eyebrow className="mb-5">{'// Our menu'}</Eyebrow>
            <div className="grid items-end gap-6 md:grid-cols-[1.5fr_1fr_.7fr] md:gap-7">
              <h2 data-lines className="display text-[clamp(3rem,16vw,5.5rem)] md:text-[clamp(3rem,6.4vw,7.4rem)]"><Mask lines={['Favorites', 'Made', 'Daily']} /></h2>
              <p data-rise data-type className="max-w-[260px] text-[12px] font-medium uppercase leading-[1.35]">Quality ingredients, carefully prepared. Simple, balanced and made to enjoy.</p>
              <Magnetic className="pointer-events-auto md:justify-self-end"><a href="#menu" data-cursor="VIEW" className="link mono text-[12px]">View full menu <Arrow /></a></Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── 04 MENU ───────── */
export function MenuScene() {
  const root = useRef<HTMLElement>(null);
  useScene(root, (r, q) => { gsap.from(q('.cell'), { y: 50, opacity: 0, duration: 1, stagger: 0.08, ease: 'power3.out', scrollTrigger: trig(r, { start: 'top 75%' }) }); });
  return (
    <section ref={root} id="menu" data-theme="light" className={`${sec} h-[100svh] bg-cream px-[5%] pb-[5svh] pt-[13svh] text-ink md:flex md:h-auto md:min-h-[100svh] md:items-center md:px-[2.8%] md:pb-[8svh]`}>
      <div data-speed="-30" className="absolute inset-[-10%_-5%] opacity-50"><Swash className="h-full w-full" /></div>
      <ul className="relative grid h-full w-full grid-cols-2 grid-rows-2 gap-2.5 md:h-auto md:grid-rows-none md:gap-3 lg:grid-cols-4">
        {products.map((p) => (
          <li key={p.id} className="cell group relative min-h-0 border border-ink bg-cream/60 md:aspect-[1/1] lg:aspect-[1.2/1]" data-cursor="VIEW">
            <span data-type className="mono absolute left-3 top-3 text-[10px] opacity-50">{p.id}</span>
            <div className="absolute inset-[16%_14%_24%] transition-transform duration-700 ease-out group-hover:scale-[1.05] lg:inset-[14%_18%_24%]"><Slot name={p.image} alt={p.name} className="inset-0" sizes="(max-width:1024px) 45vw, 22vw" /></div>
            <p className="mono absolute inset-x-3 bottom-3 flex justify-between gap-2 text-[10px] md:text-[12px]"><span data-type>{p.name}</span><span data-type>{p.price}</span></p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ───────── 05 LOCATION / CLOCK ───────── */
// md+: sticky stage, short pin. Phones: normal flow (no pin, no dead scroll) with the same motion driven by the clock itself.
// The cup is hidden first, fades/drops in, lands on the clock's centre, then cup and needle turn together (a 200° sweep).
const SWEEP = 540; // needle + cup keep turning for as long as the scene is on screen (never parks on a number)
export function LocationScene() {
  const root = useRef<HTMLElement>(null);
  useScene(root, (r, q) => {
    const clock = q('.clock')[0], cup = q('.cup'), hand = q('.hand');
    const mm = gsap.matchMedia();
    const dropDesk = (st: ScrollTrigger.Vars) => gsap.fromTo(cup, { y: () => -clock.clientWidth * 0.95 }, { y: 0, ease: 'power2.out', scrollTrigger: { ...st, invalidateOnRefresh: true } });
    const dropFade = (st: ScrollTrigger.Vars) => gsap.fromTo(cup, { y: () => -clock.clientWidth * 0.55, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { ...st, invalidateOnRefresh: true } });
    const spin = (st: ScrollTrigger.Vars) => {
      const o = { ease: 'none', scrollTrigger: st } as const;
      gsap.fromTo(hand, { rotate: 0, svgOrigin: '200 200' }, { rotate: SWEEP, svgOrigin: '200 200', ...o });
      gsap.fromTo(cup, { rotate: 0 }, { rotate: SWEEP, ...o });
    };
    mm.add('(min-width: 768px)', () => {
      dropDesk(trig(r, { start: 'top 55%', end: 'top top', scrub: true }));
      spin(trig(r, { start: 'top top', end: 'bottom top', scrub: true }));
    });
    mm.add('(max-width: 767px)', () => {
      dropFade(trig(clock, { start: 'top 85%', end: 'center 55%', scrub: true }));
      spin(trig(clock, { start: 'center 55%', end: 'bottom top', scrub: true }));
    });
  });
  return (
    <section ref={root} id="location" data-theme="light" className="relative flex min-h-[100svh] w-full flex-col bg-cream text-ink md:block">
      <div className="relative flex flex-1 flex-col md:block md:h-[135svh]">
        <div className="relative flex flex-1 flex-col items-center justify-evenly px-[5%] pb-3 pt-[12svh] md:sticky md:top-0 md:grid md:h-[100svh] md:place-items-center md:overflow-hidden md:p-0">
          <Eyebrow className="self-start md:absolute md:left-[2.8%] md:top-[15%]">{'// Our location'}</Eyebrow>
          <div className="clock relative mt-0 aspect-square w-[min(86vw,46svh)] md:mt-0 md:w-[min(80vw,72svh)]">
            <Clock className="h-full w-full" />
          <div className="absolute inset-0 grid place-items-center">
  {/* BEFORE: h-[52%] w-[30%] */}
  {/* AFTER: Scaled up responsively across mobile, tablet, and desktop */}
  <div className="cup relative h-[60%] w-[55%] sm:h-[75%] sm:w-[48%] md:h-[80%] md:w-[42%] lg:h-[85%] lg:w-[46%]">
    <Slot name="iced-coffee" alt="Iced coffee" className="inset-0" sizes="(max-width: 640px) 65vw, (max-width: 1024px) 42vw, 36vw" />
  </div>
</div>
          </div>
          <p data-type className="mono mt-0 self-start text-[10px] leading-[1.6] md:absolute md:bottom-[6svh] md:left-[2.8%] md:mt-0 md:max-w-[260px] md:text-[12px]">
            Time moves fast.<br />Your coffee shouldn&apos;t.<br />Brewed fresh, every single day.
          </p>
        </div>
      </div>
      <div data-rise className="mono grid grid-cols-2 gap-x-6 gap-y-3 px-[5%] pb-5 pt-3 text-[10px] md:flex md:justify-between md:px-[2.8%] md:pt-4 md:text-[12px]">
        <p data-type>{site.address[0]}<br />{site.address[1]}</p>
        <p data-type className="md:text-right">Open daily<br />{site.hours}</p>
      </div>
    </section>
  );
}

/* ───────── 06 STATEMENT ───────── */
export function StatementScene() {
  const root = useRef<HTMLElement>(null);
  useScene(root, (_r, q) => floatBeans(q, 24, 14));
  return (
    <section ref={root} id="statement" data-theme="dark" className={`${sec} h-[100svh] bg-[#07121e] md:h-auto md:min-h-[100svh]`}>
      {beans.map(([l, t, s, r], i) => <Bean key={i} style={{ left: `${l}%`, top: `${t}%`, width: s, transform: `rotate(${r}deg)` }} className="opacity-80" />)}
      <div className="absolute inset-x-[5%] bottom-[16svh] z-10 md:inset-x-[2.8%] md:bottom-[10svh]">
        <Words text="The city never stops. Your coffee shouldn't slow you down." className="display max-w-[14ch] text-[clamp(2.6rem,14.5vw,4.8rem)] md:max-w-[20ch] md:text-[clamp(2.6rem,5.4vw,6.2rem)]" />
      </div>
    </section>
  );
}

/* ───────── 07 PHILOSOPHY ───────── */
export function PhilosophyScene() {
  const root = useRef<HTMLElement>(null);
  useScene(root, (_r, q) => floatBeans(q, 18, 18));
  return (
    <section ref={root} id="philosophy" data-theme="dark" className={`${sec} h-[100svh] bg-[#07121e] md:h-auto md:min-h-[100svh]`}>
      {beans.slice(0, 4).map(([l, t, s, r], i) => <Bean key={i} style={{ left: `${l + 10}%`, top: `${t * 0.8}%`, width: s * 0.8, transform: `rotate(${r}deg)` }} className="opacity-70" />)}
      <div data-speed="50" className="absolute bottom-[-4%] left-[-8%] h-[50%] w-[58%] -rotate-[8deg] md:bottom-auto md:left-[-2%] md:top-[-4%] md:h-[110%] md:w-[34%]"><Slot name="hero-cup" alt="Iceland Coffee cup" className="inset-0" sizes="(max-width:768px) 56vw, 34vw" /></div>
      <Eyebrow className="absolute left-[5%] top-[11svh] z-10 text-white/80 md:bottom-6 md:left-[2.8%] md:top-auto">{'// Our philosophy'}</Eyebrow>
      <div className="absolute inset-x-[5%] top-[17svh] z-10 md:inset-x-auto md:right-[2.8%] md:top-[22%] md:w-[34%]">
        <Words text="Stay for a conversation or leave with the cup in your hand — both work. Neither takes any effort. Nothing here is rushed, and nothing keeps you longer than you meant to stay." className="text-[15px] font-medium uppercase leading-[1.3] md:text-[15px]" />
      </div>
      <p data-type className="mono absolute bottom-[4svh] right-[5%] z-10 text-right text-[11px] leading-[1.6] md:bottom-6 md:right-[2.8%] md:text-[12px]">Good coffee<br />No ceremony<br />No wait.</p>
    </section>
  );
}

/* ───────── 08 RIGHT NOW ───────── */
// md+: sticky stage that ends exactly with the footer. Phones: normal flow; the receipt prints as the printer scrolls through.
export function RightNowScene() {
  const root = useRef<HTMLElement>(null);
  useScene(root, (r, q) => {
    const paper = q('.paper'), printer = q('.printer')[0];
    const mm = gsap.matchMedia();
    const print = (st: ScrollTrigger.Vars) => gsap.fromTo(paper, { yPercent: -103 }, { yPercent: 0, ease: 'none', scrollTrigger: st });
    mm.add('(min-width: 768px)', () => { print(trig(r, { start: 'top 85%', end: 'top 0%', scrub: smooth(0.6) })); });
    mm.add('(max-width: 767px)', () => { print(trig(printer, { start: 'top 96%', end: 'bottom 90%', scrub: true })); });
  });
  const copy = 'We work to one schedule: yours. Order ahead and your cup is poured when you walk in.';
  return (
    <section ref={root} id="rightnow" data-theme="dark" className="relative w-full bg-[#0b141d]">
      <div className="relative md:h-[135svh]">
        <div className="relative flex h-[100svh] flex-col overflow-hidden px-[5%] pb-5 pt-[12svh] md:sticky md:top-0 md:block md:p-0">
          <div className="absolute inset-0"><Slot name="matcha-cake" alt="Matcha cake on a steel tray" fit="cover" className="inset-0" sizes="100vw" /></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/65" />
          <h2 data-lines className="display relative z-10 text-[clamp(2.4rem,12vw,4.5rem)] md:absolute md:left-[2.8%] md:top-[20svh] md:text-[clamp(2.6rem,5.2vw,6rem)]"><Mask lines={['Coffee for', 'Right now.']} /></h2>
          <div className="relative z-20 mt-4 flex min-h-0 flex-1 items-start justify-center md:absolute md:inset-x-0 md:top-[11svh] md:mt-0 md:justify-start md:pl-[34%]"><Receipt /></div>
          <p data-type className="absolute bottom-[10svh] right-[2.8%] z-10 hidden w-[24%] text-[13px] font-medium uppercase leading-[1.35] md:block">{copy}</p>
          <p data-type className="relative z-10 mt-3 max-w-[300px] text-[11px] font-medium uppercase leading-[1.4] md:hidden">{copy}</p>
        </div>
      </div>
    </section>
  );
}
