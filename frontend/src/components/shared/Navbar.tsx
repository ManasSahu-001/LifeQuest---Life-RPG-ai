import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Coins,
  Shield,
  Palette,
  Menu,
  X,
  Compass,
  CheckSquare,
  Building2,
  Swords,
  Award,
  Package,
  LogOut,
  User as UserIcon,
  Music,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { audioEngine } from '../../services/audioEngine.js';
import { Button } from './Button.js';

export const Navbar: React.FC = () => {
  const { user, character, isAuthenticated, logout } = useAuth();
  const { currentThemeId, setThemeId, availableThemes } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [isBgmActive, setIsBgmActive] = useState(() => audioEngine.getIsBgmPlaying());
  const [isMuted, setIsMuted] = useState(() => audioEngine.getIsMuted());
  const location = useLocation();
  const navigate = useNavigate();

  const handleToggleBgm = () => {
    const active = audioEngine.toggleBGM(currentThemeId);
    setIsBgmActive(active);
  };

  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = isAuthenticated
    ? [
        { path: '/app', label: 'Dashboard', icon: Compass },
        { path: '/app/quests', label: 'Quests', icon: CheckSquare },
        { path: '/app/city', label: 'Virtual City', icon: Building2 },
        { path: '/app/character', label: 'Character', icon: UserIcon },
        { path: '/app/boss', label: 'World Boss', icon: Swords },
        { path: '/app/inventory', label: 'Shop', icon: Package },
        { path: '/app/achievements', label: 'Achievements', icon: Award },
      ]
    : [
        { path: '/', label: 'Home' },
        { path: '/features', label: 'Features' },
        { path: '/how-it-works', label: 'How It Works' },
        { path: '/about', label: 'About' },
        { path: '/faq', label: 'FAQ' },
      ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--rpg-border)] bg-[var(--rpg-bg)]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <Link to={isAuthenticated ? '/app' : '/'} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-primary)] flex items-center justify-center shadow-[var(--rpg-glow)] transition-transform group-hover:scale-105">
                <Shield className="w-6 h-6 text-[var(--rpg-primary)]" />
              </div>
              <div>
                <span className="text-lg font-heading font-black tracking-wider text-[var(--rpg-text)] group-hover:text-[var(--rpg-primary)] transition-colors">
                  LIFE<span className="text-[var(--rpg-primary)]">RPG</span>
                </span>
                <span className="hidden sm:block text-[10px] text-[var(--rpg-muted)] tracking-widest uppercase font-mono">
                  City Builder
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = 'icon' in link ? link.icon : null;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-[var(--rpg-radius)] text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[var(--rpg-surface)] text-[var(--rpg-primary)] border border-[var(--rpg-border)] shadow-sm'
                      : 'text-[var(--rpg-muted)] hover:text-[var(--rpg-text)] hover:bg-[var(--rpg-surface-hover)]'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Authenticated RPG Stat Badges */}
            {isAuthenticated && character && (
              <div className="hidden lg:flex items-center gap-3 bg-[var(--rpg-surface)]/80 border border-[var(--rpg-border)] px-3 py-1.5 rounded-[var(--rpg-radius)]">
                {/* Level */}
                <div className="flex items-center gap-1 text-xs font-mono font-bold text-[var(--rpg-text)]">
                  <span className="text-[var(--rpg-muted)]">LVL</span>
                  <span className="text-[var(--rpg-primary)]">{character.level}</span>
                </div>

                <div className="w-[1px] h-4 bg-[var(--rpg-border)]" />

                {/* Streak */}
                <div
                  className="flex items-center gap-1 text-xs font-mono font-bold text-orange-400"
                  title={`${character.streak_count} Day Streak!`}
                >
                  <Flame className="w-4 h-4 fill-orange-400 animate-pulse" />
                  <span>{character.streak_count}d</span>
                </div>

                <div className="w-[1px] h-4 bg-[var(--rpg-border)]" />

                {/* Gold */}
                <div
                  className="flex items-center gap-1 text-xs font-mono font-bold text-amber-300"
                  title={`${character.gold} Gold`}
                >
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>{character.gold}</span>
                </div>
              </div>
            )}

            {/* Theme-Adaptive Audio Controls */}
            <div className="flex items-center gap-1.5 bg-[var(--rpg-surface)] border border-[var(--rpg-border)] p-1 rounded-[var(--rpg-radius)]">
              {/* BGM Toggle */}
              <button
                onClick={handleToggleBgm}
                className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-all ${
                  isBgmActive
                    ? 'bg-[var(--rpg-primary)]/20 text-[var(--rpg-primary)] border border-[var(--rpg-primary)]/50 shadow-[0_0_8px_var(--rpg-card-glow)]'
                    : 'text-[var(--rpg-muted)] hover:text-[var(--rpg-text)]'
                }`}
                title={isBgmActive ? 'Ambient BGM: Playing (Click to Pause)' : 'Ambient BGM: Paused (Click to Play)'}
                aria-label="Toggle ambient theme music"
              >
                <Music className={`w-3.5 h-3.5 ${isBgmActive ? 'animate-bounce' : ''}`} />
                <span className="hidden sm:inline text-[11px] font-bold">
                  {isBgmActive ? 'BGM ON' : 'BGM'}
                </span>
                {isBgmActive && (
                  <span className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-2 bg-[var(--rpg-primary)] animate-pulse" />
                    <span className="w-0.5 h-3 bg-[var(--rpg-primary)] animate-pulse delay-75" />
                    <span className="w-0.5 h-1.5 bg-[var(--rpg-primary)] animate-pulse delay-150" />
                  </span>
                )}
              </button>

              {/* Master Audio Mute Toggle */}
              <button
                onClick={handleToggleMute}
                className={`p-1 rounded text-xs transition-colors ${
                  isMuted ? 'text-red-400' : 'text-[var(--rpg-muted)] hover:text-[var(--rpg-text)]'
                }`}
                title={isMuted ? 'Unmute All Audio' : 'Mute All Audio'}
                aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Theme Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="p-2 rounded-[var(--rpg-radius)] border border-[var(--rpg-border)] bg-[var(--rpg-surface)] text-[var(--rpg-text)] hover:border-[var(--rpg-primary)] hover:shadow-[var(--rpg-glow)] transition-all flex items-center gap-1.5 text-xs font-mono"
                title="Change Theme"
                aria-label="Change Theme"
              >
                <Palette className="w-4 h-4 text-[var(--rpg-primary)]" />
                <span className="hidden sm:inline uppercase">{currentThemeId}</span>
              </button>

              <AnimatePresence>
                {themeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-56 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-xl py-2 z-50"
                  >
                    <div className="px-3 py-1.5 text-xs font-mono uppercase text-[var(--rpg-muted)] border-b border-[var(--rpg-border)] mb-1">
                      Choose Theme
                    </div>
                    {availableThemes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setThemeId(t.id);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                          currentThemeId === t.id
                            ? 'bg-[var(--rpg-primary)]/15 text-[var(--rpg-primary)] font-bold'
                            : 'text-[var(--rpg-text)] hover:bg-[var(--rpg-surface-hover)]'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{t.name}</div>
                          <div className="text-[10px] text-[var(--rpg-muted)]">{t.badge}</div>
                        </div>
                        {currentThemeId === t.id && (
                          <div className="w-2 h-2 rounded-full bg-[var(--rpg-primary)] shadow-[0_0_6px_var(--rpg-primary)]" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="p-2 rounded-[var(--rpg-radius)] border border-[var(--rpg-border)] text-[var(--rpg-muted)] hover:text-red-400 hover:border-red-400/50 transition-colors"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Start Adventure
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-[var(--rpg-radius)] border border-[var(--rpg-border)] text-[var(--rpg-text)]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-[var(--rpg-border)] bg-[var(--rpg-bg)] px-4 pt-2 pb-4 space-y-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded text-sm text-[var(--rpg-text)] hover:bg-[var(--rpg-surface)]"
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-3 flex gap-2">
                <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
