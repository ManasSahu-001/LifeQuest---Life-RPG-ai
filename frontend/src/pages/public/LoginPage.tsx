import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { Button } from '../../components/shared/Button.js';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/app';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Invalid credentials or connection error. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-[var(--rpg-glow-lg)]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] border border-[var(--rpg-primary)] flex items-center justify-center mx-auto mb-4 text-[var(--rpg-primary)] shadow-[var(--rpg-glow)]">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-heading font-black text-[var(--rpg-text)]">
            Adventurer Login
          </h2>
          <p className="mt-1 text-xs text-[var(--rpg-muted)] font-mono">
            Enter your credentials to resume your journey
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
                Secret Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--rpg-muted)]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2 border border-[var(--rpg-border)] rounded-[var(--rpg-radius)] bg-[var(--rpg-bg)] text-sm text-[var(--rpg-text)] placeholder-[var(--rpg-muted)] focus:outline-none focus:border-[var(--rpg-primary)] focus:ring-1 focus:ring-[var(--rpg-primary)]"
                />
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
            Enter Game World
          </Button>

          <div className="text-center text-xs text-[var(--rpg-muted)]">
            Don't have an adventurer profile?{' '}
            <Link to="/signup" className="text-[var(--rpg-primary)] hover:underline font-semibold">
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
