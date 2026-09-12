import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords, Skull, Flame, Trophy, ShieldAlert, Award } from 'lucide-react';
import { api } from '../../api/client.js';
import { useTheme } from '../../context/ThemeContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { ProgressBar } from './ProgressBar.js';
import { Button } from './Button.js';

export interface BossData {
  id: number;
  name: string;
  title: string;
  description: string;
  max_hp: number;
  current_hp: number;
  level: number;
  weakness_category: string;
  gold_bounty: number;
  xp_bounty: number;
  is_active: boolean;
}

export const BossCard: React.FC = () => {
  const { currentThemeId } = useTheme();
  const { refreshCharacter } = useAuth();
  const [boss, setBoss] = useState<BossData | null>(null);
  const [contributors, setContributors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackFeedback, setAttackFeedback] = useState<string | null>(null);

  const fetchBoss = async () => {
    try {
      const res = await api.getBoss();
      if (res.data.success) {
        setBoss(res.data.boss);
        setContributors(res.data.contributors || []);
      }
    } catch (err) {
      console.warn('Failed to load boss', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoss();
  }, []);

  const handleManualStrike = async () => {
    if (!boss || !boss.is_active || isAttacking) return;
    setIsAttacking(true);
    try {
      const res = await api.attackBoss(25);
      if (res.data.success) {
        setAttackFeedback(`💥 Dealt ${res.data.damage} damage to the Boss!`);
        await fetchBoss();
        await refreshCharacter();
        setTimeout(() => setAttackFeedback(null), 3500);
      }
    } catch (err: any) {
      setAttackFeedback('Strike failed.');
      setTimeout(() => setAttackFeedback(null), 3000);
    } finally {
      setIsAttacking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] animate-pulse">
        <div className="h-6 w-40 bg-[var(--rpg-surface-hover)] rounded mb-3" />
        <div className="h-4 w-full bg-[var(--rpg-surface-hover)] rounded" />
      </div>
    );
  }

  if (!boss) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] p-6 shadow-[var(--rpg-glow)] relative overflow-hidden"
    >
      {/* Red/Dark aura for boss */}
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-rose-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-[var(--rpg-radius)] bg-rose-950/40 border-2 border-rose-500/60 flex items-center justify-center text-rose-400 shadow-md">
            <Skull className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-heading font-bold text-rose-300">
                {boss.name}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-400 border border-rose-800/50">
                BOSS LVL {boss.level}
              </span>
            </div>
            <p className="text-xs text-[var(--rpg-muted)] font-mono">{boss.title}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase font-mono text-[var(--rpg-muted)]">Weakness</div>
          <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/50">
            {boss.weakness_category.toUpperCase()} (1.5x DMG)
          </span>
        </div>
      </div>

      <p className="text-xs text-[var(--rpg-muted)] mb-4 leading-relaxed">
        {boss.description}
      </p>

      {/* Boss Health Bar */}
      <div className="mb-4">
        <ProgressBar
          value={boss.current_hp}
          max={boss.max_hp}
          label="Boss Health Points"
          subLabel={`${boss.current_hp} / ${boss.max_hp} HP`}
          color="#f43f5e"
          height="lg"
        />
      </div>

      {/* Rewards Bounty */}
      <div className="flex items-center justify-between p-3 rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)]/60 border border-[var(--rpg-border)] mb-4 text-xs font-mono">
        <span className="text-[var(--rpg-muted)] flex items-center gap-1">
          <Trophy className="w-4 h-4 text-amber-400" /> Defeat Bounty:
        </span>
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-bold">+{boss.gold_bounty} Gold</span>
          <span className="text-cyan-400 font-bold">+{boss.xp_bounty} XP</span>
        </div>
      </div>

      {/* Feedback banner */}
      {attackFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-2 rounded text-xs text-center font-mono font-bold bg-rose-950/60 border border-rose-500/40 text-rose-300"
        >
          {attackFeedback}
        </motion.div>
      )}

      {/* Action / Explanation */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] text-[var(--rpg-muted)] flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          Quests automatically damage the boss!
        </span>

        {boss.is_active ? (
          <Button
            variant="danger"
            size="sm"
            onClick={handleManualStrike}
            isLoading={isAttacking}
            icon={<Swords className="w-4 h-4" />}
          >
            Direct Attack
          </Button>
        ) : (
          <span className="px-3 py-1 rounded text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
            Defeated!
          </span>
        )}
      </div>

      {/* Top Contributors */}
      {contributors.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[var(--rpg-border)]">
          <div className="text-[10px] uppercase font-mono text-[var(--rpg-muted)] mb-2 flex items-center gap-1">
            <Award className="w-3 h-3 text-[var(--rpg-primary)]" />
            Top Strike Leaders
          </div>
          <div className="space-y-1">
            {contributors.slice(0, 3).map((c, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs font-mono text-[var(--rpg-text)] py-0.5"
              >
                <span className="text-[var(--rpg-muted)]">
                  #{idx + 1} {c.hero_name || 'Adventurer'}
                </span>
                <span className="text-rose-400 font-semibold">{c.total_damage} DMG</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
