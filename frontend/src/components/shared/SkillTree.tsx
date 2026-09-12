import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Sun,
  Dumbbell,
  Sparkles,
  Layers,
  Shield,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';
import { audioEngine } from '../../services/audioEngine.js';
import { Button } from './Button.js';

export interface SkillNode {
  id: number;
  code: string;
  name: string;
  description: string;
  category: string;
  tier: number;
  cost_points: number;
  required_skill_code: string | null;
  stat_bonus_type: string;
  stat_bonus_value: number;
  icon: string;
  is_unlocked: boolean;
}

export const SkillTree: React.FC = () => {
  const { character, refreshCharacter } = useAuth();
  const { showToast } = useToast();
  const [skills, setSkills] = useState<SkillNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unlockingId, setUnlockingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      const res = await api.getSkills();
      if (res.data.success) {
        setSkills(res.data.skills);
      }
    } catch (err) {
      console.warn('Failed to load skills', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'cpu':
        return Cpu;
      case 'sun':
        return Sun;
      case 'dumbbell':
        return Dumbbell;
      case 'sparkles':
        return Sparkles;
      case 'layers':
        return Layers;
      case 'shield':
      default:
        return Shield;
    }
  };

  const handleUnlock = async (skill: SkillNode) => {
    if (skill.is_unlocked || unlockingId !== null) return;
    setUnlockingId(skill.id);
    audioEngine.playClick();

    try {
      const res = await api.unlockSkill(skill.id);
      if (res.data.success) {
        audioEngine.playLevelUp();
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#10b981', '#d4af37'],
        });
        const msg = `✨ ${skill.name} Unlocked! +${skill.stat_bonus_value} ${skill.stat_bonus_type.toUpperCase()}`;
        setFeedback(msg);
        showToast(msg, 'achievement', undefined, undefined, 'Mastery Unlocked');
        await fetchSkills();
        await refreshCharacter();
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Prerequisites not met for this mastery';
      setFeedback(errMsg);
      showToast(errMsg, 'error');
      setTimeout(() => setFeedback(null), 3500);
    } finally {
      setUnlockingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] animate-pulse">
        <div className="h-6 w-36 bg-[var(--rpg-surface-hover)] rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-24 bg-[var(--rpg-surface-hover)] rounded" />
          <div className="h-24 bg-[var(--rpg-surface-hover)] rounded" />
        </div>
      </div>
    );
  }

  const tier1Skills = skills.filter((s) => s.tier === 1);
  const tier2Skills = skills.filter((s) => s.tier === 2);
  const unlockedCount = skills.filter((s) => s.is_unlocked).length;

  return (
    <div className="rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] p-6 shadow-[var(--rpg-glow)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--rpg-border)]">
        <div>
          <h3 className="text-lg font-heading font-bold text-[var(--rpg-text)] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[var(--rpg-primary)]" />
            Adventurer Skill Tree
          </h3>
          <p className="text-xs text-[var(--rpg-muted)] font-mono">
            Unlock masteries to gain permanent attribute buffs for your character
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[var(--rpg-primary)]/15 text-[var(--rpg-primary)] border border-[var(--rpg-primary)]/30">
            {unlockedCount} / {skills.length} Masteries Unlocked
          </span>
        </div>
      </div>

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-2.5 rounded text-xs font-mono font-bold bg-[var(--rpg-primary)]/10 border border-[var(--rpg-primary)] text-[var(--rpg-primary)] text-center"
        >
          {feedback}
        </motion.div>
      )}

      {/* Tier 1 Foundations */}
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-wider text-[var(--rpg-muted)] mb-3">
          Tier 1 — Core Foundations
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tier1Skills.map((skill) => renderSkillCard(skill))}
        </div>
      </div>

      {/* Tier 2 Masteries */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-[var(--rpg-muted)] mb-3">
          Tier 2 — Advanced Masteries
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tier2Skills.map((skill) => renderSkillCard(skill))}
        </div>
      </div>
    </div>
  );

  function renderSkillCard(skill: SkillNode) {
    const Icon = getIcon(skill.icon);
    const parentSkill = skills.find((s) => s.code === skill.required_skill_code);
    const isPrereqMet = !skill.required_skill_code || Boolean(parentSkill?.is_unlocked);

    return (
      <div
        key={skill.id}
        className={`p-3.5 rounded-[var(--rpg-radius)] border transition-all ${
          skill.is_unlocked
            ? 'bg-[var(--rpg-bg)]/80 border-[var(--rpg-primary)]/60 shadow-[0_0_10px_rgba(0,240,255,0.1)]'
            : !isPrereqMet
            ? 'bg-slate-950/40 border-slate-800/80 opacity-60'
            : 'bg-[var(--rpg-bg)]/30 border-[var(--rpg-border)] hover:border-[var(--rpg-border)]/80'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-[var(--rpg-radius)] ${
                skill.is_unlocked
                  ? 'bg-[var(--rpg-primary)]/20 text-[var(--rpg-primary)]'
                  : !isPrereqMet
                  ? 'bg-slate-900 text-slate-600'
                  : 'bg-[var(--rpg-surface)] text-[var(--rpg-muted)]'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-[var(--rpg-text)]">{skill.name}</h4>
                {skill.is_unlocked && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <p className="text-[11px] text-[var(--rpg-muted)] mt-0.5 line-clamp-2">
                {skill.description}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] font-mono">
                <span className="text-emerald-400 font-bold">
                  +{skill.stat_bonus_value} {skill.stat_bonus_type.toUpperCase()}
                </span>
                {skill.required_skill_code && (
                  <span
                    className={`flex items-center gap-1 ${
                      isPrereqMet ? 'text-slate-400' : 'text-rose-400/90 font-semibold'
                    }`}
                  >
                    <Lock className="w-2.5 h-2.5" /> Requires {parentSkill ? parentSkill.name : skill.required_skill_code}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            {skill.is_unlocked ? (
              <span className="px-2 py-1 rounded text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                ACTIVE
              </span>
            ) : !isPrereqMet ? (
              <span className="px-2 py-1 rounded text-[10px] font-mono text-slate-500 border border-slate-800 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Locked
              </span>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleUnlock(skill)}
                isLoading={unlockingId === skill.id}
                className="text-[11px]"
              >
                Unlock
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
};
