import React from 'react';
import { motion } from 'framer-motion';

export const PaladinKnight: React.FC<{ action?: string }> = ({ action = 'idle' }) => {
  const bodyVariants = {
    idle: {
      y: [0, -3, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
    },
    attack: {
      x: [0, 25, -8, 0],
      y: [0, -6, 2, 0],
      transition: { duration: 0.5, ease: 'backOut' as const },
    },
    celebrate: {
      y: [0, -22, -18, 0],
      transition: { duration: 1, ease: 'easeInOut' as const },
    },
    hit: {
      x: [0, -16, 8, -4, 0],
      transition: { duration: 0.35 },
    },
    meditate: {
      y: [0, 5, 2, 5],
      scale: [1, 0.98, 1],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
    },
  };

  const swordVariants = {
    idle: {
      rotate: [-3, 3, -3],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
    },
    attack: {
      rotate: [-55, 65, -5],
      x: [0, 30, 0],
      transition: { duration: 0.5 },
    },
    celebrate: {
      rotate: [0, -80, -75],
      y: [0, -30, -25],
      transition: { duration: 0.9 },
    },
    meditate: {
      rotate: [0, 0, 0],
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="relative w-64 h-72 flex items-center justify-center select-none">
      {/* Holy Radiant Halo */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' as const }}
        className="absolute w-52 h-52 rounded-full border border-amber-500/25 border-dashed"
      />
      <motion.div
        animate={{ scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const }}
        className="absolute w-44 h-44 rounded-full bg-amber-500/15 blur-xl pointer-events-none"
      />

      <motion.svg
        viewBox="0 0 200 240"
        className="w-full h-full relative z-10 filter drop-shadow-[0_10px_15px_rgba(212,175,55,0.4)]"
      >
        <ellipse cx="100" cy="225" rx="45" ry="9" fill="rgba(18, 16, 14, 0.7)" />

        {/* Attack Golden Holy Slash */}
        {action === 'attack' && (
          <motion.g
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: [0, 1, 0], scaleX: [0.3, 1.7, 2.1] }}
            transition={{ duration: 0.5 }}
          >
            <path
              d="M75 110 Q 140 50 195 90"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="5"
              strokeLinecap="round"
              filter="drop-shadow(0 0 10px #f59e0b)"
            />
            <circle cx="195" cy="90" r="8" fill="#fef3c7" />
          </motion.g>
        )}

        {/* Paladin Armor Body */}
        <motion.g variants={bodyVariants} animate={action}>
          {/* Royal Cape */}
          <path
            d="M65 95 L 45 210 L 155 210 L 135 95 Z"
            fill="#7f1d1d"
            stroke="#991b1b"
            strokeWidth="1.5"
          />

          {/* Gilded Plate Armor */}
          <path
            d="M75 95 L 125 95 L 130 185 L 70 185 Z"
            fill="#d4af37"
            stroke="#f59e0b"
            strokeWidth="2"
          />

          {/* Sun Crest on Breastplate */}
          <circle cx="100" cy="130" r="12" fill="#78350f" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="100" cy="130" r="6" fill="#fbbf24" />

          {/* Pauldrons / Shoulder Plates */}
          <path d="M55 95 C 55 80, 80 80, 80 98 Z" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />
          <path d="M145 95 C 145 80, 120 80, 120 98 Z" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />

          {/* Knight Helm & Gilded Crown */}
          <path d="M78 80 C 78 50, 122 50, 122 80 C 122 98, 78 98, 78 80 Z" fill="#b45309" stroke="#d4af37" strokeWidth="2" />
          {/* T-Visor */}
          <path d="M85 75 L 115 75 M 100 75 L 100 90" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />
          {/* Crown */}
          <path d="M82 55 L 88 45 L 100 52 L 112 45 L 118 55 Z" fill="#fbbf24" stroke="#d4af37" strokeWidth="1.5" />
        </motion.g>

        {/* Sun-Forged Greatsword Rig */}
        <motion.g
          variants={swordVariants}
          animate={action}
          style={{ originX: '138px', originY: '150px' }}
        >
          {/* Crossguard & Pommel */}
          <line x1="126" y1="135" x2="150" y2="135" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
          <rect x="136" y="135" width="4" height="25" rx="1" fill="#78350f" />
          <circle cx="138" cy="162" r="4" fill="#fbbf24" />

          {/* Glowing Sun Blade */}
          <path
            d="M138 135 L 138 25 L 135 20 L 138 15 L 141 20 L 138 25 Z"
            fill="#fef08a"
            stroke="#fbbf24"
            strokeWidth="3"
            filter="drop-shadow(0 0 8px #f59e0b)"
          />
        </motion.g>
      </motion.svg>
    </div>
  );
};
