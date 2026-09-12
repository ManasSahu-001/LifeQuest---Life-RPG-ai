import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Brain,
  Dumbbell,
  Sparkles,
  Flame,
  Coins,
  CheckCircle,
  Crown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { ProgressBar } from './ProgressBar.js';

export const CharacterPanel: React.FC = () => {
  const { character } = useAuth();
  const { currentThemeId } = useTheme();

  if (!character) {
    return (
      <div className="p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] animate-pulse">
        <div className="h-6 w-32 bg-[var(--rpg-surface-hover)] rounded mb-4" />
        <div className="h-4 w-48 bg-[var(--rpg-surface-hover)] rounded mb-2" />
        <div className="h-4 w-full bg-[var(--rpg-surface-hover)] rounded" />
      </div>
    );
  }

  const attributes = [
    { key: 'intellect', label: 'Intellect', val: character.intellect, icon: Brain, color: 'text-cyan-400', desc: 'Coding & Study' },
    { key: 'strength', label: 'Strength', val: character.strength, icon: Dumbbell, color: 'text-emerald-400', desc: 'Fitness' },
    { key: 'creativity', label: 'Creativity', val: character.creativity, icon: Sparkles, color: 'text-purple-400', desc: 'Creative' },
    { key: 'discipline', label: 'Discipline', val: character.discipline, icon: CheckCircle, color: 'text-amber-400', desc: 'Habits' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] p-6 shadow-[var(--rpg-glow)] relative overflow-hidden"
    >
      {/* Background theme glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[var(--rpg-primary)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Profile */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] border-2 border-[var(--rpg-primary)] flex items-center justify-center shadow-[var(--rpg-glow)]">
            <Crown className="w-8 h-8 text-[var(--rpg-primary)]" />
          </div>
          <span className="absolute -bottom-2 -right-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--rpg-primary)] text-black shadow-sm">
            LVL {character.level}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-heading font-bold text-[var(--rpg-text)] truncate">
              {character.name}
            </h3>
          </div>
          <p className="text-xs text-[var(--rpg-muted)] font-mono">{character.title}</p>
          <div className="flex items-center gap-3 mt-1 text-xs">
            <span className="flex items-center gap-1 text-orange-400 font-bold font-mono">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              {character.streak_count}d Streak
            </span>
            <span className="flex items-center gap-1 text-amber-300 font-bold font-mono">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              {character.gold} Gold
            </span>
          </div>
        </div>
      </div>

      {/* XP Progression Bar */}
      <div className="mb-6 bg-[var(--rpg-bg)]/60 p-3 rounded-[var(--rpg-radius)] border border-[var(--rpg-border)]">
        <ProgressBar
          value={character.current_xp}
          max={character.requiredXP}
          label="Level Experience"
          subLabel={`${character.current_xp} / ${character.requiredXP} XP`}
          showPercentage={true}
          height="md"
        />
      </div>

      {/* Attributes Grid */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-[var(--rpg-muted)] mb-3 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[var(--rpg-primary)]" />
          Character Attributes
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {attributes.map((attr) => {
            const Icon = attr.icon;
            return (
              <div
                key={attr.key}
                className="bg-[var(--rpg-bg)]/50 border border-[var(--rpg-border)] p-2.5 rounded-[var(--rpg-radius)] flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded bg-[var(--rpg-surface)] ${attr.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[var(--rpg-text)]">
                      {attr.label}
                    </div>
                    <div className="text-[10px] text-[var(--rpg-muted)]">{attr.desc}</div>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-[var(--rpg-text)]">
                  {attr.val}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
