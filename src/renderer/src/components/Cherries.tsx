interface CherriesProps {
  completed: number
  total: number
  /** Pixel size (square). */
  size?: number
  /** Gentle bounce + sparkle when every task is done. */
  celebrate?: boolean
}

/**
 * The signature cherry counter: two cherries with the completed count inside
 * the left fruit and the total count inside the right fruit  ->  (5) 🍒─🍒 (10)
 */
export function Cherries({
  completed,
  total,
  size = 56,
  celebrate = false
}: CherriesProps): JSX.Element {
  // Shrink the digits a touch for 2+ digit numbers so they stay inside the fruit.
  const fontFor = (n: number): number => (n >= 10 ? 13 : 16)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={celebrate ? 'animate-bounceCherry' : undefined}
    >
      {/* Forked stems meeting at a top junction */}
      <path
        d="M20 38 C22 28 30 24 32 13"
        stroke="#5C4033"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M44 38 C42 28 34 24 32 13"
        stroke="#5C4033"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Two symmetric leaves */}
      <path d="M32 14 C27 6 21 4 16 6 C18 12 25 15 32 14 Z" fill="#5C8A4A" />
      <path d="M32 14 C37 6 43 4 48 6 C46 12 39 15 32 14 Z" fill="#5C8A4A" />
      <path d="M32 14 C28 8 23 6 18 7 C20 11 26 13 32 14 Z" fill="#7BB661" />
      <path d="M32 14 C36 8 41 6 46 7 C44 11 38 13 32 14 Z" fill="#7BB661" />
      <path d="M31 13 C28 9 23 7 19 8" stroke="#8FCB6E" strokeWidth="1" fill="none" />
      <path d="M33 13 C36 9 41 7 45 8" stroke="#8FCB6E" strokeWidth="1" fill="none" />

      {/* Left cherry — completed */}
      <circle cx="20" cy="46" r="14" fill="#9E1B2C" />
      <circle cx="20" cy="45" r="13" fill="#D7263D" />
      <ellipse cx="15" cy="40" rx="3.4" ry="2.4" fill="#FF8FA8" opacity="0.9" />
      <text
        x="20"
        y="45"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Tahoma, monospace"
        fontWeight="bold"
        fontSize={fontFor(completed)}
        fill="#FFF5E4"
      >
        {completed}
      </text>

      {/* Right cherry — total */}
      <circle cx="44" cy="46" r="14" fill="#9E1B2C" />
      <circle cx="44" cy="45" r="13" fill="#D7263D" />
      <ellipse cx="39" cy="40" rx="3.4" ry="2.4" fill="#FF8FA8" opacity="0.9" />
      <text
        x="44"
        y="45"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Tahoma, monospace"
        fontWeight="bold"
        fontSize={fontFor(total)}
        fill="#FFF5E4"
      >
        {total}
      </text>

      {/* Sparkles on completion */}
      {celebrate && (
        <g className="animate-sparkle" fill="#FFE9F0">
          <path d="M8 16 l1.6 3.2 l3.2 1.6 l-3.2 1.6 l-1.6 3.2 l-1.6 -3.2 l-3.2 -1.6 l3.2 -1.6 z" />
          <path d="M56 22 l1.2 2.4 l2.4 1.2 l-2.4 1.2 l-1.2 2.4 l-1.2 -2.4 l-2.4 -1.2 l2.4 -1.2 z" />
        </g>
      )}
    </svg>
  )
}
