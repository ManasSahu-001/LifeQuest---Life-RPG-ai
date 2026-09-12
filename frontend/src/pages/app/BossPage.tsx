import React from 'react';
import { Swords, ShieldAlert, Trophy, Zap, Skull } from 'lucide-react';
import { BossCard } from '../../components/shared/BossCard.js';

export const BossPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-black text-[var(--rpg-text)] flex items-center gap-2">
          <Swords className="w-6 h-6 text-rose-400" />
          World Boss Raid Encounter
        </h1>
        <p className="text-xs text-[var(--rpg-muted)] font-mono">
          Join forces with fellow adventurers to vanquish procrastination and deadline anxiety
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Boss Battle Card */}
        <div className="lg:col-span-2">
          <BossCard />
        </div>

        {/* Right Column: Battle Guide & Tactical Intel */}
        <div className="space-y-6">
          <div className="p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-sm">
            <h3 className="text-base font-heading font-bold text-[var(--rpg-text)] mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              Tactical Battle Intel
            </h3>

            <div className="space-y-3 text-xs text-[var(--rpg-muted)] leading-relaxed">
              <p>
                <strong className="text-[var(--rpg-text)]">Passive Strike Synergy:</strong> Whenever you complete a quest in the real world, your hero unleashes a kinetic attack dealing damage equal to <span className="font-mono text-cyan-400">XP / 2</span>.
              </p>
              <p>
                <strong className="text-[var(--rpg-text)]">Weakness Exploitation:</strong> Quests matching the boss's listed weakness category deliver an amplified <span className="font-mono text-amber-400">1.5x damage critical strike</span>.
              </p>
              <p>
                <strong className="text-[var(--rpg-text)]">Community Victory:</strong> Once the colossus collapses to 0 HP, massive bounty rewards of gold and experience points are distributed!
              </p>
            </div>
          </div>

          <div className="p-6 rounded-[var(--rpg-radius)] bg-gradient-to-br from-rose-950/30 to-[var(--rpg-surface)] border border-rose-900/40 text-center">
            <Skull className="w-10 h-10 text-rose-400 mx-auto mb-2 animate-pulse" />
            <h4 className="text-sm font-bold text-rose-300 mb-1">
              "You cannot escape your unfinished tasks..."
            </h4>
            <p className="text-[11px] text-[var(--rpg-muted)] font-mono">
              Complete your active daily quests to weaken the beast.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
