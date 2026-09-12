import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Zap,
  Building2,
  Flame,
  Swords,
  Layers,
  Award,
  Coins,
  ArrowRight,
  Database,
  Lock,
} from 'lucide-react';
import { Button } from '../../components/shared/Button.js';

export const FeaturesPage: React.FC = () => {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--rpg-primary)]">
          RPG Mechanics & Architecture
        </span>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-[var(--rpg-text)] mt-2 mb-4">
          Engineered for Long-Term Motivation
        </h1>
        <p className="text-sm sm:text-base text-[var(--rpg-muted)]">
          Discover why LifeQuest outperforms conventional habit trackers and simple todo lists through deep game loops, server-authoritative balance, and visual city expansion.
        </p>
      </div>

      {/* Feature Deep Dive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {/* Card 1 */}
        <div className="p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)]">
          <div className="w-10 h-10 rounded bg-cyan-950/50 text-cyan-400 border border-cyan-800/40 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-heading font-bold text-[var(--rpg-text)] mb-2">
            Nonlinear Leveling Engine
          </h3>
          <p className="text-xs text-[var(--rpg-muted)] leading-relaxed">
            Deterministic required XP formula with multi-level overflow guarantees early momentum without trivializing late-game milestones.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)]">
          <div className="w-10 h-10 rounded bg-amber-950/50 text-amber-400 border border-amber-800/40 flex items-center justify-center mb-4">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-heading font-bold text-[var(--rpg-text)] mb-2">
            Virtual City Metropolitan Grid
          </h3>
          <p className="text-xs text-[var(--rpg-muted)] leading-relaxed">
            Every completed quest permanently erects new infrastructure in your personalized city grid. Level 1 starts with a humble camp; Level 10 boasts high-tech skyscrapers.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)]">
          <div className="w-10 h-10 rounded bg-orange-950/50 text-orange-400 border border-orange-800/40 flex items-center justify-center mb-4">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="text-base font-heading font-bold text-[var(--rpg-text)] mb-2">
            Streak Multiplier Loops
          </h3>
          <p className="text-xs text-[var(--rpg-muted)] leading-relaxed">
            Daily consistency is rewarded with cumulative multipliers scaling up to 2x bonus XP and Gold. Missed days reset streak cleanly to preserve real stakes.
          </p>
        </div>

        {/* Card 4 */}
        <div className="p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)]">
          <div className="w-10 h-10 rounded bg-rose-950/50 text-rose-400 border border-rose-800/40 flex items-center justify-center mb-4">
            <Swords className="w-5 h-5" />
          </div>
          <h3 className="text-base font-heading font-bold text-[var(--rpg-text)] mb-2">
            Community Boss Battles
          </h3>
          <p className="text-xs text-[var(--rpg-muted)] leading-relaxed">
            Face fearsome raid bosses like The Burnout Behemoth. Every quest completion automatically damages the monster with weakness category multipliers.
          </p>
        </div>

        {/* Card 5 */}
        <div className="p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)]">
          <div className="w-10 h-10 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 flex items-center justify-center mb-4">
            <Coins className="w-5 h-5" />
          </div>
          <h3 className="text-base font-heading font-bold text-[var(--rpg-text)] mb-2">
            Real-Life Gold Economy
          </h3>
          <p className="text-xs text-[var(--rpg-muted)] leading-relaxed">
            Spend earned gold in the Reward Shop to unlock guilt-free gaming hours, gourmet cheat meals, favorite books, or weekend getaways.
          </p>
        </div>

        {/* Card 6 */}
        <div className="p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)]">
          <div className="w-10 h-10 rounded bg-purple-950/50 text-purple-400 border border-purple-800/40 flex items-center justify-center mb-4">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-heading font-bold text-[var(--rpg-text)] mb-2">
            PostgreSQL Persistence & ACID
          </h3>
          <p className="text-xs text-[var(--rpg-muted)] leading-relaxed">
            Every quest completion, attribute upgrade, and XP transaction executes in an atomic database transaction. Never lose progress to browser cache drops.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] text-center max-w-2xl mx-auto shadow-[var(--rpg-glow)]">
        <h2 className="text-xl font-heading font-bold text-[var(--rpg-text)] mb-3">
          Experience True Server-Authoritative Gamification
        </h2>
        <p className="text-xs text-[var(--rpg-muted)] mb-6">
          Level up your productivity in Cyberpunk, High Fantasy, or Solarpunk visual themes today.
        </p>
        <Link to="/signup">
          <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
            Create Adventurer Account
          </Button>
        </Link>
      </div>
    </div>
  );
};
