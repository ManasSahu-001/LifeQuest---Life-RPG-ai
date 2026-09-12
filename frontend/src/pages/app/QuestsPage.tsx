import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Code,
  BookOpen,
  Dumbbell,
  Sparkles,
  CheckCircle,
  Search,
  Zap,
} from 'lucide-react';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.js';
import { QuestCard, Quest } from '../../components/shared/QuestCard.js';
import { Button } from '../../components/shared/Button.js';
import { Modal } from '../../components/shared/Modal.js';

export const QuestsPage: React.FC = () => {
  const { updateCharacterState } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('coding');
  const [difficulty, setDifficulty] = useState('medium');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuests = async () => {
    try {
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;

      const res = await api.getQuests(params);
      if (res.data.success) {
        setQuests(res.data.quests);
      }
    } catch (err) {
      console.warn('Failed to fetch quests', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, [statusFilter, categoryFilter]);

  const handleOpenCreateModal = () => {
    setEditingQuest(null);
    setTitle('');
    setDescription('');
    setCategory('coding');
    setDifficulty('medium');
    setPriority('medium');
    setDueDate('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (quest: Quest) => {
    setEditingQuest(quest);
    setTitle(quest.title);
    setDescription(quest.description);
    setCategory(quest.category);
    setDifficulty(quest.difficulty);
    setPriority(quest.priority);
    setDueDate(quest.due_date ? quest.due_date.split('T')[0] : '');
    setIsModalOpen(true);
  };

  const handleSaveQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);

    try {
      if (editingQuest) {
        // Update
        const res = await api.updateQuest(editingQuest.id, {
          title,
          description,
          category,
          difficulty,
          priority,
          due_date: dueDate || null,
        });
        if (res.data.success) {
          setIsModalOpen(false);
          await fetchQuests();
        }
      } else {
        // Create
        const res = await api.createQuest({
          title,
          description,
          category,
          difficulty,
          priority,
          due_date: dueDate || null,
        });
        if (res.data.success) {
          setIsModalOpen(false);
          await fetchQuests();
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save quest');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteQuest = async (id: number) => {
    try {
      const res = await api.completeQuest(id);
      if (res.data.success) {
        if (res.data.character) {
          updateCharacterState(res.data.character);
        }
        await fetchQuests();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Quest completion error');
    }
  };

  const handleDeleteQuest = async (id: number) => {
    try {
      const res = await api.deleteQuest(id);
      if (res.data.success) {
        await fetchQuests();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete quest');
    }
  };

  const filteredQuests = quests.filter((q) => {
    if (!searchQuery.trim()) return true;
    const qStr = searchQuery.toLowerCase();
    return (
      q.title.toLowerCase().includes(qStr) ||
      (q.description && q.description.toLowerCase().includes(qStr))
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-black text-[var(--rpg-text)] flex items-center gap-2">
            <Zap className="w-6 h-6 text-[var(--rpg-primary)]" />
            Quest Log & Objectives
          </h1>
          <p className="text-xs text-[var(--rpg-muted)] font-mono">
            Execute missions to gather experience, cultivate virtues, and earn gold
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreateModal}
        >
          Create Quest
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rpg-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active quests..."
            className="w-full pl-9 pr-3 py-1.5 rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] border border-[var(--rpg-border)] text-xs text-[var(--rpg-text)] placeholder-[var(--rpg-muted)] focus:outline-none focus:border-[var(--rpg-primary)]"
          />
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5 self-start md:self-auto">
          {(['active', 'completed', 'all'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-[var(--rpg-radius)] text-xs font-mono capitalize transition-all ${
                statusFilter === st
                  ? 'bg-[var(--rpg-primary)] text-black font-bold shadow-sm'
                  : 'bg-[var(--rpg-bg)] text-[var(--rpg-muted)] hover:text-[var(--rpg-text)] border border-[var(--rpg-border)]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Category Dropdown Filter */}
        <div className="w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-1.5 rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] border border-[var(--rpg-border)] text-xs text-[var(--rpg-text)] focus:outline-none focus:border-[var(--rpg-primary)] font-mono"
          >
            <option value="all">All Categories</option>
            <option value="coding">Coding (Intellect)</option>
            <option value="study">Study (Intellect)</option>
            <option value="fitness">Fitness (Strength)</option>
            <option value="creative">Creative (Creativity)</option>
            <option value="habit">Habit (Discipline)</option>
          </select>
        </div>
      </div>

      {/* Quest Cards List */}
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-20 bg-[var(--rpg-surface)] rounded animate-pulse" />
          <div className="h-20 bg-[var(--rpg-surface)] rounded animate-pulse" />
          <div className="h-20 bg-[var(--rpg-surface)] rounded animate-pulse" />
        </div>
      ) : filteredQuests.length === 0 ? (
        <div className="p-12 text-center rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-dashed border-[var(--rpg-border)]">
          <CheckCircle2 className="w-12 h-12 text-[var(--rpg-muted)] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-heading font-bold text-[var(--rpg-text)]">
            No Quests Matched Your Filter
          </h3>
          <p className="text-xs text-[var(--rpg-muted)] mt-1 mb-4">
            Create a new adventure or switch filter tags.
          </p>
          <Button variant="primary" size="sm" onClick={handleOpenCreateModal}>
            Add Quest
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onComplete={handleCompleteQuest}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteQuest}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingQuest ? 'Edit Quest Details' : 'Forge New Quest'}
      >
        <form onSubmit={handleSaveQuest} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[var(--rpg-muted)] mb-1">
              Quest Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master PostgreSQL Indexing or 30m Run"
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
              placeholder="Outline steps or deliverables..."
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
              {editingQuest ? 'Save Changes' : 'Inscribe Quest'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
