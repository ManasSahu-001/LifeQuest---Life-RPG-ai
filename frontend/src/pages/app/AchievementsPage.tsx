import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  CheckCircle2,
  Lock,
  Flame,
  Zap,
  Shield,
  Crown,
  Code,
  Activity,
  BookOpen,
  CheckCircle,
  Coins,
} from 'lucide-react';
import { api } from '../../api/client.js';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAchievements = async () => {
    try {
      const res = await api.getAchievements();
      if (res.data.success) {
        setAchievements(res.data.achievements);
      }
    } catch (err) {
      console.warn('Failed to load achievements', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'award':
        return Award;
      case 'flame':
        return Flame;
      case 'zap':
        return Zap;
      case 'shield':
        return Shield;
      case 'crown':
        return Crown;
      case 'code':
        return Code;
      case 'activity':
        return Activity;
      case 'book-open':
        return BookOpen;
      case 'check-circle':
      default:
        return CheckCircle;
    }
  };

  const unlockedCount = achievements.filter((a) => a.is_unlocked).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-black text-[var(--rpg-text)] flex items-center gap-2">
            <Award className="w-6 h-6 text-[var(--rpg-primary)]" />
            Adventurer Achievements
          </h1>
          <p className="text-xs text-[var(--rpg-muted)] font-mono">
            Trophies commemorating your greatest real-world milestones
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[var(--rpg-surface)] border border-[var(--rpg-border)] px-4 py-2 rounded-[var(--rpg-radius)] font-mono text-xs font-bold text-[var(--rpg-text)]">
          <span>Unlocked:</span>
          <span className="text-[var(--rpg-primary)]">
            {unlockedCount} / {achievements.length}
          </span>
        </div>
      </div>

      {/* Achievement Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-28 bg-[var(--rpg-surface)] rounded animate-pulse" />
          <div className="h-28 bg-[var(--rpg-surface)] rounded animate-pulse" />
          <div className="h-28 bg-[var(--rpg-surface)] rounded animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const Icon = getBadgeIcon(ach.badge_icon);
            return (
              <div
                key={ach.id}
                className={`p-5 rounded-[var(--rpg-radius)] border transition-all ${
                  ach.is_unlocked
                    ? 'bg-[var(--rpg-surface)] border-[var(--rpg-primary)] shadow-[var(--rpg-glow)]'
                    : 'bg-[var(--rpg-surface)]/40 border-[var(--rpg-border)] opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-[var(--rpg-radius)] flex items-center justify-center border ${
                        ach.is_unlocked
                          ? 'bg-[var(--rpg-primary)]/20 border-[var(--rpg-primary)] text-[var(--rpg-primary)]'
                          : 'bg-[var(--rpg-bg)] border-[var(--rpg-border)] text-[var(--rpg-muted)]'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--rpg-text)]">
                        {ach.title}
                      </h3>
                      <span className="text-[10px] font-mono text-[var(--rpg-muted)] uppercase">
                        {ach.category}
                      </span>
                    </div>
                  </div>

                  {ach.is_unlocked ? (
                    <span className="p-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="p-1 rounded-full bg-[var(--rpg-bg)] text-[var(--rpg-muted)] border border-[var(--rpg-border)]">
                      <Lock className="w-4 h-4" />
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--rpg-muted)] mb-4 leading-relaxed">
                  {ach.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--rpg-border)]/50 text-[11px] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">+{ach.xp_reward} XP</span>
                    <span className="text-amber-400 font-bold">+{ach.gold_reward} Gold</span>
                  </div>
                  {ach.is_unlocked && ach.unlocked_at && (
                    <span className="text-[10px] text-[var(--rpg-muted)]">
                      {new Date(ach.unlocked_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
