import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext.js';

interface WalkingHeroSpriteProps {
  level?: number;
  isWalking?: boolean;
  scale?: number;
  direction?: 'left' | 'right';
}

export const WalkingHeroSprite: React.FC<WalkingHeroSpriteProps> = ({
  level = 1,
  isWalking = true,
  scale = 1,
  direction = 'right',
}) => {
  const { currentThemeId } = useTheme();

  // Walking cycle variants
  const bodyBobVariants = {
    walk: {
      y: [0, -5, 0, -5, 0],
      rotate: [-1, 1, -1, 1, -1],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const },
    },
    stand: {
      y: [0, -2, 0],
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
  };

  const leftLegVariants = {
    walk: {
      rotate: [-25, 25, -25],
      y: [0, -3, 0],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const },
    },
    stand: {
      rotate: 0,
      y: 0,
    },
  };

  const rightLegVariants = {
    walk: {
      rotate: [25, -25, 25],
      y: [-3, 0, -3],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const },
    },
    stand: {
      rotate: 0,
      y: 0,
    },
  };

  const armSwingVariants = {
    walk: {
      rotate: [20, -20, 20],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const },
    },
    stand: {
      rotate: 0,
    },
  };

  const dustVariants = {
    walk: {
      opacity: [0.6, 0, 0.6],
      scale: [0.6, 1.3, 0.6],
      x: direction === 'right' ? [-5, -15, -5] : [5, 15, 5],
      transition: { duration: 0.4, repeat: Infinity },
    },
    stand: {
      opacity: 0,
    },
  };

  return (
    <div
      className="relative flex flex-col items-center select-none"
      style={{
        transform: `scale(${scale}) ${direction === 'left' ? 'scaleX(-1)' : ''}`,
        transformOrigin: 'bottom center',
      }}
    >
      {/* Floating Level Marker Badge above Head */}
      <div
        className="absolute -top-7 z-20 px-2 py-0.5 rounded-full bg-amber-500/90 text-black text-[10px] font-black tracking-wider shadow-lg whitespace-nowrap flex items-center gap-1"
        style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'none' }}
      >
        <span>LVL {level}</span>
      </div>

      {/* Hero Walking SVG Container */}
      <svg viewBox="0 0 100 120" className="w-20 h-24 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
        {/* Footstep Dust Cloud */}
        {isWalking && (
          <motion.g variants={dustVariants} animate="walk">
            <ellipse cx="38" cy="112" rx="6" ry="2.5" fill="rgba(255,255,255,0.25)" />
            <ellipse cx="62" cy="112" rx="6" ry="2.5" fill="rgba(255,255,255,0.25)" />
          </motion.g>
        )}

        {/* Back Leg (Right) */}
        <motion.g
          style={{ originX: '55px', originY: '80px' }}
          variants={rightLegVariants}
          animate={isWalking ? 'walk' : 'stand'}
        >
          <rect x="52" y="80" width="8" height="28" rx="4" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
          <ellipse cx="58" cy="108" rx="6" ry="3.5" fill="#09090b" />
        </motion.g>

        {/* Front Leg (Left) */}
        <motion.g
          style={{ originX: '45px', originY: '80px' }}
          variants={leftLegVariants}
          animate={isWalking ? 'walk' : 'stand'}
        >
          <rect x="40" y="80" width="8" height="28" rx="4" fill="#27272a" stroke="#52525b" strokeWidth="1.5" />
          <ellipse cx="42" cy="108" rx="6" ry="3.5" fill="#09090b" />
        </motion.g>

        {/* Main Torso & Body Bob */}
        <motion.g variants={bodyBobVariants} animate={isWalking ? 'walk' : 'stand'}>
          {/* THEME D / Default: Forest Druid Tunic & Antlers */}
          {(currentThemeId === 'theme-d' || currentThemeId === 'theme-c' || currentThemeId === 'theme-b') && (
            <g>
              <path d="M35 50 Q 20 75 30 90 Q 40 85 45 80" fill="#064e3b" />
              <rect x="36" y="46" width="28" height="36" rx="6" fill="#022c22" stroke="#10b981" strokeWidth="1.5" />
              <line x1="36" y1="64" x2="64" y2="64" stroke="#fbbf24" strokeWidth="2.5" />
              <circle cx="50" cy="32" r="14" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
              <path d="M42 22 L 34 14 M40 18 L 32 20 M58 22 L 66 14 M60 18 L 68 20" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
              <circle cx="46" cy="32" r="2" fill="#34d399" />
              <circle cx="54" cy="32" r="2" fill="#34d399" />
            </g>
          )}

          {/* THEME E: Samurai Ronin */}
          {currentThemeId === 'theme-e' && (
            <g>
              <rect x="36" y="46" width="28" height="36" rx="5" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
              <rect x="36" y="62" width="28" height="6" fill="#09090b" />
              <polygon points="50,68 53,78 47,78" fill="#f59e0b" />
              <path d="M28 26 L 50 14 L 72 26 Z" fill="#78350f" stroke="#b45309" strokeWidth="1.5" />
              <circle cx="50" cy="33" r="9" fill="#18181b" />
              <line x1="46" y1="33" x2="49" y2="33" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
              <line x1="51" y1="33" x2="54" y2="33" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* THEME F / THEME A: Cyber Netrunner / Cyber Architect */}
          {(currentThemeId === 'theme-f' || currentThemeId === 'theme-a') && (
            <g>
              <rect x="36" y="46" width="28" height="36" rx="6" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
              <rect x="42" y="52" width="16" height="12" rx="2" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
              <circle cx="50" cy="58" r="3" fill="#38bdf8" />
              <rect x="38" y="20" width="24" height="24" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="40" y="28" width="20" height="7" rx="2" fill="#0ea5e9" opacity="0.9" />
            </g>
          )}

          {/* THEME G: Haunted World */}
          {currentThemeId === 'theme-g' && (
            <g>
              <rect x="36" y="46" width="28" height="36" rx="6" fill="#090d14" stroke="#10b981" strokeWidth="1.5" />
              <circle cx="50" cy="32" r="14" fill="#090d14" stroke="#10b981" strokeWidth="1.5" />
              <circle cx="45" cy="32" r="2.5" fill="#34d399" />
              <circle cx="55" cy="32" r="2.5" fill="#34d399" />
            </g>
          )}

          {/* THEME H: Stranger Things 2 */}
          {currentThemeId === 'theme-h' && (
            <g>
              <rect x="36" y="46" width="28" height="36" rx="5" fill="#181f3d" stroke="#ff0f3f" strokeWidth="1.5" />
              <circle cx="50" cy="32" r="13" fill="#181f3d" stroke="#ff0f3f" strokeWidth="1.5" />
              <rect x="40" y="26" width="20" height="4" fill="#ff0f3f" />
              <circle cx="45" cy="33" r="2" fill="#06b6d4" />
              <circle cx="55" cy="33" r="2" fill="#06b6d4" />
            </g>
          )}

          {/* Weapon Arm Swing */}
          <motion.g
            style={{ originX: '62px', originY: '48px' }}
            variants={armSwingVariants}
            animate={isWalking ? 'walk' : 'stand'}
          >
            <rect x="60" y="48" width="6" height="20" rx="3" fill="#3f3f46" stroke="#52525b" strokeWidth="1" />
            {currentThemeId === 'theme-e' ? (
              <g>
                <line x1="63" y1="35" x2="63" y2="85" stroke="#e4e4e7" strokeWidth="2" strokeLinecap="round" />
                <line x1="60" y1="46" x2="66" y2="46" stroke="#f59e0b" strokeWidth="2" />
              </g>
            ) : currentThemeId === 'theme-h' ? (
              <g>
                <circle cx="63" cy="38" r="6" fill="#ff0f3f" filter="drop-shadow(0 0 6px #ff0f3f)" />
              </g>
            ) : (
              <g>
                <line x1="63" y1="25" x2="63" y2="85" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="63" cy="23" r="4.5" fill="#34d399" filter="drop-shadow(0 0 4px #10b981)" />
              </g>
            )}
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
};
