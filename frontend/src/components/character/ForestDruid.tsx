import React from 'react';
import { motion } from 'framer-motion';

export const ForestDruid: React.FC<{ action?: string }> = ({ action = 'idle' }) => {
  // Action variants
  const bodyVariants: Record<string, any> = {
    idle: {
      y: [0, -5, 0],
      transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
    },

    attack: {
      y: [0, -15, 5, 0],
      x: [0, 20, -5, 0],
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    celebrate: {
      y: [0, -25, -18, -25, 0],
      rotate: [0, -2, 2, 0],
      transition: { duration: 1.2, ease: 'easeInOut' }
    },
    hit: {
      x: [0, -18, 12, -6, 0],
      transition: { duration: 0.4 }
    },
    meditate: {
      y: [0, 6, 2, 6],
      scale: [1, 0.96, 1],
      transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  const staffVariants: Record<string, any> = {
    idle: {
      rotate: [-1, 2, -1],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
    },
    attack: {
      rotate: [-10, 45, -5, 0],
      x: [0, 30, -5, 0],
      y: [0, -20, 0, 0],
      transition: { duration: 0.6, ease: 'backOut' }
    },
    celebrate: {
      rotate: [0, 30, 15, 30, 0],
      y: [0, -30, -20, -30, 0],
      transition: { duration: 1.2 }
    },
    meditate: {
      rotate: [5, 5, 5],
      y: [6, 6, 6],
      transition: { duration: 0.5 }
    }
  };

  const orbGlowVariants: Record<string, any> = {
    idle: {
      scale: [1, 1.25, 1],
      opacity: [0.7, 1, 0.7],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
    },
    attack: {
      scale: [1, 2.8, 1],
      opacity: [0.8, 1, 0.8],
      transition: { duration: 0.6 }
    },
    celebrate: {
      scale: [1, 2.2, 1.8, 1],
      opacity: 1,
      transition: { duration: 1.2 }
    },
    meditate: {
      scale: [1.2, 1.9, 1.2],
      opacity: [0.8, 1, 0.8],
      transition: { duration: 1.5, repeat: Infinity }
    }
  };

  return (
    <div className="relative w-64 h-72 flex items-center justify-center select-none">
      {/* Background Magic Circle */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute w-52 h-52 rounded-full border border-emerald-500/20 border-dashed"
      />
      <motion.div
        animate={{ scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-44 h-44 rounded-full bg-emerald-500/10 blur-xl pointer-events-none"
      />

      {/* Druid Character Rig SVG */}
      <motion.svg
        viewBox="0 0 200 240"
        className="w-full h-full relative z-10 filter drop-shadow-[0_10px_15px_rgba(6,78,59,0.5)]"
      >
        {/* Shadow */}
        <ellipse cx="100" cy="225" rx="45" ry="9" fill="rgba(2, 21, 13, 0.6)" />

        {/* Action: Spell Effect Slash / Vines */}
        {action === 'attack' && (
          <motion.g
            initial={{ opacity: 0, scale: 0.2, x: 120 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.8, 2.2], x: [120, 180, 210] }}
            transition={{ duration: 0.6 }}
          >
            <path
              d="M110 90 Q 150 40 190 90 T 230 70"
              fill="none"
              stroke="#34d399"
              strokeWidth="6"
              strokeLinecap="round"
              filter="drop-shadow(0 0 8px #10b981)"
            />
            <circle cx="190" cy="90" r="10" fill="#6ee7b7" />
            <circle cx="210" cy="75" r="6" fill="#a7f3d0" />
          </motion.g>
        )}

        {/* Action: Celebrate ascension beams */}
        {action === 'celebrate' && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <line x1="100" y1="20" x2="100" y2="0" stroke="#fbbf24" strokeWidth="3" />
            <line x1="60" y1="35" x2="45" y2="15" stroke="#fbbf24" strokeWidth="3" />
            <line x1="140" y1="35" x2="155" y2="15" stroke="#fbbf24" strokeWidth="3" />
          </motion.g>
        )}

        {/* Main Druid Body */}
        <motion.g variants={bodyVariants} animate={action}>
          {/* Flowing Leaf Mantle / Cape */}
          <motion.path
            d="M65 95 C 40 140, 50 195, 60 215 C 80 210, 120 210, 140 215 C 150 195, 160 140, 135 95 Z"
            fill="#064e3b"
            stroke="#047857"
            strokeWidth="2"
            animate={{
              d: [
                "M65 95 C 40 140, 50 195, 60 215 C 80 210, 120 210, 140 215 C 150 195, 160 140, 135 95 Z",
                "M65 95 C 36 142, 47 197, 56 216 C 80 212, 120 212, 144 216 C 153 197, 164 142, 135 95 Z",
                "M65 95 C 40 140, 50 195, 60 215 C 80 210, 120 210, 140 215 C 150 195, 160 140, 135 95 Z"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Robe Body */}
          <path
            d="M75 100 L 125 100 L 132 210 L 68 210 Z"
            fill="#022c22"
            stroke="#065f46"
            strokeWidth="2"
          />

          {/* Golden Rune Vestment */}
          <path
            d="M92 100 L 100 135 L 108 100 Z"
            fill="#fbbf24"
            opacity="0.9"
          />
          <path
            d="M97 135 L 97 195 M103 135 L 103 195"
            stroke="#34d399"
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Belt */}
          <rect x="74" y="145" width="52" height="8" rx="3" fill="#78350f" />
          <circle cx="100" cy="149" r="6" fill="#10b981" stroke="#34d399" strokeWidth="2" />

          {/* Head & Hood */}
          <path
            d="M78 80 C 78 50, 122 50, 122 80 C 122 102, 78 102, 78 80 Z"
            fill="#064e3b"
            stroke="#10b981"
            strokeWidth="1.5"
          />
          {/* Inner Face Shadow */}
          <ellipse cx="100" cy="82" rx="14" ry="12" fill="#02150d" />
          {/* Glowing Eyes */}
          <circle cx="95" cy="81" r="2.5" fill="#34d399" />
          <circle cx="105" cy="81" r="2.5" fill="#34d399" />

          {/* Antler Crown */}
          <g stroke="#d97706" strokeWidth="3" strokeLinecap="round">
            {/* Left Horn */}
            <path d="M85 58 C 75 45, 65 35, 55 30 M72 45 L 63 48 M78 38 L 82 28" />
            {/* Right Horn */}
            <path d="M115 58 C 125 45, 135 35, 145 30 M128 45 L 137 48 M122 38 L 118 28" />
          </g>

          {/* Glowing Spores on Antlers */}
          <circle cx="55" cy="30" r="3" fill="#34d399" />
          <circle cx="145" cy="30" r="3" fill="#34d399" />
          <circle cx="82" cy="28" r="2.5" fill="#fbbf24" />
          <circle cx="118" cy="28" r="2.5" fill="#fbbf24" />
        </motion.g>

        {/* Druid Staff Rig */}
        <motion.g
          variants={staffVariants}
          animate={action}
          style={{ originX: '145px', originY: '170px' }}
        >
          {/* Staff Shaft */}
          <path
            d="M142 45 Q 146 130 144 220"
            stroke="#78350f"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Staff Head Carving */}
          <path
            d="M136 50 C 130 35, 140 25, 145 28 C 150 25, 160 35, 154 50 Z"
            fill="#92400e"
            stroke="#b45309"
            strokeWidth="1.5"
          />
          {/* Emerald Focus Crystal */}
          <motion.circle
            cx="145"
            cy="36"
            r="8"
            fill="#34d399"
            variants={orbGlowVariants}
            animate={action}
          />
          <circle cx="145" cy="36" r="4" fill="#ecfdf5" />
        </motion.g>
      </motion.svg>
    </div>
  );
};
