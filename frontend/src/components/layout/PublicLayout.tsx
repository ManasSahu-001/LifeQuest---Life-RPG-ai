import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../shared/Navbar.js';
import { Shield, Sparkles } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--rpg-bg)] text-[var(--rpg-text)] relative selection:bg-[var(--rpg-primary)] selection:text-black">
      {/* Theme visual overlay */}
      <div className="theme-overlay fixed inset-0 z-0 pointer-events-none" />

      {/* Semantic Header & Navigation */}
      <Navbar />

      {/* Main Semantic Landmark */}
      <main className="flex-1 z-10 relative">
        <Outlet />
      </main>

      {/* Semantic Footer with SEO Links */}
      <footer className="border-t border-[var(--rpg-border)] bg-[var(--rpg-surface)]/60 backdrop-blur py-12 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] border border-[var(--rpg-primary)] flex items-center justify-center text-[var(--rpg-primary)]">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="font-heading font-bold text-lg">
                  LIFE<span className="text-[var(--rpg-primary)]">RPG</span>
                </span>
              </div>
              <p className="text-xs text-[var(--rpg-muted)] max-w-sm leading-relaxed mb-4">
                The premier gamified productivity RPG and habit tracking game. Turn your real-life daily goals, habits, and coding projects into an epic adventure. Build your virtual city, level up attributes, defeat world bosses, and forge an unstoppable streak.
              </p>
              <div className="text-[11px] font-mono text-[var(--rpg-muted)]">
                Gamified Productivity App • RPG Task Manager • Habit Tracker Game
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--rpg-text)] mb-3">
                Explore Game
              </h4>
              <ul className="space-y-2 text-xs text-[var(--rpg-muted)]">
                <li>
                  <Link to="/features" className="hover:text-[var(--rpg-primary)] transition-colors">
                    RPG Features & Attributes
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="hover:text-[var(--rpg-primary)] transition-colors">
                    How The Game Works
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[var(--rpg-primary)] transition-colors">
                    About The Life RPG Engine
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-[var(--rpg-primary)] transition-colors">
                    Frequently Asked Questions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--rpg-text)] mb-3">
                Begin Journey
              </h4>
              <ul className="space-y-2 text-xs text-[var(--rpg-muted)]">
                <li>
                  <Link to="/signup" className="hover:text-[var(--rpg-primary)] transition-colors">
                    Create Adventurer Account
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-[var(--rpg-primary)] transition-colors">
                    Adventurer Portal Login
                  </Link>
                </li>
                <li>
                  <a
                    href="https://schema.org/SoftwareApplication"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--rpg-primary)] transition-colors"
                  >
                    Schema.org Specification
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--rpg-border)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--rpg-muted)] gap-4">
            <div>
              © 2026 Life RPG Project. All rights reserved. Server-Authoritative Progression Architecture.
            </div>
            <div className="flex items-center gap-1 font-mono text-[11px] text-[var(--rpg-primary)]">
              <Sparkles className="w-3.5 h-3.5" />
              Empowering High-Agency Creators Everywhere
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
