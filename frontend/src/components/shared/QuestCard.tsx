import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Code,
  BookOpen,
  Dumbbell,
  Sparkles,
  CheckCircle,
  Coins,
  Zap,
  Trash2,
  Edit2,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../context/ThemeContext.js';
import { Button } from './Button.js';

export interface Quest {
  id: number;
  user_id: number;
  title: string;
  description: string;
  category: 'coding' | 'study' | 'fitness' | 'creative' | 'habit' | string;
  difficulty: 'easy' | 'medium' | 'hard' | 'epic' | string;
  priority: 'low' | 'medium' | 'high' | 'urgent' | string;
  xp_reward: number;
  gold_reward: number;
  streak_bonus: number;
  is_completed: boolean;
  due_date?: string | null;
  created_at: string;
}

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: number) => Promise<void>;
  onEdit?: (quest: Quest) => void;
  onDelete?: (id: number) => Promise<void>;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onComplete,
  onEdit,
  onDelete,
}) => {
  const { currentThemeId } = useTheme();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getCategoryMeta = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'coding':
        return { label: 'Coding', icon: Code, color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/50' };
      case 'study':
        return { label: 'Study', icon: BookOpen, color: 'text-indigo-400 bg-indigo-950/40 border-indigo-800/50' };
      case 'fitness':
        return { label: 'Fitness', icon: Dumbbell, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50' };
      case 'creative':
        return { label: 'Creative', icon: Sparkles, color: 'text-purple-400 bg-purple-950/40 border-purple-800/50' };
      case 'habit':
      default:
        return { label: 'Habit', icon: CheckCircle, color: 'text-amber-400 bg-amber-950/40 border-amber-800/50' };
    }
  };

  const getDifficultyMeta = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return { label: 'Easy', stars: '★☆☆☆', color: 'text-slate-400' };
      case 'medium':
        return { label: 'Medium', stars: '★★☆☆', color: 'text-blue-400' };
      case 'hard':
        return { label: 'Hard', stars: '★★★☆', color: 'text-amber-400' };
      case 'epic':
      default:
        return { label: 'Epic', stars: '★★★★', color: 'text-rose-400 font-bold' };
    }
  };

  const catMeta = getCategoryMeta(quest.category);
  const diffMeta = getDifficultyMeta(quest.difficulty);
  const CatIcon = catMeta.icon;

  const handleComplete = async () => {
    if (quest.is_completed || isCompleting) return;
    setIsCompleting(true);
    try {
      // Trigger festive reward celebration confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00f0ff', '#d4af37', '#10b981', '#ffe600'],
      });

      await onComplete(quest.id);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete || isDeleting) return;
    if (confirm(`Are you sure you want to abandon quest "${quest.title}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(quest.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`group relative rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] p-4 transition-all duration-200 ${
        quest.is_completed
          ? 'opacity-60 bg-[var(--rpg-bg)]/40 border-dashed border-[var(--rpg-border)]'
          : 'hover:border-[var(--rpg-primary)] hover:shadow-[var(--rpg-glow)]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Complete Action & Title */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={handleComplete}
            disabled={quest.is_completed || isCompleting}
            className={`mt-0.5 flex-shrink-0 cursor-pointer transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rpg-primary)] ${
              quest.is_completed
                ? 'text-emerald-400 cursor-default'
                : 'text-[var(--rpg-muted)] hover:text-[var(--rpg-primary)] hover:scale-110'
            }`}
            aria-label={quest.is_completed ? 'Completed quest' : 'Mark quest as complete'}
          >
            {quest.is_completed ? (
              <CheckCircle2 className="w-5 h-5 fill-emerald-500/20 text-emerald-400" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {/* Category pill */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${catMeta.color}`}
              >
                <CatIcon className="w-3 h-3" />
                {catMeta.label}
              </span>

              {/* Difficulty */}
              <span className={`text-[11px] font-mono ${diffMeta.color}`}>
                {diffMeta.label} {diffMeta.stars}
              </span>

              {/* Due Date if present */}
              {quest.due_date && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[var(--rpg-muted)] font-mono">
                  <Clock className="w-3 h-3" />
                  {new Date(quest.due_date).toLocaleDateString()}
                </span>
              )}
            </div>

            <h4
              className={`text-sm font-semibold text-[var(--rpg-text)] leading-snug break-words ${
                quest.is_completed ? 'line-through text-[var(--rpg-muted)]' : ''
              }`}
            >
              {quest.title}
            </h4>

            {quest.description && (
              <p className="mt-1 text-xs text-[var(--rpg-muted)] line-clamp-2">
                {quest.description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Rewards & Action buttons */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {/* Rewards Badge */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--rpg-bg)] border border-[var(--rpg-border)] text-cyan-400 font-bold">
              <Zap className="w-3 h-3 text-cyan-400" />
              +{quest.xp_reward} XP
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--rpg-bg)] border border-[var(--rpg-border)] text-amber-300 font-bold">
              <Coins className="w-3 h-3 text-amber-400" />
              +{quest.gold_reward}
            </span>
          </div>

          {/* Action buttons on card hover */}
          {!quest.is_completed && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={() => onEdit(quest)}
                  className="p-1 rounded text-[var(--rpg-muted)] hover:text-[var(--rpg-text)] hover:bg-[var(--rpg-surface-hover)]"
                  title="Edit quest"
                  aria-label="Edit quest"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1 rounded text-[var(--rpg-muted)] hover:text-red-400 hover:bg-red-950/30"
                  title="Delete quest"
                  aria-label="Delete quest"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
