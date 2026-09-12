import React from 'react';
import { motion } from 'framer-motion';

export const SolarBotanist: React.FC<{ action?: string }> = ({ action = 'idle' }) => {
  const bodyVariants = {
    idle: {
      y: [0, -4, 0],
      transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const },
    },
    attack: {
      x: [0, 25, -6, 0],
      y: [0, -10, 4, 0],
      transition: { duration: 0.5, ease: 'backOut' as const },
    },
    celebrate: {
      y: [0, -20, -14, 0],
      transition: { duration: 1, ease: 'easeInOut' as const },
    },
    hit: {
      x: [0, -15, 10, -4, 0],
      transition: { duration: 0.35 },
    },
    meditate: {
      y: [0, 6, 2, 6],
      scale: [1, 0.97, 1],
      transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' as const },
    },
  };

  const staffVariants = {
    idle: {
      rotate: [-2, 3, -2],
      transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
    attack: {
      rotate: [-35, 55, -5],
      x: [0, 30, 0],
      transition: { duration: 0.5 },
    },
    celebrate: {
      rotate: [0, 25, 20],
      y: [0, -25, -20],
      transition: { duration: 0.9 },
    },
    meditate: {
      rotate: [5, 5, 5],
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="relative w-64 h-72 flex items-center justify-center select-none">
      {/* Solar Flare Aura */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' as const }}
        className="absolute w-52 h-52 rounded-full border border-emerald-400/25 border-dashed"
      />
      <motion.div
        animate={{ scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const }}
        className="absolute w-44 h-44 rounded-full bg-emerald-500/15 blur-xl pointer-events-none"
      />

      <motion.svg
        viewBox="0 0 200 240"
        className="w-full h-full relative z-10 filter drop-shadow-[0_10px_15px_rgba(16,185,129,0.4)]"
      >
        <ellipse cx="100" cy="225" rx="45" ry="9" fill="rgba(8, 20, 15, 0.6)" />

        {/* Attack Solar Flora Beam */}
        {action === 'attack' && (
          <motion.g
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1.8, 2.2], x: [110, 170, 200] }}
            transition={{ duration: 0.5 }}
          >
            <path
              d="M100 80 Q 145 35 190 75"
              fill="none"
              stroke="#34d399"
              strokeWidth="5"
              strokeLinecap="round"
              filter="drop-shadow(0 0 8px #10b981)"
            />
            <circle cx="190" cy="75" r="9" fill="#fef08a" />
          </motion.g>
        )}

        {/* Botanist Body */}
        <motion.g variants={bodyVariants} animate={action}>
          {/* Biophilic Robe */}
          <path
            d="M68 95 L 48 212 L 152 212 L 132 95 Z"
            fill="#064e3b"
            stroke="#10b981"
            strokeWidth="1.5"
          />

          {/* Golden Solar Vestment */}
          <path d="M85 98 L 100 145 L 115 98 Z" fill="#f59e0b" opacity="0.9" />
          <line x1="100" y1="145" x2="100" y2="205" stroke="#34d399" strokeWidth="2" strokeDasharray="3 3" />

          {/* Eco Utility Belt */}
          <rect x="72" y="145" width="56" height="7" rx="3" fill="#14532d" />
          <circle cx="100" cy="148" r="5" fill="#38bdf8" />

          {/* Head & Leaf Cowl */}
          <path d="M78 80 C 78 52, 122 52, 122 80 C 122 98, 78 98, 78 80 Z" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
          {/* Face Shadow */}
          <ellipse cx="100" cy="80" rx="14" ry="11" fill="#022c22" />
          {/* Cyan Glow Eyes */}
          <circle cx="95" cy="80" r="2.5" fill="#00f2fe" />
          <circle cx="105" cy="80" r="2.5" fill="#00f2fe" />

          {/* Sprouting Foliage Crown */}
          <path d="M92 52 Q 88 40 82 44 Q 90 48 94 54" fill="#34d399" />
          <path d="M108 52 Q 112 40 118 44 Q 110 48 106 54" fill="#34d399" />
          <circle cx="100" cy="48" r="3" fill="#fbbf24" />
        </motion.g>

        {/* Photonic Resonance Staff Rig */}
        <motion.g
          variants={staffVariants}
          animate={action}
          style={{ originX: '142px', originY: '170px' }}
        >
          {/* Staff Shaft */}
          <path d="M140 45 L 142 220" stroke="#166534" strokeWidth="4.5" strokeLinecap="round" />
          {/* Solar Prism Head */}
          <circle cx="140" cy="40" r="10" fill="#f59e0b" filter="drop-shadow(0 0 8px #fbbf24)" />
          <circle cx="140" cy="40" r="5" fill="#fef08a" />
        </motion.g>
      </motion.svg>
    </div>
  );
};
