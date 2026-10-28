import Image from 'next/image';

/** Image slot: drop a real file at /public/images/<name>.webp — no code changes needed. */
export function Slot({ name, alt = '', className = '', priority = false, fit = 'contain', sizes = '(max-width:768px) 80vw, 40vw' }: {
  name: string; alt?: string; className?: string; priority?: boolean; fit?: 'contain' | 'cover'; sizes?: string;
}) {
  return (
    <div className={`absolute ${className}`}>
      <Image src={`/images/${name}.png`} alt={alt} fill sizes={sizes} priority={priority} draggable={false}
        className={fit === 'cover' ? 'object-cover' : 'object-contain'} />
    </div>
  );
}

/** Masked line reveal; each line is animated via the `.ml` class. */
export const Mask = ({ lines }: { lines: string[] }) => (
  <>{lines.map((l) => (
    <span key={l} className="block overflow-hidden pb-[.05em] -mb-[.05em]"><span className="ml block">{l}</span></span>
  ))}</>
);

export const Words = ({ text, className = '' }: { text: string; className?: string }) => (
  <p data-words className={className}>{text.split(' ').map((w, i) => <span key={i} className="w mr-[.26em] inline-block">{w}</span>)}</p>
);

export const Bean = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 40 60" className={`bean absolute ${className}`} style={style} aria-hidden>
    <ellipse cx="20" cy="30" rx="17" ry="27" fill="#3a2214" />
    <path d="M20 5C9 22 31 38 20 55" stroke="#120a06" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

export const Arrow = () => <span aria-hidden className="ml-1 inline-block">↗</span>;

export const Eyebrow = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p data-type className={`mono text-[11px] md:text-[13px] ${className}`}>{children}</p>
);

export function Swash({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 600" className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <path d="M-40 560C140 520 220 120 360 70c90-30 120 70 60 190S300 520 470 470c150-45 190-330 330-390 110-45 150 40 100 130s-40 190 80 160 160-120 230-150"
        fill="none" stroke="#D8D6CE" strokeWidth="78" strokeLinecap="round" opacity=".6" />
    </svg>
  );
}

export function Clock({ className = '' }: { className?: string }) {
  const ticks = Array.from({ length: 60 }, (_, i) => i);
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label="Clock showing opening hours">
      <circle cx="200" cy="200" r="198" fill="#E1DFD7" />
      {ticks.map((i) => (
        <line key={i} x1="200" y1={i % 5 ? 14 : 8} x2="200" y2={i % 5 ? 20 : 26} stroke="#11100E" strokeWidth={i % 5 ? 1 : 2}
          transform={`rotate(${i * 6} 200 200)`} />
      ))}
      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
        const a = (n * 30 - 90) * (Math.PI / 180);
        return <text key={n} x={200 + Math.cos(a) * 150} y={200 + Math.sin(a) * 150 + 12} textAnchor="middle" fontSize="38"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fill: '#11100E' }}>{n}</text>;
      })}
      <g className="hand"><line x1="200" y1="214" x2="200" y2="50" stroke="#11100E" strokeWidth="5" strokeLinecap="round" /></g>
      <circle cx="200" cy="200" r="8" fill="#11100E" />
    </svg>
  );
}
