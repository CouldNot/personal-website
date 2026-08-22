// Inlined from Phosphor Icons ("arrow-up-right", regular weight) instead of
// fetching it at runtime via @iconify/react. That component renders an
// empty placeholder on first paint and swaps in the real icon after mount,
// which is safe on a true cold load but can disagree with a warm client-side
// icon cache during Fast Refresh, producing a hydration mismatch warning.
// A static inline SVG has no async state, so it can never mismatch.
export default function ArrowUpRight() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      fill="none"
      aria-hidden="true"
    >
      <line
        x1="64"
        y1="192"
        x2="192"
        y2="64"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <polyline
        points="88 64 192 64 192 168"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  );
}
