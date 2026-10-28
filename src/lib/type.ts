import { gsap, isCoarse } from './gsap';

/** Splits text nodes into words → characters (keeps <br/> and inline markup) and returns a typing tween. */
export function typeIn(el: HTMLElement) {
  const orig = el.innerHTML;
  const chars: HTMLElement[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  nodes.forEach((n) => {
    const frag = document.createDocumentFragment();
    (n.textContent ?? '').split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.append(part); return; }
      const w = document.createElement('span');
      w.style.cssText = 'display:inline-block;white-space:nowrap';
      if (isCoarse()) { w.style.opacity = '0'; w.textContent = part; chars.push(w); }
      else Array.from(part).forEach((ch) => { const c = document.createElement('span'); c.textContent = ch; c.style.opacity = '0'; w.append(c); chars.push(c); });
      frag.append(w);
    });
    n.replaceWith(frag);
  });
  const tween = gsap.to(chars, { opacity: 1, duration: 0.2, ease: 'power1.out', stagger: Math.min(isCoarse() ? 0.07 : 0.032, 1.5 / Math.max(chars.length, 1)), paused: true });
  return { play: (delay = 0) => { tween.delay(delay).play(); }, restore: () => { tween.kill(); el.innerHTML = orig; } };
}
