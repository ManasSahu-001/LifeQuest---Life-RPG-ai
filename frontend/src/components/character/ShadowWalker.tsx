import React from 'react';
import { motion } from 'framer-motion';

export const ShadowWalker: React.FC<{ action?: string }> = ({ action = 'idle' }) => {
  const bodyVariants = {
    idle: {
      y: [0, -5, 0],
      transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const },
    },
    attack: {
      x: [0, 30, -10, 0],
      y: [0, -12, 2, 0],
      transition: { duration: 0.45, ease: 'backOut' as const },
    },
    celebrate: {
      y: [0, -25, -18, 0],
      transition: { duration: 0.9, ease: 'easeInOut' as const },
    },
    hit: {
      x: [0, -18, 12, -5, 0],
      transition: { duration: 0.35 },
    },
    meditate: {
      y: [0, 6, 2, 6],
      scale: [1, 0.98, 1],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
    },
  };

  const handVariants = {
    idle: {
      scale: [1, 1.08, 1],
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
    attack: {
      x: [0, 20, 0],
      scale: [1, 1.3, 1],
      transition: { duration: 0.45 },
    },
    celebrate: {
      y: [0, -20, -15],
      transition: { duration: 0.8 },
    },
    meditate: {
      scale: [0.95, 0.95, 0.95],
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="relative w-64 h-72 flex items-center justify-center select-none">
      {/* Red Rift Energy Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' as const }}
        className="absolute w-52 h-52 rounded-full border border-red-600/35 border-dashed"
      />
      <motion.div
        animate={{ scale: [0.95, 1.12, 0.95], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const }}
        className="absolute w-44 h-44 rounded-full bg-gradient-to-t from-red-600/25 via-pink-900/15 to-cyan-500/15 blur-xl"
      />

      {/* Main Character Rig */}
      <motion.div
        variants={bodyVariants}
        animate={action}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Head & Psionic Band */}
        <div className="relative">
          <svg width="76" height="74" viewBox="0 0 76 74" fill="none">
            {/* Retro Hair & Head */}
            <path
              d="M38 6 C22 6 16 18 16 38 C16 54 26 66 38 66 C50 66 60 54 60 38 C60 18 54 6 38 6 Z"
              fill="#181d33"
              stroke="#ff0f3f"
              strokeWidth="2"
            />
            {/* Telekinetic Focus Band */}
            <rect x="18" y="24" width="40" height="7" rx="2" fill="#ff0f3f" opacity="0.85" filter="drop-shadow(0 0 8px #ff0f3f)" />
            {/* Expressive Eyes */}
            <circle cx="30" cy="40" r="3.5" fill="#f8fafc" />
            <circle cx="46" cy="40" r="3.5" fill="#f8fafc" />
            <circle cx="30" cy="40" r="1.5" fill="#06b6d4" />
            <circle cx="46" cy="40" r="1.5" fill="#06b6d4" />
          </svg>
        </div>

        {/* Retro Denim Jacket Body */}
        <div className="relative -mt-2">
          <svg width="100" height="110" viewBox="0 0 100 110" fill="none">
            {/* Denim Jacket */}
            <path
              d="M26 0 L74 0 L88 35 L80 105 L20 105 L12 35 Z"
              fill="#0d1428"
              stroke="#1e293b"
              strokeWidth="2"
            />
            {/* Collar & Buttons */}
            <path d="M38 0 L50 20 L62 0" stroke="#ff0f3f" strokeWidth="2" fill="none" />
            <circle cx="50" cy="35" r="2.5" fill="#f59e0b" />
            <circle cx="50" cy="55" r="2.5" fill="#f59e0b" />
            <circle cx="50" cy="75" r="2.5" fill="#f59e0b" />
            {/* Hellfire Pocket Badge */}
            <rect x="25" y="32" width="16" height="14" rx="2" fill="#181f3d" stroke="#ff0f3f" strokeWidth="1" />
            <path d="M33 36 L36 43 L30 43 Z" fill="#ff0f3f" />
          </svg>
        </div>
      </motion.div>

      {/* Telekinetic Raised Hand */}
      <motion.div
        variants={handVariants}
        animate={action}
        className="absolute right-8 top-16 z-20 pointer-events-none"
      >
        <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
          <circle cx="20" cy="20" r="12" fill="none" stroke="#ff0f3f" strokeWidth="2" opacity="0.6" strokeDasharray="3 3" />
          <circle cx="20" cy="20" r="6" fill="#ff0f3f" filter="drop-shadow(0 0 10px #ff0f3f)" />
          <circle cx="20" cy="20" r="2" fill="#ffffff" />
        </svg>
      </motion.div>
    </div>
  );
};
