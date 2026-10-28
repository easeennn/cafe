'use client';
import { site } from '@/lib/site';
import { useRef } from 'react';
import { toId, toTop } from '@/lib/gsap';
import { nav } from '@/lib/data';
import { useScene } from './useScene';

const mono = 'mono text-[11px] leading-[1.7] text-white md:text-[12px]';
const label = 'mono mb-3 text-[10px] text-white/40 md:mb-4';

/** Black footer. Every line wipes in left → right (same motion as the nav) when it scrolls into view. */
export default function Footer() {
  const root = useRef<HTMLElement>(null);
  useScene(root);
  return (
    <footer ref={root} id="footer" data-theme="dark" className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-[#03080d] px-[5%] pb-5 pt-[11svh] md:block md:min-h-0 md:px-[2.8%] md:pb-6 md:pt-[14svh]">
      <div className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-10">
        <p data-wipe className="display col-span-2 max-w-[12ch] text-[clamp(2rem,9vw,3rem)] md:col-span-1 md:text-[clamp(1.8rem,3.2vw,3rem)]">Coffee for your <span className="script text-[1.15em] normal-case">moment</span></p>
        <nav aria-label="Footer">
          <p data-wipe className={label}>Explore</p>
          <ul className="space-y-1">{nav.map((n) => <li key={n.label} data-wipe><button className={`${mono} link`} onClick={() => toId(n.id)}>{n.label}</button></li>)}</ul>
        </nav>
        <div className="md:order-4">
          <p data-wipe className={label}>Hours</p>
          <p data-wipe className={mono}>Open daily<br />{site.hours}</p>
          <p data-wipe className={`${label} mt-5 md:mt-8`}>Follow</p>
          <p data-wipe className={mono}>{site.social.map((x, i) => <span key={x.label}>{i > 0 && ' · '}<a className="link" href={x.href}>{x.label}</a></span>)}</p>
        </div>
        <div className="col-span-2 md:order-3 md:col-span-1">
          <p data-wipe className={label}>Visit</p>
          <address className="not-italic"><p data-wipe className={mono}>{site.address[0]}<br />{site.address[1]}</p></address>
        </div>
      </div>
      <div data-wipe="slow" aria-hidden className="select-none md:mt-[10svh]">
        <p className="display whitespace-nowrap text-[min(24vw,15rem)] normal-case leading-[.88] tracking-[-.06em] text-[#EDECE6] md:text-[min(13.6vw,26rem)] md:leading-[.9]">iceland<br className="md:hidden" /> coffee</p>
      </div>
      <div className="mono mt-3 flex justify-between border-t border-white/10 pt-4 text-[10px] text-white/50 md:mt-6 md:pt-5 md:text-[11px]">
        <span data-wipe>© {new Date().getFullYear()} {site.title}</span>
        <button data-wipe onClick={toTop} data-cursor="TOP" className="mono link">Back to top ↑</button>
      </div>
    </footer>
  );
}
