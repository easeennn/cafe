'use client';
import { site } from '@/lib/site';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { gsap, useGSAP, toId, toTop, motion, ScrollTrigger } from '@/lib/gsap';
import { nav } from '@/lib/data';
import Magnetic from './Magnetic';

const label = 'mono text-[12px] tracking-[.04em] md:text-[13px]';

export default function Nav() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);
  const light = theme === 'light';
  useEffect(() => {
    const t = Array.from(document.querySelectorAll<HTMLElement>('[data-theme]')).map((el) =>
      ScrollTrigger.create({ trigger: el, start: 'top 40px', end: 'bottom 40px', onToggle: (s) => { if (s.isActive) setTheme(el.dataset.theme as 'dark' | 'light'); } }));
    return () => t.forEach((x) => x.kill());
  }, []);
  useEffect(() => { document.documentElement.dataset.sb = theme; }, [theme]);

  // Colour follows the scene underneath: light type on dark scenes, dark type on cream scenes.
  useGSAP(() => {
    gsap.to(root.current, { color: light ? '#11100E' : '#FFFFFF', duration: 0.7, ease: 'power2.inOut', overwrite: 'auto' });
  }, { dependencies: [light], scope: root });

  // Intro: every item is revealed left → right with a short drift, staggered.
  useGSAP(() => motion(() => {
    const items = gsap.utils.selector(root.current!)('.nv');
    const go = () => gsap.fromTo(items, { clipPath: 'inset(0 100% 0 0)', x: -18 }, { clipPath: 'inset(0 0% 0 0)', x: 0, duration: 1.2, stagger: 0.09, ease: 'power3.out', clearProps: 'clipPath,transform' });
    if (document.documentElement.dataset.ready) go(); else window.addEventListener('site:ready', go, { once: true });
    return () => window.removeEventListener('site:ready', go);
  }), { scope: root });

  // Mobile menu reveal.
  useGSAP(() => {
    gsap.to(menu.current, { clipPath: open ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)', duration: 0.9, ease: 'power4.inOut' });
    if (open) gsap.fromTo(gsap.utils.selector(menu.current!)('.mi'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.07, delay: 0.25, ease: 'power4.out' });
  }, { dependencies: [open], scope: root });

  const go = (id: string) => { setOpen(false); window.setTimeout(() => toId(id), open ? 500 : 0); };
  return (
    <header ref={root} style={{ color: '#fff' }}>
      <nav aria-label="Primary" className="fixed inset-x-0 top-0 z-40 grid grid-cols-[1fr_auto_1fr] items-center px-[5%] pt-5 md:px-[2.8%] md:pt-7">
        <ul className={`${label} hidden gap-9 lg:flex`}>
          {nav.map((n) => <li key={n.label} className="nv"><button className={`${label} link`} onClick={() => go(n.id)}>{n.label}</button></li>)}
        </ul>
        <span className="lg:hidden" />
        <button onClick={toTop} aria-label="Iceland Coffee — back to top" className="nv display col-start-2 whitespace-nowrap text-[clamp(17px,5.2vw,24px)] normal-case tracking-[-.055em] md:text-[27px]">{site.name}</button>
        <div className={`${label} flex justify-end`}>
          <span className="nv hidden lg:block"><Magnetic><a href="#menu" className="link" data-cursor="ORDER" onClick={(e) => { e.preventDefault(); go('menu'); }}>Order online</a></Magnetic></span>
          <button className={`${label} nv lg:hidden`} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
        </div>
      </nav>
      <div ref={menu} className={`fixed inset-0 z-30 flex flex-col justify-end gap-2 p-[6%] pb-12 lg:hidden ${light ? 'bg-cream' : 'bg-[#0a1b2d]'}`} style={{ clipPath: 'inset(0 0 100% 0)' }}>
        {[...nav, { label: 'Order online', id: 'menu' }].map((n) => (
          <span key={n.label} className="block overflow-hidden"><button onClick={() => go(n.id)} className="mi display block text-[13vw] leading-[.95]">{n.label}</button></span>
        ))}
      </div>
    </header>
  );
}
