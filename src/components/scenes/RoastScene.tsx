'use client';
import { site } from '@/lib/site';
import { useRef } from 'react';
import { bagTags } from '@/lib/data';
import { Eyebrow, Mask, Slot } from '../ui';
import { useScene } from '../useScene';

// Phones: exactly one screen — text on top, the product area flexes to fill what is left, hours strip at the bottom.
export default function RoastScene() {
  const root = useRef<HTMLElement>(null);
  useScene(root);
  const p = bagTags[0];
  return (
    <section ref={root} id="roast" data-theme="dark" className="relative flex h-[100svh] w-full flex-col overflow-hidden bg-[#081522] px-[5%] pb-5 pt-[12svh] md:block md:h-auto md:min-h-[100svh] md:px-[2.8%] md:pb-8 md:pt-32">
      <div className="flex min-h-0 flex-1 flex-col gap-4 md:grid md:min-h-[calc(100svh-14rem)] md:flex-none md:grid-cols-[1fr_1.15fr] md:items-center md:gap-10">
        <div className="relative z-10 flex flex-col gap-3 md:gap-8">
          <Eyebrow className="text-white/70">{'// The roast'}</Eyebrow>
          <h2 data-lines className="script flex flex-wrap gap-x-[.22em] text-[clamp(3.4rem,17vw,5.5rem)] leading-[.9] md:block md:text-[clamp(5rem,10vw,13rem)] md:leading-[.85]"><Mask lines={['slow', 'roast']} /></h2>
          <p data-rise data-type className="max-w-[320px] text-[11px] font-medium uppercase leading-[1.4] md:text-[clamp(11px,.95vw,14px)]">Craft roasted in small batches, designed for clean sweetness, balanced acidity and a smooth finish.</p>
          <dl data-rise className="mono grid max-w-[360px] grid-cols-2 gap-4 border-t border-white/15 pt-3 text-[10px] md:pt-5 md:text-[12px]">
            <div><dt className="text-white/45">Flavor notes</dt><dd data-type className="mt-1.5 leading-[1.6]">Caramel<br />Brown sugar<br />Roasted almond</dd></div>
            <div><dt className="text-white/45">{p.name}</dt><dd data-type className="mt-1.5 leading-[1.6]">{p.price}<br />250 g · whole bean<br />Small batch</dd></div>
          </dl>
        </div>
        <div className="relative min-h-0 flex-1 md:h-[min(80svh,52vw)] md:flex-none">
          <div data-speed="40" className="absolute right-[-4%] top-0 h-[96%] w-[62%] rotate-[3deg]"><Slot name="roast-bag" alt="Slow Roast coffee bag" className="inset-0" sizes="(max-width:768px) 62vw, 34vw" /></div>
          <div data-speed="-30" className="absolute bottom-[2%] left-[2%] h-[62%] w-[46%] -rotate-[6deg]"><Slot name="roast-cup" alt="Iceland Coffee cup" className="inset-0" sizes="(max-width:768px) 46vw, 26vw" /></div>
        </div>
      </div>
      <div data-rise className="mono mt-3 grid grid-cols-3 gap-3 border-t border-white/15 pt-3 text-[9px] leading-[1.5] md:mt-10 md:pt-5 md:text-[12px]">
        <p data-type>Open daily<br />{site.hours}</p><p data-type>{site.address[0]}<br />{site.address[1]}</p><p data-type>{site.social[0].label}<br />{site.social[1].label}</p>
      </div>
    </section>
  );
}
