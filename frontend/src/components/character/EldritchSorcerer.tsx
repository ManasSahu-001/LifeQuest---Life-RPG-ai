import React from 'react';
import { motion } from 'framer-motion';

export const EldritchSorcerer: React.FC<{ action?: string }> = ({ action = 'idle' }) => {
  const bodyVariants = {
    idle: {
      y: [0, -6, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
    },
    attack: {
      x: [0, 25, -12, 0],
      y: [0, -10, 3, 0],
      transition: { duration: 0.5, ease: 'backOut' as const },
    },
    celebrate: {
      y: [0, -22, -16, 0],
      transition: { duration: 0.9, ease: 'easeInOut' as const },
    },
    hit: {
      x: [0, -16, 10, -4, 0],
      transition: { duration: 0.35 },
    },
    meditate: {
      y: [0, 4, 1, 4],
      scale: [1, 0.98, 1],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
    },
  };

  const staffVariants = {
    idle: {
      rotate: [-3, 3, -3],
      y: [0, -4, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
    },
    attack: {
      rotate: [-30, 45, -5],
      x: [0, 25, 0],
      transition: { duration: 0.5 },
    },
    celebrate: {
      rotate: [0, -60, -50],
      y: [0, -25, -20],
      transition: { duration: 0.8 },
    },
    meditate: {
      rotate: [5, 5, 5],
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="relative w-64 h-72 flex items-center justify-center select-none">
      {/* Necrotic Graveyard Sigil */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' as const }}
        className="absolute w-56 h-56 rounded-full border border-emerald-500/25 border-dashed"
      />
      <motion.div
        animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const }}
        className="absolute w-44 h-44 rounded-full bg-gradient-to-t from-emerald-900/30 to-purple-900/20 blur-xl"
      />

      {/* Main Sorcerer Rig */}
      <motion.div
        variants={bodyVariants}
        animate={action}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Hood & Glowing Eyes */}
        <div className="relative">
          <svg width="84" height="78" viewBox="0 0 84 78" fill="none">
            {/* Dark Hood */}
            <path
              d="M42 4 C24 4 10 24 12 50 C13 65 24 72 42 74 C60 72 71 65 72 50 C74 24 60 4 42 4 Z"
              fill="#0d141b"
              stroke="#10b981"
              strokeWidth="2"
            />
            {/* Hood Shadow Cavity */}
            <path
              d="M42 16 C30 16 22 28 22 46 C22 58 30 64 42 66 C54 64 62 58 62 46 C62 28 54 16 42 16 Z"
              fill="#05070a"
            />
            {/* Piercing Spectral Eyes */}
            <circle cx="34" cy="44" r="3.5" fill="#34d399" filter="drop-shadow(0 0 6px #10b981)" />
            <circle cx="50" cy="44" r="3.5" fill="#34d399" filter="drop-shadow(0 0 6px #10b981)" />
            <circle cx="34" cy="44" r="1.5" fill="#ffffff" />
            <circle cx="50" cy="44" r="1.5" fill="#ffffff" />
            {/* Forehead Occult Sigil */}
            <path d="M42 22 L45 28 L39 28 Z" fill="#8b5cf6" opacity="0.8" />
          </svg>
        </div>

        {/* Robe Body */}
        <div className="relative -mt-3">
          <svg width="110" height="120" viewBox="0 0 110 120" fill="none">
            {/* Shroud Mantle */}
            <path
              d="M30 0 L80 0 L95 40 L85 115 L25 115 L15 40 Z"
              fill="#0d141b"
              stroke="#162e24"
              strokeWidth="2"
            />
            {/* Chest Rune Trim */}
            <path d="M42 15 L55 35 L68 15" stroke="#10b981" strokeWidth="2" fill="none" opacity="0.8" />
            <path d="M55 35 L55 95" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" />
            {/* Belt of Souls */}
            <rect x="35" y="60" width="40" height="8" rx="2" fill="#14201c" stroke="#8b5cf6" strokeWidth="1.5" />
            <circle cx="55" cy="64" r="3" fill="#a855f7" />
          </svg>
        </div>
      </motion.div>

      {/* Soulforged Bone Staff */}
      <motion.div
        variants={staffVariants}
        animate={action}
        className="absolute right-6 top-8 z-20 pointer-events-none"
      >
        <svg width="45" height="180" viewBox="0 0 45 180" fill="none">
          {/* Bone Staff Shaft */}
          <line x1="22" y1="20" x2="22" y2="175" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
          <line x1="22" y1="20" x2="22" y2="175" stroke="#10b981" strokeWidth="1" strokeDasharray="8 6" opacity="0.7" />
          {/* Staff Headpiece: Skull & Floating Emerald Orb */}
          <path d="M12 25 C12 12 32 12 32 25 C32 35 12 35 12 25 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
          <circle cx="22" cy="10" r="7" fill="#10b981" filter="drop-shadow(0 0 10px #34d399)" />
          <circle cx="22" cy="10" r="3.5" fill="#ffffff" />
        </svg>
      </motion.div>
    </div>
  );
};
