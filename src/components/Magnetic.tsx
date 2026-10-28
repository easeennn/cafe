'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/** Moves its child a few px toward the cursor (max ±10px). */
export default function Magnetic({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const el = ref.current!;
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x(gsap.utils.clamp(-10, 10, (e.clientX - (r.left + r.width / 2)) * 0.25));
      y(gsap.utils.clamp(-10, 10, (e.clientY - (r.top + r.height / 2)) * 0.25));
    };
    const leave = () => { x(0); y(0); };
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, { scope: ref });
  return <span ref={ref} className={`inline-block ${className}`}>{children}</span>;
}
