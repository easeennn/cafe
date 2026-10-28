'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, useGSAP);
export { gsap, ScrollTrigger, useGSAP };

export const lenisRef: { current: Lenis | null } = { current: null };
export const trig = (trigger: Element | string | null, vars: ScrollTrigger.Vars = {}): ScrollTrigger.Vars => ({ trigger: trigger as Element, ...vars });
/** Runs motion only when the user has not asked for reduced motion. */
export const motion = (fn: () => void | (() => void)) => { gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', fn); };
export const toTop = () => (lenisRef.current ? lenisRef.current.scrollTo(0, { duration: 2.2 }) : window.scrollTo({ top: 0, behavior: 'smooth' }));
export const toId = (id: string) => { const el = document.getElementById(id); if (el) (lenisRef.current ? lenisRef.current.scrollTo(el, { duration: 1.6 }) : el.scrollIntoView({ behavior: 'smooth' })); };

ScrollTrigger.config({ ignoreMobileResize: true }); // no refresh storms when the mobile URL bar collapses
export const isCoarse = () => typeof window !== 'undefined' && window.matchMedia('(pointer:coarse)').matches;
/** Scroll-linked tweens follow the finger 1:1 on touch (smoothing there reads as lag); eased on desktop. */
export const smooth = (_v: number): true => true;
