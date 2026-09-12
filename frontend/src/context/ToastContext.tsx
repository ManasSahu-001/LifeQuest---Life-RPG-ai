import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  Zap,
  Coins,
  Crown,
  X,
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'reward' | 'levelup';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  xp?: number;
  gold?: number;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  reward: (xp: number, gold: number, message?: string) => void;
  levelUp: (newLevel: number, heroTitle?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: ToastItem = { ...toast, id };

      setToasts((prev) => [...prev.slice(-4), newToast]); // Keep max 5 visible

      const duration = toast.duration ?? (toast.type === 'levelup' ? 6000 : 4500);
      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const success = useCallback(
    (message: string, title?: string) => {
      showToast({ type: 'success', message, title: title || 'Action Complete' });
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, title?: string) => {
      showToast({ type: 'error', message, title: title || 'Attention' });
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, title?: string) => {
      showToast({ type: 'info', message, title: title || 'Notice' });
    },
    [showToast]
  );

  const reward = useCallback(
    (xp: number, gold: number, message?: string) => {
      showToast({
        type: 'reward',
        title: 'Quest Rewards Claimed',
        message: message || `Earned rewards for conquering tasks!`,
        xp,
        gold,
      });
    },
    [showToast]
  );

  const levelUp = useCallback(
    (newLevel: number, heroTitle?: string) => {
      showToast({
        type: 'levelup',
        title: 'LEVEL UP!',
        message: `Ascended to Level ${newLevel}${heroTitle ? ` — ${heroTitle}` : ''}! New realms and district buildings unlocked!`,
        duration: 7000,
      });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ showToast, success, error, info, reward, levelUp, dismiss }}
    >
      {children}
      {/* Toast Container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto rounded-[var(--rpg-radius)] bg-[var(--rpg-surface)] border border-[var(--rpg-border)] shadow-[var(--rpg-glow)] p-3.5 flex items-start gap-3 backdrop-blur-lg overflow-hidden relative"
              style={{
                borderColor:
                  toast.type === 'error'
                    ? 'rgba(239, 68, 68, 0.5)'
                    : toast.type === 'levelup'
                    ? 'rgba(245, 158, 11, 0.7)'
                    : toast.type === 'reward'
                    ? 'rgba(6, 182, 212, 0.6)'
                    : undefined,
              }}
            >
              {/* Type Accent Glow */}
              <div
                className={`absolute top-0 left-0 bottom-0 w-1 ${
                  toast.type === 'error'
                    ? 'bg-red-500'
                    : toast.type === 'success'
                    ? 'bg-emerald-400'
                    : toast.type === 'levelup'
                    ? 'bg-gradient-to-b from-amber-400 to-yellow-500'
                    : toast.type === 'reward'
                    ? 'bg-gradient-to-b from-cyan-400 to-blue-500'
                    : 'bg-[var(--rpg-primary)]'
                }`}
              />

              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === 'success' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
                {toast.type === 'error' && (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                )}
                {toast.type === 'info' && (
                  <Info className="w-5 h-5 text-[var(--rpg-primary)]" />
                )}
                {toast.type === 'reward' && (
                  <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
                )}
                {toast.type === 'levelup' && (
                  <Crown className="w-5 h-5 text-amber-400 animate-bounce" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-2">
                {toast.title && (
                  <h4
                    className={`text-xs font-heading font-black tracking-wide uppercase ${
                      toast.type === 'error'
                        ? 'text-rose-300'
                        : toast.type === 'levelup'
                        ? 'text-amber-300'
                        : toast.type === 'reward'
                        ? 'text-cyan-300'
                        : 'text-[var(--rpg-text)]'
                    }`}
                  >
                    {toast.title}
                  </h4>
                )}
                <p className="text-xs text-[var(--rpg-muted)] font-mono mt-0.5 leading-snug break-words">
                  {toast.message}
                </p>

                {/* Reward Badges if reward type */}
                {toast.type === 'reward' && (toast.xp || toast.gold) && (
                  <div className="flex items-center gap-2 mt-2 font-mono text-[11px]">
                    {toast.xp && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800 text-cyan-300 font-bold">
                        <Zap className="w-3 h-3 text-cyan-400" /> +{toast.xp} XP
                      </span>
                    )}
                    {toast.gold && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800 text-amber-300 font-bold">
                        <Coins className="w-3 h-3 text-amber-400" /> +{toast.gold} Gold
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={() => dismiss(toast.id)}
                className="flex-shrink-0 text-[var(--rpg-muted)] hover:text-[var(--rpg-text)] p-0.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--rpg-primary)]"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
