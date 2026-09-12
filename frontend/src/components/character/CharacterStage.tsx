import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { ForestDruid } from './ForestDruid.js';
import { SamuraiRonin } from './SamuraiRonin.js';
import { CyberArchitect } from './CyberArchitect.js';
import { CyberNetrunner } from './CyberNetrunner.js';
import { PaladinKnight } from './PaladinKnight.js';
import { SolarBotanist } from './SolarBotanist.js';
import { audioEngine } from '../../services/audioEngine.js';
import confetti from 'canvas-confetti';
import { Sparkles, Sword, Shield, Zap, Flame, Award, Heart } from 'lucide-react';

interface CharacterStageProps {
  characterState?: any;
  onActionTriggered?: (actionName: string) => void;
  compact?: boolean;
}

export const CharacterStage: React.FC<CharacterStageProps> = ({
  characterState: propCharacter,
  onActionTriggered,
  compact = false,
}) => {
  const { currentThemeId, theme } = useTheme();
  const { character: authCharacter } = useAuth();
  const character = propCharacter || authCharacter;

  const [currentAction, setCurrentAction] = useState('idle');
  const [floatingDamage, setFloatingDamage] = useState<{ text: string; color: string; id: number } | null>(null);

  const hero = theme.hero;
  const level = character?.level || 1;
  const equipped = {
    head: hero?.gearSlots?.[0] || 'Crown of Focus',
    chest: hero?.gearSlots?.[1] || 'Mantle of Discipline',
    weapon: hero?.weapon || 'Heroic Blade',
    relic: hero?.gearSlots?.[3] || 'Ancestral Crest',
  };

  const triggerAction = (actionName: string) => {
    setCurrentAction(actionName);

    if (actionName === 'attack') {
      audioEngine.playAttack();
      setFloatingDamage({ text: 'CRITICAL STRIKE!', color: 'text-amber-400', id: Date.now() });
    } else if (actionName === 'ability') {
      audioEngine.playLevelUp();
      const abilityName =
        currentThemeId === 'theme-a'
          ? 'NEURAL OVERCLOCK'
          : currentThemeId === 'theme-b'
          ? 'HOLY RADIANCE'
          : currentThemeId === 'theme-c'
          ? 'SOLAR SYNTHESIS'
          : currentThemeId === 'theme-d'
          ? 'ANIMA BLOOM'
          : currentThemeId === 'theme-e'
          ? 'SHADOW KATA'
          : 'BLUEPRINT SURGE';
      setFloatingDamage({ text: abilityName, color: 'text-cyan-400', id: Date.now() });
    } else if (actionName === 'meditate') {
      setFloatingDamage({ text: 'DISCIPLINE +100%', color: 'text-emerald-400', id: Date.now() });
    } else if (actionName === 'celebrate') {
      audioEngine.playLevelUp();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      setFloatingDamage({ text: 'VICTORY ASCENSION!', color: 'text-amber-300', id: Date.now() });
    } else if (actionName === 'hit') {
      audioEngine.playHit();
      setFloatingDamage({ text: '-30 BOSS DAMAGE', color: 'text-red-400', id: Date.now() });
    }

    if (onActionTriggered) {
      onActionTriggered(actionName);
    }

    setTimeout(() => {
      setFloatingDamage(null);
    }, 1200);

    const duration = actionName === 'celebrate' || actionName === 'meditate' ? 1400 : 750;
    setTimeout(() => {
      setCurrentAction('idle');
    }, duration);
  };

  return (
    <div
      className={`relative p-5 sm:p-6 rounded-2xl bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-[var(--rpg-glow)] flex flex-col items-center overflow-hidden transition-all duration-300 ${
        compact ? 'max-w-md w-full' : 'w-full'
      }`}
    >
      {/* Red Flash Vignette on Hit */}
      {currentAction === 'hit' && (
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-red-600/30 z-30 pointer-events-none"
        />
      )}

      {/* Top Banner with Theme Tag and Level Badge */}
      <div className="w-full flex items-center justify-between mb-3 z-10">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-white/10 border border-white/10 text-[var(--rpg-text)]">
            {theme.code}
          </span>
          <span className="text-xs text-[var(--rpg-muted)] font-medium tracking-wide">
            {hero.class}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>LVL {level}</span>
        </div>
      </div>

      {/* Floating Damage / Combat Text */}
      <AnimatePresence>
        {floatingDamage && (
          <motion.div
            key={floatingDamage.id}
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: -30, scale: 1.25 }}
            exit={{ opacity: 0, y: -50 }}
            className={`absolute z-40 top-16 font-black text-sm tracking-widest drop-shadow-[0_0_12px_currentColor] ${floatingDamage.color}`}
          >
            {floatingDamage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Hero Rig Rendering for all 6 themes */}
      <div className="relative py-2 flex items-center justify-center min-h-[220px]">
        {currentThemeId === 'theme-a' && <CyberNetrunner action={currentAction} />}
        {currentThemeId === 'theme-b' && <PaladinKnight action={currentAction} />}
        {currentThemeId === 'theme-c' && <SolarBotanist action={currentAction} />}
        {currentThemeId === 'theme-d' && <ForestDruid action={currentAction} />}
        {currentThemeId === 'theme-e' && <SamuraiRonin action={currentAction} />}
        {currentThemeId === 'theme-f' && <CyberArchitect action={currentAction} />}
      </div>

      {/* Character Name & Weapon */}
      <div className="text-center z-10 mt-1 mb-3">
        <h3 className="text-lg sm:text-xl font-heading font-black text-[var(--rpg-text)] tracking-wide">
          {hero.name}
        </h3>
        <p className="text-xs text-[var(--rpg-muted)] flex items-center justify-center gap-1.5 mt-0.5">
          <Sword className="w-3 h-3 text-[var(--rpg-primary)]" />
          <span>{hero.weapon}</span>
        </p>
      </div>

      {/* Equipped Gear Preview */}
      <div className="w-full flex items-center justify-center gap-2 mb-4 z-10 overflow-x-auto pb-1">
        <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-neutral-300 flex items-center gap-1" title={equipped.head}>
          <span>👑</span>
          <span className="truncate max-w-[80px]">{equipped.head}</span>
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-neutral-300 flex items-center gap-1" title={equipped.chest}>
          <span>🛡️</span>
          <span className="truncate max-w-[80px]">{equipped.chest}</span>
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-neutral-300 flex items-center gap-1" title={equipped.relic}>
          <span>🔮</span>
          <span className="truncate max-w-[80px]">{equipped.relic}</span>
        </div>
      </div>

      {/* Action Control Buttons (All 5 states) */}
      <div className="w-full grid grid-cols-5 gap-1.5 sm:gap-2 z-10 pt-3 border-t border-[var(--rpg-border)]">
        <button
          onClick={() => triggerAction('attack')}
          disabled={currentAction !== 'idle'}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-[var(--rpg-text)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          title="Trigger weapon strike"
        >
          <Sword className="w-4 h-4 text-red-400 mb-0.5" />
          <span>Strike</span>
        </button>

        <button
          onClick={() => triggerAction('ability')}
          disabled={currentAction !== 'idle'}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-[var(--rpg-text)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          title="Cast theme spell"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 mb-0.5" />
          <span>Ability</span>
        </button>

        <button
          onClick={() => triggerAction('meditate')}
          disabled={currentAction !== 'idle'}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-[var(--rpg-text)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          title="Focus energy"
        >
          <Zap className="w-4 h-4 text-emerald-400 mb-0.5" />
          <span>Focus</span>
        </button>

        <button
          onClick={() => triggerAction('hit')}
          disabled={currentAction !== 'idle'}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-[var(--rpg-text)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          title="Take raid damage"
        >
          <Heart className="w-4 h-4 text-rose-400 mb-0.5" />
          <span>Clash</span>
        </button>

        <button
          onClick={() => triggerAction('celebrate')}
          disabled={currentAction !== 'idle'}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-[var(--rpg-text)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          title="Celebrate victory"
        >
          <Award className="w-4 h-4 text-amber-400 mb-0.5" />
          <span>Victory</span>
        </button>
      </div>
    </div>
  );
};
