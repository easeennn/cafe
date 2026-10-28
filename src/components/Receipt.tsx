import { site } from '@/lib/site';
import { Slot } from './ui';

// Deterministic barcode (no randomness → no hydration mismatch).
const bars = (() => { let s = 7, x = 0; const out: { x: number; w: number }[] = []; while (x < 196) { s = (s * 9301 + 49297) % 233280; const w = 1 + Math.floor((s / 233280) * 3); out.push({ x, w }); x += w + 1 + (s % 3 === 0 ? 1 : 0); } return out; })();
const TEETH = 18;
const zig = `polygon(0 0,100% 0,${Array.from({ length: TEETH * 2 + 1 }, (_, k) => `${(100 - (k * 100) / (TEETH * 2)).toFixed(3)}% ${k % 2 === 0 ? '100%' : 'calc(100% - 2.8cqw)'}`).join(',')})`;
const rule = 'border-t border-[#8d8d8d]';

/** Thermal printer head with a receipt that hangs from its slot. Everything scales with the container (cqw). */
export default function Receipt() {
  return (
    <div className="printer relative w-[min(72vw,320px,calc((100svh_-_270px)_/_1.9))] [container-type:inline-size] md:w-[min(26vw,380px,calc((100svh_-_11svh_-_80px)_/_1.9))]">
      <div className="relative z-10 h-[11cqw] rounded-[3.6cqw]"
        style={{ background: 'linear-gradient(180deg,#f4f4f5 0%,#cfd0d3 36%,#a3a4a9 72%,#85868b 100%)', boxShadow: '0 1.4cqw 3.4cqw rgba(0,0,0,.5), inset 0 .5cqw .7cqw rgba(255,255,255,.95), inset 0 -.7cqw .9cqw rgba(0,0,0,.28)' }}>
        <span className="led absolute right-[5cqw] top-[3.6cqw] h-[1.6cqw] w-[1.6cqw] rounded-full bg-[#5fd36f]" />
        <span className="absolute inset-x-[3.2%] bottom-[2cqw] h-[1.7cqw] rounded-full bg-[#1d1d1f]" style={{ boxShadow: 'inset 0 .3cqw .5cqw rgba(0,0,0,.9), 0 .15cqw 0 rgba(255,255,255,.55)' }} />
      </div>
      <div className="paper-clip relative z-0 mx-auto -mt-[3cqw] w-[82%]" style={{ clipPath: 'inset(0 -40px -90px -40px)', filter: 'drop-shadow(0 2.4cqw 2.6cqw rgba(0,0,0,.38))' }}>
        <div className="paper relative will-change-transform px-[7%] pb-[10cqw] pt-[9cqw] text-[#1b1b1b]"
          style={{ clipPath: zig, background: 'linear-gradient(90deg,#d8d8d8 0%,#f6f6f6 7%,#fff 50%,#f6f6f6 93%,#d4d4d4 100%)' }}>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[10cqw]" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,.3),transparent)' }} />
          <div className={rule} />
          <h3 className="display mt-[5cqw] text-center text-[6.6cqw] leading-[1.05] tracking-[-.01em]">Skip the line.<br />Order ahead.</h3>
          <div className="relative mx-auto my-[4.5cqw] h-[34cqw] w-[34cqw]"><Slot name="iced-3" alt="Iced coffee" className="inset-0" sizes="150px" /></div>
          <div className={rule} />
          <p className="mono mt-[4cqw] text-[3.7cqw] normal-case leading-[1.55] text-[#333]" style={{ textTransform: 'none' }}>Grab yours at<br />{site.address[0]}</p>
          <div className="my-[4cqw] h-[1.2cqw] border-y border-[#8d8d8d]" />
          <p className="mono text-[3.3cqw] leading-[1.6] text-[#333]" style={{ textTransform: 'none' }}>Open daily {site.hours}<br />{site.address[1]}</p>
          <svg viewBox="0 0 200 26" className="mt-[6cqw] w-full" preserveAspectRatio="none" aria-hidden>
            {bars.map((b, i) => <rect key={i} x={b.x} y="0" width={b.w} height="26" fill="#1b1b1b" />)}
          </svg>
          <p className="mono mt-[3cqw] text-center text-[3cqw] text-[#555]" style={{ textTransform: 'none' }}>{site.domain}</p>
        </div>
      </div>
    </div>
  );
}
