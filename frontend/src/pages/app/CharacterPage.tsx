import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Flame,
  Coins,
  Brain,
  Dumbbell,
  Sparkles,
  CheckCircle,
  Shield,
  Edit2,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';
import { api } from '../../api/client.js';
import { ProgressBar } from '../../components/shared/ProgressBar.js';
import { SkillTree } from '../../components/shared/SkillTree.js';
import { Button } from '../../components/shared/Button.js';
import { CharacterStage } from '../../components/character/CharacterStage.js';

export const CharacterPage: React.FC = () => {
  const { character, refreshCharacter, updateCharacterState } = useAuth();
  const { showToast } = useToast();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(character?.name || 'Hero');
  const [titleInput, setTitleInput] = useState(character?.title || 'Novice Adventurer');
  const [isSaving, setIsSaving] = useState(false);

  if (!character) {
    return (
      <div className="p-8 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] animate-pulse">
        <div className="h-8 w-48 bg-[var(--rpg-surface-hover)] rounded mb-4" />
      </div>
    );
  }

  const handleSaveProfile = async () => {
    if (!nameInput.trim()) return;
    setIsSaving(true);
    try {
      const res = await api.updateCharacter({
        name: nameInput.trim(),
        title: titleInput.trim(),
      });
      if (res.data.success) {
        updateCharacterState(res.data.character);
        setIsEditingName(false);
        showToast('Hero profile updated successfully!', 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || 'Failed to update character profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const attributes = [
    {
      key: 'intellect',
      label: 'Intellect',
      val: character.intellect,
      icon: Brain,
      color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40',
      description: 'Increases problem solving efficacy, coding speed, and comprehension.',
    },
    {
      key: 'strength',
      label: 'Strength',
      val: character.strength,
      icon: Dumbbell,
      color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
      description: 'Increases physical stamina, mental resilience, and baseline energy.',
    },
    {
      key: 'creativity',
      label: 'Creativity',
      val: character.creativity,
      icon: Sparkles,
      color: 'text-purple-400 bg-purple-950/40 border-purple-800/40',
      description: 'Enhances artistic innovation, lateral thinking, and architecture design.',
    },
    {
      key: 'discipline',
      label: 'Discipline',
      val: character.discipline,
      icon: CheckCircle,
      color: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
      description: 'Strengthens habit adherence, morning routines, and streak preservation.',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Grid: Hero Interactive Avatar Stage & Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 flex">
          <CharacterStage />
        </div>

        <div className="lg:col-span-7 p-6 sm:p-8 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-[var(--rpg-glow)] flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[var(--rpg-border)]">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] border-2 border-[var(--rpg-primary)] flex items-center justify-center text-[var(--rpg-primary)] shadow-[var(--rpg-glow)]">
                    <Crown className="w-8 h-8" />
                  </div>
                  <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded text-xs font-mono font-bold bg-[var(--rpg-primary)] text-black">
                    LVL {character.level}
                  </span>
                </div>

                <div>
                  {isEditingName ? (
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="px-2 py-1 text-base font-bold rounded bg-[var(--rpg-bg)] border border-[var(--rpg-border)] text-[var(--rpg-text)]"
                      />
                      <input
                        type="text"
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        className="px-2 py-1 text-xs rounded bg-[var(--rpg-bg)] border border-[var(--rpg-border)] text-[var(--rpg-muted)]"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSaveProfile}
                        isLoading={isSaving}
                        icon={<Check className="w-4 h-4" />}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <h1 className="text-xl sm:text-2xl font-heading font-black text-[var(--rpg-text)]">
                        {character.name}
                      </h1>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1 text-[var(--rpg-muted)] hover:text-[var(--rpg-primary)]"
                        title="Edit Name & Title"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-[var(--rpg-muted)] font-mono">{character.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1 text-orange-400 font-bold px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <Flame className="w-4 h-4 fill-orange-400 animate-pulse" />
                  {character.streak_count}d Streak
                </span>
                <span className="flex items-center gap-1 text-amber-300 font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Coins className="w-4 h-4 text-amber-400" />
                  {character.gold} Gold
                </span>
              </div>
            </div>

            {/* XP Progression Bar */}
            <div className="mt-5 p-4 rounded-xl bg-black/20 border border-[var(--rpg-border)]">
              <ProgressBar
                value={character.current_xp}
                max={character.requiredXP}
                label="Level Progression"
                subLabel={`${character.current_xp} / ${character.requiredXP} XP`}
                showPercentage={true}
                height="lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attributes Deep Dive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {attributes.map((attr) => {
          const Icon = attr.icon;
          return (
            <div
              key={attr.key}
              className="p-5 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded border ${attr.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-mono font-black text-[var(--rpg-text)]">
                  {attr.val}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[var(--rpg-text)] mb-1">
                {attr.label}
              </h3>
              <p className="text-xs text-[var(--rpg-muted)] leading-relaxed">
                {attr.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Embedded Skill Tree Component */}
      <SkillTree />
    </div>
  );
};
