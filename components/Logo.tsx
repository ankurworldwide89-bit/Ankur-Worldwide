// The only place the logo is defined. To swap in the AW monogram, replace this SVG.
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 262 16" role="img" aria-label="Ankur Worldwide" className={className} fill="currentColor">
      <path d="M8 0 16 8 8 16 0 8Z" fill="#e2b25c" />
      <path d="M8 4.5 11.5 8 8 11.5 4.5 8Z" fill="#120d0b" />
      <text x="26" y="13" textLength="236" lengthAdjust="spacing" fontSize="14" className="font-body">
        <tspan fontWeight="800">ANKUR</tspan> <tspan fontWeight="300">WORLDWIDE</tspan>
      </text>
    </svg>
  );
}
