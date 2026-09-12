import React from 'react';
import { motion } from 'framer-motion';

export const SamuraiRonin: React.FC<{ action?: string }> = ({ action = 'idle' }) => {
  const bodyVariants: Record<string, any> = {
    idle: {
      y: [0, -4, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
    },

    attack: {
      x: [0, 45, -15, 0],
      y: [0, 6, -3, 0],
      transition: { duration: 0.5, ease: 'backOut' }
    },
    celebrate: {
      y: [0, -20, 0],
      scale: [1, 1.05, 1],
      transition: { duration: 0.8, ease: 'easeOut' }
    },
    hit: {
      x: [0, -22, 10, -5, 0],
      transition: { duration: 0.35 }
    },
    meditate: {
      y: [0, 8, 3, 8],
      scale: [1, 0.96, 1],
      transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  const bladeVariants: Record<string, any> = {
    idle: {
      rotate: [-5, 5, -5],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
    },
    attack: {
      rotate: [-60, 65, -10],
      x: [0, 40, 0],
      transition: { duration: 0.45, ease: 'easeOut' }
    },
    celebrate: {
      rotate: [0, -85, -80],
      y: [0, -35, -30],
      transition: { duration: 0.8 }
    },
    meditate: {
      rotate: [-15, -15, -15],
      y: [8, 8, 8],
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="relative w-64 h-72 flex items-center justify-center select-none">
      {/* Blood Moon / Red Ring Background */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute w-52 h-52 rounded-full border border-red-600/30 border-dashed"
      />
      <motion.div
        animate={{ scale: [0.98, 1.06, 0.98], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-44 h-44 rounded-full bg-red-600/15 blur-xl pointer-events-none"
      />

      {/* Dynamic Sword Slash Arc on Attack */}
      {action === 'attack' && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0, rotate: -25 }}
          animate={{ opacity: [0, 1, 0], scaleX: [0.2, 1.4, 0.8], x: [-10, 60, 100] }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="absolute z-20 w-44 h-3 bg-gradient-to-r from-transparent via-white to-red-500 rounded-full shadow-[0_0_20px_#ef4444]"
        />
      )}

      {/* Samurai Character Rig SVG */}
      <motion.svg
        viewBox="0 0 200 240"
        className="w-full h-full relative z-10 filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.85)]"
      >
        {/* Shadow */}
        <ellipse cx="100" cy="225" rx="42" ry="8" fill="rgba(8, 8, 10, 0.7)" />

        {/* Floating Sakura Petals behind Samurai */}
        <circle cx="50" cy="110" r="3" fill="#f472b6" opacity="0.6" />
        <circle cx="155" cy="70" r="2.5" fill="#f472b6" opacity="0.8" />
        <circle cx="160" cy="170" r="3.5" fill="#f472b6" opacity="0.5" />

        {/* Main Body */}
        <motion.g variants={bodyVariants} animate={action}>
          {/* Back Katana Sheath (Saya) */}
          <path
            d="M60 170 L 140 100"
            stroke="#1c1917"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M132 107 L 142 98"
            stroke="#dc2626"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Lower Hakama Pants */}
          <path
            d="M72 145 L 60 215 L 94 215 L 100 160 L 106 215 L 140 215 L 128 145 Z"
            fill="#171717"
            stroke="#262626"
            strokeWidth="1.5"
          />

          {/* Red War Obi (Sash) */}
          <rect x="74" y="140" width="52" height="12" rx="2" fill="#b91c1c" />
          <path d="M96 152 L 92 185 M104 152 L 108 180" stroke="#dc2626" strokeWidth="4" />

          {/* Kimono / Lacquer Armor Torso */}
          <path
            d="M74 95 L 100 135 L 126 95 L 126 142 L 74 142 Z"
            fill="#1c1917"
            stroke="#450a0a"
            strokeWidth="1.5"
          />
          {/* Crossed Lapels */}
          <line x1="74" y1="95" x2="108" y2="142" stroke="#dc2626" strokeWidth="2.5" />
          <line x1="126" y1="95" x2="94" y2="142" stroke="#f59e0b" strokeWidth="2" />

          {/* Pauldron Armor Shoulders */}
          <path d="M62 96 C 62 88, 76 88, 76 96 Z" fill="#991b1b" stroke="#dc2626" />
          <path d="M124 96 C 124 88, 138 88, 138 96 Z" fill="#991b1b" stroke="#dc2626" />

          {/* Menpo Mask & Face */}
          <ellipse cx="100" cy="80" rx="14" ry="14" fill="#0f0f12" />
          {/* Menpo Lower Face Guard */}
          <path d="M88 80 C 88 95, 112 95, 112 80 Z" fill="#7f1d1d" stroke="#b91c1c" strokeWidth="1" />
          {/* Intense Eyes */}
          <line x1="91" y1="76" x2="98" y2="78" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="109" y1="76" x2="102" y2="78" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

          {/* Kasa Straw / Ronin Hat */}
          <path
            d="M60 70 Q 100 45 140 70 L 100 52 Z"
            fill="#451a03"
            stroke="#78350f"
            strokeWidth="2"
          />
          <line x1="100" y1="52" x2="100" y2="70" stroke="#f59e0b" strokeWidth="2" />
        </motion.g>

        {/* Drawn Muramasa Katana */}
        <motion.g
          variants={bladeVariants}
          animate={action}
          style={{ originX: '115px', originY: '140px' }}
        >
          {/* Tsuka (Hilt) */}
          <line x1="115" y1="140" x2="132" y2="155" stroke="#7f1d1d" strokeWidth="5" strokeLinecap="round" />
          {/* Tsuba (Guard) */}
          <line x1="126" y1="142" x2="134" y2="134" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          {/* Katana Steel Blade */}
          <path
            d="M130 138 Q 165 95 185 45"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="4"
            strokeLinecap="round"
            filter="drop-shadow(0 0 5px rgba(255,255,255,0.8))"
          />
          {/* Blade Edge Red Glow */}
          <path
            d="M131 138 Q 166 96 186 46"
            fill="none"
            stroke="#dc2626"
            strokeWidth="1.5"
          />
        </motion.g>
      </motion.svg>
    </div>
  );
};
