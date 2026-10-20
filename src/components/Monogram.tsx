/** BH monogram in a surveyor's circle. Decorative; the brand name is always written out beside it. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="23" fill="var(--forest)" />
      <circle cx="24" cy="24" r="19.5" fill="none" stroke="var(--bronze)" strokeWidth="0.75" />
      <path d="M24 2.5v3.2M24 42.3v3.2M2.5 24h3.2M42.3 24h3.2" stroke="var(--bronze)" strokeWidth="0.75" />
      <text
        x="24"
        y="30.2"
        textAnchor="middle"
        fontFamily="Cormorant Garamond Variable, Cormorant Garamond, Georgia, serif"
        fontSize="17"
        fontWeight="500"
        fill="var(--limestone)"
        letterSpacing="-0.5"
      >
        BH
      </text>
    </svg>
  );
}
