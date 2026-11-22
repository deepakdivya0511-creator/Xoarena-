import { motion } from 'motion/react';
import type { Player } from '../types/game';

interface MarkProps {
  size?: 'sm' | 'lg';
  animate?: boolean;
}

export function MarkX({ size = 'lg', animate = true }: MarkProps) {
  const strokeWidth = size === 'sm' ? 8 : 7.5;
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full overflow-visible"
      aria-hidden="true"
    >
      <motion.path
        d="M 22 23 C 36 38, 63 63, 79 78"
        fill="none"
        stroke="#1D4ED8"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0.4 } : false}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M 77 21 C 62 39, 39 62, 21 80"
        fill="none"
        stroke="#1D4ED8"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0.4 } : false}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.14, delay: animate ? 0.08 : 0, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

export function MarkO({ size = 'lg', animate = true }: MarkProps) {
  const strokeWidth = size === 'sm' ? 8 : 7.5;
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full overflow-visible"
      aria-hidden="true"
    >
      <motion.path
        d="M 52 19 C 73 18, 84 34, 82 52 C 80 71, 66 83, 48 82 C 29 81, 17 67, 19 49 C 21 30, 35 19, 54 21"
        fill="none"
        stroke="#DC2626"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0.4 } : false}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

export function HandDrawnGrid() {
  return (
    <svg
      viewBox="0 0 300 300"
      className="pointer-events-none absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      {/* Vertical line 1 */}
      <path
        d="M 100 8 C 98.5 95, 101.5 205, 99.5 292"
        fill="none"
        stroke="#334155"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Vertical line 2 */}
      <path
        d="M 200 10 C 201.5 110, 198.5 200, 200.5 290"
        fill="none"
        stroke="#334155"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Horizontal line 1 */}
      <path
        d="M 8 100 C 98 101.5, 204 98.5, 292 100.5"
        fill="none"
        stroke="#334155"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Horizontal line 2 */}
      <path
        d="M 10 200 C 108 198.5, 195 201.5, 290 199.5"
        fill="none"
        stroke="#334155"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface WinningStrikeLineProps {
  winningLine: readonly [number, number, number];
  winner: Player;
}

function getCellCenter(index: number): { x: number; y: number } {
  const col = index % 3;
  const row = Math.floor(index / 3);
  return {
    x: col * 100 + 50,
    y: row * 100 + 50,
  };
}

export function WinningStrikeLine({ winningLine, winner }: WinningStrikeLineProps) {
  const start = getCellCenter(winningLine[0]);
  const end = getCellCenter(winningLine[2]);

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.hypot(dx, dy) || 1;
  const overhang = 26;
  const ux = (dx / len) * overhang;
  const uy = (dy / len) * overhang;

  const x1 = start.x - ux;
  const y1 = start.y - uy;
  const x2 = end.x + ux;
  const y2 = end.y + uy;

  const strokeColor = winner === 'X' ? '#1D4ED8' : '#DC2626';

  return (
    <svg
      viewBox="0 0 300 300"
      className="pointer-events-none absolute inset-0 w-full h-full z-10 overflow-visible"
      aria-hidden="true"
    >
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={strokeColor}
        strokeWidth="8"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0.5 }}
        animate={{ pathLength: 1, opacity: 0.92 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

export function XOArenaLogo() {
  return (
    <svg
      viewBox="0 0 88 88"
      className="w-16 h-16 sm:w-20 sm:h-20 shrink-0"
      aria-hidden="true"
    >
      {/* Mini hand-drawn notebook doodle frame */}
      <rect
        x="6"
        y="6"
        width="76"
        height="76"
        rx="12"
        fill="#FFFDF8"
        stroke="#1E293B"
        strokeWidth="2.5"
        transform="rotate(-2 44 44)"
      />
      {/* Mini grid lines */}
      <path d="M 44 18 L 43 70" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <path d="M 18 44 L 70 43" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      {/* Mini X */}
      <path
        d="M 22 22 L 36 36 M 36 22 L 22 36"
        stroke="#1D4ED8"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Mini O */}
      <circle
        cx="59"
        cy="58"
        r="8.5"
        fill="none"
        stroke="#DC2626"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Mini secondary X */}
      <path
        d="M 53 23 L 65 35 M 65 23 L 53 35"
        stroke="#1D4ED8"
        strokeWidth="3.2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export function VictoryDoodle() {
  return (
    <motion.svg
      viewBox="0 0 120 72"
      className="w-28 h-16 mx-auto overflow-visible"
      aria-hidden="true"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Hand-drawn trophy / crown doodle */}
      <motion.path
        d="M 32 54 L 88 54 L 94 24 L 74 36 L 60 14 L 46 36 L 26 24 Z"
        fill="#FEF08A"
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35 }}
      />
      {/* Celebratory ink stars */}
      <motion.path
        d="M 14 18 L 18 24 M 18 18 L 14 24"
        stroke="#1D4ED8"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ scale: [0.85, 1.15, 1], rotate: [0, 12, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.4 }}
      />
      <motion.path
        d="M 102 16 L 108 22 M 108 16 L 102 22"
        stroke="#DC2626"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ scale: [0.85, 1.15, 1], rotate: [0, -12, 0] }}
        transition={{ duration: 0.6, delay: 0.15, repeat: Infinity, repeatDelay: 1.4 }}
      />
      <motion.circle
        cx="60"
        cy="8"
        r="3"
        fill="#1D4ED8"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.2 }}
      />
    </motion.svg>
  );
}

export function DefeatDoodle() {
  return (
    <motion.svg
      viewBox="0 0 120 72"
      className="w-28 h-16 mx-auto overflow-visible"
      aria-hidden="true"
      initial={{ x: -8, opacity: 0 }}
      animate={{ x: [0, -6, 6, -4, 4, 0], opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      {/* Hand-drawn crumpled/frown notebook circle */}
      <circle
        cx="60"
        cy="36"
        r="24"
        fill="#FEE2E2"
        stroke="#DC2626"
        strokeWidth="3"
        strokeDasharray="4 2"
      />
      {/* X eyes */}
      <path d="M 48 28 L 54 34 M 54 28 L 48 34" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M 66 28 L 72 34 M 72 28 L 66 34" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
      {/* Wobbly frown */}
      <path
        d="M 48 48 C 54 41, 66 41, 72 48"
        fill="none"
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

export function DrawDoodle() {
  return (
    <motion.svg
      viewBox="0 0 120 72"
      className="w-28 h-16 mx-auto overflow-visible"
      aria-hidden="true"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {/* Balanced pencil beam */}
      <motion.g
        animate={{ rotate: [-3, 3, 0] }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        style={{ transformOrigin: '60px 38px' }}
      >
        <path d="M 24 38 L 96 38" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
        {/* Left X */}
        <path d="M 26 16 L 38 28 M 38 16 L 26 28" stroke="#1D4ED8" strokeWidth="3.5" strokeLinecap="round" />
        {/* Right O */}
        <circle cx="88" cy="22" r="7" fill="none" stroke="#DC2626" strokeWidth="3.5" />
      </motion.g>
      {/* Fulcrum triangle */}
      <path
        d="M 52 56 L 60 40 L 68 56 Z"
        fill="#E2E8F0"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}
