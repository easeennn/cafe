'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, lenisRef, isCoarse } from '@/lib/gsap';
import Nav from './Nav';
import Loader from './Loader';
import Cursor from './Cursor';
import Footer from './Footer';
import HeroScene from './scenes/HeroScene';
import RoastScene from './scenes/RoastScene';
import { FavoritesScene, MenuScene, LocationScene, StatementScene, PhilosophyScene, RightNowScene } from './Scenes';

export default function Experience() {
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Desktop: one Lenis instance driven by the GSAP ticker. Touch devices keep native momentum scrolling.
    let lenis: Lenis | null = null;
    const tick = (t: number) => lenis?.raf(t * 1000);
    if (!reduce && !isCoarse()) {
      lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    }
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh); window.addEventListener('load', refresh);
    return () => { gsap.ticker.remove(tick); lenis?.destroy(); lenisRef.current = null; window.removeEventListener('load', refresh); };
  }, []);

  return (
    <>
      <Nav />
      <main>
        <HeroScene />
        {/* <RoastScene /> */}
        <FavoritesScene />
        <MenuScene />
        <LocationScene />
        <StatementScene />
        <PhilosophyScene />
        <RightNowScene />
      </main>
      <Footer />
      <div className="grain" aria-hidden />
      <Loader />
      <Cursor />
    </>
  );
}
