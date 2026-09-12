import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does nonlinear leveling work?',
      a: 'Level progression uses a deterministic exponential curve: requiredXP(level) = baseXP × (1.25)^(level - 1). If a massive quest or achievement grants enough XP to cross multiple levels, the backend server accurately loops and carries over surplus XP without loss.',
    },
    {
      q: 'Are my quests and character progression isolated and private?',
      a: 'Yes. The backend database enforces strict user isolation on every single query. User A cannot view, update, delete, or complete User B’s quests or access their transactions under any circumstances.',
    },
    {
      q: 'How do streaks work, and what happens if I miss a day?',
      a: 'If you complete a quest on consecutive UTC days, your streak counter increments by +1 (granting +10% bonus XP and +5% bonus Gold per day, up to 2x total). If a full day passes without completing any quests, the streak safely resets to 1 upon your next completion.',
    },
    {
      q: 'Can I switch between Cyberpunk, High Fantasy, and Solarpunk themes?',
      a: 'Absolutely! You can switch themes at any moment from the theme selector in the top navigation bar. Your theme choice is stored in your user profile on the backend, and all your quests, character stats, and city buildings remain 100% identical.',
    },
    {
      q: 'How do World Boss battles work?',
      a: 'World Bosses (such as The Burnout Behemoth) possess high HP pools. Every time you complete a quest in the real world, you automatically strike the active boss for damage equal to your earned XP. Matching the boss’s weakness category grants a 1.5x damage bonus. Defeating a boss yields massive community Gold bounties!',
    },
  ];

  return (
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--rpg-primary)]">
          Knowledge Base
        </span>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-[var(--rpg-text)] mt-2 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-[var(--rpg-muted)]">
          Everything you need to know about the LifeQuest game mechanics, privacy, and leveling engine.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full px-6 py-4 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-[var(--rpg-text)] hover:text-[var(--rpg-primary)] transition-colors focus-visible:outline-none"
              aria-expanded={openIndex === idx}
            >
              <span className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-[var(--rpg-primary)] flex-shrink-0" />
                {faq.q}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[var(--rpg-muted)] transition-transform duration-200 ${
                  openIndex === idx ? 'rotate-180 text-[var(--rpg-primary)]' : ''
                }`}
              />
            </button>

            {openIndex === idx && (
              <div className="px-6 pb-5 text-xs sm:text-sm text-[var(--rpg-muted)] leading-relaxed border-t border-[var(--rpg-border)]/50 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
