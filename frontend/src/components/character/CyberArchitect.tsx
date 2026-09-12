import React from 'react';
import { motion } from 'framer-motion';

export const CyberArchitect: React.FC<{ action?: string }> = ({ action = 'idle' }) => {
  const bodyVariants: Record<string, any> = {
    idle: {
      y: [0, -3, 0],
      transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
    },

    attack: {
      y: [0, -8, 2, 0],
      x: [0, 15, -5, 0],
      transition: { duration: 0.5 }
    },
    celebrate: {
      y: [0, -22, -15, -20, 0],
      transition: { duration: 1 }
    },
    hit: {
      x: [0, -15, 10, -5, 0],
      transition: { duration: 0.3 }
    },
    meditate: {
      y: [0, 6, 2, 6],
      scale: [1, 0.96, 1],
      transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  const droneVariants: Record<string, any> = {
    idle: {
      y: [0, -10, 0],
      x: [0, 4, 0],
      rotate: [-4, 6, -4],
      transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
    },
    attack: {
      x: [0, 60, 40, 0],
      y: [0, -20, -10, 0],
      scale: [1, 1.25, 1],
      transition: { duration: 0.6, ease: 'easeOut' }
    },
    celebrate: {
      rotate: [0, 360],
      y: [0, -35, 0],
      transition: { duration: 1, ease: 'easeInOut' }
    },
    meditate: {
      y: [-25, -20, -25],
      rotate: [0, 360],
      transition: { duration: 3, repeat: Infinity, ease: 'linear' }
    }
  };

  return (
    <div className="relative w-64 h-72 flex items-center justify-center select-none">
      {/* Blueprint Grid / Radar Arc */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute w-52 h-52 rounded-full border border-cyan-500/25 border-dashed"
      />
      <div className="absolute w-44 h-44 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />

      {/* Hexagonal Shield on Hit */}
      {action === 'hit' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.1, 1] }}
          transition={{ duration: 0.4 }}
          className="absolute z-30 w-48 h-56 border-2 border-cyan-400 bg-cyan-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
        >
          <span className="text-cyan-300 font-mono text-xs uppercase tracking-widest font-bold">GRID DEFENSE 100%</span>
        </motion.div>
      )}

      {/* Construction Beam on Attack / Build */}
      {action === 'attack' && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: [0, 1, 0.8, 0], width: [0, 100, 130, 0] }}
          transition={{ duration: 0.55 }}
          className="absolute z-20 left-44 top-24 h-4 bg-gradient-to-r from-cyan-400 via-amber-300 to-transparent shadow-[0_0_15px_#00f2fe]"
        />
      )}

      <motion.svg
        viewBox="0 0 200 240"
        className="w-full h-full relative z-10 filter drop-shadow-[0_10px_20px_rgba(2,132,199,0.4)]"
      >
        {/* Shadow */}
        <ellipse cx="90" cy="225" rx="40" ry="7" fill="rgba(5, 11, 20, 0.7)" />

        {/* Hovering Companion Drone */}
        <motion.g
          variants={droneVariants}
          animate={action}
          style={{ originX: '155px', originY: '60px' }}
        >
          {/* Drone Chassis */}
          <ellipse cx="155" cy="60" rx="16" ry="9" fill="#0f172a" stroke="#0ea5e9" strokeWidth="2" />
          {/* Drone Thruster Glow */}
          <ellipse cx="145" cy="68" rx="4" ry="2" fill="#00f2fe" opacity="0.8" />
          <ellipse cx="165" cy="68" rx="4" ry="2" fill="#00f2fe" opacity="0.8" />
          {/* Drone Optical Eye */}
          <circle cx="155" cy="60" r="4.5" fill="#f59e0b" />
          <circle cx="155" cy="60" r="2" fill="#ffffff" />
          {/* Drone Scanner Cone */}
          <polygon
            points="145,69 165,69 180,105 130,105"
            fill="url(#droneBeam)"
            opacity="0.25"
          />
        </motion.g>

        <defs>
          <linearGradient id="droneBeam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Architect Main Body */}
        <motion.g variants={bodyVariants} animate={action}>
          {/* Utility Heavy Legs */}
          <rect x="68" y="150" width="18" height="65" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <rect x="94" y="150" width="18" height="65" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          {/* Steel Boots */}
          <rect x="64" y="205" width="24" height="12" rx="3" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
          <rect x="92" y="205" width="24" height="12" rx="3" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />

          {/* Exosuit Torso */}
          <path
            d="M65 95 L 115 95 L 110 152 L 70 152 Z"
            fill="#0f172a"
            stroke="#0ea5e9"
            strokeWidth="2"
          />
          {/* High-Vis Hazard Diagonal Stripes */}
          <rect x="74" y="132" width="32" height="8" rx="2" fill="#f59e0b" />
          <line x1="78" y1="132" x2="84" y2="140" stroke="#000000" strokeWidth="2" />
          <line x1="88" y1="132" x2="94" y2="140" stroke="#000000" strokeWidth="2" />
          <line x1="98" y1="132" x2="104" y2="140" stroke="#000000" strokeWidth="2" />

          {/* Arc Core / Power Unit */}
          <circle cx="90" cy="112" r="7" fill="#00f2fe" />
          <circle cx="90" cy="112" r="3" fill="#ffffff" />

          {/* Pauldrons / Shoulder armor */}
          <rect x="54" y="94" width="14" height="18" rx="3" fill="#1e293b" stroke="#0ea5e9" />
          <rect x="112" y="94" width="14" height="18" rx="3" fill="#1e293b" stroke="#0ea5e9" />

          {/* Helmet & AR Visor */}
          <path
            d="M72 75 C 72 52, 108 52, 108 75 C 108 92, 72 92, 72 75 Z"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="2"
          />
          {/* Glowing Cyan AR Visor */}
          <path
            d="M74 72 Q 90 76 106 72 L 104 82 Q 90 86 76 82 Z"
            fill="#00f2fe"
            filter="drop-shadow(0 0 6px #00f2fe)"
          />
          <line x1="77" y1="77" x2="103" y2="77" stroke="#ffffff" strokeWidth="1" />

          {/* Holographic Quantum Tablet in Hand */}
          <g transform="translate(108, 118)">
            <rect x="0" y="0" width="28" height="18" rx="3" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
            {/* Projected Holo Blueprint */}
            <motion.path
              d="M6 -4 L 22 -4 L 26 -16 L 2 -16 Z"
              fill="rgba(0, 242, 254, 0.25)"
              stroke="#00f2fe"
              strokeWidth="1"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {/* Micro grid lines inside holo */}
            <line x1="14" y1="-4" x2="14" y2="-16" stroke="#00f2fe" strokeWidth="0.7" />
          </g>
        </motion.g>
      </motion.svg>
    </div>
  );
};
