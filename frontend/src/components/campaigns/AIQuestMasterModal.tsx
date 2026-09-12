import React, { useState } from 'react';
import { api } from '../../api/client.js';
import { audioEngine } from '../../services/audioEngine.js';
import { Sparkles, X, Wand2, ShieldAlert, CheckCircle2, Flame, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIQuestMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignForged: (campaignData: any) => void;
}

export const AIQuestMasterModal: React.FC<AIQuestMasterModalProps> = ({
  isOpen,
  onClose,
  onCampaignForged,
}) => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgingStage, setForgingStage] = useState(0);
  const [error, setError] = useState('');

  const forgingMessages = [
    'Analyzing Real-World Ambition...',
    'Synthesizing Structured Questline Milestones...',
    'Balancing XP & Gold Progression Curves...',
    'Manifesting Dimensional Nemesis Boss Entity...',
  ];

  if (!isOpen) return null;

  const quickGoals = [
    'Conquer DBMS semester exam in 2 weeks',
    'Build and launch a full-stack SaaS app',
    'Train and run a 5k outdoor marathon',
    'Master advanced TypeScript and system design',
    'Read 2 books and summarize chapter insights',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) {
      setError('Please provide a real-life goal for the Quest Master to forge.');
      return;
    }

    setError('');
    setLoading(true);
    setForgingStage(0);
    audioEngine.playClick();

    const stageInterval = setInterval(() => {
      setForgingStage((prev) => (prev + 1) % forgingMessages.length);
    }, 1600);

    try {
      const data = await api.generateCampaign({ goal: goal.trim() });
      if (data.data?.success) {
        audioEngine.playLevelUp();
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
        onCampaignForged(data.data);
        onClose();
        setGoal('');
      } else {
        setError(data.data?.message || 'Failed to forge campaign.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Quest Master was unable to connect. Check backend.');
    } finally {
      clearInterval(stageInterval);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-[var(--rpg-glow)] p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--rpg-primary)] via-[var(--rpg-secondary)] to-[var(--rpg-accent)]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--rpg-primary)]/20 to-[var(--rpg-secondary)]/20 border border-[var(--rpg-primary)]/40 flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-[var(--rpg-primary)] animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-black text-white flex items-center gap-2">
              AI Quest Master <Sparkles className="w-4 h-4 text-amber-400" />
            </h2>
            <p className="text-xs text-slate-400">
              Transform any ambition into structured quests and an interdimensional Nemesis Boss.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Your Real-Life Ambition / Goal
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Prepare for my DBMS semester exam in 2 weeks by finishing 5 modules and 50 SQL queries"
              rows={3}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[var(--rpg-primary)] focus:ring-1 focus:ring-[var(--rpg-primary)] text-sm resize-none transition-colors"
            />
          </div>

          {/* Quick Goal Inspirations */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-2">Or choose a quick inspiration:</span>
            <div className="flex flex-wrap gap-1.5">
              {quickGoals.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    audioEngine.playClick();
                    setGoal(q);
                  }}
                  disabled={loading}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:border-[var(--rpg-primary)] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Forging Status Indicator */}
          {loading && (
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-[var(--rpg-primary)]/40 shadow-sm animate-pulse space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--rpg-primary)] flex items-center gap-2 font-bold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {forgingMessages[forgingStage]}
                </span>
                <span className="text-slate-400 font-bold">
                  Step {forgingStage + 1} / {forgingMessages.length}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--rpg-primary)] via-amber-400 to-[var(--rpg-secondary)] transition-all duration-500 rounded-full"
                  style={{ width: `${((forgingStage + 1) / forgingMessages.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !goal.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--rpg-primary)] to-[var(--rpg-secondary)] text-black font-bold text-xs tracking-wider uppercase hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2 transition-opacity"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Forging Questline...
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  Forge Campaign
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
