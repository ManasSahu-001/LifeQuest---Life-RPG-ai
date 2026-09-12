import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Shield, Zap, Building2, Flame } from 'lucide-react';
import { Button } from '../../components/shared/Button.js';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Create Your Hero & Choose Your Theme',
      desc: 'Pick your hero name and initial visual theme—Cyberpunk Neo-Tokyo, Medieval High Fantasy, or Solarpunk Biophilic. Your choice persists across devices without altering your core character stats.',
      icon: Shield,
    },
    {
      num: '02',
      title: 'Define Real-World Quests & Attributes',
      desc: 'Add coding sessions, study targets, workout routines, or daily habits. Set difficulties and deadlines. Each category links dynamically to Intellect, Strength, Creativity, or Discipline.',
      icon: Zap,
    },
    {
      num: '03',
      title: 'Grind, Maintain Streaks & Damage Bosses',
      desc: 'Complete tasks to trigger server-authoritative XP and Gold rewards. Consecutive active days earn up to +100% streak multipliers, while quest completions simultaneously strike the World Boss.',
      icon: Flame,
    },
    {
      num: '04',
      title: 'Expand Your Virtual Metropolis',
      desc: 'Watch your city transform. Each quest completed and level gained upgrades monuments, research labs, power grids, and botanical gardens on your live city grid.',
      icon: Building2,
    },
  ];

  return (
    <div className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--rpg-primary)]">
          Four Simple Steps
        </span>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-[var(--rpg-text)] mt-2 mb-4">
          How Life RPG Works
        </h1>
        <p className="text-sm sm:text-base text-[var(--rpg-muted)]">
          From mundane daily chores to high-impact career projects, learn how the Life RPG loop keeps you locked in flow.
        </p>
      </div>

      {/* Step by Step Timeline */}
      <div className="space-y-8 mb-16">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] flex flex-col md:flex-row items-start gap-6 shadow-sm"
            >
              <div className="flex items-center gap-4 md:flex-col md:items-center">
                <span className="text-3xl font-heading font-black text-[var(--rpg-primary)]">
                  {step.num}
                </span>
                <div className="w-10 h-10 rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] border border-[var(--rpg-primary)]/40 flex items-center justify-center text-[var(--rpg-primary)]">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-heading font-bold text-[var(--rpg-text)] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--rpg-muted)] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <Link to="/signup">
          <Button size="lg" variant="primary" icon={<ArrowRight className="w-5 h-5" />}>
            Begin Step 1: Create Your Hero
          </Button>
        </Link>
      </div>
    </div>
  );
};
