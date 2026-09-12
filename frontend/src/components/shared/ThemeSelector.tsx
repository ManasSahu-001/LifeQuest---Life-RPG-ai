import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Check,
  Lock,
  Sparkles,
  Sword,
  Building2,
  Cpu,
  Shield,
  Sun,
  X,
  AlertCircle,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { audioEngine } from '../../services/audioEngine.js';
import { ThemeDefinition } from '../../themes/types.js';

interface ThemeSelectorProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const THEME_ICONS: Record<string, any> = {
  Cpu,
  Shield,
  Sun,
  Sparkles,
  Sword,
  Building2,
};

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  const {
    currentThemeId,
    setThemeId,
    availableThemes,
    isThemeSelectorOpen,
    closeThemeSelector,
  } = useTheme();
  const { character } = useAuth();
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  const isOpen = propIsOpen !== undefined ? propIsOpen : isThemeSelectorOpen;
  const handleClose = propOnClose || closeThemeSelector;

  const userLevel = character?.level || 1;

  const handleSelect = async (theme: ThemeDefinition) => {
    if (userLevel < theme.requiredLevel) {
      audioEngine.playHit();
      setLockedNotice(
        `🔒 ${theme.name} is locked! Requires Character Level ${theme.requiredLevel}. You are Level ${userLevel}. Complete more quests to unlock this realm!`
      );
      setTimeout(() => setLockedNotice(null), 4000);
      return;
    }

    audioEngine.playLevelUp();
    await setThemeId(theme.id, userLevel, true);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-4xl bg-[var(--rpg-surface)] border border-[var(--rpg-border)] rounded-2xl p-5 sm:p-7 shadow-[var(--rpg-glow-lg)] overflow-hidden my-auto max-h-[90vh] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="theme-matrix-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--rpg-border)] mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--rpg-primary)]/15 border border-[var(--rpg-primary)]/30 text-[var(--rpg-primary)]">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 id="theme-matrix-title" className="text-xl sm:text-2xl font-heading font-black text-[var(--rpg-text)] tracking-wide">
                  Visual Theme Matrix
                </h2>
                <p className="text-xs sm:text-sm text-[var(--rpg-muted)]">
                  Six immersive realms with level-locked progression • Current Hero Level: <span className="font-bold text-[var(--rpg-primary)]">Lvl {userLevel}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-[var(--rpg-muted)] hover:text-[var(--rpg-text)] hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--rpg-primary)]"
              aria-label="Close Theme Matrix"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Locked Notice Alert */}
          {lockedNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{lockedNotice}</span>
            </motion.div>
          )}

          {/* Theme Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-1">
            {availableThemes.map((t) => {
              const isSelected = currentThemeId === t.id;
              const isUnlocked = userLevel >= t.requiredLevel;
              const IconComponent = THEME_ICONS[t.icon] || Palette;
              const progressPct = Math.min(100, Math.round((userLevel / t.requiredLevel) * 100));

              return (
                <div
                  key={t.id}
                  onClick={() => handleSelect(t)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(t);
                    }
                  }}
                  className={`relative text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group ${
                    isSelected
                      ? 'border-[var(--rpg-primary)] ring-2 ring-[var(--rpg-primary)]/50 bg-[var(--rpg-primary)]/10 shadow-[var(--rpg-glow)]'
                      : isUnlocked
                      ? 'border-[var(--rpg-border)] hover:border-[var(--rpg-primary)]/60 bg-black/20 hover:bg-black/40'
                      : 'border-neutral-800 bg-neutral-950/60 opacity-75 hover:opacity-90'
                  }`}
                >
                  {/* Top Bar */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-white/10 text-white/90">
                        {t.code}
                      </span>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--rpg-primary)] bg-[var(--rpg-primary)]/20 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      ) : isUnlocked ? (
                        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Unlocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3" /> Lvl {t.requiredLevel}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 mt-1">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${t.colors.primary}25`, color: t.colors.primary }}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-heading font-black text-sm text-[var(--rpg-text)] leading-tight">
                          {t.name}
                        </h3>
                        <p className="text-[11px] text-[var(--rpg-muted)] line-clamp-1">
                          {t.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="mt-3 space-y-1">
                      {t.preview?.features?.slice(0, 2).map((feat, i) => (
                        <div key={i} className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-[var(--rpg-primary)]/60" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Palette and Lock Status */}
                  <div className="mt-4 pt-3 border-t border-[var(--rpg-border)]/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="w-3.5 h-3.5 rounded-full border border-black/30" style={{ backgroundColor: t.colors.primary }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-black/30" style={{ backgroundColor: t.colors.secondary }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-black/30" style={{ backgroundColor: t.colors.accent }} />
                      </div>

                      {!isUnlocked ? (
                        <div className="text-right">
                          <span className="text-[10px] text-amber-400 font-bold block">
                            🔒 Reach Lvl {t.requiredLevel}
                          </span>
                          <div className="w-16 h-1.5 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[var(--rpg-muted)] font-mono">
                          {t.hero?.class || 'Hero'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-5 pt-3 border-t border-[var(--rpg-border)] flex items-center justify-between text-xs text-[var(--rpg-muted)]">
            <span>Theme applies instantly across all views, audio tracks, and hero rigs.</span>
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg bg-[var(--rpg-primary)] text-black font-bold hover:brightness-110 transition-all"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
