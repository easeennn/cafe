'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/lib/gsap';
import { site } from '@/lib/site';

/** Short intro on the brand blue: logo mark + wordmark + counter, then wipes up and signals the hero. Quicker when already seen. */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const seen = sessionStorage.getItem('iceland-seen') === '1';
    const done = () => {
      sessionStorage.setItem('iceland-seen', '1');
      document.documentElement.dataset.ready = '1';
      window.dispatchEvent(new Event('site:ready'));
      if (root.current) root.current.style.display = 'none';
    };
    const o = { v: 0 };
    const tl = gsap.timeline({ paused: true });
    tl.from('.mark-logo', { scale: 0.86, opacity: 0, duration: 0.8, ease: 'power3.out' })
      .from('.mark', { yPercent: 110, duration: 0.7, ease: 'power4.out' }, 0.15)
      .to(o, { v: 100, duration: seen ? 0.3 : 0.9, ease: 'power2.inOut', onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(3, '0'); } }, 0.2)
      .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power4.inOut', onStart: () => { window.setTimeout(() => { document.documentElement.dataset.ready = '1'; window.dispatchEvent(new Event('site:ready')); }, 350); }, onComplete: done });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { done(); return; }
    document.fonts.ready.then(() => tl.play());
  }, { scope: root });
  return (
    <div ref={root} className="fixed inset-0 z-[60] bg-[#3E7CB8]" style={{ clipPath: 'inset(0 0 0% 0)' }} aria-hidden>
      <div className="flex h-full flex-col items-center justify-center gap-5 px-[5%]">
        <Image src="/images/logo-mark.png" alt="" width={640} height={640} priority className="mark-logo h-auto w-[min(46vw,200px)]" />
        <span className="block overflow-hidden"><span className="mark display block whitespace-nowrap text-[clamp(1.5rem,8vw,3rem)] normal-case tracking-[-.05em] text-white">{site.name}</span></span>
      </div>
      <span ref={num} className="mono absolute bottom-5 left-[5%] text-xs text-white/80">000</span>
    </div>
  );
}
