// The only place the logo is defined. To swap in the AW monogram, replace this SVG.
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 236 16" role="img" aria-label="Ankur Worldwide" className={className} fill="currentColor">
      <text x="0" y="13" textLength="236" lengthAdjust="spacing" fontSize="14" className="font-body">
        <tspan fontWeight="700">ANKUR</tspan> <tspan fontWeight="300">WORLDWIDE</tspan>
      </text>
    </svg>
  );
}
