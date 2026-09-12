import React from 'react';
import { motion } from 'framer-motion';

export const CyberNetrunner: React.FC<{ action?: string }> = ({ action = 'idle' }) => {
  const bodyVariants = {
    idle: {
      y: [0, -4, 0],
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
    attack: {
      x: [0, 30, -10, 0],
      y: [0, -8, 2, 0],
      transition: { duration: 0.45, ease: 'backOut' as const },
    },
    celebrate: {
      y: [0, -20, -15, 0],
      transition: { duration: 0.9, ease: 'easeInOut' as const },
    },
    hit: {
      x: [0, -18, 12, -4, 0],
      transition: { duration: 0.35 },
    },
    meditate: {
      y: [0, 5, 2, 5],
      scale: [1, 0.97, 1],
      transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' as const },
    },
  };

  const bladeVariants = {
    idle: {
      rotate: [-2, 4, -2],
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
    attack: {
      rotate: [-50, 60, -5],
      x: [0, 35, 0],
      transition: { duration: 0.45 },
    },
    celebrate: {
      rotate: [0, -75, -70],
      y: [0, -25, -20],
      transition: { duration: 0.8 },
    },
    meditate: {
      rotate: [-10, -10, -10],
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="relative w-64 h-72 flex items-center justify-center select-none">
      {/* Neon Cyber Ring Aura */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' as const }}
        className="absolute w-52 h-52 rounded-full border border-cyan-500/30 border-dashed"
      />
      <motion.div
        animate={{ scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const }}
        className="absolute w-44 h-44 rounded-full bg-cyan-500/15 blur-xl pointer-events-none"
      />

      {/* Holographic Hex Grid */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-48 h-48 border border-cyan-400 rotate-45" />
      </div>

      {/* Cyberpunk Character Rig SVG */}
      <motion.svg
        viewBox="0 0 200 240"
        className="w-full h-full relative z-10 filter drop-shadow-[0_10px_15px_rgba(0,240,255,0.4)]"
      >
        {/* Ground Neon Shadow */}
        <ellipse cx="100" cy="225" rx="45" ry="9" fill="rgba(0, 240, 255, 0.25)" />

        {/* Attack Laser Slash */}
        {action === 'attack' && (
          <motion.g
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: [0, 1, 0], scaleX: [0.2, 1.6, 2] }}
            transition={{ duration: 0.45 }}
          >
            <path
              d="M70 120 Q 140 60 195 100"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="5"
              strokeLinecap="round"
              filter="drop-shadow(0 0 10px #ff007f)"
            />
            <circle cx="195" cy="100" r="7" fill="#ff007f" />
          </motion.g>
        )}

        {/* Main Body */}
        <motion.g variants={bodyVariants} animate={action}>
          {/* Cyber Trenchcoat */}
          <path
            d="M65 95 L 45 210 L 80 205 L 100 135 L 120 205 L 155 210 L 135 95 Z"
            fill="#090b14"
            stroke="#00f0ff"
            strokeWidth="1.5"
          />

          {/* Under Armor Suit */}
          <rect x="78" y="98" width="44" height="60" rx="4" fill="#111827" stroke="#1f2937" strokeWidth="2" />

          {/* Glowing Neural Circuit Linework */}
          <path d="M85 108 L 100 125 L 115 108" stroke="#ff007f" strokeWidth="2" fill="none" />
          <path d="M100 125 L 100 155" stroke="#00f0ff" strokeWidth="2" fill="none" />
          <circle cx="100" cy="125" r="3.5" fill="#ffe600" />

          {/* High-Tech Collar & Helmet/Visor */}
          <path d="M80 82 C 80 55, 120 55, 120 82 C 120 95, 80 95, 80 82 Z" fill="#030712" stroke="#00f0ff" strokeWidth="2" />

          {/* Neon AR Visor */}
          <rect x="85" y="72" width="30" height="9" rx="2.5" fill="#00f0ff" filter="drop-shadow(0 0 6px #00f0ff)" />
          <rect x="90" y="74" width="20" height="3" fill="#ffffff" />

          {/* Cyber Audio Headset Antenna */}
          <line x1="80" y1="76" x2="74" y2="60" stroke="#ff007f" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="74" cy="60" r="2.5" fill="#ff007f" />
        </motion.g>

        {/* Monofilament Cyberblade Rig */}
        <motion.g
          variants={bladeVariants}
          animate={action}
          style={{ originX: '135px', originY: '145px' }}
        >
          {/* Hilt */}
          <rect x="133" y="130" width="6" height="26" rx="2" fill="#374151" stroke="#00f0ff" strokeWidth="1" />
          {/* Laser Blade */}
          <path
            d="M136 130 L 136 30"
            stroke="#00f0ff"
            strokeWidth="4"
            strokeLinecap="round"
            filter="drop-shadow(0 0 8px #00f0ff)"
          />
          <path
            d="M136 130 L 136 32"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.g>
      </motion.svg>
    </div>
  );
};
