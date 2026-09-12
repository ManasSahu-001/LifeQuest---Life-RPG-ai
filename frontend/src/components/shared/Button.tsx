import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext.js';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const { currentThemeId } = useTheme();

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 font-semibold',
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        if (currentThemeId === 'theme-a') {
          return 'bg-[#00f0ff] text-black font-mono font-bold hover:bg-[#33f3ff] shadow-[0_0_15px_rgba(0,240,255,0.4)] border border-[#00f0ff]';
        } else if (currentThemeId === 'theme-b') {
          return 'bg-[#d4af37] text-[#12100e] font-serif font-bold hover:bg-[#e6c35c] shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-[#f0c048]';
        } else {
          return 'bg-[#10b981] text-[#08140f] font-semibold hover:bg-[#34d399] shadow-[0_0_18px_rgba(16,185,129,0.35)] border border-[#34d399]';
        }
      case 'secondary':
        if (currentThemeId === 'theme-a') {
          return 'bg-[#ff007f] text-white font-mono hover:bg-[#ff3399] shadow-[0_0_15px_rgba(255,0,127,0.4)]';
        } else if (currentThemeId === 'theme-b') {
          return 'bg-[#8b1e1e] text-[#f5ecd7] font-serif hover:bg-[#a32828] border border-[#d4af3740]';
        } else {
          return 'bg-[#f59e0b] text-[#08140f] font-medium hover:bg-[#fbbf24] shadow-[0_0_15px_rgba(245,158,11,0.3)]';
        }
      case 'gold':
        return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 font-bold hover:brightness-110 shadow-md';
      case 'danger':
        return 'bg-red-600/80 text-white hover:bg-red-500 border border-red-500/40';
      case 'outline':
      default:
        return 'bg-transparent text-[var(--rpg-text)] border border-[var(--rpg-border)] hover:bg-[var(--rpg-surface-hover)]';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center rounded-[var(--rpg-radius)] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rpg-primary)] ${sizeClasses[size]} ${getVariantStyles()} ${className}`}
      {...props as any}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};
