import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Cpu,
  BookOpen,
  Dumbbell,
  Sparkles,
  CheckCircle2,
  Users,
  Zap,
  Smile,
  Crown,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { Modal } from '../../components/shared/Modal.js';

interface BuildingInfo {
  id: string;
  name: string;
  category: string;
  levelRequired: number;
  unlocked: boolean;
  statType: string;
  description: string;
  tier: number;
  icon: any;
  visualColor: string;
}

export const CityPage: React.FC = () => {
  const { character } = useAuth();
  const { currentThemeId } = useTheme();
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingInfo | null>(null);

  const charLevel = character?.level || 1;
  const intellect = character?.intellect || 10;
  const strength = character?.strength || 10;
  const creativity = character?.creativity || 10;
  const discipline = character?.discipline || 10;

  // City Vital Metrics calculated from RPG state
  const population = charLevel * 1250 + (character?.current_xp || 0) * 8;
  const powerOutput = Math.round(intellect * 15 + discipline * 12);
  const cityHappiness = Math.min(100, 60 + (character?.streak_count || 0) * 5);

  const buildings: BuildingInfo[] = [
    {
      id: 'b1',
      name: 'Central Metropolis Citadel',
      category: 'Civic',
      levelRequired: 1,
      unlocked: true,
      statType: 'Level Core',
      description: 'The commanding headquarters of your virtual empire. Upgrades automatically as your character reaches higher levels.',
      tier: Math.min(5, Math.floor(charLevel / 2) + 1),
      icon: Crown,
      visualColor: 'from-amber-500 to-yellow-600',
    },
    {
      id: 'b2',
      name: 'Quantum AI Research Tower',
      category: 'Coding',
      levelRequired: 2,
      unlocked: charLevel >= 2 || intellect >= 12,
      statType: 'Intellect: ' + intellect,
      description: 'Houses high-throughput neural network servers fueled by real-world coding challenges and software architecture tasks.',
      tier: Math.min(4, Math.floor(intellect / 5)),
      icon: Cpu,
      visualColor: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'b3',
      name: 'Grand Alexandria Archives',
      category: 'Study',
      levelRequired: 2,
      unlocked: charLevel >= 2 || intellect >= 12,
      statType: 'Intellect: ' + intellect,
      description: 'A monument of eternal knowledge preserving research papers, books read, and academic notes.',
      tier: Math.min(4, Math.floor(intellect / 5)),
      icon: BookOpen,
      visualColor: 'from-indigo-500 to-purple-600',
    },
    {
      id: 'b4',
      name: 'Olympian Kinetic Coliseum',
      category: 'Fitness',
      levelRequired: 3,
      unlocked: charLevel >= 3 || strength >= 12,
      statType: 'Strength: ' + strength,
      description: 'A massive athletic arena that converts real-world workout energy and cardio sessions into citywide stamina.',
      tier: Math.min(4, Math.floor(strength / 5)),
      icon: Dumbbell,
      visualColor: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'b5',
      name: 'Prism Opera & Art Pavilion',
      category: 'Creative',
      levelRequired: 3,
      unlocked: charLevel >= 3 || creativity >= 12,
      statType: 'Creativity: ' + creativity,
      description: 'A glowing cultural landmark dedicated to writing, music, visual design, and inventive ideation.',
      tier: Math.min(4, Math.floor(creativity / 5)),
      icon: Sparkles,
      visualColor: 'from-purple-500 to-pink-600',
    },
    {
      id: 'b6',
      name: 'Chronos Clocktower & Zen Gardens',
      category: 'Habits',
      levelRequired: 4,
      unlocked: charLevel >= 4 || discipline >= 12,
      statType: 'Discipline: ' + discipline,
      description: 'Erected through unwavering daily routines, sleep consistency, and habit adherence.',
      tier: Math.min(4, Math.floor(discipline / 5)),
      icon: CheckCircle2,
      visualColor: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* City Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-black text-[var(--rpg-text)] flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[var(--rpg-primary)]" />
            Metropolitan City Grid
          </h1>
          <p className="text-xs text-[var(--rpg-muted)] font-mono">
            Every completed quest permanently expands your city skyline and monuments
          </p>
        </div>

        {/* City Stats Bar */}
        <div className="flex items-center gap-4 bg-[var(--rpg-surface)] border border-[var(--rpg-border)] px-4 py-2 rounded-[var(--rpg-radius)] text-xs font-mono">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Users className="w-4 h-4" />
            <span className="text-[var(--rpg-text)] font-bold">
              {population.toLocaleString()}
            </span>
            <span className="text-[var(--rpg-muted)]">Pop.</span>
          </div>

          <div className="w-[1px] h-4 bg-[var(--rpg-border)]" />

          <div className="flex items-center gap-1.5 text-amber-400">
            <Zap className="w-4 h-4" />
            <span className="text-[var(--rpg-text)] font-bold">{powerOutput} MW</span>
            <span className="text-[var(--rpg-muted)]">Power</span>
          </div>

          <div className="w-[1px] h-4 bg-[var(--rpg-border)]" />

          <div className="flex items-center gap-1.5 text-emerald-400">
            <Smile className="w-4 h-4" />
            <span className="text-[var(--rpg-text)] font-bold">{cityHappiness}%</span>
            <span className="text-[var(--rpg-muted)]">Happiness</span>
          </div>
        </div>
      </div>

      {/* Interactive Isometric City Grid */}
      <div className="p-8 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-[var(--rpg-glow-lg)] relative overflow-hidden">
        {/* City Background Aesthetic */}
        <div className="text-center mb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--rpg-muted)]">
            District Quadrant View
          </span>
          <h3 className="text-lg font-heading font-bold text-[var(--rpg-text)]">
            Active Skyline Blueprint
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildings.map((b) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.id}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => setSelectedBuilding(b)}
                className={`cursor-pointer relative p-6 rounded-[var(--rpg-radius)] border transition-all ${
                  b.unlocked
                    ? 'bg-[var(--rpg-bg)]/80 border-[var(--rpg-border)] hover:border-[var(--rpg-primary)] hover:shadow-[var(--rpg-glow)]'
                    : 'bg-[var(--rpg-bg)]/30 border-dashed border-[var(--rpg-border)] opacity-60'
                }`}
              >
                {/* Building Visual Crest */}
                <div
                  className={`w-16 h-16 rounded-[var(--rpg-radius)] bg-gradient-to-br ${b.visualColor} text-white flex items-center justify-center mb-4 shadow-lg`}
                >
                  <Icon className="w-8 h-8 drop-shadow" />
                </div>

                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase text-[var(--rpg-muted)]">
                    {b.category}
                  </span>
                  {b.unlocked ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--rpg-primary)]/20 text-[var(--rpg-primary)] border border-[var(--rpg-primary)]/40">
                      Tier {b.tier}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[var(--rpg-muted)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)]">
                      Lvl {b.levelRequired} Req
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-heading font-bold text-[var(--rpg-text)] mb-2">
                  {b.name}
                </h4>

                <p className="text-xs text-[var(--rpg-muted)] line-clamp-2 mb-3 leading-relaxed">
                  {b.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--rpg-border)]/50 text-[11px] font-mono">
                  <span className="text-[var(--rpg-muted)]">{b.statType}</span>
                  <span className="text-[var(--rpg-primary)] flex items-center gap-1 font-semibold">
                    <Info className="w-3.5 h-3.5" /> Details
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Building Details Modal */}
      <Modal
        isOpen={!!selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
        title={selectedBuilding?.name || 'Building Details'}
      >
        {selectedBuilding && (
          <div className="space-y-4">
            <div
              className={`w-20 h-20 rounded-[var(--rpg-radius)] bg-gradient-to-br ${selectedBuilding.visualColor} text-white flex items-center justify-center mx-auto shadow-xl`}
            >
              {React.createElement(selectedBuilding.icon, { className: 'w-10 h-10' })}
            </div>

            <div className="text-center">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[var(--rpg-primary)]/20 text-[var(--rpg-primary)]">
                {selectedBuilding.category.toUpperCase()} DISTRICT • TIER {selectedBuilding.tier}
              </span>
            </div>

            <p className="text-xs text-[var(--rpg-text)] leading-relaxed">
              {selectedBuilding.description}
            </p>

            <div className="p-3 rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] border border-[var(--rpg-border)] space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[var(--rpg-muted)]">Status:</span>
                <span className={selectedBuilding.unlocked ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {selectedBuilding.unlocked ? 'Constructed & Operational' : 'Under Blueprint Lock'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--rpg-muted)]">Required Character Level:</span>
                <span className="text-[var(--rpg-text)]">Level {selectedBuilding.levelRequired}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--rpg-muted)]">Synergized Virtue:</span>
                <span className="text-cyan-400">{selectedBuilding.statType}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
