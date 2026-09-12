import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { Navbar } from '../shared/Navbar.js';
import { Shield } from 'lucide-react';

export const GameLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--rpg-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border-2 border-[var(--rpg-primary)] flex items-center justify-center animate-spin">
            <Shield className="w-6 h-6 text-[var(--rpg-primary)]" />
          </div>
          <p className="font-mono text-xs tracking-widest text-[var(--rpg-primary)] animate-pulse uppercase">
            Loading LifeQuest Engine...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--rpg-bg)] text-[var(--rpg-text)] relative selection:bg-[var(--rpg-primary)] selection:text-black">
      {/* Theme specific visual overlay */}
      <div className="theme-overlay fixed inset-0 z-0 pointer-events-none" />

      {/* Main Navbar */}
      <Navbar />

      {/* Authenticated Game Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10 relative">
        <Outlet />
      </main>
    </div>
  );
};
