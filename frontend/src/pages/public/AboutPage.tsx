import React from 'react';
import { Shield, CheckCircle, Database, Lock, Sparkles, Terminal } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--rpg-primary)]">
          Mission & Architecture
        </span>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-[var(--rpg-text)] mt-2 mb-4">
          About Life RPG
        </h1>
        <p className="text-sm sm:text-base text-[var(--rpg-muted)]">
          The story behind why we built a genuine, server-authoritative RPG engine to replace boring todo lists.
        </p>
      </div>

      <div className="space-y-8 text-sm text-[var(--rpg-muted)] leading-relaxed">
        <div className="p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)]">
          <h2 className="text-lg font-heading font-bold text-[var(--rpg-text)] mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--rpg-primary)]" />
            Beyond the "Todo List + Badge" Anti-Pattern
          </h2>
          <p className="mb-3">
            Most gamified productivity apps slap superficial badges or arbitrary streaks on top of standard spreadsheet-like interfaces. Within two weeks, users burn out because the rewards are meaningless and the math is unbalanced.
          </p>
          <p>
            Life RPG was conceived as a hardcore RPG system first. Built with mathematical rigor, nonlinear required XP curves, data-driven attributes, and tangible city building, every click reinforces your momentum.
          </p>
        </div>

        <div className="p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)]">
          <h2 className="text-lg font-heading font-bold text-[var(--rpg-text)] mb-3 flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            Server-Authoritative Trust Model
          </h2>
          <p className="mb-3">
            In competitive multiplayer games and high-stakes financial systems, client-side calculations are never trusted. We brought the same engineering discipline to Life RPG:
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Zero frontend XP, Gold, or Level calculations.</li>
            <li>PostgreSQL relational persistence with strict foreign key constraints and ACID transactions.</li>
            <li>Complete user isolation with encrypted passwords and scoped JWT authorization.</li>
            <li>Immutable audit logs for XP and Gold transactions.</li>
          </ul>
        </div>

        <div className="p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)]">
          <h2 className="text-lg font-heading font-bold text-[var(--rpg-text)] mb-3 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            Designed for 8 Unique Visual Themes
          </h2>
          <p>
            Whether you thrive in neon-lit Cyberpunk dystopias, high fantasy medieval guilds, or solarpunk ecologies, Life RPG decouples presentation from game state. The same character, quests, and city can be experienced through radically different artistic lenses.
          </p>
        </div>
      </div>
    </div>
  );
};
