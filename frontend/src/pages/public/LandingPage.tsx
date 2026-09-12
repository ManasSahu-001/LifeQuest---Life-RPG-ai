import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Building2,
  Flame,
  Swords,
  Zap,
  ArrowRight,
  Brain,
  Dumbbell,
  Sparkles,
  CheckCircle,
  Trophy,
} from 'lucide-react';
import { Button } from '../../components/shared/Button.js';
import { useTheme } from '../../context/ThemeContext.js';

export const LandingPage: React.FC = () => {
  const { currentThemeId, setThemeId, availableThemes } = useTheme();

  return (
    <div className="relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--rpg-primary)]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--rpg-surface)] border border-[var(--rpg-border)] text-xs font-mono text-[var(--rpg-primary)] mb-8 shadow-[var(--rpg-glow)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gamified Productivity RPG • City Building Engine</span>
          </motion.div>

          {/* Exact Required H1 for SEO */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-[var(--rpg-text)] max-w-4xl mx-auto leading-[1.1] mb-6"
          >
            Turn Your Real Life Into a{' '}
            <span className="text-[var(--rpg-primary)] drop-shadow-[0_0_25px_var(--rpg-card-glow)]">
              City-Building RPG
            </span>
          </motion.h1>

          {/* Required Meta Positioning */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-[var(--rpg-muted)] max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            Turn your real-life goals and daily tasks into an RPG. Complete quests, earn XP, build your virtual city, maintain streaks, and level up.
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/signup">
              <Button size="lg" variant="primary" icon={<ArrowRight className="w-5 h-5" />}>
                Start Your Adventure Free
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline">
                Explore RPG Mechanics
              </Button>
            </Link>
          </motion.div>

          {/* Interactive Theme Switcher Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-[var(--rpg-glow-lg)]"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[var(--rpg-border)] mb-6">
              <div className="text-left">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--rpg-muted)]">
                  Presentation Engine
                </span>
                <h3 className="text-base font-heading font-bold text-[var(--rpg-text)]">
                  Experience Multi-Theme Immersion
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {availableThemes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setThemeId(t.id, false)}
                    className={`px-3 py-1.5 rounded-[var(--rpg-radius)] text-xs font-mono font-bold transition-all ${
                      currentThemeId === t.id
                        ? 'bg-[var(--rpg-primary)] text-black shadow-md'
                        : 'bg-[var(--rpg-bg)] text-[var(--rpg-muted)] hover:text-[var(--rpg-text)] border border-[var(--rpg-border)]'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Showcase preview cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)]/60 border border-[var(--rpg-border)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                    CODING QUEST
                  </span>
                  <span className="text-xs font-mono text-amber-400 font-bold">+100 XP</span>
                </div>
                <div className="text-sm font-bold text-[var(--rpg-text)] mb-1">
                  Optimize Database Indexing
                </div>
                <div className="text-xs text-[var(--rpg-muted)]">
                  Awards +2 Intellect & unlocks Solar Tech Hub building
                </div>
              </div>

              <div className="p-4 rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)]/60 border border-[var(--rpg-border)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                    FITNESS QUEST
                  </span>
                  <span className="text-xs font-mono text-amber-400 font-bold">+75 XP</span>
                </div>
                <div className="text-sm font-bold text-[var(--rpg-text)] mb-1">
                  5km Morning Sprint
                </div>
                <div className="text-xs text-[var(--rpg-muted)]">
                  Awards +2 Strength & expands Stadium District
                </div>
              </div>

              <div className="p-4 rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)]/60 border border-[var(--rpg-border)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                    WORLD BOSS
                  </span>
                  <span className="text-xs font-mono text-rose-400 font-bold">1000 HP</span>
                </div>
                <div className="text-sm font-bold text-[var(--rpg-text)] mb-1">
                  The Burnout Behemoth
                </div>
                <div className="text-xs text-[var(--rpg-muted)]">
                  Every quest deals damage. Defeat for 500 Gold!
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 border-t border-[var(--rpg-border)] bg-[var(--rpg-surface)]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-[var(--rpg-text)] mb-4">
              Real Life Productivity, Built Like an Epic RPG
            </h2>
            <p className="text-sm sm:text-base text-[var(--rpg-muted)]">
              Forget mundane checkboxes and generic badges. Life RPG converts every completed task into tangible progression, character growth, and virtual city infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-sm">
              <div className="w-12 h-12 rounded-[var(--rpg-radius)] bg-[var(--rpg-primary)]/10 text-[var(--rpg-primary)] flex items-center justify-center mb-4 border border-[var(--rpg-primary)]/30">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-[var(--rpg-text)] mb-2">
                Virtual City Construction
              </h3>
              <p className="text-xs text-[var(--rpg-muted)] leading-relaxed">
                As you grind real-world goals, your virtual skyline rises. Unlock Research Labs with coding quests, Parks with fitness habits, and Grand Libraries with study sessions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-sm">
              <div className="w-12 h-12 rounded-[var(--rpg-radius)] bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4 border border-orange-500/30">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-[var(--rpg-text)] mb-2">
                Streak Multipliers & Leveling
              </h3>
              <p className="text-xs text-[var(--rpg-muted)] leading-relaxed">
                Deterministic nonlinear leveling guarantees your progression stays meaningful. Consecutive daily streaks stack up to +100% bonus XP and Gold multipliers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-sm">
              <div className="w-12 h-12 rounded-[var(--rpg-radius)] bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/30">
                <Swords className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-[var(--rpg-text)] mb-2">
                World Boss Raids
              </h3>
              <p className="text-xs text-[var(--rpg-muted)] leading-relaxed">
                Fight back against deadline dread and procrastination. Every completed quest strikes the active world boss for damage matching your earned XP.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Attribute Synergy Section */}
      <section className="py-20 border-t border-[var(--rpg-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--rpg-primary)]">
                Data-Driven Stat Balancing
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-black text-[var(--rpg-text)] mt-2 mb-4">
                Level Up 4 Core Life Attributes
              </h2>
              <p className="text-sm text-[var(--rpg-muted)] mb-6 leading-relaxed">
                Every quest category feeds directly into your hero's attributes. Cultivate a balanced build across mind, body, and habit execution.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)]">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  <div className="text-xs">
                    <span className="font-bold text-[var(--rpg-text)]">Intellect</span>: Earned via coding sprints and intensive study sessions.
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)]">
                  <Dumbbell className="w-5 h-5 text-emerald-400" />
                  <div className="text-xs">
                    <span className="font-bold text-[var(--rpg-text)]">Strength</span>: Earned via gym workouts, calisthenics, and active recreation.
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)]">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <div className="text-xs">
                    <span className="font-bold text-[var(--rpg-text)]">Creativity</span>: Earned via writing, art, architecture, and design tasks.
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)]">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  <div className="text-xs">
                    <span className="font-bold text-[var(--rpg-text)]">Discipline</span>: Earned via recurring daily habits, sleep hygiene, and routines.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-[var(--rpg-glow)] text-center">
              <div className="w-20 h-20 rounded-full bg-[var(--rpg-primary)]/10 border-2 border-[var(--rpg-primary)] flex items-center justify-center mx-auto mb-6 text-[var(--rpg-primary)] shadow-[var(--rpg-glow)]">
                <Trophy className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-heading font-bold text-[var(--rpg-text)] mb-2">
                Ready to Claim Your Throne?
              </h3>
              <p className="text-xs text-[var(--rpg-muted)] mb-6 max-w-md mx-auto">
                Join thousands of creators, engineers, and high performers turning daily tasks into a high-stakes adventure.
              </p>
              <Link to="/signup">
                <Button size="lg" variant="primary" className="w-full sm:w-auto">
                  Create Your Hero Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
