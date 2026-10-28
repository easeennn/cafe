'use client';
import { site } from '@/lib/site';
import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, trig, motion, smooth, isCoarse } from '@/lib/gsap';
import { typeIn } from '@/lib/type';
import { bagTags } from '@/lib/data';
import { Arrow, Eyebrow, Mask, Slot } from '../ui';
import Magnetic from '../Magnetic';

export default function HeroScene() {
  const root = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % bagTags.length), 3400); return () => clearInterval(t); }, []);

  useGSAP(() => motion(() => {
    const r = root.current!;
    const q = gsap.utils.selector(r);
    const intro = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } });
    intro.from(q('.bg'), { opacity: 0, duration: 0.8, ease: 'power2.out' }, 0)
      .from(q('.eyebrow'), { opacity: 0, y: 14, duration: 0.8 }, 0.3)
      .from(q('.ml'), { yPercent: 115, duration: 1.1, stagger: 0.1 }, 0.4)
      .fromTo(q('.moment'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.inOut' }, 0.8)
      .from(q('.sub'), { opacity: 0, y: 20, duration: 0.9 }, 0.9)
      .from(q('.bag-in'), { x: '30%', y: '18%', rotate: 12, opacity: 0, duration: 1.5, ease: 'expo.out' }, 0.65)
      .from(q('.cup-in'), { x: '-12%', y: '45%', rotate: -14, opacity: 0, duration: 1.5, ease: 'expo.out' }, 0.8)
      .from(q('.tag, .strip'), { opacity: 0, y: 24, duration: 0.9 }, 1.05);
    const typed = [...q('.eyebrow'), ...q('.sub p'), ...q('.strip p')].map((el) => typeIn(el));
    const play = () => { intro.play(); typed.forEach((t, k) => t.play(0.9 + k * 0.14)); };
    if (document.documentElement.dataset.ready) play(); else window.addEventListener('site:ready', play, { once: true });

    // Scroll: objects drift at different speeds for depth; copy fades back.
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: trig(r, { start: 'top top', end: 'bottom top', scrub: smooth(0.7) }) })
      .to(q('.bag'), { yPercent: -8, rotate: -2 }, 0).to(q('.cup'), { yPercent: -24, rotate: -5 }, 0)
      .to(q('.hero-copy'), { y: -90, opacity: 0.25 }, 0).to(q('.tag'), { opacity: 0 }, 0);
    if (!isCoarse()) gsap.to(q('.float'), { y: -10, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 });

    // Pointer: while the cursor is over the hero the products lift and follow it with weight (desktop only).
    let off = () => {};
    if (matchMedia('(pointer:fine)').matches) {
      const bag = q('.mx-bag')[0], cup = q('.mx-cup')[0];
      const set = (el: Element, d: number) => ({ x: gsap.quickTo(el, 'x', { duration: d, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: d, ease: 'power3.out' }), r: gsap.quickTo(el, 'rotation', { duration: d + 0.2, ease: 'power3.out' }) });
      const b = set(bag, 1.3), c = set(cup, 1.0);
      let lift = 0;
      const move = (e: PointerEvent) => {
        const nx = (e.clientX / innerWidth - 0.5) * 2, ny = (e.clientY / innerHeight - 0.5) * 2;
        b.x(nx * 22); b.y(ny * 14 - 16 * lift); b.r(nx * 1.4);
        c.x(nx * 40); c.y(ny * 24 - 26 * lift); c.r(nx * 3);
      };
      const enter = () => { lift = 1; gsap.to(bag, { scale: 1.03, duration: 1.1, ease: 'power3.out' }); gsap.to(cup, { scale: 1.06, duration: 1.1, ease: 'power3.out' }); };
      const leave = () => { lift = 0; [b, c].forEach((o) => { o.x(0); o.y(0); o.r(0); }); gsap.to([bag, cup], { scale: 1, duration: 1.2, ease: 'power3.out' }); };
      r.addEventListener('pointermove', move); r.addEventListener('pointerenter', enter); r.addEventListener('pointerleave', leave);
      off = () => { r.removeEventListener('pointermove', move); r.removeEventListener('pointerenter', enter); r.removeEventListener('pointerleave', leave); };
    }
    return () => { window.removeEventListener('site:ready', play); off(); typed.forEach((t) => t.restore()); };
  }), { scope: root });

  const t = bagTags[i];
  return (
    <section ref={root} id="hero" data-theme="dark" aria-label="Iceland Coffee" className="relative w-full overflow-hidden" style={{ height: '100svh' }}>
      <div className="bg glow absolute inset-0" />
      <div className="bag will-change-transform absolute bottom-[-3%] right-[-12%] z-20 h-[54%] w-[62%] md:bottom-auto md:right-[-3%] md:top-[24%] md:h-[72%] md:w-[38%]">
        <div className="mx-bag absolute inset-0"><div className="float absolute inset-0"><Slot name="iced-2" alt="Iceland Coffee Slow Roast bag" priority className="bag-in inset-0" sizes="(max-width:768px) 66vw, 38vw" /></div></div>
      </div>
      <div className="cup will-change-transform absolute bottom-[1%] left-[5%] z-30 h-[50%] w-[54%] md:bottom-auto md:left-[42%] md:top-[40%] md:h-[60%] md:w-[32%]">
        <div className="mx-cup absolute inset-0"><div className="float absolute inset-0"><Slot name="iced-1" alt="Iceland Coffee cup" priority className="cup-in inset-0" sizes="(max-width:768px) 54vw, 32vw" /></div></div>
      </div>
      <div key={i} className="tag mono absolute right-[3%] top-[12%] z-30 hidden w-[22%] max-w-[330px] border border-white/10 bg-black/35 p-5 md:block">
        <p className="text-[10px] text-white/50">{t.eyebrow}</p>
        <p className="mt-3 flex items-baseline justify-between gap-3"><span className="display text-[clamp(1.1rem,1.9vw,2rem)] normal-case">{t.name}</span><span className="text-[12px]">{t.price}</span></p>
        <p className="mt-3 border-t border-white/15 pt-3 text-[9px] text-white/45">{t.meta}</p>
      </div>
      <div className="hero-copy absolute left-[6%] top-[14%] z-30 md:left-[2.8%] md:top-[27%]">
        <Eyebrow className="eyebrow mb-4 text-white md:mb-5">{'// Specialty coffee house'}</Eyebrow>
        <h1 className="display text-[clamp(3rem,17vw,5.5rem)] md:text-[clamp(3.2rem,6.8vw,9rem)]"><Mask lines={['Coffee', 'For your']} /></h1>
        <p className="moment script -mt-1 ml-[18%] text-[clamp(2.2rem,10vw,3.6rem)] md:text-[clamp(2.4rem,4.6vw,6rem)]">moment</p>
        <div className="sub mt-6 max-w-[260px] text-[11px] font-medium uppercase leading-[1.35] md:mt-10 md:max-w-[300px] md:text-[clamp(11px,.95vw,14px)]">
          <p className="max-md:[@media(max-height:680px)]:hidden">Carefully sourced beans and thoughtfully brewed to bring out the best in every cup.</p>
          <Magnetic className="mt-5 md:mt-7"><a href="#menu" data-cursor="OPEN" className="link mono text-[11px] md:text-[12px]">Explore menu <Arrow /></a></Magnetic>
        </div>
      </div>
      <div className="strip mono absolute bottom-[3%] left-[2.8%] z-30 hidden gap-0 text-[12px] md:flex">
        <p className="pr-6">Open daily<br />{site.hours}</p>
        <p className="border-l border-white/25 px-6">{site.address[0]}<br />{site.address[1]}</p>
        <p className="border-l border-white/25 pl-6 text-white/70">{site.social[0].label}<br />{site.social[1].label}</p>
      </div>
    </section>
  );
}
