import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext.js';
import { ShieldAlert, Skull, Flame, Zap, Trophy, HeartPulse } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface BossEntity {
  id: number;
  title: string;
  boss_type?: string;
  description: string;
  max_hp: number;
  current_hp: number;
  is_defeated: boolean;
  reward_gold?: number;
  reward_xp?: number;
}

interface BossArenaViewProps {
  boss: BossEntity | null;
  lastDamage?: {
    damageDealt: number;
    isDefeated: boolean;
  } | null;
  onBossDefeated?: () => void;
}

export const BossArenaView: React.FC<BossArenaViewProps> = ({
  boss,
  lastDamage,
}) => {
  const { currentThemeId } = useTheme();
  const [animatingDamage, setAnimatingDamage] = useState<number | null>(null);
  const [shake, setShake] = useState(false);

  const isUpsideDown = currentThemeId === 'theme-h';
  const isHaunted = currentThemeId === 'theme-g';

  useEffect(() => {
    if (lastDamage && lastDamage.damageDealt > 0) {
      setAnimatingDamage(lastDamage.damageDealt);
      setShake(true);

      const timer = setTimeout(() => {
        setAnimatingDamage(null);
        setShake(false);
      }, 1000);

      if (lastDamage.isDefeated) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: isUpsideDown ? ['#ff0f3f', '#06b6d4', '#fbbf24'] : ['#10b981', '#a855f7', '#fbbf24'],
        });
      }

      return () => clearTimeout(timer);
    }
  }, [lastDamage, isUpsideDown]);

  if (!boss) {
    return (
      <div className="rounded-2xl p-6 text-center bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-[var(--rpg-glow)]">
        <ShieldAlert className="w-10 h-10 mx-auto text-slate-500 mb-2 animate-pulse" />
        <h3 className="text-sm font-semibold text-slate-300">No Active Nemesis Boss</h3>
        <p className="text-xs text-slate-500 mt-1">
          Forge an AI Quest Master Campaign to summon an interdimensional manifestation.
        </p>
      </div>
    );
  }

  const hpPercent = Math.max(0, Math.min(100, Math.round((boss.current_hp / boss.max_hp) * 100)));
  const isCritical = hpPercent <= 25 && !boss.is_defeated;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-[var(--rpg-glow)] transition-all ${
        shake ? 'animate-bounce' : ''
      }`}
    >
      {/* Atmosphere radial overlay */}
      <div
        className={`absolute inset-0 pointer-events-none opacity-20 ${
          isUpsideDown
            ? 'bg-radial-at-t from-red-600/30 via-transparent to-transparent'
            : isHaunted
            ? 'bg-radial-at-t from-emerald-600/30 via-transparent to-transparent'
            : 'bg-radial-at-t from-cyan-600/30 via-transparent to-transparent'
        }`}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl border ${
              isUpsideDown
                ? 'bg-red-950/80 border-red-700/60 text-red-400'
                : 'bg-emerald-950/80 border-emerald-700/60 text-emerald-400'
            }`}
          >
            {isUpsideDown ? <Zap className="w-5 h-5 animate-pulse" /> : <Skull className="w-5 h-5 animate-pulse" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                CAMPAIGN NEMESIS
              </span>
              {boss.is_defeated ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
                  <Trophy className="w-2.5 h-2.5" /> VANQUISHED
                </span>
              ) : (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isCritical
                      ? 'bg-red-900/80 text-red-200 border-red-500 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {isCritical ? 'CRITICAL HP' : 'ACTIVE THREAT'}
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-heading font-black tracking-wide text-white">
              {boss.title}
            </h3>
          </div>
        </div>

        {/* Boss HP Numeric */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-xs font-mono font-bold">
            <HeartPulse
              className={`w-3.5 h-3.5 ${isCritical ? 'text-red-500 animate-bounce' : 'text-slate-400'}`}
            />
            <span className={boss.is_defeated ? 'text-slate-500 line-through' : 'text-white'}>
              {boss.current_hp} / {boss.max_hp} HP
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">{hpPercent}% Vitality</span>
        </div>
      </div>

      {/* Floating Damage Number */}
      {animatingDamage && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <span className="text-3xl sm:text-4xl font-black text-yellow-300 drop-shadow-[0_0_12px_rgba(234,179,8,1)] font-mono animate-bounce">
            -{animatingDamage} HP!
          </span>
        </div>
      )}

      {/* Boss Graphic Visualizer */}
      <div
        className={`relative h-44 rounded-xl flex items-center justify-center border overflow-hidden my-3 ${
          isUpsideDown
            ? 'bg-gradient-to-b from-[#0e0716] via-[#160b1e] to-[#08030d] border-red-950/80'
            : 'bg-gradient-to-b from-[#081512] via-[#0d1e19] to-[#050d0a] border-emerald-950/80'
        }`}
      >
        <div className="relative flex flex-col items-center select-none">
          <div
            className={`relative transition-all duration-300 ${
              boss.is_defeated ? 'opacity-30 grayscale scale-90' : 'scale-100 hover:scale-105'
            }`}
          >
            <svg
              className={`w-28 h-28 ${
                isUpsideDown
                  ? 'text-red-600 drop-shadow-[0_0_25px_rgba(255,15,63,0.8)]'
                  : 'text-emerald-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.8)]'
              }`}
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <path d="M50 10 C30 10, 20 25, 20 40 C10 42, 5 50, 10 60 C15 70, 25 65, 30 75 C35 85, 45 90, 50 85 C55 90, 65 85, 70 75 C75 65, 85 70, 90 60 C95 50, 90 42, 80 40 C80 25, 70 10, 50 10 Z" />
              <circle cx="42" cy="35" r="3.5" fill="#fef08a" />
              <circle cx="58" cy="35" r="3.5" fill="#fef08a" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-8 h-8 rounded-full ${
                  isUpsideDown ? 'bg-red-500/40' : 'bg-emerald-500/40'
                } animate-ping`}
              />
            </div>
          </div>
          <p
            className={`text-[11px] font-mono mt-2 font-bold tracking-widest uppercase ${
              isUpsideDown ? 'text-red-300' : 'text-emerald-300'
            }`}
          >
            {boss.is_defeated
              ? 'NEMESIS VANQUISHED'
              : 'FEEDING ON PROCRASTINATION'}
          </p>
        </div>
      </div>

      {/* Health Bar */}
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              boss.is_defeated
                ? 'bg-slate-700 w-0'
                : isCritical
                ? 'bg-red-600 animate-pulse'
                : 'bg-gradient-to-r from-[var(--rpg-primary)] to-[var(--rpg-secondary)]'
            }`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {/* Boss Description */}
      <p className="text-xs text-slate-400 mt-3 italic leading-relaxed">
        "{boss.description}"
      </p>

      {/* Rewards Spoils Banner */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <span className="font-mono text-[11px] text-slate-500 uppercase">Victory Spoils:</span>
        <div className="flex items-center gap-3 font-semibold text-slate-300">
          <span className="text-amber-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> +{boss.reward_gold || 200} Gold
          </span>
          <span className="text-cyan-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> +{boss.reward_xp || 450} XP
          </span>
        </div>
      </div>
    </div>
  );
};
