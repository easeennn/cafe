'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/** Desktop-only cursor. Labels come from `data-cursor` attributes. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    const d = dot.current!;
    const x = gsap.quickTo(d, 'x', { duration: 0.35, ease: 'power3.out' });
    const y = gsap.quickTo(d, 'y', { duration: 0.35, ease: 'power3.out' });
    const move = (e: PointerEvent) => { x(e.clientX); y(e.clientY); gsap.to(d, { opacity: 1, duration: 0.3, overwrite: 'auto' }); };
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('a,button,[data-cursor]');
      const t = el?.dataset.cursor ?? '';
      if (label.current) label.current.textContent = t;
      gsap.to(d, { width: t ? 72 : el ? 30 : 10, height: t ? 72 : el ? 30 : 10, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerover', over);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', over); };
  });
  return (
    <div ref={dot} aria-hidden style={{ width: 10, height: 10, opacity: 0 }}
      className="cursor pointer-events-none fixed left-0 top-0 z-[70] -ml-[1px] grid place-items-center rounded-full bg-white mix-blend-difference [translate:-50%_-50%]">
      <span ref={label} className="mono text-[10px] text-black" />
    </div>
  );
}
