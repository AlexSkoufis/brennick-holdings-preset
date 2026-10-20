/**
 * A land survey plat drawn as hairlines: parcel boundaries, a meandering river
 * and survey annotations (invented lot numbers and bearings).
 * Purely decorative: hidden from assistive tech and never interactive.
 */
export function PlatLines({ variant = 'a', className }: { variant?: 'a' | 'b'; className?: string }) {
  const flip = variant === 'b';
  return (
    <svg
      className={className}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <g strokeWidth="1" vectorEffect="non-scaling-stroke">
        {/* river */}
        <path data-draw pathLength={1} d="M1180 -20 C1120 120 1240 220 1150 330 S1010 470 1080 600 S1220 780 1120 920" strokeWidth="1.4" />
        <path data-draw pathLength={1} d="M1214 -20 C1154 120 1274 220 1184 330 S1044 470 1114 600 S1254 780 1154 920" strokeDasharray="2 6" />
        {/* parcels */}
        <path data-draw pathLength={1} d="M860 60 L1090 40 L1140 250 L900 300 Z" />
        <path data-draw pathLength={1} d="M900 300 L1140 250 L1060 470 L940 520 Z" />
        <path data-draw pathLength={1} d="M940 520 L1060 470 L1090 700 L960 760 Z" />
        <path data-draw pathLength={1} d="M600 120 L860 60 L900 300 L640 360 Z" />
        <path data-draw pathLength={1} d="M640 360 L900 300 L940 520 L690 600 Z" />
        <path data-draw pathLength={1} d="M690 600 L940 520 L960 760 L720 840 Z" />
        <path data-draw pathLength={1} d="M1290 120 L1440 90 M1260 420 L1440 380 M1250 690 L1440 720" />
        {/* section lines */}
        <path data-draw pathLength={1} d="M560 0 L760 900" strokeDasharray="10 8" />
        <path data-draw pathLength={1} d="M420 470 L1440 250" strokeDasharray="1 7" />
      </g>
      <g fill="currentColor" stroke="none" fontFamily="IBM Plex Mono, monospace" fontSize="13" letterSpacing="1.5">
        <text x="728" y="230">LOT 3</text>
        <text x="728" y="250" fontSize="11">82 AC.</text>
        <text x="770" y="458">LOT 4</text>
        <text x="770" y="478" fontSize="11">107 AC.</text>
        <text x="960" y="170" fontSize="11">N 42° E</text>
        <text x="1000" y="620" fontSize="11">S 07° W</text>
        <text x="1196" y="520" fontSize="11" transform="rotate(-62 1196 520)">RIVER</text>
      </g>
      <g stroke="currentColor" strokeWidth="1">
        <circle cx="900" cy="300" r="4" />
        <circle cx="940" cy="520" r="4" />
        <circle cx="640" cy="360" r="4" />
      </g>
    </svg>
  );
}
