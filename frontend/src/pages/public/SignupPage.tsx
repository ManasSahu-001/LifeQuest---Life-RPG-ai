import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, User, ArrowRight, AlertCircle, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { Button } from '../../components/shared/Button.js';

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const { availableThemes } = useTheme();
  const navigate = useNavigate();

  const [characterName, setCharacterName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('theme-a');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, password, characterName || 'Hero', selectedTheme);
      navigate('/app', { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Account creation failed. Please check your inputs.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 p-8 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-[var(--rpg-glow-lg)]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] border border-[var(--rpg-primary)] flex items-center justify-center mx-auto mb-4 text-[var(--rpg-primary)] shadow-[var(--rpg-glow)]">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-heading font-black text-[var(--rpg-text)]">
            Forge Your Adventurer
          </h2>
          <p className="mt-1 text-xs text-[var(--rpg-muted)] font-mono">
            Create your account and embark on your productivity RPG
          </p>
        </div>

        {error && (
          <div className="p-3 rounded text-xs font-mono bg-red-950/50 border border-red-500/50 text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--rpg-muted)] mb-1">
                Hero Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--rpg-muted)]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="e.g. CyberRonin or Lady Evelyn"
                  className="block w-full pl-10 pr-3 py-2 border border-[var(--rpg-border)] rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] text-sm text-[var(--rpg-text)] placeholder-[var(--rpg-muted)] focus:outline-none focus:border-[var(--rpg-primary)] focus:ring-1 focus:ring-[var(--rpg-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[var(--rpg-muted)] mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--rpg-muted)]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hero@lifequest.io"
                  className="block w-full pl-10 pr-3 py-2 border border-[var(--rpg-border)] rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] text-sm text-[var(--rpg-text)] placeholder-[var(--rpg-muted)] focus:outline-none focus:border-[var(--rpg-primary)] focus:ring-1 focus:ring-[var(--rpg-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[var(--rpg-muted)] mb-1">
                Secret Password (min 6 chars)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--rpg-muted)]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2 border border-[var(--rpg-border)] rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] text-sm text-[var(--rpg-text)] placeholder-[var(--rpg-muted)] focus:outline-none focus:border-[var(--rpg-primary)] focus:ring-1 focus:ring-[var(--rpg-primary)]"
                />
              </div>
            </div>

            {/* Initial Theme Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--rpg-muted)] mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[var(--rpg-primary)]" />
                Select Visual Identity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableThemes.map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id)}
                    className={`p-2.5 rounded-[var(--rpg-radius)] border text-left transition-all ${
                      selectedTheme === t.id
                        ? 'border-[var(--rpg-primary)] bg-[var(--rpg-primary)]/10 shadow-sm'
                        : 'border-[var(--rpg-border)] bg-[var(--rpg-bg)] hover:border-[var(--rpg-muted)]'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-[var(--rpg-text)] truncate">
                      {t.name}
                    </div>
                    <div className="text-[9px] font-mono text-[var(--rpg-muted)] truncate">
                      {t.badge}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-bold"
            isLoading={isLoading}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Create Character & Begin
          </Button>

          <div className="text-center text-xs text-[var(--rpg-muted)]">
            Already registered?{' '}
            <Link to="/login" className="text-[var(--rpg-primary)] hover:underline font-semibold">
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
