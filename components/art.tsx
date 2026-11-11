// Illustrations drawn in code. All decorative (aria-hidden); none depicts a real place, person or document.
// No inline style attributes anywhere: the site's security policy forbids them. Motion lives in globals.css.

type Art = { className?: string };

// A single burning incense stick with rising smoke. Used in the home hero.
export function Smoke({ className }: Art) {
  return (
    <svg viewBox="0 0 400 800" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="smoke-fade" gradientUnits="userSpaceOnUse" x1="0" y1="560" x2="0" y2="0">
          <stop offset="0" stopColor="#e2b25c" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#f4ecdf" stopOpacity="0.5" />
          <stop offset="1" stopColor="#f4ecdf" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ember-glow">
          <stop offset="0" stopColor="#ffb347" stopOpacity="0.9" />
          <stop offset="0.25" stopColor="#e0672f" stopOpacity="0.45" />
          <stop offset="1" stopColor="#e0672f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="smoke blur-[1.5px]" stroke="url(#smoke-fade)" strokeLinecap="round">
        <path pathLength="1" strokeWidth="3" d="M200 560C160 480 250 430 205 350S140 230 215 150 250 60 190 0" />
        <path pathLength="1" strokeWidth="2" d="M200 560C235 490 150 440 195 360S265 250 185 170 150 70 225 10" />
        <path pathLength="1" strokeWidth="1.2" d="M200 560C185 500 225 450 215 380S170 280 205 200 235 100 205 30" />
      </g>
      <circle className="ember" cx="200" cy="560" r="90" fill="url(#ember-glow)" />
      <path d="M200 562 160 752" stroke="#5a3d25" strokeWidth="6" strokeLinecap="round" />
      <path d="M160 752 151 796" stroke="#c9a66b" strokeWidth="2" strokeLinecap="round" />
      <circle className="ember" cx="200" cy="561" r="4.5" fill="#ffcf8a" />
    </svg>
  );
}

// A fanned bundle of incense sticks tied with a band. Stands in for product photography.
export function IncenseBundle({ className }: Art) {
  const sticks = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  return (
    <svg viewBox="0 0 400 500" fill="none" aria-hidden="true" className={className}>
      {sticks.map((i) => {
        const top = { x: 200 + i * 34, y: 70 + Math.abs(i) * 14 };
        const base = { x: 200 + i * 5, y: 470 };
        // The scented coating covers the upper three quarters; bare bamboo shows below it.
        const mid = { x: top.x + (base.x - top.x) * 0.74, y: top.y + (base.y - top.y) * 0.74 };
        return (
          <g key={i} strokeLinecap="round">
            <path d={`M${mid.x} ${mid.y} ${base.x} ${base.y}`} stroke="#c9a66b" strokeWidth="2" />
            <path d={`M${top.x} ${top.y} ${mid.x} ${mid.y}`} stroke="#6b4a2c" strokeWidth="6" />
            <path d={`M${top.x} ${top.y} ${mid.x} ${mid.y}`} stroke="#e2b25c" strokeOpacity="0.25" strokeWidth="1.5" />
            <circle className="ember" cx={top.x} cy={top.y} r="3.5" fill="#ffb347" />
          </g>
        );
      })}
      <rect x="166" y="352" width="68" height="26" rx="4" fill="#120d0b" stroke="#e2b25c" strokeWidth="1.5" />
      <path d="M176 365h48" stroke="#e2b25c" strokeWidth="1" strokeDasharray="2 4" />
    </svg>
  );
}

// A slowly turning lotus mandala. The outer box takes position and scroll motion; the inner drawing spins.
export function Mandala({ className }: Art) {
  const petals = Array.from({ length: 24 }, (_, i) => i * 15);
  return (
    <div aria-hidden="true" className={className}>
    <svg viewBox="-200 -200 400 400" fill="none" stroke="currentColor" strokeWidth="0.7" className="spin-slow size-full">
      <circle r="198" />
      <circle r="150" />
      <circle r="92" />
      <circle r="40" />
      <circle r="12" />
      {petals.map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M0-40C14-62 14-78 0-92-14-78-14-62 0-40Z" />
          <path d="M0-92C22-112 22-134 0-150-22-134-22-112 0-92Z" />
          <path d="M0-150C12-165 12-183 0-198" />
          <circle cy="-171" r="3" />
        </g>
      ))}
    </svg>
    </div>
  );
}

// Growth rings, like a tree's: one family, many years.
export function Rings({ className }: Art) {
  const rings = Array.from({ length: 13 }, (_, i) => 14 + i * 15);
  return (
    <svg viewBox="-200 -200 400 400" fill="none" stroke="currentColor" aria-hidden="true" className={className}>
      {rings.map((r, i) => (
        <circle key={r} r={r} strokeWidth={i % 4 === 3 ? 1.6 : 0.7} strokeDasharray={i % 3 === 1 ? "3 6" : undefined} transform={`rotate(${i * 23})`} />
      ))}
      <circle r="4" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Routes fanning out from a single point: one town, then everywhere.
export function Routes({ className }: Art) {
  const arcs = [70, 130, 190, 250, 310, 370];
  return (
    <svg viewBox="0 0 440 300" fill="none" stroke="currentColor" aria-hidden="true" className={className}>
      {arcs.map((r, i) => (
        <g key={r}>
          <path d={`M${40 + r} 270A${r} ${r} 0 0 0 40 ${270 - r}`} strokeWidth="0.8" strokeDasharray={i % 2 ? "2 7" : undefined} />
          <circle cx={40 + r * Math.cos(((20 + i * 9) * Math.PI) / 180)} cy={270 - r * Math.sin(((20 + i * 9) * Math.PI) / 180)} r="3.5" fill="currentColor" stroke="none" />
        </g>
      ))}
      <circle cx="40" cy="270" r="7" fill="#e0672f" stroke="none" className="ember" />
      <circle cx="40" cy="270" r="14" strokeWidth="0.8" />
    </svg>
  );
}

// An arched doorway: the shop the name began in. Deliberately abstract.
export function Arch({ className }: Art) {
  return (
    <svg viewBox="0 0 300 360" fill="none" stroke="currentColor" aria-hidden="true" className={className}>
      {[0, 22, 44].map((o) => (
        <path key={o} d={`M${30 + o} 340V${150}A${120 - o} ${120 - o} 0 0 1 ${270 - o} 150V340`} strokeWidth={o ? 0.7 : 1.4} />
      ))}
      <path d="M10 340h280" strokeWidth="1.4" />
      <path d="M96 340v-70h108v70M96 270h108" strokeWidth="0.9" />
      <circle cx="150" cy="120" r="5" fill="#e0672f" stroke="none" className="ember" />
    </svg>
  );
}
