import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Compass,
  Building2,
  Swords,
  Award,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';
import { CharacterPanel } from '../../components/shared/CharacterPanel.js';
import { QuestCard, Quest } from '../../components/shared/QuestCard.js';
import { BossCard } from '../../components/shared/BossCard.js';
import { Button } from '../../components/shared/Button.js';
import { Modal } from '../../components/shared/Modal.js';

export const DashboardPage: React.FC = () => {
  const { character, updateCharacterState, refreshCharacter } = useAuth();
  const toast = useToast();
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoadingQuests, setIsLoadingQuests] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Quest Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('coding');
  const [difficulty, setDifficulty] = useState('medium');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [questsRes, txRes] = await Promise.all([
        api.getQuests({ status: 'active' }),
        api.getTransactions(),
      ]);

      if (questsRes.data.success) {
        setActiveQuests(questsRes.data.quests.slice(0, 5));
      }
      if (txRes.data.success) {
        setTransactions(txRes.data.transactions.slice(0, 6));
      }
    } catch (err) {
      console.warn('Failed to load dashboard data', err);
    } finally {
      setIsLoadingQuests(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCompleteQuest = async (questId: number) => {
    try {
      const res = await api.completeQuest(questId);
      if (res.data.success) {
        // Update character from server-authoritative response
        if (res.data.character) {
          updateCharacterState(res.data.character);
        }

        // Trigger reward toast
        if (res.data.rewards) {
          toast.reward(res.data.rewards.xp, res.data.rewards.gold, `Completed: "${res.data.quest?.title}"`);
        }

        // Trigger level up toast if applicable
        if (res.data.levelUp) {
          toast.levelUp(res.data.character.level, res.data.character.title);
        }

        await fetchDashboardData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to complete quest');
    }
  };

  const handleCreateQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await api.createQuest({
        title,
        description,
        category,
        difficulty,
        priority,
        due_date: dueDate || null,
      });

      if (res.data.success) {
        setTitle('');
        setDescription('');
        setDueDate('');
        setIsModalOpen(false);
        toast.success(`Quest "${res.data.quest?.title}" forged and ready!`);
        await fetchDashboardData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create quest');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner: Quick Stats & Virtual City Link */}
      <div className="p-6 rounded-[var(--rpg-radius)] bg-gradient-to-r from-[var(--rpg-surface)] to-[var(--rpg-bg)] border border-[var(--rpg-border)] shadow-[var(--rpg-glow)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--rpg-primary)] uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" /> LifeQuest Command Center
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-black text-[var(--rpg-text)]">
            Welcome Back, {character?.name || 'Hero'}
          </h2>
          <p className="text-xs text-[var(--rpg-muted)] mt-1 max-w-xl">
            Execute real-world daily quests to fuel your virtual metropolis, expand attributes, inflict Nemesis Boss damage, and advance your streak.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/app/campaigns">
            <Button variant="outline" size="sm" icon={<Zap className="w-4 h-4 text-cyan-400" />}>
              AI Campaigns
            </Button>
          </Link>
          <Link to="/app/city">
            <Button variant="outline" size="sm" icon={<Building2 className="w-4 h-4" />}>
              Virtual City
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            New Quest
          </Button>
        </div>
      </div>

      {/* Main Grid: Character Overview on Left, Quests on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Character Stats & Boss */}
        <div className="space-y-6">
          <CharacterPanel />
          <BossCard />
        </div>

        {/* Right Column: Active Quests & Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Quests Section */}
          <div className="rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-heading font-bold text-[var(--rpg-text)] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--rpg-primary)]" />
                  Active Adventures ({activeQuests.length})
                </h3>
                <p className="text-xs text-[var(--rpg-muted)] font-mono">
                  Tasks awaiting execution in the field
                </p>
              </div>

              <Link
                to="/app/quests"
                className="text-xs font-mono text-[var(--rpg-primary)] hover:underline flex items-center gap-1"
              >
                All Quests <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {isLoadingQuests ? (
              <div className="space-y-3">
                <div className="h-16 bg-[var(--rpg-surface-hover)] rounded animate-pulse" />
                <div className="h-16 bg-[var(--rpg-surface-hover)] rounded animate-pulse" />
              </div>
            ) : activeQuests.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-[var(--rpg-border)] rounded-[var(--rpg-radius)]">
                <Compass className="w-8 h-8 text-[var(--rpg-muted)] mx-auto mb-2" />
                <div className="text-sm font-semibold text-[var(--rpg-text)]">
                  All Current Quests Completed!
                </div>
                <p className="text-xs text-[var(--rpg-muted)] mt-1 mb-4">
                  Take a well-deserved rest or formulate a new goal.
                </p>
                <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
                  Create New Quest
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onComplete={handleCompleteQuest}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity / Transactions Log */}
          <div className="rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-heading font-bold text-[var(--rpg-text)] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--rpg-primary)]" />
                Recent Progression Ledger
              </h3>
              <span className="text-[10px] font-mono text-[var(--rpg-muted)] uppercase">
                Audit Trail
              </span>
            </div>

            {transactions.length === 0 ? (
              <p className="text-xs text-[var(--rpg-muted)] text-center py-4">
                No recorded progression transactions yet. Complete a quest to start!
              </p>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-2.5 rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)]/50 border border-[var(--rpg-border)] text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          tx.currency_type === 'XP' ? 'bg-cyan-400' : 'bg-amber-400'
                        }`}
                      />
                      <span className="text-[var(--rpg-text)] font-medium capitalize">
                        {tx.source_type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-bold ${
                          tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} {tx.currency_type}
                      </span>
                      <span className="text-[10px] text-[var(--rpg-muted)]">
                        {new Date(tx.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Quest Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Forge New Quest"
      >
        <form onSubmit={handleCreateQuest} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[var(--rpg-muted)] mb-1">
              Quest Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement OAuth2 Server or Run 5km"
              className="w-full px-3 py-2 border border-[var(--rpg-border)] rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] text-sm text-[var(--rpg-text)] placeholder-[var(--rpg-muted)] focus:outline-none focus:border-[var(--rpg-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[var(--rpg-muted)] mb-1">
              Description / Objectives
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details about what constitutes completion..."
              className="w-full px-3 py-2 border border-[var(--rpg-border)] rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] text-sm text-[var(--rpg-text)] placeholder-[var(--rpg-muted)] focus:outline-none focus:border-[var(--rpg-primary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--rpg-muted)] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--rpg-border)] rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] text-xs text-[var(--rpg-text)] focus:outline-none focus:border-[var(--rpg-primary)]"
              >
                <option value="coding">Coding (Intellect)</option>
                <option value="study">Study (Intellect)</option>
                <option value="fitness">Fitness (Strength)</option>
                <option value="creative">Creative (Creativity)</option>
                <option value="habit">Habit (Discipline)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[var(--rpg-muted)] mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--rpg-border)] rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] text-xs text-[var(--rpg-text)] focus:outline-none focus:border-[var(--rpg-primary)]"
              >
                <option value="easy">Easy (50 XP, 25 Gold)</option>
                <option value="medium">Medium (100 XP, 50 Gold)</option>
                <option value="hard">Hard (200 XP, 100 Gold)</option>
                <option value="epic">Epic (400 XP, 200 Gold)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--rpg-muted)] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--rpg-border)] rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] text-xs text-[var(--rpg-text)] focus:outline-none focus:border-[var(--rpg-primary)]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[var(--rpg-muted)] mb-1">
                Due Date (Optional)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--rpg-border)] rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] text-xs text-[var(--rpg-text)] focus:outline-none focus:border-[var(--rpg-primary)]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[var(--rpg-border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Inscribe Quest
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
